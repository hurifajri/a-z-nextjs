---
layout: intro
badge: "MODUL 11"
badgeColor: "purple"
level: 1
---

## 11. Toko Belajar: Usulan Buku yang Tersimpan

Melanjutkan form usulan buku menjadi fitur tambah, baca, edit, dan hapus dengan penyimpanan SQLite.

<!--
Lanjutan Modul 10: sketsa Drizzle kini menjadi proyek yang dapat dijalankan.
Kerjakan di proyek Toko Belajar dari Modul 01–10, bukan di repositori slide.
Acuan kelas: Next.js 16.3.7, React 19, Node.js 24 LTS, src/app, alias @/* ke src/*.
Pertahankan cacheComponents: false dan partialPrefetching: false. QueryProvider dari Modul 08 tetap membungkus children pada root layout.
Latihan lokal single-user. Auth/ownership dibahas pada Modul 14; strategi deployment pada Modul 16.
Audit sumber: 9 Oktober 2026.
-->

---
class: module-content
---

### Satu Fitur, Tiga Tahap Belajar

Halaman **/suggestions** tetap bagian dari toko buku **Toko Belajar**.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click>
    <strong>Modul 09</strong><br/>
    Isi judul buku dan alasan. Kirim ke API simulasi.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>Modul 10</strong><br/>
    Buat API preview dan validasi schema yang sama di server.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>Modul 11</strong><br/>
    Simpan, tampilkan, edit, dan hapus usulan melalui API sendiri.
  </BrutalCard>
</div>

<v-clicks>

- Form, field, dan aturan dari modul 09 dipakai kembali.
- Usulan tersimpan di database lokal Toko Belajar.
- Data katalog Open Library tetap dibaca seperti modul 07–08.

</v-clicks>

<!--
Usulan adalah masukan judul buku bagi katalog toko; menambah usulan tidak menambahkan atau mengubah buku di Open Library.
Latihan tetap lokal single-user. Izin mengedit milik pengguna lain baru dapat dibatasi setelah sesi dan ownership pada Modul 14.
-->

---
class: module-content
layout: two-cols
---

### Dua Jalur Data dalam Proyek Ini

Database menyimpan usulan buku; browser menampilkan dan mengubahnya melalui UI.

::left::

#### Membaca Daftar Usulan

```text
/suggestions — halaman server
       ↓ query Drizzle
SQLite — book_suggestions
       ↓ array usulan
SuggestionItem — komponen client
```

Halaman membaca database langsung.

::right::

#### Mengirim Perubahan

```text
Form / tombol di browser
       ↓ fetch + useMutation
Route Handler → validasi
       ↓ query Drizzle
SQLite → respons HTTP
```

Setelah sukses, `router.refresh()` meminta hasil render server yang baru.

::bottom::

<BrutalCard v-click class="text-sm">
  <code>QueryProvider</code> dari modul 08 tetap dipakai. Daftar usulan dibaca Server Component, sehingga pembaruannya memakai refresh.
</BrutalCard>

<!--
Tidak ada useQuery untuk daftar usulan pada implementasi ini. Sketsa invalidateQueries modul 09 adalah alternatif jika daftar dibaca di client.
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
-->

---
class: module-content
---

### File Lama Dipakai Lagi, Backend Ditambahkan

```text
src/
├── app/suggestions/
│   ├── page.tsx, SuggestionForm.tsx   # Perbarui dari 09
│   ├── TitleField.tsx, ReasonField.tsx # Pakai dari 09
│   ├── SuggestionItem.tsx             # Baru
│   └── loading.tsx, error.tsx         # Baru
├── app/api/suggestions/
│   ├── preview/route.ts              # Dari modul 10
│   ├── route.ts                      # GET + POST baru
│   └── [id]/route.ts                 # PATCH + DELETE baru
├── db/schema.ts, db/index.ts          # Baru
├── lib/book-suggestion-schema.ts      # Tambahkan aturan ID/edit
├── lib/suggestions.ts                 # Ganti API simulasi
├── hooks/use-suggestion-form.ts       # Perbarui dari 09
└── hooks/use-delete-suggestion.ts     # Baru

drizzle.config.ts                     # Baru, di root proyek
```

<!--
Tanda koma merangkum beberapa file di folder yang sama; jangan membuat nama file yang mengandung koma.
Tidak perlu proyek baru atau form baru dengan domain berbeda. Root layout, QueryProvider, dan link /suggestions dari katalog tetap dipakai.
Jika suggestions sebelumnya berada dalam route group (shop), perbarui file UI di lokasi itu; URL tetap /suggestions.
-->

---
class: module-content
---

### 1. Pasang Paket Database

Jalankan dari **root proyek Next.js**, tempat `package.json` berada.

```bash
npm install drizzle-orm@0.45.4 better-sqlite3@13.0.3 server-only
npm install -D drizzle-kit@0.31.11 @types/better-sqlite3
```

