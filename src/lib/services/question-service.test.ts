import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  archiveQuestion,
  unarchiveQuestion,
  QuestionValidationError,
  QuestionNotFoundError,
  QuestionOwnershipError,
} from "./question-service";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/d1-client", () => ({
  executeQuery: vi.fn(),
  executeQueryFirst: vi.fn(),
  executeMutation: vi.fn(),
  executeBatch: vi.fn(),
  generateId: vi.fn(() => "mock-id-123"),
  getDatabase: vi.fn(),
}));

import {
  executeQuery,
  executeQueryFirst,
  executeBatch,
  generateId,
} from "@/lib/d1-client";

const mockExecuteQuery = vi.mocked(executeQuery);
const mockExecuteQueryFirst = vi.mocked(executeQueryFirst);
const mockExecuteBatch = vi.mocked(executeBatch);
const mockGenerateId = vi.mocked(generateId);

const TEACHER_ID = "teacher-1";
const OTHER_TEACHER_ID = "teacher-2";
const QUESTION_ID = "question-1";

const mockQuestionRow = {
  id: QUESTION_ID,
  teacher_id: TEACHER_ID,
  title: "Sample Question",
  description: "A description",
  body: "What is 2 + 2?",
  is_archived: 0,
  created_at: "2026-04-08T10:00:00.000Z",
  updated_at: "2026-04-08T10:00:00.000Z",
};

const mockChoiceRows = [
  { id: "c1", question_id: QUESTION_ID, text: "3", is_correct: 0, sort_order: 0, created_at: "2026-04-08T10:00:00.000Z" },
  { id: "c2", question_id: QUESTION_ID, text: "4", is_correct: 1, sort_order: 1, created_at: "2026-04-08T10:00:00.000Z" },
];

const validChoiceInputs = [
  { text: "3", is_correct: false, sort_order: 0 },
  { text: "4", is_correct: true, sort_order: 1 },
];

beforeEach(() => {
  vi.resetAllMocks();
  mockGenerateId.mockReturnValue("mock-id-123");
  mockExecuteQuery.mockResolvedValue([]);
  mockExecuteQueryFirst.mockResolvedValue(null);
  mockExecuteBatch.mockResolvedValue([]);
});

// ---------------------------------------------------------------------------
// listQuestions
// ---------------------------------------------------------------------------

describe("listQuestions", () => {
  it("returns paginated questions with answer choices", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 1 });
    mockExecuteQuery
      .mockResolvedValueOnce([mockQuestionRow])
      .mockResolvedValueOnce(mockChoiceRows);

    const result = await listQuestions({ teacherId: TEACHER_ID });

    expect(result.questions).toHaveLength(1);
    expect(result.questions[0].id).toBe(QUESTION_ID);
    expect(result.questions[0].is_archived).toBe(false);
    expect(result.questions[0].answer_choices).toHaveLength(2);
    expect(result.questions[0].answer_choices[1].is_correct).toBe(true);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.pageSize).toBe(25);
    expect(result.pagination.totalPages).toBe(1);
  });

  it("returns archived questions when archived flag is true", async () => {
    const archivedRow = { ...mockQuestionRow, is_archived: 1 };
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 1 });
    mockExecuteQuery
      .mockResolvedValueOnce([archivedRow])
      .mockResolvedValueOnce(mockChoiceRows);

    const result = await listQuestions({ teacherId: TEACHER_ID, archived: true });

    expect(result.questions[0].is_archived).toBe(true);
  });

  it("applies search filter to query", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 0 });
    mockExecuteQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await listQuestions({ teacherId: TEACHER_ID, search: "addition" });

    const countSql = mockExecuteQueryFirst.mock.calls[0][0] as string;
    expect(countSql).toContain("LIKE");
  });

  it("returns empty questions array when no results", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 0 });
    mockExecuteQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const result = await listQuestions({ teacherId: TEACHER_ID });

    expect(result.questions).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });

  it("normalizes invalid page size to 25", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 0 });
    mockExecuteQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const result = await listQuestions({ teacherId: TEACHER_ID, pageSize: 999 });

    expect(result.pagination.pageSize).toBe(25);
  });

  it("normalizes page below 1 to 1", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({ total: 0 });
    mockExecuteQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const result = await listQuestions({ teacherId: TEACHER_ID, page: -5 });

    expect(result.pagination.page).toBe(1);
  });

  it("accepts valid page sizes of 50 and 100", async () => {
    for (const size of [50, 100]) {
      vi.clearAllMocks();
      mockExecuteQueryFirst.mockResolvedValueOnce({ total: 0 });
      mockExecuteQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      const result = await listQuestions({ teacherId: TEACHER_ID, pageSize: size });
      expect(result.pagination.pageSize).toBe(size);
    }
  });
});

