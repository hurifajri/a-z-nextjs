---
layout: intro
badge: "MODUL 10"
badgeColor: "green"
level: 1
---

## 10. Next.js Fullstack — Route Handlers & Drizzle ORM

Membuat API sendiri di Next.js! Selain consume API, Next.js juga bisa menjadi backend fullstack.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
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

<BrutalCard v-click v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" class="mt-6 bg-yellow-100 text-center">
  🚀 Tapi Next.js juga bisa <strong>MEMBUAT</strong> API sendiri!<br/>
  <span class="text-sm">Frontend + Backend dalam satu project — itulah <strong>Fullstack</strong>.</span>
</BrutalCard>

<div v-click class="mt-4 grid grid-cols-2 gap-4 text-sm">
  <BrutalCard class="text-center">
    <strong>Consume API</strong><br/>
    <code>fetch("https://api-orang.com")</code>
  </BrutalCard>
  <BrutalCard class="text-center">
    <strong>Buat API Sendiri</strong><br/>
    <code>app/api/users/route.ts</code>
  </BrutalCard>
</div>

---
class: module-content
---

### Route Handlers: API di Next.js

Buat file `route.ts` di folder `app/api/` — otomatis jadi endpoint!

```tsx {1-2|4-8|10-18|all}
// app/api/hello/route.ts
import { NextResponse } from "next/server";

// GET /api/hello
export async function GET() {
  return NextResponse.json({
    message: "Hello from Next.js API!",
  });
}

// POST /api/hello
export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(
    { message: `Welcome, ${body.name}!` },
    { status: 201 },
  );
}
```

<BrutalCard v-click class="mt-3">
  📁 Struktur folder menentukan URL: <code>app/api/hello/route.ts</code> → <code>/api/hello</code>
</BrutalCard>

---
class: module-content
---

### Bentuk Endpoint CRUD (Sketsa Kontrak)

GET/POST di collection; PATCH/DELETE di item. Sketsa berikut belum persisten.

````md magic-move
```tsx
// app/api/todos/route.ts — GET: Fetch all todos
import { NextResponse } from "next/server";

const todos = [{ id: 1, title: "Learn Next.js", done: false }];

export async function GET() {
  return NextResponse.json(todos);
}
```

```tsx
// app/api/todos/route.ts — POST: Add new todo
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
// app/api/todos/[id]/route.ts — PATCH + DELETE per item
export async function PATCH(
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
class: module-content
---

### Pengenalan Drizzle ORM

ORM Modern yang Ringan, Type-Safe, dan Mendukung Multi-Database

<div class="grid grid-cols-2 gap-4 mt-2">
  <BrutalCard>
    <div class="font-black text-xs uppercase mb-1.5 text-brutal-black flex items-center gap-1.5">
      <span>🪶 Keunggulan Utama Drizzle</span>
    </div>
    <ul class="space-y-1 text-xs text-gray-700">
      <li>• <strong>Sangat Ringan:</strong> SQL-oriented dengan driver sesuai database; bandingkan ORM pada kebutuhan nyata.</li>
      <li>• <strong>Type-Safe Otomatis:</strong> Tipe TypeScript langsung dari schema.</li>
      <li>• <strong>Dekat dengan SQL:</strong> Query intuitif, performa maksimal.</li>
    </ul>
  </BrutalCard>

  <BrutalCard>
    <div class="font-black text-xs uppercase mb-1.5 text-brutal-black flex items-center gap-1.5">
      <span>🗄️ Pilihan Driver Database</span>
    </div>
    <ul class="space-y-1 text-xs text-gray-700">
      <li>• <strong>SQLite</strong> (<code>better-sqlite3</code>): Cocok untuk demo & belajar (0 setup).</li>
      <li>• <strong>PostgreSQL</strong> (<code>postgres</code> / Neon / Supabase): Standar industri.</li>
      <li>• <strong>MySQL</strong> (<code>mysql2</code> / PlanetScale): Kompatibel penuh.</li>
    </ul>
  </BrutalCard>
</div>

<BrutalCard class="mt-3 bg-yellow-50 text-xs">
  💡 <strong>Presentasi & Praktek Kita:</strong> Menggunakan <strong>SQLite</strong> karena <em>zero-setup</em>, 100% offline tanpa instal server database eksternal. API dasarnya mirip PostgreSQL, tetapi tipe, migration, driver, concurrency, dan fitur SQL harus disesuaikan.
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Definisi Schema: SQLite vs PostgreSQL

API serupa; dialek database dan perilaku driver berbeda

::left::

<div class="font-black text-xs mb-1 text-brutal-black flex items-center gap-1">
  <span class="bg-brutal-yellow px-1.5 py-0.5 border border-brutal-black rounded text-xs">PILIHAN DEMO</span>
  <span>SQLite (`better-sqlite3`)</span>
</div>

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});
```

::right::

<div class="font-black text-xs mb-1 text-brutal-black flex items-center gap-1">
  <span class="bg-brutal-cyan px-1.5 py-0.5 border border-brutal-black rounded text-xs">OPSI PRODUKSI</span>
  <span>PostgreSQL (Supabase / Neon)</span>
</div>

```ts
import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
});
```

::bottom::

