---
layout: intro
badge: "MODUL 03"
badgeColor: "pink"
level: 1
---

## 03. Navigasi & Routing Dinamis

Lanjutkan Toko Belajar: buka detail buku, berpindah lewat tautan, dan simpan kata pencarian di URL.

<!--
Bekal: lima URL Modul 02 sudah berjalan, root layout memuat header/footer, dan products/layout.tsx menampilkan Area Katalog.
Target akhir: peserta membuat satu halaman detail untuk beberapa ID, menghubungkan halaman dengan Link, menandai menu katalog aktif, dan membaca kata pencarian dari URL.
Durasi target 60–75 menit: detail dan Link 20 menit, navbar dan hook 15 menit, pencarian dan pemeriksaan 25–40 menit. Catch-all adalah pengayaan.
Semua path melanjutkan src/app/ dan alias @/* → src/* dari Modul 01. Jika peserta mencoba route group pada Modul 02, sesuaikan lokasi products menjadi src/app/(shop)/products; URL dan import relatif tetap sama.
Contoh menggunakan Next.js 16 dengan konfigurasi starter kelas, tanpa mengaktifkan Cache Components. Konfigurasi cache/prerender dibahas pada modul terkait.
use client diperkenalkan sebagai syarat memakai hook navigasi dan event handler pada komponen kecil. Cara kerja Server/Client Components, hydration, dan batas import dimulai di Modul 04.
Data buku masih teks latihan. Belum ada database, proses pembayaran, atau pencarian data sungguhan.
Audit sumber daring: 7 Oktober 2026. Detail versi mengikuti acuan kelas Modul 01, bukan klaim versi terbaru.
-->

---
class: module-content
---

### Satu Halaman Detail untuk Banyak Buku

Modul 02 memakai nama folder tetap. Sekarang bagian alamat perlu mengikuti ID buku.

```text {1-3|4-5|all}
src/app/products/
├── page.tsx             → /products
├── promo/page.tsx       → /products/promo
└── [id]/
    └── page.tsx         → /products/buku-react atau /products/buku-next
```

<BrutalCard v-click class="mt-4 bg-yellow-100">
  🤔 Kalau ada 1.000 buku, apakah perlu 1.000 folder?<br/>
  <strong>[id]</strong> menangkap satu segmen dari URL. Kita membuat satu komponen halaman untuk menampilkan ID yang berbeda.
</BrutalCard>

<!--
Hubungkan dengan pertanyaan penutup Modul 02. ID adalah pengenal buku; pada contoh ini bentuknya teks, bukan harus angka.
Nama dalam kurung siku menentukan nama properti params: [id] → id. Jika memakai [slug], propertinya slug; jangan berganti nama di tengah contoh.
Folder promo yang sudah ada tetap menyediakan /products/promo. Segmen bernama tetap didahulukan daripada segmen dinamis pada posisi yang sama.
Dynamic segment menjelaskan pola alamat, bukan otomatis strategi rendering atau sumber data.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
-->

---
class: module-content
---

### Praktik: Baca ID dari URL

Buat `src/app/products/[id]/page.tsx`, lalu buka dua alamat contoh di browser.

```tsx {1-3|5-6|8-13|all}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-8">
      <h1 className="text-3xl">Detail Buku</h1>
      <p>ID buku: {id}</p>
    </main>
  );
}
```

<BrutalCard v-click class="mt-4 text-sm">
  Buka <code>/products/buku-react</code>, lalu <code>/products/buku-next</code>. Teks ID berubah; header dan label Area Katalog dari Modul 02 tetap membungkus halaman.
</BrutalCard>

<!--
Beri waktu 5 menit. Baca type Props → fungsi async → await params → JSX. Promise berarti nilainya dibaca melalui await pada contoh ini.
Pada Next.js 16, params adalah Promise; hindari contoh lama yang langsung membaca params.id. Halaman async ini tidak diberi use client.
Kode baru menampilkan pengenal dari URL, belum memeriksa apakah buku itu ada. ID sembarang juga tampil; validasi data dan notFound mengikuti materi data/error.
Coba /products/promo untuk memastikan halaman promo Modul 02 tetap berfungsi. /products sendiri tetap memakai products/page.tsx.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional
-->

---
class: module-content
---

### Berpindah Halaman dengan `Link`

Pengunjung perlu tautan yang bisa diklik. Gunakan `next/link` untuk navigasi internal biasa.

````md magic-move
```tsx
export default function CatalogLink() {
  return <a href="/products">Lihat katalog</a>;
}
```

```tsx
import Link from "next/link";

export default function CatalogLink() {
  return <Link href="/products">Lihat katalog</Link>;
}
```
````

<v-clicks>

- **href** adalah alamat tujuan; teks tautan menjelaskan tujuannya.
- Link mendukung perpindahan sisi klien tanpa memuat ulang seluruh dokumen.
- Prefetch menyiapkan rute lebih awal; otomatis aktif di production, dengan cakupan sesuai jenis rute dan konfigurasi.

</v-clicks>

<!--
Contoh kecil untuk memahami perubahan; penerapannya pada katalog ada di slide berikutnya. Klik 1 mengubah a menjadi Link, lalu lanjutkan penjelasan bertahap.
Tautan a ke halaman lain secara normal meminta dokumen baru. Tetap gunakan a sesuai kebutuhan, misalnya situs luar, email, atau unduhan; tidak perlu mengajarkan bahwa a selalu lambat atau salah.
Navigasi pertama/reload berbeda dari navigasi melalui Link. Layout bersama dapat dipertahankan pada navigasi sisi klien; ini bukan jaminan semua state selalu bertahan.
Prefetch bukan janji data sudah lengkap ketika tautan diklik. Perilaku dipengaruhi rute, loading UI, cache, dan jaringan. Tidak perlu mengubah prefetch pada latihan.
Link dapat dipakai pada page/layout tanpa menambahkan use client ke file tersebut hanya karena ada Link.
Sumber: https://nextjs.org/docs/app/api-reference/components/link
Sumber: https://nextjs.org/docs/app/getting-started/linking-and-navigating
-->

---
class: module-content
---

### Praktik: Hubungkan Katalog ke Detail Buku

Perbarui `src/app/products/page.tsx` dengan dua tautan buku dan tautan promo.

```tsx
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Katalog Buku</h1>
      <p>Buku pilihan untuk belajar.</p>
      <div className="flex flex-col gap-2">
        <Link href="/products/buku-react">Buku React</Link>
        <Link href="/products/buku-next">Buku Next</Link>
        <Link href="/products/promo">Lihat promo</Link>
      </div>
    </main>
  );
}
```

<BrutalCard v-click class="mt-4 text-sm">
  Klik tiap judul buku dan periksa ID-nya. Gunakan tombol <strong>Back</strong> browser untuk kembali ke katalog, lalu coba tautan promo.
</BrutalCard>

<!--
Beri waktu 3–5 menit. href berisi alamat nyata seperti /products/buku-react, bukan nama folder literal /products/[id].
Link tidak menciptakan halaman tujuan; file page.tsx pada langkah sebelumnya tetap diperlukan.
Peserta bisa membuka tautan di tab baru melalui perilaku tautan browser yang biasa. Jangan menggantikan semua tautan dengan tombol onClick.
Berhasil bila tautan detail dan promo menuju isi yang tepat tanpa mengetik alamat satu per satu.
Sumber: https://nextjs.org/docs/app/api-reference/components/link#href-required
-->

---
class: module-content
layout: two-cols
---

### Pasang Menu Bersama di Header

Buat `src/components/Navbar.tsx`, lalu gunakan di root layout dari Modul 02.

::left::

#### Isi `Navbar.tsx`

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4">
      <Link href="/">Beranda</Link>
      <Link href="/products">Katalog</Link>
      <Link href="/cart">Keranjang</Link>
    </nav>
  );
}
```

::right::

#### Edit `src/app/layout.tsx`

Tambahkan import di awal file:

```tsx
import Navbar from "@/components/Navbar";
```

Ganti bagian header dengan potongan JSX ini:

```tsx
<header className="border-b p-4">
  <p>Toko Belajar</p>
  <Navbar />
</header>
```

::bottom::

<BrutalCard v-click class="text-sm">
  Menu sekarang muncul juga pada halaman detail. Klik <strong>Katalog</strong> untuk kembali ke daftar buku.
</BrutalCard>

<!--
Contoh kanan adalah dua perubahan dalam file layout yang sudah ada, bukan pengganti seluruh layout. Pertahankan html, body, children, footer, import CSS, font, serta metadata.
Komponen Navbar belum membaca URL atau memakai event handler; belum perlu use client.
src/components tidak berada di dalam route group; alias import di atas tetap sama bila products dipindah ke (shop).
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages#linking-between-pages
-->

---
class: module-content
---

### Tiga Hook untuk Tiga Kebutuhan

Hook adalah fungsi React dengan aturan pemanggilan. Hook navigasi App Router berasal dari `next/navigation`.

| Kebutuhan                   | Hook                | Contoh penggunaan                  |
| :-------------------------- | :------------------ | :--------------------------------- |
| Membaca path saat ini       | `usePathname()`     | Menandai menu katalog aktif        |
| Membaca bagian setelah `?`  | `useSearchParams()` | Membaca kata pencarian `q`         |
| Berpindah lewat logika kode | `useRouter()`       | Membuka hasil setelah form dikirim |

<BrutalCard v-click class="mt-4">
  File komponen yang memakai hook ini diberi <code>"use client"</code> di awal. Panggil hook di tingkat teratas <strong>di dalam komponen</strong>, sebelum return; jangan di dalam kondisi atau event handler.
</BrutalCard>

<!--
Ini bekal minimum untuk latihan navigasi. use client menandai komponen client; penjelasan batas server/client dan cara rendering-nya ada di Modul 04.
“Di tingkat teratas” tidak berarti di luar fungsi komponen. Hook juga boleh dipakai dalam custom hook, tetapi kita tidak membuat custom hook di sini.
Pemanggilan useRouter berada dalam komponen; router.push dapat dipanggil dalam event handler setelah router diperoleh.
Gunakan next/navigation pada App Router. Contoh dari next/router ditujukan untuk Pages Router.
Sumber: https://react.dev/reference/rules/rules-of-hooks
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-pathname
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-router
-->

---
zoom: 0.93
class: module-content
---

### Praktik: Tandai Menu Katalog yang Aktif

Perbarui `src/components/Navbar.tsx`; bandingkan path saat ini dengan `/products`.

```tsx {1-3|5-7|12-17|all}
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isCatalog = pathname === "/products";
  return (
    <nav aria-label="Navigasi utama" className="flex gap-4">
      <Link href="/">Beranda</Link>
      <Link
        href="/products"
        aria-current={isCatalog ? "page" : undefined}
        className="aria-[current=page]:font-bold"
      >
        Katalog
      </Link>
      <Link href="/cart">Keranjang</Link>
    </nav>
  );
}
```

Teks **Katalog** menebal di `/products`. `aria-current` juga menyampaikan statusnya kepada pembaca layar.

<!--
Praktik ini menandai satu menu dahulu. Menu Beranda dan Keranjang tetap berfungsi sebagai tautan biasa.
Kecocokan sengaja persis: di /products/buku-react, Katalog tidak ditandai sebagai halaman aktif. Penandaan seluruh bagian beserta halaman anak adalah pilihan desain lain, bukan bagian latihan ini.
Di /products?q=react, pathname tetap /products sehingga Katalog aktif. Parameter setelah ? dijelaskan berikutnya.
Kelas Tailwind menggunakan selector atribut aria-current. Tanpa className tersebut, atribut tetap punya makna aksesibilitas, tetapi belum tentu terlihat berbeda.
Catatan konfigurasi: bila Cache Components diaktifkan pada proyek lain, usePathname pada rute dengan parameter dinamis yang belum diketahui dapat memerlukan Suspense. Starter kelas belum mengaktifkannya.
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-pathname
Sumber atribut: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
Sumber gaya: https://tailwindcss.com/docs/hover-focus-and-other-states#aria-states
-->

---
class: module-content
---

### Path dan Query: Dua Bagian URL

Path menunjuk halaman; query membawa nilai tambahan setelah tanda `?`.

```text
/products?q=react
└─ path ─┘ └ query ┘
```

| Alamat                 | Yang dibaca                  | Hasil          |
| :--------------------- | :--------------------------- | :------------- |
| `/products/buku-react` | `id` dari `await params`     | `"buku-react"` |
| `/products?q=react`    | `usePathname()`              | `"/products"`  |
| `/products?q=react`    | `useSearchParams().get("q")` | `"react"`      |

<BrutalCard v-click class="mt-4 text-sm">
  <code>q</code> adalah nama yang kita pilih untuk kata pencarian. URL ini bisa disalin; aplikasi harus membaca nilainya agar tampilan mengikuti URL.
</BrutalCard>

<!--
Notasi pemanggilan pada tabel menunjukkan hasil, bukan kode untuk ditempel di luar komponen.
Jangan membuat folder bernama products?q=react. Query tidak mengubah struktur folder halaman.
Tunjukkan bahwa q, sort, dan page hanyalah nama parameter yang dipilih aplikasi, bukan parameter bawaan Next.js. Latihan cukup memakai q.
searchParams sebagai prop pada server page juga tersedia dalam bentuk Promise; berbeda dari hook useSearchParams yang menghasilkan pembaca URLSearchParams. Jangan mencampur dua bentuk API ini.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params
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
Field input belum disinkronkan kembali dari URL ketika Back/Forward; label hasil pada langkah berikutnya menjadi acuan nilai URL. Kontrol input dengan state menyusul setelah dasar Server/Client Components.
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
        <Link href="/products/buku-react">Buku React</Link>
        <Link href="/products/buku-next">Buku Next</Link>
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
Tidak menambahkan use client ke page atau root layout. Dasar menggabungkan komponen seperti ini dibahas lebih jauh pada Modul 04.
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
---

### Tambahan: Jika Segmennya Lebih dari Satu

Catch-all dipakai ketika kedalaman alamat bervariasi, misalnya halaman panduan toko.

| Folder di dalam `src/app/`  | Alamat yang cocok      | Nilai setelah `await params`   |
| :-------------------------- | :--------------------- | :----------------------------- |
| `products/[id]/page.tsx`    | `/products/buku-react` | `{ id: "buku-react" }`         |
| `help/[...slug]/page.tsx`   | `/help/order/track`    | `{ slug: ["order", "track"] }` |
| `help/[[...slug]]/page.tsx` | `/help`                | `{ slug: undefined }`          |

<BrutalCard v-click class="mt-4 text-sm">
  <code>[id]</code>: tepat satu segmen.<br/>
  <code>[...slug]</code>: satu atau lebih segmen.<br/>
  <code>[[...slug]]</code>: nol atau lebih segmen.
</BrutalCard>

<!--
Ini referensi pola alternatif, bukan instruksi membuat ketiganya dalam latihan. Terutama dua varian help adalah pilihan, bukan dipasang bersama.
help/[...slug] tidak mencakup /help; optional catch-all mencakup /help serta /help/order/track.
Nilai satu segmen bertipe string, catch-all bertipe string[], optional catch-all dapat undefined. Seluruh objek params tetap Promise sebelum await.
Rute katalog latihan cukup [id]. Jangan menambah catch-all hanya untuk membuat banyak ID buku.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments
-->

---
class: module-content
---

### Latihan Mandiri: Ikuti Perjalanan Pengunjung

Uji lewat tautan dan form yang sudah dipasang, lalu cocokkan URL dengan isi layar.

| Tindakan                             | Hasil yang diharapkan                       |
| :----------------------------------- | :------------------------------------------ |
| Buka Katalog, lalu klik Buku React   | `/products/buku-react`, ID buku: buku-react |
| Klik Katalog, lalu Buku Next         | `/products/buku-next`, ID buku: buku-next   |
| Kembali ke Katalog, kirim kata react | `?q=react`, label Pencarian: react          |
| Kirim next, lalu Back dan Forward    | URL dan label mengikuti riwayat             |
| Muat ulang URL hasil pencarian       | Label tetap membaca nilai q di URL          |

<BrutalCard v-click class="mt-4 text-sm">
  Tambahkan tautan <strong>Buku TypeScript</strong> menuju <code>/products/buku-typescript</code>. Berhasil jika ID baru tampil menggunakan file <code>[id]/page.tsx</code> yang sama.
</BrutalCard>

<!--
Beri waktu 5–8 menit. Kembalikan form ke router.push sebelum menguji tabel ini bila peserta mencoba replace.
Periksa juga menu Katalog menebal pada /products, termasuk ketika query berubah. Ini penandaan URL persis, sehingga tidak aktif pada halaman detail.
Hasil pencarian yang dinilai adalah label, bukan isi input atau penyaringan buku. Input form tidak otomatis mengikuti Back/Forward pada contoh ini.
Coba kata dengan spasi atau &: URL boleh ter-encode, tetapi label harus menampilkan kata yang diketik setelah trim.
Akhiri dengan npx eslint . dan npm run build dari proyek Next.js peserta. Build yang berhasil perlu disertai pemeriksaan perilaku browser ini.
-->

---
class: module-content
layout: two-cols
---

### Kalau Navigasi Belum Sesuai

Periksa satu hubungan pada satu waktu: URL, file, hook, atau komponen pemakainya.

::left::

#### Alamat atau Isi Keliru

- Nama folder **[id]** harus cocok dengan properti **id**.
- Baca **params** dengan **await** sebelum mengambil id.
- Isi **href** dengan alamat nyata, misalnya **/products/buku-react**.
- **?q=react** dibaca melalui query, bukan **params.id**.

