---
layout: intro
badge: "MODUL 01"
badgeColor: "yellow"
level: 1
---

## 01. Pengenalan Next.js & Setup Project

Mengenal Apa Itu Next.js, Bedanya dengan React Biasa, serta Inisialisasi Project dan Tooling Modern.

---

### Kenapa Kita Butuh Next.js?

Solusi Praktis Bikin Website yang Cepat, Rapi, dan Siap untuk Pengguna Nyata

Next.js adalah framework React yang dirancang agar kita bisa membangun website nyata dengan mudah. Jika React biasa hanya fokus di browser pengunjung, **Next.js bekerja cerdas menggabungkan keunggulan server dan browser.**

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🚀 Lengkap & Siap Pakai</div>
    <p class="text-xs text-gray-700">Tidak perlu pusing install router manual. Routing halaman, tata letak, dan optimasi sudah langsung tersedia sejak hari pertama.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">⚡ Tampilan Langsung Muncul</div>
    <p class="text-xs text-gray-700">Server langsung mengirimkan halaman yang sudah jadi. Pengunjung tidak perlu menunggu layar putih berputar-putar.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🛠 Fitur Otomatis Canggih</div>
    <p class="text-xs text-gray-700">Gambar otomatis dikompres (`next/image`), font dimuat secepat kilat (`next/font`), dan link antar halaman terasa instan.</p>
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
- 🛡 **Kode Rahasia Rawan Bocor**: Kunci API privat atau logika rahasia tidak aman jika ditaruh di komponen biasa.

::right::

#### Next.js (App Router)

- ⚡ **Tampilan Siap Baca**: Server langsung merakit dan mengirimkan halaman siap jadi, sehingga tulisan langsung tampil seketika.
- 🧩 **Ukuran File Lebih Ringan**: Sebagian besar pekerjaan selesai di server, jadi HP pengunjung tidak keberatan memproses kode.
- 📈 **Mudah Dibagikan ke Medsos**: Judul, gambar thumbnail, dan deskripsi otomatis terbaca rapi saat link dibagikan.
- 🔒 **Jauh Lebih Aman**: Sambungan ke database dan password rahasia tersimpan aman di server tanpa bisa diintip pengunjung.

---

### Ringkasan Perbedaan Utama

Tabel Komparasi Sederhana untuk Memilih Pendekatan yang Pas

| Aspek                    | React Biasa (Vite / CRA)                        | Next.js (App Router)                             |
| :----------------------- | :---------------------------------------------- | :----------------------------------------------- |
| **Cara Tampil**          | Browser merakit halaman sendiri dari nol        | Server mengirim halaman yang sudah jadi          |
| **Kecepatan Buka Awal**  | Muncul layar kosong atau spinner sesaat         | Konten langsung terbaca dalam hitungan milidetik |
| **Beban di HP Pengguna** | Makin banyak halaman, file JS makin besar       | Ringan, hanya mengirim kode yang dipakai         |
| **Bikin Halaman Baru**   | Harus install library tambahan (`react-router`) | Cukup buat folder baru di dalam `app/`           |
| **Optimasi Gambar**      | Harus compress gambar manual satu per satu      | Otomatis dioptimalkan lewat `next/image`         |
| **SEO & Social Share**   | Butuh pengaturan rumit tambahan                 | Bawaan otomatis lewat fitur Metadata             |

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
  ✅ Rekomendasi di kelas ini: Pilih <strong>Yes</strong> untuk semua opsi di atas!
</div>

---
layout: two-cols
---

### Konfigurasi Linter & Formatter

Menjaga Kode Tetap Bersih, Rapi, dan Konsisten di Dalam Tim

::left::

#### ESLint (Bawaan Next.js)

Mendeteksi **kesalahan logika dan bug** sebelum dijalankan:

```json
// .eslintrc.json
{
  "extends": "next/core-web-vitals"
}
```

Jalankan audit kode:

```bash
npx next lint
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

### Tailwind CSS: Styling Cepat

Menulis CSS Langsung di Atribut `className` Tanpa Berpindah File

````md magic-move
```tsx
// ❌ Cara Lama: Bikin file CSS terpisah & pusing mikir nama class
import "./tombol.css";

export default function Tombol() {
  return <button className="tombol-biru-utama">Daftar Sekarang</button>;
}
```

```tsx
// ✅ Tailwind CSS: Utility class langsung di elemen!
export default function Tombol() {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
      Daftar Sekarang
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

### Menjalankan Development Server

Melihat Hasil Proyek Pertama Antum Secara Langsung

Jalankan perintah ini di terminal proyek:

```bash
npm run dev
```

<v-clicks>

1. 🌐 Buka browser dan kunjungi alamat `http://localhost:3000`
2. 🎉 Halaman pembuka Next.js siap menyambut Antum!
3. ⚡ Coba edit file `src/app/page.tsx`, tekan **Save**, dan perhatikan perubahannya muncul seketika tanpa refresh manual (_Fast Refresh_).

</v-clicks>

<div v-click class="mt-6 brutal-card bg-white p-3">
  <span class="brutal-badge brutal-badge-cyan">TIGA SCRIPT UTAMA</span>
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
2. **Setup Cepat dengan `create-next-app`**: Satu baris perintah langsung menghasilkan project terintegrasi TypeScript, ESLint, Tailwind CSS, dan App Router.
3. **Tooling Modern Meningkatkan Kecepatan Kerja**: Kombinasi Prettier, ESLint, dan Tailwind CSS memastikan kode Antum selalu rapi dan konsisten.
