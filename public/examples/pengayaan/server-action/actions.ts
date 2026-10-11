"use server";
import * as v from "valibot";
import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";
export type PreviewState = { message: string };
export async function previewSuggestion(
  _previous: PreviewState,
  data: FormData,
): Promise<PreviewState> {
  const result = v.safeParse(BookSuggestionSchema, {
    title: data.get("title"),
    reason: data.get("reason"),
  });
  if (!result.success) return { message: "Judul atau alasan belum valid." };
  return {
    message: `Valid: ${result.output.title}. Preview belum menyimpan data.`,
  };
}
