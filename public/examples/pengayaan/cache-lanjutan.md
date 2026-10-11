# Pengayaan setelah Modul 07: invalidasi dan model cache

Lab pilihan; tidak menjadi prasyarat modul berikutnya. Kerjakan pada salinan checkpoint agar jalur inti tetap tersedia.

Jika memakai [checkpoint 08](../checkpoints/modul-08.zip), ekstrak ke folder baru, jalankan `npm ci`, lalu salin `.env.example` menjadi `.env` di folder aplikasi. [Panduan menjalankan lab](./README.md) menjelaskan persiapan bersama. Bagian eksperimen berikut dapat langsung dipraktikkan; bagian invalidasi, Cache Components, dan PPR menjadi bacaan lanjutan yang memerlukan penyesuaian proyek.

### Eksperimen: Render Saat Request

Mulai dari hasil Modul 07 atau salinan checkpoint 08. Pertahankan `cacheComponents: false` dan `partialPrefetching: false`.

1. Nonaktifkan `BOOKS_SOURCE=fixture` bila sebelumnya dipakai. Eksperimen ini memakai fetch API asli.
2. Di `src/lib/books.ts`, ganti opsi fetch berikut; pemeriksaan respons tetap dipertahankan:

```ts
const res = await fetch(url, { cache: "no-store" });
```

3. Hapus sementara ekspor `generateStaticParams` dari `src/app/products/[id]/page.tsx`.
4. Hentikan server, jalankan `npm run build`, lalu `npm run start` dari folder aplikasi. Periksa bahwa route detail kini dirender saat request. Buka `http://localhost:3000/products/OL20915214W` langsung, lalu reload penuh.
5. Bandingkan dengan hasil build jalur inti. Judul yang tetap sama tidak membuktikan cache masih aktif: sumber dapat mengirim nilai yang sama.
6. Setelah selesai, kembalikan `next: { revalidate: 60 }` dan `generateStaticParams`, lalu build ulang sebelum melanjutkan modul.

`no-store` melewati Data Cache Next.js untuk fetch ini; ini tidak mengendalikan cache milik layanan API. Jangan menggabungkannya dengan `revalidate: 60`. Gunakan mode production karena cache HMR pada development dapat memakai ulang respons fetch.

Untuk mengamati perubahan isi saat ISR, gunakan layanan uji yang Antum kendalikan dan log request pada layanan tersebut. Fixture statis hanya membantu latihan UI dan kontrak respons.

Rujukan: [opsi fetch](https://nextjs.org/docs/app/api-reference/functions/fetch) dan [model cache tanpa Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components).

### Pengayaan: Perbarui Cache Setelah Data Berubah

Ketika aplikasi nanti bisa mengubah data, invalidasi dapat dipicu oleh tindakan server yang berhasil.

| API                             | Cakupan dan perilaku                                                             |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `revalidatePath(path)`          | Menandai cache pada path terkait untuk diperbarui                                |
| `revalidateTag("books", "max")` | Data bertag menjadi stale; akses berikut memicu pembaruan di belakang            |
| `updateTag("books")`            | Mengakhiri cache tag; pembacaan berikut menunggu data baru, khusus Server Action |

Tag harus lebih dahulu diberikan pada data, misalnya di `getBook`:

```ts
const res = await fetch(url, {
  next: { revalidate: 60, tags: ["books"] },
});
```

### Pengayaan: Kenali Model Cache Components

Dokumentasi terkini juga memakai model berikut. Pelajari sebagai jalur lanjutan setelah praktik utama dipahami.

#### Konfigurasi Model Baru

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
```

Konfigurasi ini berbeda dari jalur latihan yang sedang dipakai.

#### Cara Menyatakan Kebutuhan

- `"use cache"` menyimpan hasil fungsi atau komponen.
- `cacheLife` mengatur masa pakai cache.
- `cacheTag` memberi label untuk invalidasi.
- Data yang menunggu request ditempatkan di bawah `Suspense`.

Mengaktifkannya perlu meninjau akses data, params, layout, dan batas Suspense. Ikuti panduan migrasi sebelum mengubah proyek latihan.

### PPR dan Prefetch Menjawab Kebutuhan Berbeda

Pada jalur Cache Components, keduanya dapat bekerja bersama.

#### Partial Prerendering

- Menyiapkan bagian halaman yang dapat dirender lebih awal.
- Kerangka halaman dapat memuat fallback.
- Bagian yang membutuhkan request menyusul melalui streaming.

#### Partial Prefetching

- Menyiapkan bagian route yang dapat dipakai kembali sebelum navigasi.
- Konten yang bergantung URL dapat menyusul saat berpindah.
- Pengaturan prefetch memengaruhi apa yang diminta sebelum klik.

Uji dua jalur: membuka atau me-reload URL, lalu berpindah lewat Link. Hasil prefetch dan tampilan awal dapat berbeda.

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **8 Oktober 2026**. Rujukan tambahan tercantum dalam catatan slide.

#### Data dan Status Halaman

- [Next.js: mengambil data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js: fetch dan opsi cache](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [Next.js: loading.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Next.js: error.tsx dan retry](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)
- [Open Library: API dan batas pemakaian](https://openlibrary.org/developers/api)

#### Rendering, Cache, dan Streaming

- [Cache tanpa Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [ISR dan verifikasi production](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [React: Suspense](https://react.dev/reference/react/Suspense)
- [Model Cache Components](https://nextjs.org/docs/app/getting-started/caching)
- [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching)
