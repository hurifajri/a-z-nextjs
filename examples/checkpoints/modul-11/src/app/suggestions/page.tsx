import { connection } from "next/server";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import SuggestionForm from "./SuggestionForm";
import SuggestionItem from "./SuggestionItem";

export const runtime = "nodejs";
export default async function SuggestionsPage() {
  await connection();
  const items = await db.select().from(suggestions).orderBy(suggestions.id);
  return (
    <main className="space-y-4 p-8">
      <h1>Usulan Buku Toko Belajar</h1>
      <p>Ajukan judul dan alasan untuk katalog toko.</p>
      <SuggestionForm />
      {items.length === 0 && <p>Belum ada usulan buku.</p>}
      <ul className="space-y-3">
        {items.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </ul>
    </main>
  );
}
