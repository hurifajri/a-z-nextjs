---
layout: intro
badge: "MODUL 14"
badgeColor: "yellow"
level: 1
---

## 14. Login, Sesi, dan Hak Akses Toko Belajar

Tambahkan akun agar setiap pengguna dapat melihat dan mengelola usulan bukunya sendiri.

<!--
Lanjutkan proyek Modul 11–13: Next.js 16.3.7, React 19, Node.js 24 LTS, Drizzle 0.45.4, SQLite lokal, src/app.
cacheComponents dan partialPrefetching tetap false. Form, kartu, dialog, QueryProvider, serta katalog tetap dipakai.
Latihan memakai Better Auth 1.7.7 dengan sesi database. JWT dan Proxy menjadi pengayaan setelah alur inti berjalan.
Audit sumber: 9 Oktober 2026. Testing otomatis dibahas pada Modul 15; pilihan deployment pada Modul 16.
-->

---
class: module-content
---

### Siapa yang Boleh Mengubah Usulan?

Pada modul 11–13, latihan hanya dipakai satu orang secara lokal.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click><strong>Aisyah</strong><br/>Membuat usulan “Learning React”.</BrutalCard>
  <BrutalCard v-click><strong>Hasan</strong><br/>Membuat usulan “Eloquent JavaScript”.</BrutalCard>
  <BrutalCard v-click><strong>Aturan baru</strong><br/>Setiap akun hanya melihat, mengedit, dan menghapus usulan miliknya.</BrutalCard>
</div>

<v-clicks>

- Katalog buku tetap dapat dibuka tanpa login.
- Halaman `/suggestions` dan API usulan memerlukan sesi yang valid.
- Mengganti ID di URL tidak boleh memberikan akses ke usulan akun lain.

</v-clicks>

<!--
Privasi daftar usulan adalah keputusan fitur latihan ini. Aplikasi lain dapat memilih daftar publik dengan aturan berbeda.
Jangan menganggap menyembunyikan tombol Edit/Hapus sudah menegakkan aturan; endpoint tetap bisa dipanggil langsung.
-->

---
class: module-content
---

### Kenali Tiga Tanggung Jawab

| Konsep      | Pertanyaan                  | Contoh di Toko Belajar                |
| ----------- | --------------------------- | ------------------------------------- |
| Autentikasi | Siapa yang sedang masuk?    | Periksa email dan password saat login |
| Sesi        | Apakah login masih berlaku? | Periksa sesi pada request berikutnya  |
| Otorisasi   | Apa yang boleh dilakukan?   | Batasi query ke usulan milik akun itu |

<v-clicks>

- Library auth menangani akun, kredensial, dan siklus sesi.
- Aplikasi menentukan aturan akses untuk usulan buku.
- Identitas pemilik berasal dari **sesi yang diverifikasi server**.

</v-clicks>

<!--
Sumber: https://nextjs.org/docs/app/guides/authentication
Sumber: https://better-auth.com/docs/concepts/session-management
-->

---
class: module-content
clicks: 3
---

### Ikuti Request: Siapa Boleh Mengubah Usulan?

Setiap permintaan perubahan harus melewati pemeriksaan di server.

<AuthFlow :step="$clicks" />

<BrutalCard v-click="3">Uji pembeda: Hasan mengganti ID usulannya dengan ID milik Aisyah. Usulan Aisyah harus tetap tidak berubah.</BrutalCard>

<!--
[click] Server memverifikasi sesi, bukan sekadar keberadaan cookie.
[click] Query dibatasi oleh ID usulan dan userId dari sesi.
[click] Mutasi hanya terjadi bila target berada dalam cakupan akun tersebut.
-->

---
class: module-content
---

### Kerjakan dalam Tiga Tahap

<v-clicks>

1. **Akun dan sesi** — pasang Better Auth, siapkan tabel, buat form daftar/login.
2. **Data milik pengguna** — simpan `userId`, batasi halaman dan semua endpoint usulan.
3. **Buktikan batas akses** — uji dua akun, logout, dan request langsung ke API.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">Better Auth dipilih untuk satu jalur latihan yang lengkap. Kita memakai database SQLite yang sama melalui adapter Drizzle.</BrutalCard>

<!--
Library mengelola hashing password, cookie, dan validasi sesi. Tidak ada fungsi auth fiktif atau backend login yang diasumsikan tersedia.
Selesaikan seluruh tahap sebelum menganggap fitur multi-user selesai. Jalankan latihan pada database lokal, dengan server dihentikan saat migrasi.
Sumber: https://better-auth.com/docs/installation
Sumber: https://better-auth.com/docs/adapters/drizzle
-->

---
class: module-content
---

### 1. Pasang Library dan Siapkan Konfigurasi Lokal

Di root proyek Next.js:

```bash
npm install --save-exact better-auth@1.7.7 @better-auth/drizzle-adapter@1.7.7
npm install -D --save-exact auth@1.7.7
npx auth secret
```

