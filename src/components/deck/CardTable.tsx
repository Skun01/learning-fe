import { useNavigate } from "react-router";
import { PencilSimple as Pencil, Trash as Trash2 } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PreviewCardDTO } from "@/types/deck";

interface CardTableProps {
  cards: PreviewCardDTO[];
  deckId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CardTable({ cards, deckId, onEdit, onDelete }: CardTableProps) {
  const navigate = useNavigate();

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-fade-in-up">
        <p className="text-sm">Chưa có thẻ nào trong bộ thẻ này.</p>
        <p className="text-xs mt-1">Nhấn "Thêm thẻ" để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden animate-fade-in-up">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Từ khóa</TableHead>
            <TableHead className="w-[40%]">Ý nghĩa</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow
              key={card.id}
              className="cursor-pointer transition-colors duration-200 hover:bg-primary/[0.03]"
              onClick={() =>
                navigate(`/dashboard/decks/${deckId}/cards/${card.id}`)
              }
            >
              <TableCell className="font-medium">{card.term}</TableCell>
              <TableCell>{card.meaning}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(card.id);
                    }}
                    title="Chỉnh sửa"
                    className="transition-all duration-200 hover:text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card.id);
                    }}
                    title="Xóa"
                    className="text-destructive hover:text-destructive transition-all duration-200 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
