---
layout: intro
badge: "MODUL 03"
badgeColor: "pink"
---

## 03. Navigasi dan Routing Dinamis

Membuat halaman dinamis, layout bertingkat, serta menavigasi antar halaman dengan Link, useRouter, dan usePathname.

---

### Routing di App Router

Folder = Rute Halaman Website Antum

Di Next.js App Router, setiap **folder** di dalam `app/` otomatis menjadi sebuah rute URL. Tidak perlu konfigurasi router manual!

```text {1|2-3|4-5|6-8|all}
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/tips-nextjs
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  📌 <strong>Aturan Emas:</strong> Hanya file bernama <code>page.tsx</code> yang akan dirender sebagai halaman. File lain di folder itu (komponen helper, utils) tidak akan menjadi rute.
</div>

---

### Dynamic Routes

Halaman yang kontennya berubah-ubah berdasarkan URL

Gunakan tanda **kurung siku** `[param]` untuk membuat rute dinamis:

```tsx {1-4|6-7|all}
// app/produk/[id]/page.tsx
// Bisa diakses: /produk/1, /produk/laptop-gaming, dll.

export default async function DetailProduk({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <h1>Detail Produk: {id}</h1>
}
```

<div v-click class="mt-3 grid grid-cols-2 gap-3 text-xs">
  <div class="brutal-card bg-white p-2">
    <code>[id]</code> — Satu segmen dinamis<br/>
    <span class="text-gray-500">/produk/<strong>123</strong></span>
  </div>
  <div class="brutal-card bg-white p-2">
    <code>[...slug]</code> — Catch-all segments<br/>
    <span class="text-gray-500">/docs/<strong>a/b/c</strong></span>
  </div>
</div>

---

### Route Groups

Mengelompokkan halaman tanpa memengaruhi URL

Gunakan tanda **kurung bulat** `(nama)` untuk membuat folder organisasi yang **tidak muncul di URL**:

```text
app/
├── (marketing)/
│   ├── about/page.tsx       → /about
│   └── pricing/page.tsx     → /pricing
├── (dashboard)/
│   ├── settings/page.tsx    → /settings
│   └── profile/page.tsx     → /profile
```

<v-clicks>

- ✅ Folder `(marketing)` dan `(dashboard)` **tidak muncul** di URL
- ✅ Setiap group bisa punya **layout sendiri** (`layout.tsx`)
- ✅ Cocok untuk memisahkan area publik vs area login

</v-clicks>

---

### Layout: Kerangka Halaman Bersama

Navbar, sidebar, dan footer yang tidak me-reload saat pindah halaman

```tsx {2-3|5-11|all}
// app/layout.tsx — Layout utama seluruh website
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <nav>Navbar Global</nav>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🔑 <strong>Poin Penting:</strong> Saat pindah halaman, layout <strong>tidak di-render ulang</strong>! Hanya konten <code>{children}</code> yang berganti. Ini membuat navigasi terasa instan.
</div>

---

### Nested Layouts

Setiap folder bisa memiliki layout tersendiri

```text
app/
├── layout.tsx              ← Layout utama (navbar + footer)
├── page.tsx
└── dashboard/
    ├── layout.tsx          ← Layout dashboard (sidebar)
    └── page.tsx
```

````md magic-move
```tsx
// app/layout.tsx — Navbar + Footer
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```
```tsx
// app/dashboard/layout.tsx — Tambah Sidebar
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}
// Hasil: Navbar > Sidebar + Konten > Footer
```
````

---
layout: two-cols
---

### Navigasi: Link vs useRouter

Dua cara berpindah halaman di Next.js

::left::

#### Komponen `Link` (Deklaratif)

Untuk navigasi yang terlihat oleh pengguna:

```tsx {1|4-5|all}
import Link from "next/link"

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Beranda</Link>
      <Link href="/about">Tentang</Link>
      <Link href="/blog/tips-nextjs">
        Baca Artikel
      </Link>
    </nav>
  )
}
```

- ✅ SEO-friendly (menghasilkan `<a>`)
- ✅ Auto **prefetch** halaman tujuan

::right::

#### Hook `useRouter` (Programatik)

Untuk navigasi melalui logika kode:

```tsx {1-2|5-8|all}
"use client"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()

  function handleLogin() {
    // ... proses login
    router.push("/dashboard")
  }

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  )
}
```

- ✅ Navigasi setelah submit form
- ✅ Redirect setelah proses selesai

---

### Hook Navigasi Penting

Tiga hook wajib untuk mengelola navigasi

```tsx {1-2|4-5|7-8|10-11|all}
"use client"
import { useRouter, usePathname, useParams } from "next/navigation"

// 1. useRouter — Navigasi programatik
const router = useRouter()
router.push("/halaman-baru")   // Pindah halaman
router.replace("/login")       // Pindah tanpa history
router.back()                  // Kembali ke halaman sebelumnya
router.refresh()               // Refresh data halaman saat ini

// 2. usePathname — Tahu halaman mana yang sedang aktif
const pathname = usePathname() // "/dashboard/settings"

// 3. useParams — Ambil parameter dari URL dinamis
const params = useParams()     // { id: "123" }
```

---

### Pola Aktif Link (Active Link)

Memberi tanda visual pada menu yang sedang aktif

```tsx {1-2|5|7-10|all}
"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function NavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={isActive
        ? "font-bold text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-black"
      }
    >
      {children}
    </Link>
  )
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  💡 Gunakan pattern ini untuk navbar agar pengguna tahu mereka sedang di halaman mana!
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 03

1. **Routing = Folder**: Buat folder di `app/` → otomatis jadi rute URL. Gunakan `[param]` untuk rute dinamis dan `(group)` untuk organisasi.
2. **Layout Bertingkat**: Setiap folder bisa punya `layout.tsx` sendiri yang tidak me-reload saat navigasi — cocok untuk navbar, sidebar, dan footer.
3. **Link untuk UI, useRouter untuk Logika**: Pakai `<Link>` di navigasi tampilan, pakai `useRouter()` untuk redirect setelah proses (login, submit form).
