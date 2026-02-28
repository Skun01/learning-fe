import { useState } from "react";
import { toast } from "sonner";
import { SpinnerGap as Loader2 } from "@phosphor-icons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cardService } from "@/services/cardService";
import { getErrorMessage } from "@/types/api";
import type { DeckType } from "@/types/deck";

interface DeleteCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string | null;
  deckType: DeckType;
  onSuccess: () => void;
}

export function DeleteCardDialog({
  open,
  onOpenChange,
  cardId,
  deckType,
  onSuccess,
}: DeleteCardDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!cardId) return;
    setIsLoading(true);
    try {
      if (deckType === "Vocabulary") {
        await cardService.deleteVocabularyCard(cardId);
      } else {
        await cardService.deleteGrammarCard(cardId);
      }
      toast.success("Đã xóa thẻ!");
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa thẻ?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa thẻ này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />}
            Xóa thẻ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
