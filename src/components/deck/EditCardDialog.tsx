import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cardService } from "@/services/cardService";
import { getErrorMessage } from "@/types/api";
import type { DeckType, VocabularyCardDTO, GrammarCardDTO } from "@/types/deck";
import {
  updateVocabularyCardSchema,
  updateGrammarCardSchema,
  type UpdateVocabularyCardFormValues,
  type UpdateGrammarCardFormValues,
} from "@/lib/validations/deck";

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string | null;
  deckType: DeckType;
  onSuccess: () => void;
}

export function EditCardDialog({
  open,
  onOpenChange,
  cardId,
  deckType,
  onSuccess,
}: EditCardDialogProps) {
  const isVocab = deckType === "Vocabulary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Sửa thẻ {isVocab ? "từ vựng" : "ngữ pháp"}
          </DialogTitle>
          <DialogDescription>Cập nhật thông tin thẻ.</DialogDescription>
        </DialogHeader>

        {cardId &&
          (isVocab ? (
            <EditVocabularyForm
              cardId={cardId}
              onSuccess={onSuccess}
              onCancel={() => onOpenChange(false)}
            />
          ) : (
            <EditGrammarForm
              cardId={cardId}
              onSuccess={onSuccess}
              onCancel={() => onOpenChange(false)}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}

// === Edit Vocabulary ===
function EditVocabularyForm({
  cardId,
  onSuccess,
  onCancel,
}: {
  cardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<UpdateVocabularyCardFormValues>({
    resolver: zodResolver(updateVocabularyCardSchema),
    defaultValues: { term: "", meaning: "" },
  });

  useEffect(() => {
    async function fetch() {
      setIsFetching(true);
      try {
        const res = await cardService.getVocabularyCard(cardId);
        const card: VocabularyCardDTO = res.data.data;
        form.reset({ term: card.term, meaning: card.meaning });
      } catch {
        toast.error("Không thể tải thông tin thẻ");
        onCancel();
      } finally {
        setIsFetching(false);
      }
    }
    fetch();
  }, [cardId, form, onCancel]);

  async function onSubmit(values: UpdateVocabularyCardFormValues) {
    setIsLoading(true);
    try {
      await cardService.updateVocabularyCard(cardId, values);
      toast.success("Cập nhật thẻ thành công!");
      onCancel();
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

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin-smooth text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Từ khóa</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ý nghĩa</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// === Edit Grammar ===
function EditGrammarForm({
  cardId,
  onSuccess,
  onCancel,
}: {
  cardId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<UpdateGrammarCardFormValues>({
    resolver: zodResolver(updateGrammarCardSchema),
    defaultValues: {
      term: "",
      meaning: "",
      structure: "",
      explanation: "",
      caution: "",
    },
  });

  useEffect(() => {
    async function fetch() {
      setIsFetching(true);
      try {
        const res = await cardService.getGrammarCard(cardId);
        const card: GrammarCardDTO = res.data.data;
        form.reset({
          term: card.term,
          meaning: card.meaning,
          structure: card.structure,
          explanation: card.explanation ?? "",
          caution: card.caution ?? "",
        });
      } catch {
        toast.error("Không thể tải thông tin thẻ");
        onCancel();
      } finally {
        setIsFetching(false);
      }
    }
    fetch();
  }, [cardId, form, onCancel]);

  async function onSubmit(values: UpdateGrammarCardFormValues) {
    setIsLoading(true);
    try {
      await cardService.updateGrammarCard(cardId, {
        term: values.term,
        meaning: values.meaning,
        structure: values.structure,
        explanation: values.explanation || undefined,
        caution: values.caution || undefined,
      });
      toast.success("Cập nhật thẻ thành công!");
      onCancel();
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

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin-smooth text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mẫu ngữ pháp</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ý nghĩa</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="structure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cấu trúc</FormLabel>
              <FormControl>
                <Input disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giải thích</FormLabel>
              <FormControl>
                <Textarea rows={2} disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lưu ý</FormLabel>
              <FormControl>
                <Textarea rows={2} disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
