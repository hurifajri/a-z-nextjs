# Lab setelah Modul 11: OpenAPI dan Swagger UI

Prasyarat: CRUD Modul 11 berjalan. Lab opsional; jalur inti memakai kontrak ringkas Modul 10. API tanpa akun hanya untuk latihan lokal. Setelah Modul 14, perbarui kontrak menjadi versi berakun.

### Dari API yang Berjalan ke Kontrak yang Bisa Dibaca

Teman satu tim ingin memakai fitur **Usulan Buku Toko Belajar**.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <strong>Modul 11</strong><br/>API menyimpan dan mengubah usulan di SQLite.
  <strong>Modul 12</strong><br/>Form dan kartu membuat fitur nyaman dipakai.
  <strong>lab ini</strong><br/>Dokumentasi menjelaskan cara memanggil API dan hasilnya.
</div>

- Field apa yang harus dikirim saat mengedit?
- Bagaimana bentuk respons berhasil dan gagal?
- Apa yang dilakukan client setelah DELETE berhasil?

### Bedakan Dokumen dan Alat Pembacanya

OpenAPI dan Swagger UI bekerja bersama.

#### OpenAPI

Dokumen YAML atau JSON yang mendeskripsikan API:

- Path dan metode HTTP.
- Parameter serta request body.
- Schema respons dan status HTTP.
- Kebutuhan autentikasi jika ada.

#### Swagger UI

Alat yang menampilkan dokumen OpenAPI sebagai halaman interaktif.

- Buka rincian suatu operasi.
- Baca contoh input dan output.
- Gunakan **Try it out → Execute** untuk mengirim request.

Dokumentasi tidak membuat endpoint atau memasang validasi secara otomatis. Kode server tetap menjalankan aturannya.

### Baca Empat Operasi yang Sudah Kita Punya

Semua operasi berikut mengelola **usulan buku**, dengan field `id`, `title`, dan `reason`.

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

    GET
    <strong>/api/suggestions</strong>
    <p>Baca daftar → <code>200</code> dengan array usulan.</p>


    POST
    <strong>/api/suggestions</strong>
    <p>Kirim judul dan alasan → <code>201</code> dengan usulan tersimpan.</p>


    PATCH
    <strong>/api/suggestions/{id}</strong>
    <p>Kirim judul dan alasan bersama → <code>200</code> dengan hasil edit.</p>


    DELETE
    <strong>/api/suggestions/{id}</strong>
    <p>Hapus target → <code>204</code> tanpa body respons.</p>

</div>

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

- `7` mengisi **path parameter** `{id}`.
- `title` dan `reason` berada di **request body** JSON.
- **Query parameter**, seperti `?page=2`, hanya dipakai jika API mendukungnya.
- API latihan saat ini belum menyediakan filter atau pagination server.

### Siapkan Dokumen Pendamping

Unduh [openapi.yaml untuk Toko Belajar](/examples/contracts/suggestions.openapi.yaml), lalu simpan sebagai **`public/openapi.yaml` di proyek Next.js**.

```text
proyek-toko-belajar/
├── public/
│   └── openapi.yaml       ← dokumen lengkap dari tautan di atas
├── src/app/api/suggestions/
│   ├── route.ts          ← GET dan POST dari Modul 11
│   └── [id]/route.ts      ← PATCH dan DELETE dari Modul 11
└── package.json
```

- Jalankan aplikasi, lalu buka `http://localhost:3000/openapi.yaml`.
- File ini mendokumentasikan API modul 11–12 yang belum memakai akun.
- Slide berikut membaca potongan dokumen; berkas unduhan sudah lengkap.

### Baca Kepala Dokumen OpenAPI

Potongan awal `public/openapi.yaml`:

```yaml
openapi: 3.1.0
info:
  title: API Usulan Buku Toko Belajar
  version: 1.0.0
servers:
  - url: /
    description: Server Next.js yang menyajikan dokumentasi ini
```

- `openapi` menyebut versi **format dokumen**.
- `info.version` menyebut versi **kontrak API latihan**.
- `servers` menentukan alamat tujuan request dari dokumentasi.
- `url: /` memakai origin yang sama; port mengikuti aplikasi yang dibuka.

### Baca Schema Usulan yang Dikembalikan

Di bawah `components.schemas`, cari `Suggestion`:

```yaml
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

- `required` menunjukkan field yang harus ada pada respons.
- `properties` menjelaskan tipe setiap field.
- ID `1` pada contoh hanya ilustrasi; gunakan ID yang benar-benar dikembalikan server.

### Perhatikan Aturan Tambah dan Edit

Baca `CreateSuggestion`, `UpdateSuggestion`, serta deskripsi operasinya.

| Aturan               | POST                      | PATCH                         |
| -------------------- | ------------------------- | ----------------------------- |
| `title` dan `reason` | Keduanya wajib            | Keduanya wajib                |
| Spasi tepi           | Dipangkas server          | Dipangkas server              |
| Panjang setelah trim | Judul 3–80; alasan 10–500 | Aturan yang sama              |
| Field tambahan       | Diabaikan oleh `v.object` | Ditolak oleh `v.strictObject` |
| ID target            | Dibuat database           | Diambil dari path             |

Baca deskripsi bersama schema. Dokumen OpenAPI tidak menjalankan transformasi <code>trim()</code> milik Valibot.

### Ikuti Referensi Schema pada Respons

Cari operasi `get` di bawah `/api/suggestions`:

```yaml
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

- `content` menyebut format body yang dikembalikan.
- `type: array` berarti respons GET berupa daftar.
- `$ref` menunjuk definisi yang dapat dipakai kembali dalam dokumen.
- Daftar kosong adalah **`[]` dengan 200**, bukan kegagalan.

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

