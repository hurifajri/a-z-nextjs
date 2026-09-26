---
hideInToc: true
transition: slide-up
---

## BAGAIMANA TANGGA BELAJAR MENUJU NEXT.JS?

<p>
  Dari fondasi web hingga fullstack framework — alur bertahap yang semoga Allah mudahkan Antum dalam mempelajarinya.
</p>

<!-- Node-Edge Flow Container -->
<div class="flex items-stretch justify-between gap-2.5 mt-2">
  <!-- Node 1: HTML, CSS & JS -->
  <BrutalCard v-click="1" class="flow-card flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2 items-start">
      <BrutalBadge>
        01. FONDASI
      </BrutalBadge>
      <div class="font-black text-sm text-brutal-black">HTML + CSS + JS</div>
      <p class="text-xs text-gray-700 leading-snug">
        Struktur konten, tata letak visual, dan interaktivitas logika di browser.
      </p>
        <BrutalLink
          v-click="2"
          href="https://sandbox.hsi.id/learning"
          class="flow-card mb-2"
        />
    </div>
    <div class="pt-2 border-t border-dashed border-gray-300 text-xs font-bold text-gray-500">
      Wajib dipahami
    </div>
  </BrutalCard>

  <!-- Edge 1 -->
  <div v-click="3" class="flow-card flex items-center justify-center shrink-0">
    <BrutalCard class="!rounded-full !p-0 !shadow-brutal-sm hover:!shadow-brutal w-7 h-7 flex items-center justify-center font-black text-xs">
      ➔
    </BrutalCard>
  </div>

  <!-- Node 2: React.js -->
  <BrutalCard v-click="3" class="flow-card flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2 items-start">
      <BrutalBadge color="cyan">
        02. UI LIBRARY
      </BrutalBadge>
      <div class="font-black text-sm text-brutal-black">React.js</div>
      <p class="text-xs text-gray-700 leading-snug">
        Berpikir berbasis komponen, manajemen state (useState), props, dan reaktivitas.
      </p>
    </div>
    <div class="pt-2 border-t border-dashed border-gray-300 text-xs font-bold text-gray-500">
      Arsitektur UI modern
    </div>
  </BrutalCard>

  <!-- Edge 2 -->
  <div v-click="4" class="flow-card flex items-center justify-center shrink-0">
    <BrutalCard class="!rounded-full !p-0 !shadow-brutal-sm hover:!shadow-brutal w-7 h-7 flex items-center justify-center font-black text-xs">
      ➔
    </BrutalCard>
  </div>

  <!-- Node 3: TypeScript -->
  <BrutalCard v-click="4" class="flow-card flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2 items-start">
      <BrutalBadge color="pink">
        03. TYPE SAFETY
      </BrutalBadge>
      <div class="font-black text-sm text-brutal-black">TypeScript</div>
      <p class="text-xs text-gray-700 leading-snug">
        Keamanan tipe data, auto-complete cerdas, dan cegah error sejak awal coding.
      </p>
    </div>
    <div class="pt-2 border-t border-dashed border-gray-300 text-xs font-bold text-gray-700">
      Standar industri modern
    </div>
  </BrutalCard>

  <!-- Edge 3 -->
  <div v-click="5" class="flow-card flex items-center justify-center shrink-0">
    <BrutalCard color="yellow" class="!rounded-full !p-0 !shadow-brutal-sm hover:!shadow-brutal w-7 h-7 flex items-center justify-center font-black text-xs">
      ➔
    </BrutalCard>
  </div>

  <!-- Node 4: Next.js -->
  <BrutalCard v-click="5" color="yellow" class="flow-card flex-1 flex flex-col justify-between">
    <div class="flex flex-col gap-2 items-start">
      <BrutalBadge color="green">
        04. FRAMEWORK
      </BrutalBadge>
      <div class="font-black text-sm text-brutal-black">Next.js</div>
      <p class="text-xs text-gray-900 leading-snug">
        Framework lengkap: Server Components, Routing otomatis, dan siap rilis produksi.
      </p>
    </div>
    <div class="pt-2 border-t border-dashed border-brutal-black/30 text-xs font-black text-brutal-black">
      🎯 Tujuan kita
    </div>
  </BrutalCard>
</div>

<!-- Bottom Strategy Box (Revealed on click 6) -->
<BrutalCard v-click="6" class="flow-card mt-6 !px-4 !py-2.5">
  <div class="flex items-center gap-2 font-black text-xs text-brutal-black mb-1">
    <BrutalBadge color="orange">
      💡 STRATEGI BELAJAR
    </BrutalBadge>
    <span>Terinspirasi prinsip Pareto (80/20)</span>
  </div>
  <p class="text-xs text-gray-700 leading-snug">
    Dalam bootcamp ini, kita memprioritaskan <b>fondasi dan pola yang paling sering digunakan</b> untuk membangun aplikasi. Prinsip <b>80/20</b> menjadi panduan menentukan fokus, bukan pembagian pasti materi atau jaminan hasil. Konsep lainnya dipelajari bertahap sesuai kebutuhan proyek.
  </p>
</BrutalCard>

<BrutalCard v-click="7" class="flow-card mt-6 !px-4 !py-2.5">
  <BrutalBadge color="purple" class="mb-1">🍱 Bekal sebelum modul 01</BrutalBadge>
  <p class="text-xs">Pastikan Antum bisa memakai array/object, async/await, props, event handler, dan tipe dasar TypeScript. Jika belum, kerjakan latihan fondasi terlebih dahulu; waktu penguasaan berbeda bagi setiap peserta.</p>
</BrutalCard>

<!--
Diagnostik pembuka: minta peserta memetakan array menjadi daftar, menunggu Promise, dan menjelaskan props vs state.
Jika belum lancar, gunakan materi fondasi di sandbox.hsi.id/learning sebelum melanjutkan.
-->
