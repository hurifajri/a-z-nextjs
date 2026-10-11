import * as v from "valibot";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import {
  SuggestionIdSchema,
  UpdateBookSuggestionSchema,
} from "@/lib/book-suggestion-schema";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const id = v.safeParse(SuggestionIdSchema, (await params).id);
  const input = v.safeParse(
    UpdateBookSuggestionSchema,
    await request.json().catch(() => null),
  );
  if (!id.success || !input.success) {
    return Response.json({ error: "Input tidak valid." }, { status: 400 });
  }
  const [suggestion] = await db
    .update(suggestions)
    .set({ title: input.output.title, reason: input.output.reason })
    .where(eq(suggestions.id, id.output))
    .returning();
  if (!suggestion) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return Response.json(suggestion);
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = v.safeParse(SuggestionIdSchema, (await params).id);
  if (!id.success) {
    return Response.json({ error: "ID tidak valid." }, { status: 400 });
  }
  const [deleted] = await db
    .delete(suggestions)
    .where(eq(suggestions.id, id.output))
    .returning({ id: suggestions.id });
  if (!deleted) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
