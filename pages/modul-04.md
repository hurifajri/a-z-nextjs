---
layout: intro
badge: "MODUL 04"
badgeColor: "yellow"
level: 1
---

## 04. Server Components vs Client Components

Lanjutkan Toko Belajar: tentukan bagian yang bekerja di server, tambahkan tombol di browser, dan hubungkan keduanya lewat props.

<!--
Bekal: halaman detail [id], Navbar, SearchForm, dan QueryLabel dari Modul 03 sudah berjalan.
Target akhir: peserta mempertahankan page detail sebagai Server Component, membuat tombol client, serta menjelaskan batas import dan props dengan contoh sendiri.
Durasi target 45–60 menit: peran dan praktik 20 menit, cara kerja dan batas 15 menit, latihan serta diskusi 10–25 menit. Dua slide children adalah pengayaan.
Semua path mengikuti src/app/ dari Modul 01. Jika memakai route group Modul 02, lokasi products menjadi src/app/(shop)/products; URL dan import relatif tetap sama.
Acuan: Next.js 16 dengan konfigurasi kelas Modul 01, tanpa mengaktifkan Cache Components. Tidak perlu mengganti versi atau konfigurasi.
Contoh hanya membaca ID dari URL dan menampilkannya dalam dialog browser. Tidak ada database atau penambahan barang ke keranjang.
Modul ini membahas tempat menjalankan kode. Cara menyimpan dan memperbarui state, useEffect, serta berbagi state dimulai di Modul 05.
Audit sumber daring: 8 Oktober 2026. Versi acuan kelas bukan klaim versi terbaru.
-->

---
class: module-content
---

### Mengapa Kode Modul 03 Berbeda?

Dalam satu halaman, komponen dapat memiliki tugas yang berbeda.

<v-switch>
<template #1>

#### Halaman detail menyiapkan isi

- `ProductPage` membaca `await params`, lalu menampilkan ID buku.
- Page dan layout App Router adalah **Server Components secara default**.
- Fungsi komponen server boleh `async`; kode fungsinya tidak dijalankan di browser.

</template>
<template #2>

#### Menu dan form merespons pengunjung

- `Navbar` membaca path dengan `usePathname`.
- `SearchForm` menangani submit; `QueryLabel` membaca query lewat hook.
- Ketiganya memakai **Client Components**; JavaScript-nya juga berjalan di browser.

</template>
</v-switch>

<!--
Mulai dari pertanyaan penutup Modul 03, bukan perbandingan sejarah SPA dan Pages Router.
Server Component dapat menghasilkan tampilan yang berubah mengikuti data atau URL. Istilah server tidak berarti isi selalu statis.
Server Components bisa berjalan saat build atau saat request, sesuai cara route dirender. Detail cache dan waktu rendering berada di modul berikutnya.
Komponen async tidak otomatis berarti fetch ke database. Di latihan sebelumnya, yang ditunggu hanya params.
Sumber: https://react.dev/reference/rsc/server-components
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
layout: two-cols
---

### Pilih Berdasarkan Kebutuhan Kode

Mulai dari server, lalu tentukan bagian yang memerlukan kemampuan client.

::left::

#### 🖥️ Server Component

<v-clicks>

- Menyusun isi halaman dan layout.
- Membaca data atau sumber khusus server.
- Dapat memakai `async/await` saat render.
- Tidak memakai `useState`, `useEffect`, atau handler seperti `onClick`.

</v-clicks>

::right::

#### 💻 Client Component

<v-clicks>

- Menangani `onClick` dan `onChange`.
- Memakai hook navigasi dari Modul 03.
- Memakai state dan Effect: **Modul 05**.
- Mengakses API browser pada waktu yang tepat, misalnya saat klik.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Satu halaman boleh menggabungkan keduanya. Memasang komponen client di dalam page tidak mengharuskan seluruh page menjadi client.
</BrutalCard>

