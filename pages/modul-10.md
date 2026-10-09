---
layout: intro
badge: "MODUL 10"
badgeColor: "green"
level: 1
---

## 10. Membuat API untuk Usulan Buku

Melanjutkan fitur usulan buku Toko Belajar: menerima request, memvalidasi input, dan mengenal Drizzle ORM.

<!--
Prasyarat: form usulan buku, BookSuggestionSchema, dan mutasi dari Modul 09.
Acuan kelas tetap Next.js 16.3.7, React 19, src/app, serta alias @/* ke src/*.
Cache Components dan Partial Prefetching tetap nonaktif seperti Modul 07.
Latihan endpoint dapat dijalankan di proyek Toko Belajar. Bagian Drizzle adalah pengantar menuju setup dan CRUD lengkap Modul 11.
Audit sumber: 9 Oktober 2026.
-->

---
class: module-content
---

### Dari Memanggil API ke Membuat API

<div
  v-motion
  :initial="{ y: 50, opacity: 0 }"
  :enter="{ y: 0, opacity: 1, transition: { delay: 300 } }"
  class="text-center mt-8"
>

Di modul 09, form kita mengirim data ke **API simulasi JSONPlaceholder**.

</div>

<BrutalCard v-click v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" class="mt-6 bg-yellow-100 text-center">
  Sekarang kita menulis fungsi di server yang <strong>menerima dan memeriksa request</strong>.
</BrutalCard>

<div v-click class="mt-4 grid grid-cols-2 gap-4 text-sm">
  <BrutalCard class="text-center">
    <strong>Praktik Modul 10</strong><br/>
    Endpoint GET dan POST dengan validasi.
  </BrutalCard>
  <BrutalCard class="text-center">
    <strong>Praktik Modul 11</strong><br/>
    Database lokal dan CRUD usulan buku.
  </BrutalCard>
</div>

<!--
Fullstack berarti aplikasi mencakup UI dan logika server. Database tetap perlu dipilih dan disiapkan.
Hasil modul ini: peserta dapat menguji endpoint, menjelaskan status respons, dan membaca bentuk query Drizzle.
POST JSONPlaceholder dari Modul 09 tetap merupakan simulasi tanpa penyimpanan permanen.
-->

---
class: module-content
layout: two-cols
---

### Satu Proyek, Dua Jenis Route

Folder menentukan URL; nama file menentukan cara menanganinya.

::left::

#### Halaman untuk Pengguna

```text
src/app/suggestions/
└── page.tsx
```

URL: **/suggestions**

`page.tsx` mengekspor komponen React untuk menampilkan UI.

Form usulan buku dari modul 09 tetap berada di sini.

::right::

#### Endpoint untuk Request HTTP

```text
src/app/api/health/
└── route.ts
```

URL: **/api/health**

`route.ts` mengekspor fungsi bernama `GET`, `POST`, dan metode lain yang diperlukan.

Respons dapat berupa JSON.

::bottom::

<BrutalCard v-click class="text-sm">
  Gunakan lokasi berbeda untuk halaman dan endpoint. <code>page.tsx</code> dan <code>route.ts</code> tidak boleh menangani URL yang sama.
</BrutalCard>

<!--
Folder api adalah konvensi agar endpoint mudah dikenali, bukan syarat wajib Route Handlers.
Route Handler tidak dirender di dalam layout halaman dan tidak memerlukan directive use server.
Metode yang didukung: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
Sumber: https://nextjs.org/docs/app/getting-started/route-handlers
-->

---
class: module-content
---

### Praktik 1: Endpoint GET Pertama

Buat file berikut di proyek Toko Belajar.

```ts {1|2-7|all}
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    ok: true,
    service: "Toko Belajar",
  });
}
```

<v-clicks>

- Jalankan `npm run dev` pada proyek Next.js.
- Buka **http://localhost:3000/api/health** di browser.
- Hasilnya JSON dengan status **200 OK**. Sesuaikan port bila server memakai port lain.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  <code>Response.json()</code> membuat respons JSON beserta header-nya. <code>ok: true</code> di sini hanya menandakan handler berjalan; database belum diperiksa.
</BrutalCard>

