/**
 * formativeQuiz.js - Kuis Bertahap Satu-per-Satu (Brilliant.org / Khan Academy Pattern)
 * Menampilkan 1 soal fokus per langkah dengan umpan balik instan di tempat,
 * navigasi nomor soal, serta ringkasan hasil akhir tanpa perlu menggulung panjang.
 */

import { icon } from './icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function mountFormativeQuiz(container, {
  quizId,
  title,
  subtitle,
  questions,
  savedAnswers,
  savedScore,
  onSubmit,
  onReset,
}) {
  if (!container || !Array.isArray(questions) || questions.length === 0) return;

  const letters = ['A', 'B', 'C', 'D'];
  const alreadyCompleted = savedScore !== null && savedScore !== undefined;

  let currentIndex = 0;
  let answers = { ...(savedAnswers || {}) };
  let checkedMap = {};
  if (alreadyCompleted) {
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) checkedMap[q.id] = true;
    });
  }
  let viewMode = alreadyCompleted ? 'summary' : 'question'; // 'question' | 'summary'
  let hintWarning = '';

  function computeScore() {
    return questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
  }

  function allChecked() {
    return questions.every((q) => Boolean(checkedMap[q.id]));
  }

  function finalizeQuiz() {
    const finalScore = computeScore();
    viewMode = 'summary';
    if (typeof onSubmit === 'function') {
      onSubmit(finalScore, questions.length, { ...answers });
    }
    render();
  }

  function renderStepPills() {
    return questions
      .map((q, idx) => {
        const isCurrent = viewMode === 'question' && idx === currentIndex;
        const isChecked = Boolean(checkedMap[q.id]);
        const isCorrect = isChecked && answers[q.id] === q.correctIndex;

        let pillStyle = 'bg-canvas text-ink-muted border-line hover:border-line-strong';
        if (isCurrent) {
          pillStyle = 'bg-ink text-surface border-ink font-bold';
        } else if (isChecked && isCorrect) {
          pillStyle = 'bg-emerald-soft text-ink border-emerald font-semibold';
        } else if (isChecked && !isCorrect) {
          pillStyle = 'bg-coral-soft text-ink border-coral font-semibold';
        }

        return `
          <button
            type="button"
            data-quiz-jump="${idx}"
            aria-label="Ke soal nomor ${idx + 1}"
            class="w-8 h-8 rounded-md border text-xs font-mono tabular-nums flex items-center justify-center transition-colors cursor-pointer ${pillStyle}"
          >${idx + 1}</button>
        `;
      })
      .join('');
  }

  function renderQuestionView() {
    const q = questions[currentIndex];
    const selectedIdx = answers[q.id];
    const isChecked = Boolean(checkedMap[q.id]);
    const isCorrect = isChecked && selectedIdx === q.correctIndex;
    const isLast = currentIndex === questions.length - 1;

    return `
      <div class="p-5 sm:p-7 bg-surface space-y-5 quiz-step-enter">
        <!-- Meta Nomor & Topik -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="font-mono text-xs font-semibold text-cobalt tabular-nums">
            Soal ${currentIndex + 1} dari ${questions.length} · ${escapeHtml(q.level)}
          </span>
          ${
            isChecked
              ? `<span class="font-mono text-xs font-semibold inline-flex items-center gap-1 ${isCorrect ? 'text-emerald' : 'text-coral'}">
                  ${icon(isCorrect ? 'checkCircle' : 'alert', 14)}
                  ${isCorrect ? 'Jawaban Tepat' : 'Cermati Pembahasan'}
                </span>`
              : ''
          }
        </div>

        <!-- Pertanyaan -->
        <p class="font-sans font-semibold text-base sm:text-[17px] text-ink leading-relaxed">
          ${escapeHtml(q.question)}
        </p>

        <!-- Pilihan Jawaban Ramah Sentuh (>= 48px) -->
        <div class="space-y-2.5" role="radiogroup" aria-label="Pilihan jawaban soal ${currentIndex + 1}">
          ${q.options
            .map((opt, optIdx) => {
              const checked = selectedIdx === optIdx;
              let optionClass = 'border-line bg-canvas hover:border-line-strong';
              let badgeClass = 'bg-surface border-line-strong text-ink';

              if (!isChecked && checked) {
                optionClass = 'border-cobalt bg-cobalt-soft ring-1 ring-cobalt';
                badgeClass = 'bg-cobalt border-cobalt text-surface';
              } else if (isChecked) {
                if (optIdx === q.correctIndex) {
                  optionClass = 'border-emerald bg-emerald-soft';
                  badgeClass = 'bg-emerald border-emerald text-surface';
                } else if (checked && optIdx !== q.correctIndex) {
                  optionClass = 'border-coral bg-coral-soft';
                  badgeClass = 'bg-coral border-coral text-surface';
                } else {
                  optionClass = 'border-line bg-surface opacity-60';
                }
              }

              return `
                <label class="min-h-[48px] flex items-start gap-3 p-3.5 rounded-md border-[1.5px] transition-colors ${isChecked ? 'cursor-default' : 'cursor-pointer'} ${optionClass}">
                  <input
                    type="radio"
                    name="${quizId}-${q.id}"
                    value="${optIdx}"
                    ${checked ? 'checked' : ''}
                    ${isChecked ? 'disabled' : ''}
                    class="sr-only"
                  />
                  <span class="font-mono text-xs font-bold w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${badgeClass}">
                    ${letters[optIdx]}
                  </span>
                  <span class="text-sm sm:text-[15px] text-ink leading-relaxed flex-1">${escapeHtml(opt)}</span>
                </label>
              `;
            })
            .join('')}
        </div>

        ${
          hintWarning
            ? `<p class="text-xs sm:text-sm font-semibold text-coral flex items-center gap-1.5">${icon('alert', 15)} ${escapeHtml(hintWarning)}</p>`
            : ''
        }

        <!-- Umpan Balik Instan Langsung di Bawah Soal -->
        ${
          isChecked
            ? `
            <div class="${isCorrect ? 'wb-callout-emerald' : 'wb-callout'} text-sm space-y-1">
              <p class="font-display font-bold text-ink">
                ${isCorrect ? 'Benar!' : `Kurang tepat. Jawaban yang benar adalah pilihan ${letters[q.correctIndex]}.`}
              </p>
              <p class="text-ink leading-relaxed">${escapeHtml(q.explanation)}</p>
            </div>
          `
            : ''
        }

        <!-- Bar Aksi Bawah -->
        <div class="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            id="${quizId}-prev-step"
            ${currentIndex === 0 ? 'disabled' : ''}
            class="wb-btn-ghost text-xs disabled:opacity-35 disabled:cursor-not-allowed"
          >
            ${icon('arrowLeft', 15)}
            <span>Soal Sebelumnya</span>
          </button>

          <div class="flex flex-wrap items-center gap-2.5">
            ${
              !isChecked
                ? `
                <button type="button" id="${quizId}-check-step" class="wb-btn-primary">
                  ${icon('checkCircle', 16)}
                  <span>Periksa Jawaban</span>
                </button>
              `
                : !isLast
                ? `
                <button type="button" id="${quizId}-next-step" class="wb-btn-primary">
                  <span>Soal Berikutnya</span>
                  ${icon('arrowRight', 16)}
                </button>
              `
                : allChecked()
                ? `
                <button type="button" id="${quizId}-finish-btn" class="wb-btn-primary">
                  ${icon('award', 16)}
                  <span>Simpan &amp; Lihat Skor Akhir</span>
                </button>
              `
                : `
                <button type="button" id="${quizId}-jump-unanswered" class="wb-btn-secondary">
                  <span>Ke Soal yang Belum Dijawab</span>
                  ${icon('arrowRight', 15)}
                </button>
              `
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderSummaryView() {
    const score = computeScore();
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 75;

    return `
      <div class="p-5 sm:p-7 bg-surface space-y-6 quiz-step-enter" id="${quizId}-summary">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
          <div class="space-y-1">
            <span class="font-mono text-xs font-semibold uppercase tracking-wider ${passed ? 'text-emerald' : 'text-cobalt'}">
              ${passed ? 'Tuntas KKM' : 'Perlu Penguatan'}
            </span>
            <h4 class="font-display font-bold text-2xl text-ink">
              Skor Kamu: <span class="tabular-nums">${score}/${questions.length} (${percent}%)</span>
            </h4>
            <p class="text-sm text-ink-muted max-w-xl">
              ${
                passed
                  ? 'Bagus! Kamu sudah memahami konsep kunci pada bagian ini. Klik nomor soal di atas jika ingin meninjau ulang pembahasan.'
                  : 'Jangan khawatir, salah adalah bagian dari belajar koding. Tinjau nomor yang berwarna merah di atas, lalu coba kerjakan ulang.'
              }
            </p>
          </div>

          <div class="flex flex-wrap gap-2.5 shrink-0">
            <button type="button" id="${quizId}-review-first" class="wb-btn-secondary text-xs">
              <span>Tinjau Pembahasan</span>
            </button>
            <button type="button" id="${quizId}-retry-btn" class="wb-btn-primary text-xs">
              ${icon('refresh', 15)}
              <span>Coba Ulang Kuis</span>
            </button>
          </div>
        </div>

        <!-- Ringkasan Cepat Per Nomor -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${questions
            .map((q, idx) => {
              const ok = answers[q.id] === q.correctIndex;
              return `
                <button
                  type="button"
                  data-quiz-jump="${idx}"
                  class="text-left p-3 rounded-md border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    ok
                      ? 'border-emerald/60 bg-emerald-soft/50 hover:border-emerald'
                      : 'border-coral/60 bg-coral-soft/50 hover:border-coral'
                  }"
                >
                  <span class="text-xs font-medium text-ink truncate">
                    <strong class="font-mono tabular-nums mr-1">#${idx + 1}</strong> ${escapeHtml(q.level)}
                  </span>
                  <span class="font-mono text-[11px] font-semibold shrink-0 ${ok ? 'text-emerald' : 'text-coral'}">
                    ${ok ? 'Benar' : 'Tinjau'}
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function render() {
    const checkedCount = questions.filter((q) => Boolean(checkedMap[q.id])).length;

    container.innerHTML = `
      <div class="wb-stage overflow-hidden" id="${quizId}-wrapper">
        <!-- Header Kuis + Deretan Nomor Soal -->
        <div class="px-5 sm:px-7 py-4 bg-canvas border-b border-line-strong space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 class="font-display font-bold text-lg sm:text-xl text-ink">${escapeHtml(title)}</h3>
              <p class="text-xs text-ink-muted mt-0.5">${escapeHtml(subtitle)}</p>
            </div>
            <span class="font-mono text-xs text-ink-muted tabular-nums">
              Terjawab ${checkedCount}/${questions.length}
            </span>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="flex flex-wrap gap-1.5" role="navigation" aria-label="Daftar nomor soal">
              ${renderStepPills()}
            </div>
            ${
              allChecked() && viewMode === 'question'
                ? `<button type="button" id="${quizId}-to-summary" class="text-xs font-semibold text-cobalt hover:underline cursor-pointer">Lihat Ringkasan Skor →</button>`
                : ''
            }
          </div>
        </div>

        ${viewMode === 'summary' ? renderSummaryView() : renderQuestionView()}
      </div>
    `;

    // Pilih jawaban radio (hanya perbarui pilihan tanpa lompat scroll)
    const q = questions[currentIndex];
    container.querySelectorAll(`input[name="${quizId}-${q?.id}"]`).forEach((input) => {
      input.addEventListener('change', (e) => {
        answers[q.id] = Number(e.target.value);
        hintWarning = '';
        render();
      });
    });

    // Periksa Jawaban soal aktif
    container.querySelector(`#${quizId}-check-step`)?.addEventListener('click', () => {
      if (answers[q.id] === undefined) {
        hintWarning = 'Pilih salah satu jawaban (A, B, C, atau D) terlebih dahulu.';
        render();
        return;
      }
      hintWarning = '';
      checkedMap[q.id] = true;
      // Jika seluruh soal sudah diperiksa, simpan skor otomatis ke localStore
      if (allChecked() && typeof onSubmit === 'function') {
        onSubmit(computeScore(), questions.length, { ...answers });
      }
      render();
    });

    // Navigasi Sebelumnya / Berikutnya
    container.querySelector(`#${quizId}-prev-step`)?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        hintWarning = '';
        render();
      }
    });

    container.querySelector(`#${quizId}-next-step`)?.addEventListener('click', () => {
      if (currentIndex < questions.length - 1) {
        currentIndex += 1;
        hintWarning = '';
        render();
      }
    });

    container.querySelector(`#${quizId}-jump-unanswered`)?.addEventListener('click', () => {
      const idx = questions.findIndex((item) => !checkedMap[item.id]);
      if (idx !== -1) {
        currentIndex = idx;
        hintWarning = '';
        render();
      }
    });

    container.querySelector(`#${quizId}-finish-btn`)?.addEventListener('click', finalizeQuiz);
    container.querySelector(`#${quizId}-to-summary`)?.addEventListener('click', () => {
      viewMode = 'summary';
      render();
    });

    // Klik pill nomor soal
    container.querySelectorAll('[data-quiz-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentIndex = Number(btn.getAttribute('data-quiz-jump'));
        viewMode = 'question';
        hintWarning = '';
        render();
      });
    });

    container.querySelector(`#${quizId}-review-first`)?.addEventListener('click', () => {
      currentIndex = 0;
      viewMode = 'question';
      render();
    });

    container.querySelector(`#${quizId}-retry-btn`)?.addEventListener('click', () => {
      answers = {};
      checkedMap = {};
      currentIndex = 0;
      viewMode = 'question';
      hintWarning = '';
      if (typeof onReset === 'function') {
        onReset();
      }
      render();
    });
  }

  render();
}
