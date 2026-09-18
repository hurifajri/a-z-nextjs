---
layout: intro
badge: "MODUL 03"
badgeColor: "pink"
level: 1
---

## 03. Navigasi & Routing Dinamis

Membuat Rute URL Fleksibel Berdasarkan ID, Mengenal Catch-All Routes, Serta Menguasai Link dan Hook Navigasi.

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
layout: two-cols
---

### Navigasi Deklaratif: Komponen `<Link>`

Cara Standar dan Optimal Berpindah Halaman di Next.js

::left::

#### Mengapa Bukan Tag `<a>` Biasa?

```tsx
// ❌ Do not use standard anchor tag
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

- ⚡ Navigasi instan di sisi klien
- 🚀 **Prefetching Otomatis**: Konten halaman tujuan di-load saat link terlihat di layar!
- Menjaga state aplikasi tetap awet

---
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

### Praktek: Active Link di Navbar

Memberi Tanda Visual pada Menu Navigasi yang Sedang Aktif

```tsx {1-3|6|8|12-14|all}
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="flex gap-4 p-4 border-2 border-black bg-white">
      {links.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded font-bold border-2 transition-all ${
              isActive
                ? "bg-[#FFE600] border-black shadow-[2px_2px_0px_#000]"
                : "border-transparent hover:border-black"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade
---

## 3 Hal Penting dari Modul 03

1. **Dynamic Segments `[id]`**: Menggunakan kurung siku untuk menangani ribuan halaman berkonten dinamis hanya dengan satu folder template.
2. **Prioritaskan `<Link>`**: Selalu gunakan komponen `Link` dari `next/link` agar navigasi terasa instan berkat optimasi prefetching otomatis.
3. **Kombinasi Hook Navigasi**: Gunakan `useRouter()` untuk aksi programatik, serta `usePathname()` untuk membuat penanda rute aktif pada navbar.