<!--
Navigasi lewat address bar melakukan GET. Response dan Request tersedia sebagai Web APIs; contoh ini tidak memerlukan import NextResponse.
Status default Response.json adalah 200.
Dengan Cache Components nonaktif, GET Route Handler tidak dicache secara bawaan; caching dapat diaktifkan secara eksplisit. POST tidak dicache.
Jika Cache Components diaktifkan, aturan prerender GET berbeda. Ikuti konfigurasi kelas dari Modul 07.
Sumber: https://nextjs.org/docs/app/getting-started/route-handlers
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static
-->

---
class: module-content
---

### Praktik 2: Periksa Usulan Buku di Server

Kita membuat **POST /api/suggestions/preview** untuk memeriksa dan merapikan input.

| Bagian kontrak           | Isi latihan                                            |
| ------------------------ | ------------------------------------------------------ |
| Request JSON             | `title` dan `reason` dari usulan buku                  |
| Aturan                   | `BookSuggestionSchema` yang sudah dibuat di modul 09   |
| Berhasil                 | **200**, mengembalikan judul dan alasan setelah `trim` |
| Input salah / JSON rusak | **400**, mengembalikan pesan error                     |

<BrutalCard v-click class="mt-4 bg-yellow-50 text-sm">
  Endpoint ini menampilkan <strong>pratinjau input yang valid</strong>. Responsnya tidak memiliki ID karena belum ada data baru yang disimpan.
</BrutalCard>

<!--
POST dapat dipakai untuk memproses input; tidak setiap POST berarti membuat resource.
Latihan ini memakai 400 baik untuk JSON rusak maupun input yang tidak sesuai schema. API lain dapat memakai 422 untuk kegagalan validasi.
201 Created digunakan bila request berhasil membuat resource. Jangan menambahkan ID palsu atau mengklaim penyimpanan pada endpoint preview.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/201
-->

---
class: module-content
---

### Validasi Client Membantu; Server Tetap Memeriksa

Pemanggil endpoint dapat mengirim request langsung tanpa melewati form React.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click>
    <strong>1. Baca JSON</strong><br/>
    Request masuk sebagai data dari luar aplikasi.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>2. Jalankan Schema</strong><br/>
    Valibot memeriksa tipe, melakukan trim, dan memeriksa panjang.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>3. Pilih Respons</strong><br/>
    Kirim error atau data dari hasil validasi.
  </BrutalCard>
</div>

<v-clicks>

- Judul: **3–80 karakter**. Alasan: **10–500 karakter**.
- Gunakan kembali `src/lib/book-suggestion-schema.ts`.
- Tipe TypeScript tidak memeriksa isi request saat aplikasi berjalan.

</v-clicks>

<!--
Schema modul 09 tidak mengimpor React, koneksi database, atau rahasia sehingga dapat dipakai di client dan server.
Schema bersama mengurangi perbedaan aturan, tetapi validasi server tetap harus benar-benar dijalankan.
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://valibot.dev/guides/parse-data/
-->

---
class: module-content
---

### Handler POST yang Bisa Dicoba

```ts {1-3|5-7|9-14|16|all}
// src/app/api/suggestions/preview/route.ts
import * as v from "valibot";
import { BookSuggestionSchema } from "@/lib/book-suggestion-schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = v.safeParse(BookSuggestionSchema, body);

  if (!result.success) {
    return Response.json(
      { error: "Judul atau alasan belum valid." },
      { status: 400 },
    );
  }

  return Response.json(result.output);
}
```

<BrutalCard v-click class="mt-3 text-sm">
  JSON rusak menjadi <code>null</code>, lalu gagal validasi. Jika valid, gunakan <code>result.output</code> agar hasil <code>trim</code> ikut dikembalikan.
</BrutalCard>

<!--
Ini file utuh yang memerlukan BookSuggestionSchema dari Modul 09. Valibot sudah terpasang di modul tersebut.
v.object pada schema itu membuang field yang tidak didefinisikan dari output. Endpoint mengembalikan title dan reason; data mentah tidak diteruskan.
Catch hanya menangani pembacaan JSON. Tidak ada operasi database dalam handler ini.
Pesan error sengaja ringkas; pemetaan issues ke field form merupakan pengembangan berikutnya.
Sumber: https://valibot.dev/api/object/
Sumber: https://valibot.dev/api/safeParse/
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route
-->

