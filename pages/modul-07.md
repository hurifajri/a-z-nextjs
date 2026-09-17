---
layout: intro
badge: "MODUL 07"
badgeColor: "cyan"
level: 1
---

## 07. Data Fetching di Next.js (SSR/SSG/ISR)

Memahami SSR, SSG, dan ISR — cara Next.js mengambil dan meng-cache data secara otomatis untuk performa optimal.

---

### Tiga Strategi Rendering

Bagaimana Next.js menyajikan halaman ke pengunjung?

<v-switch>
<template #1>

#### 🏗️ SSG — Static Site Generation

- Data diambil **saat build** (`npm run build`)
- Halaman jadi file HTML statis, super cepat!
- Cocok untuk konten yang jarang berubah (blog, docs)

</template>
<template #2>

#### 🔄 SSR — Server-Side Rendering

- Data diambil **setiap ada request** dari pengunjung
- Halaman selalu fresh, tapi sedikit lebih lambat
- Cocok untuk data real-time (dashboard, profil user)

</template>
<template #3>

#### ⚡ ISR — Incremental Static Regeneration

- Gabungan SSG + SSR: **halaman statis yang bisa diperbarui** secara berkala
- Cocok untuk data yang berubah tapi tidak perlu real-time (produk, berita)
- Best of both worlds!

</template>
</v-switch>

---

### fetch() di Server Components

Di App Router, cukup gunakan `fetch()` langsung di komponen!

````md magic-move
```tsx
// 1. SSG: Data di-cache permanen (default)
export default async function BlogPage() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return <PostList posts={posts} />;
}
```

```tsx
// 2. SSR: Data fresh setiap request
export default async function DashboardPage() {
  const res = await fetch("https://api.example.com/stats", {
    cache: "no-store", // ← Jangan cache!
  });
  const stats = await res.json();

  return <Dashboard stats={stats} />;
}
```

```tsx
// 3. ISR: Revalidate setiap 60 detik
export default async function ProductPage() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 }, // ← Update setiap 60 detik
  });
  const products = await res.json();

  return <ProductList products={products} />;
}
```
````

---
layout: two-cols
---

### Perbandingan Strategi

Pilih strategi yang tepat berdasarkan kebutuhan data

::left::

| Strategi | Kecepatan       | Kesegaran           |
| :------- | :-------------- | :------------------ |
| **SSG**  | ⚡⚡⚡ Tercepat | Statis (build time) |
| **ISR**  | ⚡⚡ Cepat      | Berkala (N detik)   |
| **SSR**  | ⚡ Normal       | Selalu fresh        |

::right::

#### Kapan Pakai Apa?

<v-clicks>

- **SSG** → Blog, dokumentasi, landing page
- **ISR** → Katalog produk, berita, listing
- **SSR** → Dashboard, profil user, real-time data

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-2 text-xs">
  💡 Di App Router, <strong>SSG adalah default</strong>. Antum hanya perlu menambahkan opsi jika butuh SSR atau ISR.
</div>

---

### generateStaticParams

Men-generate halaman dinamis saat build time

```tsx {1-9|11-17|all}
// app/blog/[slug]/page.tsx

// Beri tahu Next.js: "generate halaman untuk slug-slug ini saat build!"
export async function generateStaticParams() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return posts.map((post) => ({
    slug: post.slug, // Setiap slug jadi halaman statis
  }));
}

// Halaman ini akan di-generate untuk setiap slug
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

### loading.tsx: Tampilan Saat Memuat

Next.js otomatis menampilkan komponen ini saat halaman sedang fetch data!

```tsx
// app/dashboard/loading.tsx — Otomatis muncul!
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <span className="ml-3 text-gray-600">Memuat data...</span>
    </div>
  );
}
```

<div v-click class="mt-4 grid grid-cols-3 gap-3 text-xs">
  <div class="brutal-card bg-white p-2 text-center">
    <strong>loading.tsx</strong><br/>Tampilan loading otomatis
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <strong>error.tsx</strong><br/>Menangkap error runtime
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <strong>not-found.tsx</strong><br/>Halaman 404 kustom
  </div>
</div>

---

### error.tsx: Menangkap Error dengan Elegan

Halaman tetap bersih meskipun terjadi kesalahan teknis

```tsx {1-2|5-6|9-13|all}
"use client"; // error.tsx HARUS client component!

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-2">Oops! Terjadi Kesalahan</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button onClick={() => reset()} className="brutal-btn">
        Coba Lagi
      </button>
    </div>
  );
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  ⚠️ <code>error.tsx</code> harus menggunakan <code>"use client"</code> karena membutuhkan <code>onClick</code> untuk tombol retry!
</div>

---

### React Suspense: Streaming Konten

Menampilkan bagian halaman yang sudah siap lebih dulu

```tsx {1|4-6|8|all}
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Bagian yang lambat dibungkus Suspense */}
      <Suspense fallback={<p>Memuat statistik...</p>}>
        <SlowStatistics /> {/* Async Server Component */}
      </Suspense>

      <Suspense fallback={<p>Memuat grafik...</p>}>
        <SlowChart /> {/* Muncul independen */}
      </Suspense>
    </div>
  );
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🚀 Setiap <code>&lt;Suspense&gt;</code> bisa resolve secara <strong>independen</strong>. Bagian yang cepat muncul duluan, yang lambat menyusul — pengunjung tidak perlu menunggu semuanya!
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 07

1. **Tiga Strategi Rendering**: SSG (build time, default), ISR (revalidate berkala), SSR (setiap request). Pilih berdasarkan seberapa sering data berubah.
2. **Special Files Otomatis**: `loading.tsx` untuk skeleton loading, `error.tsx` untuk error boundary, `not-found.tsx` untuk halaman 404 — semuanya bekerja otomatis!
3. **Suspense = Streaming**: Bungkus komponen lambat dengan `<Suspense>` agar bagian halaman yang sudah siap bisa tampil duluan.
