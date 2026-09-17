---
layout: intro
badge: "MODUL 12"
badgeColor: "cyan"
level: 1
---

## 12. UI Lanjutan: Desain Sistem, shadcn/ui & Responsive

Penyajian data dinamis, alur kerja Figma to Code, bahaya membuat komponen aksesibel dari nol, lanskap UI Library (shadcn/ui vs MUI), serta sejarah pergeseran dari CSS-in-JS ke Tailwind.

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
    {users.map((u) => (
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
  {products.map((p) => (
    <div key={p.id} className="border-2 border-black rounded-lg p-4 bg-white">
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

### Fitur Search, Filter & Pagination

Mengelola Kumpulan Data Besar dengan Nyaman bagi Pengguna

````md magic-move
```tsx
// 1. Filter Real-Time berdasarkan kata kunci & kategori
"use client";
export default function ProductList({ products }) {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("semua");

  const hasilFilter = products.filter((p) => {
    const cocokNama = p.name.toLowerCase().includes(search.toLowerCase());
    const cocokKategori = kategori === "semua" || p.category === kategori;
    return cocokNama && cocokKategori;
  });

  return (
    <div>
      <input
        placeholder="Cari barang..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <p>{hasilFilter.length} produk ditemukan</p>
    </div>
  );
}
```

```tsx
// 2. Potong data menjadi beberapa halaman (Pagination)
const [halaman, setHalaman] = useState(1);
const perHalaman = 10;

const totalHalaman = Math.ceil(hasilFilter.length / perHalaman);
const dataTampil = hasilFilter.slice(
  (halaman - 1) * perHalaman,
  halaman * perHalaman,
);

return (
  <div>
    {dataTampil.map((p) => (
      <ProductCard key={p.id} item={p} />
    ))}
    <div className="flex gap-2 justify-center mt-4">
      <button disabled={halaman <= 1} onClick={() => setHalaman(halaman - 1)}>
        Sebelumnya
      </button>
      <span>
        {halaman} dari {totalHalaman}
      </span>
      <button
        disabled={halaman >= totalHalaman}
        onClick={() => setHalaman(halaman + 1)}
      >
        Selanjutnya
      </button>
    </div>
  </div>
);
```
````

---
layout: two-cols
---

### Bahaya Membuat Komponen Interaktif dari Nol

Mengapa Bikin Modal, Dropdown, atau Popover Sendiri Sering Menjadi Mimpi Buruk?

::left::

#### Masalah Aksesibilitas (WAI-ARIA)

Bikin kotak modal dengan CSS itu mudah, tetapi:

- ⌨️ **Keyboard Navigation**: Bisakah dibuka/tutup hanya dengan keyboard (Tab, Enter, Spasi)?
- 🔒 **Focus Trap**: Apakah kursor keyboard terkurung di dalam modal saat aktif, atau tembus ke halaman belakang?
- ⎋ **ESC Handler**: Apakah menekan tombol `Escape` otomatis menutup modal?
- 📢 **Screen Reader**: Apakah tunanetra dapat mendengar status popover "terbuka" atau "tertutup"?

::right::

#### Standar Industri

<div class="brutal-card bg-yellow-100 p-3 text-xs border-2 border-black">
  ⚠️ Mengabaikan aspek aksesibilitas (a11y) membuat website Antum tidak dapat digunakan oleh jutaan penyandang disabilitas dan melanggar standar web internasional.
</div>

<p class="text-xs text-gray-700 mt-4">
  Oleh karena itu, di industri kita memanfaatkan <strong>Accessible Primitive Libraries</strong> yang telah diuji oleh ribuan pakar!
</p>

---
layout: two-cols
---

### Lanskap UI Library di Dunia React

Dari Komponen Monolitik Menuju Era Headless & Copy-Paste

::left::

#### 🏢 1. Framework Klasik (MUI, Ant Design, Mantine)

- **Kelebihan**: Komponen siap pakai sangat lengkap.
- **Kekurangan**: Bundle JavaScript besar, styling kaku dengan tema bawaan, dan sulit diubah jika desainer punya aturan ketat di Figma.

#### 🪓 2. Headless UI (Radix UI, React Aria)

- Hanya menyediakan **logika & aksesibilitas 100%** tanpa styling CSS apapun.

::right::

#### 🌟 3. Standar Baru: `shadcn/ui`

- Dibangun di atas **Radix UI** + **Tailwind CSS**.
- **Bukan package npm black-box**: Kodenya di-copy langsung ke dalam folder `components/ui/` proyek Antum!
- 🎨 **Kontrol Penuh**: Antum bebas mengedit kode komponen sesuka hati tanpa dibatasi oleh aturan library.
- ⚡ Sangat digemari di ekosistem Next.js modern!

---

### Kilas Balik: Era CSS-in-JS & Mengapa Kini Ditinggalkan

Perjalanan Komunitas dari Styled Components Kembali ke Tailwind CSS

````md magic-move
```tsx
// 📜 ERA POPULER (2018–2022): CSS-in-JS (Styled-Components / Emotion)
import styled from "styled-components";

const TombolKeren = styled.button`
  background: ${(props) => (props.$primer ? "#FFE600" : "#FFFFFF")};
  border: 2px solid #000;
  padding: 8px 16px;
  font-weight: bold;
  &:hover {
    background: #ffd700;
  }
`;
// Dulu disukai karena style bisa dinamis mengikuti props JavaScript!
```

```tsx
// ⚠️ KENAPA SEKARANG DITINGGALKAN OLEH KOMUNITAS?
// 1. Runtime Performance: Browser sibuk menghitung CSS saat aplikasi berjalan
// 2. Ukuran JS Membengkak: Kode CSS dikirim sebagai file JavaScript
// 3. TIDAK KOMPATIBEL DENGAN SERVER COMPONENTS (RSC)!
//    CSS-in-JS butuh React Context di browser, sehingga tidak bisa berjalan di server!
```

```tsx
// ⚡ ERA SEKARANG: Tailwind CSS (Zero Runtime, Compile Time)
export default function TombolKeren({ primer }: { primer?: boolean }) {
  return (
    <button
      className={`border-2 border-black px-4 py-2 font-bold transition-all ${
        primer
          ? "bg-[#FFE600] hover:bg-[#FFD700]"
          : "bg-white hover:bg-gray-100"
      }`}
    >
      Klik Saya
    </button>
  );
}
// Zero-runtime, dikompilasi saat build time, ukuran CSS statis, 100% kompatibel dengan Server Components!
```
````

---
layout: two-cols
---

### Menerjemahkan Figma ke Tailwind CSS

Alur Kerja Kolaborasi Bersama Desainer UI/UX

::left::

#### Langkah Penerjemahan

1. **Buka Panel Inspect**: Cek ukuran padding, margin, dan border radius.
2. **Identifikasi Breakpoints**: Tentukan layout pada layar mobile, tablet, dan desktop.
3. **Konversi Warna**: Sambungkan warna hex desain ke palet warna Tailwind.
4. **Gunakan Flexbox & Grid**: Susun tata letak adaptif.

::right::

#### Breakpoints Tailwind (Mobile-First)

| Prefix      | Min Width | Target Layar                  |
| :---------- | :-------- | :---------------------------- |
| _(default)_ | 0px       | 📱 Layar Ponsel               |
| `sm:`       | 640px     | 📱 Ponsel Lebar / Mini Tablet |
| `md:`       | 768px     | 💻 Tablet / iPad              |
| `lg:`       | 1024px    | 🖥️ Laptop / Desktop           |
| `xl:`       | 1280px    | 🖥️ Layar Monitor Lebar        |

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
---

## 3 Hal Penting dari Modul 12

1. **Manfaatkan Accessible Primitives**: Jangan membuat modal/dropdown kompleks dari nol murni. Manfaatkan _headless UI_ seperti Radix UI atau `shadcn/ui` agar website ramah disabilitas dan sesuai standar WAI-ARIA.
2. **Kemenangan Tailwind atas CSS-in-JS**: Komunitas beralih dari Styled-Components kembali ke Tailwind CSS karena nol runtime, ukuran file lebih kecil, dan kompatibilitas penuh dengan Server Components Next.js.
3. **Desain Responsif Mobile-First**: Mulai menulis style untuk layar ponsel, lalu gunakan breakpoint (`md:`, `lg:`) untuk menyesuaikan tampilan di layar komputer.
