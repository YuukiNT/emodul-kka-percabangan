/**
 * screen5Kb1.js - Layar 5: KB 1 (Konsep Dasar Logika Keputusan & Flowchart)
 * Mengikuti pola Bartosz Ciechanowski & Brilliant.org:
 * 1) Interactive Hook 10 detik di awal bab (sebelum definisi & tabel)
 * 2) Narasi terbuka di atas kanvas kertas hangat (tanpa tumpukan kotak berlapis)
 * 3) Checkpoint Tebak Cepat sebaris + Laboratorium Flowchart 60fps + Kuis Bertahap 1-per-1
 */

import {
  KB1_EVERYDAY_EXAMPLES,
  KB1_FLOWCHART_SYMBOLS,
  KB1_OPERATORS,
  KB1_QUIZ,
} from '../data/kb1Data.js';
import { getState, resetKb1Quiz, saveKb1Quiz } from '../storage/localStore.js';
import { mountKb1FlowchartSim } from '../simulations/kb1FlowchartSim.js';
import { mountFormativeQuiz } from '../components/formativeQuiz.js';
import { icon } from '../components/icons.js';

export function renderScreen5Kb1(container, { navigate, openGlossary, openNotes, showToast }) {
  const { kb1 } = getState();
  let hookBattery = 16;

  function updateBatteryHook() {
    const isLow = hookBattery < 20;
    const valLabel = container.querySelector('#kb1-hook-val');
    const exprResult = container.querySelector('#kb1-hook-bool');
    const phoneStatus = container.querySelector('#kb1-hook-status');
    const barFill = container.querySelector('#kb1-hook-bar');

    if (valLabel) valLabel.textContent = `${hookBattery}%`;
    if (barFill) {
      barFill.style.width = `${hookBattery}%`;
      barFill.className = `h-full rounded-xs transition-all duration-150 ${
        isLow ? 'bg-coral' : hookBattery < 45 ? 'bg-amber' : 'bg-emerald'
      }`;
    }
    if (exprResult) {
      exprResult.textContent = isLow ? 'True (Benar)' : 'False (Salah)';
      exprResult.className = `font-mono text-xs font-bold px-2.5 py-1 rounded border ${
        isLow ? 'border-emerald bg-emerald-soft text-ink' : 'border-coral bg-coral-soft text-ink'
      }`;
    }
    if (phoneStatus) {
      phoneStatus.className = `mt-3 p-3 rounded-md border text-sm font-medium transition-colors ${
        isLow
          ? 'border-amber bg-amber-soft text-ink'
          : 'border-line bg-canvas text-ink-muted'
      }`;
      phoneStatus.innerHTML = isLow
        ? `<strong class="text-ink block">Notifikasi Muncul: "Baterai lemah! Segera colok charger."</strong><span class="text-xs">Karena ${hookBattery} &lt; 20 bernilai <strong>True</strong>, HP menjalankan perintah peringatan.</span>`
        : `<strong class="text-ink block">Layar Normal (Tidak Ada Peringatan)</strong><span class="text-xs">Karena ${hookBattery} &lt; 20 bernilai <strong>False</strong>, perintah peringatan dilewati.</span>`;
    }
  }

  container.innerHTML = `
    <article class="screen-enter space-y-12 pb-12">
      <!-- Pembuka Bab (Satu Kicker Editorial Saja) -->
      <header class="pb-6 border-b border-line space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="editorial-index">Kegiatan Belajar 1 · Estimasi 35 Menit</p>
          <div class="flex items-center gap-1.5">
            <button type="button" id="kb1-open-glossary" class="wb-btn-ghost text-xs border border-line">
              ${icon('book', 14, 'text-cobalt')}
              <span>Kamus</span>
            </button>
            <button type="button" id="kb1-open-notes" class="wb-btn-ghost text-xs border border-line">
              ${icon('notebook', 14, 'text-cobalt')}
              <span>Catat Poin</span>
            </button>
          </div>
        </div>

        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">05</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Konsep Dasar Logika Keputusan &amp; Flowchart
          </h1>
        </div>

        <p class="prose-wb text-ink-muted text-base">
          Bagaimana ponsel tahu kapan harus memunculkan peringatan baterai lemah, atau bagaimana komputer menentukan siswa lulus KKM? Sebelum membaca rumusnya, coba gerakkan simulasi kecil di bawah ini.
        </p>
      </header>

      <!-- PEMICU INTERAKTIF 10 DETIK (Demo First sebelum Definisi) -->
      <section class="wb-stage p-5 sm:p-6 space-y-4" aria-label="Eksperimen pembuka baterai ponsel">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-display font-bold text-base sm:text-lg text-ink">
            Sentuh Dulu: Kapan Peringatan Baterai HP Muncul?
          </h2>
          <span class="font-mono text-xs text-ink-muted">Geser di bawah &amp; di atas 20%</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div class="md:col-span-6 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <label for="kb1-hook-slider" class="font-semibold text-ink">Sisa Baterai HP (<code class="font-mono text-cobalt">baterai</code>)</label>
              <div class="flex items-center gap-2">
                <div class="w-12 h-5 p-0.5 rounded border-[1.5px] border-ink flex items-center bg-surface">
                  <div id="kb1-hook-bar" class="h-full rounded-xs bg-coral" style="width: 16%"></div>
                </div>
                <span id="kb1-hook-val" class="font-mono tabular-nums font-bold text-ink w-10 text-right">16%</span>
              </div>
            </div>
            <input id="kb1-hook-slider" type="range" min="3" max="100" value="${hookBattery}" class="wb-slider" />
          </div>

          <div class="md:col-span-6">
            <div class="flex items-center justify-between gap-2 text-xs font-mono">
              <span class="text-ink-muted">Syarat diuji: <code class="text-ink font-semibold">baterai &lt; 20</code></span>
              <span id="kb1-hook-bool"></span>
            </div>
            <div id="kb1-hook-status"></div>
          </div>
        </div>
      </section>

      <!-- 5.1 Kondisi Logis & Boolean (Mengalir Terbuka di Atas Kanvas Kertas) -->
      <section class="space-y-5">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">5.1</span>Apa Itu Kondisi Logis (<button type="button" data-glossary-term="Boolean" class="text-cobalt underline decoration-dotted underline-offset-4 cursor-pointer">Boolean</button>)?
        </h2>

        <div class="prose-wb space-y-3.5">
          <p>
            Baru saja tanganmu menguji sebuah <strong>kondisi logis</strong>. Saat angka baterai berada di <strong>16%</strong>, pernyataan <code class="font-mono text-sm bg-surface px-1.5 py-0.5 rounded border border-line">baterai &lt; 20</code> bernilai <strong>Benar (True)</strong>. Begitu kamu menggesernya ke <strong>50%</strong>, pernyataan yang sama langsung berubah menjadi <strong>Salah (False)</strong>.
          </p>
          <p>
            Berbeda dengan manusia yang bisa menjawab <em>"agak habis"</em> atau <em>"lumayan bagus"</em>, komputer hanya menerima syarat yang tegas dan hanya mengenal dua nilai kebenaran yang disebut <strong>Boolean</strong>: <strong class="text-emerald">True</strong> (syarat terpenuhi) atau <strong class="text-coral">False</strong> (syarat tidak terpenuhi).
          </p>
        </div>

        <div class="overflow-x-auto pt-1">
          <table class="wb-table min-w-[540px]">
            <thead>
              <tr>
                <th>Situasi Harian Siswa</th>
                <th>Pertanyaan Kondisi</th>
                <th>Jalur Benar (True)</th>
                <th>Jalur Salah (False)</th>
              </tr>
            </thead>
            <tbody>
              ${KB1_EVERYDAY_EXAMPLES.map(
                (ex) => `
                <tr>
                  <td class="font-semibold text-ink">${ex.context}</td>
                  <td><code class="font-mono text-xs bg-surface text-cobalt px-2 py-0.5 rounded border border-line">${ex.condition}</code></td>
                  <td class="text-sm text-ink"><span class="inline-block w-2 h-2 rounded-full bg-emerald mr-1.5"></span>${ex.trueAction}</td>
                  <td class="text-sm text-ink-muted"><span class="inline-block w-2 h-2 rounded-full bg-coral mr-1.5"></span>${ex.falseAction}</td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>
        </div>

        <aside class="wb-callout max-w-2xl">
          <p class="text-sm text-ink leading-relaxed">
            <strong>Tips merumuskan syarat:</strong> Hindari kata sifat yang kabur seperti <em>"nilai bagus"</em>. Ubah selalu menjadi perbandingan angka yang pasti seperti <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">nilai &gt;= 75</code>.
          </p>
        </aside>
      </section>

      <!-- 5.2 Lima Simbol Dasar Flowchart -->
      <section class="space-y-5 pt-8 wb-rule">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">5.2</span>Lima Simbol Dasar Diagram Alir (Flowchart)
        </h2>

        <p class="prose-wb">
          Sebelum diketik menjadi kode, alur keputusan biasanya digambar lebih dulu dalam bentuk <strong>flowchart</strong> (diagram alir). Lima simbol standar berikut adalah bahasa peta yang disepakati pemrogram di seluruh dunia:
        </p>

        <div class="overflow-x-auto">
          <table class="wb-table min-w-[580px]">
            <thead>
              <tr>
                <th class="w-32">Simbol</th>
                <th class="w-48">Nama &amp; Fungsi</th>
                <th>Keterangan &amp; Contoh Isi</th>
              </tr>
            </thead>
            <tbody>
              ${KB1_FLOWCHART_SYMBOLS.map(
                (sym) => `
                <tr>
                  <td class="align-middle">${sym.svg}</td>
                  <td>
                    <p class="font-display font-bold text-sm text-ink">${sym.name}</p>
                    <p class="font-mono text-[11px] text-cobalt mt-0.5">${sym.role}</p>
                  </td>
                  <td>
                    <p class="text-sm text-ink leading-relaxed">${sym.desc}</p>
                    <p class="font-mono text-xs text-ink-muted mt-1">Contoh: <code class="bg-surface px-1.5 py-0.5 rounded border border-line text-ink">${sym.example}</code></p>
                  </td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- 5.3 Enam Operator Perbandingan + Checkpoint Tebak Cepat -->
      <section class="space-y-5 pt-8 wb-rule">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">5.3</span>Enam Operator Perbandingan
        </h2>

        <p class="prose-wb">
          Di dalam simbol <strong>Belah Ketupat</strong>, kita memakai enam tanda perbandingan di bawah ini. Perhatikan baik-baik bedanya <code class="font-mono font-semibold text-cobalt">&gt;</code> dengan <code class="font-mono font-semibold text-cobalt">&gt;=</code>, serta <code class="font-mono font-semibold text-cobalt">==</code> dengan satu tanda <code class="font-mono font-semibold text-ink">=</code>.
        </p>

        <div class="overflow-x-auto">
          <table class="wb-table min-w-[600px]">
            <thead>
              <tr>
                <th class="w-24">Operator</th>
                <th class="w-48">Arti</th>
                <th>Contoh Uji</th>
                <th class="w-24">Hasil</th>
              </tr>
            </thead>
            <tbody>
              ${KB1_OPERATORS.map(
                (op) => `
                <tr>
                  <td>
                    <code class="font-mono text-sm font-bold px-2.5 py-1 rounded bg-surface text-cobalt border border-line-strong inline-block">${op.symbol}</code>
                  </td>
                  <td>
                    <p class="font-semibold text-sm text-ink">${op.name}</p>
                    <p class="text-xs text-ink-muted mt-0.5">${op.meaning}</p>
                  </td>
                  <td>
                    <code class="font-mono text-xs text-ink bg-surface px-2 py-0.5 rounded border border-line inline-block">${op.example}</code>
                    <p class="text-xs text-ink-muted mt-1">${op.note}</p>
                  </td>
                  <td class="align-middle">
                    <span class="font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                      op.result
                        ? 'border-emerald bg-emerald-soft text-ink'
                        : 'border-coral bg-coral-soft text-ink'
                    }">
                      ${op.result ? 'True' : 'False'}
                    </span>
                  </td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>
        </div>

        <!-- Micro-Checkpoint 1 Klik (Active Recall di Tengah Bacaan) -->
        <div class="wb-callout-cobalt max-w-2xl space-y-2.5" id="kb1-quick-check">
          <p class="text-sm font-semibold text-ink">
            Uji Cepat 5 Detik: Raka mendapat nilai ulangan pas <code class="font-mono font-bold">75</code>. Jika komputer memeriksa syarat <code class="font-mono font-bold bg-surface px-1.5 py-0.5 rounded border border-line">nilai == 75</code>, apa hasilnya?
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" data-quick-ans="true" class="min-h-[38px] px-3.5 py-1.5 rounded border border-line-strong bg-surface hover:bg-emerald-soft text-xs font-mono font-bold text-ink cursor-pointer">
              True (Benar)
            </button>
            <button type="button" data-quick-ans="false" class="min-h-[38px] px-3.5 py-1.5 rounded border border-line-strong bg-surface hover:bg-coral-soft text-xs font-mono font-bold text-ink cursor-pointer">
              False (Salah)
            </button>
          </div>
          <p id="kb1-quick-feedback" class="text-xs text-ink hidden"></p>
        </div>
      </section>

      <!-- 5.4 Keputusan Tunggal vs Majemuk (2 Kolom Terbuka Tanpa Kotak Berat) -->
      <section class="space-y-4 pt-8 wb-rule">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">5.4</span>Keputusan Tunggal vs Keputusan Majemuk
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1">
          <div class="border-l-2 border-cobalt pl-4 space-y-2">
            <h3 class="font-display font-bold text-lg text-ink">Keputusan Tunggal (2 Jalur)</h3>
            <p class="text-sm text-ink-muted leading-relaxed">
              Hanya memakai <strong>satu belah ketupat</strong>. Dipakai saat pilihannya cuma dua kemungkinan berlawanan, contohnya <strong>Lulus KKM</strong> (<code class="font-mono text-ink">nilai &gt;= 75</code>) atau <strong>Perlu Remedial</strong>.
            </p>
            <p class="font-mono text-xs text-ink pt-1">nilai &gt;= 75 ? → [YA: Lulus] / [TIDAK: Remedial]</p>
          </div>

          <div class="border-l-2 border-amber pl-4 space-y-2">
            <h3 class="font-display font-bold text-lg text-ink">Keputusan Majemuk (3 Jalur atau Lebih)</h3>
            <p class="text-sm text-ink-muted leading-relaxed">
              Memakai <strong>lebih dari satu belah ketupat</strong> secara bertingkat. Saat syarat pertama bernilai <em>False</em>, panah TIDAK akan mengarah ke belah ketupat kedua (misalnya membagi Predikat A, B, dan C).
            </p>
            <p class="font-mono text-xs text-ink pt-1">&gt;= 90 ? → [A] | TIDAK → &gt;= 75 ? → [B] | TIDAK → [C]</p>
          </div>
        </div>
      </section>

      <!-- 5.5 Panggung Utama: Simulasi Flowchart Interaktif -->
      <section class="space-y-3 pt-8 wb-rule" id="kb1-sim-section">
        <div class="prose-wb">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">5.5</span>Praktik: Uji Sendiri Alur Flowchart
          </h2>
          <p class="text-sm text-ink-muted mt-1">
            Bandingkan Skenario 1 (tunggal) dan Skenario 2/3 (majemuk). Coba geser tepat di angka batas seperti <code class="font-mono text-ink">74</code>, <code class="font-mono text-ink">75</code>, dan <code class="font-mono text-ink">90</code>.
          </p>
        </div>

        <div id="kb1-flowchart-sim-mount"></div>
      </section>

      <!-- Intisari Singkat (Terbuka & Ringkas) -->
      <section class="space-y-3 pt-8 wb-rule">
        <h2 class="font-display font-bold text-lg text-ink">Intisari KB 1 sebelum Kuis</h2>
        <ul class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-ink-muted pt-1">
          <li class="border-t border-line pt-3">
            <strong class="text-ink block mb-0.5">Boolean Tegas</strong>
            Setiap kondisi hanya menghasilkan <code class="font-mono text-ink">True</code> atau <code class="font-mono text-ink">False</code>.
          </li>
          <li class="border-t border-line pt-3">
            <strong class="text-ink block mb-0.5">Belah Ketupat</strong>
            Simbol penguji syarat yang selalu bercabang ke panah YA dan TIDAK.
          </li>
          <li class="border-t border-line pt-3">
            <strong class="text-ink block mb-0.5">Operator == vs =</strong>
            Gunakan <code class="font-mono text-ink">==</code> untuk membandingkan kesamaan, dan <code class="font-mono text-ink">&gt;=</code> bila nilai batas ikut dihitung lulus.
          </li>
        </ul>
      </section>

      <!-- 5.6 Kuis Formatif Bertahap (1 Soal per Tampilan) -->
      <section class="pt-6 wb-rule" id="kb1-quiz-section">
        <div id="kb1-quiz-mount"></div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s5-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Daftar Isi</span>
        </button>
        <button type="button" id="s5-next" class="wb-btn-primary">
          <span>Lanjut ke KB 2: Blok Visual</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  updateBatteryHook();

  container.querySelector('#kb1-hook-slider')?.addEventListener('input', (e) => {
    hookBattery = Number(e.target.value);
    updateBatteryHook();
  });

  container.querySelectorAll('[data-quick-ans]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pickTrue = btn.getAttribute('data-quick-ans') === 'true';
      const fb = container.querySelector('#kb1-quick-feedback');
      if (!fb) return;
      fb.classList.remove('hidden');
      fb.innerHTML = pickTrue
        ? `<strong class="text-emerald">Tepat!</strong> Karena 75 persis sama dengan 75, operator <code class="font-mono">==</code> menghasilkan <strong>True</strong>.`
        : `<strong class="text-coral">Belum tepat.</strong> Operator <code class="font-mono">==</code> mengecek apakah kedua angka sama persis. Karena 75 sama dengan 75, hasilnya <strong>True</strong>.`;
    });
  });

  mountKb1FlowchartSim(document.getElementById('kb1-flowchart-sim-mount'));

  mountFormativeQuiz(document.getElementById('kb1-quiz-mount'), {
    quizId: 'kb1-quiz',
    title: 'Kuis Formatif KB 1: Logika & Flowchart',
    subtitle: 'Satu soal per langkah. Periksa jawabanmu untuk langsung melihat pembahasannya.',
    questions: KB1_QUIZ,
    savedAnswers: kb1.quizAnswers,
    savedScore: kb1.quizScore,
    onSubmit: (score, total, answers) => {
      saveKb1Quiz(score, total, answers);
      showToast(`Kuis KB 1 selesai. Skor: ${score}/${total}.`);
    },
    onReset: () => {
      resetKb1Quiz();
      showToast('Kuis KB 1 diulang dari nomor 1.');
    },
  });

  document.getElementById('kb1-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('kb1-open-notes')?.addEventListener('click', () => openNotes());
  container.querySelectorAll('[data-glossary-term]').forEach((btn) => {
    btn.addEventListener('click', () => openGlossary(btn.getAttribute('data-glossary-term')));
  });

  document.getElementById('s5-prev')?.addEventListener('click', () => navigate(4));
  document.getElementById('s5-next')?.addEventListener('click', () => navigate(6));
}
