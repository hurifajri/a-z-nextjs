---
layout: intro
badge: "MODUL 02"
badgeColor: "cyan"
level: 1
---

## 02. Struktur App Router & Routing

Lanjutkan Toko Belajar dari Modul 01: tambah halaman, gunakan layout bersama, lalu rapikan file pendukungnya.

<!--
Bekal: proyek Modul 01 berjalan, peserta dapat mengedit src/app/page.tsx dan mengenal komponen React serta props.
Target akhir: peserta dapat menerjemahkan folder ke URL, membuat halaman dan nested layout, serta membedakan file halaman dari file pendukung.
Durasi target 60 menit: folder dan halaman 20 menit, layout 20 menit, organisasi file dan checkpoint 20 menit. Route groups dapat menjadi bacaan tambahan bila waktu praktik terbatas.
Jalankan npm run dev dari my-next-app. Gunakan port Local yang dicetak terminal. Semua contoh melanjutkan TypeScript dan src/app/ dari Modul 01.
Batas materi: nama segmen tetap, page.tsx, layout.tsx, dan organisasi file. Dynamic segments, params, Link, dan hook navigasi dimulai di Modul 03; Server/Client Components di Modul 04.
Perbandingan dua router dan optimasi barrel exports dikeluarkan dari materi inti agar peserta berlatih satu pola dahulu. Jika ditanya: Pages Router masih didukung, tetapi latihan ini menggunakan App Router.
Audit sumber daring: 7 Oktober 2026. Mengikuti acuan Next.js 16 pada Modul 01; tidak memerlukan upgrade atau fitur eksperimental.
Sumber status Pages Router: https://nextjs.org/docs/pages
-->

---
class: module-content
---

### Dari Folder ke Alamat Halaman

Rute menghubungkan alamat dengan halaman. Segmen adalah bagian alamat di antara tanda `/`.

```text {1|2|3-4|5-6|7-8|all}
src/app/
├── page.tsx                  → /
├── products/
│   ├── page.tsx              → /products
│   └── promo/
│       └── page.tsx          → /products/promo
└── about/
    └── page.tsx              → /about
```

<BrutalCard v-click class="mt-4">
  📌 Folder biasa membentuk segmen URL. Tambahkan <code>page.tsx</code> agar segmen itu memiliki halaman. Nama <code>src/app</code> dan <code>page.tsx</code> tidak masuk ke URL.
</BrutalCard>

<!--
Ini target struktur, belum semua file ada. Mulai dari beranda hasil Modul 01.
Kondisi awal menyorot src/app. Klik berikutnya: beranda, products, promo, about, lalu seluruh tree. Klik terakhir menampilkan aturan.
Minta peserta menebak alamat sebelum menjelaskan panah. Contoh alamat lengkap: http://localhost:3000/products; /products adalah path-nya.
Folder kosong belum menyediakan halaman. Pengecualian nama folder seperti (group) dan _folder dijelaskan setelah praktik dasar.
Nama segmen pada latihan ini tetap; ini tidak menentukan apakah halaman dirender saat build atau saat request.
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages
-->

---
class: module-content
layout: two-cols
---

### Praktik: Tambah Halaman Produk

Buat file baru `src/app/products/page.tsx` di proyek yang sama.

::left::

```tsx
export default function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Katalog Buku</h1>
      <p>Buku pilihan untuk belajar.</p>
    </main>
  );
}
```

::right::

#### Coba di Browser

<v-clicks>

