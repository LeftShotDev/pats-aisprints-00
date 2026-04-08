"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { QuestionForm, type QuestionFormData } from "@/components/questions/QuestionForm";

export default function NewQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(data: QuestionFormData) {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Create question</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details below and add between 2 and 6 answer choices.
          </p>
        </div>
        <QuestionForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          apiError={apiError}
          submitLabel="Create question"
        />
      </main>
    </div>
  );
}
