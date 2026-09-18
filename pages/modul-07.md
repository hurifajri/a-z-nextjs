---
layout: intro
badge: "MODUL 07"
badgeColor: "cyan"
level: 1
---

## 07. Data Fetching & Server Rendering

Menguasai strategi rendering modern di Next.js — dari SSG, SSR, ISR (Time & On-Demand), Streaming Suspense, hingga Partial Prerendering (PPR).

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

Di App Router, `fetch()` berjalan langsung di server dengan model caching fleksibel!

````md magic-move
```tsx
// 1. Default Next.js 15/16: Uncached (Always fresh on every request!)
export default async function DashboardPage() {
  const res = await fetch("https://api.example.com/stats");
  const stats = await res.json();

  return <Dashboard stats={stats} />;
}
```

```tsx
// 2. SSG: Explicit caching (force-cache)
export default async function BlogPage() {
  const res = await fetch("https://api.example.com/posts", {
    cache: "force-cache", // ← Store in permanent cache
  });
  const posts = await res.json();

  return <PostList posts={posts} />;
}
```

```tsx
// 3. ISR: Revalidate every 60 seconds
export default async function ProductPage() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 }, // ← Periodic update every 60s
  });
  const products = await res.json();

  return <ProductList products={products} />;
}
```

```tsx
// 4. Next.js 16 Standard: Directive 'use cache' (Cache Components)
import { cacheLife, cacheTag } from "next/cache";

export default async function ProductPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const res = await fetch("https://api.example.com/products");
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

<BrutalCard v-click class="mt-4 text-xs">
  💡 Di Next.js 15 & 16, <strong>fetch() bersifat uncached secara default</strong>. Caching kini eksplisit (opt-in via <code>force-cache</code>, ISR, atau <code>'use cache'</code>) demi mencegah bug data usang.
</BrutalCard>

---
layout: two-cols
---

### Dua Tipe ISR: Waktu vs On-Demand

Memperbarui Halaman Statis Tanpa Build Ulang Seluruh Website

::left::

<BrutalCard class="mb-2">
  <div class="font-black text-xs uppercase mb-1 flex items-center gap-1.5">
    <span class="bg-brutal-yellow px-1.5 py-0.5 border border-brutal-black rounded text-xs">TIME-BASED</span>
    <span>Interval Waktu Berkala</span>
  </div>
  <p class="text-xs text-gray-700 mb-2">Next.js mengecek kesegaran data secara berkala sesuai interval detik yang ditentukan.</p>

```ts
// Fastest revalidation every 60 seconds
fetch("https://api.com/items", {
  next: { revalidate: 60 },
});
```

</BrutalCard>

::right::

<BrutalCard class="mb-2">
  <div class="font-black text-xs uppercase mb-1 flex items-center gap-1.5">
    <span class="bg-brutal-cyan px-1.5 py-0.5 border border-brutal-black rounded text-xs">ON-DEMAND</span>
    <span>Event / Webhook Trigger</span>
  </div>
  <p class="text-xs text-gray-700 mb-2">Update instan seketika saat ada perubahan data di CMS atau Server Action.</p>

```ts
import { revalidatePath, revalidateTag, updateTag } from "next/cache";

// Purge cache for a route or tag (Next.js 16: requires 2 arguments):
revalidatePath("/blog");
revalidateTag("products", "max");

// Inside Next.js 16 Server Action: instantaneous UI refresh
updateTag("products");
```

</BrutalCard>

::bottom::

<BrutalCard class="mt-1 bg-emerald-50 text-xs text-gray-800">
  💡 <strong>Best Practice Next.js 16:</strong> Gunakan <code>revalidateTag(tag, profile)</code> untuk update berkala, atau <code>updateTag(tag)</code> di Server Actions agar perubahan user langsung muncul instan tanpa menunggu revalidasi latar belakang.
</BrutalCard>

---

### generateStaticParams

Men-generate halaman dinamis saat build time

```tsx {1-9|11-17|all}
// app/blog/[slug]/page.tsx

// Tell Next.js: "generate static pages for these slugs at build time!"
export async function generateStaticParams() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return posts.map((post) => ({
    slug: post.slug, // Each slug becomes a static page
  }));
}

