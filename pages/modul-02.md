---
layout: intro
badge: "MODUL 02"
badgeColor: "cyan"
level: 1
---

## 02. Struktur App Router & Routing

Memahami Fondasi App Router, Perbedaan dengan Pages Router, Konvensi File Khusus, dan Pembuatan Rute Halaman.

---
class: module-content
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

- Mendukung SSR/SSG; komponen kemudian di-hydrate di browser
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
class: module-content
---

### Prinsip Utama: Folder Adalah Rute!

Folder membentuk segmen; page.tsx mengekspos halaman, route.ts mengekspos endpoint

Di Next.js App Router, setiap **folder** di dalam direktori `app/` mewakili satu segmen URL.

```text {1|2|3-4|5-6|7-8|all}
src/app/
├── page.tsx               → URL: / (Home Page)
├── about/
│   └── page.tsx           → URL: /about
├── contact/
│   └── page.tsx           → URL: /contact
└── services/
    └── page.tsx           → URL: /services
```

<BrutalCard v-click class="mt-4">
  📌 <strong>Aturan Emas:</strong> Halaman UI memerlukan <code>page.tsx</code>; endpoint HTTP memakai <code>route.ts</code>. Keduanya tidak boleh berada pada segmen URL yang sama.
</BrutalCard>

---
class: module-content
layout: two-cols
---

### File Konvensi Khusus di Next.js

Nama-Nama File dengan Peran Otomatis Tanpa Perlu Setup Tambahan

::left::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-yellow bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">page.tsx</span>
    Tampilan utama halaman yang dapat diakses oleh pengunjung website.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-cyan bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">layout.tsx</span>
    Kerangka bersama (navbar/footer) yang tetap bertahan saat ganti halaman.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-pink bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">loading.tsx</span>
    Tampilan sementara otomatis (skeleton/spinner) saat data sedang dimuat.
  </div>
</div>

::right::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-green bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">error.tsx</span>
    Penanganan kendala teknis secara elegan agar seluruh web tidak crash.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-purple bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">not-found.tsx</span>
    Tampilan ramah 404 jika halaman yang dicari pengunjung tidak ditemukan.
  </div>
  <div class="p-3 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal-sm">
    <span class="font-black text-brutal-white bg-brutal-black px-1.5 py-0.5 rounded text-xs mr-2">route.ts</span>
    Jalur penyedia API jika ingin membuat endpoint data backend sendiri.
  </div>
</div>

::bottom::

<BrutalCard v-click class="mt-3 bg-purple-50 text-xs">
  🛡️ <strong>Next.js 16 File:</strong> File <code>proxy.ts</code> sejajar <code>app/</code> (di <code>src/</code> jika memakai src; pengganti middleware.ts) berfungsi sebagai gerbang penengah untuk auth guard & redirect sebelum request sampai ke halaman.
</BrutalCard>

---
class: module-content
---

### Anatomi Root Layout (`app/layout.tsx`)

File Wajib yang Menjadi Fondasi HTML Seluruh Website

```tsx {1-5|7-11|all}
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <header className="border-b p-4">Main Navbar</header>
        <main>{children}</main>
        <footer className="border-t p-4 text-center">Footer © 2026</footer>
      </body>
    </html>
  );
}
```

<BrutalCard v-click class="mt-4">
  💡 Root Layout bersifat <strong>wajib</strong> dan harus mendefinisikan tag <code>&lt;html&gt;</code> dan <code>&lt;body&gt;</code>. File ini membungkus semua halaman yang ada di website Antum.
</BrutalCard>

---
class: module-content
---

### Hierarki Komponen di App Router

Bagaimana Next.js Menggabungkan File-File Khusus Menjadi Satu Tampilan Utuh

Saat pengunjung membuka sebuah alamat rute, Next.js menyusun komponen secara berlapis:

```text
<RootLayout>
  <NestedLayout>
    <Loading> (fetching data)
      <ErrorBoundary (error.tsx)>
        <Page> (page.tsx)
      </ErrorBoundary>
    </Loading>
  </NestedLayout>
</RootLayout>
```

<BrutalCard v-click class="mt-4 bg-yellow-100">
  ⚡ Saat berpindah menu, komponen <code>&lt;RootLayout&gt;</code> dan <code>&lt;NestedLayout&gt;</code> <strong>tidak akan dimuat ulang (re-rendered)</strong>. Hanya bagian <code>&lt;Page&gt;</code> yang berganti!
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Route Groups `(folderName)`

Merapikan Struktur Folder Tanpa Mengubah Alamat URL

Gunakan tanda **kurung bulat** untuk mengelompokkan folder:

```text
src/app/
├── (public)/
│   ├── layout.tsx         ← Public Navbar
│   ├── page.tsx           → /
│   └── about/page.tsx     → /about
└── (dashboard)/
    ├── layout.tsx         ← Dashboard Sidebar
    └── profile/page.tsx   → /profile
```

::right::

#### Manfaat Route Groups

<v-clicks>

- 🎯 **URL Bersih**: Tanda kurung `(public)` dan `(dashboard)` tidak masuk ke alamat URL.
- 🎨 **Layout Berbeda**: Bagian dashboard bisa punya sidebar admin, sedangkan bagian publik punya navbar biasa.
- 📂 **Organisasi Proyek**: Sangat rapi ketika aplikasi semakin besar dan kompleks.

</v-clicks>

---
class: module-content
---

### Colocation & Private Folders

Menaruh Komponen dan Utility Dekat dengan Halamannya