1. Buat folder **products** di dalam **src/app**.
2. Isi **page.tsx** dengan kode di samping, lalu simpan.
3. Buka **/products** lewat bilah alamat browser.
4. Pastikan “Katalog Buku” tampil dan **/** masih menampilkan beranda.

</v-clicks>

<!--
Beri waktu 3–5 menit untuk praktik. Gunakan alamat Local dari terminal, lalu tambahkan /products.
Nama file harus page.tsx. Nama fungsi ProductsPage membantu pembacaan kode; export default menyediakan komponen halaman.
Tidak perlu mendaftarkan rute dalam file konfigurasi atau mengimpor ProductsPage ke beranda.
Latihan memakai teks tetap. Data buku dan halaman detail mengikuti modul berikutnya.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/page
-->

---
class: module-content
layout: two-cols
---

### Rute Bertingkat: `/products/promo`

Tambahkan folder di dalam folder untuk membuat alamat yang lebih panjang.

::left::

#### Struktur Folder

```text
src/app/products/
├── page.tsx          → /products
└── promo/
    └── page.tsx      → /products/promo
```

Folder **products** dan **promo** menjadi dua segmen URL.

::right::

#### Isi `products/promo/page.tsx`

```tsx
export default function PromoPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Promo Buku</h1>
      <p>Pilihan hemat pekan ini.</p>
    </main>
  );
}
```

::bottom::

<BrutalCard v-click class="text-sm">
  Buka <code>/products/promo</code>. Halaman ini punya isi sendiri; isi <code>products/page.tsx</code> tidak otomatis membungkusnya.
</BrutalCard>

<!--
Beri waktu 3 menit. Minta peserta membandingkan judul pada /products dan /products/promo.
Nested route berarti rute bertingkat. Folder induk tidak wajib memiliki page.tsx agar halaman anak bisa diakses; page.tsx induk hanya diperlukan untuk halaman pada URL induknya sendiri.
Jangan mengimpor PromoPage ke ProductsPage. Berikutnya perkenalkan layout sebagai tempat tampilan yang dipakai bersama.
Sumber: https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-nested-route
-->

---
class: module-content
---

### Root Layout: Kerangka Semua Halaman

Di `src/app/layout.tsx`, tambahkan header dan footer di sekitar `{children}`. Berikut contoh minimalnya.

```tsx {1-4|6-7|8-16|all}
import type { ReactNode } from "react";
import "./globals.css";

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="id">
      <body>
        <header className="border-b p-4">Toko Belajar</header>
        {children}
        <footer className="border-t p-4">Belajar bersama.</footer>
      </body>
    </html>
  );
}
```

<BrutalCard v-click class="mt-4 text-sm">
  <code>page.tsx</code> berisi halaman tertentu; <code>layout.tsx</code> membungkusnya. Next.js mengisi <code>children</code> dengan halaman atau layout di bawahnya.
</BrutalCard>

<!--
Praktik: edit layout yang sudah ada; pertahankan import CSS, pengaturan font, className, dan metadata hasil Modul 01. Cocokkan lang dengan bahasa halaman.
Contoh minimal memperlihatkan posisi header, children, dan footer; peserta tidak perlu menimpa seluruh file hasil generator.
Root layout pada struktur kelas ini berada di src/app/layout.tsx dan wajib memuat html serta body. ReactNode adalah tipe isi yang dapat ditampilkan React.
Tidak menambahkan main di layout ini karena halaman dari Modul 01 dan contoh produk sudah memiliki main; hindari main bersarang.
Buka /, /products, dan /products/promo: header dan footer sama, isi halamannya berbeda. Jika isi hilang, cek children.
Highlight: import/tipe → komponen → susunan HTML → seluruh kode → penjelasan.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout
-->

---
class: module-content
layout: two-cols
---

### Nested Layout: Kerangka Bagian Produk

Buat `src/app/products/layout.tsx` untuk tampilan bersama di bagian produk.

::left::

#### Berlaku untuk Halaman di Bawahnya

```text
src/app/
├── layout.tsx
├── page.tsx
└── products/
    ├── layout.tsx
    ├── page.tsx
    └── promo/
        └── page.tsx
```

Label **Area Katalog** tampil di **/products** dan **/products/promo**.

::right::

```tsx
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="border-t">
      <p className="px-8 pt-4">Area Katalog</p>
      {children}
    </div>
  );
}
```

::bottom::

<BrutalCard v-click class="text-sm">
  Buka juga <code>/</code>: label katalog tidak muncul di beranda. Nested layout ini berada di dalam root layout, sehingga tidak menambahkan <code>html</code> atau <code>body</code> lagi.
</BrutalCard>

