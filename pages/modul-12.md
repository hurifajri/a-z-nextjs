---
layout: intro
badge: "MODUL 12"
badgeColor: "cyan"
level: 1
---

## 12. Merapikan UI Toko Belajar

Membuat daftar usulan buku lebih mudah dibaca dan digunakan dengan tata letak responsif, shadcn/ui, dan interaksi keyboard.

<!--
Lanjutan Modul 11: /suggestions sudah menjalankan CRUD usulan buku di SQLite.
Kerjakan di proyek Next.js Toko Belajar yang sama. Acuan: Next.js 16.3.7, React 19, Node.js 24 LTS, Tailwind CSS v4, src/app, alias @/* ke src/*.
BookSuggestionSchema, API, database, serta hook mutasi Modul 11 menjadi fondasi latihan UI ini.
Cache Components dan Partial Prefetching tetap nonaktif. Pertahankan QueryProvider, CartProvider, dan Navbar pada root layout.
Audit sumber: 9 Oktober 2026. Modul 13 melanjutkan dokumentasi dan kontrak API usulan buku dengan OpenAPI.
-->

---
class: module-content
---

### Dari CRUD yang Berjalan ke UI yang Nyaman

Kita melanjutkan halaman **/suggestions** di **Toko Belajar**.

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
  <BrutalCard v-click>
    <strong>Sudah Ada</strong><br/>
    Form judul dan alasan, daftar usulan, serta tombol Edit dan Hapus.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>Dikerjakan Sekarang</strong><br/>
    Kartu usulan, tombol yang konsisten, susunan responsif, dan dialog panduan.
  </BrutalCard>
  <BrutalCard v-click>
    <strong>Bukti Selesai</strong><br/>
    CRUD tetap berjalan; konten terbaca di layar kecil dan dialog dapat dipakai dengan keyboard.
  </BrutalCard>
</div>

<v-clicks>

- Data tetap memakai `id`, `title`, dan `reason` dari modul 11.
- Form tambah dan edit tetap menggunakan `SuggestionForm` yang sama.
- Pencarian dan pagination lokal di akhir modul adalah **pengayaan**.

</v-clicks>

<!--
Bandingkan halaman hasil Modul 11 dengan hasil akhir praktik pada URL yang sama.
Usulan buku milik Toko Belajar tetap terpisah dari katalog Open Library pada modul 07–08.
-->

---
class: module-content
---

### Pilih Bentuk Tampilan Berdasarkan Isi

Usulan kita berisi **judul buku dan alasan**, yang panjangnya dapat berbeda.

<v-switch>
<template #1>

#### Tabel: Membandingkan Kolom Antarbaris

| Judul buku          | Alasan usulan                     |
| ------------------- | --------------------------------- |
| Learning React      | Untuk latihan komponen React.     |
| Eloquent JavaScript | Untuk mendalami dasar JavaScript. |

- Cocok untuk membandingkan informasi yang seragam.
- Gunakan `caption`, header `th` dengan `scope`, dan pembungkus yang bisa digulir bila tabel lebar.
- Hindari mengecilkan teks hanya agar semua kolom masuk.

</template>
<template #2>

#### Kartu: Membaca Satu Usulan Beserta Aksinya

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">
  <BrutalCard>
    <strong>Learning React</strong>
    <p>Untuk latihan komponen React.</p>
    <p class="mt-2">Edit · Hapus</p>
  </BrutalCard>
  <BrutalCard>
    <strong>Eloquent JavaScript</strong>
    <p>Untuk mendalami dasar JavaScript.</p>
    <p class="mt-2">Edit · Hapus</p>
  </BrutalCard>
</div>

**Pilihan latihan:** kartu usulan, karena alasan perlu ruang untuk dibaca.

</template>
</v-switch>

