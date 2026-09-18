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
    <div>
      <div class="text-xs font-black uppercase tracking-wider bg-brutal-yellow px-1.5 py-0.5 border border-brutal-black rounded inline-block mb-1.5">
        01. FONDASI
      </div>
      <div class="font-black text-sm text-brutal-black">HTML + CSS + JS</div>
      <p class="text-xs text-gray-700 mt-1 leading-snug">
        Struktur konten, tata letak visual, & interaktivitas logika di browser.
      </p>
      <a
        v-click="2"
        href="https://sandbox.hsi.id/learning"
        target="_blank"
        rel="noopener noreferrer"
        class="flow-card inline-flex items-center justify-center gap-1 w-full text-brutal-black !no-underline font-black bg-brutal-white hover:bg-brutal-yellow px-2 py-0.5 rounded-md border-2 border-brutal-black transition-all shadow-brutal-sm text-xs mb-1.5"
        @click.stop
      >
        <span>sandbox.hsi.id/learning</span>
        <span class="text-xs">↗</span>
      </a>
    </div>
    <div class="pt-1.5 border-t border-dashed border-gray-300 text-xs font-bold text-gray-500">
      Wajib dipahami
    </div>
  </BrutalCard>

  <!-- Edge 1 -->
  <div v-click="3" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-brutal-black bg-brutal-white flex items-center justify-center font-black text-xs shadow-brutal-sm">
      ➔
    </div>
  </div>

  <!-- Node 2: React.js -->
  <BrutalCard v-click="3" class="flow-card flex-1 flex flex-col justify-between">
    <div>
      <div class="text-xs font-black uppercase tracking-wider bg-brutal-cyan px-1.5 py-0.5 border border-brutal-black rounded inline-block mb-1.5">
        02. UI LIBRARY
      </div>
      <div class="font-black text-sm text-brutal-black">React.js</div>
      <p class="text-xs text-gray-700 mt-1 leading-snug">
        Berpikir berbasis komponen, manajemen state (useState), props, & reaktivitas.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-gray-300 text-xs font-bold text-gray-500">
      Arsitektur UI modern
    </div>
  </BrutalCard>

  <!-- Edge 2 -->
  <div v-click="4" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-brutal-black bg-brutal-white flex items-center justify-center font-black text-xs shadow-brutal-sm">
      ➔
    </div>
  </div>

  <!-- Node 3: TypeScript -->
  <BrutalCard v-click="4" class="flow-card flex-1 flex flex-col justify-between">
    <div>
      <div class="text-xs font-black uppercase tracking-wider bg-brutal-pink text-brutal-white px-1.5 py-0.5 border border-brutal-black rounded inline-block mb-1.5">
        03. TYPE SAFETY
      </div>
      <div class="font-black text-sm text-brutal-black">TypeScript</div>
      <p class="text-xs text-gray-700 mt-1 leading-snug">
        Keamanan tipe data, auto-complete cerdas, & cegah error sejak awal coding.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-gray-300 text-xs font-bold text-gray-700">
      Standar industri modern
    </div>
  </BrutalCard>

  <!-- Edge 3 -->
  <div v-click="5" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-brutal-black bg-brutal-yellow flex items-center justify-center font-black text-xs shadow-brutal-sm">
      ➔
    </div>
  </div>

  <!-- Node 4: Next.js -->
  <BrutalCard v-click="5" class="flow-card flex-1 bg-brutal-yellow flex flex-col justify-between">
    <div>
      <div class="text-xs font-black uppercase tracking-wider bg-brutal-white text-brutal-black px-1.5 py-0.5 border border-brutal-black rounded inline-block mb-1.5">
        04. FRAMEWORK
      </div>
      <div class="font-black text-sm text-brutal-black">Next.js</div>
      <p class="text-xs text-gray-900 mt-1 leading-snug">
        Framework lengkap: Server Components, Routing otomatis, & siap rilis produksi.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-brutal-black/30 text-xs font-black text-brutal-black">
      🎯 Tujuan kita
    </div>
  </BrutalCard>
</div>

<!-- Bottom Strategy Box (Revealed on click 6) -->
<div v-click="6" class="flow-card mt-6 px-4 py-2 border-2 border-brutal-black rounded bg-brutal-white shadow-brutal">
  <div class="flex items-center gap-2 font-black text-xs text-brutal-black mb-1">
    <span class="bg-brutal-green text-brutal-black px-2 py-0.5 border border-brutal-black rounded text-xs uppercase font-black">
      💡 REALITAS BOOTCAMP 4 BULAN
    </span>
    <span>Prinsip Pareto (80/20)</span>
  </div>
  <p class="text-xs text-gray-700 leading-snug">
    Mempelajari seluruh tahapan di atas dari nol secara terpisah butuh waktu bertahun-tahun. Di bootcamp intensif ini, kita langsung fokus ke <b>Next.js</b> sambil menyerap <b><span v-mark.circle.orange="7">20%</span> intisari</b> HTML, CSS, JS, React, hingga TypeScript yang <b>benar-benar dipakai di <span v-mark.circle.orange="8">80%</span> proyek nyata</b>!
  </p>
</div>

<style>
.flow-card {
  transition: opacity 0.4s ease-out, transform 0.15s ease, box-shadow 0.15s ease !important;
}
.flow-card.slidev-vclick-hidden {
  opacity: 0 !important;
  pointer-events: none !important;
}
</style>