::right::

#### Hook atau Build Bermasalah

- Import hook App Router dari **next/navigation**.
- Letakkan **use client** di awal file komponen yang memakai hook.
- Panggil hook di dalam fungsi komponen, sebelum return.
- Bungkus **QueryLabel** dengan **Suspense** pada page seperti contoh.

<!--
Jika build mengeluhkan useSearchParams tanpa Suspense, cek pembungkus berada di atas komponen pemanggil hook, bukan di bawah hook di komponen yang sama.
Jika Navbar atau SearchForm tidak muncul, cek file sudah diimpor dan digunakan dalam JSX; file pendukung tidak otomatis tampil karena dibuat.
Jangan mengubah page detail yang async menjadi Client Component untuk mengatasi error Navbar. Baca nama file dalam pesan error.
-->

---
class: module-content
---

### Cek Pemahaman: ID atau Query?

Pisahkan bagian path dari nilai setelah tanda tanya.

<LearningCheck
  question="Pada /products/buku-react?q=next, apa nilai id dari await params di products/[id]/page.tsx?"
  :options="[
    'next',
    'buku-react',
    '/products/buku-react?q=next',
  ]"
  :answer="1"
  explanation="[id] menangkap buku-react dari path. q=next adalah query yang dibaca terpisah; mengganti q tidak mengubah nilai id."