<BrutalCard class="mt-2 text-xs text-gray-800">
  🔍 <strong>Perhatikan:</strong> Saat migrasi, ganti modul core (<code>sqlite-core</code> ➔ <code>pg-core</code>) dan tipe auto-increment (<code>integer</code> ➔ <code>serial</code>). Logika CRUD setelahnya (<code>db.select()</code>, <code>db.insert()</code>) mirip, tetapi tetap uji perilaku dialek, constraint, dan transaksi.
</BrutalCard>

---
class: module-content
---

### CRUD dengan Drizzle ORM

Operasi database dengan sintaks yang mudah dibaca

```tsx {1-4|6-9|11-16|18-21|all}
import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

// CREATE: Insert new todo
const newTodo = await db
  .insert(todos)
  .values({
    title: "Learn Drizzle ORM",
  })
  .returning();

// READ: Fetch all todos
const allTodos = await db.select().from(todos);

// UPDATE: Mark as completed
await db.update(todos).set({ done: true }).where(eq(todos.id, 1));

// DELETE: Delete todo
await db.delete(todos).where(eq(todos.id, 1));
```

---
zoom: 0.85
class: module-content
---

### Gabungkan: Route Handler + Drizzle

API fullstack yang nyata dalam satu project Next.js!

```tsx {1-4|6-9|11-20|all}
// Demo lokal tanpa auth; tambahkan otorisasi pada Modul 14
// app/api/todos/route.ts
import * as v from "valibot";
import { CreateTodoSchema } from "@/lib/todo-schema";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { NextResponse } from "next/server";

// GET /api/todos — fetch all records from database
export async function GET() {
  const allTodos = await db.select().from(todos);
  return NextResponse.json(allTodos);
}

// POST /api/todos — insert into database
export async function POST(request: Request) {
  // Schema bersama ditambahkan pada Modul 11
  const result = v.safeParse(
    CreateTodoSchema,
    await request.json().catch(() => null),
  );
  if (!result.success)
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  const { title } = result.output;

  const [newTodo] = await db.insert(todos).values({ title }).returning();

  return NextResponse.json(newTodo, { status: 201 });
}
```

---
class: module-content
---

### Server Actions: Alternatif untuk Mutasi UI

Pilih Route Handler untuk kontrak HTTP; Server Action untuk alur form terintegrasi

```ts
// src/app/actions/todo.ts — file server terpisah, demo lokal tanpa auth
"use server";
import * as v from "valibot";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { CreateTodoSchema } from "@/lib/todo-schema";

export async function addTodo(formData: FormData) {
  const input = v.parse(CreateTodoSchema, { title: formData.get("title") });
  await db.insert(todos).values(input);
  revalidatePath("/todos");
}
```

```tsx
// Fragment pada komponen lain; form dasar ini bisa tetap Server Component
import { addTodo } from "@/app/actions/todo";
<form action={addTodo}>
  <label>
    Title <input name="title" required />
  </label>
  <button type="submit">Add</button>
</form>;
```

<!--
Server Action adalah endpoint yang dapat dipanggil: validasi dan auth wajib untuk data privat.
Untuk UX produksi kembalikan expected errors sebagai state via useActionState; pending via useFormStatus.
Jangan menaruh directive use client dan use server sebagai dua boundary dalam satu file.
-->

---
class: module-content
---

### Dari Demo ke API yang Bisa Dipelihara

- Array di memory hilang saat restart dan tidak dibagi antarreplika: gunakan database.
- JSON dan path params adalah input tak tepercaya; validasi sebelum query.
- Jangan `.set(body)` langsung: allowlist field agar tidak terjadi mass assignment.
- Tambahkan constraint, index, migration, dan transaksi sesuai invariant bisnis.
- 201 untuk create; 400 untuk input salah; 404 untuk item tak ditemukan.
- Multi-user: query harus dibatasi `userId` dari sesi terverifikasi, bukan dari body.

**Praktik:** buat migration lokal dan buktikan data tetap ada setelah server restart.

<!--
Setup koneksi, schema, dan handler konkret dilanjutkan pada Modul 11.
-->

---
class: module-content
---

### Prediksi: Percayakah pada Input?

<LearningCheck
  question="PATCH Todo menerima body berisi title, completed, dan ownerId. Apa yang diteruskan ke database?"
  :options='["Seluruh body agar endpoint fleksibel", "Field yang diizinkan setelah validasi; identitas dari sesi terverifikasi", "ownerId dari body selama bertipe string"]'
  :answer="1"
  explanation="Validasi runtime dan allowlist membatasi input. Otorisasi memeriksa pemilik data di server; TypeScript saja tidak memvalidasi request."
/>

<!--
Fasilitasi: beri 30 detik untuk prediksi pribadi, lalu diskusi berpasangan.
Minta peserta menjelaskan mengapa opsi lain tidak cukup. Gunakan Ulangi prediksi untuk kelompok berikutnya.
-->

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

<!--
Checkpoint: Persistensi dan Kontrak HTTP
Buat migration lalu simpan data; restart server dan baca ulang. Bedakan sketsa memory-only, endpoint database, serta endpoint multi-user yang perlu auth.
Sumber primer: https://orm.drizzle.team/docs/migrations
Audit: 25 September 2026.
-->