---
class: module-content
---

### Kirim POST dari Browser

Buka DevTools → **Console** pada halaman aplikasi Next.js, lalu jalankan:

```js {1-10|11-12|all}
{
  const res = await fetch("/api/suggestions/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "  Learning React  ",
      reason: "  Untuk belajar komponen React.  ",
    }),
  });

  console.log(res.status);
  console.log(await res.json());
}
```

<v-clicks>

- Harapan: **200**, judul `"Learning React"`, alasan tanpa spasi di tepi.
- URL relatif memakai origin aplikasi yang sedang dibuka.
- Membuka URL preview lewat address bar mengirim **GET**; endpoint ini hanya menyediakan POST.

</v-clicks>

<!--
Blok kurung kurawal memungkinkan contoh dijalankan ulang tanpa konflik deklarasi const pada console.
Kode ini adalah eksperimen DevTools dengan top-level await, bukan kode yang ditempel di body komponen React.
Periksa juga status dan payload pada tab Network. Fetch tetap resolve untuk HTTP 400; lihat res.ok/status seperti pada Modul 09.
GET ke endpoint preview akan menghasilkan 405 Method Not Allowed.
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
Sumber: https://nextjs.org/docs/app/getting-started/route-handlers
-->

---
class: module-content
---

### Coba Input yang Berbeda

Jalankan ulang request sebelumnya dengan perubahan berikut.

| Percobaan                                | Respons yang diharapkan                                    |
| ---------------------------------------- | ---------------------------------------------------------- |
| Input valid dengan spasi di tepi         | **200**; hasil sudah di-trim                               |
| `title: "  "`                            | **400**; judul kosong setelah trim                         |
| `reason: "Pendek"`                       | **400**; alasan kurang dari 10 karakter                    |
| `title: 123` atau `reason` tidak dikirim | **400**; tipe atau field tidak sesuai                      |
| Tambahkan `ownerId: "123"`               | **200** bila field lain valid; `ownerId` tidak ikut output |
| Ganti opsi fetch menjadi `body: "{"`     | **400**; teks itu bukan JSON yang valid                    |

<BrutalCard v-click class="mt-3 text-sm">
  Periksa <strong>status dan isi respons</strong>. Input yang lolos validasi belum membuktikan adanya penyimpanan.
</BrutalCard>

<!--
Pada kasus field tambahan, v.object membuang key yang tidak dikenal. v.strictObject memiliki kebijakan berbeda: key tambahan ditolak.
ownerId hanya dipakai untuk menunjukkan bahwa pemanggil bisa menambahkan field. Pada aplikasi multi-user, identitas berasal dari sesi yang diverifikasi server.
Batas maksimum juga dapat dicoba: title lebih dari 80 atau reason lebih dari 500 karakter ditolak.
Sumber: https://valibot.dev/api/object/
-->

---
class: module-content
layout: two-cols
---

### Sambungan dengan Form Modul 09

Kontrak respons menentukan bagaimana client membaca hasil.

::left::

#### Endpoint Preview Kita

```json
{
  "title": "Learning React",
  "reason": "Untuk belajar React."
}
```

Memvalidasi dan merapikan input. Status sukses **200**, tanpa ID dan tanpa penyimpanan.

::right::

#### Helper Form Modul 09

`sendSuggestion` masih mengirim ke JSONPlaceholder dan memeriksa:

```text
id: number
title: string
```

Layanan itu menyimulasikan POST **201**, tetapi tidak menyimpan data baru secara permanen.

::bottom::

<BrutalCard v-click class="text-sm">
  Latihan preview diuji lewat Console. Agar dipakai oleh form, URL, schema respons, dan pesan sukses helper harus disesuaikan bersama.
</BrutalCard>

