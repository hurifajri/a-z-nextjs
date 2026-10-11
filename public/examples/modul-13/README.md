# Modul 13 — Metadata, gambar, dan font

Lanjutkan proyek setelah Modul 12. Buat perubahan kecil sesuai slide; file lengkap berikut menjadi pembanding, bukan alasan menimpa penyesuaian Antum.

| Unduhan                                               | Tujuan pada aplikasi                                    |
| ----------------------------------------------------- | ------------------------------------------------------- |
| [book-placeholder.png](./assets/book-placeholder.png) | `public/images/book-placeholder.png`                    |
| [Geist.ttf](./assets/Geist.ttf)                       | `src/app/fonts/Geist.ttf`                               |
| [OFL.txt](./assets/OFL.txt)                           | `src/app/fonts/OFL.txt`                                 |
| [layout.tsx](./files/layout.tsx)                      | `src/app/layout.tsx`                                    |
| [globals.css](./files/globals.css)                    | `src/app/globals.css` (merge dengan token shadcn Antum) |
| [products-page.tsx](./files/products-page.tsx)        | `src/app/products/page.tsx`                             |
| [product-page.tsx](./files/product-page.tsx)          | `src/app/products/[id]/page.tsx`                        |
| [BookDetails.tsx](./files/BookDetails.tsx)            | `src/app/products/[id]/BookDetails.tsx`                 |

Metadata di root menambahkan identitas toko. Page katalog memakai title tetap; detail memakai generateMetadata dengan getBook dari Modul 07. Pertahankan CartProvider, QueryProvider, Navbar, footer, Suspense, dan generateStaticParams.

Jika initializer shadcn menambahkan font Google, hapus import/definisi yang diganti. Font lokal memakai variabel `--font-geist-sans` pada body; token Tailwind `--font-sans` menunjuk variabel itu. Jangan meninggalkan dua sumber font yang saling menimpa.

## Periksa hasil

1. Buka katalog dan dua detail. Tab dan deskripsi sesuai halaman.
2. Kecilkan viewport dan throttle jaringan: gambar proporsional dan ruangnya sudah tersedia.
3. Periksa Network untuk `/_next/image` dan font lokal.
4. Jalankan build/start; pastikan katalog, pencarian, cart, dan usulan masih berjalan.

## Asal aset

Ilustrasi buku dibuat sebagai SVG sederhana untuk materi kelas, kemudian diraster menjadi PNG 480 × 640; bebas digunakan ulang untuk latihan (CC0). Bukan sampul asli buku. [Source SVG](./assets/book-placeholder.svg).

Font [Geist dari repositori Google Fonts](https://github.com/google/fonts/tree/main/ofl/geist) memakai SIL Open Font License 1.1; salin lisensi bersama font. Font lokal membuat build tidak perlu meminta aset ke layanan font; API data buku tetap memerlukan koneksi kecuali fixture diaktifkan.

[Dokumentasi Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images). Kontrak API pindah ke Modul 10 dan [lab Swagger](../pengayaan/swagger.md).
