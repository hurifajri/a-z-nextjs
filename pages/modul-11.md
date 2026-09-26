---
layout: intro
badge: "MODUL 11"
badgeColor: "purple"
level: 1
---

## 11. Mini Project: Todo App (Fullstack)

Membangun CRUD lokal yang persisten, tervalidasi, dan dapat diuji. Menggabungkan Modul 01–10.

---
class: module-content
---

### Target dan Batas Latihan

- Tambah judul, tandai selesai, hapus, dan baca ulang setelah reload.
- SQLite lokal + Drizzle; Node.js runtime, **Cache Components nonaktif**.
- Server Component membaca database langsung; browser memutasi lewat Route Handler.
- Validasi input, pending/error state, dan respons 400/404 harus berfungsi.
- **Demo single-user lokal.** Tambahkan sesi dan ownership dari Modul 14 sebelum dipublikasikan.

<BrutalCard class="mt-4 text-sm">
  Modul ini berisi bagian inti per file. Root layout, Navbar, dan loading.tsx memakai pola Modul 02–07.
</BrutalCard>

---
class: module-content
---

### Struktur Project

```text
src/
├── app/
│   ├── layout.tsx              # Root layout + Navbar
│   ├── todos/page.tsx          # Server Component
│   ├── todos/loading.tsx
│   └── api/todos/
│       ├── route.ts            # GET + POST
│       └── [id]/route.ts       # PATCH + DELETE
├── db/
│   ├── index.ts               # Server-only connection
│   └── schema.ts
├── lib/todo-schema.ts         # Validasi + tipe API bersama
└── components/
    ├── TodoForm.tsx
    └── TodoItem.tsx

drizzle.config.ts              # Di root project
```

---
class: module-content
---

### Setup Database Lokal

```bash
npm install drizzle-orm better-sqlite3 valibot server-only
npm install -D drizzle-kit @types/better-sqlite3
```

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: "./local.db" },
});
```

Setelah menulis schema pada slide berikut:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Commit file migration. Abaikan `local.db` dan sidecar SQLite di Git. Jalankan CLI dari root project.

<!--
Sumber: https://orm.drizzle.team/docs/get-started/sqlite-new
-->

---
class: module-content
---

### Schema dan Koneksi

```ts
// src/db/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});
```

```ts
// src/db/index.ts — khusus Node.js, file persisten lokal
import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
const sqlite = new Database("./local.db");
export const db = drizzle(sqlite);
```

File SQLite ini bukan penyimpanan persisten untuk deployment serverless. Strategi deploy dibahas di Modul 16.

---
class: module-content
---

### Kontrak Input yang Dibagikan

```ts
// src/lib/todo-schema.ts
import * as v from "valibot";
export const CreateTodoSchema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200)),
});
export const UpdateTodoSchema = v.strictObject({ done: v.boolean() });
export const TodoIdSchema = v.pipe(
  v.string(),
  v.regex(/^[1-9]\d*$/),
  v.transform(Number),
  v.safeInteger(),
);
export type Todo = { id: number; title: string; done: boolean };
```

- Whitespace-only title ditolak; judul dibatasi 200 karakter.
- PATCH hanya menerima `done`: `id`, `title`, atau `userId` bukan field update ini.
- ID harus integer positif yang aman; `abc`, `0`, dan `1.5` ditolak.
- TypeScript membantu saat coding; Valibot memeriksa input pada runtime.

---
class: module-content
---

### Backend: Collection GET + POST

```ts
// src/app/api/todos/route.ts — demo lokal tanpa autentikasi
import * as v from "valibot";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { CreateTodoSchema } from "@/lib/todo-schema";

export async function GET() {
  return Response.json(await db.select().from(todos).orderBy(todos.id));
}

