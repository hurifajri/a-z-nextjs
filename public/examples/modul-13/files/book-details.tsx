import Image from "next/image";
import { getBook } from "@/lib/books";
import BookNotice from "@/components/book-notice";
import BookQuantity from "./book-quantity";

type Props = { id: string };

export default async function BookDetails({ id }: Props) {
  const book = await getBook(id);
  return (
    <section className="space-y-3">
      <h2>{book.title}</h2>
      <Image
        src="/images/book-placeholder.png"
        alt=""
        width={480}
        height={640}
        sizes="(max-width: 640px) 50vw, 240px"
        className="h-auto w-1/2 max-w-60"
      />
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
      <BookQuantity key={id} />
    </section>
  );
}
