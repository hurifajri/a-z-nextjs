"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Logout gagal");
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Belum berhasil keluar. Coba lagi.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={signOut}
      >
        {pending ? "Keluar…" : "Keluar"}
      </Button>
      <p role="alert">{error}</p>
    </div>
  );
}