<!--
Pertahankan latihan form Modul 09 selama modul ini. Mengganti URL helper saja membuat ReceiptSchema gagal karena preview tidak mengembalikan id.
Modul 11 meneruskan halaman /suggestions yang sama: helper diarahkan ke API lokal dan usulan disimpan ke database.
Jangan menginvalidasi cache pencarian Open Library setelah memanggil preview: endpoint ini tidak mengubah katalog tersebut.
Sumber: https://jsonplaceholder.typicode.com/guide/
-->

---
class: module-content
---

### Apa yang Membuat Data Tetap Ada?

**Persisten** berarti data disimpan agar dapat dibaca lagi setelah proses aplikasi berhenti.

| Tempat data                         | Perilaku                                                               |
| ----------------------------------- | ---------------------------------------------------------------------- |
| State React                         | Menyimpan keadaan UI; biasanya hilang saat halaman dimuat ulang        |
| Array pada proses server            | Hilang saat proses restart; proses lain punya memory sendiri           |
| Database pada penyimpanan persisten | Dapat dibaca lagi setelah restart selama penyimpanannya tetap tersedia |

<v-clicks>

- Array global dapat membantu ilustrasi, tetapi tidak cukup untuk penyimpanan aplikasi.
- ID sebaiknya dibuat oleh mekanisme database; `array.length + 1` dapat bentrok.
- **Bukti praktik modul 11:** simpan usulan buku, restart server, lalu baca kembali.

</v-clicks>

<!--
File SQLite lokal dapat bertahan setelah restart di mesin pengembangan. File pada filesystem sementara suatu deployment belum tentu bertahan.
Jangan menyamakan adanya library ORM, respons 201, atau cache dengan jaminan durabilitas.
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://www.sqlite.org/whentouse.html
-->

---
class: module-content
---

### Di Mana Drizzle Berada?

Drizzle membantu kode TypeScript membentuk query ke database.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click>
    <strong>1. Kode Server</strong><br/>
    Route Handler memeriksa input dan menentukan operasi.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>2. Drizzle + Driver</strong><br/>
    Drizzle membentuk query; driver menjalankannya ke database.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>3. Database</strong><br/>
    Menyimpan tabel, menjalankan query, dan mengembalikan hasil.
  </BrutalCard>
</div>

<v-clicks>

- **ORM** membantu memetakan tabel dan operasi database ke kode aplikasi.
- **Driver** adalah penghubung untuk database yang dipilih.
- Koneksi database ditempatkan di server; client berkomunikasi lewat endpoint.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Server Component juga dapat membaca database langsung. Ia tidak perlu memanggil Route Handler milik aplikasi sendiri.
</BrutalCard>

<!--
Drizzle menyediakan API berorientasi SQL dan tipe yang diturunkan dari schema. SQL adalah bahasa untuk membaca serta mengubah data dalam database relasional.
Drizzle ORM bukan server database dan tidak menggantikan validasi request, otorisasi, atau pemilihan penyimpanan.
Pada Modul 11, koneksi memakai import server-only. Kredensial database tidak ditempatkan di modul client atau variabel NEXT_PUBLIC_.
Sumber: https://orm.drizzle.team/docs/overview
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
layout: two-cols
---

### Pilihan Database untuk Latihan

Mulai dari kebutuhan penyimpanan dan lingkungan tempat aplikasi berjalan.

::left::

#### SQLite Lokal

- Menyimpan database dalam file, misalnya `local.db`.
- Tidak memerlukan proses server database terpisah.
- Modul 11 memakai driver `better-sqlite3` pada **Node.js**.
- Paket driver dan migrasi tetap perlu disiapkan.

::right::

#### PostgreSQL

- Aplikasi terhubung ke server atau layanan database.
- Cocok saat banyak instance aplikasi perlu mengakses data bersama.
- Memerlukan koneksi, kredensial, dan driver yang sesuai.
- Tipe kolom serta fitur SQL berbeda dari SQLite.

::bottom::

<BrutalCard v-click class="text-sm">
  Memindahkan aplikasi ke serverless perlu strategi penyimpanan. Jangan menganggap file SQLite lokal otomatis persisten pada semua hosting.
</BrutalCard>

