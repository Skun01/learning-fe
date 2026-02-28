import { Plus, Trash as Trash2, Eye } from "@phosphor-icons/react";
import { useFieldArray, useWatch, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ExampleFieldArrayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  disabled?: boolean;
}

export function ExampleFieldArray({
  control,
  name,
  disabled,
}: ExampleFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium">Câu ví dụ</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            append({ clozeSentence: "", expectedAnswer: "", hint: "" })
          }
          className="transition-all duration-200 hover:shadow-sm active:brightness-95"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Thêm ví dụ
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 rounded-xl border border-dashed border-border">
          <p className="text-xs text-muted-foreground">
            Chưa có câu ví dụ nào. Nhấn "Thêm ví dụ" để thêm.
          </p>
        </div>
      )}

      {fields.map((field, index) => (
        <ExampleRow
          key={field.id}
          control={control}
          name={name}
          index={index}
          onRemove={() => remove(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/** Single example row with live preview */
function ExampleRow({
  control,
  name,
  index,
  onRemove,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  index: number;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const watchCloze = useWatch({ control, name: `${name}.${index}.clozeSentence` }) || "";
  const watchAnswer = useWatch({ control, name: `${name}.${index}.expectedAnswer` }) || "";

  const hasPreview = watchCloze.includes("____") && watchAnswer;
  const parts = watchCloze.split("____");

  return (
    <div className="relative space-y-2 rounded-xl border p-4 bg-secondary/20 transition-all duration-200 hover:shadow-sm">
      {/* Header: number + remove */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">
          Ví dụ {index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <FormField
        control={control}
        name={`${name}.${index}.clozeSentence`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Câu cloze</FormLabel>
            <FormControl>
              <Input
                placeholder="VD: 私は____食べます"
                disabled={disabled}
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

      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name={`${name}.${index}.expectedAnswer`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Đáp án</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: を"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${name}.${index}.hint`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Gợi ý (tùy chọn)</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: trợ từ tân ngữ"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Live preview */}
      {hasPreview && (
        <div className="flex items-center gap-2 rounded-lg bg-background/80 border px-3 py-2 text-sm animate-fade-in-up">
          <Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Xem trước:</span>
          <span className="text-foreground">
            {parts[0]}{parts[0] && !parts[0].endsWith(" ") ? " " : ""}
            <span className="font-semibold text-primary">
              {watchAnswer}
            </span>
            {parts[1] && !parts[1].startsWith(" ") ? " " : ""}{parts[1] ?? ""}
          </span>
        </div>
      )}
    </div>
  );
}
