"use client";
type Props = { retry: () => void };

export default function BookError({ retry }: Props) {
  return (
    <main className="p-8">
      <h1>Detail buku belum dapat dimuat</h1>
      <p>Silakan coba lagi sebentar lagi.</p>
      <button type="button" onClick={retry}>
        Coba lagi
      </button>
    </main>
  );
}
