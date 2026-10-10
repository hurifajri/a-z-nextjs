---
layout: intro
badge: "MODUL 13"
badgeColor: "pink"
level: 1
---

## 13. Kontrak API Toko Belajar dengan OpenAPI/Swagger

Membaca dokumentasi, mencoba endpoint, dan mencocokkan kontrak dengan API usulan buku yang sudah berjalan.

<!--
Lanjutkan proyek Next.js Toko Belajar dari Modul 11–12. API /api/suggestions dan database lokal tetap dipakai.
Latihan inti tetap single-user lokal; login, sesi, dan ownership diterapkan pada Modul 14.
Acuan: Next.js 16.3.7, React 19, Node.js 24 LTS, Swagger UI 5.33.1. Audit sumber: 9 Oktober 2026.
OpenAPI 3.1.0 dipilih sebagai format contoh yang didukung alat latihan; ini bukan klaim versi terbaru spesifikasi.
-->

---
class: module-content
---

### Dari API yang Berjalan ke Kontrak yang Bisa Dibaca

Teman satu tim ingin memakai fitur **Usulan Buku Toko Belajar**.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click><strong>Modul 11</strong><br/>API menyimpan dan mengubah usulan di SQLite.</BrutalCard>
  <BrutalCard v-click><strong>Modul 12</strong><br/>Form dan kartu membuat fitur nyaman dipakai.</BrutalCard>
  <BrutalCard v-click><strong>Modul 13</strong><br/>Dokumentasi menjelaskan cara memanggil API dan hasilnya.</BrutalCard>
</div>

<v-clicks>

- Field apa yang harus dikirim saat mengedit?
- Bagaimana bentuk respons berhasil dan gagal?
- Apa yang dilakukan client setelah DELETE berhasil?

</v-clicks>

<!--
Minta peserta menjawab dari latihan sebelumnya, lalu perlihatkan bahwa anggota tim baru membutuhkan jawaban yang tercatat.
Kontrak berarti kesepakatan tentang request dan response. Dokumentasi harus mengikuti perilaku server yang dapat dibuktikan.
-->

---
class: module-content
layout: two-cols
---

### Bedakan Dokumen dan Alat Pembacanya

OpenAPI dan Swagger UI bekerja bersama.

::left::

#### OpenAPI

Dokumen YAML atau JSON yang mendeskripsikan API:

- Path dan metode HTTP.
- Parameter serta request body.
- Schema respons dan status HTTP.
- Kebutuhan autentikasi jika ada.

::right::

#### Swagger UI

Alat yang menampilkan dokumen OpenAPI sebagai halaman interaktif.

- Buka rincian suatu operasi.
- Baca contoh input dan output.
- Gunakan **Try it out → Execute** untuk mengirim request.

::bottom::

<BrutalCard v-click class="text-sm">Dokumentasi tidak membuat endpoint atau memasang validasi secara otomatis. Kode server tetap menjalankan aturannya.</BrutalCard>

<!--
Swagger adalah keluarga alat; Swagger UI adalah salah satunya. Hindari menyamakan nama alat dengan spesifikasi kontrak.
Sumber: https://swagger.io/docs/specification/v3_0/about/
Sumber: https://spec.openapis.org/oas/v3.1.0.html
-->

---
class: module-content
---

### Baca Empat Operasi yang Sudah Kita Punya

Semua operasi berikut mengelola **usulan buku**, dengan field `id`, `title`, dan `reason`.

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="green">GET</BrutalBadge>
    <strong>/api/suggestions</strong>
    <p>Baca daftar → <code>200</code> dengan array usulan.</p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="yellow">POST</BrutalBadge>
    <strong>/api/suggestions</strong>
    <p>Kirim judul dan alasan → <code>201</code> dengan usulan tersimpan.</p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="cyan">PATCH</BrutalBadge>
    <strong>/api/suggestions/{id}</strong>
    <p>Kirim judul dan alasan bersama → <code>200</code> dengan hasil edit.</p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="pink">DELETE</BrutalBadge>
    <strong>/api/suggestions/{id}</strong>
    <p>Hapus target → <code>204</code> tanpa body respons.</p>
  </BrutalCard>
