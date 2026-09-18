---
layout: intro
badge: "MODUL 11"
badgeColor: "purple"
level: 1
---

## 11. Mini Project: Todo App (Fullstack)

Praktek langsung membangun aplikasi Todo fullstack — menggabungkan semua konsep dari modul 1 hingga 10.

---

### Apa yang Akan Kita Bangun?

Aplikasi Todo fullstack dengan fitur lengkap

<div class="grid grid-cols-3 gap-3 mt-6">
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <div class="font-black text-lg mb-1">📝 CRUD Todo</div>
    <p class="text-xs text-gray-600">Tambah, tandai selesai, dan hapus catatan tugas.</p>
  </div>
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <div class="font-black text-lg mb-1">🗄️ Database</div>
    <p class="text-xs text-gray-600">Data tersimpan di SQLite via Drizzle ORM + Route Handlers.</p>
  </div>
  <div class="brutal-card bg-white p-3 text-sm" v-click>
    <div class="font-black text-lg mb-1">🎨 Multi Halaman</div>
    <p class="text-xs text-gray-600">Navigasi antar halaman dengan layout bersama dan styling Tailwind.</p>
  </div>
</div>

<div v-click class="mt-6 brutal-card bg-yellow-100 p-3 text-sm text-center border-2 border-black">
  🎯 Ini adalah <strong>checkpoint</strong> — kita akan menggunakan konsep dari <strong>Modul 01 sampai 10</strong> dalam satu project nyata!
</div>

---

### Struktur Project

Anatomi project Todo App kita

```text {1-4|5-8|9-12|all}
src/
├── app/
│   ├── layout.tsx          ← Global layout + Navbar
│   ├── page.tsx            ← Home page
│   ├── todos/
│   │   ├── page.tsx        ← Todo list page (Server Component)
│   │   └── loading.tsx     ← Skeleton loading
│   ├── about/
│   │   └── page.tsx        ← About page
│   └── api/
│       └── todos/
│           ├── route.ts    ← GET + POST (all todos)
│           └── [id]/
│               └── route.ts ← PUT + DELETE (per todo)
├── db/
│   ├── schema.ts           ← Drizzle table schema
│   └── index.ts            ← Database connection
└── components/
    ├── Navbar.tsx           ← Navigation (Client Component)
    ├── TodoForm.tsx         ← Add todo form (Client)
    └── TodoItem.tsx         ← Todo item with actions (Client)
```

---
layout: two-cols
---

### Backend: API Route

Route Handler untuk CRUD Todo

::left::

#### GET + POST (`route.ts`)

```tsx {3-6|8-16|all}
// app/api/todos/route.ts
import { db } from "@/db";
import { todos } from "@/db/schema";

export async function GET() {
  const all = await db.select().from(todos);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const [todo] = await db.insert(todos).values({ title }).returning();
  return NextResponse.json(todo, { status: 201 });
}
```

::right::

#### PUT + DELETE (`[id]/route.ts`)

```tsx {3-10|12-17|all}
// app/api/todos/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  await db
    .update(todos)
    .set(body)
    .where(eq(todos.id, Number(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(todos).where(eq(todos.id, Number(id)));
  return NextResponse.json({ ok: true });
}
```

---

### Frontend: Layout dan Navbar

Kerangka halaman yang konsisten di semua halaman

```tsx
// app/layout.tsx
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
```

```tsx
// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="flex gap-4 p-4 border-b-2 border-black bg-white">
      <Link href="/" className={path === "/" ? "font-bold" : ""}>
        Home
      </Link>
      <Link href="/todos" className={path === "/todos" ? "font-bold" : ""}>
        Todos
      </Link>
      <Link href="/about" className={path === "/about" ? "font-bold" : ""}>
        About
      </Link>
    </nav>
  );
}
```

---

### Frontend: Halaman Todos

Server Component yang fetch data dan render daftar

```tsx {1-5|7-14|all}
// app/todos/page.tsx (Server Component)
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";

export default async function TodosPage() {
  const res = await fetch("http://localhost:3000/api/todos", {
    cache: "no-store",
  });
  const todos = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📝 Todo List</h1>
      <TodoForm />
      <div className="mt-4 space-y-2">
        {todos.length === 0 && <p className="text-gray-500">No todos yet.</p>}
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
```

---

### Frontend: Komponen Interaktif

Client Components untuk form dan aksi

````md magic-move
```tsx
// components/TodoForm.tsx — Add todo form
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    router.refresh(); // Refresh Server Component!
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write a new todo..."
        className="flex-1 border-2 p-2 rounded"
      />
      <button className="bg-black text-white px-4 py-2 rounded font-bold">
        Add
      </button>
    </form>
  );
}
```

```tsx
// components/TodoItem.tsx — Todo item with toggle and delete
"use client";
import { useRouter } from "next/navigation";

export default function TodoItem({
  todo,
}: {
  todo: { id: number; title: string; done: boolean };
}) {
  const router = useRouter();

  async function toggleDone() {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    router.refresh();
  }

  async function deleteTodo() {
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 p-3 border-2 rounded">
      <button onClick={toggleDone}>{todo.done ? "✅" : "⬜"}</button>
      <span
        className={todo.done ? "line-through text-gray-400 flex-1" : "flex-1"}
      >
        {todo.title}
      </span>
      <button onClick={deleteTodo} className="text-red-500">
        🗑️
      </button>
    </div>
  );
}
```
````

---

### Konsep yang Digunakan

Checklist materi dari Modul 01–10 yang diterapkan di project ini

<v-clicks>

- ✅ **Modul 01–02**: Struktur folder App Router, setup project, Tailwind CSS
- ✅ **Modul 03**: Routing (`/`, `/todos`, `/about`), Link, usePathname
- ✅ **Modul 04**: Server Components (page.tsx) vs Client Components (form, item)
- ✅ **Modul 05**: useState untuk form input
- ✅ **Modul 06**: (Opsional) Context untuk global state
- ✅ **Modul 07**: Data fetching di Server Component, loading.tsx
- ✅ **Modul 08**: Menampilkan data, empty state
- ✅ **Modul 09**: Form + validasi + POST/PUT/DELETE
- ✅ **Modul 10**: Route Handlers + Drizzle ORM (fullstack!)

</v-clicks>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## Selamat! Antum Baru Saja Membangun Aplikasi Fullstack! 🎉

1. **Backend**: Route Handlers + Drizzle ORM untuk CRUD API dengan database.
2. **Frontend**: Server Components untuk data, Client Components untuk interaksi.
3. **Navigasi**: Multi-halaman dengan layout bersama, active link styling.
