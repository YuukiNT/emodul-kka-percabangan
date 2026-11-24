/**
 * screen8Kb4Preview.js - Layar 8: KB 4 (Pohon Keputusan AI / Decision Tree)
 */

import { KB4_PREVIEW_DATA } from '../data/previewData.js';
import { markKb4TreeTested } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

export function renderScreen8Kb4Preview(container, { navigate, openGlossary, openNotes }) {
  let previewCuaca = 'Cerah';
  let previewSuhu = 'Hangat';
  let previewAngin = 'Lemah';
  let firstRender = true;

  function computeDecision() {
    if (previewCuaca === 'Hujan') {
      return { decision: 'Kegiatan di Kelas', ratio: '100% (2 dari 2 data Hujan)', path: 'hujan', tone: 'coral' };
    }
    if (previewCuaca === 'Berawan') {
      return { decision: 'Olahraga di Lapangan', ratio: '100% (2 dari 2 data Berawan)', path: 'berawan', tone: 'emerald' };
    }
    if (previewAngin === 'Kuat') {
      return { decision: 'Kegiatan di Kelas', ratio: '100% (1 dari 1 data Cerah + Angin Kuat)', path: 'cerah-kuat', tone: 'coral' };
    }
    return { decision: 'Olahraga di Lapangan', ratio: '100% (3 dari 3 data Cerah + Angin Lemah)', path: 'cerah-lemah', tone: 'emerald' };
  }

  function rowMatches(row) {
    if (previewCuaca === 'Hujan') return row.cuaca === 'Hujan';
    if (previewCuaca === 'Berawan') return row.cuaca === 'Berawan';
    return row.cuaca === 'Cerah' && row.angin === previewAngin;
  }

  function render() {
    const res = computeDecision();
    const enterClass = firstRender ? 'screen-enter' : '';
    firstRender = false;

    container.innerHTML = `
      <article class="${enterClass} space-y-9 pb-10">
        <header class="pb-6 border-b-2 border-line-strong space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3.5">
              <span class="chapter-numeral text-5xl sm:text-6xl">08</span>
              <div class="border-l-2 border-line-strong pl-3.5">
                <p class="editorial-index">Kegiatan Belajar 4 · 40 Menit</p>
                <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                  Pohon Keputusan AI (<em>Decision Tree</em>)
                </h1>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button type="button" id="kb4-open-glossary" class="wb-btn-ghost text-xs border border-line">
                ${icon('book', 14, 'text-cobalt')}
                <span>Kamus</span>
              </button>
              <button type="button" id="kb4-open-notes" class="wb-btn-ghost text-xs border border-line">
                ${icon('notebook', 14, 'text-cobalt')}
                <span>Catat Poin</span>
              </button>
            </div>
          </div>

          <p class="prose-wb text-sm sm:text-[15.5px] text-ink-muted">
            Konsep percabangan <code class="font-mono text-ink">if-elif-else</code> juga menjadi dasar salah satu model Kecerdasan Artifisial yang mudah dipahami, yaitu <strong>Pohon Keputusan (Decision Tree)</strong>. Model ini menyusun pertanyaan bercabang dari data latih untuk mengambil keputusan otomatis.
          </p>
        </header>

        <!-- Anatomi Pohon Keputusan -->
        <section class="space-y-4">
          <div>
            <p class="editorial-index">Subbab 8.1 · Bagian Pohon</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Anatomi Pohon Keputusan (Root, Internal, dan Leaf Node)
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${KB4_PREVIEW_DATA.anatomy
              .map((node, i) => {
                const borderColor =
                  node.color === 'cobalt'
                    ? 'border-t-cobalt'
                    : node.color === 'amber'
                    ? 'border-t-amber'
                    : 'border-t-emerald';
                return `
                  <article class="wb-sheet p-4 border-t-4 ${borderColor} space-y-1.5">
                    <span class="font-mono text-[11px] text-ink-muted">Bagian 0${i + 1}</span>
                    <h3 class="font-display font-bold text-base text-ink">${node.name}</h3>
                    <p class="text-sm text-ink-muted leading-relaxed">${node.desc}</p>
                  </article>
                `;
              })
              .join('')}
          </div>
        </section>

        <!-- Simulator Penelusuran Pohon Keputusan -->
        <section class="space-y-4 pt-4 wb-rule">
          <div>
            <p class="editorial-index">Subbab 8.2 · Simulasi Pohon Keputusan</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">
              Studi Kasus: Menentukan Lokasi Pelajaran Olahraga SMPN 9
            </h2>
            <p class="text-sm text-ink-muted mt-1">
              Pilih kondisi <strong>Cuaca</strong>, <strong>Suhu</strong>, dan <strong>Angin</strong> di bawah ini untuk menelusuri cabang mana yang dilewati pohon keputusan dan baris mana saja yang cocok pada data latih.
            </p>
          </div>

          <div class="wb-sheet-framed overflow-hidden">
            <div class="p-4 sm:p-5 bg-canvas border-b border-line-strong grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">Atribut 1: Cuaca</span>
                <div class="flex gap-1.5">
                  ${['Cerah', 'Berawan', 'Hujan']
                    .map(
                      (v) => `<button type="button" data-ai-cuaca="${v}" class="flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                        previewCuaca === v ? 'bg-cobalt text-surface border-ink' : 'bg-surface text-ink border-line'
                      }">${v}</button>`
                    )
                    .join('')}
                </div>
              </div>

              <div>
                <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">Atribut 2: Suhu</span>
                <div class="flex gap-1.5">
                  ${['Sejuk', 'Hangat', 'Panas']
                    .map(
                      (v) => `<button type="button" data-ai-suhu="${v}" class="flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                        previewSuhu === v ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line'
                      }">${v}</button>`
                    )
                    .join('')}
                </div>
              </div>

              <div>
                <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">Atribut 3: Angin</span>
                <div class="flex gap-1.5">
                  ${['Lemah', 'Kuat']
                    .map(
                      (v) => `<button type="button" data-ai-angin="${v}" class="flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                        previewAngin === v ? 'bg-amber text-ink border-ink' : 'bg-surface text-ink border-line'
                      }">${v}</button>`
                    )
                    .join('')}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12">
              <div class="lg:col-span-8 p-4 sm:p-5 bg-surface border-b lg:border-b-0 lg:border-r border-line overflow-x-auto">
                <svg viewBox="0 0 620 330" class="w-full h-auto max-w-[620px] mx-auto" role="img" aria-label="Diagram pohon keputusan lokasi olahraga">
                  <line x1="310" y1="68" x2="155" y2="148" stroke="${previewCuaca === 'Cerah' ? 'var(--color-cobalt)' : 'var(--color-line)'}" stroke-width="${previewCuaca === 'Cerah' ? 3 : 1.8}"/>
                  <line x1="310" y1="68" x2="310" y2="148" stroke="${previewCuaca === 'Berawan' ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${previewCuaca === 'Berawan' ? 3 : 1.8}"/>
                  <line x1="310" y1="68" x2="495" y2="148" stroke="${previewCuaca === 'Hujan' ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${previewCuaca === 'Hujan' ? 3 : 1.8}"/>

                  <text x="206" y="106" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--color-ink)">Cerah</text>
                  <text x="318" y="114" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--color-ink)">Berawan</text>
                  <text x="412" y="106" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--color-ink)">Hujan</text>

                  <rect x="215" y="18" width="190" height="50" rx="8" fill="var(--color-cobalt-soft)" stroke="var(--color-cobalt)" stroke-width="2.4"/>
                  <text x="310" y="39" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="var(--color-cobalt)">ROOT NODE</text>
                  <text x="310" y="56" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="var(--color-ink)">Cuaca Hari Ini?</text>

                  <g class="${previewCuaca === 'Cerah' ? '' : 'fc-dimmed'}">
                    <rect x="75" y="148" width="160" height="48" rx="8" fill="var(--color-amber-soft)" stroke="var(--color-amber)" stroke-width="2.4"/>
                    <text x="155" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="var(--color-ink)">INTERNAL NODE</text>
                    <text x="155" y="184" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Kecepatan Angin?</text>

                    <line x1="155" y1="196" x2="88" y2="258" stroke="${res.path === 'cerah-lemah' ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${res.path === 'cerah-lemah' ? 3 : 1.6}"/>
                    <line x1="155" y1="196" x2="225" y2="258" stroke="${res.path === 'cerah-kuat' ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${res.path === 'cerah-kuat' ? 3 : 1.6}"/>
                    <text x="96" y="230" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="var(--color-ink)">Lemah</text>
                    <text x="196" y="230" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="var(--color-ink)">Kuat</text>

                    <rect x="18" y="260" width="134" height="48" rx="24" fill="${res.path === 'cerah-lemah' ? 'var(--color-emerald-soft)' : 'var(--color-canvas)'}" stroke="${res.path === 'cerah-lemah' ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="2.2"/>
                    <text x="85" y="280" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--color-ink-muted)">LEAF NODE</text>
                    <text x="85" y="296" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700" fill="var(--color-ink)">Lapangan (3/3)</text>

                    <rect x="164" y="260" width="124" height="48" rx="24" fill="${res.path === 'cerah-kuat' ? 'var(--color-coral-soft)' : 'var(--color-canvas)'}" stroke="${res.path === 'cerah-kuat' ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="2.2"/>
                    <text x="226" y="280" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--color-ink-muted)">LEAF NODE</text>
                    <text x="226" y="296" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700" fill="var(--color-ink)">Di Kelas (1/1)</text>
                  </g>

                  <g class="${previewCuaca === 'Berawan' ? '' : 'fc-dimmed'}">
                    <rect x="248" y="148" width="134" height="48" rx="24" fill="${res.path === 'berawan' ? 'var(--color-emerald-soft)' : 'var(--color-canvas)'}" stroke="${res.path === 'berawan' ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="2.2"/>
                    <text x="315" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--color-ink-muted)">LEAF NODE</text>
                    <text x="315" y="184" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700" fill="var(--color-ink)">Lapangan (2/2)</text>
                  </g>

                  <g class="${previewCuaca === 'Hujan' ? '' : 'fc-dimmed'}">
                    <rect x="424" y="148" width="144" height="48" rx="24" fill="${res.path === 'hujan' ? 'var(--color-coral-soft)' : 'var(--color-canvas)'}" stroke="${res.path === 'hujan' ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="2.2"/>
                    <text x="496" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--color-ink-muted)">LEAF NODE</text>
                    <text x="496" y="184" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700" fill="var(--color-ink)">Di Kelas (2/2)</text>
                  </g>
                </svg>
              </div>

              <div class="lg:col-span-4 p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
                <div class="space-y-3">
                  <p class="editorial-index">Hasil Keputusan</p>
                  <div class="p-3.5 rounded-md border-2 ${res.tone === 'emerald' ? 'border-emerald bg-emerald-soft' : 'border-coral bg-coral-soft'}">
                    <span class="font-mono text-[10.5px] uppercase text-ink-muted block">Prediksi Model:</span>
                    <p class="font-display font-bold text-lg text-ink mt-0.5">${res.decision}</p>
                  </div>

                  <div class="wb-sheet p-3 space-y-1">
                    <span class="font-mono text-[10.5px] uppercase text-ink-muted">Proporsi Data Latih</span>
                    <p class="font-mono text-sm font-bold text-cobalt">${res.ratio}</p>
                    <p class="text-xs text-ink-muted leading-relaxed">
                      Input aktif: Cuaca <strong>${previewCuaca}</strong>, Suhu <strong>${previewSuhu}</strong>, Angin <strong>${previewAngin}</strong>.
                    </p>
                  </div>
                </div>

                <p class="text-xs text-ink-muted border-t border-line pt-2.5 leading-relaxed">
                  Perhatikan bahwa atribut <strong>Suhu</strong> tidak muncul di cabang pohon karena Cuaca dan Angin sudah cukup memisahkan seluruh data latih.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Tabel Data Latih -->
        <section class="space-y-3 pt-4 wb-rule">
          <div>
            <p class="editorial-index">Subbab 8.3 · Data Latih</p>
            <h2 class="font-display font-bold text-xl text-ink mt-0.5">Tabel Data Latih (8 Sampel Kegiatan Olahraga)</h2>
            <p class="text-xs text-ink-muted mt-0.5">Baris yang disorot menunjukkan sampel data latih yang sesuai dengan cabang aktif di atas.</p>
          </div>

          <div class="wb-sheet overflow-x-auto">
            <table class="wb-table min-w-[500px]">
              <thead>
                <tr>
                  <th class="w-12">No</th>
                  <th>Cuaca</th>
                  <th>Suhu</th>
                  <th>Angin</th>
                  <th>Keputusan (Label)</th>
                </tr>
              </thead>
              <tbody>
                ${KB4_PREVIEW_DATA.trainingDataset
                  .map((row) => {
                    const matched = rowMatches(row);
                    return `
                      <tr class="${matched ? 'bg-cobalt-soft/50' : ''}">
                        <td class="font-mono text-xs text-ink-muted">${row.no}</td>
                        <td class="text-sm font-medium">${row.cuaca}</td>
                        <td class="text-sm">${row.suhu}</td>
                        <td class="text-sm">${row.angin}</td>
                        <td>
                          <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
                            row.keputusan === 'Lapangan'
                              ? 'border-emerald bg-emerald-soft text-ink'
                              : 'border-coral bg-coral-soft text-ink'
                          }">${row.keputusan}</span>
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <button type="button" id="s8-prev" class="wb-btn-secondary">
            ${icon('arrowLeft', 16)}
            <span>Kembali: KB 3 Kode Python</span>
          </button>
          <button type="button" id="s8-next" class="wb-btn-primary">
            <span>Lanjut: Evaluasi Mandiri &amp; Sertifikat</span>
            ${icon('arrowRight', 16)}
          </button>
        </nav>
      </article>
    `;

    container.querySelectorAll('[data-ai-cuaca]').forEach((b) =>
      b.addEventListener('click', () => {
        previewCuaca = b.getAttribute('data-ai-cuaca');
        markKb4TreeTested();
        render();
      })
    );
    container.querySelectorAll('[data-ai-suhu]').forEach((b) =>
      b.addEventListener('click', () => {
        previewSuhu = b.getAttribute('data-ai-suhu');
        markKb4TreeTested();
        render();
      })
    );
    container.querySelectorAll('[data-ai-angin]').forEach((b) =>
      b.addEventListener('click', () => {
        previewAngin = b.getAttribute('data-ai-angin');
        markKb4TreeTested();
        render();
      })
    );

    document.getElementById('kb4-open-glossary')?.addEventListener('click', () => openGlossary());
    document.getElementById('kb4-open-notes')?.addEventListener('click', () => openNotes());
    document.getElementById('s8-prev')?.addEventListener('click', () => navigate(7));
    document.getElementById('s8-next')?.addEventListener('click', () => navigate(9));
  }

  render();
}
