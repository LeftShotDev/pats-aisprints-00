import { BookOpen, SearchX } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  type: "no-questions" | "no-results";
  onClearSearch?: () => void;
}

export function EmptyState({ type, onClearSearch }: EmptyStateProps) {
  if (type === "no-questions") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <BookOpen className="size-7 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-foreground">No questions yet</p>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first question.
          </p>
        </div>
        <Link href="/questions/new" className={cn(buttonVariants())}>
          Create question
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground">No results found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or clearing the keywords.
        </p>
      </div>
      {onClearSearch && (
        <Button variant="outline" onClick={onClearSearch}>
          Clear search
        </Button>
      )}
    </div>
  );
}
