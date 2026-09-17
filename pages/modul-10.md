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

ORM Modern yang Ringan, Type-Safe, dan Mendukung Multi-Database

<div class="grid grid-cols-2 gap-4 mt-2">
  <div class="brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
    <div class="font-black text-xs uppercase mb-1.5 text-black flex items-center gap-1.5">
      <span>🪶 Keunggulan Utama Drizzle</span>
    </div>
    <ul class="space-y-1 text-xs text-gray-700">
      <li>• <strong>Sangat Ringan:</strong> Tanpa binary engine besar seperti Prisma.</li>
      <li>• <strong>Type-Safe Otomatis:</strong> Tipe TypeScript langsung dari schema.</li>
      <li>• <strong>Dekat dengan SQL:</strong> Query intuitif, performa maksimal.</li>
    </ul>
  </div>

  <div class="brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
    <div class="font-black text-xs uppercase mb-1.5 text-black flex items-center gap-1.5">
      <span>🗄️ Pilihan Driver Database</span>
    </div>
    <ul class="space-y-1 text-xs text-gray-700">
      <li>• <strong>SQLite</strong> (<code>better-sqlite3</code>): Cocok untuk demo & belajar (0 setup).</li>
      <li>• <strong>PostgreSQL</strong> (<code>postgres</code> / Neon / Supabase): Standar industri.</li>
      <li>• <strong>MySQL</strong> (<code>mysql2</code> / PlanetScale): Kompatibel penuh.</li>
    </ul>
  </div>
</div>

<div class="mt-3 p-2.5 brutal-card bg-yellow-50 border-2 border-black shadow-[2px_2px_0px_#000] text-xs">
  💡 <strong>Presentasi & Praktek Kita:</strong> Menggunakan <strong>SQLite</strong> karena <em>zero-setup</em>, 100% offline tanpa instal server database eksternal. Namun seluruh sintaks query-nya <strong>100% identik</strong> saat Antum beralih ke <strong>PostgreSQL</strong> di industri!
</div>

---
layout: two-cols
---

### Definisi Schema: SQLite vs PostgreSQL

Struktur Schema Serupa, Logika Query CRUD 100% Sama

::left::

<div class="font-black text-xs mb-1 text-black flex items-center gap-1">
  <span class="bg-[#FFE600] px-1.5 py-0.5 border border-black rounded text-[10px]">PILIHAN DEMO</span>
  <span>SQLite (`better-sqlite3`)</span>
</div>

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).default(false),
});
```

::right::

<div class="font-black text-xs mb-1 text-black flex items-center gap-1">
  <span class="bg-[#00E5FF] px-1.5 py-0.5 border border-black rounded text-[10px]">OPSI PRODUKSI</span>
  <span>PostgreSQL (Supabase / Neon)</span>
</div>

```ts
import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  done: boolean("done").default(false),
});
```

::bottom::

<div class="mt-2 p-2 brutal-card bg-white border border-black shadow-[2px_2px_0px_#000] text-[11px] text-gray-800">
  🔍 <strong>Perhatikan:</strong> Cukup ganti modul core (<code>sqlite-core</code> ➔ <code>pg-core</code>) dan tipe auto-increment (<code>integer</code> ➔ <code>serial</code>). Logika CRUD setelahnya (<code>db.select()</code>, <code>db.insert()</code>) <strong>tidak berubah sama sekali</strong>!
</div>

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
