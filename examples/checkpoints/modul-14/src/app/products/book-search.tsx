"use client";
import { useSearchParams } from "next/navigation";
import { useBookSearch } from "@/hooks/use-book-search";
import BookResults from "./book-results";
export default function BookSearch() {
  const keyword = (useSearchParams().get("q") ?? "").trim();
  const query = useBookSearch(keyword);
  if (keyword.length < 2) return <p>Isi minimal 2 karakter.</p>;
  if (query.isPending) return <p role="status">Menunggu data…</p>;
  return (
    <section>
      <p>Pencarian: {keyword}</p>
      <BookResults
        books={query.data}
        fetching={query.isFetching}
        failed={query.isError}
        onRefresh={() => void query.refetch()}
      />
    </section>
  );
}
