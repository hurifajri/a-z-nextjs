import fixtures from "./book-fixtures.json";
import { notFound } from "next/navigation";

export async function getBook(id: string) {
  if (process.env.BOOKS_SOURCE === "fixture") {
    const book = (fixtures as Record<string, { title: string }>)[id];
    if (!book) notFound();
    return { id, title: book.title };
  }
  const url = `https://openlibrary.org/works/${encodeURIComponent(id)}.json`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Layanan buku: HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data?.title !== "string") {
    throw new Error("Judul buku tidak valid");
  }
  return { id, title: data.title };
}
