---
layout: intro
badge: "MODUL 16"
badgeColor: "purple"
level: 1
---

## 16. Build, Deploy & Monitoring

Menyiapkan project untuk produksi, deploy ke Vercel, dan memantau performa setelah online.

---
class: module-content
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
class: module-content
---

### Simbol Build Output & Performa

Memahami klasifikasi halaman di Next.js 16

<div class="grid grid-cols-2 gap-4 mt-6">
  <BrutalCard class="text-center" v-click>
    <div class="text-3xl mb-2">○</div>
    <strong>Static (Prerendered)</strong>
    <p class="text-xs text-gray-600 mt-1">Di-generate saat build / di-cache. Dapat dilayani dari cache/CDN; latensi dan cache miss tetap ada.</p>
  </BrutalCard>
  <BrutalCard class="text-center" v-click>
    <div class="text-3xl mb-2">ƒ</div>
    <strong>Dynamic (Server-Rendered)</strong>
    <p class="text-xs text-gray-600 mt-1">Diproses di server pada setiap request pengguna (atau via streaming).</p>
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-6">
  💡 <strong>Next.js 16 Update:</strong> Kolom <code>Size</code> dan <code>First Load JS</code> telah dihapus dari build output karena tidak lagi akurat untuk React Server Components (RSC). Tolok ukur performa kini dinilai langsung dari <strong>Core Web Vitals</strong> di browser pengguna nyata!
</BrutalCard>

---
class: module-content
---

### Environment Variables

Mengelola konfigurasi yang berbeda di development dan production

```text {1-3|5-7|all}
# .env.local — override lokal; juga dibaca di production, kecuali mode test
DATABASE_URL=./local.db
SESSION_SECRET=<generate-a-random-secret>

# Produksi: inject lewat secret manager platform; jangan commit nilai secret
DATABASE_URL=postgresql://user:pass@prod-db:5432/app
SESSION_SECRET=<injected-by-platform>
```

<div v-click class="mt-4 grid grid-cols-2 gap-3 text-xs">
  <BrutalCard>
    <strong>Server-only (default)</strong><br/>
    <code>DATABASE_URL</code><br/>
    Hanya bisa diakses di server
  </BrutalCard>
  <BrutalCard>
    <strong>Public (exposed ke client)</strong><br/>
    <code>NEXT_PUBLIC_API_URL</code><br/>
    Bisa diakses di browser
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-3">
  ⚠️ Prefix <code>NEXT_PUBLIC_</code> = terekspos ke browser! JANGAN taruh secret key dengan prefix ini.
</BrutalCard>

---
class: module-content
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

<BrutalCard v-click class="mt-4 text-center">
  🎉 Setiap push ke branch <code>main</code> akan otomatis trigger <strong>auto-deploy</strong>!
</BrutalCard>

---
class: module-content
---

### Alternatif Deployment

Vercel bukan satu-satunya pilihan

| Platform    | Kelebihan                                 | Cocok Untuk                                           |
| :---------- | :---------------------------------------- | :---------------------------------------------------- |
| **Vercel**  | Paling mudah, auto-deploy, Edge Functions | Aplikasi yang cocok dengan runtime dan limit platform |
| **Netlify** | Mirip Vercel, banyak plugin               | Static sites, JAMstack                                |
| **Railway** | Layanan aplikasi dan database terkelola   | Fullstack + database                                  |
| **Docker**  | Kontrol penuh, self-hosted                | Enterprise, custom infra                              |
| **VPS**     | Murah, kontrol total                      | Budget terbatas                                       |

---
class: module-content
---

### Monitoring Setelah Deploy

Memantau kesehatan aplikasi yang sudah online

<v-clicks>

- 📊 **Vercel Analytics** — Traffic, page views, dan perilaku kunjungan
- 🔍 **Vercel Logs** — Lihat log server dan error real-time
- ⚡ **Speed Insights** — Performa halaman per-route
- 🐛 **Error Tracking** — Integrasikan dengan Sentry untuk error monitoring
- 📈 **Uptime Monitoring** — Pantau endpoint dan alur kritis; atur alert serta penanggung jawab

</v-clicks>

<BrutalCard v-click class="mt-4">
  🎯 <strong>Target Core Web Vitals (Standar Google):</strong> LCP ≤ 2.5 detik, INP ≤ 200ms, CLS ≤ 0.1 pada persentil ke-75, dipisah mobile/desktop untuk pengalaman browsing yang mulus.
</BrutalCard>

---
class: module-content
---

### Troubleshooting Umum

Masalah yang sering muncul setelah deploy dan cara mengatasinya

<v-clicks>

