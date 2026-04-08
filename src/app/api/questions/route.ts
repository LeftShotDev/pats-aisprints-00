import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import {
  listQuestions,
  createQuestion,
  QuestionValidationError,
} from "@/lib/services/question-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const archived = searchParams.get("archived") === "true";
    const search = searchParams.get("search") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "25", 10);

    const result = await listQuestions({
      teacherId: session.userId,
      archived,
      search,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, body: questionBody, answer_choices } = body as Record<string, unknown>;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (typeof questionBody !== "string" || !questionBody.trim()) {
      return NextResponse.json({ error: "Question body is required" }, { status: 400 });
    }
    if (!Array.isArray(answer_choices)) {
      return NextResponse.json({ error: "Answer choices are required" }, { status: 400 });
    }

    const question = await createQuestion({
      teacherId: session.userId,
      title,
      description: typeof description === "string" ? description : null,
      body: questionBody,
      answerChoices: answer_choices.map((c: Record<string, unknown>, i: number) => ({
        text: typeof c.text === "string" ? c.text : "",
        is_correct: Boolean(c.is_correct),
        sort_order: typeof c.sort_order === "number" ? c.sort_order : i,
      })),
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof QuestionValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
