import * as v from "valibot";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";

export const runtime = "nodejs";

export async function GET() {
  const items = await db.select().from(suggestions).orderBy(suggestions.id);
  return Response.json(items);
}

export async function POST(request: Request) {
  const input = v.safeParse(
    BookSuggestionSchema,
    await request.json().catch(() => null),
  );
  if (!input.success) {
    return Response.json(
      { error: "Judul atau alasan belum valid." },
      { status: 400 },
    );
  }
  const [suggestion] = await db
    .insert(suggestions)
    .values(input.output)
    .returning();
  return Response.json(suggestion, { status: 201 });
}
