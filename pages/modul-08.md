---
layout: intro
badge: "MODUL 08"
badgeColor: "pink"
level: 1
---

## 08. Pencarian URL & API di Browser

Pencarian buku dengan `fetch` dan TanStack Query: dari kata kunci di URL sampai hasil, status request, dan cache.

<!--
Bekal: path dan query dari Modul 04, Client Components dari Modul 03, props dan custom hook dari Modul 05–06, serta detail buku dari Modul 07.
Target: peserta dapat memasang provider, mengambil data API publik, menyusun queryKey, dan menampilkan status awal maupun pembaruan data.
Latihan memakai TanStack Query v5 dengan useQuery biasa. Tidak memakai SSR prefetch, hydration cache, atau useSuspenseQuery.
Konfigurasi proyek mengikuti jalur utama Modul 07: cacheComponents: false dan partialPrefetching: false.
Audit sumber daring dan endpoint pencarian: 8 Oktober 2026.
-->

---
class: module-content
layout: two-cols
---

### Lanjutkan Pencarian di Toko Belajar

Modul 04 mengenalkan path dan query. Sekarang buat form yang menyimpan kata pencarian di URL, lalu ambil hasilnya.

::left::

#### Alur yang Akan Berjalan

<v-clicks>

1. Ketik `react`, lalu kirim form.
2. URL menjadi `/products?q=react`.
3. Browser meminta hasil pencarian.
4. Klik judul untuk membuka detail buku.

</v-clicks>

::right::

#### Sambungan Antarbagian

| Bagian                      | Peran                                |
| :-------------------------- | :----------------------------------- |
| `SearchForm` · Modul 08     | Mengirim kata kunci ke URL           |
| TanStack Query · Modul 08   | Menyimpan hasil dan status pencarian |
| `/products/[id]` · Modul 07 | Mengambil detail buku di server      |
| `CartProvider` · Modul 06   | Menyimpan total keranjang            |

::bottom::

<BrutalCard v-click class="text-sm">
  Hasil akhir: pencarian minimal dua karakter, maksimal lima hasil, dan tombol <strong>Muat ulang</strong>.
</BrutalCard>

<!--
Gunakan proyek Next.js latihan, bukan repository slide ini. Struktur src/app dan alias @/* mengikuti Modul 01.
Harga contoh dan total keranjang tetap data latihan; Open Library memberi metadata buku.
Form dikirim dengan tombol/Enter, bukan request pada setiap ketikan.
-->

---
class: module-content
layout: two-cols
---

### Baca Kata Pencarian dari URL

Buat `src/app/products/QueryLabel.tsx`; komponen ini menampilkan isi parameter `q`.

::left::

```tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function QueryLabel() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  return <p>Pencarian: {keyword || "semua buku"}</p>;
}
```

::right::

#### Hasil yang Diharapkan

<v-clicks>

- **/products?q=react** → Pencarian: react
- **/products?q=next** → Pencarian: next
- **/products** atau **?q=** → Pencarian: semua buku

</v-clicks>

`get("q")` membaca nilai; hasil hook ini tidak dapat diubah langsung.

::bottom::

<BrutalCard v-click class="text-sm">
  Kita pasang komponen ini setelah membuat form, dengan pembungkus <strong>Suspense</strong> untuk menyediakan tampilan sementara saat nilai URL belum siap.
</BrutalCard>

<!--
File QueryLabel.tsx bukan rute, sesuai materi colocation Modul 02. Komponen belum dipakai sampai langkah Gabungkan.
get mengembalikan null jika parameter tidak ada; ?? memberi nilai pengganti. String kosong juga ditampilkan sebagai semua buku melalui || pada JSX.
Pada query berulang, get membaca nilai pertama. Validasi dan parameter berulang dapat dibahas saat peserta sudah memahami satu nilai.
Label mengikuti URL saat navigasi, reload, serta Back/Forward. Ini belum menyaring daftar buku.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params
-->

---
class: module-content
---

### Navigasi Setelah Form Dikirim

Buat `src/components/SearchForm.tsx`. `useRouter` membantu membuka URL yang disusun dari isian form.

```tsx {1-3|5-7|8-12|14-20|all}
"use client";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function SearchForm() {
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    query.set("q", String(data.get("q") ?? "").trim());
    router.push(`/products?${query.toString()}`);
  }
  return (
    <form onSubmit={search}>
      <label htmlFor="book-query">Cari buku</label>
      <input id="book-query" name="q" className="border mx-2" />
      <button type="submit">Cari</button>
    </form>
  );
}
```

<!--
Jelaskan alur: submit → cegah navigasi form bawaan → baca isian bernama q → susun query → router.push.
FormEvent adalah tipe event TypeScript; FormData membaca isian form. URLSearchParams mengodekan spasi dan karakter khusus, misalnya & tidak menjadi parameter tambahan.
Tujuan selalu /products; isian pengguna hanya menjadi nilai q. Jangan memberikan URL tujuan mentah dari isian langsung ke router.push/replace.
Form ini hanya mempunyai q. Jika nanti menambahkan filter lain, pertahankan parameter yang masih relevan ketika menyusun query baru.
Untuk tautan dengan tujuan tetap, gunakan Link. Form GET atau next/form juga bisa melayani pencarian; contoh ini khusus mempraktikkan navigasi lewat event handler.
Field input belum disinkronkan kembali dari URL ketika Back/Forward; label hasil pada langkah berikutnya menjadi acuan nilai URL. Label hasil menunjukkan kata pencarian aktif; draf input terpisah dari URL.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
Sumber pengodean query: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
-->