<!--
Render berarti React menghitung tampilan yang perlu ditampilkan.
Hindari aturan semua hook butuh client: ada API React yang didukung di server. Sebutkan hook yang relevan untuk kelas ini secara khusus.
Akses database dengan kredensial privat berada di server. Client tetap dapat meminta data melalui antarmuka yang memang aman untuk browser; implementasinya belum dibahas.
Tidak menjanjikan bahwa semua Server Component pasti lebih cepat atau otomatis aman.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components
-->

---
class: module-content
---

### Praktik: Dari Teks ke Tombol

Buat `src/app/products/[id]/BookNotice.tsx`. Perhatikan perubahan, lalu gunakan versi akhir.

````md magic-move
```tsx
type Props = { id: string };

export default function BookNotice({ id }: Props) {
  return <p>ID buku: {id}</p>;
}
```

```tsx
"use client";

type Props = { id: string };

export default function BookNotice({ id }: Props) {
  function showId() {
    window.alert("ID buku: " + id);
  }

  return (
    <button type="button" onClick={showId}>
      Lihat ID buku
    </button>
  );
}
```
````

<v-clicks>

- `"use client"` diletakkan di awal file, sebelum import.
- `onClick={showId}` menjalankan fungsi **saat diklik**.
- `id` adalah props dari page; tombol menampilkannya dalam dialog.

</v-clicks>

<!--
Versi pertama dapat dipakai sebagai Server Component jika diimpor oleh page server. Versi akhir menjadi batas client karena memiliki event handler.
Beri waktu untuk menyalin versi akhir. File dibuat di sebelah page.tsx, bukan menggantikan page.tsx.
window.alert dipakai sebagai demonstrasi event yang sederhana, bukan pola notifikasi aplikasi produksi.
onClick menerima fungsi showId, bukan hasil showId(). Fungsi komponen menghitung JSX; fungsi handler baru dipanggil setelah klik.
Tidak perlu useState untuk sekadar menjalankan tindakan ini. Perubahan tampilan akibat state dipelajari di Modul 05.
Sumber: https://nextjs.org/docs/app/api-reference/directives/use-client
Sumber: https://react.dev/learn/responding-to-events
-->

---
class: module-content
---

### Praktik: Pasang Tombol di Halaman Detail

Perbarui `src/app/products/[id]/page.tsx` dari Modul 03.

```tsx {1|3-8|14|all}
import BookNotice from "./BookNotice";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-8">
      <h1 className="text-3xl">Detail Buku</h1>
      <p>ID buku: {id}</p>
      <BookNotice id={id} />
    </main>
  );
}
```

<BrutalCard v-click class="mt-3 text-sm">
  Buka <code>/products/buku-react</code>, lalu klik <strong>Lihat ID buku</strong>. Dialog menampilkan <code>ID buku: buku-react</code>.
</BrutalCard>

<!--
Page tetap tanpa use client, sehingga pola async dan await params dari Modul 03 tetap berlaku.
Server Component boleh mengimpor dan menampilkan Client Component. Yang dikirim ke BookNotice adalah nilai id berupa string.
Coba juga /products/buku-next; hasil dialog harus mengikuti ID halaman yang sedang dibuka.
ID sembarang tetap ditampilkan karena validasi keberadaan buku belum dibuat.
Sumber: https://nextjs.org/docs/app/api-reference/directives/use-client#nesting-client-components-within-server-components
Sumber: https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional
-->

---
class: module-content
---

### Saat Halaman Pertama Kali Dibuka

Pada kunjungan langsung atau reload, Client Component juga dapat menghasilkan HTML di server.

<v-clicks>

1. **Next.js menyiapkan tampilan awal.** HTML mencakup judul, ID, dan tombol.
2. **Browser menampilkan HTML.** React juga menerima hasil render server dan props melalui data bernama **RSC Payload**.
3. **React mengaktifkan logika client.** Proses **hydration** menghubungkan HTML awal dengan logika seperti handler tombol.

</v-clicks>

<BrutalCard v-click class="mt-5 bg-yellow-100">
  Pada latihan, <code>window.alert</code> berada di dalam <code>showId</code> dan dipanggil saat klik. Mengakses <code>window</code> langsung saat render dapat gagal karena render awal juga berjalan di server.
</BrutalCard>

