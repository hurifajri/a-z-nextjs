---
layout: intro
badge: "MODUL 13"
badgeColor: "pink"
level: 1
---

## 13. Integrasi API Backend & Dokumentasi (Swagger/JWT)

Menghubungkan frontend ke API tim backend, membaca dokumentasi Swagger/OpenAPI, serta menerapkan autentikasi JWT.

---
class: module-content
---

### Membaca Dokumentasi API (Swagger)

OpenAPI adalah spesifikasi kontrak; Swagger UI adalah salah satu alat untuk membacanya

<v-clicks>

- 📋 **Endpoint URL** — Alamat API yang bisa diakses (`GET /api/users`)
- 📦 **Request Body** — Data yang dikirim (format JSON, field apa saja)
- 📤 **Response** — Data yang dikembalikan (status code + format JSON)
- 🔐 **Authentication** — Apakah butuh token? Di header mana?
- 🏷️ **Parameters** — Query params, path params, header params

</v-clicks>

<BrutalCard v-click class="mt-4 ">
  💡 Swagger UI biasanya bisa diakses di <code>https://api.example.com/docs</code> atau <code>/swagger</code>. Minta URL-nya ke tim backend!
</BrutalCard>

---
class: module-content
---

### Anatomi Swagger UI

Memahami setiap bagian di halaman dokumentasi

<div class="grid grid-cols-2 gap-4 mt-4">
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="green">GET</BrutalBadge>
    <p class="font-bold">/api/products</p>
    <p class="text-xs text-gray-600">Ambil daftar produk. Bisa filter dengan query: <code>?category=elektronik</code></p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="yellow">POST</BrutalBadge>
    <p class="font-bold">/api/products</p>
    <p class="text-xs text-gray-600">Buat produk baru. Body: <code>{ name, price, category }</code></p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="cyan">PATCH</BrutalBadge>
    <p class="font-bold">/api/products/{id}</p>
    <p class="text-xs text-gray-600">Update produk. Body: <code>{ name?, price? }</code></p>
  </BrutalCard>
  <BrutalCard class="flex flex-col gap-2 items-start" v-click>
    <BrutalBadge color="pink">DELETE</BrutalBadge>
    <div class="font-bold">/api/products/{id}</div>
    <p class="text-xs text-gray-600">Hapus produk berdasarkan ID.</p>
  </BrutalCard>
</div>

---
class: module-content
---

### Membuat API Service Layer

Browser memanggil endpoint same-origin; cookie sesi dikelola server

```ts
// src/lib/api.ts — helper browser, endpoint internal yang ditentukan aplikasi
export async function apiClient(
  path: `/api/${string}`,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);
  if (typeof options.body === "string")
    headers.set("Content-Type", "application/json");
  const res = await fetch(path, {
    ...options,
    headers,
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return undefined;
  return res.json(); // Validasi schema respons sebelum dipakai UI
}
```

- Caller mengubah 401 menjadi UI login, 403 menjadi pesan izin ditolak.
- BFF (Backend for Frontend) memverifikasi sesi dan meneruskan token ke backend.
- Jangan teruskan header/cookie browser secara bebas ke URL upstream.
- Untuk cookie-authenticated mutation, server perlu perlindungan CSRF (Modul 14).

<!--
Sumber: https://nextjs.org/docs/app/guides/backend-for-frontend
-->

---
class: module-content
---

### Apa Itu JWT (JSON Web Token)?

Format token; autentikasi memerlukan verifikasi signature dan claims, bukan sekadar decode

<div class="mt-4">

```text
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

</div>

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <BrutalCard class="bg-red-100 text-center" v-click>
    <strong>Header</strong><br/>
    Algoritma + Tipe Token
  </BrutalCard>
  <BrutalCard class="bg-purple-100 text-center" v-click>
    <strong>Payload</strong><br/>
    Data user (id, role, exp)
  </BrutalCard>
  <BrutalCard class="bg-blue-100 text-center" v-click>
    <strong>Signature</strong><br/>
    Tanda tangan digital
  </BrutalCard>
</div>

<BrutalCard v-click class="mt-4">
  JWT bertanda tangan umumnya tidak terenkripsi: payload bisa dibaca. Verifikasi signature, algoritma yang diizinkan, issuer, audience, dan expiry; jangan taruh secret di payload.
</BrutalCard>

---
class: module-content
---

### Alur Login: Browser → BFF → Backend

```text
Browser mengirim kredensial lewat HTTPS
    ↓
