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

- 📦 **Mengompilasi** dengan engine Turbopack bawaan (super cepat)
- 🗂️ **Menghasilkan** folder `.next/` berisi file-file produksi
- ⚡ **Optimasi otomatis**: minify JS/CSS, tree-shaking, code splitting
- 📊 **Identifikasi Rute**: Menampilkan tipe rendering (Static ○ vs Dynamic ƒ)

</v-clicks>

<div v-click class="mt-4">

```text
Route (app)
┌ ○ /
├ ○ /about
├ ƒ /api/todos
├ ƒ /dashboard
└ ○ /login
○ (Static)  ƒ (Dynamic)
```

</div>

---

### Simbol Build Output & Performa

Memahami klasifikasi halaman di Next.js 16

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="brutal-card bg-white p-3 text-center" v-click>
    <div class="text-3xl mb-2">○</div>
    <strong>Static (Prerendered)</strong>
    <p class="text-xs text-gray-600 mt-1">Di-generate saat build / di-cache. Siap dikirim 0ms dari CDN Edge.</p>
  </div>
  <div class="brutal-card bg-white p-3 text-center" v-click>
    <div class="text-3xl mb-2">ƒ</div>
    <strong>Dynamic (Server-Rendered)</strong>
    <p class="text-xs text-gray-600 mt-1">Diproses di server pada setiap request pengguna (atau via streaming).</p>
  </div>
</div>

<div v-click class="mt-6 brutal-card bg-white p-3 text-sm">
  💡 <strong>Next.js 16 Update:</strong> Kolom <code>Size</code> dan <code>First Load JS</code> telah dihapus dari build output karena tidak lagi akurat untuk React Server Components (RSC). Tolok ukur performa kini dinilai langsung dari <strong>Core Web Vitals</strong> di browser pengguna nyata!
</div>

---

### Environment Variables

Mengelola konfigurasi yang berbeda di development dan production

```text {1-3|5-7|all}
# .env.local — ONLY in development (never commit to Git!)
DATABASE_URL=sqlite://local.db
JWT_SECRET=dev-secret-key-only

# .env.production — For production
DATABASE_URL=postgresql://user:pass@prod-db:5432/app
JWT_SECRET=production-secret-key-very-long
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

- 📊 **Vercel Analytics** — Core Web Vitals (LCP, INP, CLS) otomatis
- 🔍 **Vercel Logs** — Lihat log server dan error real-time
- ⚡ **Speed Insights** — Performa halaman per-route
- 🐛 **Error Tracking** — Integrasikan dengan Sentry untuk error monitoring
- 📈 **Uptime Monitoring** — Gunakan UptimeRobot atau Better Stack (gratis)

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🎯 <strong>Target Core Web Vitals (Standar Google):</strong> LCP &lt; 2.5 detik, INP &lt; 200ms, CLS &lt; 0.1 untuk pengalaman browsing yang mulus.
</div>

---

### Troubleshooting Umum

Masalah yang sering muncul setelah deploy dan cara mengatasinya

<v-clicks>

- 🔴 **Build Error** — Jalankan `npm run build` di lokal dulu sebelum push. Perbaiki semua error TypeScript!
- 🔴 **Environment Variables kosong** — Cek apakah sudah di-set di Vercel Dashboard, bukan hanya di `.env.local`.
- 🔴 **API 500 Error** — Cek log di Vercel → Functions tab. Biasanya database connection gagal.
- 🟡 **Halaman lambat** — Cek apakah ada query berat tanpa caching. Gunakan ISR atau `'use cache'` (Cache Components).
- 🟡 **Bundle terlalu besar** — Gunakan `import dynamic` untuk komponen besar: `const Chart = dynamic(() => import("./Chart"), { ssr: false })`

</v-clicks>

---

### Checklist Sebelum Deploy

Pastikan semua sudah siap sebelum rilis ke publik

<v-clicks>

- ☐ `npm run build` (Turbopack) berhasil tanpa error
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

1. **Build dengan Engine Turbopack**: Kompilasi produksi Next.js 16 menggunakan Turbopack secara default. Selalu uji `npm run build` di lokal sebelum deploy.
2. **Vercel = Deploy Mudah**: Push ke GitHub → import di Vercel → set env vars → deploy. Auto-deploy setiap push ke `main`.
3. **Monitor Core Web Vitals**: Pantau LCP, INP, CLS, error logs, dan uptime setelah website live untuk menjaga kepuasan pengunjung!