<!--
use client tidak mematikan rendering HTML di server. Nama Client Component menunjukkan bahwa kodenya juga perlu berjalan di browser.
Perilaku bawaan HTML dapat bekerja sebelum hydration; yang belum aktif adalah logika React seperti handler showId.
Saat navigasi melalui Link, Next.js dapat memakai RSC Payload tanpa meminta dokumen HTML baru. Mekanisme internal payload tidak perlu dihafal.
Hasil render awal server dan browser harus cocok. Contoh ini tidak memakai nilai acak atau pembacaan browser saat render.
Next.js mengurus hydration; peserta tidak perlu memanggil hydrateRoot sendiri.
Sumber: https://nextjs.org/docs/app/guides/server-and-client-boundary#rendering-environments
Sumber: https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html
-->

---
class: module-content
---

### Batas Client Mengikuti Import

`"use client"` menandai awal kumpulan kode yang perlu tersedia di browser.

```text {1|2|3|all}
page.tsx                                  Server Component
└── import BookNotice.tsx                 Batas: "use client"
    └── komponen/helper yang diimpornya   Ikut masuk sisi client
```

<v-clicks>

- Batas berlaku ke **import dan import turunannya**.
- File dalam rantai import client tidak wajib mengulang directive.
- Page yang mengimpor `BookNotice` tetap server.
- Nama folder atau ketiadaan directive saja belum cukup untuk menentukan peran komponen.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Pilih batas yang dekat dengan kebutuhan interaksi. Memberi <code>"use client"</code> pada komponen besar dapat ikut membawa lebih banyak kode ke browser.
</BrutalCard>

<!--
Diagram menjelaskan hubungan import, bukan struktur folder atau semua hubungan parent/child dalam JSX.
Baris helper adalah ilustrasi jika BookNotice nanti mengimpor modul lain; tidak ada file helper tambahan yang perlu dibuat.
Modul yang kompatibel dengan kedua lingkungan dapat digunakan dari server maupun client dan dikompilasi untuk masing-masing lingkungan.
Import type hanya untuk TypeScript dan dihapus saat kompilasi; aturan ini membahas import kode saat aplikasi berjalan.
Komponen server yang dikirim melalui props/children berbeda dari modul yang diimpor langsung; contoh menyusul.
Jangan memindahkan kode khusus server ke rantai import client.
Sumber: https://react.dev/reference/rsc/use-client#how-use-client-marks-client-code
Sumber: https://nextjs.org/docs/app/api-reference/directives/use-client
-->

---
class: module-content
---

### Props: Kirim Data yang Dibutuhkan Tombol

Data dari server ke client harus bisa **dikemas dan dibaca kembali oleh React**: disebut serializable.

```tsx
<BookNotice id={id} />
```

| Nilai yang ingin dikirim                  | Cara menyikapinya                               |
| ----------------------------------------- | ----------------------------------------------- |
| ID seperti `"buku-react"`                 | Bisa; tombol menerima string                    |
| Angka, boolean, array, objek sederhana    | Bisa jika nilai di dalamnya juga didukung React |
| Fungsi event biasa yang dibuat di page    | Buat fungsi itu di komponen client              |
| Kunci API privat atau kata sandi database | Tetap di server; jangan jadikan props           |

<BrutalCard v-click class="mt-4 text-sm">
  Alurnya: <strong>page membaca ID → props membawa ID → tombol memakai ID saat klik</strong>.
</BrutalCard>

<!--
Fokuskan serialisasi pada contoh string yang sudah dipahami. React mendukung lebih banyak tipe daripada JSON, termasuk Date, Map, Set, JSX, dan tipe lain yang didokumentasikan.
Jangan menyederhanakan aturan menjadi hanya JSON atau semua fungsi dilarang. Server Functions memiliki mekanisme referensi tersendiri dan dibahas pada modul terkait.
Fungsi event biasa tetap dapat dikirim antarkomponen yang sama-sama berada di sisi client. Pembatasan slide ini untuk perpindahan dari server ke client.
Secret dapat berupa string yang serializable tetapi tetap tidak boleh dikirim. Dukungan tipe dan izin membagikan data adalah dua pertimbangan berbeda.
Sumber: https://react.dev/reference/rsc/use-client#serializable-types-returned-by-server-components
Sumber: https://nextjs.org/docs/app/guides/data-security
-->

