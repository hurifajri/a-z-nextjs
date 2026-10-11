import Link from "next/link";
import { Suspense } from "react";
import SearchForm from "@/components/SearchForm";
import BookSearch from "./BookSearch";

export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Katalog Buku</h1>
      <SearchForm />
      <Suspense fallback={<p>Membaca URL...</p>}>
        <BookSearch />
      </Suspense>
      <div className="flex flex-col gap-2">
        <Link href="/products/OL20915214W">Learning React</Link>
        <Link href="/products/OL19542899W">React: panduan praktik</Link>
        <Link href="/products/promo">Lihat promo</Link>
      </div>
    </main>
  );
}
