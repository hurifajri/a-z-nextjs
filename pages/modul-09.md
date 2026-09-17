---
layout: intro
badge: "MODUL 09"
badgeColor: "yellow"
---

## 09. Form, Validasi, dan Konsumsi API (POST/PUT/DELETE)

Membangun form interaktif dengan validasi, mengirim data ke server, serta menangani respon HTTP secara tepat.

---
layout: two-cols
---

### Controlled vs Uncontrolled Input

Dua pendekatan mengelola form di React

::left::

#### Controlled (Rekomendasi ✅)

React yang mengontrol nilai input:

```tsx {2|4-5|all}
"use client"
export default function Form() {
  const [nama, setNama] = useState("")

  return (
    <input
      value={nama}
      onChange={e => setNama(e.target.value)}
    />
  )
}
```

- ✅ Validasi real-time
- ✅ State dan UI selalu sinkron
- ✅ Mudah di-debug

::right::

#### Uncontrolled

Browser yang mengontrol nilai input:

```tsx
"use client"
export default function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    const value = inputRef.current?.value
    console.log(value)
  }

  return (
    <input ref={inputRef} />
  )
}
```

- ✅ Performa lebih baik (less re-render)
- ❌ Sulit validasi real-time
- ❌ State tidak terkontrol React

---

### Membangun Form dengan Validasi

Validasi input sebelum data dikirim ke server

```tsx {2-3|5-13|15-16|all}
"use client"
export default function RegisterForm() {
  const [form, setForm] = useState({ nama: "", email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.nama.trim()) errs.nama = "Nama wajib diisi"
    if (!form.email.includes("@")) errs.email = "Email tidak valid"
    if (form.password.length < 8) errs.password = "Minimal 8 karakter"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()    // Cegah reload halaman!
    if (!validate()) return
    // ... kirim ke API
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
      {errors.nama && <span className="text-red-500 text-sm">{errors.nama}</span>}
      {/* ... field lainnya */}
    </form>
  )
}
```

---

### HTTP Methods: POST, PUT, DELETE

Tiga cara utama mengirim data ke server

<v-clicks>

- **POST** — Membuat data baru (create)
- **PUT** — Memperbarui data yang sudah ada (update)
- **DELETE** — Menghapus data (delete)

</v-clicks>

````md magic-move
```tsx
// POST: Membuat data baru
const res = await fetch("/api/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Belajar Next.js", done: false }),
})
```
```tsx
// PUT: Memperbarui data
const res = await fetch("/api/todos/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Belajar Next.js", done: true }),
})
```
```tsx
// DELETE: Menghapus data
const res = await fetch("/api/todos/1", {
  method: "DELETE",
})
```
````

---

### HTTP Status Codes

Respon dari server yang harus Antum pahami

| Kode | Arti | Aksi di Frontend |
|:-----|:-----|:-----------------|
| **200** | Berhasil (OK) | Tampilkan data / pesan sukses |
| **201** | Berhasil dibuat (Created) | Redirect atau refresh list |
| **400** | Request tidak valid | Tampilkan pesan validasi |
| **401** | Belum login (Unauthorized) | Redirect ke halaman login |
| **404** | Data tidak ditemukan | Tampilkan "tidak ditemukan" |
| **500** | Error di server | Tampilkan pesan error umum |

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  💡 Selalu cek <code>res.ok</code> atau <code>res.status</code> sebelum memproses data! Jangan langsung <code>res.json()</code> tanpa pengecekan.
</div>

---

### Pola Submit Form Lengkap

Loading saat submit + notifikasi sukses/gagal

```tsx {3-4|6-17|19-20|all}
"use client"
export default function CreateTodoForm() {
  const [title, setTitle] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })

    if (res.ok) {
      setTitle("")           // Reset form
      alert("Todo berhasil ditambahkan!")
    } else {
      alert("Gagal menambahkan todo")
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button disabled={submitting}>
        {submitting ? "Menyimpan..." : "Tambah Todo"}
      </button>
    </form>
  )
}
```

---

### Update dan Delete

Memperbarui dan menghapus data dari daftar

```tsx {2-10|12-17|all}
// Fungsi update: toggle status selesai
async function toggleTodo(id: number, done: boolean) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !done }),
  })
  if (res.ok) refreshData()
}

// Fungsi delete: hapus todo
async function deleteTodo(id: number) {
  const confirmed = confirm("Yakin ingin menghapus?")
  if (!confirmed) return

  const res = await fetch(`/api/todos/${id}`, { method: "DELETE" })
  if (res.ok) refreshData()
}

// Di JSX:
<button onClick={() => toggleTodo(todo.id, todo.done)}>
  {todo.done ? "✅" : "⬜"}
</button>
<button onClick={() => deleteTodo(todo.id)}>🗑️</button>
```

---

### Error Handling yang Robust

Menangani berbagai skenario gagal secara elegan

```tsx {1-15|17-20|all}
async function submitData(data: unknown) {
  try {
    const res = await fetch("/api/resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.status === 400) {
      const err = await res.json()
      return { success: false, message: err.message }  // Validasi gagal
    }
    if (res.status === 401) {
      router.push("/login")  // Redirect ke login
      return { success: false, message: "Sesi habis" }
    }
    if (!res.ok) {
      return { success: false, message: "Terjadi kesalahan server" }
    }

    const result = await res.json()
    return { success: true, data: result }
  } catch {
    return { success: false, message: "Tidak dapat terhubung ke server" }
  }
}
```

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 09

1. **Controlled Input = Sinkron**: Gunakan `useState` + `onChange` agar state React dan tampilan form selalu sinkron. Tambahkan `e.preventDefault()` saat submit!
2. **Validasi Sebelum Kirim**: Cek semua field sebelum `fetch()`. Tampilkan pesan error per-field agar pengguna tahu apa yang salah.
3. **Tangani Setiap Status HTTP**: Jangan hanya tangani sukses — siapkan handler untuk 400 (validasi), 401 (auth), 404, dan 500.
