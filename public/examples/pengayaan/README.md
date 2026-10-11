# Menjalankan lab pengayaan

Lab pengayaan adalah latihan pilihan untuk memperluas proyek **Toko Belajar**. Kerjakan pada salinan proyek atau checkpoint yang sesuai agar Antum masih memiliki hasil jalur inti.

## Bedanya dengan latihan di slide

| Bahan                               | Cara memakainya                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Praktik di Modul 01–16              | Ikuti langkahnya pada proyek Toko Belajar yang sama; hasilnya dipakai pada modul berikutnya. |
| Pengayaan singkat di slide          | Bacaan, diskusi, atau eksperimen kecil sesuai petunjuk slide; boleh dilewati.                |
| Lab di `public/examples/pengayaan/` | Buka panduannya, siapkan salinan checkpoint, lalu terapkan perubahan kode yang diminta.      |

Folder pengayaan berisi **panduan Markdown dan sebagian berkas pendamping**. Folder ini tidak memiliki `package.json` sendiri. Jalankan perintah npm dari folder aplikasi Next.js yang dipakai untuk lab.

Panduan ini tidak otomatis menjadi slide Modul 01–16. Slide hanya menautkan lab yang relevan. Antum dapat membacanya lewat Markdown Preview di editor atau tampilan Markdown di GitHub; tautan dari presentasi dapat membuka teks mentah atau mengunduh berkas.

## Pilih titik mulai

| Lab                                        | Salinan awal                                                     | Yang dikerjakan dan dibuka                                                                                                                                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Zustand](./zustand.md)                    | [Checkpoint 06](../checkpoints/modul-06.zip)                     | Pasang Zustand dan ubah store/provider serta pemakai `useCart`; jalankan `npm run dev`, lalu coba katalog dan `/cart`.                                                                                                               |
| [Cache lanjutan](./cache-lanjutan.md)      | Hasil Modul 07 atau [checkpoint 08](../checkpoints/modul-08.zip) | Ubah opsi fetch dan `generateStaticParams` sesuai panduan; jalankan `npm run build` lalu `npm run start`, dan buka detail buku. Bagian Cache Components/PPR merupakan bacaan lanjutan, bukan aplikasi terpisah yang siap dijalankan. |
| [OpenAPI/Swagger](./swagger.md)            | [Checkpoint 11](../checkpoints/modul-11.zip)                     | Salin kontrak dan halaman pembacanya, pasang aset Swagger UI; jalankan `npm run dev`, lalu buka `/api-docs.html`.                                                                                                                    |
| [Server Action](./server-action/README.md) | [Checkpoint 11](../checkpoints/modul-11.zip)                     | Salin tiga berkas ke `src/app/action-preview/`; jalankan `npm run dev`, lalu buka `/action-preview`.                                                                                                                                 |

Semua URL di atas memakai alamat aplikasi Next.js, biasanya `http://localhost:3000`. Presentasi Slidev berjalan terpisah pada `http://localhost:3030`.

## Langkah umum

1. Ekstrak ZIP checkpoint ke folder baru untuk lab tersebut. Jangan menimpa proyek utama atau lab lain.
2. Buka terminal di folder hasil ekstraksi yang memiliki `package.json`.
3. Jalankan `npm ci` untuk memasang dependensi sesuai lockfile. `npm run dev` hanya menyalakan aplikasi; perintah itu tidak memasang dependensi.
4. Untuk checkpoint 08 dan 11, salin `.env.example` menjadi `.env`. Untuk checkpoint 11, jalankan juga `npm run db:migrate` sebelum menyalakan aplikasi.
5. Ikuti perubahan kode pada panduan lab, lalu jalankan perintah dan buka URL yang tercantum di tabel.
6. Setelah selesai, hentikan server dengan `Ctrl+C`. Lanjutkan modul inti dari proyek utama Antum.

Lab cache membutuhkan API buku asli. Untuk lab lain, opsi fixture pada README checkpoint 08/11 membantu bila akses Open Library bermasalah.

## Contoh lengkap: Server Action dari repository ini

Perintah berikut untuk terminal macOS/Linux. Mulai dari **root repository presentasi**, tempat `slides.md` berada. Gunakan folder tujuan baru agar hasil lab sebelumnya tidak tertimpa.

```bash
mkdir -p latihan.local/server-action
unzip public/examples/checkpoints/modul-11.zip -d latihan.local/server-action
mkdir -p latihan.local/server-action/modul-11/src/app/action-preview
cp public/examples/pengayaan/server-action/actions.ts latihan.local/server-action/modul-11/src/app/action-preview/
cp public/examples/pengayaan/server-action/preview-form.tsx latihan.local/server-action/modul-11/src/app/action-preview/
cp public/examples/pengayaan/server-action/page.tsx latihan.local/server-action/modul-11/src/app/action-preview/
cd latihan.local/server-action/modul-11
npm ci
cp .env.example .env
npm run db:migrate
npm run dev
```

Buka `http://localhost:3000/action-preview`. Coba input tidak valid, lalu input valid. Form memvalidasi dan menampilkan hasil; lab ini tidak menyimpan usulan ke database. Langkah migrasi menyiapkan fitur CRUD bawaan checkpoint.

Jika menjalankan lewat unduhan ZIP saja, ekstrak checkpoint secara manual dan unduh tiga berkas dari [panduan Server Action](./server-action/README.md) ke lokasi yang sama. Perintah mulai `npm ci` tetap dijalankan dari folder aplikasi.

Jalankan satu lab pada satu waktu. Jika port 3000 sedang digunakan, hentikan server latihan sebelumnya atau gunakan `npm run dev -- --port 3001` dan sesuaikan URL yang dibuka.