export async function POST(req: Request) {
  const input = v.safeParse(
    CreateTodoSchema,
    await req.json().catch(() => null),
  );
  if (!input.success) {
    return Response.json({ error: "Invalid title" }, { status: 400 });
  }
  const [todo] = await db.insert(todos).values(input.output).returning();
  return Response.json(todo, { status: 201 });
}
```

JSON yang rusak masuk jalur 400. Error database yang tak terduga masuk log server; jangan kirim detail koneksi ke browser.

---
class: module-content
---

### Backend: PATCH dengan Allowlist

```ts
// src/app/api/todos/[id]/route.ts — bagian 1
import * as v from "valibot";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { TodoIdSchema, UpdateTodoSchema } from "@/lib/todo-schema";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Context) {
  const id = v.safeParse(TodoIdSchema, (await params).id);
  const input = v.safeParse(
    UpdateTodoSchema,
    await req.json().catch(() => null),
  );
  if (!id.success || !input.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  const [todo] = await db
    .update(todos)
    .set({ done: input.output.done })
    .where(eq(todos.id, id.output))
    .returning();
  if (!todo) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(todo);
}
```

Update dan deteksi item tak ditemukan memakai hasil query yang sama.

---
class: module-content
---

### Backend: DELETE dan Kontrak Respons

```ts
// src/app/api/todos/[id]/route.ts — bagian 2, gunakan import di slide sebelumnya
export async function DELETE(_req: Request, { params }: Context) {
  const id = v.safeParse(TodoIdSchema, (await params).id);
  if (!id.success) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const [deleted] = await db
    .delete(todos)
    .where(eq(todos.id, id.output))
    .returning({ id: todos.id });
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return new Response(null, { status: 204 });
}
```

| Hasil                     | Respons         |
| :------------------------ | :-------------- |
| Berhasil dihapus          | 204, tanpa body |
| ID tidak valid            | 400             |
| ID valid tetapi tidak ada | 404             |

Jangan memanggil `res.json()` pada respons 204.

---
class: module-content
---

### Frontend: Server Membaca Database Langsung

```tsx
// src/app/todos/page.tsx
import { connection } from "next/server";
import { db } from "@/db";
import { todos } from "@/db/schema";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";

export default async function TodosPage() {
  await connection(); // Request-time pada model tanpa Cache Components
  const items = await db.select().from(todos).orderBy(todos.id);
  return (
    <main>
      <h1>Todo List</h1>
      <TodoForm />
      {items.length === 0 && <p>No todos yet.</p>}
      <ul>
        {items.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </main>
  );
}
```

Tidak perlu HTTP ke API milik sendiri dari Server Component. Ini menghindari ketergantungan localhost saat build/deploy.

---
zoom: 0.85
class: module-content
---

### Frontend: Form dengan Pending dan Error

```tsx
// src/components/TodoForm.tsx — bagian 1
"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setTitle("");
      router.refresh();
    } catch {
      setError("Unable to save. Check title and retry.");
    } finally {
      setPending(false);
    }
  }
  // Return JSX pada slide berikut
}
```

---
class: module-content
---

### Frontend: Markup Form yang Bisa Diakses

```tsx
// Return di dalam TodoForm
return (
  <form onSubmit={submit}>
    <label htmlFor="todo-title">Title</label>
    <input
      id="todo-title"
      value={title}
      required
      maxLength={200}
      disabled={pending}
      aria-describedby="todo-error"
      onChange={(e) => setTitle(e.target.value)}
    />
    <button disabled={pending || !title.trim()}>
      {pending ? "Saving..." : "Add"}
    </button>
    <p id="todo-error" role="alert">
      {error}
    </p>
  </form>
);
```

- Judul baru dikosongkan setelah respons sukses; input tidak hilang saat gagal.
- Pending di sini mencakup request mutasi; loading route menangani pembacaan ulang.
- `router.refresh()` cukup karena query halaman ini **tidak di-cache**.
- Jika nanti memakai cache, invalidasi cache yang sesuai setelah write berhasil.

---
zoom: 0.82
class: module-content
---

### Frontend: Toggle dan Delete

```tsx
// src/components/TodoItem.tsx — bagian 1
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Todo } from "@/lib/todo-schema";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function mutate(method: "PATCH" | "DELETE") {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method,
        ...(method === "PATCH"
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ done: !todo.done }),
            }
          : {}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch {
      setError("Unable to update. Please retry.");
    } finally {
      setPending(false);
    }
  }
  // Return JSX pada slide berikut
}
```

---
class: module-content
---

### Frontend: Nama Tombol dan Status

```tsx
// Return di dalam TodoItem
return (
  <li>
    <span>{todo.title}</span>
    <button
      disabled={pending}
      aria-pressed={todo.done}
      onClick={() => mutate("PATCH")}
    >
      {todo.done ? "Mark incomplete" : "Mark complete"}: {todo.title}
    </button>
    <button disabled={pending} onClick={() => mutate("DELETE")}>
      Delete: {todo.title}
    </button>
    <p role="alert">{error}</p>
  </li>
);
```

**Pengembangan lanjutan:** pertahankan pending sampai UI baru terpasang menggunakan transition; uji klik cepat dan mutasi bersamaan. Untuk multi-user, tambahkan ownership dan penanganan konflik.

---
class: module-content
---

### Checkpoint: Buktikan Alur CRUD

| Skenario                        | Hasil yang harus terlihat                  |
| :------------------------------ | :----------------------------------------- |
| Tambah judul valid              | 201, item tampil, bertahan setelah restart |
| Kirim title kosong / JSON rusak | 400, tidak ada row baru                    |
| PATCH dengan field `id`         | 400, row tidak berubah                     |
| Toggle lalu reload              | Status selesai tetap tersimpan             |
| Hapus ID yang sudah tidak ada   | 404; UI menampilkan kegagalan              |
| Simulasikan jaringan putus      | Tombol pulih, input tidak hilang           |

Lanjutkan pengujian browser pada Modul 15. Auth dan isolasi data pengguna merupakan tahap berikutnya, sebelum deploy publik.

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 11

1. **Satu kontrak CRUD:** schema, metode HTTP, dan frontend memakai field yang sama.
2. **Batas server jelas:** database server-only; browser memakai endpoint tervalidasi.
3. **Selesai berarti teruji:** persistence, error, pending, dan akses keyboard harus terbukti.