<!--
Beri waktu 5 menit untuk menambah file dan mengecek tiga URL. Layout tambahan bersifat opsional; tidak perlu membuat layout di setiap folder.
Nested layout menerima children dengan cara yang sama seperti root layout. Letak file menentukan halaman yang dibungkusnya.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/layout
-->

---
class: module-content
---

### Bagaimana Layout dan Page Disusun?

Saat membuka `/products/promo`, baca susunannya dari luar ke dalam.

```text
RootLayout                         ← src/app/layout.tsx
├── Header: Toko Belajar
├── children: Layout (produk)      ← products/layout.tsx
│   ├── Label: Area Katalog
│   └── children: PromoPage         ← products/promo/page.tsx
│       ├── Judul: Promo Buku
│       └── Deskripsi promo
└── Footer: Belajar bersama.
```

<BrutalCard v-click class="mt-4 bg-yellow-100">
  💡 Pada navigasi sisi klien antarhalaman dengan layout yang sama, layout bersama dipertahankan. Memuat ulang browser membuat dokumen baru. Navigasi sisi klien kita coba di Modul 03.
</BrutalCard>

<!--
Tanyakan: mengapa Katalog Buku dari products/page.tsx tidak muncul di sini? Karena page induk bukan pembungkus halaman anak.
Diagram hanya menunjukkan page dan layout yang sudah dibuat, bukan seluruh komponen internal Next.js.
Jika membahas file opsional: dalam satu segmen, urutan ringkasnya layout → template → error boundary → loading/Suspense → not-found boundary → page atau nested layout. Jangan menempatkan error boundary di dalam loading.
Layout bersama digunakan kembali saat navigasi sisi klien. Ini bukan jaminan setiap komponen anak tidak pernah re-render, atau state tetap ada setelah reload penuh. Keluar dari cabang products juga tidak berarti layout products membungkus semua tujuan lain.
Latihan dengan mengetik alamat menguji hasil komposisi, bukan membuktikan state bertahan. Hindari memakai demo ini sebagai bukti navigasi tanpa reload.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/layout#caveats
Sumber hierarki: https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy
-->

---
class: module-content
layout: two-cols
---

### Kenali File Khusus Sesuai Kebutuhan

Nama tertentu memiliki peran bawaan. Untuk latihan ini, cukup buat page dan layout.

::left::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-yellow bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">page.tsx</span>
    Isi halaman untuk satu rute.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-cyan bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">layout.tsx</span>
    Pembungkus halaman dan layout di bawahnya.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-pink bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">loading.tsx</span>
    Tampilan sementara saat bagian halaman di bawahnya belum siap.
  </div>
</div>

::right::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-green bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">error.tsx</span>
    Tampilan pengganti untuk error rendering pada bagian yang dibungkusnya.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-purple bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">not-found.tsx</span>
    Tampilan saat rute menyatakan konten tidak ditemukan.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-white bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">route.ts</span>
    Penangan permintaan HTTP, misalnya endpoint data.
  </div>
</div>

::bottom::

<BrutalCard v-click class="mt-3 bg-purple-50 text-xs">
  Tidak perlu membuat semua file sekaligus. Nama bawaan harus tepat, misalnya <code>page.tsx</code>, bukan <code>Page.tsx</code>.
</BrutalCard>

<!--
Ini peta pengenalan, bukan tugas mengimplementasikan loading/error/API sekarang.
loading.tsx membuat batas Suspense untuk page dan turunannya, bukan indikator setiap request jaringan. Layout pada segmen yang sama berada di luar batas ini.
error.tsx harus menjadi Client Component dan tidak menangkap error layout pada segmen yang sama. Detail pemulihan mengikuti modul error handling; bukan jaminan seluruh aplikasi kebal error.
not-found.tsx terkait notFound(). Mekanisme 404 global dan status HTTP saat streaming tidak dibahas di sini.
route.ts adalah Route Handler; jangan menaruhnya pada segmen URL yang sama dengan page.tsx. File metadata juga punya konvensi khusus, di luar fokus latihan halaman.
Proxy dan autentikasi ditunda ke modul terkait; tidak diperlukan untuk menambah halaman.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/loading
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/error
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route
-->