| Paket            | Peran                                      |
| ---------------- | ------------------------------------------ |
| `drizzle-orm`    | Menulis query dan definisi tabel           |
| `better-sqlite3` | Menghubungkan Node.js ke SQLite lokal      |
| `drizzle-kit`    | Membuat dan menerapkan migrasi             |
| `server-only`    | Mencegah modul koneksi diimpor oleh client |

<BrutalCard v-click class="mt-3 text-sm">
  Valibot dan TanStack Query sudah dipasang pada modul 08–09. Versi Drizzle di atas mengikuti jalur stabil saat audit, karena sebagian dokumentasi daring menampilkan versi RC.
</BrutalCard>

<!--
Gunakan Node.js 24 LTS dari Modul 01. better-sqlite3 merupakan addon native; versi Node dan platform memengaruhi ketersediaan binary/prebuild.
Driver ini membutuhkan Node.js runtime, bukan Edge Runtime.
Simpan package-lock.json agar versi dependency dapat direproduksi. Hindari mencampurkan perintah instalasi @rc dengan contoh stabil ini.
Sumber: https://github.com/WiseLibs/better-sqlite3
Sumber: https://orm.drizzle.team/docs/get-started/sqlite-new
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
---

### 2. Definisikan Tabel Usulan Buku

Buat `src/db/schema.ts` sesuai pengantar modul 10.

```ts {1|3-4|5-6|all}
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const suggestions = sqliteTable("book_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
});
```

<v-clicks>

- `id` dibuat oleh database untuk setiap usulan baru.
- `title` dan `reason` menyimpan hasil form modul 09.
- Aturan panjang dan trim tetap dijalankan lewat Valibot sebelum query.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Nama tabel fisiknya <code>book_suggestions</code>; variabel yang diimpor kode adalah <code>suggestions</code>. Migrasi berikutnya membuat tabel tersebut.
</BrutalCard>

<!--
notNull mencegah NULL, bukan string kosong. Jangan mengganti validasi form/server hanya dengan constraint tersebut.
Sumber: https://orm.drizzle.team/docs/sqlite/column-types
-->

---
class: module-content
---

### 3. Tentukan Lokasi Schema dan Database

Buat `drizzle.config.ts` di **root proyek**.

```ts {1|3-6|7-9|all}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./local.db",
  },
});
```

<v-clicks>

- `schema` menunjuk definisi tabel yang baru dibuat.
- `out` menentukan folder file migrasi.
- `url` menunjuk file database lokal yang akan digunakan.

</v-clicks>

<!--
Perintah Drizzle Kit pada slide berikut dijalankan dari root proyek agar path relatif mengarah ke file yang benar.
Path ./local.db harus sama dengan path pada koneksi runtime. Jangan menambahkan prefix file: yang khusus digunakan pada contoh driver libsql.
Sumber: https://orm.drizzle.team/docs/drizzle-config-file
Sumber: https://orm.drizzle.team/docs/drizzle-kit-generate
-->

---
class: module-content
layout: two-cols
---

### 4. Buat dan Terapkan Migrasi

Schema dan konfigurasi harus sudah tersedia sebelum menjalankan perintah ini.

::left::

#### Jalankan Berurutan

```bash
npx drizzle-kit generate
```

Buka file SQL yang dibuat di folder `drizzle`. Pastikan ada pembuatan tabel `book_suggestions`.

```bash
npx drizzle-kit migrate
```

Terapkan perubahan ke `local.db`.

::right::

#### Bedakan File Proyek dan Data

Tambahkan ke `.gitignore`:

```text
/local.db
/local.db-*
```

Simpan di Git: schema, konfigurasi, file migrasi, dan lockfile.

File database beserta file pendampingnya tetap lokal.

::bottom::

<BrutalCard v-click class="text-sm">
  Setiap kali struktur tabel berubah: ubah schema → generate → periksa SQL → migrate. Migrasi yang sudah diterapkan dicatat oleh Drizzle.
</BrutalCard>

<!--
Jangan memakai generate sebagai pengganti migrate. generate menghasilkan SQL; migrate menerapkannya.
Pola local.db-* mencakup sidecar SQLite seperti -wal, -shm, dan -journal.
Tidak perlu generate/migrate untuk sekadar menambah usulan buku; penambahan baris dilakukan lewat query insert.
Sumber: https://orm.drizzle.team/docs/drizzle-kit-generate
Sumber: https://orm.drizzle.team/docs/drizzle-kit-migrate
-->

---
class: module-content
---

### 5. Buka Koneksi di Server

Buat `src/db/index.ts` setelah migrasi berhasil.

```ts {1-3|5-6|all}
import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database("./local.db");
export const db = drizzle(sqlite);
```

<v-clicks>

- Handler dan Server Component memakai `import { db } from "@/db"`.
- Jalankan server dari root proyek agar membuka file database yang sama.
- Browser tidak mengimpor modul koneksi ini.
- Latihan memakai file lokal pada mesin pengembangan; deployment membutuhkan pilihan penyimpanan yang sesuai.

</v-clicks>

