---
layout: intro
badge: "MODUL 02"
badgeColor: "cyan"
---

## 02. Setup Project dan Tools

Inisialisasi project Next.js pertama Antum, menyiapkan ESLint, Prettier, Tailwind CSS, serta memahami perbedaan Pages Router vs App Router.

---

### Inisialisasi Project Baru

Cara termudah memulai project Next.js

Gunakan `create-next-app` untuk membuat project dengan konfigurasi standar terbaik:

```bash
npx create-next-app@latest my-next-app
```

<div class="mt-6 brutal-card bg-white p-4">
  <span class="brutal-badge brutal-badge-green mb-2">💡 Pra-Syarat</span>
  <p class="text-sm mt-2">Pastikan Antum sudah menginstal <strong>Node.js 18.17</strong> atau lebih baru dan <strong>npm/pnpm/yarn</strong> sebagai package manager.</p>
</div>

---

### Opsi Setup Project

Setiap pilihan menentukan fondasi project Antum

````md magic-move
```bash
✔ What is your project named? … my-next-app
```
```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
```
```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
```
```bash
✔ What is your project named? … my-next-app
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias? … No
```
````

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  ✅ Pilih <strong>Yes</strong> untuk semua opsi di atas — ini rekomendasi standar pelatihan kita!
</div>

---

### Struktur Folder Project

Mengenal isi project baru hasil `create-next-app`

<v-clicks>

- 📁 **`src/app/`** — Jantung aplikasi! Berisi route, layout, dan seluruh halaman website Antum.
- 📁 **`public/`** — Tempat asset statis (gambar, favicon, font) yang bisa diakses langsung via URL.
- 📄 **`next.config.ts`** — Pengaturan utama Next.js (redirect, env, dll).
- 📄 **`tailwind.config.ts`** — Konfigurasi tema, warna, dan breakpoints Tailwind CSS.
- 📄 **`tsconfig.json`** — Konfigurasi compiler TypeScript dan path alias `@/`.
- 📄 **`package.json`** — Daftar dependencies, scripts (`dev`, `build`, `start`).
- 📄 **`.eslintrc.json`** — Aturan linting khusus untuk menjaga kualitas kode.

</v-clicks>

---
layout: two-cols
---

### ESLint dan Prettier

Menjaga kode tetap bersih, rapi, dan konsisten

::left::

#### ESLint (Sudah Bawaan)

Mendeteksi **error dan bad practice** dalam kode:

```json
{
  "extends": "next/core-web-vitals"
}
```

Jalankan pemeriksaan:
```bash
npx next lint
```

::right::

#### Prettier (Perlu Ditambahkan)

Formatting kode otomatis agar **seragam** dalam tim:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Buat file `.prettierrc`:
```json {3|4|all}
{
  "semi": false,
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### Tailwind CSS: Styling Cepat

Menulis CSS langsung di dalam atribut class — tanpa file CSS terpisah!

````md magic-move
```tsx
// ❌ CSS Tradisional: buat file CSS terpisah
import "./button.css"

export default function Button() {
  return <button className="btn-primary">Klik Saya</button>
}
```
```tsx
// ✅ Tailwind CSS: styling langsung di className!
export default function Button() {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Klik Saya
    </button>
  )
}
```
````

<div v-click class="mt-4 grid grid-cols-3 gap-3 text-xs">
  <div class="brutal-card bg-white p-2 text-center">
    <code>bg-blue-500</code><br/>Warna latar
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <code>px-4 py-2</code><br/>Padding
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <code>hover:bg-blue-600</code><br/>Efek hover
  </div>
</div>

---
layout: two-cols
---

### Pages Router vs App Router

Dua pendekatan routing di Next.js

::left::

#### Pages Router _(Lama)_

```text
pages/
  ├── index.tsx       → /
  ├── about.tsx        → /about
  ├── _app.tsx        → Layout global
  └── blog/
      └── [slug].tsx   → /blog/:slug
```

- Komponen = **Client** secara default
- Layout via `_app.tsx` (kurang fleksibel)
- `getServerSideProps` / `getStaticProps`

::right::

#### App Router _(Baru, Kita Pakai!)_

```text
app/
  ├── layout.tsx      → Layout global
  ├── page.tsx         → /
  ├── about/
  │   └── page.tsx     → /about
  └── blog/
      └── [slug]/
          └── page.tsx → /blog/:slug
```

- Komponen = **Server** secara default
- Nested layouts di setiap folder
- `fetch()` langsung di komponen

---

### Menjalankan Development Server

Mari lihat hasil instalasi kita!

```bash
npm run dev
```

<v-clicks>

1. 🌐 Buka browser → `http://localhost:3000`
2. 🎉 Antum akan melihat halaman selamat datang dari Next.js!
3. ✏️ Coba edit `src/app/page.tsx`, simpan, dan lihat perubahannya langsung secara *real-time* (Fast Refresh).

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3">
  <span class="brutal-badge brutal-badge-cyan">SCRIPTS PENTING</span>
  <div class="grid grid-cols-3 gap-2 mt-3 text-xs">
    <div><code>npm run dev</code> — Mode development</div>
    <div><code>npm run build</code> — Kompilasi produksi</div>
    <div><code>npm run start</code> — Jalankan hasil build</div>
  </div>
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 02

1. **`create-next-app` Siap Pakai**: Satu perintah langsung dapat project lengkap dengan TypeScript, ESLint, dan Tailwind CSS.
2. **App Router Adalah Standar Baru**: Gunakan folder `app/` dengan Server Components sebagai default — lebih cepat dan aman.
3. **Tailwind CSS = Produktivitas**: Styling langsung di `className` tanpa berpindah file, otomatis konsisten di seluruh tim.
