---
layout: intro
badge: "MODUL 05"
badgeColor: "green"
level: 1
---

## 05. State Management Dasar

Memahami cara menyimpan data sementara dengan useState, mengelola efek samping dengan useEffect, teknik berbagi state, serta menghindari jebakan anti-pattern di React.

---

### Apa Itu State?

Data yang bisa berubah dan memengaruhi tampilan komponen

````md magic-move
```tsx
// ❌ Variabel biasa: UI tidak akan berubah saat nilai berubah!
export default function Counter() {
  let count = 0;

  return (
    <button
      onClick={() => {
        count++;
      }}
    >
      Diklik: {count} kali {/* Selalu tampil 0! */}
    </button>
  );
}
```

```tsx
// ✅ useState: React tahu harus re-render saat nilai berubah!
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Diklik: {count} kali {/* Update otomatis! */}
    </button>
  );
}
```
````

---

### Anatomi useState

Memahami setiap bagian dari hook useState

```tsx {1|3|5-6|8|all}
"use client";
import { useState } from "react";

export default function Profile() {
  //        [nilai saat ini, fungsi pengubah] = useState(nilai awal)
  const [nama, setNama] = useState("Fulan");
  const [umur, setUmur] = useState(25);
  const [hobi, setHobi] = useState<string[]>(["coding", "baca"]);
  const [aktif, setAktif] = useState(true);

  return (
    <div>
      <p>
        {nama}, {umur} tahun
      </p>
      <button onClick={() => setUmur(umur + 1)}>Tambah Umur</button>
      <button onClick={() => setAktif(!aktif)}>
        {aktif ? "🟢 Aktif" : "🔴 Nonaktif"}
      </button>
    </div>
  );
}
```

---

### Update State untuk Array dan Object

Jangan mutasi langsung — selalu buat salinan baru (Immutability)!

````md magic-move
```tsx
// ❌ SALAH: Mutasi langsung tidak akan memicu re-render!
const [items, setItems] = useState(["Apel", "Jeruk"]);

items.push("Mangga"); // ← Mutasi langsung
setItems(items); // ← React tidak mendeteksi perubahan!
```

```tsx
// ✅ BENAR: Buat array/object baru dengan spread operator!
const [items, setItems] = useState(["Apel", "Jeruk"]);

// Tambah item
setItems([...items, "Mangga"]);

// Hapus item
setItems(items.filter((i) => i !== "Jeruk"));

// Update object
const [user, setUser] = useState({ nama: "Fulan", umur: 25 });
setUser({ ...user, umur: 26 });
```
````

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🔑 <strong>Prinsip Immutability:</strong> React membandingkan referensi object/array lama vs baru. Jika referensinya sama (mutasi langsung), React menganggap tidak ada perubahan!
</div>

---

### useEffect: Mengelola Efek Samping

Menjalankan kode di luar siklus render — fetch data, timer, subscription

```tsx {1-3|5-10|12-15|all}
"use client";
import { useState, useEffect } from "react";

export default function Clock() {
  const [waktu, setWaktu] = useState(new Date());

  // useEffect(callback, dependencyArray)
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date());
    }, 1000);

    // Cleanup: bersihkan saat komponen di-unmount
    return () => clearInterval(timer);
  }, []); // [] = jalankan sekali saat mount

  return <p>Waktu: {waktu.toLocaleTimeString("id-ID")}</p>;
}
```

<div v-click class="mt-3 grid grid-cols-3 gap-2 text-xs">
  <div class="brutal-card bg-white p-2 text-center"><code>[]</code><br/>Jalankan <strong>1x</strong> saat mount</div>
  <div class="brutal-card bg-white p-2 text-center"><code>[value]</code><br/>Jalankan saat <strong>value berubah</strong></div>
  <div class="brutal-card bg-white p-2 text-center"><em>tanpa array</em><br/>Jalankan <strong>setiap render</strong></div>
</div>

---

### React Pitfall: Derived State di useEffect

