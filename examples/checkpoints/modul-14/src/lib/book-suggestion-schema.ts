import * as v from "valibot";

export const BookSuggestionSchema = v.object({
  title: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Judul minimal 3 karakter."),
    v.maxLength(80, "Judul maksimal 80 karakter."),
  ),
  reason: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Alasan minimal 10 karakter."),
    v.maxLength(500, "Alasan maksimal 500 karakter."),
  ),
});

export type BookSuggestionValues = v.InferOutput<typeof BookSuggestionSchema>;

export const UpdateBookSuggestionSchema = v.strictObject(
  BookSuggestionSchema.entries,
);
export const SuggestionIdSchema = v.pipe(
  v.string(),
  v.regex(/^[1-9]\d*$/),
  v.transform(Number),
  v.safeInteger(),
);
export type BookSuggestion = BookSuggestionValues & { id: number };
