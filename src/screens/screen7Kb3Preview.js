/**
 * screen7Kb3Preview.js - Layar 7: KB 3 (Transisi ke Kode Python if-elif-else)
 * Menampilkan perbandingan Blok vs Python serta Editor Kode Python luring yang dapat dijalankan.
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

export function renderScreen7Kb3Preview(container, { navigate, openGlossary, openNotes, showToast }) {
  let editorCode = KB3_PREVIEW_DATA.sampleCode;
  let runResult = { ok: true, outputs: [KB3_PREVIEW_DATA.sampleOutput], error: null };
  let firstRender = true;

  function render() {
    const enterClass = firstRender ? 'screen-enter' : '';
    firstRender = false;

    container.innerHTML = `
      <article class="${enterClass} space-y-9 pb-10">
        <header class="pb-6 border-b-2 border-line-strong space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3.5">
              <span class="chapter-numeral text-5xl sm:text-6xl">07</span>
              <div class="border-l-2 border-line-strong pl-3.5">
                <p class="editorial-index">Kegiatan Belajar 3 · 45 Menit</p>
                <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                  Transisi ke Kode Python (<code class="font-mono text-cobalt">if-elif-else</code>)
                </h1>
              </div>
            </div>

            <div class="flex items-center gap-2">
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

          <p class="prose-wb text-sm sm:text-[15.5px] text-ink-muted">
            Setelah terbiasa menyusun blok visual di KB 2, sekarang saatnya menerjemahkan pola yang sama ke dalam bahasa pemrograman teks <strong>Python</strong>. Perhatikan dua aturan utama Python: tanda titik dua (<code class="font-mono font-bold text-ink">:</code>) di akhir baris kondisi dan jarak menjorok <strong>4 spasi (indentasi)</strong>.
          </p>
        </header>

        <!-- Perbandingan Blok Visual vs Sintaks Python -->
        <section class="space-y-4">
          <div>
            <p class="editorial-index">Subbab 7.1 · Blok ke Kode Teks</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Perbandingan Blok Visual (KB 2) dan Sintaks Python
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="wb-sheet p-5 bg-canvas space-y-3">
              <div class="flex items-center justify-between border-b border-line pb-2">
                <span class="font-mono text-xs font-bold uppercase text-ink">Susunan Blok Visual</span>
                <span class="font-mono text-[11px] text-ink-muted">Dari KB 2</span>
              </div>
              <div class="space-y-1.5" style="--puzzle-cutout-bg: var(--color-canvas);">
                <div class="puzzle-block puzzle-block--if cursor-default">JIKA  nilai &gt;= 90  :</div>
                <div class="puzzle-block puzzle-block--action-true puzzle-block--indent cursor-default">CETAK  "Predikat A (Sangat Baik)"</div>
                <div class="puzzle-block puzzle-block--elif cursor-default">ATAU JIKA  nilai &gt;= 75  :</div>
                <div class="puzzle-block puzzle-block--action-amber puzzle-block--indent cursor-default">CETAK  "Predikat B (Baik - Tuntas KKM)"</div>
                <div class="puzzle-block puzzle-block--else cursor-default">SELAIN ITU  :</div>
                <div class="puzzle-block puzzle-block--action-false puzzle-block--indent cursor-default">CETAK  "Predikat C (Perlu Bimbingan)"</div>
              </div>
            </div>

            <div class="wb-sheet p-5 bg-surface space-y-3">
              <div class="flex items-center justify-between border-b border-line pb-2">
                <span class="font-mono text-xs font-bold uppercase text-cobalt">Sintaks Teks Python</span>
                <span class="font-mono text-[11px] text-ink-muted">Aturan Penulisan</span>
              </div>
              <div class="rounded-md border border-line-strong bg-canvas overflow-x-auto font-mono text-xs sm:text-[13px] divide-y divide-line/60">
                <div class="px-3 py-2 border-l-[3px] border-l-cobalt"><strong class="text-cobalt">if</strong> nilai &gt;= 90<strong class="text-coral">:</strong></div>
                <div class="px-3 py-2 border-l-[3px] border-l-emerald"><span class="text-ink-muted/70">····</span>print("Predikat A (Sangat Baik)")</div>
                <div class="px-3 py-2 border-l-[3px] border-l-amber"><strong class="text-ink">elif</strong> nilai &gt;= 75<strong class="text-coral">:</strong></div>
                <div class="px-3 py-2 border-l-[3px] border-l-amber"><span class="text-ink-muted/70">····</span>print("Predikat B (Baik - Tuntas KKM)")</div>
                <div class="px-3 py-2 border-l-[3px] border-l-coral"><strong class="text-coral">else</strong><strong class="text-coral">:</strong></div>
                <div class="px-3 py-2 border-l-[3px] border-l-coral"><span class="text-ink-muted/70">····</span>print("Predikat C (Perlu Bimbingan)")</div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                <div class="p-2 rounded bg-canvas border border-line">
                  <span class="font-mono font-bold text-coral">: (Titik Dua)</span>
                  <p class="text-ink-muted mt-0.5">Wajib menutup setiap baris if, elif, dan else.</p>
                </div>
                <div class="p-2 rounded bg-canvas border border-line">
                  <span class="font-mono font-bold text-cobalt">···· (4 Spasi)</span>
                  <p class="text-ink-muted mt-0.5">Menandai perintah di dalam cabang kondisi.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Editor Kode Python Luring + Error Hint + Output -->
        <section class="space-y-4 pt-4 wb-rule">
          <div>
            <p class="editorial-index">Subbab 7.2 · Praktik Kode Python</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Editor Kode Python Luring &amp; Penjelas Kesalahan
            </h2>
            <p class="text-sm text-ink-muted mt-1">
              Coba ubah angka pada baris <code class="font-mono text-ink">nilai = 84</code> lalu klik <strong>Jalankan Kode</strong>. Kamu juga bisa mencoba menghapus tanda <code class="font-mono text-ink">:</code> untuk melihat cara kerja petunjuk perbaikan kesalahan.
            </p>
          </div>

          <div class="wb-sheet-framed overflow-hidden">
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
              <!-- Editor & Output -->
              <div class="lg:col-span-7 p-4 bg-surface border-b lg:border-b-0 lg:border-r border-line space-y-3">
                <div class="flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="font-mono text-[11px] text-ink-muted mr-1">Uji cepat:</span>
                  <button type="button" data-kb3-preset="95" class="font-mono px-2 py-0.5 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 95</button>
                  <button type="button" data-kb3-preset="84" class="font-mono px-2 py-0.5 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 84</button>
                  <button type="button" data-kb3-preset="60" class="font-mono px-2 py-0.5 rounded border border-line bg-canvas hover:border-cobalt cursor-pointer">nilai = 60</button>
                  <button type="button" id="kb3-demo-error" class="font-mono px-2 py-0.5 rounded border border-coral/60 bg-coral-soft/60 text-ink hover:border-coral cursor-pointer">Tes Error (Lupa :)</button>
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

                <div id="kb3-output-console" class="rounded-md border border-line-strong bg-ink text-surface p-3.5 font-mono text-xs">
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
                </div>
              </div>

              <!-- Panel Petunjuk Kesalahan (Error Hint) -->
              <div class="lg:col-span-5 p-4 bg-canvas space-y-3">
                <div class="flex items-center gap-1.5">
                  ${icon('alert', 16, 'text-coral')}
                  <h3 class="font-display font-bold text-base text-ink">Petunjuk Kesalahan (Error Hint)</h3>
                </div>

                ${
                  !runResult.ok && runResult.error
                    ? `
                    <div id="kb3-active-error" class="wb-callout-coral space-y-1">
                      <span class="font-mono text-[11px] font-bold uppercase text-coral">${escapeHtml(runResult.error.code)}</span>
                      <p class="font-display font-bold text-sm text-ink">${escapeHtml(runResult.error.title)}</p>
                      <p class="text-xs text-ink-muted">Penyebab: ${escapeHtml(runResult.error.cause)}</p>
                      <p class="text-xs text-ink font-medium pt-0.5">Cara memperbaiki: ${escapeHtml(runResult.error.fix)}</p>
                    </div>
                  `
                    : `
                    <div class="wb-callout-emerald text-xs text-ink">
                      <p class="font-bold">Tidak ada kesalahan sintaks.</p>
                      <p class="mt-0.5 text-ink-muted">Di bawah ini adalah 2 jenis kesalahan yang paling sering terjadi saat belajar percabangan Python:</p>
                    </div>
                  `
                }

                <div class="space-y-3">
                  ${KB3_PREVIEW_DATA.errorHintsPreview
                    .map(
                      (eh) => `
                      <div class="wb-sheet p-3 space-y-1 border-l-[3px] border-l-coral">
                        <span class="font-mono text-[11px] font-bold uppercase text-coral">${eh.code}</span>
                        <p class="font-display font-bold text-sm text-ink">${eh.title}</p>
                        <p class="text-xs text-ink-muted">Penyebab: ${eh.cause}</p>
                        <p class="text-xs text-ink font-medium pt-0.5">Solusi: <code class="font-mono bg-canvas px-1 py-0.5 rounded">${eh.fix}</code></p>
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
            <span>Kembali: KB 2 Blok Visual</span>
          </button>
          <button type="button" id="s7-next" class="wb-btn-primary">
            <span>Lanjut ke KB 4: Pohon Keputusan AI</span>
            ${icon('arrowRight', 16)}
          </button>
        </nav>
      </article>
    `;

    const textarea = document.getElementById('kb3-code-editor');
    textarea?.addEventListener('input', (e) => {
      editorCode = e.target.value;
    });

    document.getElementById('kb3-run-code')?.addEventListener('click', () => {
      editorCode = textarea?.value ?? editorCode;
      runResult = runPythonBranching(editorCode);
      markKb3CodeTested();
      render();
      if (runResult.ok) {
        showToast('Kode Python berhasil dijalankan.');
      }
    });

    document.getElementById('kb3-reset-code')?.addEventListener('click', () => {
      editorCode = KB3_PREVIEW_DATA.sampleCode;
      runResult = runPythonBranching(editorCode);
      render();
    });

    document.getElementById('kb3-demo-error')?.addEventListener('click', () => {
      editorCode = `nilai = 80\n\nif nilai >= 75\n    print("Lulus KKM")`;
      runResult = runPythonBranching(editorCode);
      markKb3CodeTested();
      render();
    });

    container.querySelectorAll('[data-kb3-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-kb3-preset');
        editorCode = KB3_PREVIEW_DATA.sampleCode.replace(/nilai\s*=\s*\d+/, `nilai = ${val}`);
        runResult = runPythonBranching(editorCode);
        markKb3CodeTested();
        render();
      });
    });

    document.getElementById('kb3-open-glossary')?.addEventListener('click', () => openGlossary());
    document.getElementById('kb3-open-notes')?.addEventListener('click', () => openNotes());
    document.getElementById('s7-prev')?.addEventListener('click', () => navigate(6));
    document.getElementById('s7-next')?.addEventListener('click', () => navigate(8));
  }

  render();
}