---
class: module-content
---

### Pilih Data yang Boleh Sampai ke Browser

Kode Server Component tetap di server. Hasil yang ditampilkan dan props client dapat dibaca pengunjung.

| Bagian                                                     | Sampai ke browser?              |
| ---------------------------------------------------------- | ------------------------------- |
| Implementasi fungsi `ProductPage` sebagai Server Component | Kode komponen ini tidak dikirim |
| Teks `ID buku: buku-react` yang ditampilkan                | Ya, sebagai hasil render        |
| Props `id` untuk `BookNotice`                              | Ya, dibutuhkan kode client      |

<v-clicks>

- Kirim hanya data yang diperlukan dan boleh dilihat pengunjung.
- Gunakan rahasia seperti kunci API privat di kode server.
- Awalan `NEXT_PUBLIC_` membuat variabel tersedia bagi kode browser.

</v-clicks>

<!--
Tidak perlu menyiapkan environment variable atau database pada latihan ini. Contoh ID adalah data publik yang sudah ada di URL.
Server Component bukan pengganti pemeriksaan izin akses. HTML, RSC Payload, dan props bukan tempat menyembunyikan rahasia.
Pengayaan pengajar: import "server-only" pada modul khusus server memberi error build jika modul tersebut masuk import client. Guard ini tidak memeriksa apakah data yang sengaja dikirim lewat props aman.
Jangan menambahkan NEXT_PUBLIC_ ke secret untuk mengatasi nilai yang tidak tersedia di browser.
Sumber: https://nextjs.org/docs/app/guides/data-security
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning
Sumber: https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
-->

---
class: module-content
---

### Pengayaan: Sediakan Tempat untuk Isi

Perbarui `BookNotice.tsx` agar menerima `children`, seperti layout pada Modul 02.

```tsx {3-4|12-14|all}
"use client";

import type { ReactNode } from "react";
type Props = { id: string; children?: ReactNode };

export default function BookNotice({ id, children }: Props) {
  function showId() {
    window.alert("ID buku: " + id);
  }

  return (
    <section className="space-y-3">
      {children}
      <button type="button" onClick={showId}>
        Lihat ID buku
      </button>
    </section>
  );
}
```

<!--
Dua slide pengayaan ini boleh menjadi demonstrasi pengajar. Latihan utama tetap berjalan bila peserta melewatinya.
BookNotice tetap client karena memiliki event handler. children hanya menyediakan tempat untuk konten yang diberikan pemanggil.
Tanda tanya membuat children opsional, sehingga pemakaian sebelumnya yang hanya mengirim id tetap valid.
Tidak ada import komponen server di BookNotice; isi akan disusun oleh page pada slide berikutnya.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components
-->

---
class: module-content
---

### Pengayaan: Susun Isinya dari Page Server

Di `src/app/products/[id]/page.tsx`, tempatkan isi di antara tag `BookNotice`.

```tsx {1|11-14|all}
import BookNotice from "./BookNotice";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="p-8">
      <BookNotice id={id}>
        <h1 className="text-3xl">Detail Buku</h1>
        <p>ID buku: {id}</p>
      </BookNotice>
    </main>
  );
}
```

<BrutalCard v-click class="mt-3 text-sm">
  Isi disusun oleh page server, lalu diterima sebagai <code>children</code>. Membungkusnya dengan komponen client tidak memindahkan kode page ke browser.
</BrutalCard>

<!--
Bandingkan dua jalur: import membawa kode ke lingkungan client, sedangkan props/children membawa data atau hasil render yang didukung React.
Pada contoh ini children berisi elemen h1 dan p yang dibuat page. Jika page merender komponen server lain di posisi ini, implementasi komponen itu juga tetap di server.
children bukan selalu Server Component; asal kontennya bergantung pada komponen yang menyusunnya. Hindari klaim bahwa semua children otomatis server.
BookNotice menerima hasil tersebut sebagai props; ia tidak menjalankan fungsi ProductPage di browser.
Sumber: https://nextjs.org/docs/app/guides/server-and-client-boundary#crossing-the-boundary
-->