<!--
SQLite juga memiliki penggunaan produksi; pilihan lokal di kelas bukan berarti SQLite hanya untuk demo.
better-sqlite3 adalah addon native Node.js, bukan driver untuk Edge Runtime. Dukungan SQLite melalui driver lain dapat berbeda.
Pindah ke PostgreSQL membutuhkan peninjauan schema, migration, query, dan perilaku database; mengganti import saja tidak cukup.
Sumber: https://www.sqlite.org/whentouse.html
Sumber: https://orm.drizzle.team/docs/get-started/sqlite-new
Sumber: https://github.com/WiseLibs/better-sqlite3
-->

---
class: module-content
---

### Kenali Tabel Sebelum Menulis Query

Modul 11 menyimpan **usulan buku dari form yang sama** di Toko Belajar.

| id  | title               | reason                            |
| --- | ------------------- | --------------------------------- |
| 1   | Learning React      | Untuk latihan komponen React.     |
| 2   | Eloquent JavaScript | Untuk mendalami dasar JavaScript. |

<v-clicks>

- **Tabel**: kumpulan usulan. **Baris**: satu usulan. **Kolom**: satu jenis informasi.
- `id` adalah **primary key**, penanda unik untuk memilih satu baris.
- `title` dan `reason` berasal dari form modul 09.
- Menutup halaman tidak menghapus baris yang sudah tersimpan.

</v-clicks>

<!--
Nama tabel pada database nanti adalah book_suggestions; variabel Drizzle-nya suggestions.
Ini data usulan untuk toko, terpisah dari hasil pencarian Open Library. Menyimpan usulan tidak mengubah data Open Library.
Sumber: https://www.sqlite.org/lang_createtable.html
-->

---
class: module-content
---

### Membaca Schema Drizzle

Pengantar `src/db/schema.ts` untuk modul 11; **belum perlu membuat file ini**.

```ts {1|3-4|5-6|all}
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const suggestions = sqliteTable("book_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
});
```

<v-clicks>

- Database mengisi `id` untuk setiap usulan baru.
- `title` dan `reason` menyimpan judul serta alasan.
- `notNull` mewajibkan nilai selain `null`; validasi panjang tetap diperlukan.

</v-clicks>

<!--
notNull tidak menolak string kosong atau melakukan trim. Aturan 3–80 dan 10–500 karakter tetap berasal dari BookSuggestionSchema.
Deklarasi sqliteTable belum membuat tabel; migrasi akan menerapkan struktur ini pada database.
Contoh memakai API stabil drizzle-orm 0.45.4 saat audit. Dokumentasi daring juga memuat 1.0 RC.
Sumber: https://orm.drizzle.team/docs/sqlite/column-types
Sumber: https://orm.drizzle.team/docs/sql-schema-declaration
-->

---
class: module-content
layout: two-cols
---

### Dua Schema, Dua Tanggung Jawab

Keduanya membahas **usulan buku yang sama**, pada tahap yang berbeda.

::left::

#### Valibot: Periksa Input

`BookSuggestionSchema` dari modul 09:

```text
title: trim, 3–80 karakter
reason: trim, 10–500 karakter
```

Dijalankan saat menerima data. Hasilnya input valid atau daftar masalah.

::right::

#### Drizzle: Definisikan Tabel

Tabel `book_suggestions` untuk modul 11:

```text
id: integer, primary key
title: text, not null
reason: text, not null
```

Menjelaskan kolom dan aturan database. Menjadi acuan query serta migrasi.

::bottom::

<BrutalCard v-click class="text-sm">
  <code>notNull()</code> masih mengizinkan string kosong. Aturan input pada schema Valibot tetap dijalankan sebelum query.
</BrutalCard>

<!--
Satu fitur dapat memiliki schema input dan schema penyimpanan. Nilai lolos TypeScript belum menjamin request valid saat runtime.
Sumber: https://valibot.dev/guides/schemas/
Sumber: https://orm.drizzle.team/docs/sqlite/column-types
-->

---
class: module-content
---

### Dari Schema ke Tabel Nyata

**Migrasi** adalah perubahan struktur database yang dicatat agar dapat diterapkan ulang.

