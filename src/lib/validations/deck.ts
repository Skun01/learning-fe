import { z } from "zod";

/**
 * Zod schemas for deck & card forms.
 * Vietnamese error messages.
 *
 * For forms using react-hook-form + @hookform/resolvers/zod,
 * we export both as z.input<> (form defaults) and z.output<> (validated).
 * Using z.input<> for the form type to match the resolver expectation.
 */

// === Example Sentence (reusable) ===

export const exampleSentenceSchema = z.object({
  clozeSentence: z
    .string()
    .min(1, "Vui lòng nhập câu cloze")
    .refine((val) => val.includes("____"), {
      message: 'Câu cloze phải chứa "____" (4 dấu gạch dưới) để đánh dấu chỗ trống',
    }),
  expectedAnswer: z.string().min(1, "Vui lòng nhập đáp án"),
  hint: z.string().optional(),
});

export type ExampleSentenceFormValues = z.input<typeof exampleSentenceSchema>;

/** Standalone schema for adding a single example to an existing card */
export const createExampleSchema = exampleSentenceSchema;
export type CreateExampleFormValues = z.input<typeof createExampleSchema>;

// === Deck ===

export const createDeckSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên bộ thẻ"),
  description: z.string().optional(),
  type: z.enum(["Vocabulary", "Grammar"], {
    message: "Vui lòng chọn loại bộ thẻ",
  }),
});

export type CreateDeckFormValues = z.input<typeof createDeckSchema>;

export const updateDeckSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên bộ thẻ"),
  description: z.string().optional(),
});

export type UpdateDeckFormValues = z.input<typeof updateDeckSchema>;

// === Vocabulary Card ===

export const createVocabularyCardSchema = z.object({
  term: z.string().min(1, "Vui lòng nhập từ khóa"),
  meaning: z.string().min(1, "Vui lòng nhập ý nghĩa"),
  examples: z.array(exampleSentenceSchema).optional(),
});

export type CreateVocabularyCardFormValues = z.input<
  typeof createVocabularyCardSchema
>;

export const updateVocabularyCardSchema = z.object({
  term: z.string().min(1, "Vui lòng nhập từ khóa"),
  meaning: z.string().min(1, "Vui lòng nhập ý nghĩa"),
});

export type UpdateVocabularyCardFormValues = z.input<
  typeof updateVocabularyCardSchema
>;

// === Grammar Card ===

export const createGrammarCardSchema = z.object({
  term: z.string().min(1, "Vui lòng nhập mẫu ngữ pháp"),
  meaning: z.string().min(1, "Vui lòng nhập ý nghĩa"),
  structure: z.string().min(1, "Vui lòng nhập cấu trúc"),
  explanation: z.string().optional(),
  caution: z.string().optional(),
  examples: z.array(exampleSentenceSchema).optional(),
});

export type CreateGrammarCardFormValues = z.input<
  typeof createGrammarCardSchema
>;

export const updateGrammarCardSchema = z.object({
  term: z.string().min(1, "Vui lòng nhập mẫu ngữ pháp"),
  meaning: z.string().min(1, "Vui lòng nhập ý nghĩa"),
  structure: z.string().min(1, "Vui lòng nhập cấu trúc"),
  explanation: z.string().optional(),
  caution: z.string().optional(),
});

export type UpdateGrammarCardFormValues = z.input<
  typeof updateGrammarCardSchema
>;