</div>

<!--
Tidak ada GET /api/suggestions/{id} pada implementasi Modul 11. Jangan menambahkannya ke dokumentasi seolah sudah tersedia.
Katalog Open Library tetap memakai alur Modul 07–08. Membuat usulan tidak mengubah katalog Open Library.
-->

---
class: module-content
---

### Path, Parameter, dan Body Memiliki Tempat Berbeda

Contoh request untuk memperbaiki usulan nomor **7**:

```http
PATCH /api/suggestions/7
Content-Type: application/json

{
  "title": "Learning React Edisi Revisi",
  "reason": "Edisi ini dipilih untuk latihan komponen dan hooks."
}
```

<v-clicks>

- `7` mengisi **path parameter** `{id}`.
- `title` dan `reason` berada di **request body** JSON.
- **Query parameter**, seperti `?page=2`, hanya dipakai jika API mendukungnya.
- API latihan saat ini belum menyediakan filter atau pagination server.

</v-clicks>

<!--
Pada kontrak latihan, PATCH memerlukan title dan reason bersama. Jangan mengasumsikan semua field PATCH selalu opsional.
Pagination lokal pada pengayaan Modul 12 hanya membagi data yang sudah dimuat.
Sumber: https://swagger.io/docs/specification/v3_0/describing-parameters/
Sumber: https://swagger.io/docs/specification/v3_0/describing-request-body/describing-request-body/
-->

---
class: module-content
---

### Siapkan Dokumen Pendamping

Unduh [openapi.yaml untuk Toko Belajar](/examples/modul-13/openapi.yaml), lalu simpan sebagai **`public/openapi.yaml` di proyek Next.js**.

```text
proyek-toko-belajar/
├── public/
│   └── openapi.yaml       ← dokumen lengkap dari tautan di atas
├── src/app/api/suggestions/
│   ├── route.ts          ← GET dan POST dari Modul 11
│   └── [id]/route.ts      ← PATCH dan DELETE dari Modul 11
└── package.json
```

<v-clicks>

- Jalankan aplikasi, lalu buka `http://localhost:3000/openapi.yaml`.
- File ini mendokumentasikan API modul 11–13 yang belum memakai akun.
- Slide berikut membaca potongan dokumen; berkas unduhan sudah lengkap.

</v-clicks>

<!--
Di repositori slide, sumber dokumen berada pada public/examples/modul-13/openapi.yaml.
Tautan dibuka dari presentasi; salin hasilnya ke public/openapi.yaml dalam proyek peserta. Jangan mengunduhnya dari localhost:3000 sebelum file disalin.
Bila browser membuka YAML sebagai teks, gunakan Save As. Sesuaikan port dengan server Next.js peserta.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/public-folder
-->

---
class: module-content
---

### Baca Kepala Dokumen OpenAPI

Potongan awal `public/openapi.yaml`:

```yaml {1|2-4|5-7|all}
openapi: 3.1.0
info:
  title: API Usulan Buku Toko Belajar
  version: 1.0.0
servers:
  - url: /
    description: Server Next.js yang menyajikan dokumentasi ini
```

<v-clicks>

- `openapi` menyebut versi **format dokumen**.
- `info.version` menyebut versi **kontrak API latihan**.
- `servers` menentukan alamat tujuan request dari dokumentasi.
- `url: /` memakai origin yang sama; port mengikuti aplikasi yang dibuka.

</v-clicks>

<!--
YAML memakai indentasi untuk menunjukkan susunan data. Gunakan spasi, bukan tab.
servers relatif menghindari hard-code localhost:3000 sehingga dokumentasi tetap bekerja saat port lokal berubah.
Sumber: https://spec.openapis.org/oas/v3.1.0.html#server-object
-->