<!--
Kartu di slide ini adalah ilustrasi, bukan tombol aplikasi yang dapat diklik.
Tabel dan kartu dipilih berdasarkan tugas pengguna serta isi data, bukan semata jenis perangkat.
Praktik berikut memakai Card shadcn/ui dengan data dan aksi SuggestionItem.
Sumber: https://www.w3.org/WAI/tutorials/tables/
-->

---
class: module-content
layout: two-cols
---

### Baca Desain Sebelum Menulis Class

Figma membantu melihat ukuran dan susunan; perilaku UI juga perlu ditentukan.

::left::

#### Catat dari Desain

<v-clicks>

- Urutan judul halaman, form, dan daftar.
- Jarak antarelemen dan batas lebar konten.
- Gaya tombol utama serta aksi sekunder.
- Warna, teks, dan variasi komponen.

</v-clicks>

Di Figma, periksa properti dan variabel melalui panel inspeksi yang tersedia pada akses file Anda.

::right::

#### Lengkapi dengan Skenario Nyata

| Keadaan              | Keputusan UI                         |
| -------------------- | ------------------------------------ |
| Judul sangat panjang | Teks membungkus, kartu tidak melebar |
| Belum ada usulan     | Pesan kosong memberi langkah berikut |
| Sedang menyimpan     | Tombol nonaktif dengan label status  |
| Penyimpanan gagal    | Pesan terlihat; input tetap tersedia |

::bottom::

<BrutalCard v-click class="text-sm">
  Sketsa di kertas juga cukup untuk latihan. Terjemahkan ukuran dan pola yang berulang menjadi komponen.
</BrutalCard>

<!--
Fitur panel Figma/Dev Mode bergantung pada akses dan pengaturan file. Langganan Figma bukan prasyarat latihan.
Potongan CSS desain adalah acuan; responsivitas, semantik HTML, dan state aplikasi tetap perlu diimplementasikan.
Sumber: https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting
-->

---
class: module-content
---

### Gunakan Pendekatan Styling yang Sudah Dikenal

Proyek Toko Belajar sudah memakai **Tailwind CSS v4**.

| Pendekatan  | Kegunaan                               | Hal yang diperiksa               |
| ----------- | -------------------------------------- | -------------------------------- |
| CSS biasa   | Aturan global dan kontrol CSS langsung | Penamaan dan efek antarhalaman   |
| CSS Modules | Class dengan cakupan lokal             | Nilai dan komponen bersama       |
| Tailwind    | Menyusun tampilan lewat utility        | Class utuh yang terdeteksi build |
| CSS-in-JS   | Styling melalui API library            | Dukungan SSR, streaming, dan RSC |

<v-clicks>

- Praktik ini melanjutkan Tailwind dan komponen React yang sudah ada.
- Pilih pola warna, jarak, dan ukuran agar tampilan konsisten.
- Komponen yang memakai state browser tetap memerlukan batas client.

</v-clicks>

<!--
CSS Modules memberikan scoped class names; CSS biasa tidak otomatis memiliki cakupan lokal.
CSS-in-JS mencakup runtime dan ekstraksi saat build. Periksa dukungan framework pada library yang dipilih.
Class Tailwind harus utuh dan dapat ditemukan scanner; jangan merakit nama class dari potongan string dinamis.
Sumber: https://nextjs.org/docs/app/getting-started/css
Sumber: https://nextjs.org/docs/app/guides/css-in-js
Sumber: https://tailwindcss.com/docs/detecting-classes-in-source-files
-->

---
class: module-content
layout: two-cols
---

### Responsif: Mulai dari Ruang yang Sempit

Utility tanpa prefix berlaku pada semua ukuran. Prefix breakpoint mulai berlaku pada lebar tertentu.

::left::

#### Breakpoint Bawaan Tailwind

| Prefix | Lebar minimum  |
| ------ | -------------- |
| `sm:`  | 40rem ≈ 640px  |
| `md:`  | 48rem ≈ 768px  |
| `lg:`  | 64rem ≈ 1024px |
| `xl:`  | 80rem ≈ 1280px |
| `2xl:` | 96rem ≈ 1536px |

