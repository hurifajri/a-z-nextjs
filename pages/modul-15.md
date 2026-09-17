---
layout: intro
badge: "MODUL 15"
badgeColor: "green"
---

## 15. Unit Testing untuk Client Component

Menulis pengujian otomatis pada komponen klien untuk memastikan tombol, form, dan logika interaksi berjalan benar.

---

### Kenapa Perlu Testing?

Menangkap bug SEBELUM pengguna yang menemukannya

<v-clicks>

- 🐛 **Cegah Regresi** — Pastikan fitur lama tidak rusak saat menambah fitur baru
- 📋 **Dokumentasi Hidup** — Test menjelaskan bagaimana komponen seharusnya bekerja
- 🚀 **Deploy Percaya Diri** — Jika semua test hijau ✅, aman untuk rilis
- 🔄 **Refactor Tanpa Takut** — Ubah internal kode selama test tetap lulus

</v-clicks>

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  💡 Kita akan menggunakan <strong>Vitest</strong> (test runner) + <strong>React Testing Library</strong> (render komponen).
</div>

---

### Setup Testing

Instalasi dan konfigurasi tools testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react jsdom
```

```tsx {2-3|5-10|all}
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
})
```

```tsx
// vitest.setup.ts
import "@testing-library/jest-dom"
```

---

### Anatomy of a Test

Memahami struktur test: Arrange → Act → Assert

```tsx {1-4|6-7|9-10|12-13|all}
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Greeting from "./Greeting"

describe("Greeting", () => {
  it("menampilkan pesan sapaan dengan nama", () => {
    // ARRANGE: Render komponen dengan props
    render(<Greeting nama="Fulan" />)

    // ACT: (Dalam kasus ini, tidak ada aksi user)

    // ASSERT: Pastikan teks muncul di layar
    expect(screen.getByText("Halo, Fulan!")).toBeInTheDocument()
  })
})
```

<div v-click class="mt-3 grid grid-cols-3 gap-2 text-xs">
  <div class="brutal-card bg-white p-2 text-center">
    <strong>Arrange</strong><br/>Siapkan komponen
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <strong>Act</strong><br/>Lakukan aksi user
  </div>
  <div class="brutal-card bg-white p-2 text-center">
    <strong>Assert</strong><br/>Cek hasilnya
  </div>
</div>

---

### Testing Interaksi User

Simulasikan klik, ketik, dan submit form

```tsx {1-2|5-6|8-10|12-14|all}
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Counter from "./Counter"

describe("Counter", () => {
  it("menambah angka saat tombol diklik", async () => {
    const user = userEvent.setup()
    render(<Counter />)

    // Pastikan awal = 0
    expect(screen.getByText("Diklik: 0 kali")).toBeInTheDocument()

    // Klik tombol
    await user.click(screen.getByRole("button"))

    // Pastikan angka bertambah
    expect(screen.getByText("Diklik: 1 kali")).toBeInTheDocument()
  })
})
```

---

### Testing Form Input

Menguji form dengan validasi dan submit

```tsx {4-5|7-10|12-13|15-17|all}
describe("LoginForm", () => {
  it("menampilkan error jika email kosong", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    // Langsung klik submit tanpa isi form
    const submitBtn = screen.getByRole("button", { name: /login/i })
    await user.click(submitBtn)

    // Pastikan pesan error muncul
    expect(screen.getByText("Email wajib diisi")).toBeInTheDocument()
  })

  it("mengirim data saat form valid", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    // Isi form
    await user.type(screen.getByLabelText("Email"), "fulan@mail.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /login/i }))

    // Pastikan tidak ada error
    expect(screen.queryByText("Email wajib diisi")).not.toBeInTheDocument()
  })
})
```

---

### Query Cheat Sheet

Cara menemukan elemen di layar

| Query | Kapan Dipakai |
|:------|:-------------|
| `getByText("Halo")` | Teks yang terlihat di layar |
| `getByRole("button")` | Elemen berdasarkan role HTML |
| `getByLabelText("Email")` | Input berdasarkan label |
| `getByPlaceholderText("Cari...")` | Input berdasarkan placeholder |
| `getByTestId("submit-btn")` | Fallback: elemen dengan `data-testid` |
| `queryByText("Error")` | Cek apakah elemen **TIDAK** ada |

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  🎯 <strong>Prioritas:</strong> Gunakan <code>getByRole</code> → <code>getByLabelText</code> → <code>getByText</code> → <code>getByTestId</code> (terakhir).
</div>

---

### Menjalankan Test

Perintah untuk menjalankan dan memantau test

```bash
# Jalankan semua test sekali
npx vitest run

# Mode watch: otomatis re-run saat file berubah
npx vitest

# Jalankan file test tertentu
npx vitest Counter.test.tsx

# Dengan coverage report
npx vitest run --coverage
```

<div v-click class="mt-4 text-center">

```text
 ✓ components/Counter.test.tsx (2 tests) 3ms
 ✓ components/LoginForm.test.tsx (3 tests) 8ms
 ✓ components/TodoItem.test.tsx (4 tests) 5ms

 Test Files  3 passed (3)
      Tests  9 passed (9)
   Duration  156ms
```

</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 15

1. **AAA Pattern**: Setiap test mengikuti pola **Arrange** (render komponen), **Act** (simulasi aksi user), **Assert** (cek hasilnya).
2. **Testing Library = User-Centric**: Query elemen seperti user melihat layar (`getByText`, `getByRole`) — bukan berdasarkan implementasi internal.
3. **Jalankan Sering**: Gunakan mode `vitest --watch` agar test otomatis berjalan setiap kali Antum menyimpan file. Green tests = percaya diri deploy!
