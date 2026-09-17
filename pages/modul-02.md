---
layout: intro
badge: "MODUL 02"
badgeColor: "cyan"
---

## 02. Struktur App Router & Routing

Memahami Fondasi App Router, Perbedaan dengan Pages Router, Konvensi File Khusus, dan Pembuatan Rute Halaman.

---
layout: two-cols
---

### Pages Router vs App Router

Evolusi Besar Cara Mengatur Halaman di Next.js

::left::

#### Pages Router _(Cara Lama)_

Struktur berbasis file di dalam folder `pages/`:

```text
pages/
  ├── index.tsx       → /
  ├── about.tsx        → /about
  ├── _app.tsx        → Layout global
  └── blog/
      └── [slug].tsx   → /blog/:slug
```

- Komponen otomatis berjalan di sisi client
- Pengaturan layout bertingkat terbatas
- Menggunakan `getServerSideProps` / `getStaticProps`

::right::

#### App Router _(Standar Baru)_

Struktur berbasis folder di dalam `app/`:

```text
app/
  ├── layout.tsx      → Kerangka global
  ├── page.tsx         → /
  ├── about/
  │   └── page.tsx     → /about
  └── blog/
      └── [slug]/
          └── page.tsx → /blog/:slug
```

- Komponen berjalan di server secara default
- Nested Layouts sangat fleksibel dan intuitif
- Mendukung streaming dan komponen asynchronous

---

### Prinsip Utama: Folder Adalah Rute!

Cukup Buat Folder Baru, Alamat URL Website Otomatis Tercipta

Di Next.js App Router, setiap **folder** di dalam direktori `app/` mewakili satu segmen URL.

```text {1|2|3-4|5-6|7-8|all}
src/app/
├── page.tsx               → URL: / (Halaman Beranda)
├── tentang/
│   └── page.tsx           → URL: /tentang
├── kontak/
│   └── page.tsx           → URL: /kontak
└── layanan/
    └── page.tsx           → URL: /layanan
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  📌 <strong>Aturan Emas:</strong> Suatu rute hanya dapat diakses pengunjung jika di dalam folder tersebut terdapat file bernama <code>page.tsx</code>!
</div>

---
layout: two-cols
---

### File Konvensi Khusus di Next.js

Nama-Nama File dengan Peran Otomatis Tanpa Perlu Setup Tambahan

::left::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FFE600] bg-black px-1.5 py-0.5 rounded text-xs mr-2">page.tsx</span>
    Tampilan utama halaman yang dapat diakses oleh pengunjung website.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#00E5FF] bg-black px-1.5 py-0.5 rounded text-xs mr-2">layout.tsx</span>
    Kerangka bersama (navbar/footer) yang tetap bertahan saat ganti halaman.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FF6B8B] bg-black px-1.5 py-0.5 rounded text-xs mr-2">loading.tsx</span>
    Tampilan sementara otomatis (skeleton/spinner) saat data sedang dimuat.
  </div>
</div>

::right::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#2ED573] bg-black px-1.5 py-0.5 rounded text-xs mr-2">error.tsx</span>
    Penanganan kendala teknis secara elegan agar seluruh web tidak crash.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#B388EB] bg-black px-1.5 py-0.5 rounded text-xs mr-2">not-found.tsx</span>
    Tampilan ramah 404 jika halaman yang dicari pengunjung tidak ditemukan.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-white bg-black px-1.5 py-0.5 rounded text-xs mr-2">route.ts</span>
    Jalur penyedia API jika ingin membuat endpoint data backend sendiri.
  </div>
</div>

---

### Anatomi Root Layout (`app/layout.tsx`)

File Wajib yang Menjadi Fondasi HTML Seluruh Website

```tsx {1-5|7-11|all}
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased font-sans">
        <header className="border-b p-4">Navbar Utama</header>
        <main>{children}</main>
        <footer className="border-t p-4 text-center">Footer © 2026</footer>
      </body>
    </html>
  )
}
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  💡 Root Layout bersifat <strong>wajib</strong> dan harus mendefinisikan tag <code>&lt;html&gt;</code> dan <code>&lt;body&gt;</code>. File ini membungkus semua halaman yang ada di website Antum.
</div>

---

### Hierarki Komponen di App Router

Bagaimana Next.js Menggabungkan File-File Khusus Menjadi Satu Tampilan Utuh

Saat pengunjung membuka sebuah alamat rute, Next.js menyusun komponen secara berlapis:

```text
<RootLayout>
  <NestedLayout>
    <Loading> (saat mengambil data)
      <ErrorBoundary (error.tsx)>
        <Page> (page.tsx)
      </ErrorBoundary>
    </Loading>
  </NestedLayout>
</RootLayout>
```

<div v-click class="mt-4 brutal-card bg-yellow-100 p-3 text-sm border-2 border-black">
  ⚡ Saat berpindah menu, komponen <code>&lt;RootLayout&gt;</code> dan <code>&lt;NestedLayout&gt;</code> <strong>tidak akan dimuat ulang (re-rendered)</strong>. Hanya bagian <code>&lt;Page&gt;</code> yang berganti!
</div>

---
layout: two-cols
---

### Route Groups `(namaFolder)`

Merapikan Struktur Folder Tanpa Mengubah Alamat URL

Gunakan tanda **kurung bulat** untuk mengelompokkan folder:

```text
src/app/
├── (publik)/
│   ├── layout.tsx         ← Navbar Publik
│   ├── page.tsx           → /
│   └── tentang/page.tsx   → /tentang
└── (dashboard)/
    ├── layout.tsx         ← Sidebar Dashboard
    └── profil/page.tsx    → /profil
```

::right::

#### Manfaat Route Groups

<v-clicks>

- 🎯 **URL Bersih**: Tanda kurung `(publik)` dan `(dashboard)` tidak masuk ke alamat URL.
- 🎨 **Layout Berbeda**: Bagian dashboard bisa punya sidebar admin, sedangkan bagian publik punya navbar biasa.
- 📂 **Organisasi Proyek**: Sangat rapi ketika aplikasi semakin besar dan kompleks.

</v-clicks>

---

### Colocation & Private Folders

Menaruh Komponen dan Utility Dekat dengan Halamannya

Di App Router, Antum bebas menaruh file pendukung di dalam folder rute:

````md magic-move
```text
// 1. Colocation: File selain page.tsx tidak akan jadi rute
src/app/dashboard/
├── page.tsx               → URL: /dashboard
├── tombol-export.tsx      → Komponen helper (Bukan rute!)
└── use-dashboard.ts       → Custom hook (Bukan rute!)
```
```text
// 2. Private Folders: Folder berawalan underscore diabaikan dari routing
src/app/
├── _components/           → Seluruh folder ini privat!
│   └── Navbar.tsx
├── _lib/                  → Fungsi bantuan privat
│   └── format-rupiah.ts
└── dashboard/
    └── page.tsx           → URL: /dashboard
```
````

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🛡️ Folder yang diawali garis bawah `_nama` secara otomatis dikecualikan dari sistem routing Next.js.
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 02

1. **Folder Adalah Rute**: Cukup buat folder baru dengan file `page.tsx` di dalamnya untuk melahirkan halaman baru di website.
2. **File Konvensi Bawaan**: Gunakan `layout.tsx` untuk kerangka bersama, `loading.tsx` untuk indikator tunggu, dan `error.tsx` untuk penanganan error.
3. **Route Groups & Colocation**: Gunakan tanda kurung `(group)` untuk fleksibilitas layout tanpa mengubah URL, dan letakkan komponen pendukung langsung di samping halamannya.