---
class: module-content
---

### Gabungkan Form dan Label pada Katalog

Perbarui `src/app/products/page.tsx`. Label mengikuti URL; daftar buku belum disaring.

```tsx
import Link from "next/link";
import { Suspense } from "react";
import SearchForm from "@/components/SearchForm";
import QueryLabel from "./QueryLabel";

export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Katalog Buku</h1>
      <SearchForm />
      <Suspense fallback={<p>Membaca URL...</p>}>
        <QueryLabel />
      </Suspense>
      <div className="flex flex-col gap-2">
        <Link href="/products/OL20915214W">Learning React</Link>
        <Link href="/products/OL19542899W">React: panduan praktik</Link>
        <Link href="/products/promo">Lihat promo</Link>
      </div>
    </main>
  );
}
```

<!--
Praktik 5–8 menit: ketik react, kirim, lalu cocokkan ?q=react dengan label Pencarian: react. Daftar tetap menampilkan dua buku; fokus modul ini adalah URL, bukan algoritma pencarian data.
Suspense membungkus QueryLabel karena di situlah useSearchParams dipanggil. fallback adalah tampilan sementara; bisa sangat singkat sehingga tidak terlihat saat mencoba.
Pada halaman yang diprerender, penggunaan useSearchParams tanpa Suspense dapat gagal pada build production meskipun terlihat berjalan saat dev. Jalankan npm run build sebagai pemeriksaan akhir latihan.
Tidak menambahkan use client ke page atau root layout. Dasar menggabungkan komponen seperti ini dibahas lebih jauh pada Modul 03.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params#prerendering
Sumber Suspense: https://react.dev/reference/react/Suspense
-->

---
class: module-content
---

### Pilih Perilaku Riwayat Browser

URL menyimpan nilai yang bisa dibuka kembali; push dan replace menentukan catatan riwayatnya.

| Cara berpindah              | Dampak pada riwayat      | Kapan dipakai                                      |
| :-------------------------- | :----------------------- | :------------------------------------------------- |
| `Link` / `router.push(url)` | Menambah entri           | Pengunjung membuka halaman atau mengirim pencarian |
| `router.replace(url)`       | Mengganti entri saat ini | Memperbarui URL tanpa menambah langkah Back        |
| `router.back()`             | Mundur satu entri        | Kembali melalui riwayat yang sudah ada             |

<v-clicks>

1. Cari **react**, lalu **next**. Dengan push, tombol **Back** mengembalikan URL dan label ke react.
2. Muat ulang atau buka URL di tab baru. Label membaca kata pencarian yang sama.
3. Untuk mencoba replace, ganti `router.push` pada form; bandingkan hasil tombol Back.

</v-clicks>

<!--
Untuk perbandingan yang jelas, mulai tiap percobaan dari /products lalu kirim react dan next. Dengan replace, dua nilai itu menggantikan entri sekarang; Back menuju entri sebelum /products, jika ada.
replace tidak menghapus seluruh riwayat. back juga tidak selalu menuju katalog; jika halaman dibuka langsung dari situs lain, riwayatnya berbeda. Gunakan Link ke /products jika tujuannya harus katalog.
Link juga menerima prop replace; baris pertama tabel memakai perilaku default.
router.refresh berbeda dari reload dokumen dan tidak otomatis membatalkan cache server. Detail cache sengaja ditunda, bukan dijadikan langkah pencarian.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
Sumber: https://nextjs.org/docs/app/api-reference/components/link#replace
-->

---
class: module-content
layout: two-cols
---

### HTTP Client dan Pengelola Query

Keduanya bekerja bersama saat browser mengambil data.

::left::

#### HTTP Client Mengirim Request

`fetch` mengirim request, lalu kode Antum memeriksa status HTTP dan membaca JSON.

Latihan melanjutkan **fetch** dari Modul 07. Axios dan Ky merupakan alternatif; keduanya tidak perlu dipasang.

::right::

#### TanStack Query Mengelola Hasil

<v-clicks>

- Menjalankan fungsi pengambil data.
- Menyimpan hasil berdasarkan `queryKey`.
- Memberikan status untuk tampilan.
- Mengatur pemakaian ulang dan pembaruan data.

</v-clicks>

`useEffect + fetch` tetap bisa dipakai. Untuk kebutuhan di atas, kita perlu mengelola status dan siklus request jika menulisnya sendiri.

<!--
HTTP client bukan cache data React. TanStack Query dapat memakai fetch, Axios, atau client lain di queryFn.
fetch di browser mengikuti Fetch API dan HTTP cache browser. Opsi next.revalidate hanya berlaku pada fetch di server Next.js.
Interceptor adalah fungsi yang memproses request/respons, misalnya untuk konfigurasi header bersama. Tidak perlu menginstal Axios atau Ky untuk latihan ini.
Jika menggabungkan retry HTTP client dan retry TanStack Query, tinjau keduanya agar jumlah percobaan tidak berlipat.
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
Sumber: https://axios.rest/pages/getting-started/features
Sumber: https://github.com/sindresorhus/ky
Sumber: https://tanstack.com/query/latest/docs/framework/react/overview
-->

---
class: module-content
layout: two-cols
---