// ---------------------------------------------------------------------------
// getQuestion
// ---------------------------------------------------------------------------

describe("getQuestion", () => {
  it("returns a question with answer choices", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(mockQuestionRow);
    mockExecuteQuery.mockResolvedValueOnce(mockChoiceRows);

    const question = await getQuestion(QUESTION_ID, TEACHER_ID);

    expect(question.id).toBe(QUESTION_ID);
    expect(question.title).toBe("Sample Question");
    expect(question.is_archived).toBe(false);
    expect(question.answer_choices).toHaveLength(2);
  });

  it("converts integer booleans to JS booleans", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(mockQuestionRow);
    mockExecuteQuery.mockResolvedValueOnce(mockChoiceRows);

    const question = await getQuestion(QUESTION_ID, TEACHER_ID);

    expect(question.is_archived).toBe(false);
    expect(question.answer_choices[0].is_correct).toBe(false);
    expect(question.answer_choices[1].is_correct).toBe(true);
  });

  it("throws QuestionNotFoundError when question does not exist", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(null);

    await expect(getQuestion("nonexistent", TEACHER_ID)).rejects.toThrow(
      QuestionNotFoundError
    );
  });

  it("throws QuestionOwnershipError when question belongs to another teacher", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      ...mockQuestionRow,
      teacher_id: OTHER_TEACHER_ID,
    });

    await expect(getQuestion(QUESTION_ID, TEACHER_ID)).rejects.toThrow(
      QuestionOwnershipError
    );
  });
});

// ---------------------------------------------------------------------------
// createQuestion
// ---------------------------------------------------------------------------

describe("createQuestion", () => {
  it("creates a question and returns it with answer choices", async () => {
    mockExecuteBatch.mockResolvedValueOnce([]);
    mockExecuteQueryFirst.mockResolvedValueOnce(mockQuestionRow);
    mockExecuteQuery.mockResolvedValueOnce(mockChoiceRows);

    const question = await createQuestion({
      teacherId: TEACHER_ID,
      title: "Sample Question",
      body: "What is 2 + 2?",
      answerChoices: validChoiceInputs,
    });

    expect(mockExecuteBatch).toHaveBeenCalledOnce();
    expect(question.id).toBe(QUESTION_ID);
    expect(question.answer_choices).toHaveLength(2);
  });

  it("inserts one question row and one row per answer choice in batch", async () => {
    mockExecuteBatch.mockResolvedValueOnce([]);
    mockExecuteQueryFirst.mockResolvedValueOnce(mockQuestionRow);
    mockExecuteQuery.mockResolvedValueOnce(mockChoiceRows);

    await createQuestion({
      teacherId: TEACHER_ID,
      title: "Sample Question",
      body: "What is 2 + 2?",
      answerChoices: validChoiceInputs,
    });

    const batchStatements = mockExecuteBatch.mock.calls[0][0];
    expect(batchStatements).toHaveLength(3); // 1 question + 2 choices
  });

  it("throws QuestionValidationError when fewer than 2 choices provided", async () => {
    await expect(
      createQuestion({
        teacherId: TEACHER_ID,
        title: "Test",
        body: "Body",
        answerChoices: [{ text: "Only one", is_correct: true, sort_order: 0 }],
      })
    ).rejects.toThrow(QuestionValidationError);
  });

  it("throws QuestionValidationError when more than 6 choices provided", async () => {
    const tooManyChoices = Array.from({ length: 7 }, (_, i) => ({
      text: `Choice ${i}`,
      is_correct: i === 0,
      sort_order: i,
    }));

    await expect(
      createQuestion({
        teacherId: TEACHER_ID,
        title: "Test",
        body: "Body",
        answerChoices: tooManyChoices,
      })
    ).rejects.toThrow(QuestionValidationError);
  });

  it("throws QuestionValidationError when no correct answer is marked", async () => {
    await expect(
      createQuestion({
        teacherId: TEACHER_ID,
        title: "Test",
        body: "Body",
        answerChoices: [
          { text: "A", is_correct: false, sort_order: 0 },
          { text: "B", is_correct: false, sort_order: 1 },
        ],
      })
    ).rejects.toThrow(QuestionValidationError);
  });

  it("throws QuestionValidationError when multiple correct answers are marked", async () => {
    await expect(
      createQuestion({
        teacherId: TEACHER_ID,
        title: "Test",
        body: "Body",
        answerChoices: [
          { text: "A", is_correct: true, sort_order: 0 },
          { text: "B", is_correct: true, sort_order: 1 },
        ],
      })
    ).rejects.toThrow(QuestionValidationError);
  });
});