Acuan konversi px: ukuran font 16px.

::right::

#### Susunan Daftar Latihan

```text
grid grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-4
```

- Dasar: satu kolom.
- Mulai `md`: dua kolom.
- Mulai `xl`: tiga kolom.

::bottom::

<BrutalCard v-click class="text-sm">
  <code>sm:</code> tidak berarti “khusus ponsel”. Breakpoint menyatakan lebar viewport, bukan jenis perangkat.
</BrutalCard>

<!--
Class di kanan ditulis bersama dalam className ul pada praktik halaman.
Angka di sini adalah breakpoint bawaan Tailwind v4; nilainya dapat dikustomisasi.
Uji juga lebar di antara breakpoint dan isi yang panjang.
Sumber: https://tailwindcss.com/docs/responsive-design
-->

---
class: module-content
---

### Memahami Pilihan Komponen UI

Tiga pendekatan yang dapat dipakai sesuai kebutuhan proyek:

| Pendekatan                    | Yang diperoleh                  | Tanggung jawab tim                    |
| ----------------------------- | ------------------------------- | ------------------------------------- |
| MUI dan library sejenis       | Komponen dengan tampilan bawaan | Tema dan integrasi framework          |
| Radix UI, Base UI, React Aria | Fondasi perilaku interaktif     | Tampilan dan komposisi                |
| shadcn/ui                     | Source komponen di dalam proyek | Kode, dependency, dan perubahan lokal |

<v-clicks>

- Latihan memakai **shadcn/ui dengan basis Radix**.
- Basis lain memiliki API komposisi yang berbeda.
- Source dapat diedit, tetapi perubahan tetap perlu diperiksa.

</v-clicks>

<!--
shadcn/ui tetap memiliki dependency yang dipasang CLI. Memiliki source juga berarti memelihara modifikasi dan pembaruan.
Ini satu jalur praktik, bukan peringkat kualitas library. Contoh asChild berikut khusus basis Radix.
Sumber: https://ui.shadcn.com/docs
Sumber: https://ui.shadcn.com/docs/cli
Sumber: https://mui.com/material-ui/getting-started/
-->

---
class: module-content
---

### Komponen Interaktif Perlu Mengelola Fokus

Contoh: pengguna membuka dialog **Panduan usulan**.

<v-clicks>

1. Tombol pemicu dapat dijangkau dan diaktifkan dengan keyboard.
2. Setelah terbuka, fokus berpindah ke dalam dialog.
3. `Tab` dan `Shift+Tab` berpindah di dalam dialog modal.
4. `Escape` atau tombol tutup menutup dialog.
5. Fokus kembali ke tombol pemicu yang masih ada.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Primitive membantu menyediakan perilaku ini. Kita tetap memberi judul, isi, dan kontrol yang tepat serta memeriksa hasil komposisinya.
</BrutalCard>

<!--
Gunakan button untuk aksi dan link untuk navigasi. div dengan onClick tidak otomatis memiliki perilaku keyboard tombol.
Dialog modal, menu, dan popover memiliki pola berbeda; tidak semuanya memakai focus trap.
Role/aria-modal saja tidak mengelola fokus. Memasang library belum membuktikan seluruh aplikasi aksesibel.
Sumber: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
-->

---
class: module-content
---

### 1. Tambahkan shadcn ke Proyek yang Sama

Jalankan di **root proyek Next.js Toko Belajar**, setelah menyimpan kondisi kerja yang sudah berjalan.

```bash
npx shadcn@latest init --base radix --preset nova
npx shadcn@latest add button card dialog
npx shadcn@latest info
```

<v-clicks>

- `init` menyiapkan konfigurasi, utilitas, dependency, dan tema.
- `add` mengambil tiga komponen dari registry resmi shadcn.
- Periksa hasil `info`: basis **radix**, Tailwind **v4**, dan alias `@/`.
- Simpan konfigurasi dan lockfile agar hasil instalasi tercatat.

</v-clicks>

