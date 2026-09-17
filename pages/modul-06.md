---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
---

## 06. State Management Lanjutan

Mengelola global state dengan useContext dan useReducer — solusi untuk prop drilling tanpa library eksternal.

---

### Masalah Klasik: Prop Drilling

Mengirim props melewati banyak level komponen yang sebenarnya tidak butuh

<div class="flex justify-center mt-4">
  <div class="brutal-card bg-white p-3 text-center text-sm w-80">
    <strong>App</strong> (Punya <code>user</code>)
    <div class="text-lg my-1">⬇️ props</div>
    <div class="brutal-card bg-gray-100 p-2" v-click>
      <strong>Header</strong> (Cuma numpang lewat 😩)
      <div class="text-lg my-1">⬇️ props</div>
      <div class="brutal-card bg-gray-200 p-2" v-click>
        <strong>Navigation</strong> (Masih numpang 😰)
        <div class="text-lg my-1">⬇️ props</div>
        <div class="brutal-card bg-yellow-100 p-2 border-2 border-black" v-click>
          <strong>UserProfile</strong> (Akhirnya dipakai! 🎉)
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click class="mt-3 brutal-card bg-white p-2 text-sm text-center">
  😵 Bayangkan jika ada 10 level! Kode jadi berantakan dan sulit di-maintain.
</div>

---

### Solusi: React Context API

Jalan pintas untuk berbagi data ke seluruh component tree tanpa prop drilling

<v-clicks>

- **`createContext`** — Membuat "gudang" data global
- **`Provider`** — Komponen pembungkus yang membagikan data ke semua anak
- **`useContext`** — Hook untuk mengambil data dari gudang, di komponen manapun!

</v-clicks>

<div v-click class="mt-6 brutal-card bg-white p-3 text-sm">
  💡 Cocok untuk data yang dibutuhkan banyak komponen: <strong>tema (dark/light)</strong>, <strong>status login user</strong>, <strong>bahasa/locale</strong>.
</div>

---

### Membuat Context Provider

Langkah demi langkah membuat context yang rapi

```tsx {1,3|5-12|14-15|all}
import { createContext, useContext, useState } from "react"

const ThemeContext = createContext<"light" | "dark">("light")

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const toggle = () => setTheme(t => t === "light" ? "dark" : "light")

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook — agar konsumer tidak perlu import createContext
export const useTheme = () => useContext(ThemeContext)
```

---

### Dari Prop Drilling ke Context

Lihat bagaimana kode menjadi jauh lebih bersih!

````md magic-move
```tsx
// ❌ SEBELUM: Prop Drilling — props menembus 4 level
function App() {
  const [user] = useState({ name: "Fulan" })
  return <Header user={user} />
}
function Header({ user }) {
  return <Nav user={user} />
}
function Nav({ user }) {
  return <Profile user={user} />
}
function Profile({ user }) {
  return <div>Halo, {user.name}</div>
}
```
```tsx
// ✅ SESUDAH: Context — ambil langsung di mana perlu!
function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  )
}
function Header() {
  return <Nav />    // Tidak perlu props!
}
function Nav() {
  return <Profile /> // Tidak perlu props!
}
function Profile() {
  const { user } = useAuth()  // Langsung ambil!
  return <div>Halo, {user.name}</div>
}
```
````

---
layout: two-cols
---

### useState vs useReducer

Kapan harus pakai yang mana?

::left::

#### useState

<div class="text-sm space-y-2">

- ✅ State sederhana (boolean, string, number)
- ✅ Logika update mudah dan langsung
- ✅ State independen satu sama lain
- ❌ Sulit jika banyak aksi terkait

</div>

```tsx
const [count, setCount] = useState(0)
setCount(count + 1)
setCount(0)
```

::right::

#### useReducer

<div class="text-sm space-y-2">

- ✅ State kompleks (object bertingkat)
- ✅ Banyak tipe aksi (add, remove, toggle)
- ✅ Logika terpusat di satu fungsi
- ❌ Overkill untuk state sederhana

</div>

```tsx
const [state, dispatch] = useReducer(
  reducer, initialState
)
dispatch({ type: "INCREMENT" })
dispatch({ type: "RESET" })
```

---

### Berkenalan dengan useReducer

Mengelola state kompleks dengan aksi (action) yang terstruktur

```tsx {1-3|5-12|14-17|all}
// 1. Definisikan tipe
type State = { count: number }
type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" }

// 2. Buat fungsi reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": return { count: state.count + 1 }
    case "decrement": return { count: state.count - 1 }
    case "reset":     return { count: 0 }
  }
}

// 3. Gunakan di komponen
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  )
}
```

---

### Combo: Context + useReducer

Menggabungkan keduanya untuk global state management ala Redux!

```tsx {2,5|7-9|11-12|all}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// Di komponen manapun dalam tree:
const { state, dispatch } = useCart()
dispatch({ type: "ADD_ITEM", payload: { id: 1, nama: "Buku React" } })
dispatch({ type: "REMOVE_ITEM", payload: { id: 1 } })
```

<div v-click class="mt-4 brutal-card bg-white p-3 text-sm">
  🔥 Ini adalah pola dasar yang digunakan oleh library seperti Redux dan Zustand! Antum bisa membuat versi <em>lite</em>-nya sendiri.
</div>

---

### Contoh Praktis: Auth Context

Menyimpan dan mengelola status login pengguna secara global

```tsx
// Di halaman manapun — cek status login tanpa prop drilling!
function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <p>Silakan login terlebih dahulu.</p>
  }

  return (
    <div className="brutal-card bg-white p-4">
      <h4>Ahlan wa Sahlan, {user.name}!</h4>
      <p className="text-sm text-gray-600">{user.email}</p>
      <button className="brutal-btn mt-4" onClick={logout}>
        Keluar
      </button>
    </div>
  )
}
```

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting dari Modul 06

1. **Context API = Anti Prop Drilling**: Gunakan `createContext` + `Provider` + `useContext` untuk berbagi data ke seluruh komponen tanpa melewatkan props berlevel-level.
2. **useReducer untuk State Kompleks**: Jika state punya banyak aksi (add, remove, toggle, reset), pindahkan logika ke reducer agar terpusat dan mudah di-debug.
3. **Context + Reducer = Global State**: Kombinasi keduanya memberi Antum kemampuan global state management tanpa perlu install library tambahan!
