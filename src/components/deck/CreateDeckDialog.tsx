import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { deckService } from "@/services/deckService";
import { getErrorMessage } from "@/types/api";
import {
  createDeckSchema,
  type CreateDeckFormValues,
} from "@/lib/validations/deck";

interface CreateDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateDeckDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateDeckFormValues>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: { name: "", description: "", type: undefined },
  });

  async function onSubmit(values: CreateDeckFormValues) {
    setIsLoading(true);
    try {
      await deckService.createDeck({
        name: values.name,
        description: values.description ?? "",
        type: values.type,
      });
      toast.success("Tạo bộ thẻ thành công!");
      form.reset();
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
          <DialogTitle>Tạo bộ thẻ mới</DialogTitle>
          <DialogDescription>
            Tạo bộ thẻ để bắt đầu thêm các thẻ học.
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
                    <Input
                      placeholder="VD: N5 Từ vựng cơ bản"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về bộ thẻ..."
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bộ thẻ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Vocabulary">Từ vựng</SelectItem>
                      <SelectItem value="Grammar">Ngữ pháp</SelectItem>
                    </SelectContent>
                  </Select>
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
                Tạo bộ thẻ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