---
class: module-content
---

### Interaksi Bawaan HTML Juga Bisa Dipakai

Elemen `details` dapat dibuka dan ditutup oleh browser, tanpa handler React.

```tsx
export default function BookTips() {
  return (
    <details>
      <summary>Cara membaca ID buku</summary>
      <p>ID ada pada bagian terakhir URL detail.</p>
    </details>
  );
}
```

<BrutalCard class="mt-4">
  <details>
    <summary class="cursor-pointer font-bold">Coba buka: Cara membaca ID buku</summary>
    <p>ID ada pada bagian terakhir URL detail.</p>
  </details>
</BrutalCard>

<p v-click class="mt-4">
  Gunakan kebutuhan <strong>kode</strong> sebagai patokan. Hover CSS dan interaksi HTML bawaan tidak otomatis memerlukan <code>"use client"</code>.
</p>

<!--
Klik demo pada slide. BookTips adalah contoh terpisah untuk dibaca, bukan file wajib pada latihan.
Jika BookTips diimpor page server, ia dapat menjadi Server Component. Tidak ada useState atau handler React dalam contoh.
Link juga bisa dipakai dari page server sebagaimana Modul 03: menggunakan komponen client dari pustaka tidak membuat pemanggilnya harus diberi directive.
Form yang memakai handler React pada Modul 03 memang membutuhkan sisi client; form HTML memiliki kemampuan bawaan yang berbeda.
Sumber: https://nextjs.org/docs/app/guides/server-and-client-boundary#state-and-interactivity
Sumber: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
-->

---
class: module-content
---

### Latihan: Jelaskan Batas dengan Kode Sendiri

Lanjutkan halaman detail Toko Belajar. Waktu: **10–15 menit**.

<v-clicks>

1. Buat `BookNotice.tsx` versi tombol; page mengirim `id` melalui props.
2. Buka `/products/buku-react` dan `/products/buku-next`. Cocokkan isi dialog dengan ID di halaman.
3. Reload salah satu halaman, lalu coba tombol lagi setelah halaman siap.
4. Tunjukkan kepada teman: letak directive, asal `id`, dan waktu `showId` dijalankan.

</v-clicks>

<BrutalCard v-click class="mt-5 bg-yellow-100">
  <strong>Selesai bila:</strong> kedua ID tampil benar, tombol bekerja, dan page tetap memakai <code>async</code> tanpa <code>"use client"</code>. Periksa terminal serta console browser.
</BrutalCard>

<!--
Latihan utama hanya mengubah page detail dan menambahkan BookNotice. Root layout, Navbar, SearchForm, QueryLabel, serta Suspense dari Modul 03 tetap digunakan.
Peserta yang mengerjakan pengayaan dapat memakai versi children; hasil dialog sama.
Pertanyaan diskusi: apakah memindahkan file ke src/components otomatis menjadikannya client? Tidak, peran ditentukan oleh batas dan hubungan import.
Bila waktu cukup, jalankan npm run build dari proyek Next.js kelas. Keberhasilan dev saja belum menjamin build, termasuk aturan Suspense pada QueryLabel Modul 03.
Tombol tidak memperbarui tampilan halaman. Kebutuhan itu menjadi pertanyaan pembuka Modul 05.
-->

---
class: module-content
---

### Jika Hasilnya Belum Sesuai

Mulai dari pesan error dan file yang disebutkan.

| Gejala                                         | Periksa dan perbaiki                                            |
| ---------------------------------------------- | --------------------------------------------------------------- |
| Handler `onClick` ditolak pada komponen server | Letakkan handler di `BookNotice`, dengan directive di awal file |
| `window is not defined`                        | Panggil API browser dalam handler; jangan panggil saat render   |
| Dialog muncul tanpa klik                       | Gunakan `onClick={showId}`, bukan `onClick={showId()}`          |
| Komponen client `async` ditolak                | Page tetap server; pisahkan tombol client                       |
| Fungsi biasa tidak bisa dikirim sebagai props  | Kirim `id`; buat `showId` di komponen client                    |
| Modul khusus server ikut terimpor client       | Periksa rantai import; pertahankan kode itu di server           |

