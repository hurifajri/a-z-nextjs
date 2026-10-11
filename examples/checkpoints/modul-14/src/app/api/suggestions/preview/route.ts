// src/app/api/suggestions/preview/route.ts
import * as v from "valibot";
import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = v.safeParse(BookSuggestionSchema, body);

  if (!result.success) {
    return Response.json(
      { error: "Judul atau alasan belum valid." },
      { status: 400 },
    );
  }

  return Response.json(result.output);
}