<!--
Jangan memasukkan kredensial database ke NEXT_PUBLIC_. Pada SQLite lokal contoh ini tidak memakai kredensial.
server-only mencegah import yang salah ke client saat build; itu bukan pengganti autentikasi endpoint.
Koneksi dibuat pada module scope untuk dipakai kembali selama modul/proses hidup, bukan membuat koneksi baru di setiap request.
Sumber: https://github.com/WiseLibs/better-sqlite3
Sumber: https://orm.drizzle.team/docs/get-started/sqlite-new
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
---

### 6. Gunakan Aturan Usulan dari Modul 09

Di `src/lib/book-suggestion-schema.ts`, **tambahkan** kode berikut di bawah schema dan tipe yang sudah ada.

```ts
export const UpdateBookSuggestionSchema = v.strictObject(
  BookSuggestionSchema.entries,
);
export const SuggestionIdSchema = v.pipe(
  v.string(),
  v.regex(/^[1-9]\d*$/),
  v.transform(Number),
  v.safeInteger(),
);
export type BookSuggestion = BookSuggestionValues & { id: number };
```

<v-clicks>

- `entries` menggunakan ulang aturan `title` dan `reason` dari modul 09.
- Kontrak edit menerima kedua field tersebut; `strictObject` menolak field tambahan.
- `SuggestionIdSchema` mengubah ID string yang valid menjadi angka.
- `BookSuggestion` adalah data usulan yang sudah memiliki ID.

</v-clicks>

<!--
Import v, BookSuggestionSchema, dan BookSuggestionValues sudah ada dalam file dari Modul 09; jangan mendeklarasikannya ulang.
Aturan tidak berubah: judul 3–80 karakter, alasan 10–500 karakter, setelah trim.
PATCH di latihan ini memerlukan title dan reason bersama. Patch document tidak selalu berarti setiap field opsional.
Sumber: https://valibot.dev/api/strictObject/
Sumber: https://valibot.dev/guides/objects/
Sumber: https://valibot.dev/api/safeInteger/
-->

---
class: module-content
---

### 7. GET: Baca Daftar dari API

Buat `src/app/api/suggestions/route.ts`.

```ts {1-4|6|8-11|all}
import * as v from "valibot";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";

export const runtime = "nodejs";

export async function GET() {
  const items = await db.select().from(suggestions).orderBy(suggestions.id);
  return Response.json(items);
}
```

<v-clicks>

- Jalankan `npm run dev`, lalu buka **http://localhost:3000/api/suggestions**.
- Database yang masih kosong menghasilkan **200** dengan `[]`.
- `orderBy` membuat urutan hasil konsisten berdasarkan ID.

</v-clicks>

<!--
Sesuaikan port dengan server Next.js. Import Valibot dan BookSuggestionSchema dipakai oleh POST pada slide berikut.
Dengan cacheComponents false, GET Route Handler tidak dicache secara bawaan. Contoh tidak mengaktifkan cache.
Endpoint GET berguna untuk memeriksa API; halaman UI nanti membaca database langsung.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route
Sumber: https://orm.drizzle.team/docs/sqlite/select
-->

---
class: module-content
---

### 8. POST: Simpan Usulan Buku Baru

**Tambahkan** fungsi ini di bawah GET, pada file `route.ts` yang sama.

```ts {1-5|6-11|12-17|all}
export async function POST(request: Request) {
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
    .values(input.output)
    .returning();
  return Response.json(suggestion, { status: 201 });
}
```

<BrutalCard v-click class="mt-3 text-sm">
  Berbeda dari preview modul 10, respons <strong>201</strong> kini dikirim setelah baris tersimpan. Hasilnya mencakup <code>id</code> dari database.
</BrutalCard>

<!--
JSON rusak menjadi null dan masuk jalur validasi gagal. Tidak ada insert bila input tidak valid.
returning mengembalikan array baris hasil insert. Satu usulan diambil dengan destructuring [suggestion].
Error database tak terduga dapat menghasilkan 500; lihat log server untuk diagnosis. Jangan mengirim detail koneksi/SQL kepada pengguna.
Sumber: https://orm.drizzle.team/docs/sqlite/insert
Sumber: https://valibot.dev/api/safeParse/
-->

---
class: module-content
---

### 9. Siapkan Endpoint untuk Satu Usulan

Buat `src/app/api/suggestions/[id]/route.ts`. Isi awal file:

```ts {1-8|10-11|all}
import * as v from "valibot";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import {
  SuggestionIdSchema,
  UpdateBookSuggestionSchema,
} from "@/lib/book-suggestion-schema";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
```

<v-clicks>

- Untuk URL `/api/suggestions/7`, nilai `id` dari route adalah string `"7"`.
- Pada Next.js 16, baca `params` dengan **await**.
- `SuggestionIdSchema` memeriksa format, lalu menghasilkan ID angka untuk query.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Tambahkan fungsi PATCH dan DELETE pada dua slide berikut ke file ini. Keduanya memakai import dan tipe Context yang sama.
</BrutalCard>

<!--
Folder [id] menangkap segmen URL; itu belum menjamin ID valid atau barisnya ada.
Bedakan 400 (ID/input tidak valid) dengan 404 (ID valid, target tidak ditemukan).
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route
-->

---
class: module-content
---