<v-clicks>

1. Tulis atau ubah definisi tabel di `src/db/schema.ts`.
2. **Generate**: Drizzle Kit membuat file SQL migrasi dari perubahan schema.
3. Baca file SQL agar perubahan yang akan dijalankan dipahami.
4. **Migrate**: terapkan migrasi yang belum dijalankan pada database tujuan.

</v-clicks>

<BrutalCard v-click class="mt-5 bg-yellow-50 text-sm">
  Mengedit schema TypeScript belum mengubah database. File migrasi mencatat perubahan struktur; file database menyimpan data aplikasi.
</BrutalCard>

<!--
Drizzle ORM digunakan aplikasi untuk query. Drizzle Kit adalah alat CLI untuk mengelola schema/migrasi.
generate dan migrate adalah alur yang dipakai Modul 11; konfigurasi koneksi dan perintah lengkap ditempatkan di modul tersebut.
Ada alur lain seperti push, tetapi satu alur cukup untuk latihan pemula. Simpan file migrasi di Git; abaikan file database lokal dan sidecar-nya.
Sumber: https://orm.drizzle.team/docs/migrations
Sumber: https://orm.drizzle.team/docs/drizzle-kit-generate
Sumber: https://orm.drizzle.team/docs/drizzle-kit-migrate
-->

---
class: module-content
---

### Membaca dan Menambah Data

**Sketsa query untuk modul 11:** `db` dan tabel `suggestions` memerlukan setup database terlebih dahulu.

````md magic-move
```ts
import { db } from "@/db";
import { suggestions } from "@/db/schema";

// READ: baca baris dari tabel.
const list = await db.select().from(suggestions);
```

```ts
import { db } from "@/db";
import { suggestions } from "@/db/schema";

// CREATE: tambahkan satu usulan buku.
const [created] = await db
  .insert(suggestions)
  .values({
    title: "Learning React",
    reason: "Untuk latihan komponen React.",
  })
  .returning();
```

```ts
import { db } from "@/db";
import { suggestions } from "@/db/schema";

// CREATE: tambahkan satu usulan buku.
const [created] = await db
  .insert(suggestions)
  .values({
    title: "Learning React",
    reason: "Untuk latihan komponen React.",
  })
  .returning();

// READ: hasilnya berupa array baris.
const list = await db.select().from(suggestions);
```
````

<BrutalCard class="mt-4 text-sm">
  <code>.returning()</code> mengambil baris hasil insert, termasuk ID dari database. <code>[created]</code> mengambil elemen pertama dari array hasil query.
</BrutalCard>

<!--
Setiap langkah magic-move menjelaskan perubahan contoh; bukan tiga blok yang harus ditempel berurutan.
Sketsa berjalan di konteks server dengan koneksi dan migrasi dari Modul 11. Judul konstan dipakai untuk mempelajari query; input request tetap harus divalidasi lebih dahulu.
RETURNING tersedia pada SQLite dan PostgreSQL; jangan mengasumsikan semua dialek mempunyai API/fitur identik.
select tanpa orderBy tidak menjamin urutan hasil. Modul 11 memakai orderBy untuk tampilan yang teratur.
Sumber: https://orm.drizzle.team/docs/sqlite/select
Sumber: https://orm.drizzle.team/docs/sqlite/insert
-->

---
class: module-content
layout: two-cols
---

### Ubah atau Hapus Baris yang Tepat

Sketsa lanjutan; `db` dan `suggestions` memakai import dari contoh sebelumnya.

::left::

#### UPDATE: Perbaiki Alasan

```ts
import { eq } from "drizzle-orm";

await db
  .update(suggestions)
  .set({
    reason: "Untuk belajar React.",
  })
  .where(eq(suggestions.id, 1));
```

`set` menentukan field yang diubah. `where` memilih baris dengan ID 1.

::right::

#### DELETE: Hapus Usulan

```ts
import { eq } from "drizzle-orm";

const target = eq(suggestions.id, 1);
await db.delete(suggestions).where(target);
```

`eq` berarti “sama dengan”. Baris lain tetap ada.

::bottom::