Salin secret yang dihasilkan ke **`.env`**; ganti nilai contoh berikut.

```dotenv
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=GANTI_DENGAN_HASIL_PERINTAH_AUTH_SECRET
```

<v-clicks>

- Gunakan origin yang sama di browser dan konfigurasi, termasuk port.
- Masukkan `.env` dan `.env.local` ke `.gitignore`; secret tetap di server.
- Jalankan ulang server setelah mengubah environment variable.

</v-clicks>

<!--
Jangan menambahkan NEXT_PUBLIC_ pada secret. BETTER_AUTH_URL berisi origin tanpa slash penutup untuk contoh pemeriksaan Origin di modul ini.
Jika port 3000 terpakai, pilih port lain secara eksplisit dan ubah URL konfigurasi. Jangan mencampur localhost dengan 127.0.0.1 saat menguji cookie.
Sumber: https://better-auth.com/docs/installation
Sumber: https://better-auth.com/docs/concepts/cli
-->

---
class: module-content
layout: two-cols
---

### 2. Satu Konfigurasi untuk Runtime dan Generator

Buat dua file berikut; konfigurasi generator berada di **root proyek**.

::left::

#### src/lib/auth-options.ts

```ts
import type { BetterAuthOptions } from "better-auth";

export const authOptions = {
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 15,
  },
  session: {
    cookieCache: { enabled: false },
  },
} satisfies BetterAuthOptions;
```

::right::

#### auth-schema.config.ts

```ts
import { betterAuth } from "better-auth";
import { authOptions } from "./src/lib/auth-options";

export const auth = betterAuth(authOptions);
```

Generator memakai pilihan auth yang sama, tanpa membuka koneksi database aplikasi.

::bottom::

<BrutalCard v-click class="text-sm">Cookie cache dinonaktifkan agar pemeriksaan sesi mengikuti database. File generator tidak menjadi endpoint aplikasi.</BrutalCard>

<!--
Konfigurasi generator terpisah karena CLI berjalan di luar Next.js dan tidak dapat memuat penanda server-only dari koneksi Modul 11.
Jangan menghapus server-only pada kode runtime hanya agar CLI dapat berjalan. CLI 1.7.7 mendukung generate --adapter drizzle --dialect sqlite tanpa adapter database terpasang di konfigurasi generator.
Sumber: https://better-auth.com/docs/concepts/cli
Sumber: https://better-auth.com/docs/concepts/session-management
-->

---
class: module-content
---

### 3. Hasilkan Schema Auth

Jalankan dari root proyek setelah mengisi `.env`.

```bash
npx auth generate --config auth-schema.config.ts \
  --adapter drizzle --dialect sqlite \
  --output src/db/auth-schema.ts
```

Periksa file yang dihasilkan, lalu **ubah properti `schema`** di `drizzle.config.ts`:

```ts
schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
```

<v-clicks>

- Tabel auth mencakup `user`, `session`, `account`, dan `verification`.
- Schema usulan dari modul 11 tetap ikut dibaca Drizzle Kit.
- `generate` di atas menghasilkan definisi TypeScript; tabel belum dibuat.

</v-clicks>

<!--
Jangan mengganti seluruh drizzle.config.ts dengan satu baris schema. dialect, out, dan dbCredentials dari Modul 11 tetap diperlukan.
Berkas auth-schema.ts dihasilkan CLI; simpan hasilnya di Git. Jika opsi/plugin auth berubah, tinjau hasil generate berikutnya beserta migrasi.
Sumber: https://better-auth.com/docs/adapters/drizzle
Sumber: https://better-auth.com/docs/concepts/database
-->

---
class: module-content
---

### 4. Tambahkan Pemilik pada Schema Usulan

**Ganti isi `src/db/schema.ts`** dengan schema lama yang diperluas:

```ts {1-2|4-9|11-15|all}
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const suggestions = sqliteTable("book_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
  userId: text("user_id").references(() => user.id),
});

export const suggestionFields = {
  id: suggestions.id,
  title: suggestions.title,
  reason: suggestions.reason,
};
```

<BrutalCard v-click class="mt-3 text-sm">Baris lama tetap tersimpan dengan <code>userId = null</code>. Baris itu tidak otomatis menjadi milik akun pertama yang mendaftar.</BrutalCard>

<!--
Nullable dipilih agar migrasi menjaga data single-user lama tanpa mengarang kepemilikan. Query per akun nanti tidak menampilkan baris tanpa pemilik.
Setiap POST baru wajib mengisi userId dari sesi. Migrasi data lama ke pemilik tertentu memerlukan keputusan tersendiri, bukan menebak akun.
suggestionFields memilih field respons agar userId tetap internal dan BookSuggestion modul sebelumnya tetap cocok.
Sumber: https://orm.drizzle.team/docs/sqlite/column-types
-->

---
class: module-content
---

