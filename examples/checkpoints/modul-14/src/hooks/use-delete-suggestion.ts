"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { deleteSuggestion } from "@/lib/suggestions";

export function useDeleteSuggestion() {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const mutation = useMutation({
    mutationFn: deleteSuggestion,
    retry: false,
    onSuccess: () => {
      startTransition(() => router.refresh());
    },
  });
  return { mutation, pending: mutation.isPending || refreshing };
}
