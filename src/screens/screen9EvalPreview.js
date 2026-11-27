/**
 * screen9EvalPreview.js - Layar 9: Evaluasi Mandiri, Tantangan Kode & Sertifikat Belajar
 * - Tantangan Python 3 Level diperbarui langsung tanpa me-reset halaman
 * - Kuis Evaluasi Akhir 10 Soal menggunakan Stepper Satu-per-Satu (nyaman di layar HP)
 * - Rekap Skor & Sertifikat Belajar terbarui otomatis secara real-time
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
  const levelCodes = SCREEN9_PREVIEW_DATA.codingLevels.map((l) => l.starter);
  const levelOutputs = SCREEN9_PREVIEW_DATA.codingLevels.map((l) => runPythonBranching(l.starter));

  function updateCodingChallengeDom() {
    const currentLvl = SCREEN9_PREVIEW_DATA.codingLevels[activeLevelIdx];
    const currentOut = levelOutputs[activeLevelIdx];

    container.querySelectorAll('[data-eval-lvl]').forEach((btn, i) => {
      const active = i === activeLevelIdx;
      btn.setAttribute('aria-selected', String(active));
      btn.className = `flex-1 min-w-[150px] min-h-[44px] px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
        active
          ? 'border-cobalt text-cobalt bg-surface'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`;
    });

    const titleEl = container.querySelector('#eval-lvl-title');
    const promptEl = container.querySelector('#eval-lvl-prompt');
    const editorEl = container.querySelector('#eval-code-editor');
    const outEl = container.querySelector('#eval-code-output');

    if (titleEl) titleEl.textContent = currentLvl.title;
    if (promptEl) promptEl.textContent = currentLvl.prompt;
    if (editorEl && editorEl.value !== levelCodes[activeLevelIdx]) {
      editorEl.value = levelCodes[activeLevelIdx];
    }
    if (outEl) {
      outEl.innerHTML = `
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
      `;
    }
  }

  function updateRecapAndCertificateDom() {
    const state = getState();
    const progress = getProgress();
    const studentName = state.profile.name || 'Peserta Didik (Isi Nama di Beranda)';
    const studentClass = state.profile.kelas || 'IX-D';

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

    const rKb1 = container.querySelector('#recap-kb1');
    const rKb2 = container.querySelector('#recap-kb2');
    const rEval = container.querySelector('#recap-eval');
    const rProg = container.querySelector('#recap-prog');
    const certName = container.querySelector('#cert-student-name');
    const certClass = container.querySelector('#cert-student-class');
    const certProg = container.querySelector('#cert-prog-label');

    if (rKb1) rKb1.textContent = kb1Pct;
    if (rKb2) rKb2.textContent = kb2Pct;
    if (rEval) rEval.textContent = evalPct;
    if (rProg) rProg.textContent = `${progress.percent}%`;
    if (certName) certName.textContent = studentName;
    if (certClass) certClass.textContent = `Kelas ${studentClass} · SMP Negeri 9 Samarinda`;
    if (certProg) certProg.innerHTML = `Progres Tercatat: <strong>${progress.percent}%</strong>`;
  }

  const initialState = getState();

  container.innerHTML = `
    <article class="screen-enter space-y-11 pb-12">
      <header class="pb-6 border-b border-line space-y-2">
        <p class="editorial-index">Penilaian Akhir &amp; Apresiasi Belajar</p>
        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">09</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Evaluasi Mandiri &amp; Sertifikat Belajar
          </h1>
        </div>
        <p class="prose-wb text-ink-muted text-base pt-1">
          Uji kemahiranmu melalui tantangan kode Python 3 level dan 10 soal evaluasi akhir bertahap, lalu simpan sertifikat hasil belajarmu di bagian bawah.
        </p>
      </header>

      <!-- 9.1 Latihan Kode Python Bertingkat -->
      <section class="space-y-3">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">9.1</span>Latihan Kode Python Bertingkat (Level 1 sampai 3)
        </h2>

        <div class="wb-stage overflow-hidden">
          <div class="flex flex-wrap border-b border-line bg-canvas" role="tablist" aria-label="Level latihan Python">
            ${SCREEN9_PREVIEW_DATA.codingLevels
              .map(
                (lvl, i) => `
                <button type="button" role="tab" data-eval-lvl="${i}">${lvl.label}</button>
              `
              )
              .join('')}
          </div>

          <div class="p-5 sm:p-6 space-y-3 bg-surface">
            <h3 id="eval-lvl-title" class="font-display font-bold text-lg text-ink"></h3>
            <p id="eval-lvl-prompt" class="text-sm text-ink-muted"></p>

            <label class="block">
              <span class="sr-only">Editor tantangan kode Python</span>
              <textarea
                id="eval-code-editor"
                rows="7"
                spellcheck="false"
                class="w-full font-mono text-xs sm:text-[13px] p-3.5 rounded-md bg-canvas border-[1.5px] border-line-strong text-ink leading-relaxed focus:bg-surface focus:border-cobalt resize-y"
              >${escapeHtml(levelCodes[0])}</textarea>
            </label>

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

            <div id="eval-code-output" class="rounded-md border border-line-strong bg-ink text-surface p-3.5 font-mono text-xs"></div>
          </div>
        </div>
      </section>

      <!-- 9.2 Kuis Evaluasi Akhir 10 Soal (Satu-per-Satu) -->
      <section class="space-y-3 pt-6 wb-rule">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">9.2</span>Kuis Evaluasi Akhir (10 Soal)
        </h2>

        <div id="eval-final-quiz-mount"></div>
      </section>

      <!-- 9.3 Rekap Skor & Sertifikat Belajar -->
      <section class="space-y-4 pt-6 wb-rule">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">9.3</span>Rekap Pencapaian &amp; Sertifikat Belajar
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div class="lg:col-span-5 flex flex-col justify-between space-y-4 border-t-2 border-line-strong pt-4">
            <dl class="divide-y divide-line text-sm tabular-nums">
              <div class="py-2.5 flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Kuis Formatif KB 1</dt>
                <dd id="recap-kb1" class="font-mono font-semibold text-ink"></dd>
              </div>
              <div class="py-2.5 flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Kuis Formatif KB 2</dt>
                <dd id="recap-kb2" class="font-mono font-semibold text-ink"></dd>
              </div>
              <div class="py-2.5 flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Evaluasi Akhir (10 Soal)</dt>
                <dd id="recap-eval" class="font-mono font-semibold text-ink"></dd>
              </div>
              <div class="py-2.5 flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Total Progres Modul</dt>
                <dd id="recap-prog" class="font-mono font-bold text-cobalt"></dd>
              </div>
            </dl>

            ${
              !initialState.profile.name
                ? `<button type="button" id="eval-fill-profile" class="wb-btn-secondary text-xs w-full">${icon('user', 15)} Isi Nama &amp; Kelas di Beranda</button>`
                : `<p class="text-xs text-emerald font-mono flex items-center gap-1.5">${icon('checkCircle', 15)} Identitas tercatat atas nama ${escapeHtml(initialState.profile.name)}</p>`
            }
          </div>

          <div class="lg:col-span-7 wb-stage p-5 sm:p-6 bg-surface flex flex-col justify-between">
            <div class="border-2 border-double border-line-strong rounded-sm p-5 sm:p-6 bg-canvas space-y-4 text-center">
              <div class="flex items-center justify-center gap-2 text-cobalt">
                ${icon('award', 22)}
                <span class="font-mono text-xs font-bold uppercase tracking-[0.16em]">Sertifikat Belajar</span>
              </div>

              <div>
                <p class="text-xs text-ink-muted uppercase tracking-widest font-mono">Diberikan Kepada</p>
                <p id="cert-student-name" class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-1"></p>
                <p id="cert-student-class" class="font-mono text-sm font-semibold text-cobalt mt-0.5"></p>
              </div>

              <p class="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                Telah menyelesaikan pembelajaran mandiri <strong>E-Modul Interaktif Percabangan</strong> Mata Pelajaran Koding dan Kecerdasan Artifisial (KKA) Kelas IX.
              </p>

              <div class="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                <span id="cert-prog-label" class="font-mono text-ink-muted tabular-nums"></span>
                <button type="button" id="cert-print-btn" class="wb-btn-secondary py-1.5 px-3 text-xs">
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
          <span>KB 4: Pohon Keputusan</span>
        </button>
        <button type="button" id="s9-home" class="wb-btn-primary">
          ${icon('grid', 16)}
          <span>Kembali ke Daftar Isi</span>
        </button>
      </nav>
    </article>
  `;

  updateCodingChallengeDom();
  updateRecapAndCertificateDom();

  mountFormativeQuiz(document.getElementById('eval-final-quiz-mount'), {
    quizId: 'eval-final-quiz',
    title: 'Kuis Evaluasi Akhir: Materi Percabangan (KB 1 - KB 4)',
    subtitle: '10 soal bertahap satu-per-satu. Batas ketuntasan KKM adalah 75%.',
    questions: SCREEN9_PREVIEW_DATA.finalQuizQuestions,
    savedAnswers: initialState.evalQuiz.quizAnswers,
    savedScore: initialState.evalQuiz.quizScore,
    onSubmit: (score, total, answers) => {
      saveEvalQuiz(score, total, answers);
      updateRecapAndCertificateDom();
      showToast(`Evaluasi akhir selesai. Skor kamu: ${score}/${total}.`);
    },
    onReset: () => {
      resetEvalQuiz();
      updateRecapAndCertificateDom();
      showToast('Evaluasi akhir diulang dari nomor 1.');
    },
  });

  const editorEl = container.querySelector('#eval-code-editor');
  editorEl?.addEventListener('input', (e) => {
    levelCodes[activeLevelIdx] = e.target.value;
  });

  container.querySelector('#eval-code-run')?.addEventListener('click', () => {
    levelCodes[activeLevelIdx] = editorEl?.value ?? levelCodes[activeLevelIdx];
    levelOutputs[activeLevelIdx] = runPythonBranching(levelCodes[activeLevelIdx]);
    updateCodingChallengeDom();
  });

  container.querySelector('#eval-code-reset')?.addEventListener('click', () => {
    const starter = SCREEN9_PREVIEW_DATA.codingLevels[activeLevelIdx].starter;
    levelCodes[activeLevelIdx] = starter;
    if (editorEl) editorEl.value = starter;
    levelOutputs[activeLevelIdx] = runPythonBranching(starter);
    updateCodingChallengeDom();
  });

  container.querySelectorAll('[data-eval-lvl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (editorEl) levelCodes[activeLevelIdx] = editorEl.value;
      activeLevelIdx = Number(btn.getAttribute('data-eval-lvl'));
      if (editorEl) editorEl.value = levelCodes[activeLevelIdx];
      updateCodingChallengeDom();
    });
  });

  document.getElementById('cert-print-btn')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('eval-fill-profile')?.addEventListener('click', () => navigate(1));
  document.getElementById('s9-prev')?.addEventListener('click', () => navigate(8));
  document.getElementById('s9-home')?.addEventListener('click', () => navigate(4));
}
