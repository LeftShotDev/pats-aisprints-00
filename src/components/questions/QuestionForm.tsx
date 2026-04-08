"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnswerChoiceList, type ChoiceInput } from "./AnswerChoiceList";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  body: z.string().min(1, "Question is required"),
});

type FormValues = z.infer<typeof schema>;

export interface QuestionFormData {
  title: string;
  description: string;
  body: string;
  answerChoices: ChoiceInput[];
}

export interface QuestionFormProps {
  initialValues?: Partial<QuestionFormData>;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  isSubmitting?: boolean;
  apiError?: string | null;
  submitLabel?: string;
  cancelHref?: string;
}

const DEFAULT_CHOICES: ChoiceInput[] = [
  { text: "", is_correct: false, sort_order: 0 },
  { text: "", is_correct: false, sort_order: 1 },
];

export function QuestionForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  apiError,
  submitLabel = "Save question",
  cancelHref = "/questions",
}: QuestionFormProps) {
  const [choices, setChoices] = useState<ChoiceInput[]>(
    initialValues?.answerChoices ?? DEFAULT_CHOICES
  );
  const [choiceError, setChoiceError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      body: initialValues?.body ?? "",
    },
  });

  async function handleFormSubmit(data: FormValues) {
    if (choices.length < 2) {
      setChoiceError("Add at least 2 answer choices before saving.");
      return;
    }
    const correctCount = choices.filter((c) => c.is_correct).length;
    if (correctCount === 0) {
      setChoiceError("Mark one answer choice as correct before saving.");
      return;
    }
    setChoiceError(null);
    await onSubmit({
      title: data.title,
      description: data.description ?? "",
      body: data.body,
      answerChoices: choices.map((c, i) => ({ ...c, sort_order: i })),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {apiError && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {apiError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">
          Description{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Question</Label>
        <Textarea
          id="body"
          rows={3}
          aria-invalid={!!errors.body}
          {...register("body")}
        />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Answer choices</Label>
        <p className="text-xs text-muted-foreground">
          Select the radio button next to the correct answer.
        </p>
        <AnswerChoiceList
          choices={choices}
          onChange={setChoices}
          error={choiceError}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        <Link href={cancelHref} className={cn(buttonVariants({ variant: "ghost" }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
