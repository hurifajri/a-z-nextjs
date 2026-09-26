---
layout: intro
badge: "MODUL 04"
badgeColor: "yellow"
level: 1
---

## 04. Server Components vs Client Components

Memahami paradigma baru di React Server Components — kapan komponen dijalankan di server dan kapan di browser.

---
class: module-content
---

### Default = Server Component

Page dan layout App Router default Server Components; import di bawah client boundary mengikuti sisi client.

<v-switch>
<template #1>

**Sebelumnya (React Biasa / Pages Router)**

- SPA umumnya render di browser; Pages Router juga mendukung SSR/SSG
- Seluruh JavaScript dikirim ke browser pengunjung
- Bundle makin besar seiring aplikasi tumbuh

</template>
<template #2>

**Sekarang (App Router)**

- Komponen dirender di **server** secara default
- Implementasi Server Component tidak masuk bundle browser
- Client boundary menentukan modul yang dikirim; framework runtime tetap ada

</template>
</v-switch>

---
class: module-content
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
class: module-content
---

### Menandai Client Component

Cukup tambahkan `"use client"` di baris paling atas!

```tsx {1|3|5-6|all}
"use client"; // Batas module graph client, bukan menonaktifkan SSR

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Clicked: {count} times</button>
  );
}
```

<BrutalCard v-click class="mt-4">
  ⚠️ <strong>Tanpa</strong> <code>"use client"</code>, kode di atas akan ERROR karena <code>useState</code> dan <code>onClick</code> tidak tersedia di Server Components!
</BrutalCard>

---
class: module-content
---

### Evolusi Komponen: Server → Client

Lihat bagaimana kebutuhan interaksi mengubah tipe komponen

````md magic-move
```tsx
// 1. Plain Server Component — renders static UI
export default function SearchBar() {
  return (
    <div>
      <input type="text" placeholder="Search items..." />
      <button>Search</button>
    </div>
  );
}
```

```tsx
// 2. Needs input state! useState = ERROR on server ❌
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input onChange={(e) => setQuery(e.target.value)} />
      <button>Search: {query}</button>
    </div>
  );
}
```

```tsx
// 3. Solution: add "use client" directive at top ✅
"use client";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input onChange={(e) => setQuery(e.target.value)} />
      <button>Search: {query}</button>
    </div>
  );
}
```
````

---
class: module-content
---

### Kapan Pakai Server vs Client?

Aturan praktis yang sederhana

<v-clicks>

1. **Apakah butuh interaksi user?** dengan event handler React (onClick, onChange) → _Client Component_
2. **Apakah butuh State atau Lifecycle?** (`useState`, `useEffect`) → _Client Component_
3. **Apakah pakai Browser APIs?** (Geolocation, localStorage) → _Client Component_
4. **Selain di atas?** → Biarkan tetap sebagai **Server Component**!

</v-clicks>

<BrutalCard v-click class="mt-6 text-center">
  💡 <strong>Tips Emas:</strong> Dorong Client Component sejauh mungkin ke <em>"daun"</em> terkecil di component tree Antum!
</BrutalCard>

---
zoom: 0.95
class: module-content
layout: two-cols
---

### Pola Praktis di Dunia Nyata

Pisahkan bagian statis (server) dan interaktif (client)

::left::

#### Server Page (`page.tsx`)

```tsx {2,5-6|8-11|all}
// app/products/[id]/page.tsx
import AddToCart from "./AddToCart";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch data directly on the server!
  const res = await fetch(`https://api.example.com/products/${id}`);
  if (!res.ok) throw new Error("Product unavailable");
  const product = await res.json();

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <AddToCart id={product.id} />
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
  const [quantity, setQuantity] = useState(0);
  return (
    <button onClick={() => setQuantity((n) => n + 1)}>
      Product {id}: {quantity} in local cart
    </button>
  );
}
```

---
class: module-content
---

### Composition Pattern

Memasukkan Server Component ke dalam Client Component

```tsx {1|4,10|all}
"use client";

// Client Layout accepts Server Components via children prop!
export default function InteractiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar /> {/* Interactive client component */}
      <main>{children}</main> {/* children remains a Server Component! */}
    </div>
  );
}
```

<BrutalCard v-click class="mt-4 text-sm">
  ⚠️ Jika Antum <strong>import langsung</strong> Server Component di dalam file Client Component, modulnya masuk client graph; kode server-only/async dapat gagal build. Solusinya: kirim sebagai <code>children</code> (props).
</BrutalCard>

---
class: module-content
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
class: module-content
---

### Client Component Juga Bisa Dirender di Server

1. Initial request: server menghasilkan HTML preview, termasuk Client Components.
2. Browser menerima HTML dan RSC payload.
3. JavaScript meng-hydrate bagian client agar event handler aktif.

- Akses `window` / `localStorage` di effect atau event handler, bukan saat render server.
- Props lintas boundary harus serializable menurut React; jangan kirim secret.
- Tambahkan `import "server-only"` pada modul database/secret.
- Hover CSS dan form HTML dasar tidak otomatis membutuhkan `"use client"`.

<!--
Sumber: https://react.dev/reference/rsc/use-client
-->

---
class: module-content
---

### Prediksi: Batas Server dan Client

<LearningCheck
  question="Halaman produk membaca database dan memiliki tombol favorit. Di mana batas client?"
  :options='["Seluruh halaman diberi use client", "Hanya komponen tombol yang memerlukan state/event", "Database dipindah ke browser"]'
  :answer="1"
  explanation="Page dapat tetap Server Component; tombol menjadi Client Component. Data yang melewati batas harus dapat diserialisasi."
/>

<!--
Fasilitasi: beri 30 detik untuk prediksi pribadi, lalu diskusi berpasangan.
Minta peserta menjelaskan mengapa opsi lain tidak cukup. Gunakan Ulangi prediksi untuk kelompok berikutnya.
-->

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

<!--
Checkpoint: Batas Server dan Client
Buat page server dengan tombol client. Pastikan secret tidak dikirim sebagai props dan initial render bebas akses window/localStorage.
Sumber primer: https://nextjs.org/docs/app/getting-started/server-and-client-components
Audit: 25 September 2026.
-->