// This page will be generated for each slug
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
// app/dashboard/loading.tsx — Automatically rendered!
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <span className="ml-3 text-gray-600">Loading data...</span>
    </div>
  );
}
```

<div v-click class="mt-4 grid grid-cols-3 gap-3 text-xs">
  <BrutalCard class="text-center">
    <strong>loading.tsx</strong><br/>Tampilan loading otomatis
  </BrutalCard>
  <BrutalCard class="text-center">
    <strong>error.tsx</strong><br/>Menangkap error runtime
  </BrutalCard>
  <BrutalCard class="text-center">
    <strong>not-found.tsx</strong><br/>Halaman 404 kustom
  </BrutalCard>
</div>

---

### error.tsx: Menangkap Error dengan Elegan

Halaman tetap bersih meskipun terjadi kesalahan teknis

```tsx {1-2|5-6|9-13|all}
"use client"; // error.tsx MUST be a client component!

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

<BrutalCard v-click class="mt-3">
  ⚠️ <code>error.tsx</code> harus menggunakan <code>"use client"</code> karena membutuhkan <code>onClick</code> untuk tombol retry!
</BrutalCard>

---

### React Suspense: Streaming Konten

Menampilkan bagian halaman yang sudah siap lebih dulu

```tsx {1|4-6|8|all}
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Slow components wrapped in Suspense */}
      <Suspense fallback={<p>Loading statistics...</p>}>
        <SlowStatistics /> {/* Async Server Component */}
      </Suspense>

      <Suspense fallback={<p>Loading chart...</p>}>
        <SlowChart /> {/* Renders independently */}
      </Suspense>
    </div>
  );
}
```

<BrutalCard v-click class="mt-3">
  🚀 Setiap <code>&lt;Suspense&gt;</code> bisa resolve secara <strong>independen</strong>. Bagian yang cepat muncul duluan, yang lambat menyusul — pengunjung tidak perlu menunggu semuanya!
</BrutalCard>

---

### Masa Depan Rendering: Partial Prerendering (PPR)

Menggabungkan Kecepatan SSG Statis + Fleksibilitas SSR Dinamis dalam 1 Halaman

<div class="grid grid-cols-2 gap-4 mt-2">
  <BrutalCard>
    <div class="font-black text-xs uppercase mb-1 text-brutal-black flex items-center gap-1.5">
      <span class="bg-brutal-yellow px-1.5 py-0.5 border border-brutal-black rounded text-xs">SHELL STATIS (SSG)</span>
      <span>Instan dari CDN Edge</span>
    </div>
    <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
      <li>• <strong>Navbar, Layout, Info Produk:</strong> Di-prerender saat build time.</li>
      <li>• Loading time: <strong>0ms</strong> (secepat halaman statis biasa).</li>
      <li>• Dikirim instan ke user tanpa menunggu server query database.</li>
    </ul>
  </BrutalCard>

  <BrutalCard>
    <div class="font-black text-xs uppercase mb-1 text-brutal-black flex items-center gap-1.5">
      <span class="bg-brutal-red text-brutal-white px-1.5 py-0.5 border border-brutal-black rounded text-xs">HOLE DINAMIS (SSR)</span>
      <span>Streaming via Suspense</span>
    </div>
    <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
      <li>• <strong>Cart, Profil User, Rekomendasi:</strong> Dibungkus <code>&lt;Suspense&gt;</code>.</li>
      <li>• Di-stream paralel dalam <strong>satu HTTP request</strong> yang sama.</li>
      <li>• Tidak ada waterfall request tambahan di browser client!</li>
    </ul>
  </BrutalCard>
</div>

<BrutalCard class="mt-3 bg-purple-50 text-xs">
  🚀 <strong>Next.js 16 PPR via Cache Components:</strong> Cukup aktifkan <code>cacheComponents: true</code> di <code>next.config.ts</code>. Shell statis terkirim instan (0ms), sedangkan bagian dinamis mengalir otomatis sesuai batas <code>&lt;Suspense&gt;</code>!
</BrutalCard>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 4 Hal Penting dari Modul 07

1. **Strategi Caching Modern**: `fetch()` tidak di-cache secara default di Next.js 15 & 16. Caching kini eksplisit via ISR (`revalidate`), `force-cache`, atau `'use cache'` (Cache Components).
2. **Special Files Otomatis**: `loading.tsx` untuk skeleton loading, `error.tsx` untuk error boundary, `not-found.tsx` untuk halaman 404.
3. **Suspense & Streaming (PPR)**: Mengalirkan potongan halaman secara independen sebagai fondasi Partial Prerendering modern.
4. **Jembatan ke CSR**: Data fetching di server tuntas di sini. Untuk data interaktif di browser (_Client-Side Rendering_), kita lanjut ke **Modul 08 (TanStack Query)**!