### Kenali API yang Akan Dibaca

Open Library menyediakan pencarian metadata buku tanpa API key untuk latihan ini.

::left::

#### Request Pencarian

```text
GET https://openlibrary.org/search.json

q=react
fields=key,title
limit=5
```

- `q`: kata kunci yang dikirim.
- `fields`: field yang dibutuhkan.
- `limit`: jumlah hasil maksimal.

::right::

#### Bentuk Respons yang Dipakai

```json
{
  "docs": [
    {
      "key": "/works/OL20915214W",
      "title": "Learning React"
    }
  ]
}
```

Kita ubah `key` menjadi `id` untuk tautan `/products/OL20915214W`.

::bottom::

<BrutalCard v-click class="text-sm">
  Request dari browser memerlukan izin <strong>CORS</strong> dari API. Endpoint ini mengizinkannya saat diperiksa; API lain bisa memiliki aturan berbeda.
</BrutalCard>

<!--
JSON disederhanakan ke satu hasil. Urutan dan isi hasil layanan publik dapat berubah. Search API mengembalikan works secara default.
Dokumentasi menampilkan contoh key berbentuk /works/OL...W maupun OL...W; helper mendukung keduanya.
Batasi pemakaian: API publik memiliki batas request. Latihan memakai submit, limit 5, staleTime, dan tanpa polling.
Jangan mencoba mengatasi CORS dengan mode: "no-cors": respons opaque tidak bisa dibaca sebagai JSON.
Sumber: https://openlibrary.org/dev/docs/api/search
Sumber: https://openlibrary.org/developers/api
Sumber CORS: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#making_cross-origin_requests
-->

---
class: module-content
---

### Siapkan Tempat Menyimpan Cache Query

Jalankan perintah di proyek latihan, lalu buat `src/components/QueryProvider.tsx`.

```bash
npm install @tanstack/react-query@5
```

```tsx {all|7-8|9|all}
"use client";
import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = { children: ReactNode };

export default function QueryProvider({ children }: Props) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

`QueryClient` menyimpan cache. `QueryClientProvider` membuatnya tersedia bagi komponen di bawahnya.

<!--
useState menjaga instance QueryClient selama provider tetap terpasang. Jangan new QueryClient() ulang pada setiap render atau membuat singleton yang dibagi lintas request server.
Setup ini untuk useQuery biasa tanpa SSR prefetch. Jika nanti memakai useSuspenseQuery/hydration, ikuti panduan Advanced Server Rendering.
Sumber: https://tanstack.com/query/latest/docs/framework/react/quick-start
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
-->

---
class: module-content
layout: two-cols
---

### Pasang di Root Layout yang Sudah Ada

Perbarui `src/app/layout.tsx` dari Modul 06; letakkan provider query di sekitar isi halaman.

::left::

#### Tambahkan Import

```tsx
import QueryProvider from "@/components/QueryProvider";
```

#### Ganti Bagian `{children}`

```tsx
<QueryProvider>{children}</QueryProvider>
```

Ini **potongan layout**, bukan isi file lengkap.

::right::

#### Posisi Setelah Perubahan

```text
RootLayout · Server
└── body
    ├── CartProvider
    │   ├── header + Navbar
    │   └── QueryProvider
    │       └── children
    └── footer
```

Navbar tetap mendapat state keranjang. Halaman pencarian mendapat akses ke cache query.

::bottom::

<BrutalCard v-click class="text-sm">
  Root layout tetap Server Component. Menyalurkan <strong>children</strong> melalui provider mengikuti pola Modul 03 dan 06.
</BrutalCard>

<!--
Pertahankan import CartProvider, Navbar, metadata, font, global CSS, html/body, header, dan footer yang sudah ada.
Jangan memindahkan QueryProvider ke tiap hasil pencarian; instance yang berganti akan kehilangan cache yang disimpannya.
CartProvider tetap menaungi halaman, sehingga AddToCart dan CartSummary masih dapat memakai context.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components#context-providers
-->

---
class: module-content
---

### Periksa Satu Hasil sebelum Memakainya

Buat `src/lib/book-search.ts`. Fungsi ini memeriksa field yang diperlukan oleh UI.

```ts {all|1|4-13|14-16|all}
export type BookHit = { id: string; title: string };