### 5. Terapkan Migrasi setelah Memeriksa SQL

Hentikan server pengembangan, lalu buat salinan database latihan.

```bash
cp local.db local.before-auth.db
npx drizzle-kit generate
```

Baca SQL di folder `drizzle`, lalu terapkan:

```bash
npx drizzle-kit migrate
```

<v-clicks>

- Pastikan tabel usulan tetap ada dan memperoleh kolom `user_id`.
- Pastikan tabel auth dibuat sesuai file hasil generator.
- Tambahkan `/local.before-auth.db*` ke `.gitignore`.
- Simpan schema, migrasi, dan lockfile; berkas database tetap lokal.

</v-clicks>

<!--
Salinan dibuat setelah proses aplikasi dihentikan. Bila sengaja mengaktifkan WAL, lakukan backup SQLite yang sesuai atau checkpoint terlebih dahulu; jangan menyalin main file saat write masih aktif.
CLI auth migrate ditujukan untuk adapter bawaan Kysely. Pada jalur Drizzle ini gunakan drizzle-kit generate dan migrate.
Sumber: https://orm.drizzle.team/docs/drizzle-kit-generate
Sumber: https://orm.drizzle.team/docs/drizzle-kit-migrate
Sumber: https://better-auth.com/docs/concepts/cli
-->

---
class: module-content
---

### 6. Hubungkan Auth ke Database Aplikasi

Buat **`src/lib/auth.ts`** untuk runtime server.

```ts {1-5|7-14|all}
import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { authOptions } from "./auth-options";

export const auth = betterAuth({
  ...authOptions,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchema,
  }),
});
```

<v-clicks>

- Koneksi `db` dari modul 11 tetap digunakan.
- Adapter menerima schema auth yang baru dihasilkan.
- Better Auth membaca `BETTER_AUTH_URL` dan `BETTER_AUTH_SECRET` dari environment.

</v-clicks>

<!--
Jalur ini memakai adapter Relations v1 yang cocok dengan Drizzle stabil 0.45.4. Jangan mengganti import menjadi /relations-v2 tanpa migrasi versi ORM yang sesuai.
Sumber: https://better-auth.com/docs/adapters/drizzle
Sumber: https://better-auth.com/docs/installation
-->

---
class: module-content
layout: two-cols
---

### 7. Pasang Endpoint Auth dan Client-nya

Buat kedua file ini, lalu jalankan kembali server Next.js.

::left::

#### src/app/api/auth/[...all]/route.ts

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";
export const { GET, POST } = toNextJsHandler(auth);
```

Library menangani operasi daftar, login, sesi, dan logout di bawah `/api/auth`.

::right::

#### src/lib/auth-client.ts

```ts
"use client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

Client memanggil endpoint pada origin yang sama.

<!--
Bentuk route [...all] adalah catch-all segment. File ini tidak menggantikan endpoint /api/suggestions.
Latihan menggunakan client HTTP, sehingga tidak membutuhkan nextCookies plugin untuk login melalui Server Actions.
Sumber: https://better-auth.com/docs/integrations/next
-->

---
class: module-content
---

### 8. Mulai Halaman Daftar dan Login

Buat **`src/app/login/page.tsx`**. Kode pada empat slide berikut melengkapi file ini.

```tsx
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
  // Tambahkan handleSubmit di sini.
  return null; // Ganti dengan form pada slide berikutnya.
}
```

<v-clicks>

- Satu halaman memiliki mode **Masuk** dan **Daftar**.
- `pending` menonaktifkan form selama request berjalan.
- `error` memberi umpan balik tanpa menampilkan password.

</v-clicks>

---
class: module-content
zoom: 0.85
---

### Login: Kirim Data melalui Client Library

Tambahkan handler **di dalam `LoginPage`**, sebelum `return`.

```tsx
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
```

<!--
signUp.email memakai auto sign-in bawaan pada konfigurasi ini. Hanya navigasi setelah hasil library tidak mengandung error.
Tidak menyimpan token atau password ke localStorage. Server dan library mengelola cookie sesi.
Untuk latihan lokal ini email verification belum diaktifkan; konteksnya dijelaskan pada slide batas latihan.
Sumber: https://better-auth.com/docs/authentication/email-password
-->

---
class: module-content
zoom: 0.85
---

### Login: Buat Field yang Memiliki Label

**Ganti `return null`** dengan form berikut. Dua slide berikut melengkapi field dan tombolnya.

```tsx
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
        {/* Tambahkan field email dan password di sini. */}
        <p className="text-sm">
          Gunakan passphrase 15–128 karakter untuk akun latihan.
        </p>
        {/* Tambahkan tombol di sini. */}
      </fieldset>
      <p role="alert">{error}</p>
    </form>
  </main>
);
```

<!--
Label membungkus input sehingga keterkaitannya jelas. Validasi HTML membantu pengguna; library tetap memvalidasi di server.
Password tidak di-trim karena spasi dapat menjadi bagian passphrase.
-->

