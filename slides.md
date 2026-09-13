---
theme: neobrutalism
layout: cover
badgeLeft: "✦ SANDBOX IT HSI 2026"
badgeRight: "KELAS NEXT.JS"
---

# Next.js: <span v-mark.underline.orange>Framework</span> React untuk <span v-mark.underline.orange>Web</span>

Digunakan oleh berbagai perusahaan terkemuka dunia, Next.js memudahkan Antum membangun aplikasi web modern dan berkualitas tinggi dengan memanfaatkan keunggulan komponen React

<div class="mt-8 flex justify-center gap-4">
  <span class="brutal-badge brutal-badge-cyan">react.dev</span>
  <span class="brutal-badge brutal-badge-yellow">nextjs.org</span>
  <span class="brutal-badge brutal-badge-pink">vercel.com</span>
</div>

---

## APA SAJA YANG BISA DIBUAT DENGAN NEXT.JS?

<p>
  Dari landing page sederhana hingga marketplace — apa pun yang bisa diakses melalui browser, insyaa Allah bisa Antum buat.
</p>

<!-- Card Deck Stack Showcase -->
<div class="relative w-[780px] h-[310px] mx-auto mt-2">

  <!-- Base Placeholder (Click 0) -->
  <div
    class="absolute inset-0 border-2 border-dashed border-black/30 rounded-xl bg-black/5 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
    @click="$slidev.nav.next"
  >
    <div
      class="w-12 h-12 rounded-full border-2 border-black bg-[#FFE600] flex items-center justify-center font-black text-xl mb-4 shadow-[2px_2px_0px_#000]"
    >
      ✦
    </div>
    <a
      href="https://nextjs.org/showcase"
      target="_blank"
      rel="noopener noreferrer"
      class="text-xs font-black text-black flex items-center gap-1.5 bg-white border-2 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] transition-all"
      @click.stop
    >
      <span>nextjs.org/showcase</span>
      <span class="text-[10px]">↗</span>
    </a>
  </div>

  <!-- 01. E-Commerce -->
  <div
    v-click="1"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[5px_5px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(-2deg) translate(-6px, 3px); z-index: 10;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/01-ecommerce.svg" alt="E-Commerce Store" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFE600] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            E-Commerce
          </span>
          <span class="font-black text-xs text-black">Toko Online & Retail</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Katalog produk interaktif, pencarian & filter barang, keranjang belanja (cart), hingga alur checkout dan pembayaran online.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.lg.com/id/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FFE600] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>lg.com/id</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 02. SaaS Analytics -->
  <div
    v-click="2"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[5px_5px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(2deg) translate(6px, -3px); z-index: 15;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/02-saas-dashboard.svg" alt="SaaS Dashboard" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#00E5FF] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            SaaS
          </span>
          <span class="font-black text-xs text-black">Analytics Dashboard</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Grafik visualisasi data bisnis interaktif, rangkuman metrik penting, filter rentang waktu, serta ekspor laporan otomatis.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.nerdwallet.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#00E5FF] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>nerdwallet.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 03. AI Copilot -->
  <div
    v-click="3"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[6px_6px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(-1.6deg) translate(-4px, -4px); z-index: 20;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/03-ai-copilot.svg" alt="AI Copilot" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#B388EB] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            AI Copilot
          </span>
          <span class="font-black text-xs text-black">AI Chat & Workspace</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Percakapan asisten cerdas, penelaahan isi file dokumen, riwayat percakapan tersimpan, serta otomasi tugas harian.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://openai.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#B388EB] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>openai.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 04. LMS Portal -->
  <div
    v-click="4"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[6px_6px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(1.6deg) translate(6px, 4px); z-index: 25;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/04-lms-education.svg" alt="LMS Education" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FF6B8B] text-white border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            EdTech
          </span>
          <span class="font-black text-xs text-black">LMS / Learning Portal</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Modul kurikulum terstruktur, pemutar materi video santri, pemantau progres belajar, kuis evaluasi, dan sertifikat kelulusan.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.codecademy.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FF6B8B] hover:text-white px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>codecademy.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 05. Content & Media CMS -->
  <div
    v-click="5"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[6px_6px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(-1.2deg) translate(-5px, 5px); z-index: 30;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/05-content-portal.svg" alt="Content Portal" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#2ED573] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            Media CMS
          </span>
          <span class="font-black text-xs text-black">Content & News Portal</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Publikasi artikel & berita cepat, pengelompokan rubrik kategori, tampilan baca ramah handphone, serta tombol bagikan ke medsos.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.washingtonpost.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#2ED573] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>washingtonpost.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 06. Booking & Ticketing -->
  <div
    v-click="6"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[6px_6px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(1.8deg) translate(5px, -3px); z-index: 35;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/06-booking-event.svg" alt="Booking & Tickets" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFA502] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            Booking
          </span>
          <span class="font-black text-xs text-black">Booking & Ticketing</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Pemilihan jadwal di kalender interaktif, pemesanan tiket acara, konfirmasi booking langsung, hingga e-tiket barcode digital.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.ticketmaster.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FFA502] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>ticketmaster.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 07. Social Forum -->
  <div
    v-click="7"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[7px_7px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[8px_8px_0px_#000]"
    style="transform: rotate(-1deg) translate(-3px, 2px); z-index: 40;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/07-social-community.svg" alt="Community Forum" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#00E5FF] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            Community
          </span>
          <span class="font-black text-xs text-black">Community & Forum</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Ruang diskusi tanya-jawab santri, sistem upvote jawaban bermanfaat, utas percakapan teratur, serta reputasi profil anggota.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://www.patreon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#00E5FF] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>patreon.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 08. Internal ERP & Ops -->
  <div
    v-click="8"
    class="deck-card absolute inset-0 bg-white border-3 border-black shadow-[8px_8px_0px_#000] rounded-xl p-3 flex flex-row gap-4 items-center cursor-pointer select-none transition-shadow hover:shadow-[10px_10px_0px_#000]"
    style="transform: rotate(0.4deg) translate(0px, 0px); z-index: 45;"
    @click="$slidev.nav.next"
  >
    <div class="w-[460px] h-[260px] shrink-0">
      <img src="/screenshots/08-internal-erp.svg" alt="Internal ERP" class="w-full h-full object-contain" />
    </div>
    <div class="flex-1 flex flex-col justify-between h-[260px] py-1">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFE600] border-1.5 border-black rounded shadow-[1px_1px_0px_#000]">
            Backoffice
          </span>
          <span class="font-black text-xs text-black">Internal ERP & Admin</span>
        </div>
        <p class="text-[11px] text-gray-700 leading-relaxed font-medium">
          Manajemen data operasional terpusat, pengaturan hak akses pengguna, alur persetujuan (approval), serta rekap laporan data.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://jobs.netflix.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FFE600] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>jobs.netflix.com</span>
          <span class="text-[10px]">↗</span>
        </a>
      </div>
    </div>
  </div>

</div>

<style>
.deck-card {
  transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.deck-card.slidev-vclick-hidden {
  opacity: 0 !important;
  transform: translateY(-40px) scale(0.92) !important;
  pointer-events: none !important;
}
.deck-card a,
.deck-card a:hover,
.deck-card a:focus {
  text-decoration: none !important;
  color: #000000 !important;
}
</style>

---

## TANGGA BELAJAR MENUJU NEXT.JS

<p>Alur Fondasi Ideal yang Sebenarnya Dibutuhkan Sebelum Masuk ke Dunia Fullstack</p>
<span v-mark.underline.orange>inline markers</span>
<!-- Node-Edge Flow Container -->
<div class="flex items-stretch justify-between gap-2.5 mt-2">
  <!-- Node 1: HTML, CSS & JS -->
  <div v-click="1" class="flex-1 brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#FFE600] px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        01. PONDASI DASAR
      </div>
      <div class="font-black text-sm text-black">HTML + CSS + JS</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Struktur halaman, estetika styling, dan logika manipulasi data di browser.
      </p>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 text-[10px] font-bold text-gray-500">
      Wajib Dipahami
    </div>
  </div>

  <!-- Edge 1 -->
  <div v-click="3" class="flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 2: React.js -->
  <div v-click="3" class="flex-1 brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#00E5FF] px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        02. UI LIBRARY
      </div>
      <div class="font-black text-sm text-black">React.js</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Berpikir berbasis komponen, manajemen state (useState), props, & reaktivitas.
      </p>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 text-[10px] font-bold text-gray-500">
      Fondasi Komponen
    </div>
  </div>

  <!-- Edge 2 -->
  <div v-click="4" class="flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 3: TypeScript -->
  <div v-click="4" class="flex-1 brutal-card bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#FF6B8B] text-white px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        03. TIPE DATA
      </div>
      <div class="font-black text-sm text-black">TypeScript</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Keamanan tipe variabel, auto-complete cerdas, dan mencegah bug koding sejak awal.
      </p>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-gray-300 text-[10px] font-bold text-[#FF6B8B]">
      *Opsional tapi Dianjurkan
    </div>
  </div>

  <!-- Edge 3 -->
  <div v-click="5" class="flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-[#FFE600] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 4: Next.js -->
  <div v-click="5" class="flex-1 brutal-card bg-[#FFE600] p-3 border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between ring-2 ring-black">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded inline-block mb-1.5">
        04. FULLSTACK WEB
      </div>
      <div class="font-black text-sm text-black">Next.js App Router</div>
      <p class="text-[11px] text-gray-900 mt-1 leading-snug">
        Framework lengkap: Server Components, Routing otomatis, & siap rilis produksi.
      </p>
    </div>
    <div class="mt-2 pt-2 border-t border-dashed border-black/30 text-[10px] font-black text-black">
      🎯 Tujuan Bootcamp Kita
    </div>
  </div>
</div>

<!-- Hand-drawn arrow pointing to sandbox.hsi.id/learning (Revealed on click 2) -->
<p v-click="2" class="absolute bottom-12 left-14 text-[10px] text-gray-800 font-bold max-w-60 z-20 leading-tight">
  💡 Tim Sandbox sudah menyiapkan modul mandiri untuk belajar dasar HTML, CSS & JS di tautan ini!
</p>
<p v-click="2" class="absolute bottom-20 left-45 opacity-90 font-mono text-xs font-bold transform bg-[#FFE600] px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] z-20">
  sandbox.hsi.id/learning
</p>

<!-- Bottom Strategy Box (Revealed on click 6) -->
<div v-click="6" class="absolute bottom-8 right-14 w-120 p-3 border-2 border-black rounded bg-white shadow-[3px_3px_0px_#000]">
  <div class="flex items-center gap-2 font-black text-xs text-black mb-1">
    <span class="bg-[#2ED573] text-black px-2 py-0.5 border border-black rounded text-[10px] uppercase font-black">
      💡 REALITAS BOOTCAMP 4 BULAN
    </span>
    <span>Jalur Pintas Pareto (80/20)</span>
  </div>
  <p class="text-[10px] text-gray-700 leading-relaxed">
    Belajar keempat tangga secara terpisah dari nol butuh waktu lebih dari setahun.
    Di bootcamp intensif ini, kita langsung fokus ke <b>Next.js</b> sambil memungut esensi HTML, CSS, JS, dan React yang <b>benar-benar dipakai di 80% proyek nyata</b>!
  </p>
</div>

---
layout: two-cols
---

## ROADMAP PEMBELAJARAN

<p>16 Modul Terstruktur: Langkah Demi Langkah dari Dasar hingga Rilis ke Publik</p>

::left::

<div class="h-full flex flex-col gap-1.5 text-xs">
  <div class="flex-1 flex items-center justify-between px-2.5 border-2 border-black rounded bg-[#FFE600] font-bold shadow-[2px_2px_0px_#000]">
    <span>01. Pengenalan Next.js & Ekosistemnya</span>
    <span>⭐</span>
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    02. Setup Project & Tools (ESLint, Tailwind)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    03. Navigasi & Layout (Routing Dinamis)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    04. State Management Dasar (useState, useEffect)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    05. State Management Lanjutan (useContext)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    06. Mini Project: Aplikasi Todo Sederhana
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    07. Konsumsi API: Menampilkan Data (GET)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    08. Manipulasi Data (POST, PUT, DELETE)
  </div>
</div>

::right::

<div class="h-full flex flex-col gap-1.5 text-xs">
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    09. Form Input & Validasi Data
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    10. Penanganan Data Dinamis (Filter & Cari)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    11. Handoff UI/UX: Dari Figma ke Kode
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    12. Integrasi API Backend & Login (JWT)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    13. Mengenal Dokumentasi API (Swagger)
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    14. Desain Responsif & Tampilan Mobile
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    15. Unit Testing Komponen Klien
  </div>
  <div class="flex-1 flex items-center px-2.5 border-2 border-black rounded bg-white font-bold shadow-[2px_2px_0px_#000]">
    16. Build & Deploy Website ke Vercel
  </div>
</div>

---
layout: intro
badge: "MODUL 01"
badgeColor: "yellow"
---

## 01. Pengenalan Next.js & Ekosistemnya

Mengenal Apa Itu Next.js, Bedanya dengan React Biasa, serta Fondasi Struktur Folder dan Routing.

---

### Kenapa Kita Butuh Next.js?

Solusi Praktis Bikin Website yang Cepat, Rapi, dan Gampang Ditemukan di Google

Next.js adalah framework React yang dirancang agar kita bisa membangun website nyata dengan mudah. Jika React biasa hanya fokus di browser pengunjung, **Next.js bekerja cerdas menggabungkan keunggulan server dan browser.**

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🚀 Lengkap & Siap Pakai</div>
    <p class="text-xs text-gray-700">Tidak perlu pusing install router manual. Routing halaman, tata letak, dan pengolahan data sudah langsung tersedia.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">⚡ Tampilan Langsung Muncul</div>
    <p class="text-xs text-gray-700">Server langsung mengirimkan halaman yang sudah jadi. Pengunjung tidak perlu menunggu layar putih berputar-putar.</p>
  </div>
  <div class="brutal-card bg-white">
    <div class="font-black text-lg mb-1">🛠 Fitur Otomatis Canggih</div>
    <p class="text-xs text-gray-700">Gambar otomatis di-compress (`next/image`), font dimuat cepat (`next/font`), dan link antar halaman terasa instan.</p>
  </div>
</div>

---
layout: two-cols
---

### React Biasa (SPA) vs Next.js

Memahami Perbedaan Cara Menampilkan Halaman ke Pengunjung

::left::

#### React Biasa (Vite / CRA)

- 📦 **Browser Bekerja Sendirian**: Browser mengunduh file HTML kosong `<div id="root"></div>`, lalu sibuk merakit halaman sendiri.
- ⏳ **Layar Putih Sejenak**: Pengunjung sering melihat halaman kosong atau loading spinner sebelum isi konten muncul.
- 🔍 **Kurang Ramah Google (SEO)**: Mesin pencari dan media sosial kesulitan membaca isi teks jika halaman lambat dirakit.
- 🛡 **Kode Rahasia Rawan Bocor**: Kunci API privat atau logika rahasia tidak aman jika ditaruh di komponen biasa.

::right::

#### Next.js (App Router)

- ⚡ **Tampilan Siap Baca**: Server langsung merakit dan mengirimkan halaman siap jadi, sehingga tulisan langsung tampil seketika.
- 🧩 **Ukuran File Lebih Ringan**: Sebagian besar pekerjaan selesai di server, jadi HP pengunjung tidak keberatan memproses kode.
- 📈 **Mudah Dibagikan ke Medsos**: Judul, gambar thumbnail, dan deskripsi otomatis terbaca rapi saat link dibagikan.
- 🔒 **Jauh Lebih Aman**: Sambungan ke database dan password rahasia tersimpan aman di server tanpa bisa diintip pengunjung.

---

### Ringkasan Perbedaan Utama

Tabel Komparasi Sederhana untuk Memilih Pendekatan yang Pas

| Aspek                    | React Biasa (Vite / CRA)                            | Next.js (App Router)                                 |
| :----------------------- | :-------------------------------------------------- | :--------------------------------------------------- |
| **Cara Tampil**          | Browser merakit halaman sendiri dari nol            | Server mengirim halaman yang sudah jadi              |
| **Kecepatan Buka Awal**  | Muncul layar kosong atau spinner sesaat             | Konten langsung terbaca dalam hitungan milidetik     |
| **Beban di HP Pengguna** | Makin banyak halaman, file yang diunduh makin besar | Ringan, hanya mengirim kode yang benar-benar dipakai |
| **Bikin Halaman Baru**   | Harus install library tambahan (`react-router`)     | Cukup buat folder baru di dalam folder `app/`        |
| **Optimasi Gambar**      | Harus compress manual satu per satu                 | Otomatis dioptimalkan lewat komponen `next/image`    |
| **SEO (Google Search)**  | Butuh pengaturan rumit tambahan                     | Sudah otomatis siap pakai lewat fitur Metadata       |

---
layout: two-cols
---

### Server vs Client Component

Kapan Menggunakan Komponen Server dan Kapan Butuh Komponen Klien?

::left::

#### Server Component _(Bawaan Next.js)_

Komponen santai yang hanya bertugas menampilkan data:

```tsx
// app/users/page.tsx
// ✅ Otomatis jalan di server (Default)
export default async function UsersPage() {
  const users = await db.user.findMany(); // Ambil data langsung!

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

- ❌ Tidak bisa pakai tombol klik `onClick` atau `useState`
- ✅ Sangat cepat, hemat kuota pengunjung, dan aman

::right::

#### Client Component (`'use client'`)

Dipakai khusus saat butuh tombol klik atau input interaktif:

```tsx
"use client"; // 👈 Tulis baris ini di baris paling atas!

import { useState } from "react";

export default function Counter() {
  const [angka, setAngka] = useState(0);

  return (
    <button onClick={() => setAngka(angka + 1)}>Diklik: {angka} kali</button>
  );
}
```

- ✅ Bisa memakai `useState`, tombol klik, dan form input
- ✅ Bisa mengakses fitur browser seperti `localStorage`

---

### Struktur Folder di Next.js

Cukup Buat Folder Baru, Alamat Halaman Website Otomatis Terbentuk!

Next.js menggunakan aturan sederhana: **nama folder adalah rute halaman di browser**. Tidak perlu lagi menulis file routing yang panjang dan membingungkan:

```
proyek-nextjs/
├── app/                      # Tempat utama membuat semua halaman website
│   ├── layout.tsx            # Kerangka tetap website (misal: navbar & footer)
│   ├── page.tsx              # Halaman depan / beranda utama ("/")
│   ├── loading.tsx           # Animasi atau teks saat halaman sedang loading
│   ├── not-found.tsx         # Halaman jika alamat tidak ditemukan (404)
│   ├── error.tsx             # Halaman ramah jika terjadi kendala teknis
│   ├── tentang/
│   │   └── page.tsx          # Halaman alamat "/tentang"
│   └── produk/
│       ├── page.tsx          # Halaman alamat "/produk"
│       └── [id]/
│           └── page.tsx      # Halaman dinamis, misal: "/produk/buku-react"
├── public/                   # Tempat menyimpan gambar, logo, dan file statis
├── next.config.ts            # Pengaturan bawaan proyek Next.js
└── package.json
```

---
layout: two-cols
---

### File-File Khusus di Next.js

Nama File yang Memiliki Fungsi Otomatis Tanpa Perlu Dikonfigurasi Manual

::left::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FFE600] bg-black px-1.5 py-0.5 rounded text-xs mr-2">page.tsx</span>
    File wajib untuk menampilkan isi halaman ke pengunjung website.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#00E5FF] bg-black px-1.5 py-0.5 rounded text-xs mr-2">layout.tsx</span>
    Kerangka bersama (seperti navbar) yang tidak akan me-reload saat pindah menu.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#FF6B8B] bg-black px-1.5 py-0.5 rounded text-xs mr-2">loading.tsx</span>
    Tampilan sementara otomatis saat halaman sedang mengambil data baru.
  </div>
</div>

::right::

<div class="space-y-3 text-sm">
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#2ED573] bg-black px-1.5 py-0.5 rounded text-xs mr-2">error.tsx</span>
    Menangkap masalah teknis dengan rapi agar website tidak rusak berantakan.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-[#B388EB] bg-black px-1.5 py-0.5 rounded text-xs mr-2">not-found.tsx</span>
    Halaman ramah yang muncul otomatis jika pengunjung salah mengetik alamat URL.
  </div>
  <div class="p-3 border-2 border-black rounded bg-white shadow-[2px_2px_0px_#000]">
    <span class="font-black text-white bg-black px-1.5 py-0.5 rounded text-xs mr-2">route.ts</span>
    Jalur penyedia data khusus (API data) jika ingin membuat layanan data sendiri.
  </div>
</div>

---

### Contoh Membuat Halaman & Rute

Halaman Statis, Halaman dengan Nomor ID, dan Pengelompokan Folder

```ts
// 1. Halaman Biasa: app/produk/page.tsx
// Alamat di browser: /produk

// 2. Halaman Dinamis (Berdasarkan ID): app/produk/[id]/page.tsx
// Alamat di browser: /produk/123 atau /produk/laptop-gaming
export default async function DetailProduk({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <h1>Halaman Produk ID: {id}</h1>
}

// 3. Folder Pengelompokan: app/(auth)/login/page.tsx
// Alamat di browser: /login (tanda kurung "(auth)" tidak ikut masuk ke URL)
```

> **Tips Santai:** Tanda kurung kurawal seperti `[id]` digunakan saat isi alamat URL berubah-ubah tergantung data barang atau artikel yang dipilih pengunjung!

---
layout: intro
badge: "RANGKUMAN"
badgeColor: "yellow"
---

## 3 Hal Penting yang Perlu Diingat

1. **Next.js adalah React Siap Pakai**: Kita tidak perlu lagi repot mengatur router atau optimasi manual, semuanya sudah siap dibangun.
2. **Secara Bawaan Sangat Ringan**: Semua komponen otomatis berjalan di server; gunakan tulisan `'use client'` hanya pada komponen yang memiliki tombol interaktif atau form ketik.
3. **Bikin Halaman Sangat Mudah**: Cukup buat folder baru di dalam `app/` dan tambahkan file `page.tsx` di dalamnya, halaman Antum langsung aktif!

---
layout: intro
badge: "MODUL 02"
badgeColor: "cyan"
---

## 02. Setup Project dan Tools

Inisialisasi project baru, menyiapkan ESLint, Prettier, dan Tailwind CSS, serta memahami perbedaan mendasar antara folder pages/ dan app/ directory.

---
layout: intro
badge: "MODUL 03"
badgeColor: "pink"
---

## 03. Navigasi dan Layout

Routing dinamis dan nested routes, layout halaman dengan app/layout.tsx, serta pemanfaatan komponen Link, useRouter, dan usePathname.

---
layout: intro
badge: "MODUL 04"
badgeColor: "yellow"
---

## 04. State Management Dasar

Memahami cara menyimpan data sementara menggunakan useState, mengelola efek samping dengan useEffect, dan teknik lifting state antar komponen.

---
layout: intro
badge: "MODUL 05"
badgeColor: "green"
---

## 05. State Management Lanjutan

Mengelola data bersama (global state) di React menggunakan useContext agar data mudah digunakan di berbagai komponen tanpa oper props berulang kali.

---
layout: intro
badge: "MODUL 06"
badgeColor: "purple"
---

## 06. Mini Project: Aplikasi Todo Sederhana

Praktek langsung membangun aplikasi catatan tugas (Todo App) dari nol, menerapkan navigasi antar halaman, dan memberi styling rapi dengan Tailwind CSS.

---
layout: intro
badge: "MODUL 07"
badgeColor: "cyan"
---

## 07. Konsumsi API: Menampilkan Data (GET)

Mengambil data dari endpoint eksternal, menampilkan daftar data ke antarmuka, serta mengelola tampilan saat loading dan jika terjadi kendala error.

---
layout: intro
badge: "MODUL 08"
badgeColor: "pink"
---

## 08. Manipulasi Data (POST, PUT, DELETE)

Membuat form dengan validasi, mengirim data baru ke server backend, memperbarui dan menghapus data, serta menangani status respon HTTP secara tepat.

---
layout: intro
badge: "MODUL 09"
badgeColor: "yellow"
---

## 09. Form Input & Validasi

Pengelolaan form tingkat lanjut, memahami perbedaan Controlled vs Uncontrolled input, serta menambahkan validasi input agar data pengguna selalu akurat.

---
layout: intro
badge: "MODUL 10"
badgeColor: "green"
---

## 10. Penanganan Data Dinamis

Menampilkan data dalam format tabel atau kartu, membuat fitur pencarian data, filter kategori, pagination / infinite scroll, serta komponen empty state saat data kosong.

---
layout: intro
badge: "MODUL 11"
badgeColor: "purple"
---

## 11. Handoff UI/UX: Dari Figma ke Kode

Membaca spesifikasi desain di Figma secara teliti (jarak, warna, tipografi) dan menerjemahkannya ke dalam kode antarmuka menggunakan Tailwind CSS.

---
layout: intro
badge: "MODUL 12"
badgeColor: "cyan"
---

## 12. Integrasi Endpoint Backend & Autentikasi JWT

Menghubungkan aplikasi frontend ke layanan API tim backend nyata, serta menerapkan alur login dan proteksi halaman menggunakan token otentikasi (JWT).

---
layout: intro
badge: "MODUL 13"
badgeColor: "pink"
---

## 13. Mengenal Dokumentasi API (OpenAPI/Swagger)

Kemahiran membaca kontrak dan spesifikasi API dari dokumentasi Swagger/OpenAPI, serta berkolaborasi dengan lancar bersama tim developer backend.

---
layout: intro
badge: "MODUL 14"
badgeColor: "yellow"
---

## 14. Responsive Layout & Media Queries

Membangun tampilan website yang fleksibel, adaptif, dan tetap proporsional saat dibuka di layar HP, tablet, maupun layar laptop lebar.

---
layout: intro
badge: "MODUL 15"
badgeColor: "green"
---

## 15. Unit Testing untuk Client Component

Pengujian otomatis sederhana pada komponen klien untuk memastikan tombol, form, dan logika interaksi berjalan benar sebelum dirilis ke pengguna.

---
layout: intro
badge: "MODUL 16"
badgeColor: "purple"
---

## 16. Build & Deploy Website ke Vercel

Menyiapkan kompilasi akhir proyek (next build), mengunggah website ke platform Vercel secara mudah, serta tips pemantauan dan troubleshooting dasar setelah online.

---
layout: cover
badgeLeft: "✦ TERIMA KASIH"
badgeRight: "SIAP PRAKTEK"
---

# SEMANGAT BERKARYA!

Semua Programmer Handal Berawal dari Pemula. Mari Mulai Bikin Aplikasi Pertama Antum dengan Percaya Diri!

<div class="mt-6 flex justify-center gap-4">
  <span class="brutal-badge brutal-badge-yellow">TANYA JAWAB</span>
  <span class="brutal-badge brutal-badge-cyan">DISKUSI SANTAI</span>
  <span class="brutal-badge brutal-badge-pink">MULAI KODING</span>
</div>
