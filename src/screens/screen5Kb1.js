/**
 * screen5Kb1.js - Layar 5: KB 1 (Konsep Dasar Logika Keputusan & Flowchart)
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

  container.innerHTML = `
    <article class="screen-enter space-y-12 pb-12">
      <header class="pb-6 border-b-2 border-line-strong space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <span class="chapter-numeral text-5xl sm:text-6xl">05</span>
            <div class="border-l-2 border-line-strong pl-3.5">
              <p class="editorial-index">Kegiatan Belajar 1 · 35 Menit</p>
              <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Konsep Dasar Logika Keputusan &amp; Flowchart
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
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

        <p class="prose-wb text-sm sm:text-[15.5px] text-ink-muted">
          Sebelum menulis baris kode di komputer, kita perlu melatih cara berpikir logis terlebih dahulu. Di bab ini kamu akan memahami bagaimana komputer mengambil keputusan memakai nilai <strong>Benar (True)</strong> dan <strong>Salah (False)</strong>, membaca simbol diagram alir (<em>flowchart</em>), serta mengujinya langsung lewat simulasi.
        </p>
      </header>

      <!-- Subbab 5.1 -->
      <section class="space-y-4">
        <div>
          <p class="editorial-index">Subbab 5.1 · Dasar Logika</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Apa Itu Kondisi Logis (Benar / Salah)?
          </h2>
        </div>

        <div class="prose-wb text-[15.5px] space-y-3.5">
          <p>
            Setiap hari tanpa sadar kita selalu membuat keputusan. Sebelum berangkat ke SMP Negeri 9 Samarinda, kamu melihat langit: <em>"Apakah di luar sedang hujan?"</em> Jika <strong>Ya</strong>, kamu memakai jas hujan. Jika <strong>Tidak</strong>, kamu langsung berangkat. Saat hendak membeli makanan di kantin, kamu mengecek saku: <em>"Apakah uang jajanku cukup minimal Rp10.000?"</em>
          </p>
          <p>
            Di dalam ilmu komputer, pertanyaan syarat semacam itu disebut <strong>kondisi logis</strong>. Berbeda dengan manusia yang kadang menjawab "mungkin" atau "lumayan", komputer hanya mengenal tepat <strong>dua nilai kebenaran</strong> yang disebut nilai <button type="button" data-glossary-term="Boolean" class="text-cobalt font-semibold underline decoration-dotted underline-offset-4 cursor-pointer">Boolean</button>:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div class="wb-callout-emerald">
            <p class="font-mono text-xs font-bold uppercase tracking-wider text-ink">1. Benar (True)</p>
            <p class="text-sm text-ink mt-1">Kondisi terpenuhi. Program menjalankan langkah pada cabang <strong>YA</strong>.</p>
          </div>
          <div class="wb-callout-coral">
            <p class="font-mono text-xs font-bold uppercase tracking-wider text-ink">2. Salah (False)</p>
            <p class="text-sm text-ink mt-1">Kondisi tidak terpenuhi. Program beralih ke cabang <strong>TIDAK</strong>.</p>
          </div>
        </div>

        <div class="wb-sheet overflow-x-auto">
          <table class="wb-table min-w-[560px]">
            <thead>
              <tr>
                <th>Situasi Keseharian</th>
                <th>Pertanyaan Kondisi</th>
                <th>Jika Benar (True)</th>
                <th>Jika Salah (False)</th>
              </tr>
            </thead>
            <tbody>
              ${KB1_EVERYDAY_EXAMPLES.map(
                (ex) => `
                <tr>
                  <td class="font-semibold text-ink">${ex.context}</td>
                  <td><code class="font-mono text-xs bg-cobalt-soft text-cobalt px-2 py-0.5 rounded">${ex.condition}</code></td>
                  <td class="text-sm text-ink"><span class="inline-block w-2 h-2 rounded-full bg-emerald mr-1.5"></span>${ex.trueAction}</td>
                  <td class="text-sm text-ink-muted"><span class="inline-block w-2 h-2 rounded-full bg-coral mr-1.5"></span>${ex.falseAction}</td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>
        </div>

        <aside class="wb-callout max-w-3xl">
          <p class="font-display font-bold text-sm text-ink flex items-center gap-1.5">
            ${icon('info', 16, 'text-ink')}
            <span>Catatan Penting</span>
          </p>
          <p class="text-sm text-ink mt-1 leading-relaxed">
            Kalimat seperti <em>"Nilai yang bagus"</em> atau <em>"Baterai agak habis"</em> belum bisa dipahami komputer karena batas angkanya tidak jelas. Ubahlah selalu menjadi syarat angka yang tegas, misalnya <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">nilai &gt;= 75</code> atau <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">baterai &lt; 20</code>.
          </p>
        </aside>
      </section>

      <!-- Subbab 5.2 -->
      <section class="space-y-4 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Subbab 5.2 · Diagram Alir</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            5 Simbol Dasar Diagram Alir (Flowchart)
          </h2>
        </div>

        <p class="prose-wb text-[15.5px]">
          <strong>Flowchart</strong> (diagram alir) adalah peta bergambar yang menunjukkan urutan kerja sebuah program dari awal hingga akhir. Setiap bentuk punya fungsi khusus agar siapa pun yang membacanya langsung mengerti alur keputusannya.
        </p>

        <div class="wb-sheet overflow-x-auto">
          <table class="wb-table min-w-[600px]">
            <thead>
              <tr>
                <th class="w-32">Bentuk Simbol</th>
                <th class="w-48">Nama &amp; Peran</th>
                <th>Penjelasan &amp; Contoh Penggunaan</th>
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
                    <p class="font-mono text-xs text-ink-muted mt-1">Contoh isi: <code class="bg-canvas px-1.5 py-0.5 rounded border border-line text-ink">${sym.example}</code></p>
                  </td>
                </tr>
              `
              ).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Subbab 5.3 -->
      <section class="space-y-4 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Subbab 5.3 · Operator Logika</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Tabel 6 Operator Perbandingan
          </h2>
        </div>

        <p class="prose-wb text-[15.5px]">
          Di dalam simbol <strong>Belah Ketupat</strong>, kita membandingkan dua data memakai enam <strong>operator perbandingan</strong> standar berikut. Cermati contoh angka konkretnya, terutama perbedaan antara <code class="font-mono font-semibold text-cobalt">&gt;</code> dan <code class="font-mono font-semibold text-cobalt">&gt;=</code>.
        </p>

        <div class="wb-sheet overflow-x-auto">
          <table class="wb-table min-w-[620px]">
            <thead>
              <tr>
                <th class="w-24">Operator</th>
                <th class="w-48">Arti</th>
                <th>Contoh Pengujian</th>
                <th class="w-28">Hasil</th>
              </tr>
            </thead>
            <tbody>
              ${KB1_OPERATORS.map(
                (op) => `
                <tr>
                  <td>
                    <code class="font-mono text-base font-bold px-2.5 py-1 rounded bg-cobalt-soft text-cobalt border border-cobalt/40 inline-block">${op.symbol}</code>
                  </td>
                  <td>
                    <p class="font-semibold text-sm text-ink">${op.name}</p>
                    <p class="text-xs text-ink-muted mt-0.5">${op.meaning}</p>
                  </td>
                  <td>
                    <code class="font-mono text-xs text-ink bg-canvas px-2 py-1 rounded border border-line inline-block">${op.example}</code>
                    <p class="text-xs text-ink-muted mt-1">${op.note}</p>
                  </td>
                  <td class="align-middle">
                    <span class="font-mono text-xs font-bold px-2.5 py-1 rounded border ${
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

        <aside class="wb-callout-coral max-w-3xl">
          <p class="font-display font-bold text-sm text-ink flex items-center gap-1.5">
            ${icon('alert', 16, 'text-coral')}
            <span>Perhatikan Perbedaan Tanda "=" dan "=="</span>
          </p>
          <p class="text-sm text-ink mt-1 leading-relaxed">
            Satu tanda sama dengan (<code class="font-mono font-bold">=</code>) berarti <strong>menyimpan nilai</strong>, misalnya <code class="font-mono">nilai = 80</code> (memasukkan angka 80 ke variabel nilai). Sedangkan dua tanda sama dengan (<code class="font-mono font-bold">==</code>) berarti <strong>membandingkan apakah sama</strong>, misalnya <code class="font-mono">nilai == 80</code>.
          </p>
        </aside>
      </section>

      <!-- Subbab 5.4 -->
      <section class="space-y-4 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Subbab 5.4 · Bentuk Alur</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Keputusan Tunggal vs Keputusan Majemuk (Bertingkat)
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="wb-sheet p-5 space-y-2.5 border-t-4 border-t-cobalt">
            <span class="font-mono text-xs font-bold uppercase text-cobalt">1. Keputusan Tunggal</span>
            <h3 class="font-display font-bold text-lg text-ink">Satu Belah Ketupat (2 Jalur)</h3>
            <p class="text-sm text-ink-muted leading-relaxed">
              Hanya menguji satu pertanyaan syarat. Cocok untuk persoalan dengan dua pilihan akhir, misalnya status <strong>Lulus KKM</strong> (<code class="font-mono text-ink">nilai &gt;= 75</code>) atau <strong>Perlu Remedial</strong>.
            </p>
            <p class="font-mono text-xs bg-canvas p-2.5 rounded border border-line text-ink">
              nilai &gt;= 75 ?  →  [YA: Lulus]  |  [TIDAK: Remedial]
            </p>
          </div>

          <div class="wb-sheet p-5 space-y-2.5 border-t-4 border-t-amber">
            <span class="font-mono text-xs font-bold uppercase text-ink">2. Keputusan Majemuk (Bertingkat)</span>
            <h3 class="font-display font-bold text-lg text-ink">Lebih dari Satu Belah Ketupat (3+ Jalur)</h3>
            <p class="text-sm text-ink-muted leading-relaxed">
              Ketika kemungkinan hasil lebih dari dua (misalnya <strong>Predikat A, B, dan C</strong>), jalur TIDAK dari belah ketupat pertama dihubungkan ke belah ketupat kedua untuk menguji syarat berikutnya.
            </p>
            <p class="font-mono text-xs bg-canvas p-2.5 rounded border border-line text-ink">
              &gt;= 90 ? → [A] | TIDAK → &gt;= 75 ? → [B] | TIDAK → [C]
            </p>
          </div>
        </div>
      </section>

      <!-- Subbab 5.5: Simulasi -->
      <section class="space-y-3 pt-6 wb-rule" id="kb1-sim-section">
        <div class="prose-wb">
          <p class="editorial-index">Praktik Langsung</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Coba Sendiri: Simulasi Flowchart Interaktif
          </h2>
          <p class="text-sm text-ink-muted mt-1">
            Pilih salah satu skenario di bawah ini, geser nilai uji (coba angka batas seperti <code class="font-mono text-ink">74</code>, <code class="font-mono text-ink">75</code>, dan <code class="font-mono text-ink">90</code>), lalu amati panah jalur warna mana yang menyala.
          </p>
        </div>

        <div id="kb1-flowchart-sim-mount"></div>
      </section>

      <!-- Rangkuman -->
      <section class="space-y-4 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Intisari Bab</p>
          <h2 class="font-display font-bold text-xl text-ink mt-0.5">Rangkuman Visual KB 1</h2>
        </div>

        <div class="wb-sheet p-5 bg-canvas space-y-4">
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-xs">
            <span class="px-3 py-1.5 rounded-full bg-surface border border-line-strong font-semibold">1. Input Data</span>
            <span class="text-ink-muted">${icon('arrowRight', 15)}</span>
            <span class="px-3 py-1.5 rounded bg-cobalt-soft border border-cobalt text-cobalt font-bold">2. Uji Kondisi (==, &gt;=, &lt;)</span>
            <span class="text-ink-muted">${icon('arrowRight', 15)}</span>
            <span class="px-3 py-1.5 rounded bg-emerald-soft border border-emerald font-semibold">YA (True)</span>
            <span class="text-ink-muted">/</span>
            <span class="px-3 py-1.5 rounded bg-coral-soft border border-coral font-semibold">TIDAK (False)</span>
            <span class="text-ink-muted">${icon('arrowRight', 15)}</span>
            <span class="px-3 py-1.5 rounded-full bg-surface border border-line-strong font-semibold">3. Output</span>
          </div>

          <ul class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-line text-sm">
            <li>
              <strong class="font-display text-ink block">Nilai Boolean Tegas</strong>
              <span class="text-ink-muted text-xs leading-relaxed">Setiap syarat keputusan pasti menghasilkan tepat satu nilai: <code class="font-mono text-ink">True</code> atau <code class="font-mono text-ink">False</code>.</span>
            </li>
            <li>
              <strong class="font-display text-ink block">Belah Ketupat = Keputusan</strong>
              <span class="text-ink-muted text-xs leading-relaxed">Selalu punya 1 panah masuk dan 2 panah keluar (YA &amp; TIDAK) menuju langkah selanjutnya.</span>
            </li>
            <li>
              <strong class="font-display text-ink block">Teliti di Nilai Batas</strong>
              <span class="text-ink-muted text-xs leading-relaxed">Gunakan <code class="font-mono text-ink">&gt;=</code> jika angka batas ikut lulus (75 &gt;= 75 adalah True), dan <code class="font-mono text-ink">==</code> untuk membandingkan kesamaan.</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Kuis Formatif KB 1 -->
      <section class="space-y-3 pt-6 wb-rule" id="kb1-quiz-section">
        <div id="kb1-quiz-mount"></div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s5-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Kembali: Daftar Isi</span>
        </button>
        <button type="button" id="s5-next" class="wb-btn-primary">
          <span>Lanjut ke KB 2: Percabangan Blok Visual</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  mountKb1FlowchartSim(document.getElementById('kb1-flowchart-sim-mount'));

  mountFormativeQuiz(document.getElementById('kb1-quiz-mount'), {
    quizId: 'kb1-quiz',
    title: 'Kuis Formatif KB 1: Logika & Flowchart',
    subtitle: 'Jawab 5 soal berikut untuk mengukur pemahamanmu terhadap materi KB 1.',
    questions: KB1_QUIZ,
    savedAnswers: kb1.quizAnswers,
    savedScore: kb1.quizScore,
    onSubmit: (score, total, answers) => {
      saveKb1Quiz(score, total, answers);
      showToast(`Kuis KB 1 selesai. Skor: ${score}/${total}.`);
    },
    onReset: () => {
      resetKb1Quiz();
      showToast('Kuis KB 1 direset. Silakan coba kembali.');
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
