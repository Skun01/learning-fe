import { useNavigate } from "react-router";
import { BookOpen as BookA, BookBookmark as BookType, DotsThreeVertical as MoreVertical, PencilSimple as Pencil, Trash as Trash2 } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DeckSummaryDTO } from "@/types/deck";

interface DeckCardProps {
  deck: DeckSummaryDTO;
  onEdit: () => void;
  onDelete: () => void;
  /** CSS class for stagger delay, e.g. "stagger-1" */
  staggerClass?: string;
}

export function DeckCard({ deck, onEdit, onDelete, staggerClass }: DeckCardProps) {
  const navigate = useNavigate();
  const isVocab = deck.type === "Vocabulary";

  return (
    <Card
      className={`
        group cursor-pointer
        border-transparent
        hover:border-primary/25 hover:shadow-lg
        active:shadow-md
        transition-all duration-300 ease-out
        animate-fade-in-up ${staggerClass ?? ""}
      `}
      onClick={() => navigate(`/dashboard/decks/${deck.id}`)}
    >
      <CardContent className="p-5">
        {/* Header: icon + menu */}
        <div className="flex items-start justify-between mb-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:rotate-3 ${
            isVocab ? "bg-theme-vocab-light text-theme-vocab" : "bg-theme-grammar-light text-theme-grammar"
          }`}>
            {isVocab ? (
              <BookA className="h-5 w-5" />
            ) : (
              <BookType className="h-5 w-5" />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground truncate mb-1.5 transition-colors duration-200 group-hover:text-primary">
          {deck.name}
        </h3>

        {/* Badge + card count */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={
            isVocab
              ? "bg-theme-vocab-light text-theme-vocab hover:bg-theme-vocab-light"
              : "bg-theme-grammar-light text-theme-grammar hover:bg-theme-grammar-light"
          }>
            {isVocab ? "Từ vựng" : "Ngữ pháp"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {deck.cardNumber} thẻ
          </span>
        </div>

        {/* Author */}
        <p className="text-xs text-muted-foreground">
          bởi {deck.author.username}
        </p>
      </CardContent>
    </Card>
  );
}