<!--
Ini gejala dan arah pemeriksaan, bukan kutipan pasti pesan error. Wording error bisa berubah antarversi.
Jika hydration mismatch terjadi, bandingkan hasil render awal server dan browser; jangan langsung menyembunyikan peringatannya.
Directive bukan perbaikan untuk semua error. Jangan memberi use client pada page async demi memperbaiki satu tombol.
API browser yang harus menyinkronkan tampilan setelah render dapat melibatkan Effect; tunggu Modul 05 untuk pola itu.
Sumber: https://nextjs.org/docs/messages/no-async-client-component
Sumber: https://react.dev/learn/responding-to-events
Sumber: https://react.dev/reference/react-dom/client/hydrateRoot
-->

---
class: module-content
---

### Prediksi: Di Mana Batas Client?

<LearningCheck
  question="ProductPage memakai await params. BookNotice perlu onClick untuk menampilkan ID. File mana yang diberi use client?"
  :options='["page.tsx saja agar semua anaknya ikut client", "BookNotice.tsx; page tetap server dan mengirim id", "Keduanya, karena berada di folder yang sama"]'
  :answer="1"
  explanation="BookNotice memerlukan handler di browser. Page tetap async di server dan mengirim id berupa string. Lokasi folder tidak menentukan batas client."
/>

<!--
Beri 30 detik untuk prediksi pribadi sebelum memilih jawaban.
Minta peserta menjelaskan alur id dan alasan page tidak perlu diubah menjadi client.
Gunakan Ulangi prediksi untuk kelompok berikutnya.
Pertanyaan lanjut lisan: apakah komponen client tidak pernah dirender di server? Ia juga dapat menghasilkan HTML awal di server.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 04

<v-clicks>

1. **Mulai dari Server**: Page menyusun isi; komponen client menangani kebutuhan seperti event dan hook navigasi.
2. **Batas Mengikuti Import**: Directive menandai awal kode client. Page tetap server saat menampilkan tombol client.
3. **Pilih Props dengan Sengaja**: Kirim data yang didukung React dan boleh diterima browser. API browser dipanggil pada waktu yang sesuai.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-yellow/10">
  🚀 <strong>Selanjutnya di Modul 05:</strong> Bagaimana jumlah atau status di halaman ikut berubah setelah tombol diklik? Kita mulai menyimpan dan memperbarui nilai dengan state.
</BrutalCard>

<!--
Peserta siap lanjut bila dapat menjelaskan dua file latihan dan mengapa window hanya dipanggil setelah klik.
Berhenti pada kebutuhan memperbarui tampilan. Anatomi useState, pembaruan objek/array, useEffect, dan berbagi state dimulai di Modul 05.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi yang diperiksa pada **8 Oktober 2026**; contoh mengikuti acuan Next.js 16 kelas.

::left::

#### Server, Client, dan Props

- [Next.js: Server dan Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: batas server dan client](https://nextjs.org/docs/app/guides/server-and-client-boundary)
- [Next.js: directive use client](https://nextjs.org/docs/app/api-reference/directives/use-client)
- [React: Server Components dan async](https://react.dev/reference/rsc/server-components)
- [React: use client dan tipe props](https://react.dev/reference/rsc/use-client)

::right::

#### Event, HTML, dan Data

- [React: menjalankan event handler](https://react.dev/learn/responding-to-events)
- [React: hydration dan kecocokan HTML](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next.js: keamanan data](https://nextjs.org/docs/app/guides/data-security)
- [MDN: perilaku elemen details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)

<!--
Slide referensi, bukan tambahan materi wajib. Dokumentasi daring dapat berubah setelah tanggal audit.
Rujukan tambahan untuk error async, environment variable, dan params ada di catatan slide yang bersangkutan.
-->