// ---------------------------------------------------------------------------
// updateQuestion
// ---------------------------------------------------------------------------

describe("updateQuestion", () => {
  it("updates the question and replaces answer choices", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: TEACHER_ID,
    });
    mockExecuteBatch.mockResolvedValueOnce([]);
    mockExecuteQueryFirst.mockResolvedValueOnce(mockQuestionRow);
    mockExecuteQuery.mockResolvedValueOnce(mockChoiceRows);

    const question = await updateQuestion(QUESTION_ID, TEACHER_ID, {
      title: "Updated Title",
      body: "Updated body",
      answerChoices: validChoiceInputs,
    });

    expect(mockExecuteBatch).toHaveBeenCalledOnce();
    const batchStatements = mockExecuteBatch.mock.calls[0][0];
    // UPDATE questions + DELETE answer_choices + 2 INSERT answer_choices
    expect(batchStatements).toHaveLength(4);
    expect(question.id).toBe(QUESTION_ID);
  });

  it("throws QuestionNotFoundError when question does not exist", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(null);

    await expect(
      updateQuestion("nonexistent", TEACHER_ID, {
        title: "Title",
        body: "Body",
        answerChoices: validChoiceInputs,
      })
    ).rejects.toThrow(QuestionNotFoundError);
  });

  it("throws QuestionOwnershipError when question belongs to another teacher", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: OTHER_TEACHER_ID,
    });

    await expect(
      updateQuestion(QUESTION_ID, TEACHER_ID, {
        title: "Title",
        body: "Body",
        answerChoices: validChoiceInputs,
      })
    ).rejects.toThrow(QuestionOwnershipError);
  });

  it("throws QuestionValidationError for invalid answer choices", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: TEACHER_ID,
    });

    await expect(
      updateQuestion(QUESTION_ID, TEACHER_ID, {
        title: "Title",
        body: "Body",
        answerChoices: [{ text: "Only one", is_correct: true, sort_order: 0 }],
      })
    ).rejects.toThrow(QuestionValidationError);
  });
});

// ---------------------------------------------------------------------------
// archiveQuestion
// ---------------------------------------------------------------------------

describe("archiveQuestion", () => {
  it("archives a question", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: TEACHER_ID,
      is_archived: 0,
    });
    mockExecuteBatch.mockResolvedValueOnce([]);

    await archiveQuestion(QUESTION_ID, TEACHER_ID);

    const batchStatements = mockExecuteBatch.mock.calls[0][0];
    expect(batchStatements[0].sql).toContain("is_archived = 1");
  });

  it("throws QuestionNotFoundError when question does not exist", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(null);

    await expect(archiveQuestion("nonexistent", TEACHER_ID)).rejects.toThrow(
      QuestionNotFoundError
    );
  });

  it("throws QuestionOwnershipError when question belongs to another teacher", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: OTHER_TEACHER_ID,
      is_archived: 0,
    });

    await expect(archiveQuestion(QUESTION_ID, TEACHER_ID)).rejects.toThrow(
      QuestionOwnershipError
    );
  });
});

// ---------------------------------------------------------------------------
// unarchiveQuestion
// ---------------------------------------------------------------------------

describe("unarchiveQuestion", () => {
  it("unarchives a question", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: TEACHER_ID,
    });
    mockExecuteBatch.mockResolvedValueOnce([]);

    await unarchiveQuestion(QUESTION_ID, TEACHER_ID);

    const batchStatements = mockExecuteBatch.mock.calls[0][0];
    expect(batchStatements[0].sql).toContain("is_archived = 0");
  });

  it("throws QuestionNotFoundError when question does not exist", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce(null);

    await expect(unarchiveQuestion("nonexistent", TEACHER_ID)).rejects.toThrow(
      QuestionNotFoundError
    );
  });

  it("throws QuestionOwnershipError when question belongs to another teacher", async () => {
    mockExecuteQueryFirst.mockResolvedValueOnce({
      id: QUESTION_ID,
      teacher_id: OTHER_TEACHER_ID,
    });

    await expect(unarchiveQuestion(QUESTION_ID, TEACHER_ID)).rejects.toThrow(
      QuestionOwnershipError
    );
  });
});