<BrutalCard v-click class="mt-3 text-sm">
  Jika shadcn sudah terpasang, periksa konfigurasi dahulu. Contoh <code>asChild</code> dalam modul ini memakai basis Radix.
</BrutalCard>

<!--
Perintah ditujukan ke proyek Next.js, bukan repositori Slidev. Tidak perlu aplikasi baru.
--preset nova dan --base radix dipilih eksplisit; periksa hasil karena default CLI dapat berubah.
Jangan menimpa modifikasi yang sudah ada lewat --force/--overwrite tanpa meninjau perbedaannya.
Sumber: https://ui.shadcn.com/docs/installation/next
Sumber: https://ui.shadcn.com/docs/cli
-->

---
class: module-content
---

### Periksa File Hasil Instalasi

| Lokasi                      | Yang diperiksa                        |
| --------------------------- | ------------------------------------- |
| `components.json`           | Basis/style, alias, dan lokasi CSS    |
| `src/components/ui/`        | Source Button, Card, dan Dialog       |
| `src/lib/utils.ts`          | Helper `cn` untuk menggabungkan class |
| `src/app/globals.css`       | Import Tailwind dan token tema        |
| `src/app/layout.tsx`        | Import CSS serta provider aplikasi    |
| `package.json` dan lockfile | Dependency yang ditambahkan           |

<v-clicks>

- Alias `@/*` tetap menunjuk ke `src/*`.
- Pertahankan Navbar, CartProvider, dan QueryProvider.
- Jalankan aplikasi dan buka kembali halaman usulan.

</v-clicks>

<!--
CLI dapat menyesuaikan tema dan font; tinjau diff setelah init.
Jangan mengganti seluruh layout dengan halaman awal dokumentasi. Root layout tetap Server Component; provider membungkus children seperti modul 06 dan 08.
Jika UI sebelumnya berada dalam group (shop), gunakan lokasi itu; URL /suggestions tidak berubah.
Sumber: https://ui.shadcn.com/docs/components-json
-->

---
class: module-content
---

### Token Menghubungkan Warna dengan Perannya

Token adalah nama bersama untuk nilai desain, misalnya warna permukaan atau teks.

| Kebutuhan      | Contoh utility                       |
| -------------- | ------------------------------------ |
| Halaman        | `bg-background text-foreground`      |
| Kartu          | `bg-card text-card-foreground`       |
| Tombol utama   | `bg-primary text-primary-foreground` |
| Teks pendukung | `text-muted-foreground`              |

<v-clicks>

- Button dan Card sudah memakai token tema.
- Sesuaikan nilai tema di CSS global jika diperlukan.
- Pakai `variant` untuk variasi komponen, `className` untuk susunannya.
- Periksa kontras teks dan indikator fokus setelah mengganti warna.

</v-clicks>

<!--
Setup Tailwind v4 memakai CSS variables dan pemetaan @theme inline. Periksa file CLI; tidak perlu membuat tailwind.config.js dari tutorial v3.
Pasangan primary/primary-foreground perlu diperiksa bersama agar teks tetap terbaca.
Token membantu konsistensi; token saja belum merupakan keseluruhan design system.
Sumber: https://ui.shadcn.com/docs/theming
Sumber: https://tailwindcss.com/docs/theme
-->

---
class: module-content
---

### 2. Pakai Button pada Form yang Sudah Ada

Di `src/app/suggestions/SuggestionForm.tsx`, **tambahkan import**:

```tsx
import { Button } from "@/components/ui/button";
```

Ganti kedua tombol lama di dalam fieldset dengan:

```tsx
<>
  <Button type="submit" disabled={pending}>
    {pending ? "Menyimpan…" : "Simpan usulan"}
  </Button>
  {onClose && (
    <Button type="button" variant="outline" onClick={onClose}>
      Tutup editor
    </Button>
  )}
</>
```

<v-clicks>