Anti-Pattern Populer yang Harus Antum Hindari Sejak Awal!

````md magic-move
```tsx
// ❌ ANTI-PATTERN: Menyimpan hasil turunan di state + sync via useEffect
function KeranjangBelanja({ items, diskon }) {
  const [total, setTotal] = useState(0);

  // Double render & rawan bug desinkronisasi!
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + item.harga, 0);
    setTotal(subtotal - diskon);
  }, [items, diskon]);

  return <div>Total Bayar: Rp {total}</div>;
}
```

```tsx
// ✅ BENAR: Hitung langsung saat render (Derived State)
function KeranjangBelanja({ items, diskon }) {
  // Tidak butuh useState & tidak butuh useEffect!
  const subtotal = items.reduce((acc, item) => acc + item.harga, 0);
  const total = subtotal - diskon;

  return <div>Total Bayar: Rp {total}</div>;
}
```
````

<div v-click class="mt-3 brutal-card bg-yellow-100 p-2 text-xs border-2 border-black">
  💡 <strong>Aturan Emas:</strong> Jika sebuah nilai bisa dihitung dari <code>props</code> atau <code>state</code> yang sudah ada, <strong>jangan taruh di state baru</strong>!
</div>

---
layout: two-cols
---

### Lifting State Up

Berbagi data antar komponen melalui parent

::left::

#### Masalah

Dua komponen perlu akses state yang sama:

```tsx
// ❌ Masing-masing punya state sendiri
function InputNama() {
  const [nama, setNama] = useState("")
  return <input onChange={...} />
}

function Greeting() {
  // Tidak bisa akses `nama`!
  return <p>Halo, ???</p>
}
```

State terpisah = data tidak sinkron!

::right::

#### Solusi: Angkat ke Parent

```tsx {2-3|5-7|8-10|all}
function Parent() {
  // State dikelola di parent
  const [nama, setNama] = useState("");

  return (
    <div>
      <InputNama onNamaChange={setNama} />
      <Greeting nama={nama} />
    </div>
  );
}

function InputNama({ onNamaChange }) {
  return <input onChange={(e) => onNamaChange(e.target.value)} />;
}

function Greeting({ nama }) {
  return <p>Halo, {nama}!</p>;
}
```

---
layout: two-cols
---

### Hindari: "God Component"

Ketika Terlalu Banyak State Ditumpuk di Satu Komponen Raksasa

::left::

#### ❌ The God Component

```tsx
function Dashboard() {
  // 15 state berbeda ditumpuk di 1 file!
  const [user, setUser] = useState();
  const [theme, setTheme] = useState();
  const [notif, setNotif] = useState();
  const [filter, setFilter] = useState();
  const [page, setPage] = useState();
  // ... 10 state lainnya
  // Satu huruf diketik -> 1000 baris re-render!
}
```

- Komponen membengkak ribuan baris
- Re-render tidak terkontrol & berat
- Sangat sulit di-test dan di-refactor

::right::

#### ✅ Modular & Local State

```tsx
function Dashboard() {
  return (
    <div>
      <UserSection /> {/* Kelola state user */}
      <FilterBar /> {/* Kelola state filter */}
      <DataGrid /> {/* Kelola pagination */}
    </div>
  );
}
```

- **Colocation**: Taruh state sedekat mungkin dengan tempat ia dipakai
- Komponen kecil, fokus, dan cepat
- Hemat beban re-render browser

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 05

1. **useState & Immutability**: Gunakan `useState` agar UI reaktif. Jangan mutasi langsung — selalu buat salinan array/object baru dengan spread operator.
2. **Hindari Derived State di useEffect**: Jangan buat state baru untuk nilai yang bisa dihitung langsung dari props/state lain saat render.
3. **Lifting State & Colocation**: Angkat state ke parent jika dipakai bersama, tapi hindari _God Component_ dengan menaruh state sedekat mungkin dengan komponen pemakainya.