### 10. PATCH: Perbaiki Judul dan Alasan

Tambahkan di `src/app/api/suggestions/[id]/route.ts`, setelah import dan tipe Context.

```ts {1-6|7-9|10-14|15-19|all}
export async function PATCH(request: Request, { params }: Context) {
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
    .where(eq(suggestions.id, id.output))
    .returning();
  if (!suggestion) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return Response.json(suggestion);
}
```

<!--
Kontrak edit mengirim title dan reason bersama. Meskipun memakai PATCH, kedua field wajib sesuai kontrak endpoint ini.
strictObject menolak field tambahan seperti id atau ownerId. set tetap menyebut title dan reason secara eksplisit.
returning menghasilkan array kosong bila target tidak ada; deteksi 404 memakai hasil query yang sama.
Sumber: https://orm.drizzle.team/docs/sqlite/update
Sumber: https://valibot.dev/api/strictObject/
-->

---
class: module-content
---

### 11. DELETE: Hapus Target dan Kirim 204

Tambahkan di file `src/app/api/suggestions/[id]/route.ts` yang sama.

```ts {1-5|6-9|10-14|all}
export async function DELETE(_request: Request, { params }: Context) {
  const id = v.safeParse(SuggestionIdSchema, (await params).id);
  if (!id.success) {
    return Response.json({ error: "ID tidak valid." }, { status: 400 });
  }
  const [deleted] = await db
    .delete(suggestions)
    .where(eq(suggestions.id, id.output))
    .returning({ id: suggestions.id });
  if (!deleted) {
    return Response.json({ error: "Usulan tidak ditemukan." }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
```

<BrutalCard v-click class="mt-3 text-sm">
  <strong>204</strong> berarti berhasil dengan respons tanpa body. Client cukup memeriksa status; jangan menjalankan <code>res.json()</code> pada respons ini.
</BrutalCard>

<!--
_request tidak dipakai karena DELETE mengambil target dari path, tanpa body pada kontrak ini.
Menghapus ID yang sama lagi akan mendapat 404. Tujuan akhirnya tetap sama: baris itu tidak ada.
Sumber: https://orm.drizzle.team/docs/sqlite/delete
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204
-->

---
class: module-content
---

### Checkpoint Backend: Usulan Benar-Benar Tersimpan

Buka `/api/suggestions` di browser. Di DevTools → Console, jalankan:

```js
{
  const res = await fetch("/api/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "  Learning React  ",
      reason: "  Untuk latihan komponen React.  ",
    }),
  });
  console.log(res.status, await res.json());
}
```

<v-clicks>

- Harapan: **201** dengan `id`, `title`, dan `reason` yang sudah di-trim.
- Muat ulang `/api/suggestions`: usulan baru muncul dalam hasil GET.
- Coba judul kosong atau alasan pendek: **400**, tidak ada baris baru.

</v-clicks>

<!--
Jalankan Console pada origin aplikasi Next.js, bukan halaman slide.
ID dapat berbeda jika database telah diisi. Gunakan ID dari respons saat mencoba PATCH dan DELETE.
POST berulang masih membuat usulan baru; belum ada aturan judul unik atau idempotency key.
-->

---
class: module-content
---

### Setelah Mutasi, Perbarui Daftar

Server sudah menyimpan perubahan; browser perlu menerima hasil render terbaru.

<v-clicks>

1. `useMutation` menjalankan helper `fetch` seperti pada modul 09.
2. Jika HTTP berhasil, jalankan `router.refresh()`.
3. Next.js membaca database lagi pada daftar usulan.
4. UI menerima props terbaru tanpa reload seluruh halaman.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Kita menggabungkan dua status: <strong>mutasi sedang dikirim</strong> dan <strong>render baru sedang disiapkan</strong>. Tombol kembali aktif setelah keduanya selesai.
</BrutalCard>

<!--
Daftar dibaca langsung dari database tanpa use cache/unstable_cache, dan page memanggil connection. Karena itu refresh cukup untuk memperoleh hasil query terbaru.
router.refresh tidak menginvalidasi Data Cache. Jika pembacaan kelak dicache, diperlukan revalidasi pada lapisan server yang sesuai.
useTransition memberi flag refreshing saat pembaruan router diproses. router.refresh tidak menyediakan Promise untuk ditunggu dengan await.
Cache pencarian buku TanStack Query pada modul 08 tidak perlu diinvalidasi oleh mutasi usulan buku.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
Sumber: https://react.dev/reference/react/useTransition
-->

---
class: module-content
---

### 12. Arahkan Helper ke API Usulan Sendiri

**Ganti isi** `src/lib/suggestions.ts`. `id` hanya diberikan saat mengedit usulan.

```ts {1-8|10-20|21-23|all}
import * as v from "valibot";
import type { BookSuggestionValues } from "./book-suggestion-schema";

const SavedSuggestionSchema = v.object({
  id: v.number(),
  title: v.string(),
  reason: v.string(),
});

export async function sendSuggestion(
  values: BookSuggestionValues,
  id?: number,
) {
  const editing = id !== undefined;
  const path = editing ? `/api/suggestions/${id}` : "/api/suggestions";
  const res = await fetch(path, {
    method: editing ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error(`Penyimpanan: HTTP ${res.status}`);
  return v.parse(SavedSuggestionSchema, await res.json());
}
```

