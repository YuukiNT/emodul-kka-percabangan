/**
 * screen8Kb4Preview.js - Layar 8: KB 4 (Pohon Keputusan AI / Decision Tree)
 * - Penjelasan anatomi terbuka di atas kanvas tanpa kotak berlebih
 * - Simulator Pohon Keputusan & Tabel Data Latih terhubung langsung tanpa kedip DOM
 */

import { KB4_PREVIEW_DATA } from '../data/previewData.js';
import { markKb4TreeTested } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

export function renderScreen8Kb4Preview(container, { navigate, openGlossary, openNotes }) {
  let previewCuaca = 'Cerah';
  let previewSuhu = 'Hangat';
  let previewAngin = 'Lemah';

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

  function renderTreeSvg(res) {
    return `
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
    `;
  }

  function updateInteractiveTreeDom() {
    const res = computeDecision();

    container.querySelectorAll('[data-ai-cuaca]').forEach((b) => {
      const active = b.getAttribute('data-ai-cuaca') === previewCuaca;
      b.className = `min-h-[40px] flex-1 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
        active ? 'bg-cobalt text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
      }`;
    });

    container.querySelectorAll('[data-ai-suhu]').forEach((b) => {
      const active = b.getAttribute('data-ai-suhu') === previewSuhu;
      b.className = `min-h-[40px] flex-1 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
        active ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
      }`;
    });

    container.querySelectorAll('[data-ai-angin]').forEach((b) => {
      const active = b.getAttribute('data-ai-angin') === previewAngin;
      b.className = `min-h-[40px] flex-1 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
        active ? 'bg-amber text-ink border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
      }`;
    });

    const svgMount = container.querySelector('#kb4-svg-mount');
    if (svgMount) svgMount.innerHTML = renderTreeSvg(res);

    const outBox = container.querySelector('#kb4-decision-box');
    if (outBox) {
      outBox.className = `p-3.5 rounded-md border-2 transition-colors ${
        res.tone === 'emerald' ? 'border-emerald bg-emerald-soft' : 'border-coral bg-coral-soft'
      }`;
      outBox.innerHTML = `
        <span class="font-mono text-[10.5px] uppercase text-ink-muted block">Prediksi Pohon Keputusan</span>
        <p class="font-display font-bold text-lg text-ink mt-0.5">${res.decision}</p>
      `;
    }

    const ratioEl = container.querySelector('#kb4-ratio-text');
    const summaryEl = container.querySelector('#kb4-input-summary');
    if (ratioEl) ratioEl.textContent = res.ratio;
    if (summaryEl) {
      summaryEl.innerHTML = `Input aktif: Cuaca <strong>${previewCuaca}</strong>, Suhu <strong>${previewSuhu}</strong>, Angin <strong>${previewAngin}</strong>.`;
    }

    const tbody = container.querySelector('#kb4-dataset-body');
    if (tbody) {
      tbody.innerHTML = KB4_PREVIEW_DATA.trainingDataset
        .map((row) => {
          const matched = rowMatches(row);
          return `
            <tr class="${matched ? 'bg-cobalt-soft/55 font-medium' : 'opacity-70'} transition-colors">
              <td class="font-mono text-xs tabular-nums text-ink-muted">${row.no}</td>
              <td class="text-sm">${row.cuaca}</td>
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
        .join('');
    }
  }

  container.innerHTML = `
    <article class="screen-enter space-y-11 pb-12">
      <header class="pb-6 border-b border-line space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="editorial-index">Kegiatan Belajar 4 · Estimasi 40 Menit</p>
          <div class="flex items-center gap-1.5">
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

        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">08</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Pohon Keputusan AI (<em>Decision Tree</em>)
          </h1>
        </div>

        <p class="prose-wb text-ink-muted text-base">
          Tahukah kamu bahwa struktur <code class="font-mono text-ink">if - elif - else</code> yang baru kamu pelajari juga menjadi fondasi model Kecerdasan Artifisial bernama <strong>Pohon Keputusan</strong>? Bedanya, jika pemrogram menyusun syarat secara manual, sistem AI menemukan urutan pertanyaannya dari pola <strong>data latih</strong>.
        </p>
      </header>

      <!-- 8.1 Anatomi Pohon Keputusan (Terbuka di Atas Kanvas Tanpa Kotak) -->
      <section class="space-y-4">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">8.1</span>Tiga Bagian dalam Pohon Keputusan
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-7 pt-1">
          ${KB4_PREVIEW_DATA.anatomy
            .map((node) => {
              const borderColor =
                node.color === 'cobalt'
                  ? 'border-l-cobalt'
                  : node.color === 'amber'
                  ? 'border-l-amber'
                  : 'border-l-emerald';
              return `
                <div class="border-l-2 ${borderColor} pl-4 space-y-1">
                  <h3 class="font-display font-bold text-base text-ink">${node.name}</h3>
                  <p class="text-sm text-ink-muted leading-relaxed">${node.desc}</p>
                </div>
              `;
            })
            .join('')}
        </div>
      </section>

      <!-- 8.2 Panggung Interaktif: Simulator Pohon Keputusan -->
      <section class="space-y-4 pt-6 wb-rule">
        <div class="space-y-1">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">8.2</span>Uji Sendiri: Prediksi Lokasi Pelajaran Olahraga SMPN 9
          </h2>
          <p class="prose-wb text-sm text-ink-muted">
            Ubah kombinasi <strong>Cuaca</strong>, <strong>Suhu</strong>, dan <strong>Angin</strong> di bawah ini, lalu perhatikan bagaimana cabang pohon menyala dan menyaring baris pada tabel data latih.
          </p>
        </div>

        <div class="wb-stage overflow-hidden">
          <div class="p-4 sm:p-5 bg-canvas border-b border-line-strong grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">1. Cuaca</span>
              <div class="flex gap-1.5">
                ${['Cerah', 'Berawan', 'Hujan']
                  .map((v) => `<button type="button" data-ai-cuaca="${v}">${v}</button>`)
                  .join('')}
              </div>
            </div>

            <div>
              <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">2. Suhu</span>
              <div class="flex gap-1.5">
                ${['Sejuk', 'Hangat', 'Panas']
                  .map((v) => `<button type="button" data-ai-suhu="${v}">${v}</button>`)
                  .join('')}
              </div>
            </div>

            <div>
              <span class="block font-mono text-[11px] uppercase font-bold text-ink-muted mb-1.5">3. Angin</span>
              <div class="flex gap-1.5">
                ${['Lemah', 'Kuat']
                  .map((v) => `<button type="button" data-ai-angin="${v}">${v}</button>`)
                  .join('')}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12">
            <div id="kb4-svg-mount" class="lg:col-span-8 p-4 sm:p-5 bg-surface border-b lg:border-b-0 lg:border-r border-line overflow-x-auto"></div>

            <div class="lg:col-span-4 p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
              <div class="space-y-3">
                <div id="kb4-decision-box"></div>
                <div class="space-y-1 pt-1">
                  <span class="font-mono text-[10.5px] uppercase text-ink-muted">Kecocokan Data Latih</span>
                  <p id="kb4-ratio-text" class="font-mono text-sm font-bold text-cobalt tabular-nums"></p>
                  <p id="kb4-input-summary" class="text-xs text-ink-muted leading-relaxed"></p>
                </div>
              </div>

              <p class="text-xs text-ink-muted border-t border-line pt-3 leading-relaxed">
                <strong>Mengapa Suhu tidak ditanyakan di pohon?</strong> Karena dari 8 data latih di bawah, cukup melihat <em>Cuaca</em> dan <em>Angin</em> saja hasilnya sudah 100% terpisah rapi!
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8.3 Tabel Data Latih Terbuka -->
      <section class="space-y-3 pt-6 wb-rule">
        <div class="space-y-0.5">
          <h2 class="font-display font-bold text-xl text-ink">
            <span class="section-num">8.3</span>Data Latih (8 Catatan Kegiatan Sebelumnya)
          </h2>
          <p class="text-xs text-ink-muted">Baris berwarna biru lembut adalah riwayat data yang cocok dengan pilihan atributmu di atas.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="wb-table min-w-[480px]">
            <thead>
              <tr>
                <th class="w-12">No</th>
                <th>Cuaca</th>
                <th>Suhu</th>
                <th>Angin</th>
                <th>Keputusan</th>
              </tr>
            </thead>
            <tbody id="kb4-dataset-body"></tbody>
          </table>
        </div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s8-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>KB 3: Kode Python</span>
        </button>
        <button type="button" id="s8-next" class="wb-btn-primary">
          <span>Lanjut ke Evaluasi Mandiri</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  updateInteractiveTreeDom();

  container.querySelectorAll('[data-ai-cuaca]').forEach((b) =>
    b.addEventListener('click', () => {
      previewCuaca = b.getAttribute('data-ai-cuaca');
      markKb4TreeTested();
      updateInteractiveTreeDom();
    })
  );
  container.querySelectorAll('[data-ai-suhu]').forEach((b) =>
    b.addEventListener('click', () => {
      previewSuhu = b.getAttribute('data-ai-suhu');
      markKb4TreeTested();
      updateInteractiveTreeDom();
    })
  );
  container.querySelectorAll('[data-ai-angin]').forEach((b) =>
    b.addEventListener('click', () => {
      previewAngin = b.getAttribute('data-ai-angin');
      markKb4TreeTested();
      updateInteractiveTreeDom();
    })
  );

  document.getElementById('kb4-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('kb4-open-notes')?.addEventListener('click', () => openNotes());
  document.getElementById('s8-prev')?.addEventListener('click', () => navigate(7));
  document.getElementById('s8-next')?.addEventListener('click', () => navigate(9));
}
