import Link from "next/link";
import type { BookHit } from "@/lib/book-search";

export default function BookHits({ books }: { books: BookHit[] }) {
  if (books.length === 0) return <p>Belum ada buku yang cocok.</p>;
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <Link href={`/products/${book.id}`}>{book.title}</Link>
        </li>
      ))}
    </ul>
  );
}
