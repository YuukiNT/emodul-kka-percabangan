/**
 * screen6Kb2.js - Layar 6: KB 2 (Percabangan Blok Visual)
 */

import { KB2_QUIZ, KB2_STRUCTURES } from '../data/kb2Data.js';
import { getState, resetKb2Quiz, saveKb2Quiz } from '../storage/localStore.js';
import { mountKb2BlockSim } from '../simulations/kb2BlockSim.js';
import { mountFormativeQuiz } from '../components/formativeQuiz.js';
import { icon } from '../components/icons.js';

function staticBlockClass(kind) {
  if (kind === 'if') return 'puzzle-block--if';
  if (kind === 'elif') return 'puzzle-block--elif';
  if (kind === 'else') return 'puzzle-block--else';
  if (kind === 'action-amber') return 'puzzle-block--action-amber';
  if (kind === 'action-false') return 'puzzle-block--action-false';
  return 'puzzle-block--action-true';
}

export function renderScreen6Kb2(container, { navigate, openGlossary, openNotes, showToast }) {
  const { kb2 } = getState();

  container.innerHTML = `
    <article class="screen-enter space-y-12 pb-12">
      <header class="pb-6 border-b-2 border-line-strong space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <span class="chapter-numeral text-5xl sm:text-6xl">06</span>
            <div class="border-l-2 border-line-strong pl-3.5">
              <p class="editorial-index">Kegiatan Belajar 2 · 40 Menit</p>
              <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Percabangan Berbasis Blok Visual
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" id="kb2-open-glossary" class="wb-btn-ghost text-xs border border-line">
              ${icon('book', 14, 'text-cobalt')}
              <span>Kamus</span>
            </button>
            <button type="button" id="kb2-open-notes" class="wb-btn-ghost text-xs border border-line">
              ${icon('notebook', 14, 'text-cobalt')}
              <span>Catat Poin</span>
            </button>
          </div>
        </div>

        <p class="prose-wb text-sm sm:text-[15.5px] text-ink-muted">
          Di KB 1 kamu sudah mempelajari alur flowchart. Sekarang kita akan menyusun alur keputusan tersebut ke dalam <strong>blok visual saling mengunci</strong> sebelum mulai menulis kode Python secara langsung di KB 3.
        </p>
      </header>

      <!-- Subbab 6.1 -->
      <section class="space-y-4">
        <div>
          <p class="editorial-index">Subbab 6.1 · Pengenalan Blok</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Mengapa Mulai dari Blok Visual?
          </h2>
        </div>

        <div class="prose-wb text-[15.5px] space-y-3">
          <p>
            Saat langsung mengetik kode teks seperti Python, satu kesalahan kecil (misalnya lupa tanda titik dua <code class="font-mono font-bold text-cobalt">:</code>, salah ketik <code class="font-mono">prnit</code>, atau kurang spasi) bisa membuat program gagal berjalan karena <button type="button" data-glossary-term="Sintaks" class="text-cobalt font-semibold underline decoration-dotted underline-offset-4 cursor-pointer">kesalahan sintaks</button>.
          </p>
          <p>
            Dengan <strong>blok visual</strong>, setiap perintah sudah berbentuk kepingan puzzle yang saling mengunci. Kamu bisa melihat dengan jelas blok aksi mana yang <strong>menjorok ke dalam</strong> (milik sebuah cabang kondisi), sehingga lebih mudah memusatkan perhatian pada alur logikanya.
          </p>
        </div>
      </section>

      <!-- Subbab 6.2 -->
      <section class="space-y-6 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Subbab 6.2 · Tiga Pola Percabangan</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Mengenal Struktur if, if-else, dan if-elif-else
          </h2>
        </div>

        <div class="space-y-6">
          ${KB2_STRUCTURES.map(
            (st) => `
            <article class="wb-sheet p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div class="lg:col-span-6 space-y-2.5">
                <span class="font-mono text-xs font-bold uppercase tracking-wider text-cobalt">${st.label}</span>
                <h3 class="font-display font-bold text-lg sm:text-xl text-ink">${st.title}</h3>
                <p class="text-sm text-ink leading-relaxed">${st.when}</p>
                <p class="text-xs text-ink-muted bg-canvas border-l-2 border-line-strong pl-3 py-1.5">
                  <strong class="text-ink">${st.context}</strong>
                </p>
                <p class="text-xs font-mono text-ink-muted pt-1">
                  Penelusuran: ${st.trace}
                </p>
              </div>

              <div class="lg:col-span-6 bg-canvas border border-line rounded-md p-4">
                <p class="font-mono text-[10.5px] uppercase tracking-wider text-ink-muted mb-3">Ilustrasi Kepingan Blok Puzzle:</p>
                <div class="space-y-1.5" style="--puzzle-cutout-bg: var(--color-canvas);">
                  ${st.blocks
                    .map(
                      (b) => `
                      <div class="puzzle-block ${staticBlockClass(b.kind)} ${b.indent ? 'puzzle-block--indent' : ''} cursor-default">
                        <span>${b.text}</span>
                      </div>
                    `
                    )
                    .join('')}
                </div>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </section>

      <!-- Callout Urutan Kondisi -->
      <section class="pt-4">
        <div class="wb-sheet-framed border-amber overflow-hidden">
          <div class="px-5 py-3.5 bg-amber-soft border-b border-line-strong flex items-center gap-2">
            ${icon('alert', 20, 'text-ink')}
            <div>
              <p class="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">Konsep Penting</p>
              <h3 class="font-display font-bold text-lg text-ink">Hati-Hati Urutan Kondisi pada if - elif - else</h3>
            </div>
          </div>

          <div class="p-5 sm:p-6 space-y-4 bg-surface">
            <p class="prose-wb text-sm sm:text-[15px]">
              Komputer memeriksa syarat secara berurutan <strong>dari atas ke bawah</strong>, lalu segera <strong>berhenti</strong> begitu menemukan cabang pertama yang bernilai <code class="font-mono font-bold text-emerald">True</code>. Perhatikan apa yang terjadi saat <code class="font-mono font-bold text-cobalt">nilai = 95</code> jika urutan syaratnya terbalik:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-md border-[1.5px] border-coral bg-coral-soft/55 space-y-2">
                <p class="font-mono text-xs font-bold uppercase text-coral flex items-center gap-1.5">
                  ${icon('alert', 15)}
                  <span>Urutan Keliru (Logika Salah)</span>
                </p>
                <pre class="font-mono text-xs bg-surface p-3 rounded border border-coral/40 overflow-x-auto leading-relaxed">if nilai &gt;= 75:       # 95 &gt;= 75 -&gt; TRUE!
    print("Predikat B")  # Langsung berhenti di sini
elif nilai &gt;= 90:     # Baris ini tidak pernah dicek
    print("Predikat A")</pre>
                <p class="text-xs text-ink leading-relaxed">
                  Siswa bernilai <strong>95</strong> malah mendapat <strong>Predikat B</strong> karena syarat <code class="font-mono">&gt;= 75</code> sudah terpenuhi duluan.
                </p>
              </div>

              <div class="p-4 rounded-md border-[1.5px] border-emerald bg-emerald-soft/55 space-y-2">
                <p class="font-mono text-xs font-bold uppercase text-emerald flex items-center gap-1.5">
                  ${icon('checkCircle', 15)}
                  <span>Urutan Tepat (Tertinggi ke Terendah)</span>
                </p>
                <pre class="font-mono text-xs bg-surface p-3 rounded border border-emerald/40 overflow-x-auto leading-relaxed">if nilai &gt;= 90:       # 95 &gt;= 90 -&gt; TRUE!
    print("Predikat A")  # Tepat dapat Predikat A
elif nilai &gt;= 75:     # Diperiksa hanya jika nilai 75..89
    print("Predikat B")</pre>
                <p class="text-xs text-ink leading-relaxed">
                  <strong>Aturan praktis:</strong> untuk rentang nilai dengan operator <code class="font-mono">&gt;=</code>, selalu uji batas <strong>paling tinggi</strong> terlebih dahulu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Simulasi Blok -->
      <section class="space-y-3 pt-6 wb-rule" id="kb2-sim-section">
        <div class="prose-wb">
          <p class="editorial-index">Praktik Langsung</p>
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink mt-0.5">
            Simulasi Penyusunan Blok Visual &amp; Kode Python
          </h2>
          <p class="text-sm text-ink-muted mt-1">
            Selesaikan <strong>Level 1</strong> dan <strong>Level 2</strong> dengan menyeret blok (di komputer lab) atau cukup mengetuk blok (di HP). Amati bagaimana kode Python di sebelah kanan terbentuk otomatis.
          </p>
        </div>

        <div id="kb2-block-sim-mount"></div>
      </section>

      <!-- Rangkuman -->
      <section class="space-y-4 pt-6 wb-rule">
        <div>
          <p class="editorial-index">Intisari Bab</p>
          <h2 class="font-display font-bold text-xl text-ink mt-0.5">Rangkuman Visual KB 2</h2>
        </div>

        <div class="wb-sheet overflow-x-auto">
          <table class="wb-table min-w-[540px]">
            <thead>
              <tr>
                <th>Struktur</th>
                <th>Jumlah Pilihan Hasil</th>
                <th>Kapan Digunakan?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code class="font-mono font-bold text-cobalt">if</code></td>
                <td class="font-mono text-xs">1 aksi opsional</td>
                <td class="text-sm">Hanya bertindak bila syarat benar; bila salah tidak melakukan apa-apa (misal pengingat baterai &lt; 20%).</td>
              </tr>
              <tr>
                <td><code class="font-mono font-bold text-cobalt">if - else</code></td>
                <td class="font-mono text-xs">Tepat 2 hasil</td>
                <td class="text-sm">Dua pilihan saling berlawanan yang salah satunya pasti berjalan (misal Lulus KKM atau Remedial).</td>
              </tr>
              <tr>
                <td><code class="font-mono font-bold text-cobalt">if - elif - else</code></td>
                <td class="font-mono text-xs">3 hasil atau lebih</td>
                <td class="text-sm">Banyak tingkatan syarat; selalu susun batas paling tinggi di baris teratas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Kuis Formatif KB 2 -->
      <section class="space-y-3 pt-6 wb-rule" id="kb2-quiz-section">
        <div id="kb2-quiz-mount"></div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s6-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Kembali: KB 1 Flowchart</span>
        </button>
        <button type="button" id="s6-next" class="wb-btn-primary">
          <span>Lanjut ke KB 3: Kode Python</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  mountKb2BlockSim(document.getElementById('kb2-block-sim-mount'));

  mountFormativeQuiz(document.getElementById('kb2-quiz-mount'), {
    quizId: 'kb2-quiz',
    title: 'Kuis Formatif KB 2: Percabangan Blok Visual',
    subtitle: 'Uji pemahamanmu mengenai struktur blok, urutan kondisi, dan hasil outputnya.',
    questions: KB2_QUIZ,
    savedAnswers: kb2.quizAnswers,
    savedScore: kb2.quizScore,
    onSubmit: (score, total, answers) => {
      saveKb2Quiz(score, total, answers);
      showToast(`Kuis KB 2 selesai. Skor: ${score}/${total}.`);
    },
    onReset: () => {
      resetKb2Quiz();
      showToast('Kuis KB 2 direset. Silakan coba kembali.');
    },
  });

  document.getElementById('kb2-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('kb2-open-notes')?.addEventListener('click', () => openNotes());
  container.querySelectorAll('[data-glossary-term]').forEach((btn) => {
    btn.addEventListener('click', () => openGlossary(btn.getAttribute('data-glossary-term')));
  });

  document.getElementById('s6-prev')?.addEventListener('click', () => navigate(5));
  document.getElementById('s6-next')?.addEventListener('click', () => navigate(7));
}