---
class: module-content
zoom: 0.85
---

### Login: Lengkapi Email dan Password

Ganti komentar **“Tambahkan field email dan password di sini”** dengan fragment berikut.

```tsx
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
```

<!--
Autocomplete membedakan pembuatan password baru dan pengisian password akun yang sudah ada.
Input tetap berada dalam fieldset disabled dari slide sebelumnya.
-->

---
class: module-content
---

### Login: Lengkapi Tombol dan Pergantian Mode

Ganti komentar **“Tambahkan tombol di sini”** dengan fragment berikut.

```tsx
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
    {registering ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
  </Button>
</>
```

<v-clicks>

- `type="button"` pada pergantian mode mencegah submit tanpa sengaja.
- Kedua tombol berada di dalam fieldset yang disabled saat pending.
- Coba `/login`: daftar akun Aisyah, lalu periksa tabel `user` dan `session` lokal.

</v-clicks>

<!--
Fragment <>...</> membungkus dua elemen tanpa menambah pembungkus DOM.
Checkpoint ini hanya membuktikan akun dan sesi. Pembatasan akses halaman/API diterapkan pada tahap berikut.
-->

---
class: module-content
---

### 9. Buat Pembaca Sesi yang Nyata

Buat **`src/lib/session.ts`**; file ini dipakai oleh halaman server.

```ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getVerifiedSession() {
  return auth.api.getSession({ headers: await headers() });
}
```

<v-clicks>

- `getVerifiedSession` adalah fungsi aplikasi yang kita buat.
- Better Auth memeriksa cookie dan sesi pada database.
- Hasil valid menyediakan `session.user.id`; tanpa sesi valid hasilnya `null`.
- Kegagalan layanan dibiarkan menjadi error, sehingga tidak disamakan dengan logout.

</v-clicks>

<!--
Tidak memakai try/catch yang mengubah setiap error database menjadi null.
Wrapper ini tidak dicache lintas pengguna. Pemeriksaan dilakukan saat halaman mengakses data.
Sumber: https://better-auth.com/docs/integrations/next
Sumber: https://better-auth.com/docs/concepts/session-management
-->

---
class: module-content
---

### 10. Batasi Data pada Halaman Usulan

Di **`src/app/suggestions/page.tsx`**, tambahkan import berikut; perluas import schema lama.

```ts
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/session";
import { suggestions, suggestionFields } from "@/db/schema";
```

Setelah `await connection()`, **ganti query `items` lama** dengan:

```ts
const session = await getVerifiedSession();
if (!session) redirect("/login");
const items = await db
  .select(suggestionFields)
  .from(suggestions)
  .where(eq(suggestions.userId, session.user.id))
  .orderBy(suggestions.id);
```

<BrutalCard v-click class="mt-3 text-sm">Data lama tanpa pemilik tetap tersimpan, tetapi daftar akun baru akan kosong. Semua usulan baru harus memperoleh pemilik dari sesi.</BrutalCard>

<!--
Jangan hanya memindahkan cek sesi ke layout; lakukan dekat query. Halaman tetap membaca database langsung, jadi guard API saja belum cukup.
Pertahankan return JSX Modul 12; form dan kartu yang sama dipakai setelah query ini.
Sumber: https://nextjs.org/docs/app/guides/authentication
Sumber: https://orm.drizzle.team/docs/sqlite/select
-->

---
class: module-content
---

### 11. Periksa Sesi dan Origin pada API Usulan

Buat **`src/lib/suggestion-access.ts`**. Origin adalah asal situs yang mengirim request.

```ts
import "server-only";
import { auth } from "./auth";

export async function requireSuggestionSession(request: Request) {
  if (request.method !== "GET") {
    const origin = process.env.BETTER_AUTH_URL;
    if (!origin) throw new Error("BETTER_AUTH_URL belum diisi.");
    if (request.headers.get("origin") !== origin) {
      return Response.json({ error: "Origin ditolak." }, { status: 403 });
    }
  }
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Silakan masuk kembali." }, { status: 401 });
  }
  return session;
}
```

<!--
Ini kebijakan browser same-origin untuk POST/PATCH/DELETE latihan. Request tanpa Origin ditolak; REST client pengujian harus mengirim Origin konfigurasi.
Origin tidak dipercaya sebagai identitas pengguna; sesi tetap diperiksa. Nilai origin tepercaya berasal dari konfigurasi server, bukan header Host kiriman request.
Better Auth melindungi endpoint auth miliknya. Endpoint usulan buatan kita memerlukan pemeriksaannya sendiri.
Sumber: https://better-auth.com/docs/reference/security
Sumber: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
-->

---
class: module-content
---

### 12. GET API Juga Membatasi Pemilik

Pada **`src/app/api/suggestions/route.ts`**, tambahkan import `eq` dan guard, lalu perluas import schema.

