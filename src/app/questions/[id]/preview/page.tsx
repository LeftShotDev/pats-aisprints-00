"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PreviewQuestion } from "@/components/questions/PreviewQuestion";
import type { Question } from "@/lib/services/question-service";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-foreground">{question.title}</h1>
        </div>
        <p className="mb-6 text-xs text-muted-foreground">
          Preview only — answers are not recorded.
        </p>
        <PreviewQuestion question={question} />
      </main>
    </div>
  );
}
