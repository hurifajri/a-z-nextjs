import Link from "next/link";
export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Katalog Buku</h1>
      <div className="flex flex-col gap-2">
        <Link href="/products/buku-react">Buku React</Link>
        <Link href="/products/buku-next">Buku Next</Link>
        <Link href="/products/promo">Lihat promo</Link>
      </div>
    </main>
  );
}
