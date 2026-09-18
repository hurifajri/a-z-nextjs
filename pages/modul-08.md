---
layout: intro
badge: "MODUL 08"
badgeColor: "pink"
level: 1
---

## 08. Konsumsi API & Data Fetching (TanStack Query)

Mengambil data dari endpoint, perbandingan HTTP Client (fetch, Axios, Ky), masalah fetch manual, serta keunggulan TanStack Query (React Query).

---
layout: two-cols
---

### Pilihan HTTP Client di Ekosistem JavaScript

Berbagai Cara Mengirim HTTP Request ke Backend

::left::

#### 1. Native `fetch()` _(Bawaan JS & Next.js)_

- ✅ Standar bawaan browser & Node.js (0 kB tambahan)
- ✅ Di Next.js sudah di-expand dengan fitur caching bawaan
- ❌ Respon harus di-parse manual (`res.json()`)
- ❌ Tidak otomatis throw error pada status 400/500

#### 2. `axios` _(Paling Populer di Masa Lalu)_

- ✅ Otomatis parse JSON
- ✅ Fitur **Interceptors** (sisipkan token otomatis)
- ❌ Berbasis XMLHttpRequest lama, ukuran bundle lebih besar (~13 kB)

::right::

#### 3. `ky` _(Pilihan Modern & Ringan)_

- 🪶 Sangat kecil (~3 kB), dibangun di atas native `fetch()`
- 🔄 **Auto-Retry bawaan**: Otomatis mencoba ulang jika server gagal
- 🛑 Penanganan HTTP error bawaan yang rapi

```bash
# Install if needed
npm install ky
# or
npm install axios
```

```tsx
// Ky example:
import ky from "ky";
const users = await ky.get("/api/users").json();
```

---

### Dilema Fetch Data Manual di Sisi Klien

Masalah-Masalah Nyata dari Pola `useEffect + useState + fetch`

````md magic-move
```tsx
// ❌ MANUAL PATTERN: 20 lines just for 1 simple fetch!
"use client";
export default function UserList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {data.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

```tsx
// ⚠️ PROBLEMS WITH THE ABOVE CODE:
// 1. Race Condition: Older responses can overwrite newer responses
// 2. No Caching: Navigate away and back -> refetches from scratch!
// 3. No Deduplication: 2 components fetching identical data -> 2 network requests
// 4. No Window Focus Refetch: Stale data remains on screen
```
````

---
layout: two-cols
---

### Solusi Komunitas: TanStack Query (React Query)

Standar Industri untuk Pengelolaan Server State di Sisi Klien

::left::

#### Masalah yang Diselesaikan

<v-clicks>

- ⚡ **Auto Caching**: Data tersimpan di memori, perpindahan halaman terasa instan.
- 🔄 **Window Focus Refetch**: Saat pengguna kembali membuka tab browser, data otomatis diperbarui di latar belakang.
- 🛑 **Request Deduplication**: Banyak komponen meminta data yang sama? Hanya 1 request yang dikirim ke server.
- ⏳ **Built-in State**: State `isLoading`, `isError`, `data` sudah langsung tersedia.

</v-clicks>

::right::

#### Contoh dengan `useQuery`

```tsx {1-2|5-8|10-12|all}
"use client";
import { useQuery } from "@tanstack/react-query";

export default function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((r) => r.json()),
  });

  if (isLoading) return <p>Loading data...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <ul>
      {data.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

<div v-click class="mt-2 flex items-center justify-between text-xs text-gray-800 bg-yellow-50 p-2 border border-brutal-black rounded shadow-brutal-sm">
  <span>🛡️ <strong>Wajib Pasang:</strong> <code>@tanstack/eslint-plugin-query</code></span>
  <span class="text-xs text-gray-600">Otomatis cegah bug queryKey & reactivity</span>
</div>

---

### Kapan Pakai Server Fetch vs TanStack Query?

Panduan Mengambil Keputusan di Next.js App Router

| Skenario                              | Pendekatan Terbaik                      | Alasan                                                            |
| :------------------------------------ | :-------------------------------------- | :---------------------------------------------------------------- |
| **Halaman Publik / Artikel / Profil** | **Server Component (`await fetch()`)**  | Cepat, SEO maksimal, tanpa JavaScript ekstra di browser           |
| **Dashboard Interaktif / Admin**      | **TanStack Query / SWR**                | Butuh auto-refresh, polling berkala, filter data cepat di browser |
| **Infinite Scroll & Real-Time List**  | **TanStack Query (`useInfiniteQuery`)** | Pagination & caching otomatis di memori klien                     |

<BrutalCard v-click class="mt-4 bg-yellow-100 text-xs">
  🚀 Di Next.js, mulailah selalu dari <strong>Server Component fetch</strong>. Beralihlah ke <strong>TanStack Query</strong> hanya pada komponen interaktif yang butuh auto-polling atau sinkronisasi client intensif.
</BrutalCard>

---

### Tiga State yang Wajib Ditangani

Apapun Cara Fetch-nya, Jangan Pernah Melewatkan 3 Kondisi Ini!

<v-switch>
<template #1>

#### ⏳ 1. Loading State (Skeleton / Spinner)

```tsx
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
```

</template>
<template #2>

#### ❌ 2. Error State (Pesan + Tombol Coba Lagi)

```tsx
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-8 brutal-card bg-red-50">
      <p className="text-red-600 font-bold mb-3">⚠️ {message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}
```

</template>
<template #3>

#### 📭 3. Empty State (Pemberitahuan Data Kosong)

```tsx
function EmptyState() {
  return (
    <div className="text-center py-10 text-gray-500 brutal-card bg-white">
      <p className="text-4xl mb-2">📭</p>
      <p className="font-bold text-black">No Data Available</p>
      <p className="text-xs">The requested data could not be found.</p>
    </div>
  );
}
```

</template>
</v-switch>

---

### Type-Safe API Response dengan TypeScript

Mencegah Bug Salah Ketik Properti Sejak Awal

```tsx {1-7|9-13|15-18|all}
// types/user.ts
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

// Fetch with type assertion
async function getUsers(): Promise<User[]> {
  const res = await fetch("https://api.example.com/users");
  return res.json();
}

// Editor auto-completion enabled!
const users = await getUsers();
console.log(users[0].name); // ✅ Inferred as string
console.log(users[0].balance); // ❌ TypeScript flags error immediately!
```

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 08

1. **Kenali Pilihan HTTP Client**: Gunakan native `fetch()` untuk solusi tanpa dependensi, `ky` untuk fetch modern ringan dengan retry otomatis, atau `axios` untuk interceptor klasik.
2. **TanStack Query Mengatasi Keterbatasan Manual**: Gunakan TanStack Query di sisi klien untuk menyelesaikan masalah _race conditions_, ketiadaan _cache_, dan _waterfall requests_.
3. **Selalu Siapkan 3 State**: Pastikan aplikasi Antum selalu menangani kondisi **Loading**, **Error (dengan tombol retry)**, dan **Empty State** agar ramah bagi pengguna.