- 🔴 **Build Error** — Jalankan `npm run build` di lokal dulu sebelum push. Perbaiki semua error TypeScript!
- 🔴 **Environment Variables kosong** — Cek apakah sudah di-set di Vercel Dashboard, bukan hanya di `.env.local`.
- 🔴 **API 500 Error** — Cek log di Vercel → Functions tab. Biasanya database connection gagal.
- 🟡 **Halaman lambat** — Cek apakah ada query berat tanpa caching. Gunakan ISR atau `'use cache'` (Cache Components).
- 🟡 **Bundle terlalu besar** — Gunakan `next/dynamic` untuk komponen besar. `ssr: false` hanya pada Client Component dan bila memang perlu: `const Chart = dynamic(() => import("./Chart"), { ssr: false })`

</v-clicks>

---
class: module-content
---

### Checklist Sebelum Deploy

Pastikan semua sudah siap sebelum rilis ke publik

<v-clicks>

- ☐ `npm run build` (Turbopack) berhasil tanpa error
- ☐ Lint, typecheck, unit/integration, dan E2E alur kritis lulus
- ☐ Environment variables sudah di-set di Vercel
- ☐ Halaman responsif di mobile dan desktop
- ☐ Loading dan error state sudah ditangani
- ☐ Metadata SEO sudah diatur (title, description)
- ☐ `favicon.ico` dan `opengraph-image` sudah ada
- ☐ HTTPS, auth/ownership, migration, backup, dan rollback sudah diuji

</v-clicks>

---
class: module-content
---

### Deployment Mini Project: Pilih Penyimpanan yang Benar

| Target                       | Implikasi database                                         |
| :--------------------------- | :--------------------------------------------------------- |
| Node server + disk persisten | SQLite lokal dapat dipakai; rancang backup dan concurrency |
| Serverless / replika jamak   | Jangan mengandalkan file SQLite di filesystem instance     |
| Database terkelola           | Gunakan driver sesuai provider; migrasi schema dan uji SQL |

- Jalankan migration sebagai langkah rilis terkontrol, bukan setiap request.
- Gunakan pooling/driver yang sesuai; pisahkan database dev, preview, test, dan production.
- Static export tidak menjalankan API dinamis, Server Actions, atau sesi server.
- Siapkan rollback aplikasi dan migration yang kompatibel dengan versi sebelumnya.

<!--
Sumber: https://nextjs.org/docs/app/guides/self-hosting
-->

---
class: module-content
---

### Gerbang Rilis dan Operasional

```bash
npm ci
npx eslint .
npx next typegen
npx tsc --noEmit
npx vitest run
npm run build
npx playwright test
```

- `NEXT_PUBLIC_*` masuk bundle saat build: perubahan nilainya memerlukan rebuild.
- `next build` tidak menggantikan lint, integration test, atau smoke test setelah deploy.
- Pantau error rate, latensi p95, Core Web Vitals, dan biaya; redaksi data sensitif di log.
- **25 Sep 2026:** 16.3.6 tersedia; 16.3.7 baru dijadwalkan 30 Sep. Pantau advisory dan rencanakan patch.

<!--
Sumber: https://nextjs.org/blog/nextjs-security-update-september-22-2026
https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026
https://web.dev/articles/vitals
-->

---
class: module-content
---

### Prediksi: Siap Rilis?

<LearningCheck
  question="Build lolos, tetapi Todo hilang setelah instance diganti. Apa yang perlu diperiksa?"
  :options='["Warna tombol dan animasi loading", "Persistensi penyimpanan, konfigurasi lingkungan, dan uji setelah deploy", "Cukup mengulang build sampai berhasil"]'
  :answer="1"
  explanation="Build lolos belum membuktikan data persisten. Cocokkan database dengan hosting, jalankan migrasi terkontrol, dan uji CRUD setelah deploy."
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
transition: fade
---

## 3 Hal Penting dari Modul 16

1. **Build dengan Engine Turbopack**: Kompilasi produksi Next.js 16 menggunakan Turbopack secara default. Selalu uji `npm run build` di lokal sebelum deploy.
2. **Vercel = Deploy Mudah**: Push ke GitHub → import di Vercel → set env vars → deploy. Auto-deploy setiap push ke `main`.
3. **Monitor Core Web Vitals**: Pantau LCP, INP, CLS, error logs, dan uptime setelah website live untuk menjaga kepuasan pengunjung!

<!--
Checkpoint: Rilis yang Bisa Dipulihkan
Uji build production, migration di staging, smoke test CRUD/auth, dan rollback. Pastikan data bertahan setelah redeploy serta alert memiliki penerima yang jelas.
Sumber primer: https://nextjs.org/docs/app/guides/production
Audit: 25 September 2026.
-->
