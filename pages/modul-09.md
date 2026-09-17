---
layout: intro
badge: "MODUL 09"
badgeColor: "yellow"
level: 1
---

## 09. Form Management, Validasi (Valibot) & Mutasi API

Pengelolaan Form Modern, Mengatasi Masalah Form Manual dengan React Hook Form & TanStack Form, Skema Validasi dengan Valibot (vs Zod), serta Mutasi Data API.

---
layout: two-cols
---

### Controlled vs Uncontrolled Input

Dua Pendekatan Mengelola Nilai Input di React

::left::

#### Controlled Input

Nilai dikendalikan penuh oleh state React:

```tsx {2|5-6|all}
"use client"
const [nama, setNama] = useState("")

<input
  value={nama}
  onChange={e => setNama(e.target.value)}
/>
```

- ✅ Sinkronisasi instan ke state
- ❌ **Re-render setiap ketikan satu huruf**
- ❌ Boros komputasi pada form yang memiliki puluhan field!

::right::

#### Uncontrolled Input

Nilai disimpan langsung oleh DOM browser:

```tsx
"use client"
const inputRef = useRef<HTMLInputElement>(null)

<input ref={inputRef} defaultValue="Fulan" />
```

- ⚡ **Tanpa Re-render**: Mengetik ribuan kata tidak memicu komponen render ulang.
- 🚀 Performa sangat tinggi!
- 💡 Konsep inilah yang dimanfaatkan oleh library modern seperti **React Hook Form**.

---

### Mengapa Form Manual Sulit di Skala Besar?

Tantangan Nyata Saat Mengelola Form Kompleks Hanya dengan `useState`

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="brutal-card bg-white p-3 text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">💥 Masalah Performa</div>
    <p class="text-gray-600">Form dengan 15 input berarti 15 state. Setiap kali pengguna mengetik di satu kolom, <strong>ke-15 kolom lainnya ikut ter-render ulang</strong>.</p>
  </div>
  <div class="brutal-card bg-white p-3 text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">🍝 Validasi Rumit</div>
    <p class="text-gray-600">Puluhan baris <code>if-else</code> manual untuk cek email, minimal karakter, konfirmasi password, hingga field bersarang.</p>
  </div>
</div>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🌟 <strong>Solusi Komunitas Open Source:</strong>
  <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
    <div><strong>React Hook Form (RHF)</strong><br/>Standar industri, uncontrolled & super cepat</div>
    <div><strong>TanStack Form</strong><br/>Modern, type-safe lintas framework</div>
    <div><strong>Formik</strong><br/>Library populer era lama</div>
  </div>
</div>

---
layout: two-cols
---

### Skema Validasi: Kenapa Memilih Valibot?

Validasi Data Runtime yang Ringan dan Modular

::left::

#### 🪶 Valibot _(Pilihan Utama Kita)_

- 📦 **Ukuran Mini**: Kurang dari **1 kB** (karena fungsi didesain _modular & tree-shakable_).
- ⚡ Mengurangi beban bundle website hingga **98%** dibanding library validasi tradisional!
- 🎯 Syntax deklaratif yang sangat bersih.

```bash
npm install valibot @hookform/resolvers
```

::right::

#### 📦 Alternatif di Ekosistem: Zod

- **Zod**: Standar yang sangat populer di Next.js saat ini. Sangat kaya fitur, namun ukuran bundlenya cukup besar (~12–14 kB) karena monolitik.
- **Yup**: Populer di masa lalu bersama Formik.
- **TypeBox**: Berfokus pada integrasi JSON Schema murni.

<div v-click class="mt-2 brutal-card bg-yellow-100 p-2 text-xs border-2 border-black">
  💡 Prinsip Valibot & Zod sama: Antum menulis aturan validasi satu kali, lalu otomatis mendapatkan <strong>TypeScript Type</strong> gratis!
</div>

---

### Contoh Skema Validasi dengan Valibot

Mendefinisikan Aturan Validasi Secara Deklaratif

```tsx {1-2|4-10|12-13|all}
import * as v from "valibot";

// 1. Definisikan aturan skema
export const RegisterSchema = v.object({
  nama: v.pipe(v.string(), v.minLength(3, "Nama minimal 3 karakter")),
  email: v.pipe(v.string(), v.email("Format email tidak sah")),
  password: v.pipe(v.string(), v.minLength(8, "Password minimal 8 karakter")),
  umur: v.pipe(
    v.number("Umur harus angka"),
    v.minValue(17, "Minimal 17 tahun"),
  ),
});

// 2. Ekstrak tipe TypeScript otomatis (Infer Type)!
export type RegisterFormValues = v.InferOutput<typeof RegisterSchema>;
// RegisterFormValues otomatis punya properti { nama, email, password, umur }
```

---

### Integrasi: React Hook Form + Valibot

Kombinasi Sempurna untuk Form Cepat, Hemat Memori, dan Type-Safe

```tsx {3-5|7-10|12-14|17-21|all}
"use client";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { RegisterSchema, type RegisterFormValues } from "./schema";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: valibotResolver(RegisterSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("nama")}
        placeholder="Nama Lengkap"
        className="border p-2 w-full rounded"
      />
      {errors.nama && (
        <p className="text-red-500 text-xs">{errors.nama.message}</p>
      )}

      <button disabled={isSubmitting} className="brutal-btn">
        {isSubmitting ? "Mendaftarkan..." : "Daftar Akun"}
      </button>
    </form>
  );
}
```

---
layout: two-cols
---

### Mutasi Data: POST, PUT, DELETE

Mengirim Perubahan Data ke Endpoint Backend

::left::

#### Tiga Aksi Utama

- **POST**: Menambah data baru (_Create_)
- **PUT / PATCH**: Memperbarui data yang ada (_Update_)
- **DELETE**: Menghapus data (_Delete_)

```tsx
// Contoh PUT: Update data
await fetch(`/api/todos/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ done: true }),
});
```

::right::

#### Status Code yang Wajib Dipahami

| Kode          | Kategori          | Arti                           |
| :------------ | :---------------- | :----------------------------- |
| **200 / 201** | ✅ Sukses         | Data diproses / dibuat         |
| **400**       | ⚠️ Validasi Gagal | Data input tidak sesuai skema  |
| **401**       | 🔒 Unauthorized   | Token sesi habis / belum login |
| **404**       | ❓ Not Found      | Data yang mau diubah tidak ada |
| **500**       | 💥 Server Error   | Kendala teknis di backend      |

<div v-click class="mt-2 brutal-card bg-white p-2 text-xs">
  💡 Selalu periksa <code>if (!res.ok)</code> sebelum menampilkan notifikasi sukses ke user!
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 09

1. **React Hook Form Mencegah Re-render Berlebih**: Menggunakan pendekatan _uncontrolled_ sehingga pengetikan input form besar tetap mulus dan cepat.
2. **Valibot sebagai Skema Validasi Super Ringan**: Memberikan validasi data yang aman, deklaratif, dan auto-generate tipe TypeScript dengan ukuran bundle kurang dari 1 kB (dibandingkan Zod yang lebih berat).
3. **Pahami Metode & Status Respon HTTP**: Padukan validasi frontend dengan respon status code yang tepat (201, 400, 401, 500) untuk pengalaman pengguna yang andal.
