---
layout: intro
badge: "MODUL 01"
badgeColor: "yellow"
level: 1
---

## 01. Pengenalan Next.js & Setup Project

Memahami Fondasi Next.js, Perbedaan Arsitektur dengan React Biasa, serta Setup Project dengan Tooling Modern.

---

### Kenapa Kita Butuh Next.js?

Standar Industri Modern untuk Membangun Aplikasi Web React yang Cepat, Aman, dan Skalabel

Next.js bukan sekadar React dengan router bawaan. **Next.js adalah framework fullstack** yang memperluas kemampuan React ke server, menghadirkan performa tinggi dan developer experience kelas atas.

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="brutal-card bg-white">
    <div class="font-black text-base mb-1">🌐 Fullstack & Server-First</div>
    <p class="text-xs text-gray-700">Ambil data langsung dari database di dalam komponen (RSC) tanpa repot membuat REST API terpisah dan <strong>0 KB beban JavaScript ke browser</strong>.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-base mb-1">⚡ Hybrid Rendering & Streaming</div>
    <p class="text-xs text-gray-700">Gabungkan kecepatan HTML statis (CDN), SSR dinamis, dan <strong>Streaming Suspense</strong>. Konten tampil instan tanpa membuat user menunggu.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-base mb-1">🛡️ Standar Industri & Aman</div>
    <p class="text-xs text-gray-700">Kunci API & kredensial database aman di server. Dioptimalkan otomatis untuk Core Web Vitals, SEO, dan dipakai perusahaan raksasa dunia.</p>
  </div>
</div>

---
layout: two-cols
---

### React Biasa (SPA) vs Next.js

Memahami Perbedaan Cara Menampilkan Halaman ke Pengunjung

::left::

#### React Biasa (Vite / CRA)

- 📦 **Browser Bekerja Sendirian**: Browser mengunduh file HTML kosong `<div id="root"></div>`, lalu sibuk merakit halaman sendiri.
- ⏳ **Layar Putih Sejenak**: Pengunjung sering melihat halaman kosong atau loading spinner sebelum isi konten muncul.
- 🔍 **Kurang Ramah SEO**: Mesin pencari dan media sosial kesulitan membaca isi teks jika halaman lambat dirakit.
- 🛡 **Kode Rahasia Rawan Bocor**: Kunci API privat atau logika rahasia tidak aman jika ditaruh di komponen biasa (Client Component).

::right::

#### Next.js (App Router)

- ⚡ **Tampilan Siap Baca**: Server langsung merakit dan mengirimkan halaman siap jadi, sehingga tulisan langsung tampil seketika.
- 🧩 **Ukuran File Lebih Ringan**: Sebagian besar pekerjaan selesai di server, sehingga perangkat pengunjung tidak terbebani kode berlebih.
- 📈 **Mudah Dibagikan ke Medsos**: Judul, gambar thumbnail, dan deskripsi otomatis terbaca rapi saat link dibagikan.
- 🔒 **Jauh Lebih Aman**: Sambungan ke database dan password rahasia tersimpan aman di server tanpa bisa diintip pengunjung.

---

### Ringkasan Perbedaan Utama

Tabel Komparasi Sederhana untuk Memilih Pendekatan yang Pas

| Aspek                         | React Biasa (Vite / CRA)                        | Next.js (App Router)                             |
| :---------------------------- | :---------------------------------------------- | :----------------------------------------------- |
| **Cara Tampil**               | Browser merakit halaman sendiri dari nol        | Server mengirim halaman yang sudah jadi          |
| **Kecepatan Buka Awal**       | Muncul layar kosong atau spinner sesaat         | Konten langsung terbaca dalam hitungan milidetik |
| **Beban di Perangkat Pengguna** | Makin banyak halaman, file JS makin besar     | Ringan, hanya mengirim kode yang dipakai         |
| **Pembuatan Halaman (Routing)** | Harus install library tambahan (`react-router`) | Cukup buat folder baru di dalam `app/`         |
| **Optimasi Gambar**           | Harus compress gambar manual satu per satu      | Otomatis dioptimalkan lewat `next/image`         |
| **SEO & Social Share**        | Butuh pengaturan rumit tambahan                 | Bawaan otomatis lewat fitur Metadata             |

---

### Inisialisasi Project Baru

Langkah Praktis Memulai Project Next.js Menggunakan `create-next-app`

