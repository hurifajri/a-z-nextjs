"use client";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useSuggestionForm } from "@/hooks/use-suggestion-form";
import { Button } from "@/components/ui/button";
import TitleField from "./TitleField";
import ReasonField from "./ReasonField";

type Props = { suggestion?: BookSuggestion; onClose?: () => void };

export default function SuggestionForm({ suggestion, onClose }: Props) {
  const { form, mutation, submit, pending } = useSuggestionForm(suggestion);
  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <fieldset disabled={pending}>
        <legend>{suggestion ? "Edit usulan buku" : "Usulkan buku"}</legend>
        <TitleField form={form} />
        <ReasonField form={form} />
        <Button type="submit">
          {pending ? "Menyimpan…" : "Simpan usulan"}
        </Button>
        {onClose && (
          <Button type="button" onClick={onClose}>
            Tutup editor
          </Button>
        )}
      </fieldset>
      <p role="alert">{form.formState.errors.root?.server?.message}</p>
      {mutation.isSuccess && !form.formState.isDirty && (
        <p role="status">Usulan berhasil disimpan.</p>
      )}
    </form>
  );
}
