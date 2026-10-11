import { connection } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/session";
import { suggestions, suggestionFields } from "@/db/schema";

import SuggestionForm from "./SuggestionForm";
import SuggestionItem from "./SuggestionItem";
import LogoutButton from "@/components/LogoutButton";
import SuggestionHelp from "./SuggestionHelp";

export const runtime = "nodejs";
export default async function SuggestionsPage() {
  await connection();
  const session = await getVerifiedSession();
  if (!session) redirect("/login");
  const items = await db
    .select(suggestionFields)
    .from(suggestions)
    .where(eq(suggestions.userId, session.user.id))
    .orderBy(suggestions.id);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold">Usulan Buku Toko Belajar</h1>
        <div className="flex flex-wrap gap-2">
          <SuggestionHelp />
          <LogoutButton />
        </div>
      </header>
      <section className="max-w-xl" aria-label="Tambah usulan buku">
        <SuggestionForm />
      </section>
      <section className="flex flex-col gap-4" aria-labelledby="list-title">
        <h2 id="list-title" className="text-xl font-semibold">
          Daftar usulan
        </h2>
        {items.length === 0 && <p>Belum ada usulan buku. Isi form di atas.</p>}
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {items.map((suggestion) => (
            <SuggestionItem key={suggestion.id} suggestion={suggestion} />
          ))}
        </ul>
      </section>
    </main>
  );
}
