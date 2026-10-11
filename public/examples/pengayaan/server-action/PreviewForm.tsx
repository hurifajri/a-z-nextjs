"use client";
import { useActionState, useState } from "react";
import { previewSuggestion } from "./actions";
export default function PreviewForm() {
  const [state, action, pending] = useActionState(previewSuggestion, {
    message: "",
  });
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  return (
    <form action={action} className="grid gap-3">
      <label>
        Judul buku
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Alasan
        <textarea
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Memeriksa…" : "Periksa usulan"}
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