<!--
API sendiri menggunakan title dan reason secara langsung. Mapping reason ke body serta userId dummy dari JSONPlaceholder tidak diperlukan lagi.
Fungsi tetap bernama sendSuggestion agar form lama dapat berkembang. Hook berikut membungkus pemanggilannya untuk memberikan id saat edit.
Bila membuat manual migration dari versi latihan sebelumnya, ganti helper ini secara utuh; jangan menyisakan fetch ke JSONPlaceholder.
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
Sumber: https://valibot.dev/guides/parse-data/
-->

---
class: module-content
---

### Tambahkan Helper Hapus ke File yang Sama

Di bawah `sendSuggestion` dalam `src/lib/suggestions.ts`:

```ts
export async function deleteSuggestion(id: number) {
  const res = await fetch(`/api/suggestions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Penghapusan: HTTP ${res.status}`);
}
```

<v-clicks>

- ID berasal dari usulan yang dipilih pengguna.
- Berhasil **204** → helper selesai tanpa membaca JSON.
- Gagal → error diteruskan ke `useMutation`.

</v-clicks>

<!--
Respons POST/PATCH berisi JSON, sedangkan DELETE sukses kosong. Dua helper dipisahkan agar kontrak respons jelas.
Jaringan gagal tidak membuktikan write belum diproses. Periksa daftar sebelum mengulangi permintaan.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204
-->

---
class: module-content
---

### 13. Perbarui Hook Form dari Modul 09

**Ganti isi** `src/hooks/use-suggestion-form.ts`, dimulai dengan import berikut.

```ts
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
import { sendSuggestion } from "@/lib/suggestions";
```

<v-clicks>

- Alur RHF, resolver, dan mutasi tetap seperti modul 09.
- Tambahkan `useRouter` dan `useTransition` untuk memperbarui daftar.
- Fungsi hook pada dua slide berikut berada **di file yang sama**.

</v-clicks>

<!--
QueryProvider dari Modul 08 harus tetap membungkus children pada root layout.
Pembagian kode hanya untuk membacanya bertahap; hasil akhir adalah satu file hook.
-->

---
class: module-content
---

### Form: Mode Tambah dan Edit Memakai Aturan yang Sama

Tambahkan fungsi berikut setelah import di `use-suggestion-form.ts`.

```ts {1-3|4-10|11-15|all}
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
  return { form, mutation };
}
```

<BrutalCard v-click class="mt-3 text-sm">
  Tanpa usulan awal: form kosong untuk POST. Dengan usulan awal: judul dan alasan terisi untuk PATCH. Tombol Edit membuka instance form dengan data tersebut.
</BrutalCard>

<!--
defaultValues dibaca saat form dibuat. Form edit pada SuggestionItem dipasang ketika pengguna membuka editor, lalu dilepas ketika ditutup.
Setelah menyimpan, reset pada slide berikut memperbarui nilai form dan acuannya. Jangan berharap perubahan props sendiri selalu mengganti defaultValues RHF.
mutationFn memakai fungsi pembungkus; argumen kedua sendSuggestion adalah ID milik kita, bukan context internal TanStack Query.
Sumber: https://react-hook-form.com/docs/useform
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
class: module-content
---

### Form: Tunggu Simpan, Lalu Refresh

Di dalam hook, **ganti return lama** dengan potongan ini.

```ts {1-9|10-14|16-21|all}
async function submit(values: BookSuggestionValues) {
  form.clearErrors("root");
  try {
    const saved = await mutation.mutateAsync(values);
    form.reset({
      title: suggestion ? saved.title : "",
      reason: suggestion ? saved.reason : "",
    });
    startTransition(() => router.refresh());
  } catch {
    form.setError("root.server", {
      message: "Penyimpanan belum terkonfirmasi. Input tetap ada.",
    });
  }
}
return {
  form,
  mutation,
  submit,
  pending: form.formState.isSubmitting || refreshing,
};
```

<!--
Tambahkan sebelum penutup fungsi hook. Gagal menyimpan tidak memanggil reset; input tetap ada.
Tambah berhasil mengosongkan form. Edit berhasil mempertahankan nilai yang dikonfirmasi server.
isSubmitting mencakup validasi dan callback submit; refreshing mencakup pembaruan route. Gabungkan keduanya untuk menonaktifkan kontrol.
router.refresh mengulang render/query server yang tidak dicache. Ia tidak memberi Promise untuk di-await dan tidak menginvalidasi Data Cache.
Sumber: https://react-hook-form.com/docs/useform/reset
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
Sumber: https://react.dev/reference/react/useTransition
-->

---
class: module-content
---

### 14. Form yang Sama Dipakai untuk Tambah dan Edit

**Ganti isi** `src/app/suggestions/SuggestionForm.tsx`. Kedua komponen field dari modul 09 tetap digunakan.