Jalankan perintah ini di terminal Antum:

```bash
npx create-next-app@latest my-next-app
```

````md magic-move
```bash
✔ What is your project named? … my-next-app
```

```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
```

```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
```

```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias? … No
```
````

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  ✅ Rekomendasi di kelas ini: Tekan Enter untuk memilih opsi default (pilih <strong>Yes</strong>, dan <strong>No</strong> untuk customize alias).
</div>

---
layout: two-cols
---

### Konfigurasi Linter & Formatter

Menjaga Kode Tetap Bersih, Rapi, dan Konsisten di Dalam Tim

::left::

#### ESLint (Flat Config & CLI)

Mendeteksi **kesalahan logika dan bug** sebelum dijalankan:

```js
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

export default [...compat.extends("next/core-web-vitals")];
```

Jalankan audit kode via CLI ESLint:

```bash
npx eslint .
```

::right::

#### Prettier (Auto-Formatting)

Merapikan **spasi, titik koma, dan urutan class**:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Buat file `.prettierrc`:

```json {3|4|all}
{
  "semi": false,
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### Ekosistem Linter: ESLint vs Oxlint vs Biome

Kecepatan Kompilasi Rust vs Kekuatan Plugin Spesifik Framework

<div class="grid grid-cols-3 gap-3 mt-2 text-xs">
  <!-- ESLint Card -->
  <div class="brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-black text-sm text-black">ESLint</span>
        <span class="bg-[#FFE600] text-[10px] font-black px-1.5 py-0.5 border border-black rounded">Standar Industri</span>
      </div>
      <div class="text-[11px] text-gray-600 mb-2 font-mono">Engine: Node.js (JS/TS)</div>
      <ul class="space-y-1 text-[11px] text-gray-800 leading-snug">
        <li>⚡ <strong>Kecepatan:</strong> Baseline (~1x, terasa lambat di monorepo raksasa).</li>
        <li>🔌 <strong>Ekosistem:</strong> <strong>Tak tertandingi</strong>. Ribuan plugin komunitas matang.</li>
        <li>🎯 <strong>Cocok untuk:</strong> Proyek Next.js nyata yang butuh aturan framework khusus.</li>
      </ul>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 font-bold text-[10px] text-green-700">
      ✅ Bawaan resmi <code>create-next-app</code>
    </div>
  </div>

  <!-- Oxlint Card -->
  <div class="brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-black text-sm text-black">Oxlint (Oxc)</span>
        <span
          v-motion
          :initial="{ scale: 0.8, x: -10 }"
          :enter="{ scale: 1, x: 0, transition: { type: 'spring', stiffness: 300 } }"
          class="bg-[#00E5FF] text-[10px] font-black px-1.5 py-0.5 border border-black rounded"
        >⚡ 50x–100x Rust</span>
      </div>
      <div class="text-[11px] text-gray-600 mb-2 font-mono">Engine: Rust</div>
      <ul class="space-y-1 text-[11px] text-gray-800 leading-snug">
        <li>⚡ <strong>Kecepatan:</strong> <strong>50x – 100x</strong> lebih cepat dari ESLint.</li>
        <li>🔌 <strong>Ekosistem:</strong> Fokus aturan inti (correctness). Bukan pengganti plugin kustom.</li>
        <li>🎯 <strong>Cocok untuk:</strong> Pre-commit git hook kilat & filter cepat di pipeline CI.</li>
      </ul>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 font-bold text-[10px] text-cyan-800">
      🤝 Sinergi via <code>eslint-plugin-oxlint</code>
    </div>
  </div>

  <!-- Biome Card -->
  <div class="brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-black text-sm text-black">Biome (ex-Rome)</span>
        <span
          v-motion
          :initial="{ scale: 0.8, x: -10 }"
          :enter="{ scale: 1, x: 0, transition: { type: 'spring', stiffness: 300, delay: 150 } }"
          class="bg-[#FF6B8B] text-white text-[10px] font-black px-1.5 py-0.5 border border-black rounded"
        >⚡ 25x–35x Rust</span>
      </div>
      <div class="text-[11px] text-gray-600 mb-2 font-mono">Engine: Rust</div>
      <ul class="space-y-1 text-[11px] text-gray-800 leading-snug">
        <li>⚡ <strong>Kecepatan:</strong> <strong>25x – 35x</strong> lebih cepat (Linter + Formatter Prettier).</li>
        <li>🔌 <strong>Ekosistem:</strong> Tertutup/mandiri. <strong>Tidak mendukung</strong> instalasi plugin ESLint eksternal.</li>
        <li>🎯 <strong>Cocok untuk:</strong> Proyek mandiri yang ingin zero-config dan super ringkas.</li>
      </ul>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 font-bold text-[10px] text-red-700">
      ⚠️ Belum mendukung plugin AST pihak ketiga
    </div>
  </div>
</div>

<!-- Highlight TanStack Query + ESLint -->
<div v-click class="mt-3 p-2.5 brutal-card bg-[#FFE600]/20 border-2 border-black shadow-[2px_2px_0px_#000]">
  <div class="flex items-center gap-2 mb-1">
    <span class="bg-[#FFE600] text-black text-[10px] font-black px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000]">
      💡 KENAPA PENGGUNA TANSTACK QUERY WAJIB ESLINT?
    </span>
    <span class="text-xs font-black text-black">Kasus Nyata di Modul 08</span>
  </div>
  <p class="text-[11px] text-gray-800 leading-relaxed">
    TanStack Query memiliki plugin resmi <code>@tanstack/eslint-plugin-query</code> untuk mencegah bug berbahaya: memastikan <strong>dependensi queryKey lengkap</strong> (mencegah data stale/basi), mencegah instansiasi ganda <code>QueryClient</code> di render loop, serta melarang destructuring yang merusak reactivity tracking. <strong>Aturan AST spesifik ini belum ada di Biome maupun Oxlint</strong> — inilah alasan tim industri Next.js tetap mempertahankan ESLint!
  </p>
</div>

---
layout: two-cols
---

### Auto Sort & Remove Unused Imports

Otomatisasi Kebersihan Import di Header File Tanpa Dikerjakan Manual

::left::

#### 🔌 Ekosistem ESLint (Next.js Paling Populer)

Kombinasi plugin standar industri:

- **`eslint-plugin-simple-import-sort`**: Mengurutkan import secara deterministik dan teratur.
- **`eslint-plugin-unused-imports`**: Otomatis menghapus import & variabel tak terpakai saat `--fix`.

```bash
npm i -D eslint-plugin-simple-import-sort eslint-plugin-unused-imports
```

<div class="mt-2 p-2 brutal-card bg-yellow-50 text-[11px] border border-black">
  🎯 <strong>Keunggulan:</strong> Aturan pengelompokan regex sangat fleksibel (React/Next duluan, lalu package npm, alias <code>@/</code>, relative <code>./</code>, dan CSS).
</div>

::right::

#### ⚡ Bawaan Biome vs Oxlint

Bagaimana Linter Generasi Rust Menanganinya?

<div class="space-y-2 mt-1 text-xs">
  <div class="p-2 brutal-card bg-white border border-black shadow-[2px_2px_0px_#000]">
    <div class="font-bold flex items-center justify-between text-[#FF6B8B]">
      <span>Biome (Built-in)</span>
      <span class="text-[10px] bg-green-100 text-green-800 px-1 rounded border border-black font-mono font-bold">All-in-One</span>
    </div>
    <p class="text-[11px] text-gray-700 mt-1">
      Punya fitur bawaan <code>organizeImports</code>. Sort & remove unused imports berjalan <strong>otomatis 25x–35x lebih cepat</strong> tanpa install plugin tambahan via <code>biome check --write</code>.
    </p>
  </div>

  <div class="p-2 brutal-card bg-white border border-black shadow-[2px_2px_0px_#000]">
    <div class="font-bold flex items-center justify-between text-[#00E5FF]">
      <span>Oxlint (Linter Only)</span>
      <span class="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded border border-black font-mono font-bold">Fast Audit</span>
    </div>
    <p class="text-[11px] text-gray-700 mt-1">
      Sangat cepat mendeteksi error <code>no-unused-vars</code> (50x–100x), namun fokus pada <strong>audit diagnosa</strong> (belum menyediakan transformasi auto-sort format bawaan).
    </p>
  </div>
</div>

---

### Demo: Auto Sort & Remove Unused Imports

Satu Kali Simpan (Ctrl+S / Cmd+S), Seluruh Header File Langsung Bersih!

````md magic-move
```tsx
// ❌ 1. Before: Messy order & unused imports
import "./button.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Trash, Heart } from "lucide-react";
import { UserCard } from "./UserCard";
import axios from "axios";

