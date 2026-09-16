---
theme: none
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
<div class="relative w-[780px] h-[310px] mx-auto mt-16">

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
          href="https://dub.co"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#00E5FF] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>dub.co</span>
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
          Modul kurikulum terstruktur, pemutar materi video, pemantau progres belajar, kuis evaluasi, dan sertifikat kelulusan.
        </p>
      </div>
      <div class="pt-2 border-t-2 border-black/10">
        <a
          href="https://egghead.io"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FF6B8B] hover:text-white px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>egghead.io</span>
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
          href="https://cal.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FFA502] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>cal.com</span>
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
          Ruang diskusi tanya-jawab, sistem upvote jawaban bermanfaat, utas percakapan teratur, serta reputasi profil anggota.
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
          href="https://zapier.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-black font-black bg-white hover:bg-[#FFE600] px-3 py-1.5 rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_#000] text-xs"
          @click.stop
        >
          <span>zapier.com</span>
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

## BAGAIMANA TANGGA BELAJAR MENUJU NEXT.JS?

<p>
  Dari fondasi web hingga fullstack framework — alur bertahap yang semoga Allah mudahkan Antum dalam mempelajarinya.
</p>

<!-- Node-Edge Flow Container -->
<div class="flex items-stretch justify-between gap-2.5 mt-2">
  <!-- Node 1: HTML, CSS & JS -->
  <div v-click="1" class="flow-card flex-1 brutal-card bg-white p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#FFE600] px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        01. FONDASI
      </div>
      <div class="font-black text-sm text-black">HTML + CSS + JS</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Struktur halaman, estetika styling, dan logika manipulasi data di browser.
      </p>
      <a
        v-click="2"
        href="https://sandbox.hsi.id/learning"
        target="_blank"
        rel="noopener noreferrer"
        class="flow-card inline-flex items-center justify-center gap-1 w-full text-black !no-underline font-black bg-white hover:bg-[#FFE600] px-2 py-0.5 rounded-md border-2 border-black transition-all shadow-[1.5px_1.5px_0px_#000] text-[10px] mb-1.5"
        @click.stop
      >
        <span>sandbox.hsi.id/learning</span>
        <span class="text-[9px]">↗</span>
      </a>
    </div>
    <div class="pt-1.5 border-t border-dashed border-gray-300 text-[10px] font-bold text-gray-500">
      Wajib dipahami
    </div>
  </div>

  <!-- Edge 1 -->
  <div v-click="3" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 2: React.js -->
  <div v-click="3" class="flow-card flex-1 brutal-card bg-white p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#00E5FF] px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        02. UI LIBRARY
      </div>
      <div class="font-black text-sm text-black">React.js</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Berpikir berbasis komponen, manajemen state (useState), props, & reaktivitas.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-gray-300 text-[10px] font-bold text-gray-500">
      Fondasi komponen
    </div>
  </div>

  <!-- Edge 2 -->
  <div v-click="4" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 3: TypeScript -->
  <div v-click="4" class="flow-card flex-1 brutal-card bg-white p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-[#FF6B8B] text-white px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        03. TIPE DATA
      </div>
      <div class="font-black text-sm text-black">TypeScript</div>
      <p class="text-[11px] text-gray-700 mt-1 leading-snug">
        Keamanan tipe variabel, auto-complete cerdas, dan mencegah bug koding sejak awal.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-gray-300 text-[10px] font-bold text-[#FF6B8B]">
      *Opsional tapi dianjurkan
    </div>
  </div>

  <!-- Edge 3 -->
  <div v-click="5" class="flow-card flex items-center justify-center shrink-0">
    <div class="w-7 h-7 rounded-full border-2 border-black bg-[#FFE600] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
      ➔
    </div>
  </div>

  <!-- Node 4: Next.js -->
  <div v-click="5" class="flow-card flex-1 brutal-card bg-[#FFE600] p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
    <div>
      <div class="text-[10px] font-black uppercase tracking-wider bg-white text-black px-1.5 py-0.5 border border-black rounded inline-block mb-1.5">
        04. FRAMEWORK
      </div>
      <div class="font-black text-sm text-black">Next.js</div>
      <p class="text-[11px] text-gray-900 mt-1 leading-snug">
        Framework lengkap: Server Components, Routing otomatis, & siap rilis produksi.
      </p>
    </div>
    <div class="mt-2 pt-1.5 border-t border-dashed border-black/30 text-[10px] font-black text-black">
      🎯 Tujuan bootcamp kita
    </div>
  </div>
</div>

<!-- Bottom Strategy Box (Revealed on click 6) -->
<div v-click="6" class="flow-card mt-6 px-4 py-2 border-2 border-black rounded bg-white shadow-[3px_3px_0px_#000]">
  <div class="flex items-center gap-2 font-black text-xs text-black mb-1">
    <span class="bg-[#2ED573] text-black px-2 py-0.5 border border-black rounded text-xs uppercase font-black">
      💡 REALITAS BOOTCAMP 4 BULAN
    </span>
    <span>Jalur Pintas Pareto (80/20)</span>
  </div>
  <p class="text-xs text-gray-700 leading-snug">
    Belajar keempat tangga secara terpisah dari nol butuh waktu lebih dari setahun. Di bootcamp intensif ini, kita langsung fokus ke <b>Next.js</b> sambil menyerap intisari HTML, CSS, JS, dan React yang <b>benar-benar dipakai di 80% proyek nyata</b>!
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
src: ./pages/modul-01.md
---

---
src: ./pages/modul-02.md
---

---
src: ./pages/modul-03.md
---

---
src: ./pages/modul-04.md
---

---
src: ./pages/modul-05.md
---

---
src: ./pages/modul-06.md
---

---
src: ./pages/modul-07.md
---

---
src: ./pages/modul-08.md
---

---
src: ./pages/modul-09.md
---

---
src: ./pages/modul-10.md
---

---
src: ./pages/modul-11.md
---

---
src: ./pages/modul-12.md
---

---
src: ./pages/modul-13.md
---

---
src: ./pages/modul-14.md
---

---
src: ./pages/modul-15.md
---

---
src: ./pages/modul-16.md
---

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
