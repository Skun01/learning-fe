import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  BookA,
  BookType,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { CardTable } from "@/components/deck/CardTable";
import { EditDeckDialog } from "@/components/deck/EditDeckDialog";
import { DeleteDeckDialog } from "@/components/deck/DeleteDeckDialog";
import { CreateCardDialog } from "@/components/deck/CreateCardDialog";
import { EditCardDialog } from "@/components/deck/EditCardDialog";
import { DeleteCardDialog } from "@/components/deck/DeleteCardDialog";

import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";
import type { DeckDTO, DeckSummaryDTO } from "@/types/deck";

export function DeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<DeckDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Deck dialogs
  const [editDeckOpen, setEditDeckOpen] = useState(false);
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false);

  // Card dialogs
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  const fetchDeck = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await deckService.getDeck(id);
      setDeck(res.data.data);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
      navigate("/dashboard/decks");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-md stagger-2" />
        <Skeleton className="h-64 w-full rounded-xl stagger-3" />
      </div>
    );
  }

  if (!deck) return null;

  const isVocab = deck.type === "Vocabulary";

  // Build a DeckSummaryDTO-compatible object for EditDeckDialog
  const deckSummary: DeckSummaryDTO = {
    id: deck.id,
    name: deck.name,
    type: deck.type,
    cardNumber: deck.cards.length,
    author: deck.author,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/dashboard/decks")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Các bộ thẻ</span>
          </button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDeckOpen(true)}
              className="transition-all duration-200 hover:shadow-sm active:brightness-95"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive transition-all duration-200 hover:shadow-sm active:brightness-95 hover:border-destructive/30 hover:bg-destructive/5"
              onClick={() => setDeleteDeckOpen(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Deck info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            {isVocab ? (
              <BookA className="h-6 w-6" />
            ) : (
              <BookType className="h-6 w-6" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {deck.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isVocab ? "default" : "secondary"}>
                {isVocab ? "Từ vựng" : "Ngữ pháp"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {deck.cards.length} thẻ
              </span>
              <span className="text-sm text-muted-foreground">
                • bởi {deck.author.username}
              </span>
            </div>
          </div>
        </div>

        {deck.description && (
          <p className="text-sm text-muted-foreground max-w-2xl mt-3 ml-16">
            {deck.description}
          </p>
        )}
      </div>

      {/* Card list */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Danh sách thẻ
          </h2>
          <Button
            size="sm"
            onClick={() => setCreateCardOpen(true)}
            className="transition-all duration-200 hover:shadow-md active:brightness-95"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm thẻ
          </Button>
        </div>

        <CardTable
          cards={deck.cards}
          deckId={deck.id}
          onEdit={(cardId) => setEditCardId(cardId)}
          onDelete={(cardId) => setDeleteCardId(cardId)}
        />
      </div>

      {/* Deck Dialogs */}
      <EditDeckDialog
        open={editDeckOpen}
        onOpenChange={setEditDeckOpen}
        deck={deckSummary}
        onSuccess={fetchDeck}
      />
      <DeleteDeckDialog
        open={deleteDeckOpen}
        onOpenChange={setDeleteDeckOpen}
        deckId={deck.id}
        deckName={deck.name}
        onSuccess={() => navigate("/dashboard/decks")}
      />

      {/* Card Dialogs */}
      <CreateCardDialog
        open={createCardOpen}
        onOpenChange={setCreateCardOpen}
        deckId={deck.id}
        deckType={deck.type}
        onSuccess={fetchDeck}
      />
      <EditCardDialog
        open={!!editCardId}
        onOpenChange={(open) => !open && setEditCardId(null)}
        cardId={editCardId}
        deckType={deck.type}
        onSuccess={fetchDeck}
      />
      <DeleteCardDialog
        open={!!deleteCardId}
        onOpenChange={(open) => !open && setDeleteCardId(null)}
        cardId={deleteCardId}
        deckType={deck.type}
        onSuccess={fetchDeck}
      />
    </div>
  );
}
