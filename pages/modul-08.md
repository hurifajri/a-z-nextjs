---
layout: intro
badge: "MODUL 08"
badgeColor: "pink"
level: 1
---

## 08. Konsumsi API & Data Fetching (TanStack Query)

Mengambil data dari endpoint, perbandingan HTTP Client (fetch, Axios, Ky), masalah fetch manual, serta keunggulan TanStack Query (React Query).

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
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

#### 2. `axios` _(HTTP Client dengan Interceptor)_

- ✅ Otomatis parse JSON
- ✅ Fitur **Interceptors** (sisipkan token otomatis)
- 🔌 Mendukung adapter browser/Node/fetch; periksa kebutuhan dan ukuran bundle

::right::

#### 3. `ky` _(Pilihan Modern & Ringan)_

- 🪶 Wrapper native `fetch()`; ukuran bergantung versi dan fitur
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
class: module-content
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
class: module-content
---

### Setup Provider Sebelum Memakai useQuery

```bash
npm install @tanstack/react-query
```

```tsx
// src/app/providers.tsx — contoh useQuery biasa, bukan Suspense query
"use client";
import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

Di `layout.tsx`, import `Providers`, lalu bungkus `{children}` di dalam `<body>` dengan `<Providers>`.

Jangan berbagi QueryClient singleton antarpengguna di server. SSR prefetch/hydration memerlukan setup terpisah.

<!--
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
-->

---
class: module-content
layout: two-cols
---

### TanStack Query: Query dan State UI

::left::

#### Apa yang Dikelola?

- Cache berdasarkan `queryKey`.
- Deduplikasi request yang sedang berjalan untuk key yang sama.
- Refetch data stale sesuai konfigurasi.
- Pending, error, data, dan invalidasi.

`getUsers` pada slide validasi JSON di modul ini memeriksa HTTP dan schema respons. Provider harus terpasang terlebih dahulu.

::right::

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/users";

export default function UserList() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: 30_000,
  });
  if (query.isPending) return <p>Loading...</p>;
  if (query.isError) return <p>Unable to load.</p>;
  if (!query.data.length) return <p>No users.</p>;
  return (
    <ul>
      {query.data.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

<!--
Tambahkan tombol retry dengan query.refetch(). ESLint plugin TanStack Query direkomendasikan.
getUsers diekspor dari src/lib/users.ts; contoh definisinya ada di slide TypeScript Tidak Memvalidasi JSON.
-->

---
class: module-content
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
class: module-content
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
class: module-content
---

### TypeScript Tidak Memvalidasi JSON Saat Runtime

Tipe return memberi bantuan editor; schema memeriksa respons yang benar-benar datang

```ts
import * as v from "valibot";

const UsersSchema = v.array(
  v.object({
    id: v.number(),
    name: v.string(),
  }),
);
type User = v.InferOutput<typeof UsersSchema>[number];

export async function getUsers(signal?: AbortSignal): Promise<User[]> {
  const res = await fetch("/api/users", { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return v.parse(UsersSchema, await res.json());
}
```

`as User[]` tidak mengubah data atau memastikan kontrak backend benar. Detail schema dibahas di Modul 09.

<!--
Sumber: https://valibot.dev/guides/parse-data/
-->

---
class: module-content
---

### Cache Server dan Cache Browser Berbeda

- `queryKey` wajib memuat filter/page/identitas yang mengubah hasil query.
- Default `staleTime` adalah 0; query stale dapat refetch saat mount, focus, reconnect.
- Setelah mutasi berhasil: `invalidateQueries({ queryKey: ["todos"] })`.
- Invalidasi TanStack Query tidak menghapus Next.js server cache; tangani keduanya bila dipakai.
- Tangani empty state dan background refetch tanpa menghilangkan data lama.
- Query bukan koneksi real-time otomatis; polling, SSE, atau WebSocket tetap perlu desain.

<!--
Sumber: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 08

1. **Kenali Pilihan HTTP Client**: Gunakan native `fetch()` untuk solusi tanpa dependensi, `ky` untuk fetch modern ringan dengan retry otomatis, atau `axios` untuk interceptor klasik.
2. **TanStack Query Mengatasi Keterbatasan Manual**: Gunakan TanStack Query di sisi klien untuk mengelola cache, deduplikasi, status request, dan invalidasi. Waterfall tetap perlu dihindari lewat desain query.
3. **Selalu Siapkan 3 State**: Pastikan aplikasi Antum selalu menangani kondisi **Loading**, **Error (dengan tombol retry)**, dan **Empty State** agar ramah bagi pengguna.

<!--
Checkpoint: Query yang Tidak Menampilkan Sukses Palsu
Mock 500, respons kosong, dan respons schema salah. Pastikan error tertangani, queryKey memuat filter, serta invalidasi berjalan setelah mutasi.
Sumber primer: https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
Audit: 25 September 2026.
-->