---
class: module-content
---

### File Pendukung Boleh Dekat dengan Halaman

Colocation berarti menyimpan file yang berkaitan di tempat yang berdekatan.

````md magic-move
```text
src/app/products/
├── page.tsx             → /products
├── layout.tsx
├── ProductCard.tsx      → komponen pendukung
└── format-price.ts      → fungsi pendukung
```

```text
src/app/products/
├── page.tsx             → /products
├── layout.tsx
├── _components/
│   └── ProductCard.tsx
└── _lib/
    └── format-price.ts
```
````

<BrutalCard v-click class="mt-3">
  <code>ProductCard.tsx</code> tidak otomatis menjadi halaman. Awalan <code>_</code> mengecualikan folder dan turunannya dari routing; ini bukan pengaturan hak akses.
</BrutalCard>

<!--
Diagram pilihan organisasi, bukan daftar file yang wajib dibuat. Komponen dan fungsi pendukung baru digunakan setelah diimpor oleh kode lain.
Klik 1: magic-move dari file berdampingan ke folder pendukung. Klik berikutnya: tampilkan penjelasan.
Private folder bersifat opsional. Bahkan page.tsx di dalam _components tidak menghasilkan rute.
Jangan menyamakan istilah private dengan perlindungan rahasia atau autentikasi. Kode yang diimpor Client Component tetap mengikuti aturan bundling client.
Sumber: https://nextjs.org/docs/app/getting-started/project-structure#colocation
Sumber: https://nextjs.org/docs/app/getting-started/project-structure#private-folders
-->

---
class: module-content
layout: two-cols
---

### Route Groups: Folder yang Tidak Masuk URL

Tambahan: gunakan `(nama)` ketika beberapa rute perlu dikelompokkan.

::left::

```text
src/app/
├── layout.tsx
├── page.tsx                 → /
├── about/page.tsx           → /about
└── (shop)/
    └── products/
        ├── layout.tsx
        ├── page.tsx         → /products
        └── promo/page.tsx   → /products/promo
```

::right::

#### Baca Alamatnya

<v-clicks>

- **(shop)** mengelompokkan file; URL tetap **/products**.
- **products** tetap menjadi segmen karena tidak memakai tanda kurung.
- Grup juga bisa diberi layout untuk halaman dalam grup tersebut.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Jika mencoba struktur ini, <strong>pindahkan</strong> folder products yang lama ke dalam (shop). Dua file halaman tidak boleh menghasilkan URL yang sama.
</BrutalCard>

<!--
Contoh alternatif, bukan prasyarat melanjutkan latihan. Jika belum perlu grup, struktur sebelumnya sudah cukup.
Pertahankan src/app/layout.tsx sebagai satu root layout. Contoh ini tidak memakai multiple root layouts.
(shop) dikeluarkan dari URL, tetapi halaman di dalamnya tetap dapat diakses. Ini berbeda dari _folder yang dikecualikan beserta seluruh turunannya.
Jika ditanya tentang multiple root layouts: perpindahan di antaranya memuat ulang dokumen. Tunda penerapannya agar tujuan praktik tetap jelas.
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
-->

---
class: module-content
layout: two-cols
---

### Bedakan Aturan Next.js dan Kesepakatan Tim

Nama file khusus ditentukan framework; nama file pendukung dapat disepakati bersama.

::left::

#### Aturan yang Dipakai Next.js

<v-clicks>

- **page.tsx** untuk halaman; **layout.tsx** untuk pembungkus.
- Nama folder biasa menjadi segmen: **products**, **about**.
- **(shop)** dan **\_components** memiliki arti khusus dalam routing.

</v-clicks>

::right::

#### Gaya Penamaan Latihan Ini

<v-clicks>

- File komponen: **ProductCard.tsx**. Nama komponennya **ProductCard**.
- File fungsi pendukung: **format-price.ts**. Nama fungsi **formatPrice**.
- Folder biasa memakai huruf kecil; pisahkan kata dengan tanda hubung: **new-arrivals**.

</v-clicks>

::bottom::