/>

<!--
Beri peserta waktu menjelaskan alasan sebelum memilih. Ulangi prediksi untuk kelompok berikutnya.
Tanya lanjutan: apa yang dikembalikan usePathname? /products/buku-react. Bagaimana kembali ke katalog jika tujuannya harus pasti? Link dengan href=/products.
Checkpoint mencakup pemilihan sumber nilai, bukan sekadar menghafal nama hook.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade
---

## 3 Hal Penting dari Modul 03

<v-clicks>

1. **Satu Pola, Banyak ID**: `[id]/page.tsx` membaca pengenal buku melalui `await params`.
2. **Hubungkan Halaman**: Gunakan Link untuk tautan; useRouter saat perpindahan mengikuti logika kode.
3. **Baca URL Sesuai Bagian**: usePathname membaca path, useSearchParams membaca query. Periksa hasil dengan reload dan Back/Forward.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-pink/10">
  🚀 <strong>Selanjutnya di Modul 04:</strong> Mengapa page detail bisa async, sedangkan Navbar dan form memakai <code>"use client"</code>? Kita pelajari peran Server dan Client Components.
</BrutalCard>

<!--
Peserta siap lanjut bila dapat membuka dua ID melalui Link, menunjukkan menu aktif, dan menjelaskan mengapa label pencarian bertahan melalui URL.
Berhenti pada pertanyaan pembuka di atas. Arsitektur rendering, hydration, props lintas batas, dan pemilihan batas client menjadi materi Modul 04.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada 7 Oktober 2026; gunakan untuk mengecek contoh dan batas perilakunya.

::left::

#### Rute dan Navigasi

- [Dynamic segments dan catch-all](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Props params dan searchParams pada page](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- [Link dan pilihan navigasinya](https://nextjs.org/docs/app/api-reference/components/link)
- [Navigasi dan prefetch](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [useRouter dan riwayat browser](https://nextjs.org/docs/app/api-reference/functions/use-router)

::right::

#### Hook dan Tampilan URL

- [usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [useSearchParams dan Suspense](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [React: aturan pemanggilan hook](https://react.dev/reference/rules/rules-of-hooks)
- [React: Suspense dan fallback](https://react.dev/reference/react/Suspense)
- [MDN: menyusun query dengan URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

<!--
Slide referensi, bukan tambahan materi wajib. Dokumentasi daring bisa berubah setelah tanggal audit.
Catatan slide terkait menyimpan sumber tambahan tentang aria-current dan kelas Tailwind.
-->
