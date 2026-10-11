# Fixture buku untuk Modul 07–08

Fixture adalah data contoh tetap; mode ini dipilih secara eksplisit. Jalur normal tetap memakai Open Library. Fixture tidak membuktikan cache API atau keberhasilan request ke server luar.

## Detail server (Modul 07)

1. Simpan [books.json](./books.json) sebagai `src/lib/book-fixtures.json`.
2. Ganti `src/lib/books.ts` dengan [helper lengkap](./books.ts). Perbedaannya adalah cabang fixture sebelum fetch asli.
3. Tambahkan `BOOKS_SOURCE=fixture` pada `.env.local`, lalu restart `npm run dev`.
4. Coba `/products/OL20915214W`, `/products/OL19542899W`, dan ID yang tidak ada. Dua pertama berhasil, lainnya 404.
5. Hapus variabel dan restart untuk kembali ke API asli. Error API tidak diubah menjadi fixture secara otomatis.

## Pencarian browser (Modul 08)

1. Simpan [search.json](./search.json) sebagai `public/fixtures/search.json`.
2. Simpan [book-search-fixture.ts](./book-search-fixture.ts) sebagai `src/lib/book-search-fixture.ts`.
3. Di `src/lib/book-search.ts`, tambahkan import dan ganti baris fetch:

```ts
import { searchFixture } from "./book-search-fixture";
// Di dalam searchBooks; params, url, dan pemeriksaan respons tetap ada.
const res =
  process.env.NEXT_PUBLIC_USE_BOOK_FIXTURES === "true"
    ? await searchFixture(keyword, signal)
    : await fetch(url, { signal });
```

4. Set `NEXT_PUBLIC_USE_BOOK_FIXTURES=true` pada `.env.local`, restart dev, lalu cari `react` atau `learning`. Data contoh hanya memuat dua buku; kata lain dapat menghasilkan daftar kosong.
5. Setelah hasil tampil, jalankan di Console **aplikasi Next.js**, lalu klik **Muat ulang** tanpa reload browser:

```js
sessionStorage.setItem("book-search-scenario", "error");
```

Pilihan: `success`, `empty`, `error` (Response 500 simulasi), `invalid` (docs bukan array), `slow` (tunda 1,5 detik). Mulai dengan success sebelum error/slow untuk menguji hasil lama tetap terlihat saat background request.

6. Kembalikan skenario ke success. Hapus flag environment dan restart untuk kembali ke API asli. Untuk build production, perubahan `NEXT_PUBLIC_` memerlukan build ulang.

```js
sessionStorage.removeItem("book-search-scenario");
```

Helper meneruskan AbortSignal. Skenario bukan request HTTP 500 nyata; pengujian server asli ada di Modul 15. Jangan menyimpan secret pada variabel NEXT_PUBLIC_. Checkpoint 08/11/14 sudah memuat helper, tetapi flag fixture mati kecuali diaktifkan.
