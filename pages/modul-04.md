---
layout: intro
badge: "MODUL 04"
badgeColor: "yellow"
level: 1
---

## 04. Server Components vs Client Components

Memahami paradigma baru di React Server Components — kapan komponen dijalankan di server dan kapan di browser.

---

### Default = Server Component

Di App Router, setiap komponen otomatis berjalan di server!

<v-switch>
<template #1>

**Sebelumnya (React Biasa / Pages Router)**

- Semua komponen dirender di browser (client-side)
- Seluruh JavaScript dikirim ke browser pengunjung
- Bundle makin besar seiring aplikasi tumbuh

</template>
<template #2>

**Sekarang (App Router)**

- Komponen dirender di **server** secara default
- _Zero client-side JavaScript_ untuk komponen statis!
- Hanya kode yang benar-benar interaktif dikirim ke browser ⚡

</template>
</v-switch>

---
layout: two-cols
---

### Perbandingan Server vs Client

Mari bandingkan keduanya secara langsung

::left::

#### 🖥️ Server Components

<v-clicks>

- ✅ **Default** — tidak perlu tambahan apapun
- ✅ Fetch data langsung ke database
- ✅ Akses file system, secret keys
- ✅ Bundle lebih ringan
- ❌ Tidak bisa `useState`, `useEffect`
- ❌ Tidak bisa `onClick`, `onChange`
- ❌ Tidak bisa akses `window`, `document`

</v-clicks>

::right::

#### 💻 Client Components

<v-clicks>

- ⚠️ Harus tambahkan `"use client"`
- ✅ Interaksi user (`onClick`, dll)
- ✅ State dan Lifecycle hooks
- ✅ Browser APIs (`localStorage`, dll)
- ✅ Custom hooks React
- ❌ Tidak bisa akses database langsung
- ❌ Tidak bisa menyimpan secret keys

</v-clicks>

---

### Menandai Client Component

Cukup tambahkan `"use client"` di baris paling atas!

```tsx {1|3|5-6|all}
"use client"; // 👈 Baris ini mengubah Server → Client!

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Diklik: {count} kali</button>
  );
}
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  ⚠️ <strong>Tanpa</strong> <code>"use client"</code>, kode di atas akan ERROR karena <code>useState</code> dan <code>onClick</code> tidak tersedia di Server Components!
</div>

---

### Evolusi Komponen: Server → Client

Lihat bagaimana kebutuhan interaksi mengubah tipe komponen

````md magic-move
```tsx
// 1. Server Component biasa — menampilkan data statis
export default function SearchBar() {
  return (
    <div>
      <input type="text" placeholder="Cari barang..." />
      <button>Cari</button>
    </div>
  );
}
```

```tsx
// 2. Butuh menyimpan input! useState = ERROR di server ❌
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input onChange={(e) => setQuery(e.target.value)} />
      <button>Cari: {query}</button>
    </div>
  );
}
```

```tsx
// 3. Solusi: tambahkan "use client" di paling atas ✅
"use client";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input onChange={(e) => setQuery(e.target.value)} />
      <button>Cari: {query}</button>
    </div>
  );
}
```
````

---

### Kapan Pakai Server vs Client?

Aturan praktis yang sederhana

<v-clicks>

1. **Apakah butuh interaksi user?** (Klik, Ketik, Hover) → _Client Component_
2. **Apakah butuh State atau Lifecycle?** (`useState`, `useEffect`) → _Client Component_
3. **Apakah pakai Browser APIs?** (Geolocation, localStorage) → _Client Component_
4. **Selain di atas?** → Biarkan tetap sebagai **Server Component**!

</v-clicks>

<div v-click class="mt-6 brutal-card bg-white p-4 text-center">
  💡 <strong>Tips Emas:</strong> Dorong Client Component sejauh mungkin ke <em>"daun"</em> terkecil di component tree Antum!
</div>

---
layout: two-cols
---

### Pola Praktis di Dunia Nyata

Pisahkan bagian statis (server) dan interaktif (client)

::left::

#### Server Page (`page.tsx`)

```tsx {2,5-6|8-11|all}
// app/produk/[id]/page.tsx
import AddToCart from "./AddToCart";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Ambil data langsung dari server!
  const res = await fetch(`https://api.example.com/produk/${id}`);
  const produk = await res.json();

  return (
    <div>
      <h1>{produk.name}</h1>
      <p>Rp {produk.price}</p>
      <AddToCart id={produk.id} />
    </div>
  );
}
```

::right::

#### Client Component (`AddToCart.tsx`)

```tsx {1|3|5-7|all}
"use client";

import { useState } from "react";

export default function AddToCart({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setLoading(false);
  }

  return (
    <button onClick={handleAdd}>
      {loading ? "Menambahkan..." : "🛒 Beli"}
    </button>
  );
}
```

---

### Composition Pattern

Memasukkan Server Component ke dalam Client Component

```tsx {1|4,10|all}
"use client";

// Client Layout bisa menerima Server Component sebagai children!
export default function InteractiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar interaktif */}
      <main>{children}</main> {/* children tetap Server! */}
    </div>
  );
}
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  ⚠️ Jika Antum <strong>import langsung</strong> Server Component di dalam file Client Component, dia ikut berubah jadi Client. Solusinya: kirim sebagai <code>children</code> (props).
</div>

---

### Kesalahan Umum yang Sering Terjadi

Pesan error yang mungkin Antum temui dan cara mengatasinya

<v-clicks>

- 🔴 **`useState is called in a Server Component`** — Lupa menambahkan `"use client"` di file yang pakai hooks.
- 🔴 **`Event handlers cannot be passed to Client Component props`** — Mengirim fungsi (`onClick`) dari Server ke Client Component lewat props.
- 🔴 **`Module not found: 'fs'`** — Client Component mencoba memakai modul khusus server (File System, Database).
- 🟡 **Bundle terlalu besar** — Terlalu banyak komponen ditandai `"use client"`. Pecah jadi komponen kecil!

</v-clicks>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 04

1. **Server Component = Default**: Biarkan sebanyak mungkin komponen di server — lebih cepat, lebih ringan, lebih aman.
2. **`"use client"` Hanya Saat Perlu**: Gunakan hanya pada komponen yang memerlukan interaksi user, hooks React, atau browser API.
3. **Pisahkan Daun Interaktif**: Buat komponen client sekecil mungkin (tombol, form, toggle) dan biarkan sisanya tetap di server.
