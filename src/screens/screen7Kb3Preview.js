/**
 * screen7Kb3Preview.js - Layar 7: KB 3 (Transisi ke Kode Python if-elif-else)
 * - Peta Interaktif 1-ke-1 Blok Visual <-> Baris Python (ketuk baris untuk melihat bedah sintaks)
 * - Editor Kode Python Luring tanpa kedip DOM (posisi kursor ketik tetap terjaga)
 */

import { KB3_PREVIEW_DATA } from '../data/previewData.js';
import { runPythonBranching } from '../simulations/pythonLiteRunner.js';
import { markKb3CodeTested } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const SYNTAX_PAIRS = [
  {
    blockClass: 'puzzle-block--if',
    indent: false,
    blockText: 'JIKA  nilai >= 90  :',
    pyHtml: '<strong class="text-cobalt">if</strong> nilai &gt;= 90<strong class="text-coral">:</strong>',
    note: 'Kata JIKA ditulis huruf kecil "if", lalu wajib ditutup tanda titik dua (:) sebagai penanda dimulainya cabang.',
  },
  {
    blockClass: 'puzzle-block--action-true',
    indent: true,
    blockText: 'CETAK  "Predikat A (Sangat Baik)"',
    pyHtml: '<span class="text-ink-muted/70">····</span>print("Predikat A (Sangat Baik)")',
    note: 'Menjorok 4 spasi (indentasi) agar Python tahu perintah print(...) ini hanya jalan saat if di atasnya bernilai True.',
  },
  {
    blockClass: 'puzzle-block--elif',
    indent: false,
    blockText: 'ATAU JIKA  nilai >= 75  :',
    pyHtml: '<strong class="text-ink">elif</strong> nilai &gt;= 75<strong class="text-coral">:</strong>',
    note: '"elif" adalah singkatan else if (atau jika). Ditulis rata kiri sejajar dengan if dan diakhiri titik dua (:).',
  },
  {
    blockClass: 'puzzle-block--action-amber',
    indent: true,
    blockText: 'CETAK  "Predikat B (Baik - Tuntas KKM)"',
    pyHtml: '<span class="text-ink-muted/70">····</span>print("Predikat B (Baik - Tuntas KKM)")',
    note: 'Menjorok 4 spasi di bawah elif: hanya dijalankan apabila if gagal tetapi syarat elif >= 75 terpenuhi.',
  },
  {
    blockClass: 'puzzle-block--else',
    indent: false,
    blockText: 'SELAIN ITU  :',
    pyHtml: '<strong class="text-coral">else:</strong>',
    note: 'Cabang cadangan terakhir. Perhatikan: "else:" TIDAK boleh diberi syarat angka lagi, langsung diikuti titik dua (:).',
  },
  {
    blockClass: 'puzzle-block--action-false',
    indent: true,
    blockText: 'CETAK  "Predikat C (Perlu Bimbingan)"',
    pyHtml: '<span class="text-ink-muted/70">····</span>print("Predikat C (Perlu Bimbingan)")',
    note: 'Menjorok 4 spasi di bawah else: otomatis dijalankan jika semua syarat di atasnya bernilai False.',
  },
];

