"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionCard } from "./QuestionCard";
import { EmptyState } from "./EmptyState";
import type { Question, PaginationMeta } from "@/lib/services/question-service";

const PAGE_SIZE_OPTIONS = ["25", "50", "100"] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

interface QuestionListState {
  questions: Question[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionListState = {
  questions: [],
  pagination: null,
  loading: true,
  error: null,
};

export function QuestionLibrary() {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>("25");
  const [listState, setListState] = useState<QuestionListState>(initialState);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchQuestions = useCallback(
    async (opts: {
      archived: boolean;
      search: string;
      page: number;
      pageSize: string;
    }) => {
      setListState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const params = new URLSearchParams({
          archived: String(opts.archived),
          page: String(opts.page),
          pageSize: opts.pageSize,
        });
        if (opts.search.trim()) params.set("search", opts.search.trim());

        const res = await fetch(`/api/questions?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = (await res.json()) as {
          questions: Question[];
          pagination: PaginationMeta;
        };
        setListState({ questions: data.questions, pagination: data.pagination, loading: false, error: null });
      } catch {
        setListState((prev) => ({
          ...prev,
          loading: false,
          error: "Something went wrong. Please try again.",
        }));
      }
    },
    []
  );

  useEffect(() => {
    fetchQuestions({
      archived: activeTab === "archived",
      search: searchQuery,
      page,
      pageSize,
    });
  }, [activeTab, searchQuery, page, pageSize, fetchQuestions]);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 350);
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  }

  function handleTabChange(value: string) {
    setActiveTab(value as "active" | "archived");
    setPage(1);
  }

  function handlePageSizeChange(value: string) {
    setPageSize(value as PageSizeOption);
    setPage(1);
  }

  async function handleArchive(id: string) {
    await fetch(`/api/questions/${id}/archive`, { method: "PATCH" });
    fetchQuestions({
      archived: false,
      search: searchQuery,
      page,
      pageSize,
    });
  }

  async function handleUnarchive(id: string) {
    await fetch(`/api/questions/${id}/unarchive`, { method: "PATCH" });
    fetchQuestions({
      archived: true,
      search: searchQuery,
      page,
      pageSize,
    });
  }

  const { questions, pagination, loading, error } = listState;
  const hasQuestions = questions.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  function renderContent(isArchived: boolean) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error) {
      return (
        <p className="py-20 text-center text-sm text-destructive">{error}</p>
      );
    }

    if (!hasQuestions && !isSearching) {
      return (
        <EmptyState
          type="no-questions"
        />
      );
    }

    if (!hasQuestions && isSearching) {
      return <EmptyState type="no-results" onClearSearch={handleClearSearch} />;
    }

    return (
      <div className="flex flex-col gap-3">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            searchQuery={searchQuery}
            isArchived={isArchived}
            onArchive={!isArchived ? handleArchive : undefined}
            onUnarchive={isArchived ? handleUnarchive : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">My Questions</h1>
        <Button asChild size="sm">
          <Link href="/questions/new">
            <Plus />
            Create question
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-8 w-60 pl-8 text-sm"
              />
            </div>

            <Select value={pageSize} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active" className="mt-4">
          {renderContent(false)}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {renderContent(true)}
        </TabsContent>
      </Tabs>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} &middot;{" "}
            {pagination.total} question{pagination.total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