---
class: module-content
---

### Baca Schema Usulan yang Dikembalikan

Di bawah `components.schemas`, cari `Suggestion`:

```yaml {1-3|4-8|9-12|all}
Suggestion:
  type: object
  required: [id, title, reason]
  properties:
    id:
      type: integer
      minimum: 1
      maximum: 9007199254740991
    title:
      type: string
    reason:
      type: string
```

<v-clicks>

- `required` menunjukkan field yang harus ada pada respons.
- `properties` menjelaskan tipe setiap field.
- ID `1` pada contoh hanya ilustrasi; gunakan ID yang benar-benar dikembalikan server.

</v-clicks>

<!--
Batas ID mengikuti safe integer yang dipakai SuggestionIdSchema pada Modul 11.
Sorotan terakhir mencakup title/reason. Tidak ada ownerId/userId pada respons publik modul ini.
Sumber: https://spec.openapis.org/oas/v3.1.0.html#schema-object
-->

---
class: module-content
---

### Perhatikan Aturan Tambah dan Edit

Baca `CreateSuggestion`, `UpdateSuggestion`, serta deskripsi operasinya.

| Aturan               | POST                      | PATCH                         |
| -------------------- | ------------------------- | ----------------------------- |
| `title` dan `reason` | Keduanya wajib            | Keduanya wajib                |
| Spasi tepi           | Dipangkas server          | Dipangkas server              |
| Panjang setelah trim | Judul 3–80; alasan 10–500 | Aturan yang sama              |
| Field tambahan       | Diabaikan oleh `v.object` | Ditolak oleh `v.strictObject` |
| ID target            | Dibuat database           | Diambil dari path             |

<BrutalCard v-click class="mt-4 text-sm">Baca deskripsi bersama schema. Dokumen OpenAPI tidak menjalankan transformasi <code>trim()</code> milik Valibot.</BrutalCard>

<!--
Aturan ini mengikuti kode Modul 09 dan 11, bukan kebiasaan umum semua API.
Di YAML, batas panjang hasil trim dituliskan dalam description, bukan minLength/maxLength pada string mentah. Dengan begitu dokumen tidak salah menolak input yang akan dipangkas server.
Valibot minLength/maxLength pada string mengikuti length JavaScript (unit kode UTF-16), sedangkan JSON Schema menghitung karakter Unicode. Detail ini tertulis di dokumen pendamping; cukup jelaskan trim pada jalur utama pemula.
Sumber: https://valibot.dev/api/object/
Sumber: https://valibot.dev/api/strictObject/
Sumber: https://valibot.dev/api/trim/
-->

---
class: module-content
---

### Ikuti Referensi Schema pada Respons

Cari operasi `get` di bawah `/api/suggestions`:

```yaml {1-3|4-8|9|all}
responses:
  "200":
    description: Daftar usulan; array kosong bila belum ada data
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: "#/components/schemas/Suggestion"
```

<v-clicks>

- `content` menyebut format body yang dikembalikan.
- `type: array` berarti respons GET berupa daftar.
- `$ref` menunjuk definisi yang dapat dipakai kembali dalam dokumen.
- Daftar kosong adalah **`[]` dengan 200**, bukan kegagalan.

</v-clicks>

<!--
Tanda # pada $ref berarti referensi dalam dokumen yang sama. Ini bukan import TypeScript.
Sumber: https://spec.openapis.org/oas/v3.1.0.html#reference-object
Sumber: https://swagger.io/docs/specification/v3_0/describing-responses/
-->

---
class: module-content
---

### Jalankan Swagger UI dari Proyek yang Sama

Di root proyek Next.js, pasang versi latihan dan salin asetnya ke `public`.

