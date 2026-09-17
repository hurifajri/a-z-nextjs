---
layout: intro
badge: "MODUL 16"
badgeColor: "purple"
level: 1
---

## 16. Build, Deploy & Monitoring

Menyiapkan project untuk produksi, deploy ke Vercel, dan memantau performa setelah online.

---

### Build untuk Produksi

Mengompilasi project agar siap diakses pengguna

```bash
npm run build
```

<v-clicks>

- 📦 **Mengompilasi** semua halaman (Server + Client Components)
- 🗂️ **Menghasilkan** folder `.next/` berisi file-file produksi
- ⚡ **Optimasi otomatis**: minify JS/CSS, tree-shaking, code splitting
- 📊 **Laporan ukuran**: Menampilkan ukuran setiap route

</v-clicks>

<div v-click class="mt-4">

```text
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB        89 kB
├ ○ /about                     178 B         84 kB
├ λ /api/todos                 0 B            0 B
├ λ /dashboard                 2.1 kB        86 kB
└ ○ /login                     1.3 kB        85 kB
○ (Static)  λ (Server)  ƒ (Dynamic)
```

</div>

---

### Simbol Build Output

Memahami arti simbol pada laporan build

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="brutal-card bg-white p-3 text-center" v-click>
    <div class="text-3xl mb-2">○</div>
    <strong>Static (SSG)</strong>
    <p class="text-xs text-gray-600 mt-1">Di-generate saat build. Paling cepat!</p>
  </div>
  <div class="brutal-card bg-white p-3 text-center" v-click>
    <div class="text-3xl mb-2">λ</div>
    <strong>Server (SSR)</strong>
    <p class="text-xs text-gray-600 mt-1">Dirender setiap request. Selalu fresh.</p>
  </div>
  <div class="brutal-card bg-white p-3 text-center" v-click>
    <div class="text-3xl mb-2">ƒ</div>
    <strong>Dynamic</strong>
    <p class="text-xs text-gray-600 mt-1">Server-rendered dengan dynamic params.</p>
  </div>
</div>

<div v-click class="mt-6 brutal-card bg-white p-3 text-sm">
  💡 <strong>First Load JS</strong> harus di bawah <strong>100 kB</strong> per halaman untuk performa optimal. Jika terlalu besar, pecah komponen client!
</div>

---

### Environment Variables

Mengelola konfigurasi yang berbeda di development dan production

```text {1-3|5-7|all}
# .env.local — HANYA di development (tidak masuk Git!)
DATABASE_URL=sqlite://local.db
JWT_SECRET=rahasia-dev-saja

# .env.production — Untuk production
DATABASE_URL=postgresql://user:pass@prod-db:5432/app
JWT_SECRET=rahasia-production-sangat-panjang
```

<div v-click class="mt-4 grid grid-cols-2 gap-3 text-xs">
  <div class="brutal-card bg-white p-2">
    <strong>Server-only (default)</strong><br/>
    <code>DATABASE_URL</code><br/>
    Hanya bisa diakses di server
  </div>
  <div class="brutal-card bg-white p-2">
    <strong>Public (exposed ke client)</strong><br/>
    <code>NEXT_PUBLIC_API_URL</code><br/>
    Bisa diakses di browser
  </div>
</div>

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  ⚠️ Prefix <code>NEXT_PUBLIC_</code> = terekspos ke browser! JANGAN taruh secret key dengan prefix ini.
</div>

---

### Deploy ke Vercel

Platform resmi buatan tim Next.js — deploy semudah push ke Git

<v-clicks>

1. **Push ke GitHub** — Pastikan project sudah di-push ke repository GitHub.
2. **Buka vercel.com** — Login dengan akun GitHub Antum.
3. **Import Project** — Pilih repository, Vercel otomatis deteksi Next.js.
4. **Set Environment Variables** — Tambahkan `DATABASE_URL`, `JWT_SECRET`, dll.
5. **Deploy!** — Klik "Deploy" dan tunggu beberapa menit.
6. **Domain Otomatis** — Dapat URL gratis: `my-app.vercel.app`

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm text-center">
  🎉 Setiap push ke branch <code>main</code> akan otomatis trigger <strong>auto-deploy</strong>!
</div>

---

### Alternatif Deployment

Vercel bukan satu-satunya pilihan

| Platform    | Kelebihan                                 | Cocok Untuk              |
| :---------- | :---------------------------------------- | :----------------------- |
| **Vercel**  | Paling mudah, auto-deploy, Edge Functions | Semua project Next.js    |
| **Netlify** | Mirip Vercel, banyak plugin               | Static sites, JAMstack   |
| **Railway** | Database built-in, mudah scale            | Fullstack + database     |
| **Docker**  | Kontrol penuh, self-hosted                | Enterprise, custom infra |
| **VPS**     | Murah, kontrol total                      | Budget terbatas          |

---

### Monitoring Setelah Deploy

Memantau kesehatan aplikasi yang sudah online

<v-clicks>

- 📊 **Vercel Analytics** — Core Web Vitals (LCP, FID, CLS) otomatis
- 🔍 **Vercel Logs** — Lihat log server dan error real-time
- ⚡ **Speed Insights** — Performa halaman per-route
- 🐛 **Error Tracking** — Integrasikan dengan Sentry untuk error monitoring
- 📈 **Uptime Monitoring** — Gunakan UptimeRobot atau Better Stack (gratis)

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🎯 <strong>Target Performa:</strong> LCP &lt; 2.5 detik, FID &lt; 100ms, CLS &lt; 0.1 — ini standar Google untuk web yang baik.
</div>

---

### Troubleshooting Umum

Masalah yang sering muncul setelah deploy dan cara mengatasinya

<v-clicks>

- 🔴 **Build Error** — Jalankan `npm run build` di lokal dulu sebelum push. Perbaiki semua error TypeScript!
- 🔴 **Environment Variables kosong** — Cek apakah sudah di-set di Vercel Dashboard, bukan hanya di `.env.local`.
- 🔴 **API 500 Error** — Cek log di Vercel → Functions tab. Biasanya database connection gagal.
- 🟡 **Halaman lambat** — Cek apakah halaman pakai `cache: "no-store"` padahal bisa di-cache. Gunakan ISR jika memungkinkan.
- 🟡 **Bundle terlalu besar** — Gunakan `import dynamic` untuk komponen besar: `const Chart = dynamic(() => import("./Chart"), { ssr: false })`

</v-clicks>

---

### Checklist Sebelum Deploy

Pastikan semua sudah siap sebelum rilis ke publik

<v-clicks>

- ☐ `npm run build` berhasil tanpa error
- ☐ Semua test lulus (`npx vitest run`)
- ☐ Environment variables sudah di-set di Vercel
- ☐ Halaman responsif di mobile dan desktop
- ☐ Loading dan error state sudah ditangani
- ☐ Metadata SEO sudah diatur (title, description)
- ☐ `favicon.ico` dan `opengraph-image` sudah ada
- ☐ HTTPS aktif (otomatis di Vercel)

</v-clicks>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade
---

## 3 Hal Penting dari Modul 16

1. **Build Lokal Dulu**: Selalu jalankan `npm run build` di komputer Antum sebelum deploy. Perbaiki semua error TypeScript dan pastikan output size wajar.
2. **Vercel = Deploy Mudah**: Push ke GitHub → import di Vercel → set env vars → deploy. Auto-deploy setiap push ke `main`.
3. **Monitor Setelah Deploy**: Pantau Core Web Vitals, error logs, dan uptime. Aplikasi yang sudah online tetap butuh perhatian!
