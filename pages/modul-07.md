---
layout: intro
badge: "MODUL 07"
badgeColor: "cyan"
level: 1
---

## 07. Mengambil Data & Merender di Server

Lanjutkan Toko Belajar: tampilkan judul buku dari API, jelaskan keadaan saat menunggu atau gagal, lalu tentukan kapan data dan halaman diperbarui.

<!--
Bekal: detail /products/[id] dari Modul 03, batas Server/Client Components dari Modul 04, quantity lokal dari Modul 05, serta CartProvider dari Modul 06.
Target akhir: peserta memanggil fetch di server, menangani 404 dan kegagalan, membedakan cache data dengan hasil render, serta mengenali streaming dan dua model caching Next.js.
Durasi target 90–120 menit: pengambilan data dan status 35–45, rendering/cache 25–35, Suspense dan verifikasi 20–25, pengayaan 10–15 menit.
Praktik utama mengikuti Next.js 16.3 acuan Modul 01, Node.js runtime, dan Cache Components nonaktif seperti Modul 03. Jangan menganggap konfigurasi ini default semua starter baru.
API latihan hanya menyediakan metadata buku. Harga 50000 dari Modul 05 tetap angka latihan; keranjang Modul 06 tetap menyimpan total eksemplar, bukan stok atau transaksi.
Semua perubahan dibuat di proyek Next.js peserta. Path memakai src/ dan alias @/* → src/*. Sesuaikan products bila memakai route group.
Pengayaan Cache Components adalah pengenalan model yang berbeda, bukan instruksi mengaktifkan flag di tengah latihan.
Berhenti sebelum HTTP client alternatif, fetch di browser, useQuery, polling, dan invalidasi TanStack Query dari Modul 08. Form mutasi dan endpoint sendiri dibahas pada modul sesudahnya.
Audit sumber daring dan dua endpoint buku: 8 Oktober 2026.
-->

---
class: module-content
layout: two-cols
---

### State Keranjang dan Data Buku Memiliki Sumber Berbeda

Di Modul 06, aplikasi menyimpan pilihan pengguna. Sekarang judul buku datang dari layanan data.

::left::

#### Tetap di Komponen Client

<v-clicks>

- `BookQuantity` menyimpan jumlah pilihan.
- `CartProvider` menyimpan total keranjang.
- Klik tombol mengubah state UI tersebut.
- Header dan keranjang membaca total yang sama.

</v-clicks>

::right::

#### Dibaca di Server

<v-clicks>

- Halaman menerima ID dari URL.
- Fungsi data meminta metadata buku.
- Server memakai judul yang diterima untuk merender.
- UI menjelaskan jika data belum siap atau gagal.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Mulai dari satu kebutuhan: mengganti judul latihan pada halaman detail dengan judul dari API.
</BrutalCard>

<!--
Mengambil data tidak mengharuskan memindahkan cart ke server atau menyimpan seluruh respons API dalam Context/Zustand.
Server Component dapat memanggil layanan HTTP atau akses data langsung. Kita memakai HTTP publik agar tidak memerlukan database dahulu.
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data
-->

---
class: module-content
---

### Pastikan Konfigurasi Latihan

Periksa `next.config.ts` pada proyek kelas. Gabungkan opsi berikut dengan konfigurasi yang sudah ada.

```ts {1-6|all}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;
```

<v-clicks>

- Jalur utama memakai `fetch` dengan `cache` atau `next.revalidate`.
- Restart server development setelah mengubah konfigurasi.
- Starter baru dapat mengaktifkan model lain; periksa isi file.

</v-clicks>

<!--
Pada dokumentasi Oktober 2026, recommended defaults create-next-app sudah mengaktifkan Cache Components dan Partial Prefetching. false di sini adalah keputusan kurikulum yang melanjutkan Modul 03 dan mini project Modul 11.
Pertahankan opsi lain milik proyek. Jangan membuat export default kedua.
Ketika cacheComponents true, ikuti model use cache/cacheLife serta aturan Suspense; migrasi bukan sekadar menyalin contoh konfigurasi ini.
Sumber: https://nextjs.org/docs/app/getting-started/caching
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching
-->

---
class: module-content
---

### Praktik: Gunakan ID Buku dari API

Open Library menyediakan metadata buku publik. Kita memakai dua ID karya yang sudah diperiksa.

| ID            | Judul untuk latihan               |
| ------------- | --------------------------------- |
| `OL20915214W` | Learning React                    |
| `OL19542899W` | Learning React: A Hands-On Guide… |

Di `src/app/products/page.tsx`, ganti dua tautan buku lama:

```tsx
<>
  <Link href="/products/OL20915214W">Learning React</Link>
  <Link href="/products/OL19542899W">React: panduan praktik</Link>
</>
```

<BrutalCard v-click class="mt-3 text-sm">
  Contoh endpoint: <code>https://openlibrary.org/works/OL20915214W.json</code>. Kita hanya membaca judul; API ini tidak menyediakan harga atau stok toko.
</BrutalCard>

<!--
Import Link dari next/link sudah ada. Pertahankan tautan promo, SearchForm, dan QueryLabel beserta Suspense dari Modul 03.
ID URL kini mengikuti sumber data. Alamat contoh lama /products/buku-react dan /products/buku-next tidak lagi menunjuk karya yang valid.
Ini sampel data bibliografi, bukan rekomendasi buku untuk mempelajari API Next.js terkini.
Layanan publik dapat mengalami gangguan atau pembatasan. Hindari reload beruntun; batas request tanpa identitas adalah 1 per detik. Untuk pemakaian rutin, ikuti aturan User-Agent/kontak dan gunakan cache.
Jangan mengubah katalog publik untuk menguji revalidasi. Pengajar dapat menyiapkan layanan uji terkontrol bila membutuhkan data yang bisa diubah.
Sumber: https://openlibrary.org/developers/api
Sumber: https://openlibrary.org/works/OL20915214W/Learning_React
-->

---
class: module-content
---

### Praktik: Ambil dan Periksa Data Buku

Buat `src/lib/books.ts`. Fungsi ini akan dipanggil dari komponen server.

```ts {3-5|6-7|8-12|all}
import { notFound } from "next/navigation";

export async function getBook(id: string) {
  const url = `https://openlibrary.org/works/${encodeURIComponent(id)}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Layanan buku: HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data?.title !== "string") {
    throw new Error("Judul buku tidak valid");
  }
  return { id, title: data.title };
}
```

<v-clicks>

- `await fetch` menunggu respons; `await res.json()` membaca isinya.
- `res.ok` memeriksa status HTTP berhasil.
- `no-store` meminta data tanpa memakai Data Cache Next.js.

</v-clicks>

<!--
fetch tidak otomatis melempar error untuk HTTP 404/500. Gangguan jaringan dan JSON yang tidak bisa dibaca dapat melempar error tersendiri.
Kita memeriksa field title yang benar-benar dipakai. Ini pemeriksaan minimal, bukan validasi seluruh schema; pembahasan kontrak JSON dilanjutkan pada Modul 08–09.
Jangan mengimpor helper ini ke komponen client. Tidak perlu useEffect atau directive use server untuk pemanggilan biasa dari Server Component.
encodeURIComponent menjaga id sebagai satu nilai dalam path URL layanan.
no-store dipakai untuk pengamatan awal yang singkat. Setelah memahami cache, latihan beralih ke revalidate: 60 agar respons dapat dipakai ulang.
Sumber: https://nextjs.org/docs/app/api-reference/functions/fetch
Sumber: https://nextjs.org/docs/app/api-reference/functions/not-found
-->

---
class: module-content
---

### Praktik: Tampilkan Judul pada Detail

Edit `src/app/products/[id]/page.tsx` yang sudah ada.

Tambahkan import, lalu panggil helper setelah `await params`:

```tsx
import { getBook } from "@/lib/books";
```

```tsx
const { id } = await params;
const book = await getBook(id);
```

Ganti judul di dalam `main`:

````md magic-move
```tsx
<h1 className="text-3xl">Detail Buku</h1>
```

```tsx
<h1 className="text-3xl">{book.title}</h1>
```
````

<v-clicks>

- Page tetap `async` dan Server Component.
- Pertahankan ID, `BookNotice`, `BookQuantity key={id}`, dan timer latihan.
- Buka detail melalui tautan baru dari katalog.

</v-clicks>

<!--
Ini tiga perubahan pada file yang sudah ada, bukan tiga file baru. Baris const berada di dalam fungsi ProductPage sebelum return; jangan menggandakan const id.
Jika memakai composition BookNotice dari Modul 04, ubah h1 di tempat yang sekarang memuat judul.
CartProvider di root layout tetap menaungi halaman. Data buku tidak dibaca dari useCart.
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data
-->

---
class: module-content
layout: two-cols
---

### Praktik: Buku Tidak Ditemukan

`notFound()` menghentikan render segmen dan menampilkan UI untuk data yang tidak tersedia.

::left::

#### Buat `not-found.tsx`

Lokasi: `src/app/products/[id]/`.

```tsx
import Link from "next/link";

export default function BookNotFound() {
  return (
    <main className="p-8">
      <h1>Buku tidak ditemukan</h1>
      <Link href="/products">Kembali ke katalog</Link>
    </main>
  );
}
```

::right::

#### Bedakan Penyebabnya

<v-clicks>

- API memberi **404** → `notFound()`.
- API memberi **500/429** → kegagalan layanan.
- Respons tidak memiliki judul valid → kegagalan data.
- Jangan mengubah semua kegagalan menjadi “buku tidak ada”.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Coba <code>/products/buku-tidak-ada</code>, lalu gunakan tautan kembali ke katalog.
</BrutalCard>

<!--
notFound bekerja dengan melempar sinyal khusus Next.js. Jangan menelannya dalam try/catch biasa.
UI not-found dapat ditampilkan setelah streaming dimulai; status HTTP dokumen yang sudah terkirim bisa tetap 200. Jangan menjanjikan semua fallback not-found selalu terlihat sebagai respons HTTP 404.
Sumber: https://nextjs.org/docs/app/api-reference/functions/not-found
-->

---
class: module-content
---

### Praktik: Jelaskan Saat Data Masih Dimuat

Buat `src/app/products/[id]/loading.tsx`.

```tsx
export default function Loading() {
  return (
    <main className="p-8" role="status">
      <p className="animate-pulse">Memuat detail buku…</p>
    </main>
  );
}
```

<v-clicks>

- Next.js menyiapkan batas `Suspense` untuk page dan bagian di bawahnya.
- Tampilan menunggu diganti ketika konten siap.
- Header bersama tetap dapat digunakan selama halaman menunggu.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Loading mungkin hanya terlihat sebentar bila data cepat atau sudah tersedia. File ini tidak membungkus pekerjaan di layout pada segmen yang sama.
</BrutalCard>

<!--
Tidak perlu state isLoading buatan sendiri untuk pola server ini. loading.tsx boleh tetap Server Component.
Spinner/skeleton membantu menjelaskan progres, bukan mempercepat request.
Uji delay lokal pada checkpoint berikut. Prefetch dan buffering browser/infrastruktur dapat memengaruhi kapan fallback terlihat.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/loading
-->

---
class: module-content
---

### Praktik: Beri Jalan untuk Mencoba Lagi

Buat `src/app/products/[id]/error.tsx`. Contoh mengikuti **Next.js 16.3**.

```tsx {1-3|5-13|all}
"use client";
type Props = { retry: () => void };

export default function BookError({ retry }: Props) {
  return (
    <main className="p-8">
      <h1>Detail buku belum dapat dimuat</h1>
      <p>Silakan coba lagi sebentar lagi.</p>
      <button type="button" onClick={retry}>
        Coba lagi
      </button>
    </main>
  );
}
```

<BrutalCard v-click class="mt-3 text-sm">
  <code>retry()</code> mencoba mengambil dan merender ulang bagian yang gagal. <code>error.tsx</code> wajib berupa Client Component.
</BrutalCard>

<!--
retry menjadi stabil pada Next.js 16.3.0, sesuai versi acuan kelas. reset masih ada, tetapi hanya mengosongkan state error dan merender ulang tanpa meminta ulang konten server.
Error boundary menangkap kegagalan render di subtree-nya. Error pada event handler dan layout di segmen yang sama perlu penanganan pada tempat yang sesuai.
Prop error juga tersedia bila diperlukan untuk pelaporan. Tampilkan pesan ramah; error server production dapat disanitasi, dengan digest untuk mencocokkan log.
Retry tidak memperbaiki layanan yang masih gagal dan tidak menjamin membuang seluruh cache.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/error
-->

---
class: module-content
---

### Checkpoint: Coba Sukses, Menunggu, dan Gagal

Untuk simulasi lokal, tambahkan sementara di awal fungsi `getBook`:

```ts
if (id === "uji-error") throw new Error("Simulasi gagal");
await new Promise((resolve) => setTimeout(resolve, 2000));
```

| Percobaan                            | Hasil yang diperiksa                  |
| ------------------------------------ | ------------------------------------- |
| Buka detail dari katalog             | Loading, lalu judul buku dari API     |
| Ubah pilihan dan tambah ke keranjang | Total header masih mengikuti Modul 06 |
| Buka `/products/buku-tidak-ada`      | UI buku tidak ditemukan               |
| Buka `/products/uji-error`           | UI gagal dengan tombol Coba lagi      |

<BrutalCard v-click class="mt-4 text-sm">
  Hapus kedua baris simulasi setelah pengujian. Tombol retry dapat kembali gagal selama penyebabnya masih ada.
</BrutalCard>

<!--
Delay di server membuat keadaan menunggu lebih mudah diamati; memperlambat jaringan browser saja belum tentu memperlambat request server ke API.
Pada development, Next.js juga dapat menampilkan overlay error. Tutup panel untuk memeriksa fallback, lalu periksa kembali pada production.
Simulasi throw menguji boundary; bukan bukti bahwa API publik sedang gagal. Jangan membanjiri API atau mengubah data publik untuk pengujian.
Untuk mengamati perpindahan ke keranjang, gunakan Link; reload penuh mereset state client seperti Modul 06.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/error
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/loading
-->

---
class: module-content
---

### Dua Pertanyaan Sebelum Membahas Cache

**Rendering** membuat hasil tampilan. **Caching** menyimpan hasil agar dapat dipakai kembali.

| Pertanyaan                                   | Contoh pada detail buku                           |
| -------------------------------------------- | ------------------------------------------------- |
| Kapan server menjalankan render halaman?     | Saat build atau saat request                      |
| Apakah hasil pengambilan data dipakai ulang? | Judul dari API disimpan di Data Cache             |
| Apakah hasil render halaman dipakai ulang?   | Halaman yang sudah di-prerender disajikan kembali |

<v-clicks>

- Data yang dicache masih dapat dipakai pada halaman yang dirender saat request.
- `async` atau folder `[id]` saja tidak menentukan strategi rendering.
- Interaksi `BookQuantity` tetap berjalan di browser pada kedua strategi.

</v-clicks>

<!--
Pada model latihan, Data Cache dan cache hasil render route adalah lapisan berbeda. Jangan menyamakan semua istilah cache dengan state Context/Zustand atau cache browser.
Memoisasi request GET yang identik dalam satu render server juga berbeda dari cache persisten lintas request.
Default fetch tanpa Data Cache tidak menjamin route selalu dirender saat request: route yang memenuhi syarat masih dapat di-prerender.
Sumber: https://nextjs.org/docs/app/guides/caching-without-cache-components
Sumber: https://nextjs.org/docs/app/api-reference/functions/fetch
-->

---
class: module-content
---

### Pilih Cara Memakai Ulang Hasil Fetch

Di `getBook`, bandingkan pengganti baris `fetch` berikut. `url` tetap memakai nilai yang sudah dibuat.

````md magic-move
```ts
// Ambil dari layanan saat render membutuhkan data ini.
const res = await fetch(url, {
  cache: "no-store",
});
```

```ts
// Pakai cache; ambil dari layanan jika belum tersedia.
const res = await fetch(url, {
  cache: "force-cache",
});
```

```ts
// Simpan hasil dan beri batas waktu untuk revalidasi.
const res = await fetch(url, {
  next: { revalidate: 60 },
});
```
````

<v-clicks>

- Gunakan versi terakhir untuk melanjutkan latihan.
- Tetap periksa status HTTP dan judul setelah `fetch`.
- `60` adalah satuan detik; pembaruan dipicu akses setelah data stale.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Pilih satu kebijakan. Jangan menggabungkan <code>no-store</code> dengan <code>revalidate: 60</code>.
</BrutalCard>

<!--
Bentuk default tanpa opsi adalah auto no cache, berbeda dari no-store eksplisit. Catatan default tersebut tidak boleh disederhanakan menjadi “selalu SSR”.
force-cache tidak berarti tersimpan selamanya: invalidasi, eviction, dan lingkungan deployment memengaruhi umur cache.
revalidate pada fetch memberi umur data. Untuk mendemonstrasikan ISR halaman detail secara jelas, daftarkan params pada langkah berikutnya.
Sumber: https://nextjs.org/docs/app/api-reference/functions/fetch
-->

---
class: module-content
---

### Tiga Istilah Rendering yang Perlu Dikenali

Untuk praktik ini: **Cache Components nonaktif**. Perhatikan kapan hasil halaman dibuat dan dipakai ulang.

<v-switch>
<template #1>

#### SSG — Halaman Disiapkan Lebih Awal

- Halaman dapat dibuat saat `npm run build`.
- Pengunjung menerima hasil yang sudah tersedia.
- Berguna untuk konten publik yang perubahan datanya jarang.

</template>
<template #2>

#### SSR — Halaman Dirender Saat Request

- Server menyusun hasil ketika request diproses.
- Cocok saat tampilan membutuhkan data request tersebut.
- Data di dalamnya tetap bisa berasal dari cache atau layanan lain.

</template>
<template #3>

#### ISR — Hasil Prerender Dapat Diperbarui

- Halaman disiapkan lebih awal dan dipakai kembali.
- Revalidasi memperbaruinya tanpa membangun ulang seluruh situs.
- Ada toleransi data lama selama proses pembaruan.

</template>
</v-switch>

<!--
Jangan memberi peringkat kecepatan mutlak. Latensi dipengaruhi data, jaringan, cache, dan pekerjaan render.
SSR tidak berarti data berubah otomatis di tab yang sedang terbuka atau semua sumber datanya real-time.
SSG tidak berarti halaman kehilangan tombol interaktif; Client Components tetap dapat di-hydrate.
Sumber: https://nextjs.org/docs/app/guides/caching-without-cache-components
Sumber: https://nextjs.org/docs/app/guides/incremental-static-regeneration
-->

---
class: module-content
---

### Praktik: Siapkan Dua Detail Saat Build

Tetap gunakan `revalidate: 60` di `getBook`. Tambahkan ekspor ini di `src/app/products/[id]/page.tsx`, di luar fungsi page.

```tsx {2|all}
export function generateStaticParams() {
  return [{ id: "OL20915214W" }, { id: "OL19542899W" }];
}
```

<v-clicks>

- Nama properti `id` sesuai folder `[id]`.
- Dua detail ini dapat di-prerender saat build.
- Page tetap membaca `params` dengan `await`.
- ID lain masih dapat diproses; `notFound()` menangani yang tidak ada.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Folder dinamis menjelaskan bentuk URL. <code>generateStaticParams</code> memberi daftar nilai yang disiapkan lebih awal.
</BrutalCard>

<!--
Pernyataan ini mengasumsikan layout/page latihan tidak menambahkan cookies, headers, no-store, atau konfigurasi lain yang memaksa rendering dinamis.
dynamicParams secara default mengizinkan ID di luar daftar pada model ini. Daftar bukan izin akses dan bukan validasi keberadaan data.
generateStaticParams tidak dijalankan lagi ketika ISR memperbarui halaman.
API harus dapat diakses ketika build membuat dua halaman. Jangan mengubah kegagalan build menjadi data palsu.
Sumber: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
-->

---
class: module-content
---

### ISR: Apa yang Terjadi Setelah 60 Detik?

Misalkan hasil **A** sudah tersimpan. Tabel ini menggambarkan revalidasi berbasis waktu pada halaman latihan.

| Waktu akses                           | Yang terjadi                                               |
| ------------------------------------- | ---------------------------------------------------------- |
| Sebelum 60 detik                      | Pengunjung menerima hasil A dari cache                     |
| Sudah lewat 60 detik, belum ada akses | Tidak ada pekerjaan pembaruan yang wajib langsung berjalan |
| Akses pertama setelah stale           | Hasil A dapat dikirim; pembaruan dimulai di belakang       |
| Pembaruan berhasil                    | Akses berikutnya menerima hasil baru B                     |

<v-clicks>

- Jika pembaruan gagal, hasil lama yang berhasil dapat tetap digunakan.
- Judul dapat tetap sama bila sumber datanya memang belum berubah.
- Revalidasi bukan jadwal cron dan bukan pembaruan otomatis semua tab.

</v-clicks>

<!--
A dan B adalah ilustrasi versi konten; bukan nilai buatan dari endpoint latihan. Kita tidak mengendalikan kapan metadata Open Library berubah.
60 detik untuk memudahkan diskusi. Pilih umur cache nyata berdasarkan kebutuhan kesegaran dan beban sumber.
Revalidasi perlu runtime server yang mendukungnya; static export tidak menjalankan ISR.
Sumber: https://nextjs.org/docs/app/guides/incremental-static-regeneration
-->

---
class: module-content
---

### Praktik: Pisahkan Bagian yang Menunggu Data

Buat `src/app/products/[id]/BookDetails.tsx`. Pindahkan pengambilan buku dan kontrolnya ke komponen server ini.

```tsx {1-5|7-8|10-17|all}
import { getBook } from "@/lib/books";
import BookNotice from "./BookNotice";
import BookQuantity from "./BookQuantity";

type Props = { id: string };

export default async function BookDetails({ id }: Props) {
  const book = await getBook(id);
  return (
    <section className="space-y-3">
      <h2>{book.title}</h2>
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
      <BookQuantity key={id} />
    </section>
  );
}
```

<!--
BookDetails tidak memakai use client. Ia menampilkan Client Components sebagai anak, sesuai Modul 04.
Kontrol buku berada bersama data agar tidak muncul lebih dahulu untuk buku yang belum diketahui ada.
Jika memakai children pada BookNotice, pertahankan susunan yang sesuai saat memindahkannya.
StudyTimer dari Modul 05 boleh tetap berada di page, di luar bagian yang menunggu metadata.
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense
-->

---
class: module-content
---

### Praktik: Pasang Batas Suspense

Di `src/app/products/[id]/page.tsx`, gunakan komponen page berikut beserta import-nya.

```tsx {1-4|6-7|12-14|all}
import { Suspense } from "react";
import BookDetails from "./BookDetails";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-8">
      <h1 className="text-3xl">Detail Buku</h1>
      <Suspense fallback={<p role="status">Memuat buku…</p>}>
        <BookDetails id={id} />
      </Suspense>
    </main>
  );
}
```

Pertahankan ekspor `generateStaticParams`. Bila memakai `StudyTimer`, pertahankan import dan tampilkan setelah `Suspense`.

<!--
Hapus import getBook, BookNotice, dan BookQuantity dari page bila tidak dipakai lagi; sekarang semuanya berada di BookDetails. Jangan menghapus fungsi generateStaticParams.
Tidak ada await getBook pada page: operasi yang menunggu kini berada di anak di dalam Suspense.
Untuk mengamati fallback, coba lagi delay sementara di awal getBook pada development, lalu hapus. Respons cache yang sudah siap tidak harus menampilkan fallback.
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense
-->

---
class: module-content
layout: two-cols
---

### Apa yang Dicakup oleh Suspense?

**Streaming** mengirim hasil secara bertahap saat bagian halaman siap.

::left::

#### Pada Contoh Kita

```text {1-2|3-5|all}
ProductPage
├── Judul "Detail Buku"
└── Suspense
    ├── fallback saat menunggu
    └── BookDetails saat siap
```

- Judul dapat tampil lebih dahulu.
- Data dan kontrol buku menyusul bersama.
- Batas terpisah dapat selesai secara independen.

::right::

#### Batas yang Perlu Diingat

<v-clicks>

- Pekerjaan yang di-`await` sebelum boundary tetap harus ditunggu.
- Suspense tidak otomatis mendeteksi `fetch` di dalam `useEffect`.
- Boundary tidak membuat layanan data menjadi lebih cepat.
- Fallback tidak harus selalu terlihat jika data sudah siap.

</v-clicks>

<!--
loading.tsx memberi batas pada segmen; Suspense manual memberi batas lebih dekat ke komponen. Keduanya dapat dipakai bersama.
Memecah boundary tidak otomatis membuat operasi yang saling bergantung menjadi paralel. Mulai request independen secara paralel hanya jika datanya memang independen.
Streaming tidak sama dengan Partial Prerendering: yang satu cara mengirim hasil, yang lain juga mengatur bagian yang disiapkan lebih awal.
Pada pola framework ini, komponen async server didukung oleh Next.js. Jangan menjadikan semua Client Components async.
Sumber: https://react.dev/reference/react/Suspense
Sumber: https://nextjs.org/docs/app/getting-started/fetching-data
-->

---
class: module-content
---

### Periksa Cache pada Mode Production

Hapus kode simulasi. Hentikan server development, lalu jalankan dari proyek Next.js:

```bash
npm run build
npm run start
```

<v-clicks>

1. Periksa ringkasan build untuk dua detail dari `generateStaticParams`.
2. Buka katalog, klik detail, lalu lakukan reload penuh pada detail.
3. Uji ID yang tidak ada dan pastikan navigasi keranjang masih berfungsi.
4. Bandingkan dengan mode request-time pada percobaan terpisah.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Untuk percobaan request-time: pakai <code>no-store</code>, hapus sementara ekspor <code>generateStaticParams</code>, lalu build ulang. Setelah selesai, kembalikan kedua pengaturan latihan.
</BrutalCard>

<!--
HMR di next dev dapat memakai ulang respons fetch, termasuk no-store. Hard refresh/developer tools juga dapat memengaruhi aturan cache development; jangan menyimpulkan perilaku production dari HMR.
Mulai eksperimen dari konfigurasi yang jelas. Mengganti file tanpa build ulang tidak mengubah hasil next start.
API harus tersedia saat prerender. error.tsx bukan cara menutupi kegagalan build.
Untuk membuktikan perubahan A ke B setelah revalidasi, gunakan sumber data uji milik kelas yang bisa diubah dan log request pada sumber itu. Judul Open Library yang tetap sama bukan bukti cache gagal.
Harga/stock transaksi dan data pribadi memerlukan aturan kesegaran serta otorisasi tersendiri; jangan menerapkan cache publik contoh ini pada semuanya.
Sumber: https://nextjs.org/docs/app/guides/incremental-static-regeneration#verifying-correct-production-behavior
Sumber: https://nextjs.org/docs/app/api-reference/functions/fetch#troubleshooting
-->

---
class: module-content
---

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

<!--
Slide ini pengenalan API, bukan instruksi menjalankan invalidasi pada module scope, saat render, atau di onClick client.
revalidatePath/revalidateTag digunakan dalam Server Action atau Route Handler. updateTag hanya dalam Server Action. Bentuk revalidateTag dengan satu argumen sudah deprecated.
Pada Route Handler, revalidatePath bekerja ketika path dikunjungi lagi; bukan otomatis membangun semua halaman saat fungsi dipanggil.
Implementasi mutasi, pemeriksaan izin, dan endpoint dibahas setelah Modul 08. API publik latihan tidak kita mutasikan; menambah total cart juga tidak mengubah metadata buku.
Menambahkan tag saja tidak menyebabkan data diperbarui. Cache Next.js juga tidak mengubah cache atau data milik layanan asal.
Sumber: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
Sumber: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
Sumber: https://nextjs.org/docs/app/api-reference/functions/updateTag
-->

---
class: module-content
layout: two-cols
---

### Pengayaan: Kenali Model Cache Components

Dokumentasi terkini juga memakai model berikut. Pelajari sebagai jalur lanjutan setelah praktik utama dipahami.

::left::

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

::right::

#### Cara Menyatakan Kebutuhan

<v-clicks>

- `"use cache"` menyimpan hasil fungsi atau komponen.
- `cacheLife` mengatur masa pakai cache.
- `cacheTag` memberi label untuk invalidasi.
- Data yang menunggu request ditempatkan di bawah `Suspense`.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Mengaktifkannya perlu meninjau akses data, params, layout, dan batas Suspense. Ikuti panduan migrasi sebelum mengubah proyek latihan.
</BrutalCard>

<!--
Model ini mendukung Partial Prerendering dan memerlukan Node.js runtime. Jangan memakai experimental.ppr lama.
Opsi dynamic, revalidate, atau fetchCache pada route dari model sebelumnya tidak boleh dicampur begitu saja dengan Cache Components. Fungsi cache dan parameter runtime mempunyai aturan tersendiri.
Cakupan use cache dapat berada pada fungsi data atau komponen. Tidak perlu memberikan implementasi kedua lengkap dalam modul pemula ini.
partialPrefetching memerlukan cacheComponents. Dokumentasi Oktober 2026 meminta nilainya ditulis eksplisit saat Cache Components diaktifkan.
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
Sumber: https://nextjs.org/docs/app/getting-started/caching
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching
-->

---
class: module-content
layout: two-cols
---

### PPR dan Prefetch Menjawab Kebutuhan Berbeda

Pada jalur Cache Components, keduanya dapat bekerja bersama.

::left::

#### Partial Prerendering

<v-clicks>

- Menyiapkan bagian halaman yang dapat dirender lebih awal.
- Kerangka halaman dapat memuat fallback.
- Bagian yang membutuhkan request menyusul melalui streaming.

</v-clicks>

::right::

#### Partial Prefetching

<v-clicks>

- Menyiapkan bagian route yang dapat dipakai kembali sebelum navigasi.
- Konten yang bergantung URL dapat menyusul saat berpindah.
- Pengaturan prefetch memengaruhi apa yang diminta sebelum klik.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Uji dua jalur: membuka atau me-reload URL, lalu berpindah lewat Link. Hasil prefetch dan tampilan awal dapat berbeda.
</BrutalCard>

<!--
Jangan menjanjikan “instan dari CDN”, “selalu satu request”, atau “tidak ada waterfall”. Efek nyata bergantung struktur route, cache, jaringan, dan hosting.
State cart lokal Modul 06 bukan otomatis contoh data request-time di server. Untuk membahas PPR, bedakan state client tersebut dari data server yang menunggu request.
Navigation Inspector, instant(), dan optimasi prefetch per link terlalu lanjut untuk checkpoint dasar; tersedia dalam bacaan berikut.
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching
-->

---
class: module-content
---

### Prediksi: Cache Sudah Lewat 60 Detik

<LearningCheck
  question="Halaman ISR memakai revalidate: 60. Setelah dua menit tanpa akses, pengunjung pertama datang. Apa yang mungkin ia lihat?"
  :options='["Pasti data terbaru karena server memperbarui tepat setiap 60 detik", "Hasil cache lama sambil akses itu memicu pembaruan di belakang", "Halaman selalu kosong sampai seluruh situs dibangun ulang"]'
  :answer="1"
  explanation="Revalidasi berbasis waktu dipicu akses setelah hasil menjadi stale. Hasil lama dapat disajikan selama pembaruan; akses berikutnya memakai hasil baru setelah pembaruan berhasil."
/>

<!--
Konteks: ISR model latihan, bukan no-store atau updateTag yang mengakhiri cache secara langsung.
Beri 30 detik untuk prediksi. Minta peserta mengurutkan: stale → akses → pembaruan → hasil baru.
Kuis tidak memakai API TanStack Query; pengetahuan itu baru diperkenalkan pada Modul 08.
Sumber: https://nextjs.org/docs/app/guides/incremental-static-regeneration
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 07

<v-clicks>

1. **Ambil dan Periksa Data**: Server membaca API; status HTTP dan field yang dipakai tetap diperiksa.
2. **Jelaskan Keadaan Halaman**: Siapkan loading, buku tidak ditemukan, serta pesan gagal dengan retry.
3. **Pisahkan Render dan Cache**: Waktu render halaman berbeda dari kebijakan memakai ulang data.
4. **Gunakan Batas yang Jelas**: Suspense mengatur bagian yang menunggu; model cache mengikuti konfigurasi.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 08:</strong> Bagaimana jika browser perlu meminta data lagi saat pengguna berinteraksi? Kita membahas konsumsi API dan TanStack Query.
</BrutalCard>

<!--
Peserta siap lanjut bila helper, status halaman, dan cart lama tetap berjalan; dapat menjelaskan revalidate 60 tanpa menganggapnya cron; serta tahu konfigurasi yang dipakai.
Fetch di browser, HTTP client alternatif, queryKey, staleTime, polling, dan invalidateQueries masuk Modul 08.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **8 Oktober 2026**. Rujukan tambahan tercantum dalam catatan slide.

::left::

#### Data dan Status Halaman

- [Next.js: mengambil data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js: fetch dan opsi cache](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [Next.js: loading.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Next.js: error.tsx dan retry](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Next.js: notFound](https://nextjs.org/docs/app/api-reference/functions/not-found)
- [Open Library: API dan batas pemakaian](https://openlibrary.org/developers/api)

::right::

#### Rendering, Cache, dan Streaming

- [Cache tanpa Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [ISR dan verifikasi production](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [React: Suspense](https://react.dev/reference/react/Suspense)
- [Model Cache Components](https://nextjs.org/docs/app/getting-started/caching)
- [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching)

<!--
API revalidatePath, revalidateTag, updateTag, dan cacheComponents dirujuk langsung pada catatan slide pengayaan terkait.
Dokumentasi daring dan layanan publik dapat berubah setelah audit. Sesuaikan dengan versi proyek yang digunakan, bukan sekadar menyalin contoh dari artikel lama.
-->
