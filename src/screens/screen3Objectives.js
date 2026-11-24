/**
 * screen3Objectives.js - Layar 3: Capaian & Tujuan Pembelajaran
 */

import { CAPAIAN_PEMBELAJARAN, MODULE_META, TUJUAN_PEMBELAJARAN } from '../data/curriculum.js';
import { icon } from '../components/icons.js';

export function renderScreen3Objectives(container, { navigate }) {
  container.innerHTML = `
    <section class="screen-enter space-y-10 pb-10">
      <header class="pb-6 border-b-2 border-line-strong">
        <div class="flex items-center gap-3.5">
          <span class="chapter-numeral text-5xl sm:text-6xl">03</span>
          <div class="border-l-2 border-line-strong pl-3.5">
            <p class="editorial-index">Orientasi · Acuan Kurikulum</p>
            <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
              Capaian &amp; Tujuan Pembelajaran
            </h1>
          </div>
        </div>
        <p class="prose-wb text-sm text-ink-muted mt-3">
          Seluruh materi dan latihan dalam e-modul ini disusun mengacu pada <strong>${MODULE_META.curriculumRef}</strong> untuk Mata Pelajaran Koding dan Kecerdasan Artifisial (KKA) SMP Kelas IX.
        </p>
      </header>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="editorial-index">Bagian A · CP KKA Fase D</p>
            <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
              Capaian Pembelajaran Berdasarkan Elemen
            </h2>
          </div>
          <span class="font-mono text-xs px-2.5 py-1 rounded border border-line bg-surface text-ink-muted hidden sm:inline-block">
            BSKAP No. 046/H/KR/2025
          </span>
        </div>

        <div class="divide-y divide-line border-t-2 border-b-2 border-line-strong bg-surface">
          ${CAPAIAN_PEMBELAJARAN.map(
            (cp) => `
            <article class="p-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
              <div class="md:col-span-4">
                <span class="font-mono text-xs font-bold text-cobalt tracking-wider uppercase">${cp.code}</span>
                <h3 class="font-display font-bold text-base sm:text-lg text-ink mt-0.5">${cp.element}</h3>
              </div>
              <div class="md:col-span-8">
                <p class="prose-wb text-sm sm:text-[15px] text-ink leading-relaxed">${cp.statement}</p>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <p class="editorial-index">Bagian B · Target per Kegiatan Belajar</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Tujuan Pembelajaran (KB 1 sampai KB 4)
          </h2>
        </div>

        <div class="space-y-5">
          ${TUJUAN_PEMBELAJARAN.map(
            (tp) => `
            <article class="wb-sheet p-5 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-line">
                <div class="flex flex-wrap items-baseline gap-2.5">
                  <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ink text-surface">${tp.kb}</span>
                  <h3 class="font-display font-bold text-lg text-ink">${tp.title}</h3>
                </div>
                <button type="button" data-tp-go="${tp.screenId}" class="text-xs font-semibold text-cobalt hover:underline inline-flex items-center gap-1 cursor-pointer">
                  <span>Buka ${tp.kb}</span>
                  ${icon('arrowRight', 13)}
                </button>
              </div>

              <ul class="space-y-2 text-sm text-ink">
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
            </article>
          `
          ).join('')}
        </div>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s3-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Kembali: Petunjuk</span>
        </button>
        <button type="button" id="s3-next" class="wb-btn-primary">
          <span>Lanjut: Daftar Isi &amp; Progres</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  container.querySelectorAll('[data-tp-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(Number(btn.getAttribute('data-tp-go'))));
  });
  document.getElementById('s3-prev')?.addEventListener('click', () => navigate(2));
  document.getElementById('s3-next')?.addEventListener('click', () => navigate(4));
}
