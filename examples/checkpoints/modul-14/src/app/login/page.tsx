"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") ?? "");
    const password = String(fields.get("password") ?? "");
    setPending(true);
    setError("");
    try {
      const result = registering
        ? await authClient.signUp.email({
            name: String(fields.get("name") ?? ""),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(
          "Belum berhasil. Periksa data atau coba masuk jika sudah punya akun.",
        );
        return;
      }
      router.replace("/suggestions");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi layanan. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">
        {registering ? "Daftar" : "Masuk"} Toko Belajar
      </h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={pending} className="grid gap-3">
          <legend className="sr-only">Data akun</legend>
          {registering && (
            <label className="grid gap-1">
              Nama{" "}
              <input
                name="name"
                autoComplete="name"
                required
                className="border p-2"
              />
            </label>
          )}
          <>
            <label className="grid gap-1">
              Email{" "}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border p-2"
              />
            </label>
            <label className="grid gap-1">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={15}
                maxLength={128}
                autoComplete={registering ? "new-password" : "current-password"}
                className="border p-2"
              />
            </label>
          </>

          <p className="text-sm">
            Gunakan passphrase 15–128 karakter untuk akun latihan.
          </p>
          <>
            <Button type="submit">
              {pending ? "Memproses…" : registering ? "Daftar" : "Masuk"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRegistering(!registering);
                setError("");
              }}
            >
              {registering
                ? "Sudah punya akun? Masuk"
                : "Belum punya akun? Daftar"}
            </Button>
          </>
        </fieldset>
        <p role="alert">{error}</p>
      </form>
    </main>
  );
}
