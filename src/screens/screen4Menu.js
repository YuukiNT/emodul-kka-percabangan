/**
 * screen4Menu.js - Layar 4: Daftar Isi & Progres Belajar (0%-100%)
 */

import { KB_SUMMARY_CARDS } from '../data/curriculum.js';
import { getKbStatus, getProgress, getState } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getStatusBadge(status) {
  if (status === 'Selesai') {
    return `<span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-emerald bg-emerald-soft text-ink inline-flex items-center gap-1">${icon('checkCircle', 13, 'text-emerald')} Selesai</span>`;
  }
  if (status === 'Sedang Dipelajari') {
    return `<span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-amber bg-amber-soft text-ink inline-flex items-center gap-1">${icon('play', 12, 'text-ink')} Sedang Dipelajari</span>`;
  }
  return `<span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-line bg-surface text-ink-muted">Belum Mulai</span>`;
}

export function renderScreen4Menu(container, { navigate, openGlossary, openNotes }) {
  const state = getState();
  const progress = getProgress();
  const { profile, kb1, kb2, evalQuiz } = state;

  const evalStatus =
    evalQuiz.quizScore !== null
      ? 'Selesai'
      : state.visitedScreens.includes(9)
      ? 'Sedang Dipelajari'
      : 'Belum Mulai';

  container.innerHTML = `
    <section class="screen-enter space-y-9 pb-10">
      <header class="pb-6 border-b-2 border-line-strong">
        <div class="flex items-center gap-3.5">
          <span class="chapter-numeral text-5xl sm:text-6xl">04</span>
          <div class="border-l-2 border-line-strong pl-3.5">
            <p class="editorial-index">Daftar Isi · Peta Progres</p>
            <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
              Menu Materi &amp; Progres Belajar
            </h1>
          </div>
        </div>
      </header>

      <!-- Bar Indikator Progres Belajar Dinamis (0%-100%) -->
      <section class="wb-sheet-framed p-5 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="editorial-index">Catatan Kemajuan · ${profile.name ? `${escapeHtml(profile.name)} (${escapeHtml(profile.kelas)})` : 'Peserta Didik'}</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Progres Belajar E-Modul
            </h2>
          </div>
          <div class="text-right">
            <span id="menu-progress-percent" class="font-display font-extrabold text-3xl sm:text-4xl text-cobalt">${progress.percent}%</span>
            <p class="font-mono text-[11px] text-ink-muted">${progress.completedCount} dari ${progress.totalMilestones} aktivitas tuntas</p>
          </div>
        </div>

        <div class="w-full h-3.5 bg-canvas border border-line-strong rounded-full overflow-hidden" role="progressbar" aria-valuenow="${progress.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Progres belajar keseluruhan">
          <div class="h-full bg-cobalt transition-all duration-300" style="width: ${progress.percent}%"></div>
        </div>

        <p class="text-xs text-ink-muted">
          Selesaikan seluruh simulasi, latihan kode, dan kuis di setiap kegiatan belajar untuk mencapai progres 100%.
        </p>
      </section>

      <!-- 4 Kartu Menu KB 1 sampai KB 4 -->
      <section class="space-y-4">
        <div>
          <p class="editorial-index">Materi Pokok</p>
          <h2 class="font-display font-bold text-xl text-ink mt-0.5">Pilih Kegiatan Belajar</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${KB_SUMMARY_CARDS.map((kb) => {
            const status = getKbStatus(kb.id);
            const scoreLine =
              kb.id === 'kb1' && kb1.quizScore !== null
                ? `Skor Kuis KB 1: ${kb1.quizScore}/${kb1.quizTotal} (${Math.round((kb1.quizScore / kb1.quizTotal) * 100)}%)`
                : kb.id === 'kb2' && kb2.quizScore !== null
                ? `Skor Kuis KB 2: ${kb2.quizScore}/${kb2.quizTotal} (${Math.round((kb2.quizScore / kb2.quizTotal) * 100)}%)`
                : kb.deliverable;

            return `
              <article class="wb-sheet p-5 flex flex-col justify-between gap-4 hover:border-line-strong transition-colors">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-mono text-xs font-bold text-cobalt uppercase tracking-wider">${kb.code} · ${kb.duration}</span>
                    ${getStatusBadge(status)}
                  </div>
                  <h3 class="font-display font-bold text-lg text-ink leading-snug">${kb.title}</h3>
                  <p class="text-sm text-ink-muted leading-relaxed">${kb.summary}</p>
                </div>

                <div class="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                  <span class="font-mono text-[11px] text-ink-muted">${scoreLine}</span>
                  <button type="button" data-menu-go="${kb.screenId}" class="wb-btn-primary py-1.5 px-3.5 text-xs">
                    <span>${status === 'Selesai' ? 'Pelajari Ulang' : 'Mulai Materi'}</span>
                    ${icon('arrowRight', 14)}
                  </button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Kartu Akses Evaluasi Mandiri & Panel Penunjang -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <article class="lg:col-span-7 wb-sheet p-5 flex flex-col justify-between gap-4 border-l-4 border-l-line-strong">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="editorial-index">Penilaian Akhir</span>
              ${getStatusBadge(evalStatus)}
            </div>
            <h3 class="font-display font-bold text-xl text-ink mt-1 flex items-center gap-2">
              ${icon('award', 20, 'text-cobalt')}
              <span>Evaluasi Mandiri, Latihan &amp; Sertifikat</span>
            </h3>
            <p class="text-sm text-ink-muted mt-1.5 leading-relaxed">
              Kerjakan latihan kode Python bertingkat (Level 1 sampai 3), kuis evaluasi akhir 10 soal, lalu lihat rekap nilai serta sertifikat belajarmu.
            </p>
          </div>
          <div>
            <button type="button" data-menu-go="9" class="wb-btn-secondary text-xs">
              <span>Buka Evaluasi Mandiri</span>
              ${icon('arrowRight', 14)}
            </button>
          </div>
        </article>

        <article class="lg:col-span-5 wb-sheet p-5 bg-canvas flex flex-col justify-between gap-4">
          <div>
            <span class="editorial-index">Alat Bantu Belajar</span>
            <h3 class="font-display font-bold text-lg text-ink mt-1">Kamus &amp; Buku Catatan</h3>
            <p class="text-sm text-ink-muted mt-1 leading-relaxed">
              Cari arti 18 istilah kunci atau simpan catatan pribadi belajarmu kapan saja, baik saat daring maupun luring.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" id="menu-open-glossary" class="wb-btn-secondary text-xs">
              ${icon('book', 15)}
              <span>Buka Kamus Istilah</span>
            </button>
            <button type="button" id="menu-open-notes" class="wb-btn-secondary text-xs">
              ${icon('notebook', 15)}
              <span>Buka Buku Catatan</span>
            </button>
          </div>
        </article>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s4-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Kembali: CP &amp; TP</span>
        </button>
        <button type="button" id="s4-next" class="wb-btn-primary">
          <span>Mulai KB 1: Logika &amp; Flowchart</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  container.querySelectorAll('[data-menu-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(Number(btn.getAttribute('data-menu-go'))));
  });
  document.getElementById('menu-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('menu-open-notes')?.addEventListener('click', () => openNotes());
  document.getElementById('s4-prev')?.addEventListener('click', () => navigate(3));
  document.getElementById('s4-next')?.addEventListener('click', () => navigate(5));
}
