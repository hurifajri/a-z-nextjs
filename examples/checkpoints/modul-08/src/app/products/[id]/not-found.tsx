import Link from "next/link";

export default function BookNotFound() {
  return (
    <main className="p-8">
      <h1>Buku tidak ditemukan</h1>
      <Link href="/products">Kembali ke katalog</Link>
    </main>
  );
}
