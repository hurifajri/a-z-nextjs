import * as v from "valibot";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { requireSuggestionSession } from "@/lib/suggestion-access";
import { suggestions, suggestionFields } from "@/db/schema";

import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
  const items = await db
    .select(suggestionFields)
    .from(suggestions)
    .where(eq(suggestions.userId, session.user.id))
    .orderBy(suggestions.id);
  return Response.json(items);
}

export async function POST(request: Request) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
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
    .values({
      title: input.output.title,
      reason: input.output.reason,
      userId: session.user.id,
    })
    .returning(suggestionFields);
  return Response.json(suggestion, { status: 201 });
}
