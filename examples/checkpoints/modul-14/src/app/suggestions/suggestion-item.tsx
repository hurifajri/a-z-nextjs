"use client";
import { SessionExpiredError } from "@/lib/suggestions";
import { useState } from "react";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useDeleteSuggestion } from "@/hooks/use-delete-suggestion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import SuggestionForm from "./suggestion-form";

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
    <li className="min-w-0">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            <h3 className="wrap-anywhere">{suggestion.title}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap wrap-anywhere">
            {suggestion.reason}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <>
            <fieldset disabled={pending} className="flex flex-wrap gap-2">
              <legend className="sr-only">Aksi untuk {suggestion.title}</legend>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => mutation.mutate(suggestion.id)}
              >
                Hapus
              </Button>
            </fieldset>
            <p role="status">{pending ? "Menghapus…" : ""}</p>
            <p role="alert">
              {mutation.isError &&
                (mutation.error instanceof SessionExpiredError
                  ? mutation.error.message
                  : "Penghapusan bermasalah. Periksa daftar lagi.")}
            </p>
          </>
        </CardFooter>
      </Card>
    </li>
  );
}
