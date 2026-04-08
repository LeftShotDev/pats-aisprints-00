import Link from "next/link";
import { Pencil, Eye, Archive, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HighlightedText } from "./HighlightedText";
import type { Question } from "@/lib/services/question-service";

interface QuestionCardProps {
  question: Question;
  searchQuery: string;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  isArchived: boolean;
}

export function QuestionCard({
  question,
  searchQuery,
  onArchive,
  onUnarchive,
  isArchived,
}: QuestionCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate font-medium text-foreground">
            <HighlightedText text={question.title} query={searchQuery} />
          </p>

          {question.description && (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              <HighlightedText text={question.description} query={searchQuery} />
            </p>
          )}

          <p className="line-clamp-2 text-sm text-foreground/80">
            <HighlightedText text={question.body} query={searchQuery} />
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {question.answer_choices.length} answer choice
            {question.answer_choices.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild title="Preview">
            <Link href={`/questions/${question.id}/preview`}>
              <Eye />
              <span className="sr-only">Preview</span>
            </Link>
          </Button>

          {!isArchived && (
            <Button variant="ghost" size="icon-sm" asChild title="Edit">
              <Link href={`/questions/${question.id}/edit`}>
                <Pencil />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          )}

          {!isArchived && onArchive && (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Archive"
              onClick={() => onArchive(question.id)}
            >
              <Archive />
              <span className="sr-only">Archive</span>
            </Button>
          )}

          {isArchived && onUnarchive && (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Restore"
              onClick={() => onUnarchive(question.id)}
            >
              <ArchiveRestore />
              <span className="sr-only">Restore</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
