import { Suspense } from "react";
import BookDetails from "./book-details";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-8">
      <h1 className="text-3xl">Detail Buku</h1>
      <Suspense fallback={<p role="status">Memuat buku…</p>}>
        <BookDetails id={id} />
      </Suspense>
    </main>
  );
}

export function generateStaticParams() {
  return [{ id: "OL20915214W" }, { id: "OL19542899W" }];
}