<BrutalCard v-click class="text-sm">
  Tanpa <code>where</code>, UPDATE atau DELETE dapat mengenai semua baris. Pilih field secara eksplisit; hindari meneruskan seluruh body request ke <code>set</code>.
</BrutalCard>

<!--
Kedua blok adalah contoh operasi terpisah. ID 1 dipakai sebagai ilustrasi; endpoint nyata mengambil ID dari params yang sudah divalidasi.
Predikat id memilih baris, tetapi belum membuktikan hak akses. Aplikasi multi-user juga harus memeriksa identitas dan kepemilikan di server.
Dalam Modul 11, returning membantu membedakan baris yang ditemukan dari hasil kosong untuk respons 404.
Sumber: https://orm.drizzle.team/docs/sqlite/update
Sumber: https://orm.drizzle.team/docs/sqlite/delete
-->

---
class: module-content
---

### Menghubungkan Kontrak HTTP dengan CRUD

Rancangan untuk usulan buku di modul 11, setelah database siap.

| Request                     | Operasi database        | Respons sukses               |
| --------------------------- | ----------------------- | ---------------------------- |
| `GET /api/suggestions`      | Baca daftar             | **200**, array usulan buku   |
| `POST /api/suggestions`     | Tambah dari input valid | **201**, usulan buku baru    |
| `PATCH /api/suggestions/1`  | Edit judul dan alasan   | **200**, usulan buku terbaru |
| `DELETE /api/suggestions/1` | Hapus ID 1              | **204**, tanpa body          |

<v-clicks>

- `src/app/api/suggestions/route.ts` menangani daftar dan pembuatan usulan buku.
- `src/app/api/suggestions/[id]/route.ts` menangani satu usulan buku.
- Validasi input/ID sebelum query; kirim **404** bila target tidak ditemukan.

</v-clicks>

<!--
Ini kontrak tujuan, bukan klaim endpoint usulan buku sudah tersedia pada akhir Modul 10.
Pada Next.js 16, params handler adalah Promise: await params sebelum membaca id. Segmen [id] masih berupa string dan perlu divalidasi sebelum dipakai sebagai ID angka.
Respons 204 dibuat tanpa JSON; client tidak memanggil res.json() untuk respons kosong.
GET tidak boleh dipakai untuk operasi yang dimaksudkan mengubah data.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
-->

---
class: module-content
---

### Pengayaan: Bagaimana dengan Server Actions?

Next.js juga menyediakan fungsi server untuk menangani mutasi dari UI.

| Pertimbangan         | Route Handler                               | Server Action                                   |
| -------------------- | ------------------------------------------- | ----------------------------------------------- |
| Titik masuk          | URL + metode HTTP                           | Fungsi server dengan `"use server"`             |
| Pemanggil umum       | `fetch`, aplikasi lain, webhook             | Form atau interaksi UI Next.js                  |
| Alur form            | Client mengirim request dan membaca respons | Dapat dihubungkan melalui `<form action={...}>` |
| Input dan izin akses | Diperiksa di server                         | Tetap diperiksa di server                       |

<BrutalCard v-click class="mt-4 text-sm">
  Praktik kita memakai Route Handler agar alur HTTP dari modul 09 tetap terlihat. Server Action menjadi pilihan ketika membutuhkan alur mutasi yang terintegrasi dengan UI Next.js.
</BrutalCard>

<!--
Server Actions dipanggil melalui POST dan dapat diakses sebagai endpoint; jangan menganggap fungsi otomatis privat karena ada use server.
Directive use server menandai fungsi yang berjalan di server; use client menetapkan batas modul client. Route Handler tidak memerlukan use server.
Alternatif ini cukup dikenali sekarang. useActionState, useFormStatus, validasi form, dan revalidasi setelah action memerlukan latihan tersendiri.
Sumber: https://nextjs.org/docs/app/getting-started/mutating-data
Sumber: https://nextjs.org/docs/app/guides/forms
Sumber: https://nextjs.org/docs/app/guides/data-security
-->

---
class: module-content
---

### Cek Pemahaman: Data Apa yang Boleh Diubah?