```tsx
"use client";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useSuggestionForm } from "@/hooks/use-suggestion-form";
import TitleField from "./TitleField";
import ReasonField from "./ReasonField";

type Props = { suggestion?: BookSuggestion; onClose?: () => void };

export default function SuggestionForm({ suggestion, onClose }: Props) {
  const { form, mutation, submit, pending } = useSuggestionForm(suggestion);
  return null;
}
```

<v-clicks>

- `suggestion` kosong: buat usulan baru.
- `suggestion` terisi: edit usulan yang sudah ada.
- `onClose` menutup editor; nilainya hanya diberikan pada mode edit.

</v-clicks>

<!--
return null diganti dengan markup slide berikut, di dalam function component ini.
TitleField dan ReasonField sudah memakai useId dari modul 09 agar label/error tetap terhubung ke input yang benar saat beberapa form ada bersamaan.
-->

---
class: module-content
---

### Form: Ganti return null dengan Markup

Masih di `SuggestionForm.tsx`, **di dalam fungsi komponennya**.

```tsx
return (
  <form onSubmit={form.handleSubmit(submit)} noValidate>
    <fieldset disabled={pending}>
      <legend>{suggestion ? "Edit usulan buku" : "Usulkan buku"}</legend>
      <TitleField form={form} />
      <ReasonField form={form} />
      <button type="submit">{pending ? "Menyimpan…" : "Simpan usulan"}</button>
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
```

<!--
fieldset disabled menonaktifkan input dan tombol selama submit/refresh, termasuk tombol penutup editor.
handleSubmit tetap menjalankan resolver. noValidate memilih pesan validasi dari RHF, bukan menghilangkan pemeriksaan data.
Setelah edit tersimpan dan refresh selesai, pengguna dapat menekan Tutup editor untuk kembali ke kartu usulan.
Sumber: https://react-hook-form.com/docs/useform/handlesubmit
Sumber: https://react-hook-form.com/docs/useform/formstate
-->

---
class: module-content
---

### 15. Hook untuk Hapus dan Refresh

Buat `src/hooks/use-delete-suggestion.ts`.

```ts {1-5|7-16|17|all}
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
```

Hook memakai alur yang sama: tunggu respons sukses, lalu minta daftar terbaru.

<!--
Penghapusan tidak mengubah cache pencarian Open Library. Ia hanya mengubah tabel usulan di aplikasi kita.
Jika server sudah menghapus tetapi respons hilang, pemeriksaan daftar dapat memastikan keadaan terbaru.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
-->

---
class: module-content
---

### 16. Satu Item Dapat Membuka Editor

Buat `src/app/suggestions/SuggestionItem.tsx`. Markup daftar menggantikan `return null` pada slide berikut.

```tsx
"use client";
import { useState } from "react";
import type { BookSuggestion } from "@/lib/book-suggestion-schema";
import { useDeleteSuggestion } from "@/hooks/use-delete-suggestion";
import SuggestionForm from "./SuggestionForm";

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
  return null;
}
```

<!--
State editing hanya mengatur tampilan editor. Data judul/alasan tetap disimpan oleh form dan dikonfirmasi server.
Form edit dipasang ketika editing true, sehingga defaultValues berasal dari usulan yang dipilih.
key ID pada daftar mempertahankan identitas komponen saat refresh; input pengguna tidak bergantung pada urutan baris.
-->

---
class: module-content
---

### Item: Ganti return null dengan Tampilan Usulan

Masih di `SuggestionItem.tsx`. Tombol **Edit** membuka form, **Hapus** menjalankan mutasi.

```tsx
return (
  <li className="space-y-2 border p-3">
    <h2>{suggestion.title}</h2>
    <p>{suggestion.reason}</p>
    <fieldset disabled={pending}>
      <legend className="sr-only">Aksi untuk {suggestion.title}</legend>
      <button type="button" onClick={() => setEditing(true)}>
        Edit
      </button>
      <button type="button" onClick={() => mutation.mutate(suggestion.id)}>
        Hapus
      </button>
    </fieldset>
    <p role="status">{pending ? "Menghapus…" : ""}</p>
    <p role="alert">
      {mutation.isError && "Penghapusan bermasalah. Periksa daftar lagi."}
    </p>
  </li>
);
```

<!--
Fieldset memberi konteks dan menonaktifkan kedua tombol selama penghapusan. Tombol tidak mengirim form lain karena type button.
UI menunggu konfirmasi server; belum memakai optimistic update.
Kegagalan HTTP/jaringan tidak ditampilkan sebagai sukses. Periksa daftar sebelum mencoba ulang bila hasilnya tidak pasti.
-->

---
class: module-content
---

### 17. Perbarui Halaman Usulan yang Sudah Ada

**Ganti isi** `src/app/suggestions/page.tsx` dari modul 09.

