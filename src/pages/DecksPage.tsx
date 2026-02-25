import { useState, useEffect, useCallback } from "react";
import { Plus, Library } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { DeckCard } from "@/components/deck/DeckCard";
import { DeckFilters } from "@/components/deck/DeckFilters";
import { CreateDeckDialog } from "@/components/deck/CreateDeckDialog";
import { EditDeckDialog } from "@/components/deck/EditDeckDialog";
import { DeleteDeckDialog } from "@/components/deck/DeleteDeckDialog";
import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";
import type { DeckSummaryDTO } from "@/types/deck";

const PAGE_SIZE = 12;

export function DecksPage() {
  // Data
  const [decks, setDecks] = useState<DeckSummaryDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editDeck, setEditDeck] = useState<DeckSummaryDTO | null>(null);
  const [deleteDeck, setDeleteDeck] = useState<DeckSummaryDTO | null>(null);

  // Fetch decks
  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await deckService.getDecks({
        keyword: keyword || undefined,
        type: typeFilter as "" | "Vocabulary" | "Grammar",
        page: currentPage,
        pageSize: PAGE_SIZE,
      });
      setDecks(res.data.data);
      const total = res.data.metaData?.total ?? 0;
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
    } finally {
      setIsLoading(false);
    }
  }, [keyword, typeFilter, currentPage]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Debounce keyword search
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleTypeChange(val: string) {
    setTypeFilter(val);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Các bộ thẻ của tôi
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các bộ thẻ học của bạn
            </p>
          </div>
        </div>
        <Button
          size="default"
          onClick={() => setCreateOpen(true)}
          className="px-5 transition-all duration-200 hover:shadow-md active:brightness-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo bộ thẻ
        </Button>
      </div>

      {/* Filters */}
      <DeckFilters
        keyword={searchInput}
        type={typeFilter}
        onKeywordChange={setSearchInput}
        onTypeChange={handleTypeChange}
      />

      {/* Deck grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={`h-40 rounded-xl stagger-${i + 1}`} />
          ))}
        </div>
      ) : decks.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4 animate-float">
            <Library className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Chưa có bộ thẻ nào
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Tạo bộ thẻ đầu tiên để bắt đầu hành trình học tập!
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            className="transition-all duration-200 hover:shadow-md active:brightness-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo bộ thẻ đầu tiên
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck, i) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={() => setEditDeck(deck)}
                onDelete={() => setDeleteDeck(deck)}
                staggerClass={`stagger-${i + 1}`}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="animate-fade-in-up stagger-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer transition-all duration-200 hover:brightness-95"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer transition-all duration-200 hover:brightness-95"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateDeckDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchDecks}
      />
      <EditDeckDialog
        open={!!editDeck}
        onOpenChange={(open) => !open && setEditDeck(null)}
        deck={editDeck}
        onSuccess={fetchDecks}
      />
      <DeleteDeckDialog
        open={!!deleteDeck}
        onOpenChange={(open) => !open && setDeleteDeck(null)}
        deckId={deleteDeck?.id ?? null}
        deckName={deleteDeck?.name ?? ""}
        onSuccess={fetchDecks}
      />
    </div>
  );
}
