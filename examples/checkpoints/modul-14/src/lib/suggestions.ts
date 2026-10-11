export class SessionExpiredError extends Error {
  constructor() {
    super("Sesi berakhir. Masuk lagi di tab baru, lalu coba kembali.");
  }
}

import * as v from "valibot";
import type { BookSuggestionValues } from "./book-suggestion-schema";

const SavedSuggestionSchema = v.object({
  id: v.number(),
  title: v.string(),
  reason: v.string(),
});

export async function sendSuggestion(
  values: BookSuggestionValues,
  id?: number,
) {
  const editing = id !== undefined;
  const path = editing ? `/api/suggestions/${id}` : "/api/suggestions";
  const res = await fetch(path, {
    method: editing ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) throw new Error(`Penyimpanan: HTTP ${res.status}`);
  return v.parse(SavedSuggestionSchema, await res.json());
}

export async function deleteSuggestion(id: number) {
  const res = await fetch(`/api/suggestions/${id}`, {
    method: "DELETE",
  });
  if (res.status === 401) throw new SessionExpiredError();
  if (!res.ok) throw new Error(`Penghapusan: HTTP ${res.status}`);
}