export function renderScreen7Kb3Preview(container, { navigate, openGlossary, openNotes, showToast }) {
  let editorCode = KB3_PREVIEW_DATA.sampleCode;
  let runResult = { ok: true, outputs: [KB3_PREVIEW_DATA.sampleOutput], error: null };
  let activePairIdx = 0;

  function updatePairInspector() {
    container.querySelectorAll('[data-map-block]').forEach((el, idx) => {
      el.classList.toggle('is-executing', idx === activePairIdx);
    });
    container.querySelectorAll('[data-map-py]').forEach((el, idx) => {
      el.classList.toggle('py-line-executing', idx === activePairIdx);
    });
    const noteEl = container.querySelector('#kb3-pair-note');
    if (noteEl) {
      noteEl.innerHTML = `<strong class="font-mono text-xs text-cobalt">Baris ${activePairIdx + 1}:</strong> ${escapeHtml(SYNTAX_PAIRS[activePairIdx].note)}`;
    }
  }

  function updateConsoleAndErrorDom() {
    const consoleEl = container.querySelector('#kb3-output-console');
    const errorEl = container.querySelector('#kb3-error-status-box');

    if (consoleEl) {
      consoleEl.innerHTML = `
        <div class="flex items-center justify-between text-surface/65 pb-1.5 border-b border-surface/15 text-[11px]">
          <span>OUTPUT PROGRAM</span>
          <span>${runResult.ok ? 'Berhasil dijalankan' : 'Ditemukan kesalahan'}</span>
        </div>
        ${
          runResult.ok
            ? `<p class="mt-2 text-emerald-soft whitespace-pre-line">${
                runResult.outputs.length > 0
                  ? runResult.outputs.map((l) => '&gt;&gt;&gt; ' + escapeHtml(l)).join('\n')
                  : '&gt;&gt;&gt; (Tidak ada teks yang dicetak)'
              }</p>`
            : `<p class="mt-2 text-coral-soft">&gt;&gt;&gt; ${escapeHtml(runResult.error.code)}: ${escapeHtml(runResult.error.title)}</p>`
        }
      `;
    }

    if (errorEl) {
      errorEl.innerHTML =
        !runResult.ok && runResult.error
          ? `
            <div id="kb3-active-error" class="wb-callout-coral space-y-1 quiz-step-enter">
              <span class="font-mono text-[11px] font-bold uppercase text-coral">${escapeHtml(runResult.error.code)}</span>
              <p class="font-display font-bold text-sm text-ink">${escapeHtml(runResult.error.title)}</p>
              <p class="text-xs text-ink-muted">Penyebab: ${escapeHtml(runResult.error.cause)}</p>
              <p class="text-xs text-ink font-medium pt-0.5">Perbaikan: ${escapeHtml(runResult.error.fix)}</p>
            </div>
          `
          : `
            <div class="wb-callout-emerald text-xs text-ink">
              <p class="font-bold">Tidak ada kesalahan sintaks.</p>
              <p class="mt-0.5 text-ink-muted">Dua kesalahan yang paling sering dialami pemula saat mengetik Python:</p>
            </div>
          `;
    }
  }

  container.innerHTML = `
    <article class="screen-enter space-y-11 pb-12">
      <header class="pb-6 border-b border-line space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="editorial-index">Kegiatan Belajar 3 · Estimasi 45 Menit</p>
          <div class="flex items-center gap-1.5">
            <button type="button" id="kb3-open-glossary" class="wb-btn-ghost text-xs border border-line">
              ${icon('book', 14, 'text-cobalt')}
              <span>Kamus</span>
            </button>
            <button type="button" id="kb3-open-notes" class="wb-btn-ghost text-xs border border-line">
              ${icon('notebook', 14, 'text-cobalt')}
              <span>Catat Poin</span>
            </button>
          </div>
        </div>

        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">07</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Transisi ke Kode Python (<code class="font-mono text-cobalt">if-elif-else</code>)
          </h1>
        </div>

        <p class="prose-wb text-ink-muted text-base">
          Setelah mahir menyusun blok di KB 2, menulis kode teks <strong>Python</strong> sebenarnya tinggal mengganti bentuk kepingan blok menjadi dua aturan ketik: tanda titik dua (<code class="font-mono font-bold text-ink">:</code>) di ujung syarat dan jarak <strong>4 spasi (indentasi)</strong>.
        </p>
      </header>

      <!-- 7.1 Peta Interaktif Blok ke Baris Python -->
      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">7.1</span>Ketuk Baris untuk Membedah Terjemahan Blok ke Python
          </h2>
          <p class="text-sm text-ink-muted">
            Klik salah satu blok di kiri (atau baris kode di kanan) untuk melihat aturan penulisannya:
          </p>
        </div>

        <div class="wb-stage p-5 space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <div class="bg-canvas p-4 rounded-md border border-line space-y-1.5" style="--puzzle-cutout-bg: var(--color-canvas);">
              ${SYNTAX_PAIRS.map(
                (pair, idx) => `
                <button
                  type="button"
                  data-map-block="${idx}"
                  class="w-full text-left puzzle-block ${pair.blockClass} ${pair.indent ? 'puzzle-block--indent' : ''} !text-xs sm:!text-[13px] cursor-pointer"
                >
                  <span>${escapeHtml(pair.blockText)}</span>
                </button>
              `
              ).join('')}
            </div>

            <div class="rounded-md border border-line-strong bg-canvas overflow-x-auto font-mono text-xs sm:text-[13px] divide-y divide-line/60">
              ${SYNTAX_PAIRS.map(
                (pair, idx) => `
                <button
                  type="button"
                  data-map-py="${idx}"
                  class="w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer"
                >
                  <span class="w-4 text-right text-ink-muted tabular-nums select-none">${idx + 1}</span>
                  <span>${pair.pyHtml}</span>
                </button>
              `
              ).join('')}
            </div>
          </div>

          <div id="kb3-pair-note" class="wb-callout-cobalt text-sm text-ink"></div>
        </div>
      </section>

      <!-- 7.2 Editor Kode Python Luring -->
      <section class="space-y-4 pt-6 wb-rule">
        <div class="space-y-1">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">7.2</span>Coba Ketik &amp; Jalankan Kode Python Sendiri
          </h2>
          <p class="prose-wb text-sm text-ink-muted">
            Ubah angka <code class="font-mono text-ink">nilai = 84</code> lalu tekan <strong>Jalankan Kode</strong>. Coba juga tombol <strong>Tes Error (Lupa :)</strong> untuk melihat bagaimana komputer memberi petunjuk perbaikan.
          </p>
        </div>

        <div class="wb-stage overflow-hidden">
          <div class="px-4 py-3 bg-canvas border-b border-line-strong flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 font-mono text-xs font-semibold text-ink">
              ${icon('terminal', 16, 'text-cobalt')}
              <span>latihan_percabangan.py</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" id="kb3-reset-code" class="wb-btn-secondary py-1.5 px-3 text-xs">
                ${icon('refresh', 14)}
                <span>Reset Contoh</span>
              </button>
              <button type="button" id="kb3-run-code" class="wb-btn-primary py-1.5 px-3.5 text-xs">
                ${icon('play', 14)}
                <span>Jalankan Kode</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12">
            <div class="lg:col-span-7 p-4 bg-surface border-b lg:border-b-0 lg:border-r border-line space-y-3">
              <div class="flex flex-wrap items-center gap-1.5 text-xs">
                <span class="font-mono text-[11px] text-ink-muted mr-1">Uji cepat:</span>
                <button type="button" data-kb3-preset="95" class="min-h-[34px] font-mono tabular-nums px-2.5 py-1 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 95</button>
                <button type="button" data-kb3-preset="84" class="min-h-[34px] font-mono tabular-nums px-2.5 py-1 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 84</button>
                <button type="button" data-kb3-preset="60" class="min-h-[34px] font-mono tabular-nums px-2.5 py-1 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 60</button>
                <button type="button" id="kb3-demo-error" class="min-h-[34px] font-mono px-2.5 py-1 rounded border border-coral/60 bg-coral-soft/60 text-ink hover:border-coral cursor-pointer">Tes Error (Lupa :)</button>
              </div>

              <label class="block">
                <span class="sr-only">Editor kode Python</span>
                <textarea
                  id="kb3-code-editor"
                  rows="9"
                  spellcheck="false"
                  class="w-full p-3.5 rounded-md border-[1.5px] border-line-strong bg-canvas font-mono text-xs sm:text-[13px] text-ink leading-relaxed focus:bg-surface focus:border-cobalt resize-y"
                >${escapeHtml(editorCode)}</textarea>
              </label>

              <div id="kb3-output-console" class="rounded-md border border-line-strong bg-ink text-surface p-3.5 font-mono text-xs"></div>
            </div>

            <div class="lg:col-span-5 p-4 bg-canvas space-y-3">
              <div class="flex items-center gap-1.5">
                ${icon('alert', 16, 'text-coral')}
                <h3 class="font-display font-bold text-base text-ink">Petunjuk Kesalahan (Error Hint)</h3>
              </div>

              <div id="kb3-error-status-box"></div>

              <div class="space-y-3 pt-1">
                ${KB3_PREVIEW_DATA.errorHintsPreview
                  .map(
                    (eh) => `
                    <div class="border-l-2 border-coral pl-3 py-1 space-y-0.5">
                      <span class="font-mono text-[11px] font-bold text-coral">${eh.code}</span>
                      <p class="font-display font-bold text-sm text-ink">${eh.title}</p>
                      <p class="text-xs text-ink-muted">${eh.cause}</p>
                      <p class="text-xs text-ink font-medium">Solusi: <code class="font-mono bg-surface px-1 py-0.5 rounded border border-line">${eh.fix}</code></p>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s7-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>KB 2: Blok Visual</span>
        </button>
        <button type="button" id="s7-next" class="wb-btn-primary">
          <span>Lanjut ke KB 4: Pohon Keputusan AI</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  updatePairInspector();
  updateConsoleAndErrorDom();

  container.querySelectorAll('[data-map-block], [data-map-py]').forEach((el) => {
    el.addEventListener('click', () => {
      activePairIdx = Number(el.getAttribute('data-map-block') ?? el.getAttribute('data-map-py'));
      updatePairInspector();
    });
  });

  const textarea = container.querySelector('#kb3-code-editor');

  container.querySelector('#kb3-run-code')?.addEventListener('click', () => {
    editorCode = textarea?.value ?? editorCode;
    runResult = runPythonBranching(editorCode);
    markKb3CodeTested();
    updateConsoleAndErrorDom();
    if (runResult.ok) {
      showToast('Kode Python berhasil dijalankan.');
    }
  });

  container.querySelector('#kb3-reset-code')?.addEventListener('click', () => {
    editorCode = KB3_PREVIEW_DATA.sampleCode;
    if (textarea) textarea.value = editorCode;
    runResult = runPythonBranching(editorCode);
    updateConsoleAndErrorDom();
  });

  container.querySelector('#kb3-demo-error')?.addEventListener('click', () => {
    editorCode = `nilai = 80\n\nif nilai >= 75\n    print("Lulus KKM")`;
    if (textarea) textarea.value = editorCode;
    runResult = runPythonBranching(editorCode);
    markKb3CodeTested();
    updateConsoleAndErrorDom();
  });

  container.querySelectorAll('[data-kb3-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-kb3-preset');
      editorCode = KB3_PREVIEW_DATA.sampleCode.replace(/nilai\s*=\s*\d+/, `nilai = ${val}`);
      if (textarea) textarea.value = editorCode;
      runResult = runPythonBranching(editorCode);
      markKb3CodeTested();
      updateConsoleAndErrorDom();
    });
  });

  document.getElementById('kb3-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('kb3-open-notes')?.addEventListener('click', () => openNotes());
  document.getElementById('s7-prev')?.addEventListener('click', () => navigate(6));
  document.getElementById('s7-next')?.addEventListener('click', () => navigate(8));
}
