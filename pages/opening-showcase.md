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
