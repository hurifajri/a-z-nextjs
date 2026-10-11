import { getBook } from "@/lib/books";
import BookNotice from "@/components/book-notice";
import BookQuantity from "./book-quantity";

type Props = { id: string };

export default async function BookDetails({ id }: Props) {
  const book = await getBook(id);
  return (
    <section className="space-y-3">
      <h2>{book.title}</h2>
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
      <BookQuantity key={id} />
    </section>
  );
}
