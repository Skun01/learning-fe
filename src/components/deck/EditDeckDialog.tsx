import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SpinnerGap as Loader2 } from "@phosphor-icons/react";

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

import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";
import {
  updateDeckSchema,
  type UpdateDeckFormValues,
} from "@/lib/validations/deck";
import type { DeckSummaryDTO } from "@/types/deck";

interface EditDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: DeckSummaryDTO | null;
  onSuccess: () => void;
}

export function EditDeckDialog({
  open,
  onOpenChange,
  deck,
  onSuccess,
}: EditDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateDeckFormValues>({
    resolver: zodResolver(updateDeckSchema),
    defaultValues: { name: "", description: "" },
  });

  // Pre-fill when deck changes
  useEffect(() => {
    if (deck) {
      form.reset({ name: deck.name, description: "" });
    }
  }, [deck, form]);

  async function onSubmit(values: UpdateDeckFormValues) {
    if (!deck) return;
    setIsLoading(true);
    try {
      await deckService.updateDeck(deck.id, {
        name: values.name,
        description: values.description ?? "",
      });
      toast.success("Cập nhật bộ thẻ thành công!");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bộ thẻ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin bộ thẻ của bạn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên bộ thẻ</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea rows={3} disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin-smooth" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
