import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SpinnerGap as Loader2, BookBookmark as BookType, BookOpen as BookA, FileText, ChatText as MessageSquareText } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ExampleFieldArray } from "./ExampleFieldArray";
import { cardService } from "@/services/cardService";
import { getErrorMessage } from "@/types/api";
import type { DeckType } from "@/types/deck";
import {
  createVocabularyCardSchema,
  createGrammarCardSchema,
  type CreateVocabularyCardFormValues,
  type CreateGrammarCardFormValues,
} from "@/lib/validations/deck";

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  deckType: DeckType;
  onSuccess: () => void;
}

export function CreateCardDialog({
  open,
  onOpenChange,
  deckId,
  deckType,
  onSuccess,
}: CreateCardDialogProps) {
  const isVocab = deckType === "Vocabulary";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
              isVocab ? "bg-theme-vocab-light text-theme-vocab" : "bg-theme-grammar-light text-theme-grammar"
            }`}>
              {isVocab ? (
                <BookA className="h-5 w-5" />
              ) : (
                <BookType className="h-5 w-5" />
              )}
            </div>
            <div>
              <SheetTitle className="text-lg">
                Thêm thẻ {isVocab ? "từ vựng" : "ngữ pháp"}
              </SheetTitle>
              <SheetDescription>
                Điền thông tin để tạo thẻ mới vào bộ thẻ.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator className="mt-4" />

        {/* Scrollable body + sticky footer */}
        {isVocab ? (
          <VocabularyForm
            deckId={deckId}
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <GrammarForm
            deckId={deckId}
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Section Header ──────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

// ─── Vocabulary Form ─────────────────────────────────────────
function VocabularyForm({
  deckId,
  onSuccess,
  onCancel,
}: {
  deckId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateVocabularyCardFormValues>({
    resolver: zodResolver(createVocabularyCardSchema),
    defaultValues: { term: "", meaning: "", examples: [] },
  });

  async function onSubmit(values: CreateVocabularyCardFormValues) {
    setIsLoading(true);
    try {
      await cardService.createVocabularyCard({
        term: values.term,
        meaning: values.meaning,
        deckId,
        examples: values.examples ?? [],
      });
      toast.success("Thêm thẻ thành công!");
      form.reset();
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0"
      >
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section: Basic info */}
          <div>
            <SectionHeader icon={FileText} title="Thông tin cơ bản" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Từ khóa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 食べる"
                        disabled={isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="VD: Ăn"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Section: Examples */}
          <div>
            <SectionHeader icon={MessageSquareText} title="Câu ví dụ" />
            <ExampleFieldArray
              control={form.control}
              name="examples"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sticky footer */}
        <SheetFooter className="border-t px-6 py-4 flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="transition-all duration-200 hover:shadow-md active:brightness-95"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />
            )}
            Thêm thẻ
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}

// ─── Grammar Form ────────────────────────────────────────────
function GrammarForm({
  deckId,
  onSuccess,
  onCancel,
}: {
  deckId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateGrammarCardFormValues>({
    resolver: zodResolver(createGrammarCardSchema),
    defaultValues: {
      term: "",
      meaning: "",
      structure: "",
      explanation: "",
      caution: "",
      examples: [],
    },
  });

  async function onSubmit(values: CreateGrammarCardFormValues) {
    setIsLoading(true);
    try {
      await cardService.createGrammarCard({
        term: values.term,
        meaning: values.meaning,
        structure: values.structure,
        explanation: values.explanation || undefined,
        caution: values.caution || undefined,
        deckId,
        examples: values.examples ?? [],
      });
      toast.success("Thêm thẻ thành công!");
      form.reset();
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0"
      >
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section: Basic info */}
          <div>
            <SectionHeader icon={FileText} title="Thông tin cơ bản" />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mẫu ngữ pháp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: ～てもいい"
                        disabled={isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="VD: Được phép / Có thể"
                        disabled={isLoading}
                        {...field}
                      />
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
                      <Input
                        placeholder="VD: Vて + もいい"
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel>Giải thích (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Giải thích chi tiết về cách dùng..."
                        rows={3}
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel>Lưu ý (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Các lưu ý khi sử dụng..."
                        rows={3}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Section: Examples */}
          <div>
            <SectionHeader icon={MessageSquareText} title="Câu ví dụ" />
            <ExampleFieldArray
              control={form.control}
              name="examples"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sticky footer */}
        <SheetFooter className="border-t px-6 py-4 flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="transition-all duration-200 hover:shadow-md active:brightness-95"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />
            )}
            Thêm thẻ
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