export default function ProductCard({ title }: { title: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{title}</h3>
      <Link href="/cart">Buy Now</Link>
      <button onClick={() => setLiked(!liked)}>
        <Heart className={liked ? "text-red-500" : ""} />
      </button>
    </div>
  );
}
```

```tsx
// 🧹 2. Auto Remove: Unused imports purged automatically!
// (useEffect, Image, formatCurrency, Trash, UserCard, axios are removed)
import "./button.css";
import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductCard({ title }: { title: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{title}</h3>
      <Link href="/cart">Buy Now</Link>
      <button onClick={() => setLiked(!liked)}>
        <Heart className={liked ? "text-red-500" : ""} />
      </button>
    </div>
  );
}
```

```tsx
// ✨ 3. Auto Sort: Cleanly grouped and sorted!
// 1. Core Framework (React & Next.js)
import Link from "next/link";
import { useState } from "react";

// 2. Third-Party Dependencies (lucide-react)
import { Heart } from "lucide-react";

// 3. Side-Effects / Stylesheets
import "./button.css";

export default function ProductCard({ title }: { title: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{title}</h3>
      <Link href="/cart">Buy Now</Link>
      <button onClick={() => setLiked(!liked)}>
        <Heart className={liked ? "text-red-500" : ""} />
      </button>
    </div>
  );
}
```
````

<div v-click class="mt-2 p-2 brutal-card bg-white border border-black shadow-[2px_2px_0px_#000] text-xs flex items-center justify-between">
  <span>💡 <strong>Tips Produktivitas:</strong> Aktifkan <code>"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }</code> di VS Code Antum!</span>
  <span class="bg-[#FFE600] px-2 py-0.5 border border-black rounded text-[10px] font-black">Zero Mental Overhead</span>
</div>

---

### Tailwind CSS: Styling Cepat

Menulis CSS Langsung di Atribut `className` Tanpa Berpindah File

````md magic-move
```tsx
// ❌ Legacy Approach: Create separate CSS file & think of class names
import "./button.css";

