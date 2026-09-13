---
layout: intro
badge: "MODUL 01"
badgeColor: "yellow"
---

## 01. Pengenalan Next.js & Ekosistemnya

Mengenal Apa Itu Next.js, Bedanya dengan React Biasa, serta Fondasi Struktur Folder dan Routing.

---

### Kenapa Kita Butuh Next.js?

Solusi Praktis Bikin Website yang Cepat, Rapi, dan Gampang Ditemukan di Google

Next.js adalah framework React yang dirancang agar kita bisa membangun website nyata dengan mudah. Jika React biasa hanya fokus di browser pengunjung, **Next.js bekerja cerdas menggabungkan keunggulan server dan browser.**

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🚀 Lengkap & Siap Pakai</div>
    <p class="text-xs text-gray-700">Tidak perlu pusing install router manual. Routing halaman, tata letak, dan pengolahan data sudah langsung tersedia.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">⚡ Tampilan Langsung Muncul</div>
    <p class="text-xs text-gray-700">Server langsung mengirimkan halaman yang sudah jadi. Pengunjung tidak perlu menunggu layar putih berputar-putar.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🛠 Fitur Otomatis Canggih</div>
    <p class="text-xs text-gray-700">Gambar otomatis di-compress (`next/image`), font dimuat cepat (`next/font`), dan link antar halaman terasa instan.</p>
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
- 🔍 **Kurang Ramah Google (SEO)**: Mesin pencari dan media sosial kesulitan membaca isi teks jika halaman lambat dirakit.
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

| Aspek                    | React Biasa (Vite / CRA)                            | Next.js (App Router)                                 |
| :----------------------- | :-------------------------------------------------- | :--------------------------------------------------- |
| **Cara Tampil**          | Browser merakit halaman sendiri dari nol            | Server mengirim halaman yang sudah jadi              |
| **Kecepatan Buka Awal**  | Muncul layar kosong atau spinner sesaat             | Konten langsung terbaca dalam hitungan milidetik     |
| **Beban di HP Pengguna** | Makin banyak halaman, file yang diunduh makin besar | Ringan, hanya mengirim kode yang benar-benar dipakai |
| **Bikin Halaman Baru**   | Harus install library tambahan (`react-router`)     | Cukup buat folder baru di dalam folder `app/`        |
| **Optimasi Gambar**      | Harus compress manual satu per satu                 | Otomatis dioptimalkan lewat komponen `next/image`    |
| **SEO (Google Search)**  | Butuh pengaturan rumit tambahan                     | Sudah otomatis siap pakai lewat fitur Metadata       |

---
layout: two-cols
---

### Server vs Client Component

Kapan Menggunakan Komponen Server dan Kapan Butuh Komponen Klien?

::left::

#### Server Component _(Bawaan Next.js)_

Komponen santai yang hanya bertugas menampilkan data:

```tsx
// app/users/page.tsx
// ✅ Otomatis jalan di server (Default)
export default async function UsersPage() {
  const users = await db.user.findMany(); // Ambil data langsung!

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

- ❌ Tidak bisa pakai tombol klik `onClick` atau `useState`
- ✅ Sangat cepat, hemat kuota pengunjung, dan aman

::right::

#### Client Component (`'use client'`)

Dipakai khusus saat butuh tombol klik atau input interaktif:

```tsx
"use client"; // 👈 Tulis baris ini di baris paling atas!

import { useState } from "react";

