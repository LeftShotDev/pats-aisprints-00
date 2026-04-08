"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question, AnswerChoice } from "@/lib/services/question-service";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface PreviewQuestionProps {
  question: Question;
}

export function PreviewQuestion({ question }: PreviewQuestionProps) {
  const shuffledChoices = useMemo(
    () => shuffleArray(question.answer_choices),
    // Shuffle once on mount — intentionally omitting question.answer_choices
    // from deps so re-renders don't reshuffle mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedChoice = shuffledChoices.find((c) => c.id === selectedId) ?? null;
  const isCorrect = selectedChoice?.is_correct ?? false;

  function handleSubmit() {
    if (!selectedId) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSelectedId(null);
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/questions"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start")}
      >
        <ArrowLeft />
        Back to library
      </Link>

      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}

        <p className="text-base font-medium text-foreground leading-relaxed">
          {question.body}
        </p>

        <fieldset disabled={submitted} className="flex flex-col gap-3">
          <legend className="sr-only">Answer choices</legend>
          {shuffledChoices.map((choice) => (
            <ChoiceOption
              key={choice.id}
              choice={choice}
              isSelected={selectedId === choice.id}
              submitted={submitted}
              onSelect={() => setSelectedId(choice.id)}
            />
          ))}
        </fieldset>

        {submitted ? (
          <div className="flex flex-col gap-4">
            <FeedbackBanner isCorrect={isCorrect} correctChoice={shuffledChoices.find((c) => c.is_correct)!} />
            <Button variant="outline" size="sm" className="self-start" onClick={handleReset}>
              Try again
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="self-start"
            disabled={!selectedId}
            onClick={handleSubmit}
          >
            Submit answer
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ChoiceOptionProps {
  choice: AnswerChoice;
  isSelected: boolean;
  submitted: boolean;
  onSelect: () => void;
}

function ChoiceOption({ choice, isSelected, submitted, onSelect }: ChoiceOptionProps) {
  const baseClasses =
    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors";

  const stateClasses = submitted
    ? choice.is_correct
      ? "border-green-500 bg-green-50 text-green-900"
      : isSelected
      ? "border-red-400 bg-red-50 text-red-900"
      : "border-border bg-muted/40 text-muted-foreground"
    : isSelected
    ? "border-primary bg-primary/5 text-foreground"
    : "border-border bg-background text-foreground hover:bg-muted/50";

  return (
    <label className={cn(baseClasses, stateClasses, submitted && "cursor-default")}>
      <input
        type="radio"
        name="preview_answer"
        value={choice.id}
        checked={isSelected}
        onChange={onSelect}
        disabled={submitted}
        className="sr-only"
      />
      <span className="flex size-5 shrink-0 items-center justify-center">
        {submitted && choice.is_correct && (
          <CheckCircle2 className="size-5 text-green-600" />
        )}
        {submitted && isSelected && !choice.is_correct && (
          <XCircle className="size-5 text-red-500" />
        )}
        {!submitted && (
          <span
            className={cn(
              "size-4 rounded-full border-2",
              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
            )}
          />
        )}
      </span>
      <span>{choice.text}</span>
    </label>
  );
}

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctChoice: AnswerChoice;
}

function FeedbackBanner({ isCorrect, correctChoice }: FeedbackBannerProps) {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        <CheckCircle2 className="size-4 shrink-0" />
        Correct!
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      <XCircle className="mt-0.5 size-4 shrink-0" />
      <span>
        Incorrect — the correct answer is{" "}
        <span className="font-medium">{correctChoice.text}</span>.
      </span>
    </div>
  );
}
