import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import {
  getQuestion,
  updateQuestion,
  QuestionValidationError,
  QuestionNotFoundError,
  QuestionOwnershipError,
} from "@/lib/services/question-service";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const question = await getQuestion(id, session.userId);
    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof QuestionNotFoundError) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    if (error instanceof QuestionOwnershipError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
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

    const question = await updateQuestion(id, session.userId, {
      title,
      description: typeof description === "string" ? description : null,
      body: questionBody,
      answerChoices: answer_choices.map((c: Record<string, unknown>, i: number) => ({
        text: typeof c.text === "string" ? c.text : "",
        is_correct: Boolean(c.is_correct),
        sort_order: typeof c.sort_order === "number" ? c.sort_order : i,
      })),
    });

    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof QuestionValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof QuestionNotFoundError) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    if (error instanceof QuestionOwnershipError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
