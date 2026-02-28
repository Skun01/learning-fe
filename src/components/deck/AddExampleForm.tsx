import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Eye } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cardService } from "@/services/cardService";
import { getErrorMessage } from "@/types/api";
import type { DeckType } from "@/types/deck";
import {
  createExampleSchema,
  type CreateExampleFormValues,
} from "@/lib/validations/deck";

interface AddExampleFormProps {
  cardId: string;
  deckType: DeckType;
  onSuccess: () => void;
}

export function AddExampleForm({
  cardId,
  deckType,
  onSuccess,
}: AddExampleFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateExampleFormValues>({
    resolver: zodResolver(createExampleSchema),
    defaultValues: {
      clozeSentence: "",
      expectedAnswer: "",
      hint: "",
    },
  });

  const watchCloze = form.watch("clozeSentence");
  const watchAnswer = form.watch("expectedAnswer");

  // Build preview: replace ____ with highlighted answer
  const previewSentence =
    watchCloze && watchAnswer
      ? watchCloze.replace("____", watchAnswer)
      : null;

  async function onSubmit(values: CreateExampleFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        clozeSentence: values.clozeSentence,
        expectedAnswer: values.expectedAnswer,
        hint: values.hint || undefined,
        ...(deckType === "Vocabulary"
          ? { vocabularyCardId: cardId }
          : { grammarCardId: cardId }),
      };
      await cardService.createExample(payload);
      toast.success("Đã thêm câu ví dụ");
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(getErrorMessage(axiosError?.response?.data?.message ?? null));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="transition-all duration-200 hover:shadow-sm active:brightness-95"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Thêm ví dụ
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Thêm câu ví dụ mới
        </h3>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            setIsOpen(false);
            form.reset();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="clozeSentence"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Câu cloze</FormLabel>
                <FormControl>
                  <Input
                    placeholder='VD: 私は____食べます'
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Dùng ____ (4 dấu gạch dưới) để đánh dấu chỗ trống cho đáp án
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="expectedAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Đáp án</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: を"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Gợi ý (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: trợ từ tân ngữ"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {previewSentence && (
            <div className="flex items-center gap-2 rounded-lg bg-background/80 border px-3 py-2 text-sm">
              <Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Xem trước:</span>
              <span className="text-foreground">
                {watchCloze.split("____")[0]}{watchCloze.split("____")[0] && !watchCloze.split("____")[0].endsWith(" ") ? " " : ""}
                <span className="font-semibold text-primary">
                  {watchAnswer}
                </span>
                {watchCloze.split("____")[1] && !watchCloze.split("____")[1].startsWith(" ") ? " " : ""}{watchCloze.split("____")[1]}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setIsOpen(false);
                form.reset();
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="transition-all duration-200 hover:shadow-md active:brightness-95"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu ví dụ"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
