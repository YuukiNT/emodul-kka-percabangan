/**
 * screen6Kb2.js - Layar 6: KB 2 (Percabangan Berbasis Blok Visual)
 * - Dibuka dengan Eksperimen Interaktif 10 Detik (melihat blok menyala saat nilai diubah)
 * - Penjelasan 3 struktur mengalir bersih tanpa tumpukan kotak berlapis
 * - Simulasi interaktif Jebakan Urutan Kondisi + Papan Puzzle Sinkron Python + Kuis Bertahap
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
  let hookScore = 82;
  let orderMode = 'wrong'; // 'wrong' | 'right'

  function updateHookBlocks() {
    const passed = hookScore >= 75;
    container.querySelectorAll('[data-kb2-hook-val]').forEach((btn) => {
      const v = Number(btn.getAttribute('data-kb2-hook-val'));
      const active = v === hookScore;
      btn.className = `min-h-[38px] px-3.5 py-1.5 rounded-md border text-xs font-mono tabular-nums font-bold cursor-pointer transition-colors ${
        active
          ? 'bg-ink text-surface border-ink'
          : 'bg-surface text-ink border-line-strong hover:bg-canvas'
      }`;
    });

    const bIf = container.querySelector('#kb2-hb-if');
    const bTrue = container.querySelector('#kb2-hb-true');
    const bElse = container.querySelector('#kb2-hb-else');
    const bFalse = container.querySelector('#kb2-hb-false');
    const note = container.querySelector('#kb2-hb-note');

    bIf?.classList.toggle('is-executing', passed);
    bTrue?.classList.toggle('is-executing', passed);
    bIf?.classList.toggle('is-dimmed-exec', !passed);
    bTrue?.classList.toggle('is-dimmed-exec', !passed);

    bElse?.classList.toggle('is-executing', !passed);
    bFalse?.classList.toggle('is-executing', !passed);
    bElse?.classList.toggle('is-dimmed-exec', passed);
    bFalse?.classList.toggle('is-dimmed-exec', passed);

    if (note) {
      note.innerHTML = passed
        ? `Saat <code class="font-mono font-bold">nilai = ${hookScore}</code>, syarat <code class="font-mono">nilai &gt;= 75</code> bernilai <strong class="text-emerald">True</strong>. Komputer masuk ke blok <strong>CETAK "Lulus KKM"</strong> yang menjorok di bawah JIKA, lalu melompati bagian SELAIN ITU.`
        : `Saat <code class="font-mono font-bold">nilai = ${hookScore}</code>, syarat <code class="font-mono">nilai &gt;= 75</code> bernilai <strong class="text-coral">False</strong>. Komputer melewati isi JIKA dan menjalankan blok yang menjorok di bawah <strong>SELAIN ITU</strong>.`;
    }
  }

  function updateOrderBugDemo() {
    const isWrong = orderMode === 'wrong';
    container.querySelectorAll('[data-order-mode]').forEach((btn) => {
      const active = btn.getAttribute('data-order-mode') === orderMode;
      btn.className = `min-h-[38px] px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer transition-colors ${
        active
          ? 'bg-ink text-surface border-ink'
          : 'bg-surface text-ink border-line-strong hover:bg-canvas'
      }`;
    });

    const panel = container.querySelector('#kb2-order-demo-body');
    if (!panel) return;

    if (isWrong) {
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center quiz-step-enter">
          <pre class="md:col-span-7 font-mono text-xs sm:text-[13px] bg-canvas p-3.5 rounded-md border border-coral overflow-x-auto leading-relaxed">nilai = 95

<span class="bg-coral-soft px-1 font-bold">if nilai &gt;= 75:       # 95 &gt;= 75 bernilai True!</span>
<span class="bg-coral-soft px-1 font-bold">    print("Predikat B")  # Berhenti di sini!</span>
<span class="opacity-45">elif nilai &gt;= 90:     # Tidak pernah sempat dicek
    print("Predikat A")</span></pre>
          <div class="md:col-span-5 wb-callout-coral text-sm space-y-1">
            <p class="font-display font-bold text-ink">Output Keliru: "Predikat B"</p>
            <p class="text-xs text-ink leading-relaxed">
              Padahal nilainya <strong>95</strong>! Karena <code class="font-mono">95 &gt;= 75</code> ditaruh di baris pertama dan sudah bernilai True, komputer langsung berhenti dan tidak pernah membaca baris <code class="font-mono">&gt;= 90</code>.
            </p>
          </div>
        </div>
      `;
    } else {
      panel.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center quiz-step-enter">
          <pre class="md:col-span-7 font-mono text-xs sm:text-[13px] bg-canvas p-3.5 rounded-md border border-emerald overflow-x-auto leading-relaxed">nilai = 95

<span class="bg-emerald-soft px-1 font-bold">if nilai &gt;= 90:       # 95 &gt;= 90 bernilai True!</span>
<span class="bg-emerald-soft px-1 font-bold">    print("Predikat A")  # Tepat mencetak Predikat A</span>
<span class="opacity-55">elif nilai &gt;= 75:     # Hanya dicek bila nilai 75..89
    print("Predikat B")</span></pre>
          <div class="md:col-span-5 wb-callout-emerald text-sm space-y-1">
            <p class="font-display font-bold text-ink">Output Tepat: "Predikat A"</p>
            <p class="text-xs text-ink leading-relaxed">
              Dengan menaruh syarat tertinggi (<code class="font-mono">&gt;= 90</code>) di urutan paling atas, nilai 95 tertangkap di Predikat A, sedangkan nilai 75 sampai 89 masuk ke <code class="font-mono">elif nilai &gt;= 75</code>.
            </p>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <article class="screen-enter space-y-12 pb-12">
      <!-- Pembuka Bab -->
      <header class="pb-6 border-b border-line space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="editorial-index">Kegiatan Belajar 2 · Estimasi 40 Menit</p>
          <div class="flex items-center gap-1.5">
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

        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">06</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Percabangan Berbasis Blok Visual
          </h1>
        </div>

        <p class="prose-wb text-ink-muted text-base">
          Di KB 1 kamu sudah membaca peta <em>flowchart</em>. Sekarang kita merangkai keputusan tersebut memakai <strong>kepingan blok puzzle</strong> yang saling mengunci — cara teraman melatih logika koding tanpa takut salah ketik tanda baca.
        </p>
      </header>

      <!-- PEMICU INTERAKTIF 10 DETIK: Sentuh Blok Pertama -->
      <section class="wb-stage p-5 sm:p-6 space-y-4" aria-label="Eksperimen pembuka blok visual">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display font-bold text-base sm:text-lg text-ink">
            Sentuh Dulu: Lihat Bagaimana Blok Memilih Jalur
          </h2>
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs text-ink-muted mr-1">Ketuk nilai uji:</span>
            <button type="button" data-kb2-hook-val="82">nilai = 82</button>
            <button type="button" data-kb2-hook-val="64">nilai = 64</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div class="md:col-span-7 bg-canvas p-4 rounded-md border border-line space-y-1.5" style="--puzzle-cutout-bg: var(--color-canvas);">
            <div id="kb2-hb-if" class="puzzle-block puzzle-block--if cursor-default">JIKA  nilai &gt;= 75  :</div>
            <div id="kb2-hb-true" class="puzzle-block puzzle-block--action-true puzzle-block--indent cursor-default">CETAK  "Lulus KKM"</div>
            <div id="kb2-hb-else" class="puzzle-block puzzle-block--else cursor-default">SELAIN ITU  :</div>
            <div id="kb2-hb-false" class="puzzle-block puzzle-block--action-false puzzle-block--indent cursor-default">CETAK  "Ikuti Remedial"</div>
          </div>

          <div class="md:col-span-5 space-y-2">
            <p id="kb2-hb-note" class="text-sm text-ink leading-relaxed"></p>
            <p class="text-xs text-ink-muted">
              Perhatikan blok <strong>CETAK</strong> yang menjorok ke kanan: posisi menjorok itu disebut <button type="button" data-glossary-term="Indentasi" class="text-cobalt font-semibold underline decoration-dotted underline-offset-4 cursor-pointer">indentasi</button>.
            </p>
          </div>
        </div>
      </section>

      <!-- 6.1 Mengapa Blok Visual? (Terbuka di Atas Kanvas) -->
      <section class="space-y-3.5">
        <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
          <span class="section-num">6.1</span>Mengapa Memulai dari Blok Puzzle?
        </h2>
        <div class="prose-wb space-y-3">
          <p>
            Saat pemula langsung mengetik kode teks, satu kesalahan sepele — seperti lupa tanda titik dua (<code class="font-mono font-bold text-cobalt">:</code>) atau salah mengeja <code class="font-mono">prnit</code> — langsung menghentikan program akibat <button type="button" data-glossary-term="Sintaks" class="text-cobalt font-semibold underline decoration-dotted underline-offset-4 cursor-pointer">kesalahan sintaks</button>.
          </p>
          <p>
            Kepingan blok bergigi membebaskanmu dari masalah salah ketik itu. Lekukan di sisi atas dan tonjolan di sisi bawah menunjukkan dengan jelas bagaimana perintah saling tersambung dari atas ke bawah.
          </p>
        </div>
      </section>

      <!-- 6.2 Tiga Pola Percabangan (Alur Editorial Terbuka dengan Garis Pemisah) -->
      <section class="space-y-6 pt-8 wb-rule">
        <div class="space-y-1">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">6.2</span>Tiga Struktur Percabangan yang Wajib Kamu Kenali
          </h2>
          <p class="prose-wb text-sm text-ink-muted">
            Pilih struktur sesuai banyaknya kemungkinan hasil pada masalah yang ingin diselesaikan:
          </p>
        </div>

        <div class="divide-y divide-line border-t border-b border-line">
          ${KB2_STRUCTURES.map(
            (st, idx) => `
            <article class="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div class="lg:col-span-6 space-y-2">
                <span class="font-mono text-xs font-bold text-cobalt tabular-nums">Pola 0${idx + 1}</span>
                <h3 class="font-display font-bold text-lg text-ink">${st.title}</h3>
                <p class="text-sm text-ink leading-relaxed">${st.when}</p>
                <p class="text-xs text-ink-muted pt-1"><strong>${st.context}</strong> · ${st.trace}</p>
              </div>

              <div class="lg:col-span-6 bg-surface border border-line rounded-md p-4" style="--puzzle-cutout-bg: var(--color-surface);">
                <div class="space-y-1.5">
                  ${st.blocks
                    .map(
                      (b) => `
                      <div class="puzzle-block ${staticBlockClass(b.kind)} ${b.indent ? 'puzzle-block--indent' : ''} cursor-default !text-xs sm:!text-[13px]">
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

      <!-- 6.3 Jebakan Urutan Kondisi (Eksperimen Perbandingan Interaktif) -->
      <section class="space-y-4 pt-8 wb-rule">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
              <span class="section-num">6.3</span>Hati-Hati Urutan Kondisi pada <code class="font-mono text-cobalt">if - elif - else</code>
            </h2>
            <p class="prose-wb text-sm text-ink-muted">
              Komputer mengecek dari atas ke bawah dan langsung berhenti pada cabang pertama yang bernilai <strong>True</strong>. Klik tombol di kanan untuk melihat efeknya saat <code class="font-mono text-ink font-semibold">nilai = 95</code>:
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" data-order-mode="wrong">1. Urutan Terbalik (Bug)</button>
            <button type="button" data-order-mode="right">2. Urutan Benar (&gt;= 90 Dulu)</button>
          </div>
        </div>

        <div id="kb2-order-demo-body" class="pt-1"></div>
      </section>

      <!-- 6.4 Panggung Utama: Simulasi Penyusunan Blok Visual & Kode Python -->
      <section class="space-y-3 pt-8 wb-rule" id="kb2-sim-section">
        <div class="prose-wb">
          <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
            <span class="section-num">6.4</span>Praktik: Susun Blok Puzzle &amp; Amati Kode Python-nya
          </h2>
          <p class="text-sm text-ink-muted mt-1">
            Selesaikan <strong>Level 1</strong> dan <strong>Level 2</strong>. Setelah susunanmu benar, geser nilai uji di panel kanan untuk melihat blok dan baris Python mana yang menyala bersamaan!
          </p>
        </div>

        <div id="kb2-block-sim-mount"></div>
      </section>

      <!-- 6.5 Kuis Formatif Bertahap KB 2 -->
      <section class="pt-8 wb-rule" id="kb2-quiz-section">
        <div id="kb2-quiz-mount"></div>
      </section>

      <nav class="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button type="button" id="s6-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>KB 1: Flowchart</span>
        </button>
        <button type="button" id="s6-next" class="wb-btn-primary">
          <span>Lanjut ke KB 3: Kode Python</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </article>
  `;

  updateHookBlocks();
  updateOrderBugDemo();

  container.querySelectorAll('[data-kb2-hook-val]').forEach((btn) => {
    btn.addEventListener('click', () => {
      hookScore = Number(btn.getAttribute('data-kb2-hook-val'));
      updateHookBlocks();
    });
  });

  container.querySelectorAll('[data-order-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      orderMode = btn.getAttribute('data-order-mode') || 'wrong';
      updateOrderBugDemo();
    });
  });

  mountKb2BlockSim(document.getElementById('kb2-block-sim-mount'));

  mountFormativeQuiz(document.getElementById('kb2-quiz-mount'), {
    quizId: 'kb2-quiz',
    title: 'Kuis Formatif KB 2: Percabangan Blok Visual',
    subtitle: 'Satu soal per langkah dengan pembahasan langsung.',
    questions: KB2_QUIZ,
    savedAnswers: kb2.quizAnswers,
    savedScore: kb2.quizScore,
    onSubmit: (score, total, answers) => {
      saveKb2Quiz(score, total, answers);
      showToast(`Kuis KB 2 selesai. Skor: ${score}/${total}.`);
    },
    onReset: () => {
      resetKb2Quiz();
      showToast('Kuis KB 2 diulang dari nomor 1.');
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
