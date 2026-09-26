---
layout: intro
badge: "MODUL 07"
badgeColor: "cyan"
level: 1
---

## 07. Data Fetching & Server Rendering

Menguasai strategi rendering modern di Next.js — dari SSG, SSR, ISR (Time & On-Demand), Streaming Suspense, hingga Partial Prerendering (PPR).

---
class: module-content
---

### Dua Model Caching: Nyatakan Konfigurasi

| Mode                                  | Cara belajar di kelas                                              |
| :------------------------------------ | :----------------------------------------------------------------- |
| **Dasar: Cache Components nonaktif**  | `fetch` + `force-cache` / `next.revalidate`; mini project Modul 11 |
| **Lanjutan: `cacheComponents: true`** | `use cache`, `cacheLife`, `cacheTag`, dan `Suspense`               |

- Default fetch tanpa Data Cache **tidak berarti** halaman selalu dirender per request.
- Pada model dasar, rute masih dapat di-prerender saat build; gunakan `no-store` atau `connection()` bila perlu request-time.
- Jangan mencampur konfigurasi route lama dengan Cache Components tanpa migrasi.
- Data per pengguna perlu batas otorisasi dan strategi cache yang sesuai.

<!--
Sumber: https://nextjs.org/docs/app/api-reference/functions/fetch
https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
-->

---
class: module-content
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
- Render terjadi saat request; kesegaran tetap bergantung sumber data/cache
- Cocok untuk data per pengguna; live updates perlu polling/SSE/WebSocket

</template>
<template #3>

#### ⚡ ISR — Incremental Static Regeneration

- Gabungan SSG + SSR: **halaman statis yang bisa diperbarui** secara berkala
- Cocok untuk data yang berubah tapi tidak perlu real-time (produk, berita)
- Best of both worlds!

</template>
</v-switch>

---
class: module-content
---

### fetch() di Server Components

Di App Router, `fetch()` berjalan langsung di server dengan model caching fleksibel!

````md magic-move
```tsx
// 1. Model dasar: no-store eksplisit untuk fetch per request
export default async function DashboardPage() {
  const res = await fetch("https://api.example.com/stats", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Unable to load stats");
  const stats = await res.json();

  return <Dashboard stats={stats} />;
}
```

```tsx
// 2. Cache data eksplisit; tidak sendirian menentukan rendering route
export default async function BlogPage() {
  const res = await fetch("https://api.example.com/posts", {
    cache: "force-cache", // Cache persisten sampai invalidasi/eviction
  });
  if (!res.ok) throw new Error("Unable to load posts");
  const posts = await res.json();

  return <PostList posts={posts} />;
}
```

```tsx
// 3. Revalidasi berbasis waktu, bukan cron tepat tiap 60 detik
export default async function ProductPage() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 }, // Stale setelah 60s; revalidasi dipicu request
  });
  if (!res.ok) throw new Error("Unable to load products");
  const products = await res.json();

  return <ProductList products={products} />;
}
```

```tsx
// 4. Mode terpisah: wajib cacheComponents: true
import { cacheLife, cacheTag } from "next/cache";

export default async function ProductPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const res = await fetch("https://api.example.com/products");
  if (!res.ok) throw new Error("Unable to load products");
  const products = await res.json();

  return <ProductList products={products} />;
}
```
````

---
class: module-content
layout: two-cols
---

### Perbandingan Strategi

Pilih strategi yang tepat berdasarkan kebutuhan data

::left::

| Strategi | Kecepatan       | Kesegaran           |
| :------- | :-------------- | :------------------ |
| **SSG**  | ⚡⚡⚡ Tercepat | Statis (build time) |
| **ISR**  | ⚡⚡ Cepat      | Berkala (N detik)   |
| **SSR**  | ⚡ Normal       | Sesuai data request |

::right::

#### Kapan Pakai Apa?

<v-clicks>

- **SSG** → Blog, dokumentasi, landing page
- **ISR** → Katalog produk, berita, listing
- **SSR** → Dashboard dan profil user per request

</v-clicks>

<BrutalCard v-click class="mt-4 text-xs">
  💡 Di Next.js 15 & 16, <strong>fetch() bersifat uncached secara default</strong>. Caching kini eksplisit (opt-in via <code>force-cache</code>, ISR, atau <code>'use cache'</code>) demi mencegah bug data usang.
</BrutalCard>

---
class: module-content
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
  <p class="text-xs text-gray-700 mb-2">Setelah interval habis, request berikutnya dapat menerima data lama sambil memicu revalidasi.</p>

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
  <p class="text-xs text-gray-700 mb-2">Mutasi atau webhook menginvalidasi cache; kapan data baru terlihat bergantung API invalidasi.</p>

```ts
import { revalidatePath, revalidateTag, updateTag } from "next/cache";

// Purge cache for a route or tag (Next.js 16: requires 2 arguments):
revalidatePath("/blog");
revalidateTag("products", "max");

// Hanya Server Action: expire tag untuk read-your-own-writes
updateTag("products");
```

</BrutalCard>

::bottom::

<BrutalCard class="mt-1 bg-emerald-50 text-xs text-gray-800">
  💡 <strong>Best Practice Next.js 16:</strong> <code>revalidateTag(tag, "max")</code> memakai stale-while-revalidate. <code>updateTag(tag)</code> meng-expire cache di Server Actions. Keduanya perlu tag pada data; lindungi endpoint webhook.
