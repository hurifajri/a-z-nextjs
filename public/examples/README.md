# Bahan latihan Toko Belajar

Mulai dari satu proyek pada Modul 01 dan lanjutkan sampai Modul 16. Kelas ini untuk pemula Next.js dengan bekal JavaScript, React, serta TypeScript dasar.

## Kesepakatan penamaan

File dan folder buatan sendiri memakai kebab-case, termasuk `book-notice.tsx`, `use-book-search.ts`, dan `book-suggestion-schema.ts`. Nama ekspor mengikuti perannya: komponen/type/class PascalCase (`BookNotice`), fungsi/variabel camelCase (`getBook`, `totalItems`), hook berawalan `use` (`useBookSearch`), dan konstanta konfigurasi tetap UPPER_SNAKE_CASE (`MAX_TITLE_LENGTH`). Boolean sebaiknya jelas, misalnya `isPending` atau `hasSession`.

Nama khusus seperti `page.tsx`, `layout.tsx`, `next.config.ts`, `README.md`, dan file migrasi hasil generator mengikuti konvensi framework/tool. Samakan kapitalisasi path import dengan file. Kebab-case untuk file adalah pilihan kelas; proyek lain dapat mempunyai kesepakatan berbeda. Lihat Modul 02 untuk contohnya.

## Jalur inti

| Modul | Fokus dan hasil                                                 |
| ----- | --------------------------------------------------------------- |
| 01    | Setup, halaman pertama, kebiasaan menjalankan dan membaca error |
| 02    | Page, layout, dan struktur URL                                  |
| 03    | Server/Client Components dan props                              |
| 04    | Link, menu aktif, dan route detail dinamis                      |
| 05    | State lokal, nilai turunan, event, dan cleanup Effect           |
| 06    | Satu Context untuk total keranjang                              |
| 07    | Detail buku dari server, status halaman, dan cache dasar        |
| 08    | Pencarian melalui URL dan TanStack Query                        |
| 09    | Form usulan, validasi, dan pengiriman                           |
| 10    | Route Handlers, kontrak HTTP, dan Swagger ringkas               |
| 11    | SQLite, Drizzle, migrasi, dan CRUD bertahap                     |
| 12    | UI responsif, komponen, dan aksesibilitas                       |
| 13    | Metadata, gambar, dan font katalog                              |
| 14    | Akun, sesi, dan izin berdasarkan pemilik                        |
| 15    | 12 test Vitest dan 2 test Playwright                            |
| 16    | Rilis aplikasi latihan, persistensi, pemulihan, dan monitoring  |

## Checkpoint lengkap

| Unduhan                                | Mulai lagi dari hasil            |
| -------------------------------------- | -------------------------------- |
| [Modul 06](./checkpoints/modul-06.zip) | Context dan keranjang            |
| [Modul 08](./checkpoints/modul-08.zip) | Pencarian dan detail buku        |
| [Modul 11](./checkpoints/modul-11.zip) | CRUD tersimpan, lokal tanpa akun |
| [Modul 14](./checkpoints/modul-14.zip) | UI, metadata, dan CRUD berakun   |

Setiap ZIP berisi source, README, dan lockfile. Ekstrak ke folder baru, baca README, lalu jalankan `npm ci`. Database, secret, dan dependensi terpasang tidak ikut dibagikan. Checkpoint adalah alat pembanding/pemulihan; simpan pekerjaan sendiri sebelum menggunakannya.

## Bahan per tahap

- [Fixture API untuk Modul 07–08](./fixtures/README.md).
- [OpenAPI preview dan pembaca Swagger UI](./contracts/README.md).
- [Aset dan file lengkap Modul 13](./modul-13/README.md).
- [Pengujian Playwright Modul 15](./modul-15/README.md).
- [Migrasi dan rilis Modul 16](./modul-16/README.md).

## Pengayaan

Mulai dari [panduan menjalankan lab pengayaan](./pengayaan/README.md) untuk memilih checkpoint, menyiapkan salinan aplikasi, dan mengetahui URL hasilnya. Folder pengayaan berisi panduan/berkas tambahan; jalankan npm dari folder aplikasi Next.js, bukan dari folder panduan.

- [Zustand setelah Context](./pengayaan/zustand.md).
- [Invalidasi dan model cache lanjutan](./pengayaan/cache-lanjutan.md).
- [Server Action setelah CRUD](./pengayaan/server-action/README.md).
- [Workshop OpenAPI/Swagger setelah Modul 11](./pengayaan/swagger.md).

Pengayaan boleh dilewati dan tidak menjadi prasyarat jalur inti. Kerjakan perubahan alternatif pada salinan checkpoint. Keranjang hanya simulasi jumlah; usulan tidak mengubah katalog Open Library. Hasil akhir adalah aplikasi latihan yang dapat dirilis, dengan batas penggunaan akun yang dijelaskan pada Modul 14.
