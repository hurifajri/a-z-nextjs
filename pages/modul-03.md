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
/produk/laptop-gaming
/produk/mouse-wireless
/produk/keyboard-mechanical
... 997 produk lainnya
```

<div v-click class="mt-4 brutal-card bg-yellow-100 p-4 border-2 border-black">
  🤔 <strong>Apakah kita harus membuat 1.000 folder satu per satu?</strong><br/>
  Tentu tidak! Di sinilah kita menggunakan fitur <strong>Dynamic Routes</strong> dengan tanda kurung siku <code>[id]</code>.
</div>

---

### Membuat Dynamic Route (`[slug]`)

Satu Template Folder untuk Menangani Ribuan Halaman Berbeda

Cukup buat folder dengan kurung siku: `app/produk/[id]/page.tsx`

```tsx {1-3|5-12|all}
// app/produk/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailProduk({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Produk ID: {id}</h1>
      <p>Data barang diambil berdasarkan parameter URL di atas.</p>
    </div>
  );
}
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  💡 Di Next.js terbaru, properti <code>params</code> bersifat <code>Promise</code> sehingga perlu di-<code>await</code> terlebih dahulu sebelum diambil nilainya.
</div>

---

### Variasi Segmen Dinamis

Pilihan Pola Dynamic Routes Sesuai Kebutuhan Aplikasi

| Pola Folder                     | Contoh URL yang Cocok          | Nilai `params` yang Diterima                         |
| :------------------------------ | :----------------------------- | :--------------------------------------------------- |
| `produk/[id]`                   | `/produk/buku-react`           | `{ id: 'buku-react' }`                               |
| `blog/[...slug]` _(Catch-all)_  | `/blog/2026/09/tips-next`      | `{ slug: ['2026', '09', 'tips-next'] }`              |
| `docs/[[...slug]]` _(Optional)_ | `/docs` atau `/docs/instalasi` | `{ slug: undefined }` atau `{ slug: ['instalasi'] }` |

<div v-click class="mt-4 brutal-card bg-white p-3 text-xs">
  📌 Gunakan <code>[...slug]</code> saat rute memiliki kedalaman bertingkat yang bervariasi (seperti rubrik artikel atau struktur dokumentasi panduan).
</div>

---
layout: two-cols
---

### Navigasi Deklaratif: Komponen `<Link>`

Cara Standar dan Optimal Berpindah Halaman di Next.js

::left::

#### Mengapa Bukan Tag `<a>` Biasa?

```tsx
// ❌ Jangan gunakan tag anchor biasa
<a href="/tentang">Tentang</a>
```

- Memaksa browser reload penuh dari nol
- State aplikasi hilang
- Terasa lambat dan ada kedipan layar

::right::

#### Gunakan `next/link`

```tsx
// ✅ Gunakan komponen Link bawaan
import Link from "next/link";

<Link href="/tentang">Tentang</Link>;
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

export default function FormPembayaran() {
  const router = useRouter();

  async function prosesBayar() {
    await kirimPembayaran();
    router.push("/sukses"); // Pindah rute!
  }

  return (
    <button onClick={prosesBayar} className="brutal-btn">
      Bayar Sekarang
    </button>
  );
}
```

---

### Tiga Hook Navigasi Esensial

Hook Pendukung dari Paket `next/navigation` untuk Client Component

````md magic-move
```tsx
// 1. useRouter — Mengendalikan navigasi secara programatik
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/halaman-baru"); // Pindah halaman
router.replace("/beranda"); // Pindah tanpa menyimpan history mundur
router.back(); // Kembali ke halaman sebelumnya
router.refresh(); // Muat ulang data rute saat ini
```

```tsx
// 2. usePathname — Mengetahui alamat URL yang sedang aktif
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname();
// Jika browser di /produk/laptop-gaming → pathname bernilai "/produk/laptop-gaming"
```

```tsx
// 3. useSearchParams — Mengambil parameter query (?kategori=elektronik)
"use client";
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const cari = searchParams.get("q");
const urutkan = searchParams.get("sort");
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
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Katalog Produk" },
    { href: "/tentang", label: "Tentang Kami" },
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
