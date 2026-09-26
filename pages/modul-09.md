---
layout: intro
badge: "MODUL 09"
badgeColor: "yellow"
level: 1
---

## 09. Form Management, Validasi (Valibot) & Mutasi API

Pengelolaan Form Modern, Mengatasi Masalah Form Manual dengan React Hook Form & TanStack Form, Skema Validasi dengan Valibot (vs Zod), serta Mutasi Data API.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
layout: two-cols
---

### Controlled vs Uncontrolled Input

Dua Pendekatan Mengelola Nilai Input di React

::left::

#### Controlled Input

Nilai dikendalikan penuh oleh state React:

```tsx {2|5-6|all}
"use client";
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />;
```

- ✅ Sinkronisasi instan ke state
- ❌ **Re-render setiap ketikan satu huruf**
- 💡 Biasanya cukup untuk form sederhana; ukur sebelum optimasi.

::right::

#### Uncontrolled Input

Nilai disimpan langsung oleh DOM browser:

```tsx
"use client";
const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} defaultValue="John Doe" />;
```

- ⚡ **Tanpa Re-render**: Mengetik ribuan kata tidak memicu komponen render ulang.
- 🚀 Performa sangat tinggi!
- 💡 Konsep inilah yang dimanfaatkan oleh library modern seperti **React Hook Form**.

---
class: module-content
---

### Mengapa Form Manual Sulit di Skala Besar?

Tantangan Nyata Saat Mengelola Form Kompleks Hanya dengan `useState`

<div class="grid grid-cols-2 gap-4 mt-4">
  <BrutalCard class="text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">💥 Masalah Performa</div>
    <p class="text-gray-600">State pada parent dapat menyebabkan subtree ikut dirender. Dampaknya bergantung struktur komponen, subscription, dan memoization.</p>
  </BrutalCard>
  <BrutalCard class="text-xs" v-click>
    <div class="font-black text-sm mb-1 text-red-600">🍝 Validasi Rumit</div>
    <p class="text-gray-600">Puluhan baris <code>if-else</code> manual untuk cek email, minimal karakter, konfirmasi password, hingga field bersarang.</p>
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-4">
  🌟 <strong>Solusi Komunitas Open Source:</strong>
  <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
    <div><strong>React Hook Form (RHF)</strong><br/>Standar industri, uncontrolled & super cepat</div>
    <div><strong>TanStack Form</strong><br/>Modern, type-safe lintas framework</div>
    <div><strong>Formik</strong><br/>Library populer era lama</div>
  </div>
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Skema Validasi: Kenapa Memilih Valibot?

Validasi Data Runtime yang Ringan dan Modular

::left::

#### 🪶 Valibot _(Pilihan Utama Kita)_

- 📦 **Ukuran Mini**: API modular dan tree-shakable; ukuran akhir bergantung schema yang diimpor.
- ⚡ Ukur output build untuk membandingkan biaya validasi di browser.
- 🎯 Syntax deklaratif yang sangat bersih.

```bash
npm install react-hook-form valibot @hookform/resolvers
```

::right::

#### 📦 Alternatif di Ekosistem: Zod

- **Zod**: Standar yang sangat populer di Next.js saat ini. Ekosistem luas; Zod 4 juga menyediakan Zod Mini. Pilih berdasarkan integrasi dan ukuran schema nyata.
- **Yup**: Populer di masa lalu bersama Formik.
- **TypeBox**: Berfokus pada integrasi JSON Schema murni.

<BrutalCard v-click class="mt-2 bg-yellow-100 text-xs">
  💡 Prinsip Valibot & Zod sama: Antum menulis aturan validasi satu kali, lalu otomatis mendapatkan <strong>TypeScript Type</strong> gratis!
</BrutalCard>

---
class: module-content
---

### Contoh Skema Validasi dengan Valibot

Mendefinisikan Aturan Validasi Secara Deklaratif

```tsx {1-2|4-10|12-13|all}
import * as v from "valibot";

// 1. Define schema rules
export const RegisterSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.minLength(3, "Full name must be at least 3 characters"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email format")),
  password: v.pipe(
    v.string(),
    v.minLength(15, "Use at least 15 characters for this exercise"),
  ),
  age: v.pipe(
    v.number("Age must be a number"),
    v.integer("Use a whole number"),
    v.minValue(17, "Must be at least 17 years old"),
  ),
});

// 2. Extract TypeScript type automatically (Infer Type)!
export type RegisterFormValues = v.InferOutput<typeof RegisterSchema>;
// RegisterFormValues automatically has properties { fullName, email, password, age }
```