```bash
npm install -D --save-exact swagger-ui-dist@5.33.1
mkdir -p public/swagger-ui
cp node_modules/swagger-ui-dist/swagger-ui.css public/swagger-ui/
cp node_modules/swagger-ui-dist/swagger-ui-bundle.js public/swagger-ui/
cp node_modules/swagger-ui-dist/LICENSE public/swagger-ui/
cp node_modules/swagger-ui-dist/NOTICE public/swagger-ui/
cp node_modules/swagger-ui-dist/swagger-ui-bundle.js.LICENSE.txt public/swagger-ui/
```

<v-clicks>

- Aset lokal membuat browser memuat UI dan API dari origin yang sama.
- Buat `public/api-docs.html` pada slide berikut.
- Buka melalui server Next.js; URL latihannya **`/api-docs.html`**.

</v-clicks>

<!--
Perintah mkdir/cp untuk terminal POSIX; di PowerShell/File Explorer buat folder lalu salin lima file yang sama.
Paket dipasang di aplikasi peserta, bukan repositori Slidev. Simpan lockfile. Saat mengubah versi Swagger UI, salin ulang aset beserta lisensinya.
/ docs dan /swagger bukan URL bawaan semua backend. Pada latihan ini alamat ditentukan nama file public/api-docs.html.
Sumber: https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/
Sumber: https://github.com/swagger-api/swagger-ui
-->

---
class: module-content
---

### Buat Halaman Pembaca Dokumentasi

Isi lengkap **`public/api-docs.html`**:

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dokumentasi API Toko Belajar</title>
    <link rel="stylesheet" href="/swagger-ui/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="/swagger-ui/swagger-ui-bundle.js"></script>
    <script>
      SwaggerUIBundle({
        url: "/openapi.yaml",
        dom_id: "#swagger-ui",
        validatorUrl: null,
      });
    </script>
  </body>
</html>
```

<!--
SwaggerUIBundle membaca spesifikasi lokal. validatorUrl null menonaktifkan panggilan validator daring; ini tidak berarti kontrak sudah diuji terhadap server.
Berkas HTML ini adalah alat latihan API, bukan pengganti UI /suggestions dari Modul 12.
Sumber: https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
-->

---
class: module-content
---

### Praktik 1: Baca dan Tambah Usulan

Buka **`http://localhost:3000/api-docs.html`** ketika aplikasi berjalan.

<v-clicks>

1. Buka **GET /api/suggestions** → **Try it out** → **Execute**.
2. Periksa **Request URL**, status **200**, dan array di **Response body**.
3. Buka **POST /api/suggestions** dan kirim contoh judul serta alasan.
4. Pastikan hasil **201** berisi `id`, `title`, dan `reason`.
5. Jalankan GET lagi, lalu muat ulang `/suggestions`; usulan yang sama muncul.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">Execute benar-benar memanggil API lokal. Catat ID usulan yang baru dibuat untuk latihan edit dan hapus berikutnya.</BrutalCard>

<!--
Swagger UI menampilkan dokumentasi respons dan respons server aktual pada bagian berbeda. Arahkan peserta membaca Server response setelah Execute.
UI /suggestions dibaca oleh Server Component. Mutasi dari halaman dokumentasi tidak otomatis menjalankan router.refresh pada tab UI; muat ulang tab tersebut.
-->

---
class: module-content
---

### Praktik 2: Edit dan Hapus ID yang Sama

Gunakan ID hasil POST sebelumnya, misalnya `7`.

<v-clicks>

1. Pada **PATCH**, isi path `id` dengan ID tadi.
2. Kirim `title` **dan** `reason`; pastikan **200** mengembalikan hasil edit.
3. Kirim hanya `title`; pastikan mendapat **400**, lalu periksa data tetap sama.
4. Pada **DELETE**, masukkan ID yang sama; hasil pertama **204**, tanpa JSON.
5. Ulangi DELETE pada ID itu; hasil **404** karena usulan sudah dihapus.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">Bandingkan dokumentasi dengan bukti: status, body respons, dan perubahan data pada GET berikutnya.</BrutalCard>