<LearningCheck
  id="modul-10-update-fields"
  question="PATCH usulan mengubah judul dan alasan. Pemanggil ikut mengirim id dan ownerId dalam body. Apa yang dilakukan server?"
  :options='["Meneruskan seluruh body ke set agar fleksibel", "Memvalidasi input, membatasi field sesuai kontrak, dan memeriksa ID dari route", "Mempercayai ownerId dari body karena lolos pengecekan tipe"]'
  :answer="1"
  explanation="Kontrak menentukan field yang boleh diubah. Server memvalidasi input dan target sebelum query. Pada aplikasi multi-user, hak mengubah target diperiksa memakai identitas dari sesi terverifikasi."
/>

<!--
Beri waktu untuk prediksi sebelum menampilkan jawaban. Gunakan reset untuk diskusi kelompok berikutnya.
Modul 11 memakai strictObject untuk menolak field tambahan pada PATCH. Endpoint preview memakai object yang membuang field tambahan dari output.
Jika peserta memilih jawaban benar, lanjutkan: mengapa where(id) belum cukup untuk usulan buku milik pengguna lain?
Latihan kelas tetap lokal single-user. Auth dan ownership dibahas lebih lanjut pada Modul 14.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade-out
---

## 4 Hal Penting dari Modul 10

<v-clicks>

1. **Buat Endpoint**: route.ts menghubungkan URL dan metode HTTP ke fungsi server.
2. **Validasi di Server**: jalankan schema pada request dan gunakan hasil validasinya.
3. **Kenali Penyimpanan**: Drizzle membantu query; database menyimpan data; migrasi mengubah strukturnya.
4. **Batasi Perubahan**: pilih field dan baris yang sesuai dengan kontrak API.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 11:</strong> Menyiapkan SQLite dan Drizzle, membuat CRUD usulan buku, lalu membuktikan data tetap ada setelah server restart.
</BrutalCard>

<!--
Checkpoint: GET health merespons 200; POST preview memberi 200 untuk input valid dan 400 untuk input salah; peserta dapat menjelaskan mengapa belum ada data tersimpan.
Pastikan peserta dapat membedakan schema validasi, schema tabel, dan migrasi serta menunjukkan fungsi where pada query.
Instalasi driver, konfigurasi Drizzle, koneksi, migrasi nyata, dan komponen UI CRUD dilanjutkan pada Modul 11.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**. Rujukan tambahan ada pada catatan slide.

::left::

#### Endpoint dan Validasi

- [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Referensi route.ts dan params](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js sebagai backend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Server Actions dan form](https://nextjs.org/docs/app/guides/forms)
- [Valibot: parse data](https://valibot.dev/guides/parse-data/)
- [Valibot: perilaku object](https://valibot.dev/api/object/)

::right::

#### Database dan Drizzle

- [Drizzle: pengantar](https://orm.drizzle.team/docs/overview)
- [SQLite: pilihan penggunaan](https://www.sqlite.org/whentouse.html)
- [Drizzle: tipe kolom SQLite](https://orm.drizzle.team/docs/sqlite/column-types)
- [Query select](https://orm.drizzle.team/docs/sqlite/select) · [insert](https://orm.drizzle.team/docs/sqlite/insert)
- [Query update](https://orm.drizzle.team/docs/sqlite/update) · [delete](https://orm.drizzle.team/docs/sqlite/delete)
- [Drizzle: migrasi](https://orm.drizzle.team/docs/migrations)

<!--
Versi stabil npm saat audit: drizzle-orm 0.45.4 dan drizzle-kit 0.31.11.
Sebagian panduan daring Drizzle sudah menampilkan instalasi @rc; contoh kelas memakai API stabil. Cocokkan dokumentasi dengan versi paket saat setup Modul 11.
Dokumentasi Next.js saat audit menampilkan versi 16.4.0; API yang digunakan di sini tersedia pada acuan kelas 16.3.7. Konfigurasi Cache Components tetap mengikuti kelas.
Sumber versi: https://registry.npmjs.org/drizzle-orm/latest
Sumber versi: https://registry.npmjs.org/drizzle-kit/latest
-->
