import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";

interface DeleteDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string | null;
  deckName: string;
  onSuccess: () => void;
}

export function DeleteDeckDialog({
  open,
  onOpenChange,
  deckId,
  deckName,
  onSuccess,
}: DeleteDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!deckId) return;
    setIsLoading(true);
    try {
      await deckService.deleteDeck(deckId);
      toast.success("Đã xóa bộ thẻ!");
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
          <AlertDialogTitle>Xóa bộ thẻ?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa bộ thẻ{" "}
            <span className="font-semibold text-foreground">"{deckName}"</span>?
            Hành động này không thể hoàn tác và tất cả thẻ trong bộ thẻ cũng sẽ
            bị xóa.
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
            Xóa bộ thẻ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
