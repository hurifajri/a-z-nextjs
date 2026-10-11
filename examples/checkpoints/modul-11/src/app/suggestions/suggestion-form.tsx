"use client";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useSuggestionForm } from "@/hooks/use-suggestion-form";
import TitleField from "./title-field";
import ReasonField from "./reason-field";

type Props = { suggestion?: BookSuggestion; onClose?: () => void };

export default function SuggestionForm({ suggestion, onClose }: Props) {
  const { form, mutation, submit, pending } = useSuggestionForm(suggestion);
  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <fieldset disabled={pending}>
        <legend>{suggestion ? "Edit usulan buku" : "Usulkan buku"}</legend>
        <TitleField form={form} />
        <ReasonField form={form} />
        <button type="submit">
          {pending ? "Menyimpan…" : "Simpan usulan"}
        </button>
        {onClose && (
          <button type="button" onClick={onClose}>
            Tutup editor
          </button>
        )}
      </fieldset>
      <p role="alert">{form.formState.errors.root?.server?.message}</p>
      {mutation.isSuccess && !form.formState.isDirty && (
        <p role="status">Usulan berhasil disimpan.</p>
      )}
    </form>
  );
}