```ts
import { eq } from "drizzle-orm";
import { requireSuggestionSession } from "@/lib/suggestion-access";
import { suggestions, suggestionFields } from "@/db/schema";
```

**Ganti fungsi GET**; import Valibot, `db`, dan schema input lama tetap dipakai POST.

```ts
export async function GET(request: Request) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
  const items = await db
    .select(suggestionFields)
    .from(suggestions)
    .where(eq(suggestions.userId, session.user.id))
    .orderBy(suggestions.id);
  return Response.json(items);
}
```

<!--
Guard mengembalikan Response penolakan atau objek sesi. instanceof membedakan keduanya sebelum user.id dipakai.
GET halaman dan GET API merupakan dua jalur akses berbeda; keduanya harus menerapkan pembatasan yang sama.
-->

---
class: module-content
zoom: 0.9
---

### 13. POST Menetapkan Pemilik dari Sesi

**Ganti fungsi POST** pada `src/app/api/suggestions/route.ts`.

```ts
export async function POST(request: Request) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
  const input = v.safeParse(
    BookSuggestionSchema,
    await request.json().catch(() => null),
  );
  if (!input.success) {
    return Response.json(
      { error: "Judul atau alasan belum valid." },
      { status: 400 },
    );
  }
  const [suggestion] = await db
    .insert(suggestions)
    .values({
      title: input.output.title,
      reason: input.output.reason,
      userId: session.user.id,
    })
    .returning(suggestionFields);
  return Response.json(suggestion, { status: 201 });
}
```

<BrutalCard v-click class="mt-3 text-sm">Form tetap mengirim <code>title</code> dan <code>reason</code>. Server menentukan <code>userId</code> dan mengembalikan field respons yang sama seperti modul 13.</BrutalCard>

<!--
BookSuggestionSchema berupa v.object membuang field tambahan. Menyebut title/reason/userId secara eksplisit memastikan body tidak dapat memilih pemilik.
-->

---
class: module-content
zoom: 0.85
---

### 14. PATCH Memeriksa ID dan Pemilik Sekaligus

Di **`src/app/api/suggestions/[id]/route.ts`**, tambahkan `and` ke import Drizzle, `suggestionFields` ke import schema, serta import guard. **Ganti fungsi PATCH**:

```ts
export async function PATCH(request: Request, { params }: Context) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
  const id = v.safeParse(SuggestionIdSchema, (await params).id);
  const input = v.safeParse(
    UpdateBookSuggestionSchema,
    await request.json().catch(() => null),
  );
  if (!id.success || !input.success) {
    return Response.json({ error: "Input tidak valid." }, { status: 400 });
  }
  const [suggestion] = await db
    .update(suggestions)
    .set({ title: input.output.title, reason: input.output.reason })
    .where(
      and(
        eq(suggestions.id, id.output),
        eq(suggestions.userId, session.user.id),
      ),
    )
    .returning(suggestionFields);
  if (!suggestion) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return Response.json(suggestion);
}
```

<!--
Import guard sama persis dengan route daftar: import { requireSuggestionSession } from "@/lib/suggestion-access".
Tetap gunakan Context dan runtime nodejs dari Modul 11. Tidak perlu query terpisah untuk mengecek pemilik sebelum update.
404 dipakai untuk target yang tidak ada maupun milik akun lain, agar respons tidak membocorkan keberadaan resource tersebut.
Sumber: https://orm.drizzle.team/docs/sqlite/update
-->

---
class: module-content
---

### 15. DELETE Menggunakan Batas yang Sama

**Ganti fungsi DELETE** pada `src/app/api/suggestions/[id]/route.ts`.

```ts
export async function DELETE(request: Request, { params }: Context) {
  const session = await requireSuggestionSession(request);
  if (session instanceof Response) return session;
  const id = v.safeParse(SuggestionIdSchema, (await params).id);
  if (!id.success) {
    return Response.json({ error: "ID tidak valid." }, { status: 400 });
  }
  const [deleted] = await db
    .delete(suggestions)
    .where(
      and(
        eq(suggestions.id, id.output),
        eq(suggestions.userId, session.user.id),
      ),
    )
    .returning({ id: suggestions.id });
  if (!deleted) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
```

<!--
Parameter _request di contoh lama kini menjadi request karena header dan metode dipakai guard.
Berhasil tetap 204 tanpa body. Client modul 11–13 tidak perlu mengubah kontrak sukses.
Sumber: https://orm.drizzle.team/docs/sqlite/delete
-->

---
class: module-content
zoom: 0.9
---

### 16. Tambahkan Tombol Logout

Buat **`src/app/suggestions/SignOutButton.tsx`**. Slide berikut melengkapi `return`.

```tsx
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
  return null;
}
```

<!--
Logout memanggil library agar sesi server dicabut dan cookie dihapus. Navigasi saja tidak mengakhiri sesi.
Sumber: https://better-auth.com/docs/authentication/email-password
-->

