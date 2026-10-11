"use client";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function SearchForm() {
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    query.set("q", String(data.get("q") ?? "").trim());
    router.push(`/products?${query.toString()}`);
  }
  return (
    <form onSubmit={search}>
      <label htmlFor="book-query">Cari buku</label>
      <input id="book-query" name="q" className="border mx-2" />
      <button type="submit">Cari</button>
    </form>
  );
}
