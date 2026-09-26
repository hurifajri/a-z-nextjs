---
layout: intro
badge: "MODUL 05"
badgeColor: "green"
level: 1
---

## 05. State Management Dasar

Memahami cara menyimpan data sementara dengan useState, mengelola efek samping dengan useEffect, teknik berbagi state, serta menghindari jebakan anti-pattern di React.

<!--
Contoh bertanda fragment/sketsa memerlukan konteks komponen atau import. Hook dipanggil di dalam function component/custom hook; bukan pada module scope.
-->

---
class: module-content
---

### Apa Itu State?

Data yang bisa berubah dan memengaruhi tampilan komponen

````md magic-move
```tsx
// ❌ Regular variable: UI will not update when value changes!
"use client";
export default function Counter() {
  let count = 0;

  return (
    <button
      onClick={() => {
        count++;
      }}
    >
      Clicked: {count} times {/* Always shows 0! */}
    </button>
  );
}
```

```tsx
// ✅ useState: React triggers re-render when value changes!
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked: {count} times {/* Automatically updates! */}
    </button>
  );
}
```
````

---
class: module-content
---

### Anatomi useState

Memahami setiap bagian dari hook useState

```tsx {1-2|5-9|16-19|all}
"use client";
import { useState } from "react";

export default function Profile() {
  //        [current value, setter function] = useState(initial value)
  const [name, setName] = useState("John Doe");
  const [age, setAge] = useState(25);
  const [hobbies, setHobbies] = useState<string[]>(["coding", "reading"]);
  const [isActive, setIsActive] = useState(true);

  return (
    <div>
      <p>
        {name}, {age} years old
      </p>
      <button onClick={() => setAge(age + 1)}>Increase Age</button>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "🟢 Active" : "🔴 Inactive"}
      </button>
    </div>
  );
}
```

---
class: module-content
---

### Update State untuk Array dan Object

Jangan mutasi langsung — selalu buat salinan baru (Immutability)!

````md magic-move
```tsx
// ❌ WRONG: Direct mutation does not trigger re-render!
const [items, setItems] = useState(["Apple", "Orange"]);

items.push("Mango"); // ← Direct mutation
setItems(items); // ← React does not detect changes!
```

```tsx
// ✅ CORRECT: Create a new array/object with spread operator!
const [items, setItems] = useState(["Apple", "Orange"]);

// Add item
setItems((prev) => [...prev, "Mango"]);

// Remove item
setItems((prev) => prev.filter((i) => i !== "Orange"));

// Update object
const [user, setUser] = useState({ name: "John Doe", age: 25 });
setUser((prev) => ({ ...prev, age: 26 }));
```
````

<BrutalCard v-click class="mt-4">
  🔑 <strong>Prinsip Immutability:</strong> React membandingkan referensi object/array lama vs baru. Jika referensinya sama (mutasi langsung), React menganggap tidak ada perubahan!
</BrutalCard>

---
class: module-content
---

### useEffect: Mengelola Efek Samping

Menjalankan kode di luar siklus render — fetch data, timer, subscription

```tsx {5|8-11|13-15|17|all}
"use client";
import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  // useEffect(callback, dependencyArray)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup: clear when component unmounts
    return () => clearInterval(timer);
  }, []); // Setup saat mount; Strict Mode menguji setup → cleanup → setup di dev

  return <p>Time: {time ? time.toLocaleTimeString("en-US") : "—"}</p>;
}
```

<div v-click class="mt-3 grid grid-cols-3 gap-2 text-xs">
  <BrutalCard class="text-center"><code>[]</code><br/>Setup saat <strong>mount</strong></BrutalCard>
  <BrutalCard class="text-center"><code>[value]</code><br/>Jalankan saat <strong>value berubah</strong></BrutalCard>
  <BrutalCard class="text-center"><em>tanpa array</em><br/>Jalankan setelah <strong>setiap commit</strong></BrutalCard>
</div>

---
class: module-content
---

### React Pitfall: Derived State di useEffect

Anti-Pattern Populer yang Harus Antum Hindari Sejak Awal!

````md magic-move
```tsx
// ❌ ANTI-PATTERN: Storing derived state in useState + syncing via useEffect
function ShoppingCart({
  items,
  discount,
}: {
  items: { price: number }[];
  discount: number;
}) {
  const [total, setTotal] = useState(0);

  // Causes double render & desync bugs!
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(subtotal - discount);
  }, [items, discount]);

  return <div>Total: ${total}</div>;
}
```

```tsx
// ✅ CORRECT: Compute directly during render (Derived State)
function ShoppingCart({
  items,
  discount,
}: {
  items: { price: number }[];
  discount: number;
}) {
  // No useState & no useEffect needed!
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal - discount;

  return <div>Total: ${total}</div>;
}
```
````

<BrutalCard v-click class="mt-3 bg-yellow-100 text-xs">
  💡 <strong>Aturan Emas:</strong> Jika sebuah nilai bisa dihitung dari <code>props</code> atau <code>state</code> yang sudah ada, <strong>jangan taruh di state baru</strong>!
