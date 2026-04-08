"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MIN_CHOICES = 2;
const MAX_CHOICES = 6;

export interface ChoiceInput {
  text: string;
  is_correct: boolean;
  sort_order: number;
}

interface AnswerChoiceListProps {
  choices: ChoiceInput[];
  onChange: (choices: ChoiceInput[]) => void;
  error?: string | null;
}

export function AnswerChoiceList({ choices, onChange, error }: AnswerChoiceListProps) {
  function addChoice() {
    if (choices.length >= MAX_CHOICES) return;
    onChange([...choices, { text: "", is_correct: false, sort_order: choices.length }]);
  }

  function removeChoice(index: number) {
    if (choices.length <= MIN_CHOICES) return;
    onChange(choices.filter((_, i) => i !== index));
  }

  function updateText(index: number, text: string) {
    onChange(choices.map((c, i) => (i === index ? { ...c, text } : c)));
  }

  function markCorrect(index: number) {
    onChange(choices.map((c, i) => ({ ...c, is_correct: i === index })));
  }

  return (
    <div className="flex flex-col gap-3">
      {choices.map((choice, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="radio"
            name="correct_answer"
            id={`choice-correct-${index}`}
            checked={choice.is_correct}
            onChange={() => markCorrect(index)}
            aria-label={`Mark choice ${index + 1} as correct`}
            className="size-4 shrink-0 cursor-pointer accent-primary"
          />
          <Input
            id={`choice-text-${index}`}
            type="text"
            value={choice.text}
            onChange={(e) => updateText(index, e.target.value)}
            placeholder={`Choice ${index + 1}`}
            aria-label={`Choice ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeChoice(index)}
            disabled={choices.length <= MIN_CHOICES}
            aria-label={`Remove choice ${index + 1}`}
          >
            <Trash2 />
            <span className="sr-only">Remove choice {index + 1}</span>
          </Button>
        </div>
      ))}

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addChoice}
        disabled={choices.length >= MAX_CHOICES}
        className="self-start"
      >
        <Plus />
        Add choice
      </Button>
    </div>
  );
}
