---
layout: intro
badge: "MODUL 03"
badgeColor: "pink"
level: 1
---

## 03. Navigasi & Routing Dinamis

Membuat Rute URL Fleksibel Berdasarkan ID, Mengenal Catch-All Routes, Serta Menguasai Link dan Hook Navigasi.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
---

### Kebutuhan Halaman Dinamis

Ketika URL Harus Mengikuti Data Produk, Artikel, atau Profil Pengguna

Bayangkan Antum punya 1.000 produk di toko online:

```text
/products/gaming-laptop
/products/wireless-mouse
/products/mechanical-keyboard
... 997 other products
```

<BrutalCard v-click class="mt-4 bg-yellow-100">
  🤔 <strong>Apakah kita harus membuat 1.000 folder satu per satu?</strong><br/>
  Tentu tidak! Di sinilah kita menggunakan fitur <strong>Dynamic Routes</strong> dengan tanda kurung siku <code>[id]</code>.
</BrutalCard>

---
class: module-content
---

### Membuat Dynamic Route (`[slug]`)

Satu Template Folder untuk Menangani Ribuan Halaman Berbeda

Cukup buat folder dengan kurung siku: `app/products/[id]/page.tsx`

```tsx {1-3|5-12|all}
// app/products/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Product ID: {id}</h1>
      <p>Product details fetched based on the URL parameter above.</p>
    </div>
  );
}
```

<BrutalCard v-click class="mt-4">
  💡 Di Next.js terbaru, properti <code>params</code> bersifat <code>Promise</code> sehingga perlu di-<code>await</code> terlebih dahulu sebelum diambil nilainya.
</BrutalCard>

---
class: module-content
---

### Variasi Segmen Dinamis

Pilihan Pola Dynamic Routes Sesuai Kebutuhan Aplikasi

| Pola Folder                     | Contoh URL yang Cocok             | Nilai `params` yang Diterima                            |
| :------------------------------ | :-------------------------------- | :------------------------------------------------------ |
| `products/[id]`                 | `/products/react-handbook`        | `{ id: 'react-handbook' }`                              |
| `blog/[...slug]` _(Catch-all)_  | `/blog/2026/09/nextjs-tips`       | `{ slug: ['2026', '09', 'nextjs-tips'] }`               |
| `docs/[[...slug]]` _(Optional)_ | `/docs` atau `/docs/installation` | `{ slug: undefined }` atau `{ slug: ['installation'] }` |

<BrutalCard v-click class="mt-4 text-xs">
  📌 Gunakan <code>[...slug]</code> saat rute memiliki kedalaman bertingkat yang bervariasi (seperti rubrik artikel atau struktur dokumentasi panduan).
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Navigasi Deklaratif: Komponen `<Link>`

Cara Standar dan Optimal Berpindah Halaman di Next.js

::left::

#### Mengapa Bukan Tag `<a>` Biasa?

```tsx
// Valid untuk full navigation; gunakan Link untuk navigasi internal biasa
<a href="/about">About</a>
```

- Memaksa browser reload penuh dari nol
- State aplikasi hilang
- Terasa lambat dan ada kedipan layar

::right::

#### Gunakan `next/link`

```tsx
// ✅ Use built-in Link component
import Link from "next/link";

<Link href="/about">About</Link>;
```

- ⚡ Navigasi sisi klien tanpa reload dokumen penuh
- 🚀 **Prefetching Otomatis**: Berjalan di production; cakupan prefetch bergantung jenis rute dan konfigurasi.
- State pada shared layout dapat bertahan; remount tetap dapat mereset state

---
class: module-content
layout: two-cols
---

### Navigasi Programatik: Hook `useRouter`

Melakukan Perpindahan Halaman Melalui Logika Kode (Event/Fungsi)

::left::

#### Kapan Menggunakan `useRouter`?

Gunakan saat navigasi harus menunggu sebuah proses selesai:

- Setelah pengguna selesai klik tombol submit login
- Setelah data form berhasil disimpan ke backend
- Saat terjadi redirect akibat error atau validasi

::right::

#### Contoh Implementasi

```tsx {1-2|6|9|all}
"use client";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const router = useRouter();

  async function handlePayment() {
    await processPayment();
    router.push("/success"); // Navigate!
  }

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---
class: module-content
---

### Tiga Hook Navigasi Esensial

Hook Pendukung dari Paket `next/navigation` untuk Client Component

````md magic-move
```tsx
// 1. useRouter — Programmatic navigation control
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/new-page"); // Navigate to page
router.replace("/home"); // Navigate without history
router.back(); // Go back to previous page
router.refresh(); // Refresh current route data
```

```tsx
// 2. usePathname — Get currently active URL path
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname();
// If browser is at /products/gaming-laptop → pathname is "/products/gaming-laptop"
```

```tsx
// 3. useSearchParams — Read query parameters (?category=electronics)
"use client";
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const query = searchParams.get("q");
const sort = searchParams.get("sort");
```
````

---
zoom: 0.93
class: module-content
---

### Praktek: Active Link di Navbar

Nama rute terlihat jelas dan status aktif dapat dibaca screen reader

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
```

Gunakan selector CSS `[aria-current="page"]` untuk gaya aktif. Contoh ini mencocokkan URL persis.

---
class: module-content
---

### URL adalah State yang Bisa Dibagikan

- Simpan search, filter, sort, dan page di URL bila harus bertahan saat reload.
- `searchParams` pada server page adalah Promise; validasi nilai sebelum query.
- `useSearchParams()` dipakai di Client Component; rute statis perlu boundary `Suspense` yang sesuai.
- `router.refresh()` meminta ulang RSC; tidak otomatis menghapus cache server.
- Jangan berikan URL tak tepercaya langsung ke `router.push()` / `replace()`.

```tsx
// Fragment di dalam event handler Client Component
const query = new URLSearchParams(searchParams.toString());
query.set("q", keyword);
query.delete("page"); // Reset pagination ketika filter berubah
router.replace(`${pathname}?${query.toString()}`);
```

<!--
Sumber: https://nextjs.org/docs/app/api-reference/functions/use-search-params
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade
---

## 3 Hal Penting dari Modul 03

1. **Dynamic Segments `[id]`**: Menggunakan kurung siku untuk menangani ribuan halaman berkonten dinamis hanya dengan satu folder template.
2. **Prioritaskan `<Link>`**: Gunakan `Link` untuk navigasi internal; `<a>` cocok untuk URL eksternal dan download. Prefetch tidak menjamin semua data langsung siap.
3. **Kombinasi Hook Navigasi**: Gunakan `useRouter()` untuk aksi programatik, serta `usePathname()` untuk membuat penanda rute aktif pada navbar.

<!--
Checkpoint: Navigasi yang Bisa Dibagikan
Ubah filter di URL, reload, lalu gunakan back/forward. Rute aktif harus memiliki aria-current dan state URL tetap konsisten.
Sumber primer: https://nextjs.org/docs/app/getting-started/linking-and-navigating
Audit: 25 September 2026.
-->
