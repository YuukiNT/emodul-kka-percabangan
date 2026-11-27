/**
 * screen3Objectives.js - Layar 3: Capaian, Tujuan Pembelajaran & Daftar Pustaka
 * Mendahulukan bahasa ramah siswa ("Apa yang Bisa Kamu Lakukan?"), diikuti
 * tab Tujuan per KB, acuan resmi BSKAP No. 046/H/KR/2025, dan rujukan materi terverifikasi.
 */

import { CAPAIAN_PEMBELAJARAN, MODULE_META, TUJUAN_PEMBELAJARAN } from '../data/curriculum.js';
import { icon } from '../components/icons.js';

const STUDENT_OUTCOMES = [
  {
    num: '01',
    title: 'Membaca & Menguji Diagram Alir',
    desc: 'Mengubah masalah harian (seperti KKM atau cuaca) menjadi syarat Benar/Salah dan peta flowchart.',
  },
  {
    num: '02',
    title: 'Menyusun Blok Logika Tanpa Salah Ketik',
    desc: 'Merangkai blok puzzle satu syarat (if), dua syarat (if-else), hingga bertingkat (if-elif-else).',
  },
  {
    num: '03',
    title: 'Menulis Percabangan Python Pertamamu',
    desc: 'Menulis kode if-elif-else dengan titik dua (:) dan indentasi 4 spasi yang rapi.',
  },
  {
    num: '04',
    title: 'Memahami Cara Kerja Pohon Keputusan AI',
    desc: 'Melihat bagaimana aturan bercabang dipakai kecerdasan artifisial untuk memprediksi keputusan dari data.',
  },
];

const VERIFIED_REFERENCES = [
  {
    scope: 'Landasan CP & TP',
    citation:
      'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). (2025). Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025 tentang Capaian Pembelajaran pada PAUD, Jenjang Pendidikan Dasar, dan Pendidikan Menengah. Jakarta: Kementerian Pendidikan Dasar dan Menengah.',
    chapterDetail:
      'Bagian XXVIII: Capaian Pembelajaran Mata Pelajaran Koding dan Kecerdasan Artifisial Fase D (SMP/MTs Kelas VII-IX).',
  },
  {
    scope: 'KB 1 & KB 2',
    citation:
      'Natali, V., dkk. (2021) & Piantari, E., Erlangga, & Rosyidi, K. (2025). Informatika untuk SMP/MTs Kelas VIII & Kelas IX (Edisi Revisi). Jakarta: Pusat Perbukuan BSKAP Kemendikdasmen.',
    chapterDetail:
      'Bab 7 (Algoritma dan Pemrograman): materi diagram alir (flowchart), variabel, operator perbandingan, dan instruksi percabangan blok visual (Scratch & Blockly).',
  },
  {
    scope: 'KB 1 & KB 2',
    citation:
      'Munir, R., & Lidya, L. (2016). Algoritma dan Pemrograman dalam Bahasa Pascal, C, dan C++ (Edisi Keenam). Bandung: Penerbit Informatika.',
    chapterDetail:
      'Bab Pemilihan (Kondisional) & Notasi Flowchart: simbol standar diagram alir (terminator, input/output, proses, belah ketupat keputusan) serta analisis kasus pemilihan tunggal, ganda, dan bertingkat.',
  },
  {
    scope: 'KB 2 & KB 3',
    citation:
      'Python Software Foundation. (2025). Dokumentasi Resmi Python 3 Bahasa Indonesia: Lebih Banyak Alat Pengatur Aliran (docs.python.org/id/3/tutorial/controlflow.html) & PEP 8 Style Guide for Python Code.',
    chapterDetail:
      'Bab 4 Subbab 4.1 (Pernyataan if): aturan sintaks if, elif, else, penggunaan tanda titik dua (:), serta standar indentasi 4 spasi per blok.',
  },
  {
    scope: 'KB 1 & KB 3',
    citation:
      'Matthes, E. (2023). Python Crash Course: A Hands-On, Project-Based Introduction to Programming (3rd Edition). San Francisco: No Starch Press.',
    chapterDetail:
      'Chapter 5 (if Statements): pengujian kondisi Boolean (True/False), operator perbandingan (==, !=, <, <=, >, >=), struktur if-else, dan rantai if-elif-else.',
  },
  {
    scope: 'KB 4 (Pohon AI)',
    citation:
      'Mitchell, T. M. (1997). Machine Learning. New York: McGraw-Hill.',
    chapterDetail:
      'Chapter 3 (Decision Tree Learning, hlm. 52-78): konsep Root Node, Internal Node, Leaf Node, serta dataset klasik prediksi kegiatan olahraga berdasarkan atribut cuaca yang diadaptasi ke konteks sekolah.',
  },
];

