import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BookSuggestionValues } from "@/lib/book-suggestion-schema";
type Props = { form: UseFormReturn<BookSuggestionValues> };

export default function ReasonField({ form }: Props) {
  const id = useId();
  const error = form.formState.errors.reason;
  return (
    <div className="grid gap-1">
      <label htmlFor={id}>Alasan usulan</label>
      <textarea
        id={id}
        className="border p-2"
        readOnly={form.formState.isSubmitting}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        {...form.register("reason")}
      />
      <p id={`${id}-error`} role="alert">
        {error?.message}
      </p>
    </div>
  );
}