- `type="submit"` tetap menjalankan `handleSubmit` form.
- `fieldset disabled={pending}` tetap mencakup field dan tombol penutup.
- Pesan validasi, kegagalan, serta hasil simpan tetap tersedia.

</v-clicks>

<!--
Fragment <>...</> mengelompokkan JSX tanpa elemen DOM tambahan.
Ganti elemen beserta tag penutupnya; jangan menyarangkan Button dalam button lama.
pending dari Modul 11 mencakup penyimpanan dan refresh. Button tidak memiliki prop isLoading/isPending.
TitleField dan ReasonField dari modul 09 tetap digunakan; label, useId, register, serta aria-describedby tetap bekerja.
Sumber: https://ui.shadcn.com/docs/components/radix/button
-->

---
class: module-content
---

### 3. Siapkan Komponen untuk Kartu Usulan

Di `src/app/suggestions/SuggestionItem.tsx`, **tambahkan import**:

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
```

<v-clicks>

- `CardHeader` menempatkan judul.
- `CardContent` menempatkan alasan.
- `CardFooter` menempatkan aksi dan status.
- State `editing`, hook hapus, dan cabang `if (editing)` tetap digunakan.

</v-clicks>

<!--
Langkah berikut mengganti return terakhir untuk mode tampilan daftar, bukan return pada cabang form edit.
Target mutasi tetap suggestion.id.
Sumber: https://ui.shadcn.com/docs/components/radix/card
-->

---
class: module-content
---

### Kartu: Ganti Return Terakhir

Masih di `SuggestionItem.tsx`. Isi footer dilengkapi pada slide berikut.

```tsx {1-8|9-13|14-16|all}
return (
  <li className="min-w-0">
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <h3 className="wrap-anywhere">{suggestion.title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap wrap-anywhere">{suggestion.reason}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {/* Ganti komentar ini dengan aksi dan status */}
      </CardFooter>
    </Card>
  </li>
);
```

<!--
min-w-0 membuat item grid boleh menyusut. wrap-anywhere membungkus kata/URL panjang; whitespace-pre-wrap mempertahankan baris baru alasan.
Judul halaman h1, bagian daftar h2, lalu judul usulan h3. CardTitle memberi gaya; h3 memberi semantik heading.
Sumber: https://tailwindcss.com/docs/overflow-wrap
Sumber: https://ui.shadcn.com/docs/components/radix/card
-->

---
class: module-content
---

### Kartu: Isi Footer dengan Aksi yang Sudah Ada

**Ganti komentar di CardFooter** dengan:

```tsx
<>
  <fieldset disabled={pending} className="flex flex-wrap gap-2">
    <legend className="sr-only">Aksi untuk {suggestion.title}</legend>
    <Button type="button" variant="outline" onClick={() => setEditing(true)}>
      Edit
    </Button>
    <Button
      type="button"
      variant="destructive"
      onClick={() => mutation.mutate(suggestion.id)}
    >
      Hapus
    </Button>
  </fieldset>
  <p role="status">{pending ? "Menghapus…" : ""}</p>
  <p role="alert">
    {mutation.isError && "Penghapusan bermasalah. Periksa daftar lagi."}
  </p>
</>
```

<BrutalCard v-click class="mt-3 text-sm">
  Warna membantu membedakan aksi. Label <strong>Hapus</strong>, status pending, dan pesan error tetap diperlukan.
</BrutalCard>

<!--
Fieldset dinonaktifkan selama hapus/refresh seperti Modul 11. Jangan menghilangkan disabled saat merapikan tampilan.
Edit tetap memasang form lama; hapus tetap menjalankan DELETE dan router.refresh.
Penghapusan langsung dipertahankan. Konfirmasi aksi destruktif dapat dikembangkan dengan AlertDialog setelah pola dialog dipahami.
-->

---
class: module-content
---

### 4. Buat Dialog Panduan Usulan

Buat `src/app/suggestions/SuggestionHelp.tsx`.

```tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function SuggestionHelp() {
  return null;
}
```

`Dialog` mengelola status buka/tutup. `return null` diganti pada slide berikut.

<!--
Dialog panduan mengenalkan komposisi primitive melalui satu interaksi kecil. Ia tidak memindahkan form CRUD atau mengirim request.
Contoh berikut memakai basis Radix yang dipilih pada init.
Sumber: https://ui.shadcn.com/docs/components/radix/dialog
-->

---
class: module-content
---

### Dialog: Isi, Pemicu, dan Tombol Tutup

Di `SuggestionHelp.tsx`, **ganti return null** dengan:

```tsx
return (
  <Dialog>
    <DialogTrigger asChild>
      <Button type="button" variant="outline">
        Panduan usulan
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Usulan Buku Toko Belajar</DialogTitle>
        <DialogDescription>
          Isi judul buku dan alasan untuk dipertimbangkan pengelola toko. Usulan
          tersimpan di toko dan tidak mengubah katalog Open Library.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Tutup
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
```

<!--
asChild pada Radix meneruskan perilaku pemicu/penutup ke Button, sehingga tidak menghasilkan button di dalam button.
DialogTitle memberi nama aksesibel; DialogDescription menghubungkan penjelasan.
Base UI memakai pola render; jangan menyalin contoh Radix tanpa penyesuaian.
DialogContent bawaan juga menyediakan tombol tutup. Uji Escape dan kembalinya fokus.
Sumber: https://ui.shadcn.com/docs/components/radix/dialog
Sumber: https://www.radix-ui.com/primitives/docs/components/dialog
-->

---
class: module-content
---

### 5. Susun Halaman Server yang Sama

Di `src/app/suggestions/page.tsx`, gunakan import dan query berikut.

```tsx
import { connection } from "next/server";
import { db } from "@/db";
import { suggestions } from "@/db/schema";
import SuggestionForm from "./SuggestionForm";
import SuggestionItem from "./SuggestionItem";
import SuggestionHelp from "./SuggestionHelp";

export const runtime = "nodejs";
export default async function SuggestionsPage() {
  await connection();
  const items = await db.select().from(suggestions).orderBy(suggestions.id);
  return null;
}
```

<v-clicks>

- Halaman tetap membaca database sebagai Server Component.
- `SuggestionHelp` menjadi komponen client kecil di dalam halaman.
- Ganti `return null` dengan markup slide berikut.

</v-clicks>

<!--
Ini pembaruan page Modul 11. Query, urutan ID, dan connection tetap dipakai; jangan menambahkan use client pada page.
Client menerima data serializable atau mengelola state UI, bukan koneksi SQLite.
Sumber: https://nextjs.org/docs/app/getting-started/server-and-client-components
-->

---
class: module-content
---

### Halaman: Form dan Grid yang Responsif

Masih di `page.tsx`, **ganti return null** dengan:

```tsx
return (
  <main className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-8">
    <header className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
      <h1 className="text-2xl font-bold">Usulan Buku Toko Belajar</h1>
      <SuggestionHelp />
    </header>
    <section className="max-w-xl" aria-label="Tambah usulan buku">
      <SuggestionForm />
    </section>
    <section className="flex flex-col gap-4" aria-labelledby="list-title">
      <h2 id="list-title" className="text-xl font-semibold">
        Daftar usulan
      </h2>
      {items.length === 0 && <p>Belum ada usulan buku. Isi form di atas.</p>}
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {items.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </ul>
    </section>
  </main>
);
```

<!--
Pesan kosong dan alur CRUD tetap tersedia. role list mempertahankan semantik daftar pada browser/AT yang terpengaruh list-style none.
max-w membatasi panjang baris; breakpoint mengubah susunan, bukan data. Editor tetap berada pada item dengan key ID yang sama.
Jangan memotong alasan dengan truncate hanya untuk menyamakan tinggi kartu.
-->

---
class: module-content
---

### Checkpoint: Tampilan Baru, Alur Tetap Berjalan

| Percobaan                   | Hasil yang diperiksa                              |
| --------------------------- | ------------------------------------------------- |
| Tambah usulan               | Kartu muncul dan form tambah kosong               |
| Edit judul serta alasan     | Setelah simpan dan tutup editor, kartu diperbarui |
| Hapus satu usulan           | Hanya kartu yang dipilih hilang                   |
| Request gagal               | Pesan error terlihat; input form tetap ada        |
| Database kosong             | Ada petunjuk untuk mengisi form                   |
| Judul / kata sangat panjang | Teks membungkus di dalam kartu                    |

<v-clicks>

- Pakai data API lokal; jangan menggantinya dengan array contoh.
- Periksa layar sempit, sedang, lebar, serta di antara breakpoint.
- Pastikan label input, indikator fokus, dan tombol tetap terlihat.

</v-clicks>

<!--
Uji lebar 360px, 768px, dan 1280px dengan data panjang. Coba judul 80 karakter serta alasan 500 karakter sesuai schema.
Periksa pending dengan jaringan lambat. Tombol disabled perlu tetap dapat dikenali statusnya.
-->

---
class: module-content
---

### Checkpoint: Pakai Dialog dengan Keyboard

Lakukan tanpa mouse pada halaman usulan.

<v-clicks>

1. Tekan `Tab` sampai **Panduan usulan** mendapat fokus.
2. Tekan `Enter`: dialog tampil dan fokus berada di dalamnya.
3. Coba `Tab` serta `Shift+Tab`: fokus tetap di dalam dialog.
4. Tekan `Escape`: dialog menutup, fokus kembali ke pemicu.
5. Buka lagi, lalu aktifkan tombol **Tutup**.

</v-clicks>

<BrutalCard v-click class="mt-4 text-sm">
  Lanjutkan dengan zoom 200%, kontras teks, dan preferensi reduced motion. Periksa hasil komposisi; library tidak menggantikan pengujian aplikasi.
</BrutalCard>

<!--
Zoom 200% merupakan satu pemeriksaan, bukan bukti seluruh WCAG terpenuhi. Periksa reflow dan pembesaran teks.
Jika menambah animasi dekoratif, hormati prefers-reduced-motion. Periksa pula animasi bawaan komponen dan sesuaikan source/CSS bila diperlukan.
Sumber: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
Sumber: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
Sumber: https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion
-->

---
class: module-content
---

### Pengayaan: Cari dan Bagi Daftar Kecil

**Sketsa di dalam Client Component** dengan props `items: BookSuggestion[]`. Impor `useState` dari React.

```tsx
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const query = search.trim().toLowerCase();
const filtered = items.filter((item) =>
  item.title.toLowerCase().includes(query),
);
const pageSize = 6;
const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
const safePage = Math.min(page, pageCount);
const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

function changeSearch(value: string) {
  setSearch(value);
  setPage(1);
}
```

`filtered` dan `visible` dihitung dari data serta state; tidak perlu disimpan ke state lain.

<!--
Ini pengayaan, bukan potongan untuk ditempel ke Server Component page. Praktik inti menampilkan seluruh items.
Parent server dapat meneruskan items ke Client Component baru. Pakai key suggestion.id ketika merender visible.
safePage menghindari halaman di luar batas ketika data berkurang setelah hapus. pageCount minimal 1.
Sumber: https://react.dev/learn/you-might-not-need-an-effect
-->

---
class: module-content
layout: two-cols
---

### Pengayaan: Lengkapi Kontrol dan Batasannya

::left::

#### Perilaku Kontrol Lokal

| Kontrol                  | Hubungkan ke            |
| ------------------------ | ----------------------- |
| Input pencarian berlabel | `changeSearch`          |
| Daftar hasil             | `visible`, key ID       |
| Sebelumnya               | `setPage(safePage - 1)` |
| Berikutnya               | `setPage(safePage + 1)` |

Nonaktifkan Sebelumnya pada halaman 1, Berikutnya pada halaman terakhir.

::right::

#### Bedakan Sumber Data

<v-clicks>

- Filter lokal melihat data yang **sudah dimuat**.
- Nol hasil pencarian berbeda dari database kosong.
- State lokal hilang saat reload.
- Parameter URL membuat filter dapat dibagikan.
- Data besar memerlukan filter/pagination di server atau API.

</v-clicks>

::bottom::

<BrutalCard v-click class="text-sm">
  Memfilter satu respons Open Library di browser tidak berarti mencari seluruh katalog bukunya.
</BrutalCard>

<!--
Jika mengembangkan pengayaan pada daftar yang dapat diedit, tentukan nasib draft ketika filter/halaman berubah. Item yang dilepas dari render kehilangan state lokal formnya.
Simpan draft atau minta pengguna menyelesaikan edit dahulu. Pagination tidak wajib untuk daftar latihan yang masih sedikit.
Sumber: https://react.dev/learn/preserving-and-resetting-state
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params
-->

---
class: module-content
---

### Cek Pemahaman: Dialog Sudah Terlihat

<LearningCheck
  id="modul-12-dialog-focus"
  question="Dialog panduan terlihat rapi, tetapi Tab masih berpindah ke tombol di belakangnya. Apa yang perlu diperbaiki?"
  :options="[
    'Menambah z-index agar dialog lebih tinggi',
    'Memeriksa komposisi dialog modal dan pengelolaan fokusnya',
    'Menghapus indikator fokus supaya masalah tidak terlihat',
  ]"
  :answer="1"
  explanation="Urutan lapisan visual tidak mengatur fokus keyboard. Periksa primitive, pemicu, konten dialog, Escape, serta pengembalian fokus setelah ditutup."
/>

<!--
Minta peserta mendemonstrasikan jawaban melalui keyboard pada SuggestionHelp.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 12

<v-clicks>

1. **Lanjutkan Fitur yang Sama**: UI baru memakai data dan mutasi usulan buku.
2. **Susun secara Responsif**: ruang, isi panjang, dan breakpoint menentukan tata letak.
3. **Pakai Komponen dengan Benar**: token, variant, dan komposisi menjaga konsistensi.
4. **Buktikan Interaksinya**: uji CRUD, state UI, keyboard, dan layar sempit.

</v-clicks>

<BrutalCard v-click class="mt-4 bg-brutal-cyan/10">
  🚀 <strong>Selanjutnya di Modul 13:</strong> Membaca kontrak OpenAPI/Swagger dan mencocokkannya dengan API usulan buku Toko Belajar.
</BrutalCard>

<!--
Hasil inti: /suggestions dengan Button, Card, Dialog panduan, dan susunan responsif.
Kontrak API dipelajari pada Modul 13; login, sesi, dan hak akses dilanjutkan pada Modul 14.
-->

---
class: module-content
layout: two-cols
hideInToc: true
---

### Sumber dan Bacaan Lanjutan

Dokumentasi resmi diperiksa pada **9 Oktober 2026**. Rujukan khusus ada pada catatan slide.

::left::

#### Komponen dan Tema

- [Instalasi shadcn di Next.js](https://ui.shadcn.com/docs/installation/next)
- [CLI dan pilihan basis](https://ui.shadcn.com/docs/cli)
- [Button, basis Radix](https://ui.shadcn.com/docs/components/radix/button)
- [Card, basis Radix](https://ui.shadcn.com/docs/components/radix/card)
- [Dialog, basis Radix](https://ui.shadcn.com/docs/components/radix/dialog)
- [Tema dan CSS variables](https://ui.shadcn.com/docs/theming)

::right::

#### Tata Letak dan Interaksi

- [Tailwind: responsive design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind: teks panjang](https://tailwindcss.com/docs/overflow-wrap)
- [WAI-ARIA: dialog modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React: state dan identitas](https://react.dev/learn/preserving-and-resetting-state)
- [Figma: memeriksa desain](https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting)