export function renderScreen3Objectives(container, { navigate }) {
  let activeKbIdx = 0;

  function updateKbTabView() {
    const tp = TUJUAN_PEMBELAJARAN[activeKbIdx] || TUJUAN_PEMBELAJARAN[0];
    container.querySelectorAll('[data-tp-tab]').forEach((btn, i) => {
      const active = i === activeKbIdx;
      btn.setAttribute('aria-selected', String(active));
      btn.className = `flex-1 min-w-[90px] min-h-[42px] px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
        active
          ? 'border-cobalt text-cobalt bg-surface'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`;
    });

    const panel = container.querySelector('#tp-tab-panel');
    if (panel) {
      panel.innerHTML = `
        <div class="space-y-4 quiz-step-enter">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-display font-bold text-lg text-ink">${tp.kb} · ${tp.title}</h3>
            <button type="button" data-tp-go="${tp.screenId}" class="text-xs font-semibold text-cobalt hover:underline inline-flex items-center gap-1 cursor-pointer min-h-[34px]">
              <span>Buka Materi ${tp.kb}</span>
              ${icon('arrowRight', 13)}
            </button>
          </div>
          <ul class="space-y-2.5 text-sm text-ink">
            ${tp.items
              .map(
                (item) => `
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald mt-0.5 shrink-0">${icon('check', 16)}</span>
                  <span class="leading-relaxed">${item}</span>
                </li>
              `
              )
              .join('')}
          </ul>
        </div>
      `;
      panel.querySelector('[data-tp-go]')?.addEventListener('click', (e) => {
        navigate(Number(e.currentTarget.getAttribute('data-tp-go')));
      });
    }
  }

  container.innerHTML = `
    <section class="screen-enter space-y-11 pb-12">
      <header class="pb-6 border-b border-line space-y-2">
        <p class="editorial-index">Orientasi Belajar · ${MODULE_META.curriculumRef}</p>
        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">03</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Capaian &amp; Tujuan Pembelajaran
          </h1>
        </div>
      </header>

      <!-- Bagian Ramah Siswa SMP: 4 Kemampuan Konkret (Terbuka di Kanvas) -->
      <section class="space-y-5">
        <div class="space-y-1">
          <h2 class="font-display font-bold text-xl text-ink">
            Apa yang Bisa Kamu Lakukan Setelah Modul Ini?
          </h2>
          <p class="text-sm text-ink-muted">
            Empat bekal keterampilan yang akan kamu latih langkah demi langkah:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-1">
          ${STUDENT_OUTCOMES.map(
            (item) => `
            <div class="border-t border-line pt-3.5 space-y-1">
              <span class="font-mono text-xs font-bold text-cobalt tabular-nums">${item.num}</span>
              <h3 class="font-display font-bold text-base text-ink">${item.title}</h3>
              <p class="text-sm text-ink-muted leading-relaxed">${item.desc}</p>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Tujuan Spesifik per Kegiatan Belajar (Tab Ringkas Tanpa Scroll Panjang) -->
      <section class="space-y-3">
        <h2 class="font-display font-bold text-xl text-ink">
          Rincian Tujuan Pembelajaran per Bab
        </h2>

        <div class="wb-stage overflow-hidden">
          <div class="flex flex-wrap border-b border-line bg-canvas" role="tablist" aria-label="Pilih kegiatan belajar">
            ${TUJUAN_PEMBELAJARAN.map(
              (tp, idx) => `
                <button type="button" role="tab" data-tp-tab="${idx}">
                  ${tp.kb}
                </button>
              `
            ).join('')}
          </div>
          <div id="tp-tab-panel" class="p-5 sm:p-6 bg-surface"></div>
        </div>
      </section>

      <!-- Rumusan Resmi Capaian Pembelajaran (BSKAP No. 046/H/KR/2025) -->
      <section class="space-y-4 pt-2 border-t border-line">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="font-display font-bold text-lg sm:text-xl text-ink">
            Acuan Kurikulum: Capaian Pembelajaran KKA Fase D
          </h2>
          <span class="font-mono text-xs text-ink-muted">Keputusan Kepala BSKAP No. 046/H/KR/2025</span>
        </div>

        <div class="divide-y divide-line border-t border-b border-line">
          ${CAPAIAN_PEMBELAJARAN.map(
            (cp) => `
            <article class="py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
              <div class="md:col-span-4">
                <span class="font-mono text-[11px] font-semibold text-cobalt uppercase">${cp.code}</span>
                <h3 class="font-display font-bold text-base text-ink">${cp.element}</h3>
              </div>
              <div class="md:col-span-8">
                <p class="prose-wb text-sm text-ink-muted leading-relaxed">${cp.statement}</p>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </section>

      <!-- Daftar Pustaka & Rujukan Bab Materi Terverifikasi -->
      <section id="daftar-pustaka-section" class="space-y-4 pt-2 border-t border-line">
        <div class="space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="font-display font-bold text-lg sm:text-xl text-ink flex items-center gap-2">
              ${icon('book', 18, 'text-cobalt')}
              <span>Daftar Pustaka &amp; Sumber Materi</span>
            </h2>
            <span class="font-mono text-xs text-ink-muted">Rujukan Bab &amp; Dokumentasi Resmi</span>
          </div>
          <p class="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
            Konsep teori, simbol diagram alir, aturan sintaks Python, dan struktur pohon keputusan merujuk pada bab spesifik literatur di bawah ini, sedangkan studi kasus disesuaikan dengan keseharian siswa SMP.
          </p>
        </div>

        <ol class="divide-y divide-line border-t border-b border-line list-none m-0 p-0">
          ${VERIFIED_REFERENCES.map(
            (ref, idx) => `
            <li class="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
              <div class="md:col-span-3 flex md:flex-col items-baseline gap-2 md:gap-1">
                <span class="font-mono text-xs font-bold text-ink-muted tabular-nums">[0${idx + 1}]</span>
                <span class="font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-cobalt/40 bg-cobalt-soft text-cobalt">
                  ${ref.scope}
                </span>
              </div>
              <div class="md:col-span-9 space-y-1">
                <p class="text-sm text-ink leading-relaxed">${ref.citation}</p>
                <p class="text-xs text-ink-muted bg-surface border-l-2 border-line-strong pl-2.5 py-1">
                  <strong class="font-mono text-[11px] text-ink uppercase">Cakupan Bab:</strong>
                  ${ref.chapterDetail}
                </p>
              </div>
            </li>
          `
          ).join('')}
        </ol>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s3-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Petunjuk</span>
        </button>
        <button type="button" id="s3-next" class="wb-btn-primary">
          <span>Daftar Isi &amp; Mulai KB 1</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  updateKbTabView();

  container.querySelectorAll('[data-tp-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeKbIdx = Number(btn.getAttribute('data-tp-tab'));
      updateKbTabView();
    });
  });

  document.getElementById('s3-prev')?.addEventListener('click', () => navigate(2));
  document.getElementById('s3-next')?.addEventListener('click', () => navigate(4));
}