---
class: module-content
---

### Logout: Hubungkan ke Header Halaman

**Ganti `return null`** pada `SignOutButton`:

```tsx
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
```

Di `suggestions/page.tsx`, import `SignOutButton` dari `"./SignOutButton"`, lalu ganti `<SuggestionHelp />` di header dengan:

```tsx
<div className="flex flex-wrap items-start gap-2">
  <SuggestionHelp />
  <SignOutButton />
</div>
```

Ubah judul daftar menjadi **“Usulan saya”** dan pesan kosong menjadi **“Belum ada usulan untuk akun ini.”**

<!--
Pertahankan judul utama, grid, dialog panduan, dan kartu Modul 12. Dengan pembatasan server, setiap kartu yang tampil memang milik akun aktif.
-->

---
class: module-content
---

### 17. Beri Pesan ketika Sesi Berakhir

Di **`src/lib/suggestions.ts`**, tambahkan kelas error kecil berikut setelah import.

```ts
export class SessionExpiredError extends Error {
  constructor() {
    super("Sesi berakhir. Masuk lagi di tab baru, lalu coba kembali.");
  }
}
```

Pada **kedua helper**, tambahkan pemeriksaan ini sebelum `if (!res.ok)`:

```ts
if (res.status === 401) throw new SessionExpiredError();
```

<v-clicks>

- Kontrak berhasil tetap sama: POST/PATCH berisi JSON, DELETE kosong.
- Error sesi bisa dikenali UI tanpa mengandalkan teks dari backend.
- Simpan draf input agar peserta dapat login kembali sebelum mencoba ulang.

</v-clicks>

<!--
Ini kelas Error turunan sederhana; instanceof pada UI membedakan sesi berakhir dari kegagalan lain.
Respons 401 tidak di-retry otomatis. Jaringan gagal juga tidak membuktikan write belum diproses; tetap periksa daftar sebelum mengulang.
-->

---
class: module-content
---

### Sesi Berakhir: Pertahankan Input dan Tampilkan Tindakan

Import `SessionExpiredError` dari `@/lib/suggestions` pada **hook form** dan **SuggestionItem**.

Di `use-suggestion-form.ts`, ganti blok `catch` dalam `submit`:

```ts
catch (error) {
  form.setError("root.server", {
    message: error instanceof SessionExpiredError
      ? error.message
      : "Penyimpanan belum terkonfirmasi. Input tetap ada.",
  });
}
```

Pada `SuggestionItem.tsx`, ganti isi pesan error penghapusan:

```tsx
<p role="alert">
  {mutation.isError &&
    (mutation.error instanceof SessionExpiredError
      ? mutation.error.message
      : "Penghapusan bermasalah. Periksa daftar lagi.")}
</p>
```

<!--
Instruksi masuk di tab baru menjaga nilai form pada tab lama. Setelah login, kirim ulang hanya jika penyimpanan sebelumnya belum terjadi.
Reset form tetap hanya dijalankan pada hasil sukses, seperti Modul 11. Jangan redirect otomatis saat gagal lalu menghilangkan draf.
-->

---
class: module-content
---

### 18. Perbarui Kontrak API dari Modul 13

Di `public/openapi.yaml`, tambahkan `securitySchemes` di bawah `components` dan `security` pada root dokumen.

```yaml
components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: better-auth.session_token
  # schemas dan responses lama tetap di sini
security:
  - sessionCookie: []
```

<v-clicks>

- Perbarui versi/deskripsi API; GET kini berisi **usulan milik akun aktif**.
- Dokumentasikan `401` pada semua operasi dan `403` pada mutasi.
- PATCH/DELETE dapat menghasilkan `404` untuk target di luar akun tersebut.
- Login melalui `/login`, lalu gunakan Swagger UI pada origin yang sama.

</v-clicks>

<!--
Ini patch pada dokumen lama, bukan membuat components kedua. Tambahkan response 401/403 dengan schema Error yang sama; perbarui info.version menjadi 2.0.0 karena autentikasi kini wajib. Ubah info.description yang sebelumnya menyebut latihan single-user menjadi latihan dengan akun dan sesi wajib.
Nama cookie di sini untuk HTTP lokal. Production memakai cookie Secure dan dapat memakai prefix __Secure-; sesuaikan kontrak dengan konfigurasi nyata.
Swagger UI tidak dapat menyetel cookie HttpOnly lewat tombol Authorize. Browser mengirim cookie hasil login pada request same-origin. Salin-tempel cookie bukan alur latihan.
Sumber: https://swagger.io/docs/specification/v3_0/authentication/cookie-authentication/
Sumber: https://better-auth.com/docs/concepts/cookies
-->

---
class: module-content
---

### Checkpoint: Dua Akun, Dua Daftar Usulan

Gunakan dua profil browser terpisah: akun Aisyah dan akun Hasan.

