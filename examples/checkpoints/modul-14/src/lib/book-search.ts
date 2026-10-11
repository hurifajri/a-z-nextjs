import { searchFixture } from "./book-search-fixture";
export type BookHit = { id: string; title: string };

function parseBook(item: unknown): BookHit {
  if (
    typeof item !== "object" ||
    item === null ||
    !("key" in item) ||
    !("title" in item) ||
    typeof item.key !== "string" ||
    typeof item.title !== "string"
  ) {
    throw new Error("Data buku tidak valid");
  }
  const id = item.key.replace(/^\/works\//, "");
  if (!/^OL\d+W$/.test(id)) throw new Error("ID buku tidak valid");
  return { id, title: item.title };
}

export async function searchBooks(
  keyword: string,
  signal?: AbortSignal,
): Promise<BookHit[]> {
  const params = new URLSearchParams({
    q: keyword,
    fields: "key,title",
    limit: "5",
  });
  const url = `https://openlibrary.org/search.json?${params}`;
  const res =
    process.env.NEXT_PUBLIC_USE_BOOK_FIXTURES === "true"
      ? await searchFixture(keyword, signal)
      : await fetch(url, { signal });
  if (!res.ok) throw new Error(`Pencarian: HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.docs)) {
    throw new Error("Daftar buku tidak valid");
  }
  return data.docs.map(parseBook);
}