---
zoom: 0.85
class: module-content
---

### Integrasi: React Hook Form + Valibot

Pisahkan setup/submit dan markup agar contoh mudah diikuti

```tsx
// src/components/RegisterForm.tsx (bagian 1; lanjutkan return di slide berikut)
"use client";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { RegisterSchema, type RegisterFormValues } from "./schema";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: valibotResolver(RegisterSchema),
  });
  async function onSubmit(data: RegisterFormValues) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Registration failed");
    } catch {
      setError("root", { message: "Unable to register. Please retry." });
    }
  }
  // return JSX pada slide berikut
}
```

<!--
Endpoint register harus disediakan backend; contoh ini mengajarkan form, bukan implementasi akun.
-->

---
zoom: 0.85
class: module-content
---

### Semua Field Wajib Harus Bisa Diisi

```tsx
// Return di dalam RegisterForm pada slide sebelumnya
return (
  <form onSubmit={handleSubmit(onSubmit)} noValidate>
    <label>
      Full Name <input autoComplete="name" {...register("fullName")} />
    </label>
    <p role="alert">{errors.fullName?.message}</p>
    <label>
      Email <input type="email" autoComplete="email" {...register("email")} />
    </label>
    <p role="alert">{errors.email?.message}</p>
    <label>
      Password{" "}
      <input
        type="password"
        autoComplete="new-password"
        {...register("password")}
      />
    </label>
    <p role="alert">{errors.password?.message}</p>
    <label>
      Age <input type="number" {...register("age", { valueAsNumber: true })} />
    </label>
    <p role="alert">{errors.age?.message}</p>
    <p role="alert">{errors.root?.message}</p>
    <button disabled={isSubmitting}>
      {isSubmitting ? "Registering..." : "Register Account"}
    </button>
  </form>
);
```

`valueAsNumber` menyelaraskan input DOM dengan `v.number()`. Server harus memvalidasi ulang request.

---
zoom: 0.9
class: module-content
layout: two-cols
---

### Mutasi Data: POST, PUT, DELETE

Mengirim Perubahan Data ke Endpoint Backend

::left::

#### Tiga Aksi Utama

- **POST**: Menambah data baru (_Create_)
- **PUT**: Mengganti representasi; **PATCH**: memperbarui sebagian field
- **DELETE**: Menghapus data (_Delete_)

```tsx
// PATCH: Update sebagian field
await fetch(`/api/todos/${id}`, {
  method: "PATCH",
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

<BrutalCard v-click class="mt-2 text-xs">
  💡 Selalu periksa <code>if (!res.ok)</code> sebelum menampilkan notifikasi sukses ke user!
</BrutalCard>

---
class: module-content
---

### Siklus Mutasi yang Andal

1. Validasi input, tampilkan error pada field, dan fokuskan field yang perlu diperbaiki.
2. Tandai pending; cegah submit berulang dan tangani gangguan jaringan.
3. Backend memvalidasi ulang input dan otorisasi sebelum menulis data.
4. Setelah sukses, sinkronkan UI: invalidate query, revalidate server cache, atau refresh sesuai arsitektur.
5. Optimistic update perlu rollback ketika gagal; operasi kritis perlu idempotency di server.

**Latihan:** respons 400, 409, dan 500 harus menampilkan pesan yang berguna tanpa menghapus input pengguna.

<!--
Contoh password hanyalah batas latihan; kebijakan produksi mengikuti penyedia identitas.
Tambahkan 403 (izin ditolak), 409 (konflik), 422 (validasi sesuai kontrak), 429 (rate limit), 204 (tanpa body).
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 09

1. **React Hook Form Mencegah Re-render Berlebih**: Menggunakan pendekatan _uncontrolled_ sehingga pengetikan input form besar tetap mulus dan cepat.
2. **Valibot sebagai Skema Validasi Super Ringan**: Memberikan validasi data yang aman, deklaratif, dan auto-generate tipe TypeScript dengan ukuran bundle bergantung schema. Validasi client membantu UX; server tetap menjadi batas kepercayaan.
3. **Pahami Metode & Status Respon HTTP**: Padukan validasi frontend dengan respon status code yang tepat (201, 400, 401, 500) untuk pengalaman pengguna yang andal.

<!--
Checkpoint: Validasi Client dan Server
Isi semua field, kirim usia bukan angka, lalu kirim request langsung tanpa UI. Keduanya harus ditolak bila tidak valid; gagal jaringan tidak menghapus input.
Sumber primer: https://valibot.dev/guides/parse-data/
Audit: 25 September 2026.
-->