| Percobaan                             | Hasil yang diharapkan                   |
| ------------------------------------- | --------------------------------------- |
| Tanpa login membuka `/suggestions`    | Berpindah ke `/login`                   |
| Tanpa sesi memanggil GET API          | `401`                                   |
| Aisyah menambah usulan                | `201`; hanya muncul dalam daftar Aisyah |
| Hasan PATCH/DELETE ID usulan Aisyah   | `404`; data Aisyah tetap sama           |
| Aisyah mengedit/menghapus usulannya   | `200` / `204` sesuai operasi            |
| Mutasi dari origin lain               | `403`; data tetap sama                  |
| Logout lalu request memakai sesi lama | `401`                                   |

<!--
Untuk kasus lintas akun, catat ID Aisyah dari respons API, lalu uji request dari profil Hasan memakai Swagger UI atau console origin aplikasi.
Coba POST dengan userId Aisyah pada body Hasan: server tetap mengisi pemilik dari sesi Hasan. PATCH dengan field tambahan userId harus 400.
Uji sesi palsu/kedaluwarsa dan sesi dicabut ketika tab lama masih berisi draf. Form tetap berisi draf dan menampilkan pesan login ulang.
-->

---
class: module-content
layout: two-cols
---

### Pahami Cookie dan Siklus Sesi

Library mengelola cookie; aplikasi tetap menentukan tempat pemeriksaan akses.

::left::

#### Saat Login Berhasil

- Server membuat sesi di database.
- Browser menerima cookie sesi HttpOnly.
- Browser mengirim cookie pada request berikutnya.
- Server memeriksa sesi sebelum mengakses data.

::right::

#### Saat Sesi Berakhir

- Sesi kedaluwarsa atau dicabut → akses ditolak.
- Logout mencabut sesi dan menghapus cookie.
- UI memberi jalan untuk login ulang.
- Cookie cache latihan dimatikan agar pencabutan segera diperiksa ke database.

<!--
HttpOnly membatasi akses cookie oleh JavaScript; XSS masih dapat menjalankan aksi sebagai pengguna.
Secure dipakai dengan HTTPS pada production. SameSite membantu membatasi pengiriman lintas situs; pemeriksaan Origin untuk mutasi tetap diterapkan pada endpoint kita.
Hindari menyimpan session identifier pada localStorage.
Sumber: https://better-auth.com/docs/concepts/session-management
Sumber: https://better-auth.com/docs/concepts/cookies
Sumber: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
-->

---
class: module-content
---

### Batas Latihan Akun Lokal

Alur inti membuktikan **daftar, login, sesi, logout, dan kepemilikan usulan**.

<v-clicks>

- Email latihan belum diverifikasi; gunakan alamat fiktif untuk dua akun lokal.
- Sebelum menerima pengguna nyata, siapkan verifikasi email dan pemulihan password.
- Tentukan pembatasan percobaan login serta penyimpanan rate limit sesuai deployment.
- Gunakan HTTPS, secret environment yang sesuai, dan penyimpanan database yang persisten.
- Kegagalan database tidak boleh dilaporkan sebagai password salah atau sesi habis.

</v-clicks>

<!--
Ini batas konkret konfigurasi yang digunakan: emailAndPassword enabled tanpa mail transport/verification/reset password.
Tidak mengklaim contoh lokal sudah mencakup seluruh kebutuhan akun production. Modul 16 membahas deployment; alur email bisa menjadi latihan lanjutan tersendiri.
Sumber: https://better-auth.com/docs/authentication/email-password
Sumber: https://better-auth.com/docs/concepts/rate-limit
-->

---
class: module-content
---

### Pengayaan: Proxy untuk Redirect Awal

Opsional: buat **`src/proxy.ts`** setelah halaman dan API memeriksa akses sendiri.

```ts
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/suggestions/:path*"] };
```

<v-clicks>

- Proxy dapat mempercepat keputusan redirect ketika cookie belum ada.
- Cookie palsu atau kedaluwarsa masih harus ditolak oleh pemeriksaan sesi server.
- API tetap memeriksa sesi meskipun path-nya tidak masuk matcher ini.

</v-clicks>

<!--
Pada Next.js 16, nama konvensi Middleware berubah menjadi Proxy. Lokasinya sejajar folder app; proyek kita memakai src/app.
getSessionCookie membaca nama cookie yang sesuai konvensi Better Auth. Jangan hard-code cookie bernama session dari contoh library lain.
Jangan redirect dari /login hanya karena cookie ada; sesi tidak valid dapat menyebabkan loop.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
Sumber: https://better-auth.com/docs/integrations/next
-->

---
class: module-content
---

### Pengayaan: Di Mana JWT Berperan?

JWT adalah format token berisi claims. Bentuk JWT bertanda tangan yang sering ditemui memiliki tiga bagian:

```text
header.payload.signature
```

