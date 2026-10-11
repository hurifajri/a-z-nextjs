"use client";
type Props = { retry: () => void };

export default function ErrorPage({ retry }: Props) {
  return (
    <section>
      <p>Daftar gagal dimuat.</p>
      <button onClick={retry}>Coba lagi</button>
    </section>
  );
}