export default function Counter() {
  const [angka, setAngka] = useState(0);

  return (
    <button onClick={() => setAngka(angka + 1)}>Diklik: {angka} kali</button>
  );
}
```

- ✅ Bisa memakai `useState`, tombol klik, dan form input
- ✅ Bisa mengakses fitur browser seperti `localStorage`

---

### Struktur Folder di Next.js

Cukup Buat Folder Baru, Alamat Halaman Website Otomatis Terbentuk!

Next.js menggunakan aturan sederhana: **nama folder adalah rute halaman di browser**. Tidak perlu lagi menulis file routing yang panjang dan membingungkan:

```
proyek-nextjs/
├── app/                      # Tempat utama membuat semua halaman website
│   ├── layout.tsx            # Kerangka tetap website (misal: navbar & footer)
│   ├── page.tsx              # Halaman depan / beranda utama ("/")
│   ├── loading.tsx           # Animasi atau teks saat halaman sedang loading
│   ├── not-found.tsx         # Halaman jika alamat tidak ditemukan (404)
│   ├── error.tsx             # Halaman ramah jika terjadi kendala teknis
│   ├── tentang/
│   │   └── page.tsx          # Halaman alamat "/tentang"
│   └── produk/
│       ├── page.tsx          # Halaman alamat "/produk"
│       └── [id]/
│           └── page.tsx      # Halaman dinamis, misal: "/produk/buku-react"
├── public/                   # Tempat menyimpan gambar, logo, dan file statis
├── next.config.ts            # Pengaturan bawaan proyek Next.js
└── package.json
```

---
layout: two-cols
---

### File-File Khusus di Next.js

Nama File yang Memiliki Fungsi Otomatis Tanpa Perlu Dikonfigurasi Manual

::left::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FFE600] bg-black px-1.5 py-0.5 rounded text-xs mr-2">page.tsx</span>
    File wajib untuk menampilkan isi halaman ke pengunjung website.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#00E5FF] bg-black px-1.5 py-0.5 rounded text-xs mr-2">layout.tsx</span>
    Kerangka bersama (seperti navbar) yang tidak akan me-reload saat pindah menu.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FF6B8B] bg-black px-1.5 py-0.5 rounded text-xs mr-2">loading.tsx</span>
    Tampilan sementara otomatis saat halaman sedang mengambil data baru.
  </div>
</div>

::right::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#2ED573] bg-black px-1.5 py-0.5 rounded text-xs mr-2">error.tsx</span>
    Menangkap masalah teknis dengan rapi agar website tidak rusak berantakan.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#B388EB] bg-black px-1.5 py-0.5 rounded text-xs mr-2">not-found.tsx</span>
    Halaman ramah yang muncul otomatis jika pengunjung salah mengetik alamat URL.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-white bg-black px-1.5 py-0.5 rounded text-xs mr-2">route.ts</span>
    Jalur penyedia data khusus (API data) jika ingin membuat layanan data sendiri.
  </div>
</div>

---

### Contoh Membuat Halaman & Rute

Halaman Statis, Halaman dengan Nomor ID, dan Pengelompokan Folder

```ts
// 1. Halaman Biasa: app/produk/page.tsx
// Alamat di browser: /produk

// 2. Halaman Dinamis (Berdasarkan ID): app/produk/[id]/page.tsx
// Alamat di browser: /produk/123 atau /produk/laptop-gaming
export default async function DetailProduk({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <h1>Halaman Produk ID: {id}</h1>
}

// 3. Folder Pengelompokan: app/(auth)/login/page.tsx
// Alamat di browser: /login (tanda kurung "(auth)" tidak ikut masuk ke URL)
```

> **Tips Santai:** Tanda kurung kurawal seperti `[id]` digunakan saat isi alamat URL berubah-ubah tergantung data barang atau artikel yang dipilih pengunjung!

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting yang Perlu Diingat

1. **Next.js adalah React Siap Pakai**: Kita tidak perlu lagi repot mengatur router atau optimasi manual, semuanya sudah siap dibangun.
2. **Secara Bawaan Sangat Ringan**: Semua komponen otomatis berjalan di server; gunakan tulisan `'use client'` hanya pada komponen yang memiliki tombol interaktif atau form ketik.
3. **Bikin Halaman Sangat Mudah**: Cukup buat folder baru di dalam `app/` dan tambahkan file `page.tsx` di dalamnya, halaman Antum langsung aktif!
