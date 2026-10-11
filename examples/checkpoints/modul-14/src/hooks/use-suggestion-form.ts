"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import {
  BookSuggestionSchema,
  type BookSuggestionValues,
  type BookSuggestion,
} from "@/lib/book-suggestion-schema";
import { sendSuggestion, SessionExpiredError } from "@/lib/suggestions";

export function useSuggestionForm(suggestion?: BookSuggestion) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const form = useForm<BookSuggestionValues>({
    resolver: valibotResolver(BookSuggestionSchema),
    defaultValues: {
      title: suggestion?.title ?? "",
      reason: suggestion?.reason ?? "",
    },
  });
  const mutation = useMutation({
    mutationFn: (values: BookSuggestionValues) =>
      sendSuggestion(values, suggestion?.id),
    retry: false,
  });
  async function submit(values: BookSuggestionValues) {
    form.clearErrors("root");
    try {
      const saved = await mutation.mutateAsync(values);
      form.reset({
        title: suggestion ? saved.title : "",
        reason: suggestion ? saved.reason : "",
      });
      startTransition(() => router.refresh());
    } catch (error) {
      form.setError("root.server", {
        message:
          error instanceof SessionExpiredError
            ? error.message
            : "Penyimpanan belum terkonfirmasi. Input tetap ada.",
      });
    }
  }
  return {
    form,
    mutation,
    submit,
    pending: form.formState.isSubmitting || refreshing,
  };
}