<BrutalCard v-click class="mt-3 text-xs">
  Tim lain boleh memakai <code>product-card.tsx</code>. Saat digunakan di JSX, nama komponen tetap diawali huruf besar: <code>&lt;ProductCard /&gt;</code>.
</BrutalCard>

<!--
Tekankan bahwa gaya nama file bukan syarat universal Next.js. Hindari kalimat “tidak ada aturan mutlak” yang dapat membuat peserta mengira Page.tsx bisa menggantikan page.tsx.
Nama fungsi dan variabel biasa menggunakan camelCase dalam contoh kelas; tidak perlu menghafal kategori penamaan tambahan sekarang.
Sumber konvensi framework: https://nextjs.org/docs/app/api-reference/file-conventions/page
Sumber komponen React: https://react.dev/learn/your-first-component
-->

---
class: module-content
---

### Mulai dari Struktur yang Diperlukan

Letakkan file dekat pemakainya; pindahkan ke tempat bersama ketika mulai dipakai beberapa bagian.

<v-switch>
<template #1>

```text
// ProductCard baru dipakai halaman produk
src/app/products/
├── page.tsx
├── layout.tsx
├── ProductCard.tsx
└── promo/
    └── page.tsx
```

Komponen khusus produk mudah ditemukan di samping halamannya.

</template>
<template #2>

```text
// ProductCard mulai dipakai beranda dan halaman produk
src/
├── app/
│   ├── page.tsx
│   └── products/
│       ├── page.tsx
│       └── layout.tsx
└── components/
    └── ProductCard.tsx
```

Komponen bersama boleh berada di **src/components/**. Perbarui import ketika memindahkannya.

</template>
</v-switch>

<!--
Klik 1 dan 2 untuk dua kebutuhan berbeda. Diagram menampilkan sebagian file; promo tetap ada pada proyek.
Ini pedoman kerja untuk kelas, bukan klaim bahwa struktur per fitur selalu lebih scalable daripada struktur per tipe. Next.js tidak mewajibkan satu pola organisasi.
Alias @/* dari Modul 01 menunjuk ke src/*. Jika file dipindah ke src/components, contoh import-nya: import ProductCard from "@/components/ProductCard".
Belum perlu index.ts, barrel exports, atau evaluasi bundling untuk latihan ini.
Sumber: https://nextjs.org/docs/app/getting-started/project-structure#organizing-your-project
-->

---
class: module-content
---

### Latihan Mandiri: Lengkapi Halaman Toko

Gunakan pola page yang sudah dicoba. Tambahkan `/about` dan `/cart`, lalu periksa hasilnya.

| Buka alamat       | Hasil yang harus terlihat                          |
| :---------------- | :------------------------------------------------- |
| `/`               | Beranda hasil Modul 01 + header dan footer bersama |
| `/products`       | Katalog Buku + label Area Katalog                  |
| `/products/promo` | Promo Buku + label Area Katalog                    |
| `/about`          | Judul “Tentang Toko” + header dan footer bersama   |
| `/cart`           | Judul “Keranjang” + teks “Keranjang masih kosong.” |

<BrutalCard v-click class="mt-4 text-sm">
  Berhasil jika kelima alamat dapat dibuka, header/footer muncul di semuanya, dan label <strong>Area Katalog</strong> hanya muncul di bagian products.
</BrutalCard>

<!--
Beri waktu 5–8 menit. Peserta membuat src/app/about/page.tsx dan src/app/cart/page.tsx, masing-masing dengan export default komponen React, main, judul, dan teks sederhana.
Gunakan bilah alamat; Link dan tombol navigasi menyusul di Modul 03. Keranjang masih berupa tampilan, belum ada state atau transaksi.
Minta peserta menjelaskan letak dua page baru sebelum mengetik. Jika mencoba route group, cukup products yang dipindah; URL pemeriksaan tetap sama.
Pertanyaan lanjutan: apakah src/app/products/ProductCard.tsx dapat dibuka sebagai /products/ProductCard? Tidak, file pendukung tidak otomatis menjadi halaman.
Hasil latihan lima URL menjadi titik awal Modul 03. Tidak perlu menambahkan database atau folder untuk tiap buku.
-->

---
class: module-content
layout: two-cols
---

### Kalau Hasilnya Belum Sesuai

Periksa alamat, letak file, lalu susunan komponen.

::left::

#### Alamat Menampilkan 404

- Buka alamat Local dan port yang benar.
- Pastikan nama file **page.tsx**, bukan **products.tsx**.
- Cocokkan folder: **products/promo/page.tsx** untuk **/products/promo**.
- Pastikan halaman tidak berada di folder berawalan **\_**.