function parseBook(item: unknown): BookHit {
  if (
    typeof item !== "object" ||
    item === null ||
    !("key" in item) ||
    !("title" in item) ||
    typeof item.key !== "string" ||
    typeof item.title !== "string"
  ) {
    throw new Error("Data buku tidak valid");
  }
  const id = item.key.replace(/^\/works\//, "");
  if (!/^OL\d+W$/.test(id)) throw new Error("ID buku tidak valid");
  return { id, title: item.title };
}
```

`unknown` berarti bentuk data belum diketahui. Pemeriksaan `typeof` dan `in` memastikan field ada sebelum dipakai.

<!--
Ini pemeriksaan minimal, bukan schema lengkap Open Library. Pola ID menerima OL diikuti angka dan W: /works/OL20915214W menjadi OL20915214W.
TypeScript bekerja saat pengembangan; menulis as BookHit[] saja tidak memeriksa JSON dari jaringan.
Tidak mengimpor getBook dari Modul 07: helper tersebut memakai notFound dari Next.js untuk halaman server.
Validasi dengan schema Valibot dijelaskan bertahap di Modul 09.
Sumber bentuk data: https://openlibrary.org/dev/docs/api/search
Sumber narrowing: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
-->

---
class: module-content
---

### Ambil JSON dan Periksa Status HTTP

Tambahkan fungsi berikut di bawah `parseBook` pada `src/lib/book-search.ts`.

```ts {all|5-11|12|13-17|all}
export async function searchBooks(
  keyword: string,
  signal?: AbortSignal,
): Promise<BookHit[]> {
  const params = new URLSearchParams({
    q: keyword,
    fields: "key,title",
    limit: "5",
  });
  const url = `https://openlibrary.org/search.json?${params}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Pencarian: HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.docs)) {
    throw new Error("Daftar buku tidak valid");
  }
  return data.docs.map(parseBook);
}
```

`fetch` tidak otomatis gagal pada HTTP 404/500. Lempar error agar TanStack Query bisa menampilkan kegagalan.

<!--
URLSearchParams menangani encoding kata kunci seperti react & typescript.
Promise<BookHit[]> berarti hasil asinkron berupa daftar buku. Array kosong adalah respons valid; struktur yang salah menjadi error.
res.json() juga dapat gagal jika respons bukan JSON. Jangan catch lalu return [] untuk semua kegagalan: itu menyamarkan error sebagai hasil kosong.
signal diteruskan dari queryFn agar request dapat dibatalkan. Dibahas setelah alur utama berjalan.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
Sumber: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
-->

---
class: module-content
---

### Hubungkan Fungsi Data ke `useQuery`

Buat `src/hooks/use-book-search.ts`. Custom hook menyatukan aturan pencarian.

```tsx {all|7-8|9|10-12|all}
"use client";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "@/lib/book-search";

export function useBookSearch(keyword: string) {
  return useQuery({
    queryKey: ["books", keyword],
    queryFn: ({ signal }) => searchBooks(keyword, signal),
    enabled: keyword.length >= 2,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
```

- `queryKey` memberi identitas data; `queryFn` menjelaskan cara mengambilnya.
- `enabled` memulai pencarian setelah kata kunci cukup panjang.
- Tiga opsi terakhir adalah **pengaturan latihan**, bukan seluruh nilai bawaan.

<!--
keyword sudah di-trim oleh BookSearch yang dibuat setelah ini.
staleTime memakai milidetik. retry false dan refetchOnWindowFocus false membuat request latihan lebih mudah diamati serta mengurangi akses ke API publik.
refetchOnMount dan refetchOnReconnect tetap memakai nilai bawaan; dapat memicu pembaruan untuk data stale.
TanStack Query v5 memakai satu objek opsi seperti contoh. Hindari menyalin useQuery(key, fn) dari tutorial versi lama.
Sumber: https://tanstack.com/query/latest/docs/framework/react/quick-start
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
-->

---
class: module-content
---

### Kata Kunci Berbeda, Cache Berbeda

Bayangkan `queryKey` sebagai label pada tempat penyimpanan hasil.

````md magic-move
```ts
// Gambaran dua pencarian yang memakai label sama:
const keyword = "react";
const queryKey = ["books"];
// Hasil pencarian lain dapat memakai tempat yang sama.
```

```ts
// Perbaikan pada opsi query:
const keyword = "react";
const queryKey = ["books", keyword];
// Hasil disimpan sebagai ["books", "react"].
```

```ts
// Saat URL berubah menjadi ?q=typescript:
const keyword = "typescript";
const queryKey = ["books", keyword];
// Hasil disimpan sebagai ["books", "typescript"].
```
````

<BrutalCard v-click class="mt-4 text-sm">
  Masukkan setiap parameter yang mengubah hasil ke <strong>queryKey</strong>. Jika kelak menambah halaman hasil, sertakan nomor halamannya juga.
</BrutalCard>

<!--
Ini ilustrasi nilai, bukan file tambahan. Hook sebelumnya sudah memakai key yang benar.
Perubahan keyword mengubah key yang diamati useQuery. Jika data untuk key baru masih fresh, cache dapat dipakai; jika belum tersedia, query mengambilnya.
Memanggil refetch("typescript") bukan cara mengganti parameter. Ubah keyword melalui URL, lalu biarkan key mengikutinya.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
-->

---
class: module-content
---

### Tentukan Tampilan untuk Setiap Keadaan

Baca status sebelum menyusun komponen. Klik untuk melihat tiga tahap.

<v-switch>
<template #1>

#### 1. Belum Ada Hasil yang Bisa Ditampilkan

| Kondisi                             | Tampilan                          |
| :---------------------------------- | :-------------------------------- |
| Kata kunci kurang dari dua karakter | Petunjuk untuk mengisi pencarian  |
| Kata kunci valid, `isPending`       | Pesan menunggu data               |
| Gagal dan belum memiliki data       | Pesan gagal dan tombol muat ulang |

`enabled: false` tanpa cache dapat menghasilkan `isPending: true` meskipun request belum berjalan. Periksa kata kunci terlebih dahulu.

</template>
<template #2>

#### 2. Request Berhasil

| Data                  | Tampilan                    |
| :-------------------- | :-------------------------- |
| `[]`                  | “Belum ada buku yang cocok” |
| Satu hasil atau lebih | Tautan judul buku           |

Array kosong adalah hasil yang sah. Respons HTTP gagal atau JSON yang salah bentuk harus menjadi error.

</template>
<template #3>

#### 3. Data Sudah Ada, Lalu Dimuat Ulang

| Kondisi                            | Tampilan                                         |
| :--------------------------------- | :----------------------------------------------- |
| `isFetching` dengan data tersimpan | Hasil tetap tampil; tombol menunjukkan pembaruan |
| Pembaruan gagal                    | Pesan gagal muncul bersama hasil yang tersimpan  |

`isPending` menggambarkan status data awal. `isFetching` berarti fungsi query sedang berjalan, termasuk saat memperbarui hasil.

</template>
</v-switch>

<!--
Pada v5, isLoading = isPending && isFetching. Query yang offline dapat paused, sehingga isPending tidak selalu berarti jaringan sedang bekerja.
Data lama yang dimaksud berasal dari key yang sama. Contoh ini tidak memakai placeholderData untuk membawa hasil keyword lain.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
Sumber: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
-->

---
class: module-content
---

### Tampilkan Tautan Buku atau Hasil Kosong

Buat `src/app/products/BookHits.tsx`. Data yang diterima sudah diperiksa oleh helper.

```tsx
import Link from "next/link";
import type { BookHit } from "@/lib/book-search";

export default function BookHits({ books }: { books: BookHit[] }) {
  if (books.length === 0) return <p>Belum ada buku yang cocok.</p>;
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <Link href={`/products/${book.id}`}>{book.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

Tautan memakai ID dari API. Halaman detail di Modul 07 sudah dapat membaca ID buku tersebut.

<!--
BookHits diimpor oleh komponen dalam graph klien, sehingga tidak wajib mengulang use client pada setiap file turunan.
Import type tidak membawa helper pengambil data ke runtime komponen.
Tidak membatasi hasil pada dua ID generateStaticParams: jalur latihan Modul 07 tetap mengizinkan ID lain diproses saat diakses.
Sumber: https://nextjs.org/docs/app/api-reference/components/link
-->

---
class: module-content
---

### Sediakan Muat Ulang dan Pesan Gagal

Buat `src/app/products/BookResults.tsx`. Data yang masih tersedia tetap dirender.

```tsx
import BookHits from "./BookHits";
import type { BookHit } from "@/lib/book-search";
type Props = {
  books?: BookHit[];
  fetching: boolean;
  failed: boolean;
  onRefresh: () => void;
};
export default function BookResults(props: Props) {
  return (
    <div>
      <button onClick={props.onRefresh} disabled={props.fetching}>
        {props.fetching ? "Memperbarui…" : "Muat ulang"}
      </button>
      {props.failed && (
        <p role="alert">Gagal mengambil data. Coba muat ulang.</p>
      )}
      {props.books && <BookHits books={props.books} />}
    </div>
  );
}
```

`books` boleh belum tersedia. Saat ada data, pesan error pembaruan tidak menggantikan daftar buku.

<!--
props.books berupa [] tetap truthy di JavaScript; BookHits kemudian menampilkan pesan kosong.
Tombol memanggil callback dari BookSearch, mengikuti pola fungsi lewat props pada Modul 05.
TanStack Query mempertahankan data terakhir yang berhasil untuk key yang sama. Background error dan data dapat tersedia bersamaan.
Default throwOnError adalah false pada useQuery biasa: kegagalan query ditangani melalui status di sini.
Sumber: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
-->

---
class: module-content
---

### Baca URL, Lalu Jalankan Query

Buat `src/app/products/BookSearch.tsx`. Hook tetap dipanggil sebelum percabangan.

```tsx {all|6-7|8-9|13-18|all}
"use client";
import { useSearchParams } from "next/navigation";
import { useBookSearch } from "@/hooks/use-book-search";
import BookResults from "./BookResults";
export default function BookSearch() {
  const keyword = (useSearchParams().get("q") ?? "").trim();
  const query = useBookSearch(keyword);
  if (keyword.length < 2) return <p>Isi minimal 2 karakter.</p>;
  if (query.isPending) return <p role="status">Menunggu data…</p>;
  return (
    <section>
      <p>Pencarian: {keyword}</p>
      <BookResults
        books={query.data}
        fetching={query.isFetching}
        failed={query.isError}
        onRefresh={() => void query.refetch()}
      />
    </section>
  );
}
```

<!--
useQuery dipanggil di dalam custom hook useBookSearch. Jangan memindahkan pemanggilan hook ke if atau handler submit.
void menandai bahwa callback tidak memakai Promise hasil refetch. Hasil request tetap ditangani melalui query.data dan status query.
refetch mengambil ulang keyword saat ini. Untuk keyword lain, kirim SearchForm agar URL berubah.
Jika offline, query awal dapat paused. Pesan menunggu tidak menjanjikan request sedang berjalan; isPaused dapat dipakai untuk pesan koneksi yang lebih spesifik sebagai latihan lanjutan.
Sumber: https://react.dev/reference/rules/rules-of-hooks
Sumber: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
-->

---
class: module-content
layout: two-cols
---

### Sambungkan dengan Halaman Katalog

Perbarui `src/app/products/page.tsx` yang sudah memiliki form dan tautan dari tahap awal modul ini.

::left::

#### Ganti Import Label

```tsx
import BookSearch from "./BookSearch";
```

Hapus import `QueryLabel` karena pencarian kini menampilkan kata kunci beserta hasilnya.

#### Ganti Isi Suspense

```tsx
<Suspense fallback={<p>Membaca URL…</p>}>
  <BookSearch />
</Suspense>
```

::right::

#### Susunan Isi Halaman

```text
Katalog Buku
├── SearchForm
├── Suspense
│   └── BookSearch
├── Dua tautan buku dari Modul 07
└── Tautan promo
```

Page tetap Server Component. `SearchForm` yang sudah ada mengirim parameter `q`.

::bottom::

<BrutalCard v-click class="text-sm">
  Suspense di sini memenuhi kebutuhan <strong>useSearchParams</strong>. Status request API dari <strong>useQuery</strong> tetap ditangani di BookSearch.
</BrutalCard>

<!--
Potongan ini diterapkan pada halaman yang ada, bukan mengganti seluruh file. Pertahankan import Link, Suspense, SearchForm dan dua ID Open Library dari Modul 07.
useSearchParams pada halaman yang diprerender memerlukan batas Suspense dalam build production. useQuery biasa tidak menangguhkan render seperti useSuspenseQuery.
Form pada awal modul ini menyimpan draf pada input. Back/Forward memulihkan URL dan hasil, tetapi nilai input tidak otomatis disinkronkan. Label Pencarian menunjukkan keyword aktif.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params#prerendering
-->

---
class: module-content
layout: two-cols
---

### Checkpoint: Satu Alur Pencarian Utuh

Jalankan proyek, buka `/products`, lalu amati tab Network pada DevTools.

::left::

#### Coba Langkah Berikut

1. Buka katalog tanpa `q`: muncul petunjuk.
2. Ketik `react`: URL belum berubah.
3. Kirim form: muncul `?q=react` dan hasil.
4. Kirim `typescript`: hasil mengikuti URL.
5. Klik judul: halaman detail buku terbuka.

::right::

#### Cocokkan Hasilnya

<v-clicks>

- Request menuju `search.json` membawa `q`.
- Hasil berisi maksimal lima tautan.
- Muat ulang meminta keyword yang sama.
- Keranjang masih bekerja dari detail buku.
- Kembali dengan `Link` dapat memakai cache yang masih tersimpan.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Beri jeda antarpercobaan pada API publik. Bandingkan <strong>URL aktif</strong>, parameter request, dan label pencarian.
</BrutalCard>

<!--
Jalankan npm run build pada proyek latihan untuk memeriksa integrasi useSearchParams dan Suspense, tidak hanya next dev.
Jangan mengharapkan hasil/judul/urutan yang selalu identik dari layanan eksternal.
Browser HTTP cache bisa ikut melayani request; bedakan queryFn dipanggil dari jumlah request yang mencapai server.
Jika perlu mengamati request lambat, gunakan throttling DevTools. Tidak perlu menambahkan useEffect untuk menyinkronkan data query ke useState.
-->

---
class: module-content
---

### `staleTime` dan `gcTime` Menjawab Dua Pertanyaan

Fresh berarti data masih dianggap cukup baru. Stale berarti data sudah layak diperbarui.

| Pengaturan  | Pertanyaan                                | Pada Latihan Ini        |
| :---------- | :---------------------------------------- | :---------------------- |
| `staleTime` | Berapa lama hasil dianggap fresh?         | `60_000` ms = 60 detik  |
| `gcTime`    | Berapa lama cache tanpa pemakai disimpan? | Bawaan browser: 5 menit |

<v-clicks>

1. Pencarian berhasil → hasil untuk key itu menjadi fresh.
2. Sebelum 60 detik → pemakai baru key yang sama dapat memakai cache.
3. Setelah 60 detik → hasil menjadi stale; pembaruan menunggu pemicu.
4. Tidak ada komponen memakai key → waktu `gcTime` mulai dihitung.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Melewati staleTime tidak langsung mengirim request. <strong>Muat ulang</strong> bisa meminta data meskipun cache masih fresh.
</BrutalCard>

<!--
Nilai waktu ini dalam milidetik, berbeda dari next: { revalidate: 60 } pada Modul 07 yang memakai detik.
Cache TanStack Query disimpan dalam QueryClient di memori. Tanpa persistence tambahan, reload penuh membuat cache klien baru.
Stale tidak berarti data pasti salah atau langsung dihapus. Pembaruan dapat terjadi ketika mount/reconnect sesuai konfigurasi.
gcTime dahulu bernama cacheTime pada versi lama; materi ini mengikuti v5.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
-->

---
class: module-content
---

### Pahami Pengaturan Latihan dan Nilai Bawaan

Jika request terasa lebih sering dari dugaan, periksa opsi query sebelum menambah state atau effect.

| Perilaku                       | Bawaan TanStack Query v5 di Browser | Latihan Kita     |
| :----------------------------- | :---------------------------------- | :--------------- |
| Hasil menjadi stale            | Langsung: `staleTime: 0`            | Setelah 60 detik |
| Gagal lalu mencoba otomatis    | Hingga 3 retry                      | `retry: false`   |
| Kembali fokus ke halaman       | Dapat refetch jika stale            | Dinonaktifkan    |
| Pemakai baru / koneksi kembali | Dapat refetch jika stale            | Tetap bawaan     |
| Polling berkala                | Tidak aktif                         | Tidak aktif      |

<BrutalCard v-click class="mt-4 text-sm">
  Query tidak menyediakan koneksi real-time otomatis. Polling memakai <strong>refetchInterval</strong>; SSE atau WebSocket membutuhkan rancangan tersendiri.
</BrutalCard>

<!--
Retry tiga kali berarti sampai empat percobaan termasuk request awal, dengan jeda. Jangan menerapkan retry tanpa pertimbangan pada error permanen atau API berbatas request.
refetchOnWindowFocus menanggapi halaman yang kembali terlihat sesuai implementasi browser, bukan jaminan setiap klik DevTools memicu fetch.
refetchInterval independen dari staleTime. Hindari menambah polling ke endpoint publik pada latihan ini.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching
-->

---
class: module-content
layout: two-cols
---

### Teruskan Sinyal Pembatalan Request

Saat query tidak lagi dipakai, TanStack Query dapat memberi tahu fungsi pengambil data untuk berhenti.

::left::

#### Dari Query ke Helper

```ts
// Potongan di dalam useBookSearch:
useQuery({
  queryKey: ["books", keyword],
  queryFn: ({ signal }) => searchBooks(keyword, signal),
  // Opsi lain tetap seperti sebelumnya.
});
```

#### Dari Helper ke Fetch

```ts
// Di dalam searchBooks:
const res = await fetch(url, { signal });
```

Kode ini sudah ada pada latihan.

::right::

#### Mengapa Diperlukan?

<v-clicks>

- Pengguna bisa mengganti kata kunci saat request masih berjalan.
- `queryKey` memisahkan hasil tiap kata kunci.
- `signal` memungkinkan `fetch` menghentikan request yang dibatalkan.
- Keduanya menangani kebutuhan yang berbeda.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Tanpa meneruskan signal, request yang tidak lagi dipakai dapat tetap selesai dan hasilnya masuk cache.
</BrutalCard>

<!--
Potongan useQuery menyoroti aliran signal. Pertahankan enabled, staleTime, retry, dan refetchOnWindowFocus pada hook latihan.
Jika AbortSignal dikonsumsi, pembatalan Promise juga membatalkan query dan mengembalikan state sebelumnya. Jangan menelan abort lalu mengembalikan array kosong.
Pembatalan tidak menjamin server membatalkan seluruh prosesnya; fokusnya menghentikan pekerjaan yang tidak diperlukan klien.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
-->

---
class: module-content
layout: two-cols
---

### Muat Ulang dan Invalidasi Memiliki Tujuan Berbeda

Gunakan kebutuhan pengguna untuk memilih tindakan.

::left::

#### Muat Ulang Query Saat Ini

```ts
// Callback untuk tombol Muat ulang:
const refresh = () => void query.refetch();
```

- Meminta kembali keyword saat ini.
- Dipakai pada tombol **Muat ulang**.
- Tidak mengganti parameter pencarian.

::right::

#### Tandai Kelompok Hasil agar Diperbarui

```ts
// Di dalam handler yang memiliki QueryClient:
await client.invalidateQueries({
  queryKey: ["books"],
});
```

- Menandai key yang cocok sebagai stale.
- Secara bawaan, query aktif yang diaktifkan ikut diambil ulang.
- Hasil yang belum dipakai dapat diperbarui saat digunakan lagi.

::bottom::

<BrutalCard v-click class="text-sm">
  Saat aplikasi kelak mengubah data, cache terkait perlu disesuaikan. Alur <strong>mutasi → pembaruan cache</strong> dibahas di Modul 09.
</BrutalCard>

<!--
Kedua blok adalah potongan konteks, bukan file tambahan untuk latihan utama.
Untuk invalidasi dalam komponen, import useQueryClient dari @tanstack/react-query lalu panggil const client = useQueryClient() di level atas komponen; handler memakai client tersebut.
Prefix ["books"] cocok dengan ["books", "react"] dan ["books", "typescript"]. Opsi exact: true membatasi pada key persis.
Query enabled false tidak otomatis refetch karena invalidasi. Penjelasan ini memakai staleTime numerik pada latihan, bukan opsi khusus staleTime: "static".
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
-->

---
class: module-content
---

### Kenali Tempat Data Disimpan

Toko Belajar kini mempunyai beberapa jenis data dengan pemilik berbeda.

| Data            | Pengelola                 | Cara Memperbarui pada Latihan     |
| :-------------- | :------------------------ | :-------------------------------- |
| Total keranjang | `CartProvider` · Modul 06 | Aksi tambah/reset                 |
| Detail buku     | Server Next.js · Modul 07 | Kebijakan fetch/revalidasi server |
| Hasil pencarian | TanStack Query · Modul 08 | Perubahan key atau `refetch`      |

<v-clicks>

- Detail awal halaman dapat diambil di Server Component.
- Bagian interaktif dapat memakai query di browser sesuai kebutuhannya.
- Hasil query tidak perlu disalin lagi ke context atau `useState`.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Invalidasi TanStack Query tidak menghapus cache server Next.js. Hasil pencarian dan detail bisa diperbarui pada waktu yang berbeda.
</BrutalCard>

<!--
Pilihan server/client bergantung kebutuhan, bukan label halaman saja. Dashboard pun dapat mengambil data awal di server; halaman publik dapat mempunyai area query di klien.
Pada latihan tanpa prefetch/hydration, hasil pencarian baru diminta setelah komponen aktif di browser. Detail tetap mengikuti pola server Modul 07.
Browser juga memiliki HTTP cache di lapisan request; cache tersebut berbeda dari QueryClient. Tidak perlu mendalami seluruh lapisan pada pertemuan ini.
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
-->

---
class: module-content
---

### Checkpoint: Uji Selain Keadaan Berhasil

Pasang [helper fixture pencarian](/examples/fixtures/README.md). Di console browser, pilih skenario, lalu klik **Muat ulang** tanpa reload halaman.

| Skenario                                | Hasil yang Diharapkan                            |
| :-------------------------------------- | :----------------------------------------------- |
| `docs: []`                              | Pesan hasil kosong                               |
| Respons HTTP 500 simulasi               | Pesan gagal dan tombol muat ulang                |
| `docs` bukan array / judul bukan string | Error, bukan sukses palsu                        |
| Muat ulang lambat setelah berhasil      | Hasil tersimpan tetap terlihat                   |
| Muat ulang gagal setelah berhasil       | Pesan gagal dan hasil tersimpan terlihat bersama |

```js
sessionStorage.setItem("book-search-scenario", "error");
// Pilihan: success, empty, error, invalid, slow
```

<BrutalCard v-click class="mt-4 text-sm">
  Saat browser offline, query dapat <strong>paused</strong> sampai koneksi kembali. Offline tidak selalu langsung menghasilkan <strong>isError</strong>.
</BrutalCard>

<!--
Ikuti helper pendamping. Untuk background error: success dahulu, lalu error dan Muat ulang tanpa reload. Hapus sessionStorage dan kembalikan fetch asli setelah lab. Helper ini menghasilkan Response simulasi, bukan server HTTP sungguhan; server asli diuji pada Modul 15.
Karena retry false pada latihan, pesan error tidak menunggu tiga percobaan ulang otomatis.
Network mode bawaan adalah online; kondisi paused berbeda dari pending/error pada status data.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
-->

---
class: module-content
---

### Simpan Checkpoint Pencarian

Sebelum lanjut ke form usulan, buktikan satu alur utuh.

<v-clicks>

- URL dapat dibuka ulang; hasil mengikuti `q`.
- Hasil kosong, pending, gagal, dan muat ulang memiliki tampilan yang jelas.
- Tautan hasil menuju detail server; total keranjang tetap bekerja.
- `npm run build` berhasil setelah helper simulasi dikembalikan sesuai mode yang dipilih.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  [Checkpoint Modul 08](/examples/checkpoints/modul-08.zip) berisi file lengkap. Bandingkan dengan kode Antum; gunakan fixture hanya untuk percobaan yang dapat diulang.
</BrutalCard>

---
class: module-content
---

### Cek Pemahaman: Mengapa Hasil Bisa Tertukar?

<LearningCheck
  id="modul-08-query-key"
  question="Query memakai keyword dari URL, tetapi queryKey selalu ['books']. Saat keyword berubah, perbaikan utama apa yang diperlukan?"
  :options='["Menambah staleTime supaya semua hasil disimpan lebih lama", "Memasukkan keyword ke queryKey agar tiap pencarian memiliki identitas sendiri", "Menyalin hasil query ke state keranjang"]'
  :answer="1"
  explanation="Gunakan queryKey: ['books', keyword]. Parameter yang menentukan hasil harus ikut dalam key. staleTime mengatur kesegaran data, bukan identitasnya."
/>

<!--
Beri waktu peserta memilih dan menjelaskan alasannya. Lanjutkan dengan pertanyaan lisan: apa yang berubah jika pagination ditambahkan?
Jawaban lanjutan: parameter halaman juga masuk queryKey dan queryFn.
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 08

<v-clicks>

1. **Pisahkan Peran**: fetch mengirim request; TanStack Query mengelola hasil dan statusnya.
2. **Beri Identitas Data**: queryKey menyertakan kata kunci dan parameter yang mengubah hasil.
3. **Tampilkan Keadaan dengan Jelas**: bedakan petunjuk awal, menunggu, kosong, gagal, dan pembaruan.
4. **Pahami Umur Cache**: staleTime mengatur kesegaran; gcTime mengatur penyimpanan cache tanpa pemakai.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 09:</strong> Mengelola input form, memvalidasi dengan Valibot, lalu mengirim perubahan data melalui mutasi API.
</BrutalCard>

<!--
Syarat siap lanjut: pencarian mengikuti URL, hasil mengarah ke detail Modul 07, keranjang tetap berfungsi, dan peserta mampu menjelaskan queryKey serta status pembaruan.
Form library, schema Valibot, useMutation, request POST/PUT/PATCH/DELETE, serta optimistic update disimpan untuk Modul 09.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **8 Oktober 2026**. Contoh TanStack Query mengikuti **v5**.

::left::

#### API dan Integrasi

- [Open Library: Search API](https://openlibrary.org/dev/docs/api/search)
- [Open Library: batas pemakaian API](https://openlibrary.org/developers/api)
- [MDN: menggunakan fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Next.js: useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [TanStack Query: mulai menggunakan](https://tanstack.com/query/latest/docs/framework/react/quick-start)

::right::

#### Query dan Cache

- [Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Nilai bawaan dan umur cache](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Query yang belum diaktifkan](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [Pembatalan query](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
- [Invalidasi query](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

<!--
Rujukan HTTP client alternatif, referensi useQuery, status offline, dan pemeriksaan TypeScript ada pada catatan slide terkait.
Dokumentasi daring dan API publik dapat berubah setelah audit. Cocokkan tutorial dengan versi proyek; jangan mencampur API React Query lama dengan v5.
-->