<!--
Jika UI mencegah pengiriman field wajib yang hilang, kirim kasus tersebut melalui fetch di console aplikasi atau REST client. Server tetap harus menolak request tidak valid.
Jangan memakai ID tebakan untuk menghapus data; gunakan data latihan yang baru dibuat sendiri.
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404
-->

---
class: module-content
layout: two-cols
---

### Hubungkan Kembali ke Helper Frontend

Buka **`src/lib/suggestions.ts` dari modul 11**; cocokkan dengan kontrak.

::left::

#### Simpan: Ada JSON

```ts
if (!res.ok) {
  throw new Error(`Penyimpanan: HTTP ${res.status}`);
}
return v.parse(SavedSuggestionSchema, await res.json());
```

POST dan PATCH memeriksa status, lalu memvalidasi respons.

::right::

#### Hapus: Tanpa Body

```ts
if (!res.ok) {
  throw new Error(`Penghapusan: HTTP ${res.status}`);
}
```

DELETE sukses selesai tanpa `res.json()`.

::bottom::

<BrutalCard v-click class="text-sm">Potongan ini sudah ada dalam helper lama. Gunakan kontrak untuk memeriksa perilakunya sebelum menambah abstraksi baru.</BrutalCard>

<!--
Tidak perlu membuat lib/api.ts generik yang menggantikan seluruh alur. Helper sendSuggestion dan deleteSuggestion sudah sesuai kebutuhan fitur ini.
Fetch tidak otomatis throw untuk HTTP 400/500. Promise fetch dapat reject untuk kegagalan jaringan; kedua kasus perlu dipahami berbeda.
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
Sumber: https://valibot.dev/guides/parse-data/
-->

---
class: module-content
---

### Tiga Bentuk Schema, Tiga Peran

Field-nya saling berkaitan, tetapi digunakan pada tahap berbeda.

| Bentuk         | Dipakai untuk                     | Contoh pada Toko Belajar              |
| -------------- | --------------------------------- | ------------------------------------- |
| Schema Drizzle | Struktur tabel database           | Kolom `book_suggestions`              |
| Schema Valibot | Memeriksa data saat kode berjalan | Input form/server dan JSON respons    |
| Schema OpenAPI | Mendokumentasikan bentuk data API | Request body dan respons tiap operasi |

<v-clicks>

- Tipe TypeScript membantu saat menulis dan memeriksa kode.
- Data JSON dari jaringan tetap perlu diperiksa saat aplikasi berjalan.
- Jika kontrak berubah, periksa dampaknya pada dokumentasi, server, dan client.

</v-clicks>

<!--
Generated TypeScript dari OpenAPI merupakan pengayaan, bukan syarat latihan. Hasil code generation tidak dengan sendirinya memvalidasi respons runtime.
Kelas memakai dokumen kecil yang ditinjau bersama implementasi. Pembangkitan otomatis dapat dipelajari ketika manfaatnya nyata.
Sumber: https://valibot.dev/guides/parse-data/
Sumber: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
-->

---
class: module-content
---

### Checkpoint: Dokumentasi Sesuai Perilaku API

Jalankan dengan data latihan sendiri dan catat hasilnya.

| Percobaan                     | Harapan                                  |
| ----------------------------- | ---------------------------------------- |
| GET sebelum ada data          | `200` dan `[]`                           |
| POST judul/alasan valid       | `201`; data tetap ada setelah muat ulang |
| POST alasan terlalu pendek    | `400`; tidak ada usulan baru             |
| PATCH hanya mengirim judul    | `400`; data lama tetap sama              |
| PATCH ID valid yang tidak ada | `404`                                    |
| DELETE usulan baru            | `204`; body kosong                       |
| DELETE ID yang sama lagi      | `404`                                    |

<!--
GET kosong dapat diperiksa pada database latihan yang memang belum punya data; tidak perlu menghapus semua data hanya demi checklist.
Jika server 500, jangan menganggap semua body pasti JSON. Kontrak mendokumentasikan kegagalan tak terduga tanpa menjanjikan schema body.
Pengujian otomatis dan mock API dilanjutkan pada Modul 15.
-->

