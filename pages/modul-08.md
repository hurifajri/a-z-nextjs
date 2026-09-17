---
layout: intro
badge: "MODUL 08"
badgeColor: "pink"
---

## 08. Konsumsi API (GET) dan Loading/Error State

Mengambil data dari endpoint eksternal, menampilkan di antarmuka, serta mengelola tampilan loading, error, dan empty state.

---

### Fetch Data di Server Component

Cara paling simpel: langsung `await fetch()` tanpa useEffect!

```tsx {1-3|5-7|9-15|all}
// app/users/page.tsx — Server Component (default)
interface User {
  id: number; name: string; email: string
}

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const users: User[] = await res.json()

  return (
    <div className="grid grid-cols-2 gap-4">
      {users.map(user => (
        <div key={user.id} className="border p-4 rounded">
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  )
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  ✅ Di Server Component: <strong>tidak perlu</strong> useState, useEffect, atau loading state manual. Next.js menangani semuanya!
</div>

---
layout: two-cols
---

### Server Fetch vs Client Fetch

Dua pendekatan mengambil data dari API

::left::

#### 🖥️ Server Component

```tsx
// Simpel! Langsung await
export default async function Page() {
  const res = await fetch(
    "https://api.example.com/data"
  )
  const data = await res.json()

  return <List data={data} />
}
```

- ✅ Kode lebih bersih
- ✅ Loading otomatis via `loading.tsx`
- ✅ Data tidak terekspos di browser
- ❌ Tidak bisa interaktif

::right::

#### 💻 Client Component

```tsx
"use client"
export default function Page() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner />
  return <List data={data} />
}
```

- ✅ Bisa interaktif (filter, search)
- ❌ Perlu kelola loading/error manual

---

### Type-Safe API Response

Definisikan TypeScript interface agar data selalu terprediksi

```tsx {1-8|10-13|15-16|all}
// types/post.ts — Definisikan tipe data
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// Gunakan tipe saat fetch
async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  if (!res.ok) throw new Error("Gagal mengambil data")
  return res.json()
}

// Auto-complete dan type checking otomatis!
const posts = await getPosts()
posts[0].title  // ✅ TypeScript tahu ini string
posts[0].harga  // ❌ Error! Property 'harga' tidak ada
```

---

### Tiga State yang Harus Ditangani

Setiap halaman yang fetch data wajib menangani 3 kondisi ini

<v-switch>
<template #1>

#### ⏳ Loading State

```tsx
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  )
}
```

</template>
<template #2>

#### ❌ Error State

```tsx
function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">⚠️ {message}</p>
      <button onClick={onRetry} className="brutal-btn">
        Coba Lagi
      </button>
    </div>
  )
}
```

</template>
<template #3>

#### 📭 Empty State

```tsx
function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-4xl mb-2">📭</p>
      <p className="font-bold">Belum Ada Data</p>
      <p className="text-sm">Data yang Antum cari tidak ditemukan.</p>
    </div>
  )
}
```

</template>
</v-switch>

---

### Evolusi Fetch: Basic → Production-Ready

Membangun komponen fetch secara bertahap

````md magic-move
```tsx
// 1. Basic — tanpa error handling (BAHAYA!)
"use client"
export default function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers)
  }, [])

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```
```tsx
// 2. Tambah loading state
"use client"
export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false) })
  }, [])

  if (loading) return <LoadingSkeleton />
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```
```tsx
// 3. Tambah error + empty state (PRODUCTION READY ✅)
"use client"
export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/users")
      .then(res => {
        if (!res.ok) throw new Error("Gagal memuat data")
        return res.json()
      })
      .then(data => { setUsers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} />
  if (users.length === 0) return <EmptyState />
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```
````

---

### Menampilkan Data: Card Grid

Pola umum menampilkan daftar data dalam format kartu

```tsx {3-5|7-15|all}
export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products")
  const products = await res.json()

  if (products.length === 0) return <EmptyState />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border-2 border-black rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <p className="font-black text-xl mt-3">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  )
}
```

---

### Best Practice: loading.tsx + error.tsx

Biarkan Next.js menangani loading dan error secara otomatis di App Router

```text
app/
├── products/
│   ├── page.tsx        ← Komponen utama (fetch data)
│   ├── loading.tsx     ← Otomatis muncul saat page.tsx loading
│   └── error.tsx       ← Otomatis menangkap error dari page.tsx
```

<v-clicks>

- 📦 `page.tsx` cukup fokus fetch data dan render — **tanpa if/else loading/error**
- ⏳ `loading.tsx` otomatis ditampilkan selama `page.tsx` menunggu `await`
- ❌ `error.tsx` otomatis menangkap error jika `fetch()` gagal
- 🔄 Tombol "Coba Lagi" di `error.tsx` memanggil `reset()` untuk re-render

</v-clicks>

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🎯 Dengan pattern ini, <code>page.tsx</code> Antum jadi sangat bersih — hanya ada fetch + render!
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 08

1. **Server Fetch Lebih Simpel**: Di Server Component, cukup `await fetch()` tanpa useState/useEffect. Next.js menangani loading/error via file khusus.
2. **Selalu Tangani 3 State**: Loading (skeleton/spinner), Error (pesan + tombol retry), Empty (pesan informatif). Jangan pernah abaikan!
3. **Type-Safe = Aman**: Definisikan TypeScript interface untuk setiap API response agar data selalu terprediksi dan auto-complete bekerja.
