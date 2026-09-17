---
layout: intro
badge: "MODUL 12"
badgeColor: "cyan"
---

## 12. UI Lanjutan — Data Dinamis, Responsive, dan Figma to Code

Menampilkan data dinamis (filter, search, pagination), membangun layout responsif, dan menerjemahkan desain Figma ke kode.

---

### Menampilkan Data: Table vs Card

Pilih format tampilan yang sesuai dengan jenis data

<v-switch>
<template #1>

#### 📊 Table — Untuk data terstruktur

```tsx
<table className="w-full border-2 border-black">
  <thead className="bg-yellow-300">
    <tr>
      <th className="p-2 border">Nama</th>
      <th className="p-2 border">Email</th>
      <th className="p-2 border">Role</th>
    </tr>
  </thead>
  <tbody>
    {users.map(u => (
      <tr key={u.id}>
        <td className="p-2 border">{u.name}</td>
        <td className="p-2 border">{u.email}</td>
        <td className="p-2 border">{u.role}</td>
      </tr>
    ))}
  </tbody>
</table>
```

</template>
<template #2>

#### 🃏 Card Grid — Untuk data visual

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(p => (
    <div key={p.id} className="border-2 border-black rounded-lg p-4">
      <img src={p.image} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold mt-2">{p.name}</h3>
      <p className="text-gray-600">Rp {p.price.toLocaleString()}</p>
    </div>
  ))}
</div>
```

</template>
</v-switch>

---

### Fitur Search dan Filter

Mencari dan memfilter data secara real-time

````md magic-move
```tsx
// 1. State dasar untuk search
"use client"
export default function ProductList({ products }) {
  const [search, setSearch] = useState("")

  return (
    <div>
      <input placeholder="Cari produk..."
        value={search}
        onChange={e => setSearch(e.target.value)} />
    </div>
  )
}
```
```tsx
// 2. Filter data berdasarkan search
"use client"
export default function ProductList({ products }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("semua")

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "semua" || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div>
      <input placeholder="Cari..." value={search}
        onChange={e => setSearch(e.target.value)} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="semua">Semua</option>
        <option value="elektronik">Elektronik</option>
        <option value="fashion">Fashion</option>
      </select>
      <p>{filtered.length} produk ditemukan</p>
    </div>
  )
}
```
````

---

### Pagination: Navigasi Halaman Data

Menampilkan data dalam beberapa halaman agar tidak terlalu panjang

```tsx {2-4|6-8|10-17|all}
"use client"
export default function PaginatedList({ items }) {
  const [page, setPage] = useState(1)
  const perPage = 10

  // Potong data sesuai halaman aktif
  const totalPages = Math.ceil(items.length / perPage)
  const displayed = items.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      {displayed.map(item => <ItemCard key={item.id} item={item} />)}

      <div className="flex gap-2 mt-4 justify-center">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ← Sebelumnya
        </button>
        <span className="font-bold">{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Selanjutnya →
        </button>
      </div>
    </div>
  )
}
```

---

### Loading Skeleton dan Empty State

Komponen pendukung untuk pengalaman pengguna yang baik

```tsx
// Skeleton loading — placeholder animasi saat data belum siap
function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-40 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
```

```tsx
// Empty state — pesan informatif saat data kosong
function EmptyState({ message = "Data tidak ditemukan" }) {
  return (
    <div className="text-center py-12">
      <span className="text-4xl">📭</span>
      <p className="font-bold mt-2">{message}</p>
      <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian.</p>
    </div>
  )
}
```

---

### Dari Figma ke Kode

Alur kerja menerjemahkan desain menjadi kode Tailwind

<v-clicks>

1. **Inspect Elemen** — Klik elemen di Figma, lihat panel Properties (ukuran, warna, jarak).
2. **Catat Spacing** — Padding, margin, gap → terjemahkan ke `p-4`, `m-2`, `gap-3`.
3. **Catat Warna** — Hex color → cari padanan Tailwind terdekat (`#3B82F6` → `bg-blue-500`).
4. **Catat Tipografi** — Font size, weight → `text-lg`, `font-bold`.
5. **Susun Struktur** — Tentukan layout: Flex atau Grid → `flex`, `grid grid-cols-3`.
6. **Build Responsive** — Mulai dari mobile, tambahkan breakpoint (`md:`, `lg:`).

</v-clicks>

---
layout: two-cols
---

### Responsive dengan Tailwind

Mobile-first: mulai dari layar kecil, lalu perbesar

::left::

#### Breakpoints Tailwind

| Prefix | Min Width | Contoh |
|:-------|:----------|:-------|
| _(tanpa)_ | 0px | Mobile |
| `sm:` | 640px | Tablet kecil |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |

::right::

#### Contoh Responsive Grid

```tsx {2|all}
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
  {products.map(p => (
    <ProductCard key={p.id} product={p} />
  ))}
</div>
```

- 📱 Mobile: 1 kolom
- 📱 Tablet: 2 kolom
- 💻 Laptop: 3 kolom
- 🖥️ Desktop: 4 kolom

---

### Pola Responsive Umum

Teknik-teknik yang sering digunakan di project nyata

```tsx
{/* 1. Sembunyikan/tampilkan elemen */}
<div className="hidden md:block">Menu Desktop</div>
<div className="block md:hidden">☰ Menu Mobile</div>

{/* 2. Ubah arah flex */}
<div className="flex flex-col md:flex-row gap-4">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Konten</main>
</div>

{/* 3. Ukuran teks responsif */}
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Judul Responsif
</h1>

{/* 4. Padding responsif */}
<div className="p-4 md:p-8 lg:p-12">
  Konten dengan padding yang menyesuaikan layar
</div>
```

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 12

1. **Search + Filter + Pagination**: Kombinasi tiga fitur ini membuat pengelolaan data besar jadi ramah pengguna. Jangan lupa skeleton loading dan empty state!
2. **Figma → Tailwind**: Inspect elemen di Figma, catat spacing/warna/tipografi, lalu terjemahkan langsung ke utility classes Tailwind.
3. **Mobile-First**: Tulis class untuk mobile dulu, tambahkan `md:` dan `lg:` untuk layar lebih besar. Tailwind membuat responsive design jadi sangat mudah.