---
class: module-content
---

### Jika API Berasal dari Tim Backend

Gunakan kebiasaan membaca kontrak yang sama saat bekerja dengan tim lain.

<v-clicks>

- Minta **URL dokumentasi, base URL, dan lingkungan uji** yang benar.
- Sepakati field wajib, nilai `null`, pagination, dan bentuk error.
- Coba satu request sederhana sebelum menghubungkannya ke UI.
- Bila perilaku berbeda, bagikan endpoint, status, dan langkah reproduksi.
- Hilangkan token, cookie, password, dan data pribadi dari laporan.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">Jika origin backend berbeda, periksa aturan CORS atau jalur server aplikasi. CORS tidak memberi izin pengguna untuk membaca atau mengubah data.</BrutalCard>

<!--
Backend terpisah adalah konteks kolaborasi, bukan prasyarat baru bagi proyek latihan.
Next.js Route Handler bisa menjadi perantara ketika dibutuhkan. Server Component yang mengakses database sendiri tetap dapat membaca langsung, seperti Modul 11.
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
-->

---
class: module-content
---

### Kenali Informasi Autentikasi dalam Kontrak

Saat membaca API lain, cari **security scheme** dan operasi yang memerlukannya.

<v-clicks>

- Metodenya bisa berupa cookie sesi, API key, atau bearer token.
- `401` menunjukkan kredensial autentikasi yang valid diperlukan.
- `403` menunjukkan server menolak akses yang diminta.
- Deklarasi security di dokumentasi perlu didukung pemeriksaan pada server.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">Modul 14 menambahkan login dan kepemilikan usulan. Setelah itu, kontrak API ini ikut diperbarui.</BrutalCard>

<!--
Dokumen unduhan modul ini belum mendeklarasikan autentikasi karena endpoint Modul 11–13 memang belum memeriksanya.
Pembahasan JWT, cookie, sesi, dan otorisasi dipusatkan pada Modul 14 setelah peserta memahami alasan fitur tersebut diperlukan.
Sumber: https://spec.openapis.org/oas/v3.1.0.html#security-scheme-object
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403
-->

---
class: module-content
---

### Cek Pemahaman: Hapus Berhasil, Client Malah Error

<LearningCheck
  question="DELETE mengembalikan 204, lalu client menjalankan res.json(). Apa perbaikannya?"
  :options="[
    'Ulangi DELETE sampai server mengirim JSON.',
    'Sesuaikan client: periksa status, lalu selesai tanpa membaca JSON.',
    'Ubah semua respons API menjadi status 200.',
  ]"
  :answer="1"
  explanation="Respons 204 tidak memiliki body. Client mengikuti kontrak respons setiap operasi; menjalankan parse JSON pada body kosong dapat menimbulkan error setelah penghapusan sebenarnya berhasil."
/>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 13

<v-clicks>

1. **Baca Kontrak**: pahami path, input, schema respons, dan status HTTP.
2. **Buktikan dengan Request**: gunakan Swagger UI pada API usulan buku sendiri.
3. **Cocokkan Tiga Bagian**: dokumentasi, perilaku server, dan helper frontend.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">🚀 <strong>Selanjutnya di Modul 14:</strong> Login, sesi, dan hak akses — setiap pengguna mengelola usulan bukunya sendiri.</BrutalCard>

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**.

::left::

#### OpenAPI dan Swagger

- [Spesifikasi OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html)
- [OpenAPI dan keluarga alat Swagger](https://swagger.io/docs/specification/v3_0/about/)
- [Instalasi Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)
- [Konfigurasi Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)
- [Dokumen latihan lengkap](/examples/modul-13/openapi.yaml)

::right::

#### Cocokkan dengan Aplikasi

- [Fetch dan pemeriksaan respons](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Respons HTTP 204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204)
- [Valibot: memeriksa data](https://valibot.dev/guides/parse-data/)
- [Next.js: berkas public](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
