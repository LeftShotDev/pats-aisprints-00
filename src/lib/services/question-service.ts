import "server-only";
import {
  executeQuery,
  executeQueryFirst,
  executeBatch,
  generateId,
} from "@/lib/d1-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionRow {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  body: string;
  is_archived: number;
  created_at: string;
  updated_at: string;
}

interface AnswerChoiceRow {
  id: string;
  question_id: string;
  text: string;
  is_correct: number;
  sort_order: number;
  created_at: string;
}

export interface AnswerChoice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  sort_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  body: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  answer_choices: AnswerChoice[];
}

export interface AnswerChoiceInput {
  text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface CreateQuestionParams {
  teacherId: string;
  title: string;
  description?: string | null;
  body: string;
  answerChoices: AnswerChoiceInput[];
}

export interface UpdateQuestionParams {
  title: string;
  description?: string | null;
  body: string;
  answerChoices: AnswerChoiceInput[];
}

export interface ListQuestionsParams {
  teacherId: string;
  archived?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListQuestionsResult {
  questions: Question[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export class QuestionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionValidationError";
  }
}

export class QuestionNotFoundError extends Error {
  constructor() {
    super("Question not found");
    this.name = "QuestionNotFoundError";
  }
}

export class QuestionOwnershipError extends Error {
  constructor() {
    super("Question does not belong to this teacher");
    this.name = "QuestionOwnershipError";
  }
}

function validateAnswerChoices(answerChoices: AnswerChoiceInput[]): void {
  if (answerChoices.length < 2) {
    throw new QuestionValidationError("A question must have at least 2 answer choices");
  }
  if (answerChoices.length > 6) {
    throw new QuestionValidationError("A question cannot have more than 6 answer choices");
  }
  const correctCount = answerChoices.filter((c) => c.is_correct).length;
  if (correctCount === 0) {
    throw new QuestionValidationError("Exactly one answer choice must be marked correct");
  }
  if (correctCount > 1) {
    throw new QuestionValidationError("Only one answer choice can be marked correct");
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toAnswerChoice(row: AnswerChoiceRow): AnswerChoice {
  return {
    id: row.id,
    question_id: row.question_id,
    text: row.text,
    is_correct: row.is_correct === 1,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function toQuestion(row: QuestionRow, answerChoices: AnswerChoice[]): Question {
  return {
    id: row.id,
    teacher_id: row.teacher_id,
    title: row.title,
    description: row.description,
    body: row.body,
    is_archived: row.is_archived === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
    answer_choices: answerChoices,
  };
}

async function getAnswerChoicesForQuestions(
  questionIds: string[]
): Promise<AnswerChoiceRow[]> {
  if (questionIds.length === 0) return [];
  const placeholders = questionIds.map(() => "?").join(", ");
  return executeQuery<AnswerChoiceRow>(
    `SELECT id, question_id, text, is_correct, sort_order, created_at
     FROM answer_choices
     WHERE question_id IN (${placeholders})
     ORDER BY question_id, sort_order ASC`,
    questionIds
  );
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function listQuestions(
  params: ListQuestionsParams
): Promise<ListQuestionsResult> {
  const {
    teacherId,
    archived = false,
    search,
    page = 1,
    pageSize = 25,
  } = params;

  const allowedPageSizes = [25, 50, 100];
  const normalizedPageSize = allowedPageSizes.includes(pageSize) ? pageSize : 25;
  const normalizedPage = Math.max(1, page);
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const isArchivedValue = archived ? 1 : 0;

  let whereClause = "WHERE q.teacher_id = ? AND q.is_archived = ?";
  const baseParams: (string | number)[] = [teacherId, isArchivedValue];

  if (search && search.trim()) {
    const keyword = `%${search.trim()}%`;
    whereClause +=
      " AND (q.title LIKE ? OR q.description LIKE ? OR q.body LIKE ?)";
    baseParams.push(keyword, keyword, keyword);
  }

  const countResult = await executeQueryFirst<{ total: number }>(
    `SELECT COUNT(*) as total FROM questions q ${whereClause}`,
    baseParams
  );
  const total = countResult?.total ?? 0;
  const totalPages = Math.ceil(total / normalizedPageSize);

  const questionRows = await executeQuery<QuestionRow>(
    `SELECT q.id, q.teacher_id, q.title, q.description, q.body, q.is_archived, q.created_at, q.updated_at
     FROM questions q
     ${whereClause}
     ORDER BY q.created_at DESC
     LIMIT ? OFFSET ?`,
    [...baseParams, normalizedPageSize, offset]
  );

  const questionIds = questionRows.map((r) => r.id);
  const allChoiceRows = await getAnswerChoicesForQuestions(questionIds);

  const choicesByQuestion = allChoiceRows.reduce<Record<string, AnswerChoiceRow[]>>(
    (acc, row) => {
      if (!acc[row.question_id]) acc[row.question_id] = [];
      acc[row.question_id].push(row);
      return acc;
    },
    {}
  );

  const questions = questionRows.map((row) =>
    toQuestion(row, (choicesByQuestion[row.id] ?? []).map(toAnswerChoice))
  );

  return {
    questions,
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total,
      totalPages,
    },
  };
}

export async function getQuestion(
  questionId: string,
  teacherId: string
): Promise<Question> {
  const row = await executeQueryFirst<QuestionRow>(
    `SELECT id, teacher_id, title, description, body, is_archived, created_at, updated_at
     FROM questions
     WHERE id = ?`,
    [questionId]
  );

  if (!row) throw new QuestionNotFoundError();
  if (row.teacher_id !== teacherId) throw new QuestionOwnershipError();

  const choiceRows = await executeQuery<AnswerChoiceRow>(
    `SELECT id, question_id, text, is_correct, sort_order, created_at
     FROM answer_choices
     WHERE question_id = ?
     ORDER BY sort_order ASC`,
    [questionId]
  );

  return toQuestion(row, choiceRows.map(toAnswerChoice));
}

export async function createQuestion(
  params: CreateQuestionParams
): Promise<Question> {
  const { teacherId, title, description = null, body, answerChoices } = params;

  validateAnswerChoices(answerChoices);

  const questionId = generateId();
  const now = new Date().toISOString();

  const statements: { sql: string; params: (string | number | null)[] }[] = [
    {
      sql: `INSERT INTO questions (id, teacher_id, title, description, body, is_archived, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      params: [questionId, teacherId, title.trim(), description, body.trim(), now, now],
    },
    ...answerChoices.map((choice) => ({
      sql: `INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        generateId(),
        questionId,
        choice.text.trim(),
        choice.is_correct ? 1 : 0,
        choice.sort_order,
        now,
      ],
    })),
  ];

  await executeBatch(statements);

  return getQuestion(questionId, teacherId);
}

export async function updateQuestion(
  questionId: string,
  teacherId: string,
  params: UpdateQuestionParams
): Promise<Question> {
  const { title, description = null, body, answerChoices } = params;

  validateAnswerChoices(answerChoices);

  const existing = await executeQueryFirst<QuestionRow>(
    `SELECT id, teacher_id FROM questions WHERE id = ?`,
    [questionId]
  );

  if (!existing) throw new QuestionNotFoundError();
  if (existing.teacher_id !== teacherId) throw new QuestionOwnershipError();

  const now = new Date().toISOString();

  const statements: { sql: string; params: (string | number | null)[] }[] = [
    {
      sql: `UPDATE questions SET title = ?, description = ?, body = ?, updated_at = ? WHERE id = ?`,
      params: [title.trim(), description, body.trim(), now, questionId],
    },
    {
      sql: `DELETE FROM answer_choices WHERE question_id = ?`,
      params: [questionId],
    },
    ...answerChoices.map((choice) => ({
      sql: `INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        generateId(),
        questionId,
        choice.text.trim(),
        choice.is_correct ? 1 : 0,
        choice.sort_order,
        now,
      ],
    })),
  ];

  await executeBatch(statements);

  return getQuestion(questionId, teacherId);
}

export async function archiveQuestion(
  questionId: string,
  teacherId: string
): Promise<void> {
  const existing = await executeQueryFirst<QuestionRow>(
    `SELECT id, teacher_id, is_archived FROM questions WHERE id = ?`,
    [questionId]
  );

  if (!existing) throw new QuestionNotFoundError();
  if (existing.teacher_id !== teacherId) throw new QuestionOwnershipError();

  await executeBatch([
    {
      sql: `UPDATE questions SET is_archived = 1, updated_at = ? WHERE id = ?`,
      params: [new Date().toISOString(), questionId],
    },
  ]);
}

export async function unarchiveQuestion(
  questionId: string,
  teacherId: string
): Promise<void> {
  const existing = await executeQueryFirst<QuestionRow>(
    `SELECT id, teacher_id FROM questions WHERE id = ?`,
    [questionId]
  );

  if (!existing) throw new QuestionNotFoundError();
  if (existing.teacher_id !== teacherId) throw new QuestionOwnershipError();

  await executeBatch([
    {
      sql: `UPDATE questions SET is_archived = 0, updated_at = ? WHERE id = ?`,
      params: [new Date().toISOString(), questionId],
    },
  ]);
}
