"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { QuestionForm, type QuestionFormData } from "@/components/questions/QuestionForm";
import type { Question } from "@/lib/services/question-service";

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const res = await fetch(`/api/questions/${id}`);
        if (res.status === 404 || res.status === 403) {
          router.replace("/questions");
          return;
        }
        if (!res.ok) throw new Error("Failed to load question");
        const data = await res.json() as Question;
        setQuestion(data);
      } catch {
        setLoadError("Could not load this question. Please try again.");
      }
    }
    loadQuestion();
  }, [id, router]);

  async function handleSubmit(data: QuestionFormData) {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          body: data.body,
          answer_choices: data.answerChoices,
        }),
      });

      if (res.ok) {
        router.push("/questions");
        return;
      }

      const body = await res.json() as { error?: string };
      setApiError(body.error ?? "Something went wrong. Please try again.");
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
          <p className="text-sm text-destructive">{loadError}</p>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Edit question</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the fields below and save your changes.
          </p>
        </div>
        <QuestionForm
          initialValues={{
            title: question.title,
            description: question.description ?? "",
            body: question.body,
            answerChoices: question.answer_choices.map((c) => ({
              text: c.text,
              is_correct: c.is_correct,
              sort_order: c.sort_order,
            })),
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          apiError={apiError}
          submitLabel="Save changes"
        />
      </main>
    </div>
  );
}
