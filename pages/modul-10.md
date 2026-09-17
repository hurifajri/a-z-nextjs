---
layout: intro
badge: "MODUL 10"
badgeColor: "green"
level: 1
---

## 10. Next.js Fullstack — Route Handlers & Drizzle ORM

Membuat API sendiri di Next.js! Selain consume API, Next.js juga bisa menjadi backend fullstack.

---

### Mindset Shift: Next.js = Fullstack!

<div
  v-motion
  :initial="{ y: 50, opacity: 0 }"
  :enter="{ y: 0, opacity: 1, transition: { delay: 300 } }"
  class="text-center mt-8"
>

Selama ini kita **consume** API yang sudah dibuat orang lain...

</div>

<div
  v-click
  v-motion
  :initial="{ scale: 0.8, opacity: 0 }"
  :enter="{ scale: 1, opacity: 1 }"
  class="mt-6 brutal-card bg-yellow-100 p-4 text-center border-3 border-black"
>
  🚀 Tapi Next.js juga bisa <strong>MEMBUAT</strong> API sendiri!<br/>
  <span class="text-sm">Frontend + Backend dalam satu project — itulah <strong>Fullstack</strong>.</span>
</div>

<div v-click class="mt-4 grid grid-cols-2 gap-4 text-sm">
  <div class="brutal-card bg-white p-3 text-center">
    <strong>Consume API</strong><br/>
    <code>fetch("https://api-orang.com")</code>
  </div>
  <div class="brutal-card bg-white p-3 text-center">
    <strong>Buat API Sendiri</strong><br/>
    <code>app/api/users/route.ts</code>
  </div>
</div>

---

### Route Handlers: API di Next.js

Buat file `route.ts` di folder `app/api/` — otomatis jadi endpoint!

```tsx {1-2|4-8|10-18|all}
// app/api/hello/route.ts
import { NextResponse } from "next/server";

// GET /api/hello
export async function GET() {
  return NextResponse.json({
    message: "Assalamu'alaikum dari API Next.js!",
  });
}

// POST /api/hello
export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(
    { message: `Ahlan, ${body.nama}!` },
    { status: 201 },
  );
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  📁 Struktur folder menentukan URL: <code>app/api/hello/route.ts</code> → <code>/api/hello</code>
</div>

---

### CRUD Lengkap dengan Route Handlers

Semua operasi data dalam satu file route

````md magic-move
```tsx
// app/api/todos/route.ts — GET: Ambil semua todos
import { NextResponse } from "next/server";

const todos = [{ id: 1, title: "Belajar Next.js", done: false }];

export async function GET() {
  return NextResponse.json(todos);
}
```

```tsx
// app/api/todos/route.ts — POST: Tambah todo baru
export async function POST(request: Request) {
  const body = await request.json();

  const newTodo = {
    id: todos.length + 1,
    title: body.title,
    done: false,
  };
  todos.push(newTodo);

  return NextResponse.json(newTodo, { status: 201 });
}
```

```tsx
// app/api/todos/[id]/route.ts — PUT + DELETE per item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  // Update todo by id...
  return NextResponse.json({ id, ...body });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Delete todo by id...
  return NextResponse.json({ deleted: id });
}
```
````

---

### Pengenalan Drizzle ORM

ORM modern yang ringan dan type-safe untuk TypeScript

<v-clicks>

- 🪶 **Ringan**: Ukuran bundle sangat kecil dibanding Prisma
- 🔒 **Type-Safe**: Tipe data otomatis dari schema — tanpa codegen
- 🗄️ **Multi-Database**: SQLite, PostgreSQL, MySQL
- ⚡ **Mirip SQL**: Syntaxnya dekat dengan SQL asli, mudah dipahami

</v-clicks>

```bash {1|2|all}
# Instalasi
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

---

### Definisi Schema dengan Drizzle

Mendefinisikan struktur tabel database

```tsx {1-2|4-10|12-16|all}
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Definisi tabel "todos"
export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Setup koneksi database
// db/index.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("local.db");
export const db = drizzle(sqlite);
```

---

### CRUD dengan Drizzle ORM

Operasi database dengan sintaks yang mudah dibaca

```tsx {1-4|6-9|11-16|18-21|all}
import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

// CREATE: Tambah todo baru
const newTodo = await db
  .insert(todos)
  .values({
    title: "Belajar Drizzle ORM",
  })
  .returning();

// READ: Ambil semua todos
const allTodos = await db.select().from(todos);

// UPDATE: Tandai selesai
await db.update(todos).set({ done: true }).where(eq(todos.id, 1));

// DELETE: Hapus todo
await db.delete(todos).where(eq(todos.id, 1));
```

---

### Gabungkan: Route Handler + Drizzle

API fullstack yang nyata dalam satu project Next.js!

```tsx {1-4|6-9|11-20|all}
// app/api/todos/route.ts
import { db } from "@/db";
import { todos } from "@/db/schema";
import { NextResponse } from "next/server";

// GET /api/todos — ambil semua dari database
export async function GET() {
  const allTodos = await db.select().from(todos);
  return NextResponse.json(allTodos);
}

// POST /api/todos — simpan ke database
export async function POST(request: Request) {
  const { title } = await request.json();

  const [newTodo] = await db.insert(todos).values({ title }).returning();

  return NextResponse.json(newTodo, { status: 201 });
}
```

---

### Awareness: Server Actions

Alternatif selain Route Handler — langsung panggil fungsi server dari client!

```tsx {1-2|4-8|10-16|all}
// app/actions/todo.ts
"use server";

export async function addTodo(formData: FormData) {
  const title = formData.get("title") as string;
  await db.insert(todos).values({ title });
  revalidatePath("/todos");
}

// Di Client Component:
("use client");
export default function AddForm() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">Tambah</button>
    </form>
  );
}
```

<div v-click class="mt-3 brutal-card bg-white p-3 text-sm">
  📌 Server Actions adalah fitur baru Next.js. Untuk saat ini, kita fokus ke <strong>Route Handlers</strong> dulu karena lebih mirip dengan REST API yang umum digunakan.
</div>

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: fade-out
---

## 3 Hal Penting dari Modul 10

1. **Next.js = Fullstack**: Selain consume API, kita bisa membuat API sendiri lewat Route Handlers di `app/api/` — frontend dan backend dalam satu project!
2. **Drizzle ORM = Simpel dan Type-Safe**: Definisi schema dengan TypeScript, query mirip SQL, dan dukungan SQLite/PostgreSQL untuk kemudahan belajar.
3. **Route Handler + Drizzle = CRUD API**: Gabungkan keduanya untuk membuat REST API lengkap (GET, POST, PUT, DELETE) yang langsung terhubung ke database.
