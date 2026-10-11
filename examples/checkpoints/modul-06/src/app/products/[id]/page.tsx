import BookNotice from "@/components/BookNotice";
import BookQuantity from "./BookQuantity";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="p-8 space-y-3">
      <h1 className="text-3xl">Detail Buku</h1>
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
      <BookQuantity key={id} />
    </main>
  );
}
