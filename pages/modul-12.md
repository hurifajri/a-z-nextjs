---
layout: intro
badge: "MODUL 12"
badgeColor: "cyan"
level: 1
---

## 12. UI Lanjutan: Desain Sistem, shadcn/ui & Responsive

Penyajian data dinamis, alur kerja Figma to Code, bahaya membuat komponen aksesibel dari nol, lanskap UI Library (shadcn/ui vs MUI), serta tradeoff styling, aksesibilitas, dan responsivitas.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
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
      <th scope="col" className="p-2 border">
        Name
      </th>
      <th scope="col" className="p-2 border">
        Email
      </th>
      <th scope="col" className="p-2 border">
        Role
      </th>
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
      <img
        src={p.image}
        alt={p.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-bold mt-2">{p.name}</h3>
      <p className="text-gray-600">${p.price.toLocaleString()}</p>
    </div>
  ))}
</div>
```

</template>
</v-switch>

---
class: module-content
---

### Fitur Search, Filter & Pagination

Fragment dalam Client Component; cocok untuk dataset kecil yang sudah dimuat

```tsx
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const pageSize = 10;
const filtered = products.filter((p) =>
  p.name.toLowerCase().includes(search.toLowerCase()),
);
const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
const safePage = Math.min(page, pageCount);
const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

function changeSearch(value: string) {
  setSearch(value);
  setPage(1);
}
```

- Hubungkan input berlabel ke `changeSearch`; render `visible` dengan key ID.
- Previous disabled pada page 1; Next disabled pada `safePage === pageCount`.
- Tampilkan empty state ketika `filtered.length === 0`.
- Dataset besar: filter/pagination di server, simpan parameter di URL, batalkan request usang.

---
class: module-content
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

<BrutalCard class="bg-yellow-100 text-xs">
  ⚠️ Mengabaikan aspek aksesibilitas (a11y) membuat website Antum tidak dapat digunakan oleh jutaan penyandang disabilitas dan melanggar standar web internasional.
</BrutalCard>

<p class="text-xs text-gray-700 mt-4">
  Oleh karena itu, di industri kita memanfaatkan <strong>Accessible Primitive Libraries</strong> yang telah diuji oleh ribuan pakar!
</p>

---
class: module-content
layout: two-cols
---

### Lanskap UI Library di Dunia React

Dari Komponen Monolitik Menuju Era Headless & Copy-Paste

::left::

#### 🏢 1. Framework Klasik (MUI, Ant Design, Mantine)

- **Kelebihan**: Komponen siap pakai sangat lengkap.
- **Tradeoff**: Pelajari theming, kebutuhan bundle, dan integrasi SSR; ukur sesuai komponen yang digunakan.

#### 🪓 2. Headless UI (Radix UI, React Aria)

- Hanya menyediakan **perilaku interaksi dan fondasi aksesibilitas** tanpa styling CSS apapun.

::right::

#### 🌟 3. Komponen dengan Source Code: `shadcn/ui`

- Memiliki pilihan primitive **Radix UI / Base UI**; cek basis komponen dan preset yang dipilih.
- **Bukan package npm black-box**: Kodenya di-copy langsung ke dalam folder `components/ui/` proyek Antum!
- 🎨 **Kontrol Penuh**: Antum bebas mengedit kode komponen sesuka hati tanpa dibatasi oleh aturan library.
- ⚡ Sangat digemari di ekosistem Next.js modern!

---
class: module-content
---

### Memilih Pendekatan Styling

| Pendekatan           | Kelebihan                                   | Perlu diperhatikan                   |
| :------------------- | :------------------------------------------ | :----------------------------------- |
| CSS / CSS Modules    | Scoped styling, tanpa runtime styling JS    | Konvensi token dan organisasi        |
| Tailwind v4          | Utility, token CSS-first, output saat build | Class harus terdeteksi saat build    |
| Runtime CSS-in-JS    | Styling berbasis props, ekosistem komponen  | Dukungan streaming/RSC per library   |
| Build-time CSS-in-JS | Ekstraksi CSS saat build                    | Tooling dan kompatibilitas framework |

- CSS-in-JS tidak ditinggalkan seluruh industri; kebutuhan proyek berbeda.
- Library dengan runtime client tidak otomatis bisa dijalankan di Server Component.
- Pertahankan token warna, spacing, tipografi, focus, dan state komponen.

<!--
Sumber: https://nextjs.org/docs/app/guides/css-in-js
-->

---
class: module-content
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
class: module-content
---

### Checkpoint UI: Data, Keyboard, dan Layar Kecil

- Dataset kecil boleh difilter lokal; dataset besar memakai query, sort, dan pagination server.
- Simpan filter/page di URL dan reset page saat filter berubah.
- Table: caption, header dengan `scope`, dan container scroll pada layar sempit.
- Dialog: label, fokus awal, Escape, serta kembalikan fokus ke pemicu setelah tutup.
- Uji keyboard, zoom 200%, kontras, reduced motion, dan loading/error/empty state.
- Primitive aksesibel membantu; komposisi dan modifikasi aplikasi tetap harus diuji.

**Latihan:** gunakan hanya keyboard untuk mencari data, membuka dialog, membatalkan, dan kembali ke tombol pemicu.

<!--
Sumber: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 12

1. **Manfaatkan Accessible Primitives**: Jangan membuat modal/dropdown kompleks dari nol murni. Manfaatkan _headless UI_ seperti Radix UI atau `shadcn/ui` agar website ramah disabilitas dan sesuai standar WAI-ARIA.
2. **Pilih Styling sesuai Kebutuhan**: CSS Modules dan Tailwind tidak memerlukan runtime styling JS; CSS-in-JS perlu pemeriksaan kompatibilitas library.
3. **Desain Responsif Mobile-First**: Mulai menulis style untuk layar ponsel, lalu gunakan breakpoint (`md:`, `lg:`) untuk menyesuaikan tampilan di layar komputer.