</BrutalCard>

---
class: module-content
layout: two-cols
---

### Lifting State Up

Berbagi data antar komponen melalui parent

::left::

#### Masalah

Dua komponen perlu akses state yang sama:

```tsx
// ❌ Each component maintains its own isolated state
function NameInput() {
  const [name, setName] = useState("");
  return <input onChange={...} />;
}

function Greeting() {
  // Cannot access `name`!
  return <p>Hello, ???</p>;
}
```

State terpisah = data tidak sinkron!

::right::

#### Solusi: Angkat ke Parent

```tsx {2-3|5-7|8-10|all}
function Parent() {
  // State managed in parent
  const [name, setName] = useState("");

  return (
    <div>
      <NameInput onNameChange={setName} />
      <Greeting name={name} />
    </div>
  );
}

function NameInput({ onNameChange }: { onNameChange: (val: string) => void }) {
  return <input onChange={(e) => onNameChange(e.target.value)} />;
}

function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}
```

---
class: module-content
layout: two-cols
---

### Hindari: "God Component"

Ketika Terlalu Banyak State Ditumpuk di Satu Komponen Raksasa

::left::

#### ❌ The God Component

```tsx
function Dashboard() {
  // 15 separate states piled into 1 file!
  const [user, setUser] = useState();
  const [theme, setTheme] = useState();
  const [notif, setNotif] = useState();
  const [filter, setFilter] = useState();
  const [page, setPage] = useState();
  // ... 10 other states
  // One keystroke -> 1000 lines re-render!
}
```

- Komponen membengkak ribuan baris
- Re-render tidak terkontrol & berat
- Sangat sulit di-test dan di-refactor

::right::

#### ✅ Modular & Local State

```tsx
function Dashboard() {
  return (
    <div>
      <UserSection /> {/* Manage user state */}
      <FilterBar /> {/* Manage filter state */}
      <DataGrid /> {/* Manage pagination */}
    </div>
  );
}
```

- **Colocation**: Taruh state sedekat mungkin dengan tempat ia dipakai
- Komponen kecil, fokus, dan cepat
- Hemat beban re-render browser

---
class: module-content
---

### State adalah Snapshot, Effect untuk Sinkronisasi

```tsx
// Dalam event handler: tiga update berdasarkan state sebelumnya
setCount((n) => n + 1);
setCount((n) => n + 1);
setCount((n) => n + 1); // Hasil akhir +3
```

- Setter menjadwalkan render; variabel pada handler saat ini tetap snapshot lama.
- Gunakan updater function ketika update bergantung pada nilai sebelumnya.
- Effect menyinkronkan sistem eksternal: timer, subscription, browser API.
- Sertakan dependensi reaktif dan cleanup; jangan menyembunyikan warning Hooks.
- Form submit adalah event pengguna: proses di handler, bukan effect.

<!--
Sumber: https://react.dev/reference/react/useEffect
-->

---
class: module-content
---

### Lab: Referensi Lama atau Array Baru?

Prediksi tiga output, lalu tekan **Run**. Ubah `push` menjadi pembaruan immutable.

```ts {monaco-run} {autorun:false, height:'210px'}
const original = ["Apple", "Orange"];
const mutated = original;
mutated.push("Mango");
const copied = [...original, "Pear"];
console.log("referensi mutasi sama:", Object.is(original, mutated));
console.log("referensi salinan sama:", Object.is(original, copied));
console.log("panjang original:", original.length);
```

**Hasil awal:** `true`, `false`, `3`. Target setelah perbaikan: `false`, `false`, `2`.

Ini eksperimen JavaScript tentang referensi; bukan runtime React. Di React, gunakan setter dan updater ketika bergantung pada state sebelumnya.

<!--
Durasi 3 menit. Ganti alias + push dengan const mutated = [...original, "Mango"].
Tanyakan: mengapa original tetap dua item? Jangan menyimpulkan setiap referensi baru selalu membuat seluruh UI dirender ulang.
-->

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
hideInToc: true
transition: slide-up
---

## 3 Hal Penting dari Modul 05

1. **useState & Immutability**: Gunakan `useState` agar UI reaktif. Jangan mutasi langsung — selalu buat salinan array/object baru dengan spread operator.
2. **Hindari Derived State di useEffect**: Jangan buat state baru untuk nilai yang bisa dihitung langsung dari props/state lain saat render.
3. **Lifting State & Colocation**: Angkat state ke parent jika dipakai bersama, tapi hindari _God Component_ dengan menaruh state sedekat mungkin dengan komponen pemakainya.

<!--
Checkpoint: State dan Cleanup
Buktikan tiga functional updates menghasilkan +3. Mount/unmount Clock tanpa timer ganda, dan pastikan placeholder awal sama di server serta client.
Sumber primer: https://react.dev/reference/react/useEffect
Audit: 25 September 2026.
-->