BFF / layanan auth memverifikasi kredensial
    ↓
Server menyimpan sesi / token upstream secara aman
    ↓
Browser menerima cookie sesi HttpOnly, Secure, SameSite
    ↓
Browser memanggil endpoint same-origin dengan cookie
    ↓
BFF memverifikasi sesi dan izin → akses backend → kirim data minimum
```

JWT bukan keharusan: opaque session juga valid. Hindari menyimpan session identifier di localStorage karena bisa dibaca JavaScript saat XSS.

<!--
Sumber: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
-->

---
zoom: 0.85
class: module-content
---

### Implementasi Login di Browser

Fragment handler pada form client dengan state `pending`, `error`, dan router

```tsx
async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (pending) return;
  const fields = new FormData(e.currentTarget);
  setPending(true);
  setError("");
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fields.get("email"),
        password: fields.get("password"),
      }),
    });
    if (!res.ok) throw new Error("Login failed");
    // Server menyetel cookie HttpOnly; tidak ada token yang disimpan di JS
    router.replace("/dashboard");
    router.refresh();
  } catch {
    setError("Unable to sign in. Please retry.");
  } finally {
    setPending(false);
  }
}
```

Form menyediakan label, `name="email"`, `name="password"`, autocomplete, pesan `role="alert"`, dan tombol disabled saat pending. Backend login disediakan library/layanan auth.

---
class: module-content
---

### Memanggil Backend dari Server

Kontrak adapter auth: `getVerifiedSession()` mengembalikan sesi valid atau null

```ts
// src/lib/backend.ts — fragment integrasi; implementasikan adapter auth proyek
import "server-only";
import { getVerifiedSession } from "@/lib/auth";

export async function getProfile() {
  const session = await getVerifiedSession();
  if (!session) throw new Error("Unauthenticated");
  if (!session.accessToken) throw new Error("Upstream token unavailable");
  const res = await fetch(`${process.env.API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
  return res.json(); // Parse schema & pilih field publik di boundary BFF
}
```

Token upstream disimpan di server. Pisahkan 401, 403, timeout, dan kegagalan backend; jangan log token atau password.

<!--
Adapter getVerifiedSession bukan API bawaan Next.js; lihat kontrak Modul 14.
-->

---
class: module-content
---

### Tips Kolaborasi dengan Tim Backend

Komunikasi efektif antara frontend dan backend

<v-clicks>

- 📋 **Minta Swagger/OpenAPI** — Jangan coding berdasarkan asumsi, minta dokumentasi resmi.
- 🧪 **Test di Postman dulu** — Pastikan endpoint berfungsi sebelum integrasi ke frontend.
- 🔑 **Sepakati format response** — Status code, format error, pagination format.
- 🕐 **Tanya deadline API** — Jika API belum siap, gunakan mock data sementara.
- 💬 **Komunikasikan error** — Bagikan request ID, status, dan reproduksi; redaksi token, cookie, password, serta data pribadi.

</v-clicks>

---
class: module-content
---

### Checkpoint Integrasi Backend

- Sepakati pagination, format error, nullability, expiry sesi, dan versi kontrak.
- Generated TypeScript dari OpenAPI membantu coding, tetapi bukan validasi runtime.
- CORS adalah kebijakan browser; bukan autentikasi atau pelindung API.
- Bila akses cross-origin dengan cookie diperlukan, gunakan origin eksplisit dan konfigurasi credentials yang sesuai.
- Buat mock dari kontrak untuk kasus sukses, 401, 403, 429, dan respons rusak.

**Latihan:** simulasikan sesi kedaluwarsa dan 204; aplikasi tidak boleh menampilkan sukses palsu atau gagal parse JSON kosong.

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 13

1. **Swagger = Kontrak API**: Baca dokumentasi Swagger untuk tahu endpoint, request body, response format, dan authentication yang diperlukan.
2. **Sesi Diverifikasi di Server**: Browser memakai cookie HttpOnly; BFF dapat menyimpan JWT upstream. Decode token bukan verifikasi.
3. **API Service Layer**: Buat satu file pusat (`lib/api.ts`) untuk semua panggilan API agar kode rapi, token otomatis terpasang, dan error handling terpusat.