- Aset lokal membuat browser memuat UI dan API dari origin yang sama.
- Buat `public/api-docs.html` pada slide berikut.
- Buka melalui server Next.js; URL latihannya **`/api-docs.html`**.

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

### Praktik 1: Baca dan Tambah Usulan

Buka **`http://localhost:3000/api-docs.html`** ketika aplikasi berjalan.

1. Buka **GET /api/suggestions** → **Try it out** → **Execute**.
2. Periksa **Request URL**, status **200**, dan array di **Response body**.
3. Buka **POST /api/suggestions** dan kirim contoh judul serta alasan.
4. Pastikan hasil **201** berisi `id`, `title`, dan `reason`.
5. Jalankan GET lagi, lalu muat ulang `/suggestions`; usulan yang sama muncul.

Execute benar-benar memanggil API lokal. Catat ID usulan yang baru dibuat untuk latihan edit dan hapus berikutnya.

### Praktik 2: Edit dan Hapus ID yang Sama

Gunakan ID hasil POST sebelumnya, misalnya `7`.

1. Pada **PATCH**, isi path `id` dengan ID tadi.
2. Kirim `title` **dan** `reason`; pastikan **200** mengembalikan hasil edit.
3. Kirim hanya `title`; pastikan mendapat **400**, lalu periksa data tetap sama.
4. Pada **DELETE**, masukkan ID yang sama; hasil pertama **204**, tanpa JSON.
5. Ulangi DELETE pada ID itu; hasil **404** karena usulan sudah dihapus.

Bandingkan dokumentasi dengan bukti: status, body respons, dan perubahan data pada GET berikutnya.

### Hubungkan Kembali ke Helper Frontend

Buka **`src/lib/suggestions.ts` dari modul 11**; cocokkan dengan kontrak.

#### Simpan: Ada JSON

```ts
if (!res.ok) {
  throw new Error(`Penyimpanan: HTTP ${res.status}`);
}
return v.parse(SavedSuggestionSchema, await res.json());
```

POST dan PATCH memeriksa status, lalu memvalidasi respons.

#### Hapus: Tanpa Body

```ts
if (!res.ok) {
  throw new Error(`Penghapusan: HTTP ${res.status}`);
}
```

DELETE sukses selesai tanpa `res.json()`.

Potongan ini sudah ada dalam helper lama. Gunakan kontrak untuk memeriksa perilakunya sebelum menambah abstraksi baru.

### Tiga Bentuk Schema, Tiga Peran

Field-nya saling berkaitan, tetapi digunakan pada tahap berbeda.

| Bentuk         | Dipakai untuk                     | Contoh pada Toko Belajar              |
| -------------- | --------------------------------- | ------------------------------------- |
| Schema Drizzle | Struktur tabel database           | Kolom `book_suggestions`              |
| Schema Valibot | Memeriksa data saat kode berjalan | Input form/server dan JSON respons    |
| Schema OpenAPI | Mendokumentasikan bentuk data API | Request body dan respons tiap operasi |

- Tipe TypeScript membantu saat menulis dan memeriksa kode.
- Data JSON dari jaringan tetap perlu diperiksa saat aplikasi berjalan.
- Jika kontrak berubah, periksa dampaknya pada dokumentasi, server, dan client.

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

### Jika API Berasal dari Tim Backend

Gunakan kebiasaan membaca kontrak yang sama saat bekerja dengan tim lain.

- Minta **URL dokumentasi, base URL, dan lingkungan uji** yang benar.
- Sepakati field wajib, nilai `null`, pagination, dan bentuk error.
- Coba satu request sederhana sebelum menghubungkannya ke UI.
- Bila perilaku berbeda, bagikan endpoint, status, dan langkah reproduksi.
- Hilangkan token, cookie, password, dan data pribadi dari laporan.

Jika origin backend berbeda, periksa aturan CORS atau jalur server aplikasi. CORS tidak memberi izin pengguna untuk membaca atau mengubah data.

### Kenali Informasi Autentikasi dalam Kontrak

Saat membaca API lain, cari **security scheme** dan operasi yang memerlukannya.

- Metodenya bisa berupa cookie sesi, API key, atau bearer token.
- `401` menunjukkan kredensial autentikasi yang valid diperlukan.
- `403` menunjukkan server menolak akses yang diminta.
- Deklarasi security di dokumentasi perlu didukung pemeriksaan pada server.

Modul 14 menambahkan login dan kepemilikan usulan. Setelah itu, kontrak API ini ikut diperbarui.

### Cek Pemahaman: Hapus Berhasil, Client Malah Error

## 3 Hal Penting dari lab ini

1. **Baca Kontrak**: pahami path, input, schema respons, dan status HTTP.
2. **Buktikan dengan Request**: gunakan Swagger UI pada API usulan buku sendiri.
3. **Cocokkan Tiga Bagian**: dokumentasi, perilaku server, dan helper frontend.

Kembali ke jalur inti setelah selesai; akun dan izin akses ditambahkan pada Modul 14.

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**.

#### OpenAPI dan Swagger

- [Spesifikasi OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html)
- [OpenAPI dan keluarga alat Swagger](https://swagger.io/docs/specification/v3_0/about/)
- [Instalasi Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)
- [Konfigurasi Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)
- [Dokumen latihan lengkap](/examples/contracts/suggestions.openapi.yaml)

#### Cocokkan dengan Aplikasi

- [Fetch dan pemeriksaan respons](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Respons HTTP 204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204)
- [Valibot: memeriksa data](https://valibot.dev/guides/parse-data/)
- [Next.js: berkas public](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
