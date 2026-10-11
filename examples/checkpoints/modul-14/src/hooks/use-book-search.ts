"use client";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "@/lib/book-search";

export function useBookSearch(keyword: string) {
  return useQuery({
    queryKey: ["books", keyword],
    queryFn: ({ signal }) => searchBooks(keyword, signal),
    enabled: keyword.length >= 2,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
