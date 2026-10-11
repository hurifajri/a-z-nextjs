"use client";
import { useState } from "react";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useDeleteSuggestion } from "@/hooks/use-delete-suggestion";
import SuggestionForm from "./SuggestionForm";

export default function SuggestionItem({
  suggestion,
}: {
  suggestion: BookSuggestion;
}) {
  const [editing, setEditing] = useState(false);
  const { mutation, pending } = useDeleteSuggestion();
  if (editing) {
    return (
      <li>
        <SuggestionForm
          suggestion={suggestion}
          onClose={() => setEditing(false)}
        />
      </li>
    );
  }
  return (
    <li className="space-y-2 border p-3">
      <h2>{suggestion.title}</h2>
      <p>{suggestion.reason}</p>
      <fieldset disabled={pending}>
        <legend className="sr-only">Aksi untuk {suggestion.title}</legend>
        <button type="button" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button type="button" onClick={() => mutation.mutate(suggestion.id)}>
          Hapus
        </button>
      </fieldset>
      <p role="status">{pending ? "Menghapus…" : ""}</p>
      <p role="alert">
        {mutation.isError && "Penghapusan bermasalah. Periksa daftar lagi."}
      </p>
    </li>
  );
}