Di App Router, Antum bebas menaruh file pendukung di dalam folder rute:

````md magic-move
```text
// 1. Colocation: Files other than page.tsx will not become routes
src/app/dashboard/
├── page.tsx               → URL: /dashboard
├── export-button.tsx      → Helper component (Not a route!)
└── use-dashboard.ts       → Custom hook (Not a route!)
```

```text
// 2. Private Folders: Folders with underscore prefix are excluded from routing
src/app/
├── _components/           → This entire folder is private!
│   └── Navbar.tsx
├── _lib/                  → Private helper functions
│   └── format-currency.ts
└── dashboard/
    └── page.tsx           → URL: /dashboard
```
````

<BrutalCard v-click class="mt-3">
  🛡️ Folder yang diawali garis bawah `_nama` secara otomatis dikecualikan dari sistem routing Next.js.
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Konvensi Penamaan File & Folder

Menyepakati Standar Agar Satu Tim Tidak Beda Gaya

::left::

#### Penamaan File

<v-clicks>

- **Komponen React** → `PascalCase` atau `kebab-case`
  `UserProfile.tsx` atau `user-profile.tsx`
  _(nama function tetap `PascalCase`)_
- **Hook, util, lib** → `kebab-case`
  `use-auth.ts`, `format-currency.ts`
- **Konstanta / config** → `kebab-case`
  `api-routes.ts`, `site-config.ts`
- **Type / interface** → `kebab-case`
  `user-types.ts`, `api-response.ts`

</v-clicks>

::right::

#### Penamaan di Kode (JavaScript/TypeScript)

<v-clicks>

- **Variabel & fungsi** → `camelCase`
  `userName`, `fetchUserData()`
- **Komponen React** → `PascalCase`
  `function UserProfile() {}`
- **Konstanta tetap** → `CONSTANT_CASE`
  `MAX_RETRY_COUNT`, `API_BASE_URL`
- **Type / Interface** → `PascalCase`
  `type UserResponse`, `interface ApiConfig`

</v-clicks>

<BrutalCard v-click class="mt-3 text-xs">
  💡 Tidak ada aturan mutlak — yang penting <strong>konsisten dalam satu proyek</strong>. Sepakati di awal bersama tim!
</BrutalCard>

---
class: module-content
---

### Strategi Pengelompokan File

Bagaimana Menata Ratusan File Agar Proyek Tetap Rapi dan Mudah Dinavigasi

<v-switch>
<template #1>

```text
// 📁 By Feature / Route (Recommended)
// All feature-related files are grouped in a single folder
src/app/dashboard/
├── page.tsx
├── DashboardChart.tsx
├── use-dashboard-data.ts
├── dashboard-types.ts
└── format-dashboard.ts
```

✅ Mudah dihapus, mudah dipahami — satu folder = satu fitur utuh

</template>
<template #2>

```text
// 📁 By Type (Less Scalable)
// Files grouped by file type
src/
├── components/
│   ├── DashboardChart.tsx
│   └── UserProfile.tsx
├── hooks/
│   ├── use-dashboard-data.ts
│   └── use-auth.ts
└── utils/
    └── format-dashboard.ts
```

⚠️ Terasa rapi di awal, tapi saat aplikasi membesar, satu fitur tersebar di banyak folder

</template>
</v-switch>

---
class: module-content
---

### Barrel Exports: Gunakan dengan Sengaja

Barrel file me-re-export modul melalui satu pintu masuk

```ts
// components/index.ts
export { Button } from "./Button";
export { Input } from "./Input";

// Direct import memudahkan penelusuran dependensi:
import { Button } from "@/components/Button";
```

- Barrel besar dapat menambah pekerjaan resolve dan memperlambat dev/build.
- Tree-shaking **tidak otomatis rusak**; hasil bergantung side effects dan bundler.
- Hindari mencampur modul server-only dan client dalam satu barrel.
- Barrel kecil untuk public API sebuah package tetap masuk akal.
- Ukur build dan bundle sebelum mengubah seluruh struktur import.

<!--
Sumber: https://nextjs.org/docs/app/guides/package-bundling
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 6 Hal Penting dari Modul 02

1. **Folder Adalah Rute**: Cukup buat folder baru dengan file `page.tsx` di dalamnya untuk melahirkan halaman baru di website.
2. **File Konvensi Bawaan**: Gunakan `layout.tsx` untuk kerangka bersama, `loading.tsx` untuk indikator tunggu, dan `error.tsx` untuk penanganan error.
3. **Route Groups & Colocation**: Gunakan tanda kurung `(group)` untuk fleksibilitas layout tanpa mengubah URL, dan letakkan komponen pendukung langsung di samping halamannya.
4. **Konvensi Penamaan**: File komponen boleh PascalCase atau kebab-case (nama function tetap PascalCase). Variabel `camelCase`, konstanta `CONSTANT_CASE`.
5. **Kelompokkan File per Fitur**: Kumpulkan semua file terkait fitur dalam satu folder — lebih scalable daripada mengelompokkan per tipe.
6. **Evaluasi Barrel Exports**: Pilih direct import untuk dependensi yang jelas; barrel kecil tetap berguna sebagai public API package.

<!--
Checkpoint: Routing dan Batas File
Buat /about dan /dashboard/settings dengan nested layout. Pastikan folder helper tidak menjadi URL dan route group tidak mengubah path.
Sumber primer: https://nextjs.org/docs/app/getting-started/project-structure
Audit: 25 September 2026.
-->
