/**
 * screen9EvalPreview.js - Layar 9: Evaluasi Mandiri, Latihan Kode, Rekap Skor & Sertifikat
 */

import { SCREEN9_PREVIEW_DATA } from '../data/previewData.js';
import { getProgress, getState, resetEvalQuiz, saveEvalQuiz } from '../storage/localStore.js';
import { runPythonBranching } from '../simulations/pythonLiteRunner.js';
import { mountFormativeQuiz } from '../components/formativeQuiz.js';
import { icon } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function renderScreen9EvalPreview(container, { navigate, showToast }) {
  let activeLevelIdx = 0;
  let firstRender = true;
  const levelCodes = SCREEN9_PREVIEW_DATA.codingLevels.map((l) => l.starter);
  const levelOutputs = SCREEN9_PREVIEW_DATA.codingLevels.map((l) => runPythonBranching(l.starter));

  function render() {
    const state = getState();
    const progress = getProgress();
    const studentName = state.profile.name || 'Peserta Didik (Isi Nama di Beranda)';
    const studentClass = state.profile.kelas || 'IX-D';
    const currentLvl = SCREEN9_PREVIEW_DATA.codingLevels[activeLevelIdx];
    const currentCode = levelCodes[activeLevelIdx];
    const currentOut = levelOutputs[activeLevelIdx];

    const kb1Pct =
      state.kb1.quizScore !== null
        ? `${Math.round((state.kb1.quizScore / state.kb1.quizTotal) * 100)}% (${state.kb1.quizScore}/${state.kb1.quizTotal})`
        : 'Belum dikerjakan';
    const kb2Pct =
      state.kb2.quizScore !== null
        ? `${Math.round((state.kb2.quizScore / state.kb2.quizTotal) * 100)}% (${state.kb2.quizScore}/${state.kb2.quizTotal})`
        : 'Belum dikerjakan';
    const evalPct =
      state.evalQuiz.quizScore !== null
        ? `${Math.round((state.evalQuiz.quizScore / state.evalQuiz.quizTotal) * 100)}% (${state.evalQuiz.quizScore}/${state.evalQuiz.quizTotal})`
        : 'Belum dikerjakan';

    const enterClass = firstRender ? 'screen-enter' : '';
    firstRender = false;

    container.innerHTML = `
      <article class="${enterClass} space-y-10 pb-10">
        <header class="pb-6 border-b-2 border-line-strong space-y-3">
          <div class="flex items-center gap-3.5">
            <span class="chapter-numeral text-5xl sm:text-6xl">09</span>
            <div class="border-l-2 border-line-strong pl-3.5">
              <p class="editorial-index">Penilaian Akhir</p>
              <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Evaluasi Mandiri &amp; Sertifikat Belajar
              </h1>
            </div>
          </div>
          <p class="prose-wb text-sm sm:text-[15.5px] text-ink-muted">
            Uji seluruh pemahamanmu dari KB 1 sampai KB 4 melalui latihan kode Python bertingkat dan 10 soal evaluasi akhir, lalu lihat rekap pencapaian beserta sertifikat belajarmu di bagian bawah.
          </p>
        </header>

        <!-- Bagian 1: Latihan Kode Python Bertingkat (Level 1-3) -->
        <section class="space-y-4">
          <div>
            <p class="editorial-index">Bagian 9.1 · Latihan Koding Mandiri</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Latihan Kode Python Bertingkat (Level 1 sampai 3)
            </h2>
          </div>

          <div class="wb-sheet overflow-hidden">
            <div class="flex flex-wrap border-b border-line bg-canvas" role="tablist" aria-label="Level latihan Python">
              ${SCREEN9_PREVIEW_DATA.codingLevels
                .map(
                  (lvl, i) => `
                  <button type="button" data-eval-lvl="${i}" class="flex-1 min-w-[160px] px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                    i === activeLevelIdx
                      ? 'border-cobalt text-cobalt bg-surface'
                      : 'border-transparent text-ink-muted hover:text-ink'
                  }">${lvl.label}</button>
                `
                )
                .join('')}
            </div>

            <div class="p-5 space-y-3 bg-surface">
              <h3 class="font-display font-bold text-lg text-ink">${currentLvl.title}</h3>
              <p class="text-sm text-ink-muted">${currentLvl.prompt}</p>

              <textarea
                id="eval-code-editor"
                rows="7"
                spellcheck="false"
                class="w-full font-mono text-xs sm:text-[13px] p-3.5 rounded-md bg-canvas border-[1.5px] border-line-strong text-ink leading-relaxed focus:bg-surface focus:border-cobalt resize-y"
              >${escapeHtml(currentCode)}</textarea>

              <div class="flex flex-wrap items-center justify-between gap-2">
                <button type="button" id="eval-code-reset" class="wb-btn-secondary py-1.5 px-3 text-xs">
                  ${icon('refresh', 14)}
                  <span>Reset Kode</span>
                </button>
                <button type="button" id="eval-code-run" class="wb-btn-primary py-1.5 px-3.5 text-xs">
                  ${icon('play', 14)}
                  <span>Jalankan &amp; Uji Kode</span>
                </button>
              </div>

              <div class="rounded-md border border-line-strong bg-ink text-surface p-3 font-mono text-xs">
                <div class="text-surface/65 text-[10.5px] pb-1 border-b border-surface/15">HASIL OUTPUT</div>
                ${
                  currentOut.ok
                    ? `<p class="mt-1.5 text-emerald-soft">${
                        currentOut.outputs.length > 0
                          ? currentOut.outputs.map((l) => '&gt;&gt;&gt; ' + escapeHtml(l)).join('<br/>')
                          : '&gt;&gt;&gt; (Tidak ada pesan yang dicetak)'
                      }</p>`
                    : `<p class="mt-1.5 text-coral-soft">&gt;&gt;&gt; ${escapeHtml(currentOut.error.code)}: ${escapeHtml(currentOut.error.title)} (${escapeHtml(currentOut.error.fix)})</p>`
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Bagian 2: Kuis Evaluasi Akhir (10 Soal) -->
        <section class="space-y-4 pt-4 wb-rule">
          <div>
            <p class="editorial-index">Bagian 9.2 · Evaluasi Sumatif</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Kuis Evaluasi Akhir (10 Soal)
            </h2>
          </div>

          <div id="eval-final-quiz-mount"></div>
        </section>

        <!-- Bagian 3: Rekap Skor & Sertifikat Belajar -->
        <section class="space-y-4 pt-4 wb-rule">
          <div>
            <p class="editorial-index">Bagian 9.3 · Rekap &amp; Sertifikat</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Rekap Skor &amp; Sertifikat Belajar
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div class="lg:col-span-5 wb-sheet p-5 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <p class="font-mono text-xs font-bold uppercase text-cobalt">Rekap Pencapaianmu</p>
                <dl class="divide-y divide-line text-sm">
                  <div class="py-2 flex items-center justify-between gap-2">
                    <dt class="text-ink-muted">Kuis Formatif KB 1</dt>
                    <dd class="font-mono font-semibold text-ink">${kb1Pct}</dd>
                  </div>
                  <div class="py-2 flex items-center justify-between gap-2">
                    <dt class="text-ink-muted">Kuis Formatif KB 2</dt>
                    <dd class="font-mono font-semibold text-ink">${kb2Pct}</dd>
                  </div>
                  <div class="py-2 flex items-center justify-between gap-2">
                    <dt class="text-ink-muted">Evaluasi Akhir (10 Soal)</dt>
                    <dd class="font-mono font-semibold text-ink">${evalPct}</dd>
                  </div>
                  <div class="py-2 flex items-center justify-between gap-2">
                    <dt class="text-ink-muted">Progres E-Modul</dt>
                    <dd class="font-mono font-bold text-cobalt">${progress.percent}%</dd>
                  </div>
                </dl>
              </div>

              ${
                !state.profile.name
                  ? `<button type="button" id="eval-fill-profile" class="wb-btn-secondary text-xs w-full">${icon('user', 15)} Lengkapi Nama &amp; Kelas di Beranda</button>`
                  : `<p class="text-xs text-emerald font-mono flex items-center gap-1.5">${icon('checkCircle', 15)} Profil tersimpan atas nama ${escapeHtml(state.profile.name)}</p>`
              }
            </div>

            <div class="lg:col-span-7 wb-sheet-framed p-6 bg-surface relative overflow-hidden flex flex-col justify-between">
              <div class="border-2 border-double border-line-strong rounded-sm p-5 sm:p-6 bg-canvas space-y-4 text-center">
                <div class="flex items-center justify-center gap-2 text-cobalt">
                  ${icon('award', 24)}
                  <span class="font-mono text-xs font-bold uppercase tracking-[0.18em]">Sertifikat Belajar</span>
                </div>

                <div>
                  <p class="text-xs text-ink-muted uppercase tracking-widest font-mono">Diberikan Kepada</p>
                  <p id="cert-student-name" class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-1">
                    ${escapeHtml(studentName)}
                  </p>
                  <p id="cert-student-class" class="font-mono text-sm font-semibold text-cobalt mt-0.5">
                    Kelas ${escapeHtml(studentClass)} · SMP Negeri 9 Samarinda
                  </p>
                </div>

                <p class="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                  Telah mengikuti pembelajaran <strong>E-Modul Interaktif Percabangan</strong> Mata Pelajaran Koding dan Kecerdasan Artifisial (KKA) Kelas IX.
                </p>

                <div class="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span class="font-mono text-ink-muted">Progres Tercatat: <strong>${progress.percent}%</strong></span>
                  <button type="button" id="cert-print-btn" class="wb-btn-secondary py-1 px-3 text-xs">
                    ${icon('download', 14)}
                    <span>Cetak / Simpan PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <button type="button" id="s9-prev" class="wb-btn-secondary">
            ${icon('arrowLeft', 16)}
            <span>Kembali: KB 4 Pohon Keputusan</span>
          </button>
          <button type="button" id="s9-home" class="wb-btn-primary">
            ${icon('grid', 16)}
            <span>Kembali ke Daftar Isi</span>
          </button>
        </nav>
      </article>
    `;

    // Mount Kuis Evaluasi Akhir (10 Soal)
    mountFormativeQuiz(document.getElementById('eval-final-quiz-mount'), {
      quizId: 'eval-final-quiz',
      title: 'Kuis Evaluasi Akhir: Materi Percabangan (KB 1 - KB 4)',
      subtitle: 'Kerjakan 10 soal pilihan ganda berikut. Batas ketuntasan KKM adalah 75%.',
      questions: SCREEN9_PREVIEW_DATA.finalQuizQuestions,
      savedAnswers: state.evalQuiz.quizAnswers,
      savedScore: state.evalQuiz.quizScore,
      onSubmit: (score, total, answers) => {
        saveEvalQuiz(score, total, answers);
        showToast(`Evaluasi akhir selesai. Skor kamu: ${score}/${total}.`);
        render();
      },
      onReset: () => {
        resetEvalQuiz();
        showToast('Evaluasi akhir direset. Silakan kerjakan kembali.');
        render();
      },
    });

    const editorEl = document.getElementById('eval-code-editor');
    editorEl?.addEventListener('input', (e) => {
      levelCodes[activeLevelIdx] = e.target.value;
    });

    document.getElementById('eval-code-run')?.addEventListener('click', () => {
      levelCodes[activeLevelIdx] = editorEl?.value ?? levelCodes[activeLevelIdx];
      levelOutputs[activeLevelIdx] = runPythonBranching(levelCodes[activeLevelIdx]);
      render();
    });

    document.getElementById('eval-code-reset')?.addEventListener('click', () => {
      levelCodes[activeLevelIdx] = currentLvl.starter;
      levelOutputs[activeLevelIdx] = runPythonBranching(currentLvl.starter);
      render();
    });

    container.querySelectorAll('[data-eval-lvl]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLevelIdx = Number(btn.getAttribute('data-eval-lvl'));
        render();
      });
    });

    document.getElementById('cert-print-btn')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('eval-fill-profile')?.addEventListener('click', () => navigate(1));
    document.getElementById('s9-prev')?.addEventListener('click', () => navigate(8));
    document.getElementById('s9-home')?.addEventListener('click', () => navigate(4));
  }

  render();
}
