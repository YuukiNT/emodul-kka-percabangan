/**
 * screen4Menu.js - Layar 4: Peta Belajar & Progres (0%-100%)
 * Jalur belajar bernomor bergaya buku kerja dengan tombol lanjut pintar.
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

function getStatusPill(status) {
  if (status === 'Selesai') {
    return `<span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-emerald bg-emerald-soft text-ink inline-flex items-center gap-1">${icon('checkCircle', 13, 'text-emerald')} Selesai</span>`;
  }
  if (status === 'Sedang Dipelajari') {
    return `<span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-amber bg-amber-soft text-ink inline-flex items-center gap-1">${icon('play', 11, 'text-ink')} Sedang Dipelajari</span>`;
  }
  return `<span class="font-mono text-[11px] text-ink-muted">Belum Mulai</span>`;
}

function findRecommendedStep(state) {
  const m = state.milestones;
  if (!m.kb1SimTested || !m.kb1QuizDone) return { screenId: 5, label: 'Mulai KB 1: Flowchart' };
  if (!m.kb2SimSolved || !m.kb2QuizDone) return { screenId: 6, label: 'Lanjut KB 2: Blok Visual' };
  if (!m.kb3CodeTested) return { screenId: 7, label: 'Lanjut KB 3: Kode Python' };
  if (!m.kb4TreeTested) return { screenId: 8, label: 'Lanjut KB 4: Pohon Keputusan' };
  if (!m.evalDone) return { screenId: 9, label: 'Kerjakan Evaluasi Mandiri' };
  return { screenId: 9, label: 'Lihat Sertifikat Belajar' };
}

export function renderScreen4Menu(container, { navigate, openGlossary, openNotes }) {
  const state = getState();
  const progress = getProgress();
  const { profile, kb1, kb2, evalQuiz } = state;
  const recommended = findRecommendedStep(state);

  const evalStatus =
    evalQuiz.quizScore !== null
      ? 'Selesai'
      : state.visitedScreens.includes(9)
      ? 'Sedang Dipelajari'
      : 'Belum Mulai';

  container.innerHTML = `
    <section class="screen-enter space-y-10 pb-12">
      <header class="pb-6 border-b border-line space-y-2">
        <p class="editorial-index">Daftar Isi &amp; Peta Kemajuan · ${profile.name ? `${escapeHtml(profile.name)} (${escapeHtml(profile.kelas)})` : 'Kelas IX'}</p>
        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">04</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Peta Materi &amp; Progres Belajar
          </h1>
        </div>
      </header>

      <!-- Panggung Ringkas Progres + Aksi Lanjut Cepat -->
      <section class="wb-stage p-5 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-baseline gap-3">
              <span id="menu-progress-percent" class="font-display font-extrabold text-3xl sm:text-4xl text-cobalt tabular-nums">${progress.percent}%</span>
              <span class="font-mono text-xs text-ink-muted tabular-nums">(${progress.completedCount} dari ${progress.totalMilestones} tahapan selesai)</span>
            </div>
            <p class="text-xs sm:text-sm text-ink-muted">
              Coba setiap simulasi dan selesaikan latihan soal bertahap untuk menuntaskan modul.
            </p>
          </div>

          <button type="button" id="menu-recommended-btn" class="wb-btn-primary">
            <span>${escapeHtml(recommended.label)}</span>
            ${icon('arrowRight', 16)}
          </button>
        </div>

        <div class="w-full h-3 bg-canvas border border-line-strong rounded-full overflow-hidden" role="progressbar" aria-valuenow="${progress.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Progres belajar keseluruhan">
          <div class="h-full bg-cobalt transition-all duration-300" style="width: ${progress.percent}%"></div>
        </div>
      </section>

      <!-- Jalur 4 Kegiatan Belajar + Evaluasi (Editorial Track Rapi, Bukan Bento Box) -->
      <section class="space-y-2">
        <h2 class="font-display font-bold text-xl text-ink pb-2">
          Urutan Kegiatan Belajar
        </h2>

        <div class="divide-y divide-line border-t border-b border-line-strong">
          ${KB_SUMMARY_CARDS.map((kb, idx) => {
            const status = getKbStatus(kb.id);
            const scoreLine =
              kb.id === 'kb1' && kb1.quizScore !== null
                ? `Skor Kuis: ${kb1.quizScore}/${kb1.quizTotal} (${Math.round((kb1.quizScore / kb1.quizTotal) * 100)}%)`
                : kb.id === 'kb2' && kb2.quizScore !== null
                ? `Skor Kuis: ${kb2.quizScore}/${kb2.quizTotal} (${Math.round((kb2.quizScore / kb2.quizTotal) * 100)}%)`
                : kb.deliverable;

            return `
              <article class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-4 max-w-2xl">
                  <span class="font-display font-extrabold text-2xl text-cobalt/85 tabular-nums w-8 shrink-0 pt-0.5">0${idx + 1}</span>
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <span class="font-mono text-xs font-bold text-ink">${kb.code} · ${kb.duration}</span>
                      ${getStatusPill(status)}
                    </div>
                    <h3 class="font-display font-bold text-lg text-ink leading-snug">${kb.title}</h3>
                    <p class="text-sm text-ink-muted leading-relaxed">${kb.summary}</p>
                    <p class="font-mono text-[11px] text-ink-muted tabular-nums pt-0.5">${scoreLine}</p>
                  </div>
                </div>

                <div class="sm:shrink-0 pl-12 sm:pl-0">
                  <button type="button" data-menu-go="${kb.screenId}" class="${status === 'Selesai' ? 'wb-btn-secondary' : 'wb-btn-primary'} text-xs">
                    <span>${status === 'Selesai' ? 'Tinjau Ulang' : 'Buka Materi'}</span>
                    ${icon('arrowRight', 14)}
                  </button>
                </div>
              </article>
            `;
          }).join('')}

          <!-- Baris 05: Evaluasi Mandiri & Sertifikat -->
          <article class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-4 max-w-2xl">
              <span class="font-display font-extrabold text-2xl text-ink/75 tabular-nums w-8 shrink-0 pt-0.5">05</span>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="font-mono text-xs font-bold text-ink">Penilaian Akhir</span>
                  ${getStatusPill(evalStatus)}
                </div>
                <h3 class="font-display font-bold text-lg text-ink leading-snug">Evaluasi Mandiri, Latihan Bertingkat &amp; Sertifikat</h3>
                <p class="text-sm text-ink-muted leading-relaxed">
                  Tantangan kode Python 3 level, evaluasi akhir 10 soal satu-per-satu, serta cetak sertifikat hasil belajarmu.
                </p>
                ${
                  evalQuiz.quizScore !== null
                    ? `<p class="font-mono text-[11px] text-emerald font-semibold tabular-nums pt-0.5">Skor Evaluasi: ${evalQuiz.quizScore}/${evalQuiz.quizTotal} (${Math.round((evalQuiz.quizScore / evalQuiz.quizTotal) * 100)}%)</p>`
                    : ''
                }
              </div>
            </div>

            <div class="sm:shrink-0 pl-12 sm:pl-0">
              <button type="button" data-menu-go="9" class="wb-btn-secondary text-xs">
                <span>Buka Evaluasi</span>
                ${icon('arrowRight', 14)}
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Baris Alat Bantu Ringkas -->
      <section class="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm text-ink-muted">
        <span>Butuh menghafal istilah atau mencatat rumus penting?</span>
        <div class="flex flex-wrap gap-2">
          <button type="button" id="menu-open-glossary" class="wb-btn-ghost border border-line text-xs">
            ${icon('book', 15, 'text-cobalt')}
            <span>Kamus Istilah</span>
          </button>
          <button type="button" id="menu-open-flashcards" class="wb-btn-ghost border border-line text-xs">
            ${icon('layers', 15, 'text-cobalt')}
            <span>Kartu Hafalan</span>
          </button>
          <button type="button" id="menu-open-notes" class="wb-btn-ghost border border-line text-xs">
            ${icon('notebook', 15, 'text-cobalt')}
            <span>Buku Catatan</span>
          </button>
        </div>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s4-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>CP &amp; TP</span>
        </button>
        <button type="button" id="s4-next" class="wb-btn-primary">
          <span>Mulai KB 1: Flowchart</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  document.getElementById('menu-recommended-btn')?.addEventListener('click', () => {
    navigate(recommended.screenId);
  });
  container.querySelectorAll('[data-menu-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(Number(btn.getAttribute('data-menu-go'))));
  });
  document.getElementById('menu-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('menu-open-flashcards')?.addEventListener('click', () => openGlossary('', 'flashcard'));
  document.getElementById('menu-open-notes')?.addEventListener('click', () => openNotes());
  document.getElementById('s4-prev')?.addEventListener('click', () => navigate(3));
  document.getElementById('s4-next')?.addEventListener('click', () => navigate(5));
}