```tsx {1-5|7-10|11-24|all}
import { connection } from "next/server";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import SuggestionForm from "./SuggestionForm";
import SuggestionItem from "./SuggestionItem";

export const runtime = "nodejs";
export default async function SuggestionsPage() {
  await connection();
  const items = await db.select().from(suggestions).orderBy(suggestions.id);
  return (
    <main className="space-y-4 p-8">
      <h1>Usulan Buku Toko Belajar</h1>
      <p>Ajukan judul dan alasan untuk katalog toko.</p>
      <SuggestionForm />
      {items.length === 0 && <p>Belum ada usulan buku.</p>}
      <ul className="space-y-3">
        {items.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </ul>
    </main>
  );
}
```

<!--
Hapus pesan simulasi modul 09 karena form kini memakai database sendiri. Halaman dan URL tetap sama.
connection memastikan query berjalan saat ada request, bukan saat prerender/build. Daftar ini tidak memakai use cache.
Database hanya diimpor ke Server Component; client menerima data usulan yang dapat diserialisasi.
Sumber: https://nextjs.org/docs/app/api-reference/functions/connection
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
layout: two-cols
---

### 18. Gunakan Kembali Loading dan Error Route

Pola dari modul 07 menangani pembacaan daftar usulan.

::left::

#### src/app/suggestions/loading.tsx

```tsx
export default function Loading() {
  return <p role="status">Memuat usulan…</p>;
}
```

Berguna saat bagian route sedang dimuat, misalnya pada navigasi awal.

Status tombol mutasi tetap ditangani oleh hook pada UI.

::right::

#### src/app/suggestions/error.tsx

```tsx
"use client";
type Props = { retry: () => void };

export default function ErrorPage({ retry }: Props) {
  return (
    <section>
      <p>Daftar gagal dimuat.</p>
      <button onClick={retry}>Coba lagi</button>
    </section>
  );
}
```

::bottom::

<BrutalCard v-click class="text-sm">
  Error membaca halaman dan error mengirim mutasi memiliki tempat berbeda: <code>error.tsx</code> untuk route, pesan dekat form/tombol untuk request mutasi.
</BrutalCard>

<!--
retry adalah prop stabil sejak Next.js 16.3.0; sesuai acuan kelas 16.3.7. Rujukan lokal yang lebih lama dapat masih menyebut unstable_retry.
retry mencoba mengambil dan merender ulang konten. Perbaiki penyebab pada server terlebih dahulu bila kegagalan tetap terjadi.
Saat refresh dalam Transition, UI yang sudah ada dapat tetap terlihat; loading.tsx tidak dijamin muncul pada setiap refresh. Karena itu tombol mempunyai indikator pending sendiri.
Jika write sukses tetapi pembacaan ulang gagal, jangan otomatis mengulang write: data mungkin sudah tersimpan.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/error
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/loading
Sumber: https://react.dev/reference/react/useTransition
-->

---
class: module-content
---

### 19. Coba dari Katalog Toko Belajar

Buka `/products`, lalu gunakan link **Usulkan buku** yang dibuat pada modul 09.

| Langkah                             | Hasil yang diharapkan                        |
| ----------------------------------- | -------------------------------------------- |
| Isi judul dan alasan, lalu simpan   | Usulan muncul; form tambah kembali kosong    |
| Tekan **Edit** pada satu usulan     | Form terisi judul dan alasan usulan tersebut |
| Ubah, simpan, lalu **Tutup editor** | Daftar menampilkan nilai terbaru             |
| Tekan **Hapus**                     | Usulan yang dipilih hilang dari daftar       |
| Hapus seluruh usulan                | Muncul “Belum ada usulan buku.”              |

<BrutalCard v-click class="mt-4 text-sm">
  Usulan ini disimpan oleh Toko Belajar. Menambah atau mengedit usulan tidak mengubah katalog Open Library.
</BrutalCard>

<!--
QueryProvider, Navbar, serta link ke /suggestions sudah tersedia dari modul sebelumnya.
Editor tetap terbuka setelah berhasil menyimpan. Tutup editor setelah status pending selesai untuk melihat kartu dengan props terbaru.
Fitur ini melatih CRUD dalam proyek yang sama. Memasukkan usulan ke katalog toko membutuhkan aturan bisnis tambahan dan berada di luar latihan.
-->

---
class: module-content
---

### Checkpoint: Buktikan Data dan Input Tetap Benar

| Skenario                                            | Hasil yang diharapkan               |
| --------------------------------------------------- | ----------------------------------- |
| Tambah → reload → restart server                    | Judul dan alasan tetap ada          |
| Edit satu usulan, lalu reload                       | Hanya usulan itu yang berubah       |
| Kirim judul kosong / alasan kurang dari 10 karakter | **400**, database tidak berubah     |
| PATCH dengan field tambahan `id` atau `ownerId`     | **400**, field tambahan ditolak     |
| PATCH / DELETE ID valid yang tidak ada              | **404**, usulan lain tetap ada      |
| Pengiriman form gagal                               | Pesan error tampil; input tetap ada |

<v-clicks>

- Coba lewat **UI dan API**: validasi client membantu pengguna, server menjaga data.
- Coba jaringan lambat: kontrol tetap nonaktif selama mutasi dan refresh.
- Navigasi dengan keyboard; label tetap menuju field yang benar saat form tambah dan edit terbuka.