</BrutalCard>

---
zoom: 0.9
class: module-content
---

### generateStaticParams

Daftarkan parameter untuk prerender; validasi respons API sesuai kontrak proyek

```tsx
// app/blog/[slug]/page.tsx — model dasar tanpa Cache Components
import { notFound } from "next/navigation";
type Post = { slug: string; title: string };

export async function generateStaticParams() {
  const res = await fetch("https://api.example.com/posts");
  if (!res.ok) throw new Error("Unable to load posts");
  const posts: Post[] = await res.json();
  return posts.map(({ slug }) => ({ slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetch(
    `https://api.example.com/posts/${encodeURIComponent(slug)}`,
  );
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Unable to load post");
  const post: Post = await res.json();
  return <h1>{post.title}</h1>;
}
```

Tipe `Post` belum memvalidasi JSON. Parameter di luar daftar mengikuti konfigurasi route; daftar ini bukan izin akses.

---
class: module-content
---

### loading.tsx: Tampilan Saat Memuat

loading.tsx membungkus page dan descendants dengan Suspense; pekerjaan pada layout yang sama tidak tercakup.

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
class: module-content
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
      <p className="text-gray-600 mb-4">Please try again later.</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

<BrutalCard v-click class="mt-3">
  ⚠️ <code>error.tsx</code> harus menggunakan <code>"use client"</code> sesuai kontrak error boundary. Tidak menangkap event handler, atau error layout pada segmen yang sama.
</BrutalCard>

---
class: module-content
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
class: module-content
---

### Partial Prerendering dengan Cache Components

Menggabungkan Kecepatan SSG Statis + Fleksibilitas SSR Dinamis dalam 1 Halaman

<div class="grid grid-cols-2 gap-4 mt-2">
  <BrutalCard>
    <div class="font-black text-xs uppercase mb-1 text-brutal-black flex items-center gap-1.5">
      <span class="bg-brutal-yellow px-1.5 py-0.5 border border-brutal-black rounded text-xs">SHELL STATIS (SSG)</span>
      <span>Instan dari CDN Edge</span>
    </div>
    <ul class="text-xs text-gray-700 space-y-1.5 mt-2">
      <li>• <strong>Navbar, Layout, Info Produk:</strong> Di-prerender saat build time.</li>
      <li>• Tetap dipengaruhi latensi jaringan, cache miss, dan waktu render.</li>
      <li>• Dapat dikirim tanpa menunggu query dinamis selesai.</li>
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
  🚀 <strong>Next.js 16 PPR via Cache Components:</strong> Cukup aktifkan <code>cacheComponents: true</code> di <code>next.config.ts</code>. Susun shell statis yang berguna; tempatkan data request-time di balik batas <code>&lt;Suspense&gt;</code>!
</BrutalCard>

---
class: module-content
---

### Next.js 16.3: Navigasi dan Prefetch

```ts
// Konfigurasi latihan lanjutan, terpisah dari mini project dasar
import type { NextConfig } from "next";
export default {
  cacheComponents: true,
  partialPrefetching: true,
} satisfies NextConfig;
```

- Partial Prefetching memakai shell yang dapat digunakan ulang per route.
- URL-specific data dapat menyusul; ukur sebelum menambah `prefetch={true}`.
- Uji **reload** dan **klik Link**: keduanya dapat menampilkan shell berbeda.
- Navigation Inspector dan `instant()` dari `@next/playwright` membantu verifikasi.
- Detail Instant Insights masih dapat berubah; ikuti dokumentasi versi terpasang.

<!--
Sumber: https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching
https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
-->

---
class: module-content
---

### Prediksi: Dua Cache Berbeda

<LearningCheck
  question="Mutasi berhasil di browser. Apakah invalidateQueries memperbarui cache server Next.js?"
  :options='["Ya, semua cache otomatis sinkron", "Tidak; cache browser dan server memiliki mekanisme invalidasi sendiri", "Cukup reload tab untuk semua pengguna"]'
  :answer="1"
  explanation="Query invalidation menandai cache TanStack Query stale. Jika data juga dicache di server, tentukan invalidasi server sesuai konfigurasi aplikasi."
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

## 4 Hal Penting dari Modul 07

1. **Strategi Caching Modern**: `fetch()` tidak di-cache secara default di Next.js 15 & 16. Caching kini eksplisit via ISR (`revalidate`), `force-cache`, atau `'use cache'` (Cache Components).
2. **Special Files Otomatis**: `loading.tsx` untuk skeleton loading, `error.tsx` untuk error boundary, `not-found.tsx` untuk halaman 404.
3. **Suspense & Streaming (PPR)**: Mengalirkan potongan halaman secara independen sebagai fondasi Partial Prerendering modern.
4. **Jembatan ke CSR**: Data fetching di server tuntas di sini. Untuk data interaktif di browser (_Client-Side Rendering_), kita lanjut ke **Modul 08 (TanStack Query)**!

<!--
Checkpoint: Cache dan Kegagalan Data
Bandingkan request-time fetch dengan data cached. Mutasikan data bertag, amati stale-while-revalidate, dan buktikan fallback/error dapat tampil.
Sumber primer: https://nextjs.org/docs/app/getting-started/revalidating
Audit: 25 September 2026.
-->