::right::

#### Isi atau Layout Tidak Muncul

- Simpan file dan cek pesan terminal.
- Pastikan page mengekspor komponen dengan **export default**.
- Pastikan setiap layout menampilkan **children**.
- Cek letak layout: **products/layout.tsx** hanya membungkus bagian products.

<!--
Jika peserta melihat error konflik URL setelah membuat route group, periksa apakah folder dipindah atau justru disalin.
Jika CSS hilang setelah mengedit root layout, periksa import ./globals.css. Jika error menyebut html/body, periksa root layout.
Bedakan URL tidak ditemukan dengan error kompilasi. Baca pesan error sebelum mengubah struktur lain.
-->

---
class: module-content
---

### Cek Pemahaman: Tebak URL

Baca setiap nama folder sebelum memilih jawaban.

<LearningCheck
  question="Apa URL untuk halaman src/app/(shop)/products/promo/page.tsx?"
  :options="[
    '/shop/products/promo',
    '/products/promo',
    '/products/promo/page',
  ]"
  :answer="1"
  explanation="(shop) adalah route group, sehingga tidak menjadi segmen URL. products dan promo menjadi segmen; page.tsx menyediakan halamannya."
/>

<!--
Minta peserta memberi alasan dahulu. Pilih jawaban untuk melihat umpan balik; tombol ulangi memungkinkan peserta mencoba lagi.
Lanjutkan secara lisan: layout mana saja yang membungkus halaman ini? Root layout dan products/layout.tsx pada struktur contoh.
Apa yang terjadi jika (shop) diganti _shop? Seluruh isi folder dikecualikan dari routing.
Jika waktu terbatas dan slide route group dilewati, gunakan checkpoint lima URL sebagai penilaian inti dan jadikan kuis ini pengayaan.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 02

<v-clicks>

1. **Folder + Page**: Folder biasa membentuk alamat; `page.tsx` menyediakan halamannya.
2. **Layout Membungkus**: Letakkan tampilan bersama di `layout.tsx` dan tampilkan isi melalui `children`.
3. **Rapikan Sesuai Kebutuhan**: File pendukung boleh dekat halaman; pahami perbedaan `(group)` dan `_folder`.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 03:</strong> Buat alamat detail untuk banyak produk dan berpindah halaman melalui Link serta hook navigasi.
</BrutalCard>

<!--
Checkpoint akhir: peserta mampu menunjukkan lima URL latihan dan menjelaskan perbedaan page dengan layout.
Jembatan ke pertanyaan pembuka Modul 03: jika katalog berisi 1.000 produk, bagaimana menyediakan halaman detail tanpa membuat 1.000 folder?
Berhenti pada kebutuhan tersebut; contoh [id], params, catch-all, Link, dan useRouter tetap di Modul 03.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada 7 Oktober 2026; buka sesuai kebutuhan latihan.

::left::

#### Halaman dan Layout

- [Membuat halaman dan layout](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Aturan file page](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- [Aturan dan batas perilaku layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [Struktur proyek dan file pendukung](https://nextjs.org/docs/app/getting-started/project-structure)
- [Route groups dan konflik URL](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

::right::

#### File yang Baru Dikenalkan

- [Loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Batas penanganan error](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Tampilan konten tidak ditemukan](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [React: penamaan komponen](https://react.dev/learn/your-first-component)

<!--
Referensi, bukan tambahan materi wajib. Dokumentasi daring dapat berubah setelah tanggal audit.
Sumber ditempel juga pada catatan slide terkait agar instruktur dapat memeriksa cakupan klaim, bukan hanya judul halaman referensi.
-->