</v-clicks>

<!--
Untuk API, gunakan fetch di Console seperti checkpoint backend dengan payload yang sengaja tidak valid.
Hentikan dan jalankan ulang server dari root proyek yang sama untuk membuktikan persistensi file SQLite.
Gagal jaringan belum tentu berarti server tidak menyimpan; periksa daftar sebelum mengirim ulang agar tidak membuat duplikat.
-->

---
class: module-content
---

### Jika Hasilnya Belum Sesuai

| Gejala                             | Periksa                                       |
| ---------------------------------- | --------------------------------------------- |
| `no such table: book_suggestions`  | Jalankan migrasi; cek path `local.db`         |
| Data hilang setelah restart        | Jalankan server dari root proyek yang sama    |
| `No QueryClient set`               | Pastikan `QueryProvider` membungkus children  |
| API selalu **400**                 | Cek judul, alasan, format ID, dan field PATCH |
| Respons masih dari JSONPlaceholder | Ganti helper `src/lib/suggestions.ts`         |
| Label menunjuk form yang salah     | Pakai `useId` pada kedua komponen field       |

<BrutalCard v-click class="mt-4 text-sm">
  Mulai dari respons API di Network, lalu cocokkan dengan log terminal server dan isi database. Uji satu perubahan setiap kali.
</BrutalCard>

<!--
Error addon native: periksa Node.js 24 LTS, instalasi better-sqlite3, dan runtime nodejs.
Jika daftar gagal dibaca, error.tsx menampilkan fallback; retry mencoba render server kembali setelah penyebab diperbaiki.
router.refresh tidak menginvalidasi server cache. Contoh ini sengaja tidak menyimpan query daftar dalam cache.
-->

---
class: module-content
---

### Cek Pemahaman: Sukses Tanpa JSON

<LearningCheck
  id="modul-11-delete-response"
  question="API sudah menghapus usulan buku dan mengirim 204. Helper tetap memanggil res.json(), lalu menampilkan error. Apa penyebabnya?"
  :options="[
    '204 berarti server menolak penghapusan',
    'Respons 204 kosong, sehingga tidak ada JSON untuk dibaca',
    'Database otomatis membatalkan delete saat parsing gagal',
    'DELETE harus diganti menjadi GET',
  ]"
  :answer="1"
  explanation="204 menandakan sukses tanpa body. Periksa res.ok, lalu selesaikan helper tanpa res.json(). Error di browser tidak membatalkan perubahan yang sudah disimpan server."
/>

<!--
Bedakan keberhasilan operasi di server dan keberhasilan pemrosesan respons di browser.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 11

<v-clicks>

1. **Bangun Bertahap**: tabel dan migrasi → API → komponen UI.
2. **Jaga Kontrak**: validasi input, pilih field dan target, kirim status HTTP yang sesuai.
3. **Perbarui Tampilan**: mutasi mengubah database; refresh mengambil hasil render server terbaru.
4. **Buktikan Hasilnya**: uji CRUD, restart, input salah, jaringan gagal, dan akses keyboard.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 12:</strong> Merapikan penyajian data, komponen UI, dan tampilan responsif.
</BrutalCard>

<!--
Target akhir: /suggestions menjalankan CRUD lokal yang persisten dengan status pending/error yang dapat dijelaskan.
Project belum memiliki akun atau isolasi pengguna. Sesi dan ownership dibahas pada Modul 14; deployment memerlukan strategi penyimpanan dari Modul 16.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**. Rujukan tambahan ada pada catatan slide.

::left::

#### Next.js dan UI

- [Route Handler dan params](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Pembacaan pada waktu request](https://nextjs.org/docs/app/api-reference/functions/connection)
- [router.refresh](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [Error route dan retry](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [React: useTransition](https://react.dev/reference/react/useTransition)
- [TanStack Query: mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

::right::

#### Database dan Validasi

- [Drizzle: konfigurasi](https://orm.drizzle.team/docs/drizzle-config-file)
- [Generate migrasi](https://orm.drizzle.team/docs/drizzle-kit-generate) · [terapkan migrasi](https://orm.drizzle.team/docs/drizzle-kit-migrate)
- [SQLite: tipe kolom](https://orm.drizzle.team/docs/sqlite/column-types)
- [Insert](https://orm.drizzle.team/docs/sqlite/insert) · [update](https://orm.drizzle.team/docs/sqlite/update) · [delete](https://orm.drizzle.team/docs/sqlite/delete)
- [Driver better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Valibot: strictObject](https://valibot.dev/api/strictObject/) · [safeInteger](https://valibot.dev/api/safeInteger/)

<!--
Contoh mengikuti Next.js 16.3.7, React 19, TanStack Query v5, dan Valibot 1.5.0 dari rangkaian modul sebelumnya.
Versi database saat audit: drizzle-orm 0.45.4, drizzle-kit 0.31.11, better-sqlite3 13.0.3.
Dokumentasi Next.js daring menampilkan 16.4.0 dan sebagian Drizzle menampilkan 1.0 RC; periksa versi paket sebelum mengikuti contoh lain.
-->