<div class="grid grid-cols-3 gap-3 mt-4 text-sm">
  <BrutalCard class="bg-red-100 text-center" v-click><strong>Header</strong><br/>Informasi tipe dan algoritma.</BrutalCard>
  <BrutalCard class="bg-purple-100 text-center" v-click><strong>Payload</strong><br/>Claims, misalnya subject, audience, dan waktu kedaluwarsa.</BrutalCard>
  <BrutalCard class="bg-blue-100 text-center" v-click><strong>Signature</strong><br/>Bagian untuk memverifikasi integritas dan penerbit yang dipercaya.</BrutalCard>
</div>

<BrutalCard v-click class="mt-4 text-sm">Decode hanya membaca isi. Server harus memverifikasi signature, algoritma yang diizinkan, serta claims yang diwajibkan aplikasinya.</BrutalCard>

<!--
JWS compact bertanda tangan memiliki tiga bagian; JWT terenkripsi (JWE) memiliki bentuk berbeda. Jangan menyatakan semua JWT selalu tiga bagian.
JWT bertanda tangan umumnya dapat dibaca payload-nya; hindari secret/password. Jangan membuat implementasi kriptografi sendiri.
Sesi database dengan cookie opaque pada latihan inti tetap valid; JWT bukan syarat agar aplikasi bisa login.
Sumber: https://www.rfc-editor.org/rfc/rfc7519.html
Sumber: https://www.rfc-editor.org/rfc/rfc8725.html
-->

---
class: module-content
---

### Pengayaan: Jika Ada Backend Terpisah

Sebagian backend meminta token melalui header `Authorization: Bearer ...`.

```text
Browser → endpoint aplikasi Next.js → API tim backend
  cookie       verifikasi sesi          verifikasi token
               periksa izin             dan izin resource
               pasang token upstream
```

<v-clicks>

- Baca kontrak backend untuk mengetahui jenis token dan masa berlakunya.
- Sesi aplikasi dan token untuk backend dapat memiliki siklus yang berbeda.
- Jika memakai pola ini, simpan token upstream di server dan batasi tujuan request.
- Tambahkan integrasi tersebut ketika tersedia backend yang memerlukannya.

</v-clicks>

<!--
Ini pengayaan arsitektur, bukan fungsi tambahan yang harus disalin agar latihan utama berjalan.
Istilah BFF (Backend for Frontend) merujuk perantara server untuk kebutuhan frontend. Backend tetap bertanggung jawab memeriksa token dan izin resource.
Jangan meneruskan semua cookie/header browser ke URL upstream sembarang, atau memasukkan token ke log.
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/
-->

---
class: module-content
---

### Cek Pemahaman: Sudah Login, Apakah Sudah Boleh?

<LearningCheck
  question="Hasan sudah login dan mengirim PATCH dengan ID usulan Aisyah. Pemeriksaan apa yang menentukan izin perubahan?"
  :options="[
    'Ada cookie dan tombol Edit terlihat di browser.',
    'Query dibatasi ID usulan dan ID pengguna dari sesi yang valid.',
    'Body request menyebut userId milik Aisyah.',
  ]"
  :answer="1"
  explanation="Sesi membuktikan identitas Hasan. Otorisasi memeriksa haknya atas usulan tertentu. Pembatasan ID dan userId dari sesi pada query membuat data akun lain tetap tidak berubah."
/>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 14

<v-clicks>

1. **Login dan Sesi**: library auth mengelola kredensial serta status masuk.
2. **Pemilik dari Server**: `userId` berasal dari sesi yang valid.
3. **Izin pada Setiap Akses**: halaman dan GET/POST/PATCH/DELETE memeriksa aturan.
4. **Buktikan dengan Dua Akun**: pengguna lain tidak dapat mengubah usulan kita.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">🚀 <strong>Selanjutnya di Modul 15:</strong> Mengubah pemeriksaan perilaku aplikasi menjadi pengujian otomatis.</BrutalCard>

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**.

::left::

#### Jalur Latihan

- [Better Auth: instalasi](https://better-auth.com/docs/installation)
- [CLI dan schema generator](https://better-auth.com/docs/concepts/cli)
- [Adapter Drizzle](https://better-auth.com/docs/adapters/drizzle)
- [Integrasi Next.js](https://better-auth.com/docs/integrations/next)
- [Email dan password](https://better-auth.com/docs/authentication/email-password)
- [Sesi](https://better-auth.com/docs/concepts/session-management)

::right::

#### Pemeriksaan Akses

- [Next.js: autentikasi](https://nextjs.org/docs/app/guides/authentication)
- [Better Auth: cookie](https://better-auth.com/docs/concepts/cookies)
- [Better Auth: keamanan](https://better-auth.com/docs/reference/security)
- [OWASP: pencegahan CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [RFC 7519: JWT](https://www.rfc-editor.org/rfc/rfc7519.html)
- [RFC 8725: penggunaan JWT](https://www.rfc-editor.org/rfc/rfc8725.html)
