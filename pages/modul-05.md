---
layout: intro
badge: "MODUL 05"
badgeColor: "green"
---

## 05. State Management Dasar

Memahami cara menyimpan data sementara dengan useState, mengelola efek samping dengan useEffect, dan teknik berbagi state antar komponen.

---

### Apa Itu State?

Data yang bisa berubah dan memengaruhi tampilan komponen

````md magic-move
```tsx
// ❌ Variabel biasa: UI tidak akan berubah saat nilai berubah!
export default function Counter() {
  let count = 0

  return (
    <button onClick={() => { count++ }}>
      Diklik: {count} kali  {/* Selalu tampil 0! */}
    </button>
  )
}
```
```tsx
// ✅ useState: React tahu harus re-render saat nilai berubah!
"use client"
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Diklik: {count} kali  {/* Update otomatis! */}
    </button>
  )
}
```
````

---

### Anatomi useState

Memahami setiap bagian dari hook useState

```tsx {1|3|5-6|8|all}
"use client"
import { useState } from "react"

export default function Profile() {
  //        [nilai saat ini, fungsi pengubah] = useState(nilai awal)
  const [nama, setNama] = useState("Fulan")
  const [umur, setUmur] = useState(25)
  const [hobi, setHobi] = useState<string[]>(["coding", "baca"])
  const [aktif, setAktif] = useState(true)

  return (
    <div>
      <p>{nama}, {umur} tahun</p>
      <button onClick={() => setUmur(umur + 1)}>Tambah Umur</button>
      <button onClick={() => setAktif(!aktif)}>
        {aktif ? "🟢 Aktif" : "🔴 Nonaktif"}
      </button>
    </div>
  )
}
```

---

### Update State untuk Array dan Object

Jangan mutasi langsung — selalu buat salinan baru!

````md magic-move
```tsx
// ❌ SALAH: Mutasi langsung tidak akan memicu re-render!
const [items, setItems] = useState(["Apel", "Jeruk"])

items.push("Mangga")        // ← Mutasi langsung
setItems(items)              // ← React tidak mendeteksi perubahan!
```
```tsx
// ✅ BENAR: Buat array/object baru dengan spread operator!
const [items, setItems] = useState(["Apel", "Jeruk"])

// Tambah item
setItems([...items, "Mangga"])

// Hapus item
setItems(items.filter(i => i !== "Jeruk"))

// Update object
const [user, setUser] = useState({ nama: "Fulan", umur: 25 })
setUser({ ...user, umur: 26 })
```
````

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🔑 <strong>Prinsip Immutability:</strong> React membandingkan referensi object/array lama vs baru. Jika referensinya sama (mutasi langsung), React menganggap tidak ada perubahan!
</div>

---

### useEffect: Mengelola Efek Samping

Menjalankan kode di luar siklus render — fetch data, timer, subscription

```tsx {1-3|5-10|12-15|all}
"use client"
import { useState, useEffect } from "react"

export default function Clock() {
  const [waktu, setWaktu] = useState(new Date())

  // useEffect(callback, dependencyArray)
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date())
    }, 1000)

    // Cleanup: bersihkan saat komponen di-unmount
    return () => clearInterval(timer)
  }, []) // [] = jalankan sekali saat mount

  return <p>Waktu: {waktu.toLocaleTimeString("id-ID")}</p>
}
```

<div v-click class="mt-3 grid grid-cols-3 gap-2 text-xs">
  <div class="brutal-card bg-white p-2 text-center"><code>[]</code><br/>Jalankan <strong>1x</strong> saat mount</div>
  <div class="brutal-card bg-white p-2 text-center"><code>[value]</code><br/>Jalankan saat <strong>value berubah</strong></div>
  <div class="brutal-card bg-white p-2 text-center"><em>tanpa array</em><br/>Jalankan <strong>setiap render</strong></div>
</div>

---

### useEffect: Fetch Data dari API

Pola umum mengambil data saat halaman dimuat

```tsx {4-5|7-15|17-18|all}
"use client"
import { useState, useEffect } from "react"

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users")
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, []) // Fetch sekali saat halaman dimuat

  if (loading) return <p>Memuat data...</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

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
  const [nama, setNama] = useState("")

  return (
    <div>
      {/* Kirim setter via props */}
      <InputNama onNamaChange={setNama} />
      {/* Kirim value via props */}
      <Greeting nama={nama} />
    </div>
  )
}

function InputNama({ onNamaChange }) {
  return (
    <input onChange={e =>
      onNamaChange(e.target.value)
    } />
  )
}

function Greeting({ nama }) {
  return <p>Halo, {nama}!</p>
}
```

---

### Props vs State

Dua konsep yang sering membingungkan pemula

| Aspek | **Props** | **State** |
|:------|:----------|:----------|
| **Asal** | Diterima dari komponen parent | Dimiliki oleh komponen itu sendiri |
| **Bisa diubah?** | ❌ Read-only (immutable) | ✅ Bisa diubah via setter |
| **Siapa yang kontrol?** | Parent yang mengirim | Komponen yang memiliki |
| **Re-render?** | Saat parent mengirim props baru | Saat state berubah via setter |

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🧩 <strong>Analogi:</strong> Props = instruksi dari atasan (tidak bisa diubah bawahan). State = catatan pribadi (bisa Antum ubah sendiri).
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 05

1. **useState = Data yang Hidup**: Gunakan `useState` agar perubahan data otomatis memperbarui tampilan. Jangan mutasi langsung — selalu buat salinan baru!
2. **useEffect = Aksi di Luar Render**: Fetch data, timer, dan subscription masuk ke `useEffect`. Selalu sertakan dependency array dan cleanup function.
3. **Lifting State = Berbagi Data**: Jika dua komponen butuh data yang sama, pindahkan state ke parent terdekat dan kirim via props.