export default function Button() {
  return <button className="primary-blue-button">Register Now</button>;
}
```

```tsx
// ✅ Tailwind CSS: Utility classes directly on elements!
export default function Button() {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
      Register Now
    </button>
  );
}
```
````

<div v-click class="mt-4 grid grid-cols-3 gap-3 text-xs">
  <div class="brutal-card bg-white p-2 text-center">
    <code>bg-blue-600</code><br/>Warna latar tombol
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <code>hover:bg-blue-700</code><br/>Efek saat kursor diarahkan
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <code>py-2 px-4</code><br/>Jarak padding vertikal & horizontal
  </div>
</div>

---

### Menjalankan Development Server (Turbopack)

Melihat Hasil Proyek Pertama Antum Secara Langsung dengan Kompiler Rust

Jalankan perintah ini di terminal proyek:

```bash
npm run dev
```

<v-clicks>

1. 🌐 Buka browser dan kunjungi alamat `http://localhost:3000`
2. 🎉 Halaman pembuka Next.js siap menyambut Antum!
3. ⚡ Di **Next.js 16**, engine **Turbopack sudah aktif secara default** — kompilasi dan _Fast Refresh_ berjalan secepat kilat!

</v-clicks>

<div v-click class="mt-6 brutal-card bg-white p-3">
  <span class="brutal-badge brutal-badge-cyan">TIGA SCRIPT UTAMA (TURBOPACK DEFAULT)</span>
  <div class="grid grid-cols-3 gap-2 mt-3 text-xs">
    <div><code>npm run dev</code> — Jalankan mode koding (development)</div>
    <div><code>npm run build</code> — Kompilasi untuk siap rilis (production)</div>
    <div><code>npm run start</code> — Uji jalankan hasil kompilasi produksi</div>
  </div>
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 01

1. **Next.js Menggabungkan Server & Browser**: Menghadirkan performa cepat, ramah mesin pencari (SEO), dan hemat beban perangkat pengguna.
2. **Setup Cepat & Turbopack Default**: `create-next-app` langsung menghasilkan project modern dengan engine Turbopack Rust bawaan Next.js 16.
3. **Tooling Modern Meningkatkan Kecepatan Kerja**: Kombinasi Prettier, ESLint Flat Config, dan Tailwind CSS memastikan kode Antum selalu rapi dan konsisten.
