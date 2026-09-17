---
layout: intro
badge: "MODUL 13"
badgeColor: "pink"
---

## 13. Integrasi API Backend & Dokumentasi (Swagger/JWT)

Menghubungkan frontend ke API tim backend, membaca dokumentasi Swagger/OpenAPI, serta menerapkan autentikasi JWT.

---

### Membaca Dokumentasi API (Swagger)

Swagger/OpenAPI adalah kontrak antara frontend dan backend

<v-clicks>

- 📋 **Endpoint URL** — Alamat API yang bisa diakses (`GET /api/users`)
- 📦 **Request Body** — Data yang dikirim (format JSON, field apa saja)
- 📤 **Response** — Data yang dikembalikan (status code + format JSON)
- 🔐 **Authentication** — Apakah butuh token? Di header mana?
- 🏷️ **Parameters** — Query params, path params, header params

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  💡 Swagger UI biasanya bisa diakses di <code>https://api.example.com/docs</code> atau <code>/swagger</code>. Minta URL-nya ke tim backend!
</div>

---

### Anatomi Swagger UI

Memahami setiap bagian di halaman dokumentasi

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <span class="brutal-badge brutal-badge-green mb-2">GET</span>
    <div class="font-bold">/api/products</div>
    <p class="text-xs text-gray-600 mt-1">Ambil daftar produk. Bisa filter dengan query: <code>?category=elektronik</code></p>
  </div>
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <span class="brutal-badge brutal-badge-yellow mb-2">POST</span>
    <div class="font-bold">/api/products</div>
    <p class="text-xs text-gray-600 mt-1">Buat produk baru. Body: <code>{ name, price, category }</code></p>
  </div>
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <span class="brutal-badge brutal-badge-cyan mb-2">PUT</span>
    <div class="font-bold">/api/products/{id}</div>
    <p class="text-xs text-gray-600 mt-1">Update produk. Body: <code>{ name?, price? }</code></p>
  </div>
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <span class="brutal-badge brutal-badge-pink mb-2">DELETE</span>
    <div class="font-bold">/api/products/{id}</div>
    <p class="text-xs text-gray-600 mt-1">Hapus produk berdasarkan ID.</p>
  </div>
</div>

---

### Membuat API Service Layer

Pisahkan logika fetch API ke file tersendiri agar rapi

```tsx {1-6|8-16|18-24|all}
// lib/api.ts — Satu tempat untuk semua panggilan API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

async function apiClient(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    // Token expired — redirect ke login
    window.location.href = "/login"
    throw new Error("Sesi habis")
  }

  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export const api = {
  getProducts: () => apiClient("/api/products"),
  createProduct: (data) => apiClient("/api/products", { method: "POST", body: JSON.stringify(data) }),
}
```

---

### Apa Itu JWT (JSON Web Token)?

Token untuk membuktikan identitas pengguna tanpa kirim password berulang

<div class="mt-4">

```text
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

</div>

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <div class="brutal-card bg-red-100 p-2 text-center" v-click>
    <strong>Header</strong><br/>
    Algoritma + Tipe Token
  </div>
  <div class="brutal-card bg-purple-100 p-2 text-center" v-click>
    <strong>Payload</strong><br/>
    Data user (id, role, exp)
  </div>
  <div class="brutal-card bg-blue-100 p-2 text-center" v-click>
    <strong>Signature</strong><br/>
    Tanda tangan digital
  </div>
</div>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🔐 Token dikirim di setiap request via header: <code>Authorization: Bearer eyJhbG...</code>
</div>

---

### Alur Login dengan JWT

Dari form login hingga akses halaman terlindungi

```text
1. User isi form login (email + password)
         ↓
2. Frontend kirim POST /api/auth/login
         ↓
3. Backend cek kredensial → kirim JWT token
         ↓
4. Frontend simpan token di localStorage
         ↓
5. Setiap request, sertakan token di header Authorization
         ↓
6. Backend verifikasi token → kirim data
```

---

### Implementasi Login

Form login dan penyimpanan token

```tsx {4-13|15-17|all}
"use client"
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem("token", token)  // Simpan token
      router.push("/dashboard")
    } else {
      alert("Email atau password salah!")
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={form.email}
        onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" value={form.password}
        onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

### Menggunakan Token di Setiap Request

Sertakan token di header Authorization

```tsx {3-4|6-12|14-15|all}
// Contoh: Fetch data yang butuh autentikasi
async function fetchProtectedData() {
  const token = localStorage.getItem("token")

  const res = await fetch("https://api.example.com/api/profile", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  // ← Token di sini!
    },
  })

  if (res.status === 401) {
    // Token expired atau tidak valid
    localStorage.removeItem("token")
    window.location.href = "/login"
    return
  }

  return res.json()
}
```

---

### Tips Kolaborasi dengan Tim Backend

Komunikasi efektif antara frontend dan backend

<v-clicks>

- 📋 **Minta Swagger/OpenAPI** — Jangan coding berdasarkan asumsi, minta dokumentasi resmi.
- 🧪 **Test di Postman dulu** — Pastikan endpoint berfungsi sebelum integrasi ke frontend.
- 🔑 **Sepakati format response** — Status code, format error, pagination format.
- 🕐 **Tanya deadline API** — Jika API belum siap, gunakan mock data sementara.
- 💬 **Komunikasikan error** — Screenshot error response + request yang dikirim.

</v-clicks>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 13

1. **Swagger = Kontrak API**: Baca dokumentasi Swagger untuk tahu endpoint, request body, response format, dan authentication yang diperlukan.
2. **JWT = Tiket Masuk**: Login → dapat token → simpan di localStorage → sertakan di header setiap request → backend verifikasi.
3. **API Service Layer**: Buat satu file pusat (`lib/api.ts`) untuk semua panggilan API agar kode rapi, token otomatis terpasang, dan error handling terpusat.
