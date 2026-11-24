/**
 * formativeQuiz.js - Komponen Kuis Pilihan Ganda dengan pemeriksaan otomatis & pembahasan.
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
  if (!container) return;

  let currentAnswers = { ...(savedAnswers || {}) };
  let submitted = savedScore !== null && savedScore !== undefined;
  let score = submitted ? savedScore : 0;
  let validationMsg = '';

  function render() {
    const letters = ['A', 'B', 'C', 'D'];
    const percent = submitted ? Math.round((score / questions.length) * 100) : 0;
    const passed = percent >= 75;

    container.innerHTML = `
      <div class="wb-sheet-framed overflow-hidden" id="${quizId}-wrapper">
        <div class="px-5 py-4 bg-canvas border-b border-line-strong flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="editorial-index">Latihan Soal</p>
            <h3 class="font-display font-bold text-xl text-ink mt-0.5">${escapeHtml(title)}</h3>
            <p class="text-xs text-ink-muted mt-0.5">${escapeHtml(subtitle)}</p>
          </div>
          ${
            submitted
              ? `
              <div class="px-3.5 py-2 rounded-md border-2 ${passed ? 'border-emerald bg-emerald-soft' : 'border-amber bg-amber-soft'} text-right">
                <span class="font-mono text-[10.5px] uppercase text-ink-muted block">Skor Kuis</span>
                <span class="font-display font-extrabold text-xl text-ink">${score}/${questions.length} (${percent}%)</span>
              </div>
            `
              : `<span class="font-mono text-xs px-2.5 py-1 rounded border border-line bg-surface text-ink-muted">${questions.length} Soal Pilihan Ganda</span>`
          }
        </div>

        <form id="${quizId}-form" class="p-5 sm:p-6 space-y-6 bg-surface">
          ${questions
            .map((q, qIdx) => {
              const chosen = currentAnswers[q.id];
              const isCorrect = submitted && chosen === q.correctIndex;
              return `
                <fieldset class="pb-6 border-b border-line last:border-b-0 last:pb-0 space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="font-mono text-xs font-bold text-cobalt">Soal ${String(qIdx + 1).padStart(2, '0')} · ${escapeHtml(q.level)}</span>
                    ${
                      submitted
                        ? `<span class="font-mono text-xs font-semibold inline-flex items-center gap-1 ${isCorrect ? 'text-emerald' : 'text-coral'}">
                            ${icon(isCorrect ? 'checkCircle' : 'alert', 14)}
                            ${isCorrect ? 'Benar' : 'Belum Tepat'}
                          </span>`
                        : ''
                    }
                  </div>

                  <legend class="font-sans font-semibold text-[15px] text-ink leading-relaxed">
                    ${escapeHtml(q.question)}
                  </legend>

                  <div class="space-y-2 pt-1">
                    ${q.options
                      .map((opt, optIdx) => {
                        const checked = chosen === optIdx;
                        let optionClass = 'border-line bg-canvas hover:border-line-strong';
                        if (!submitted && checked) {
                          optionClass = 'border-cobalt bg-cobalt-soft';
                        } else if (submitted) {
                          if (optIdx === q.correctIndex) {
                            optionClass = 'border-emerald bg-emerald-soft';
                          } else if (checked && optIdx !== q.correctIndex) {
                            optionClass = 'border-coral bg-coral-soft';
                          } else {
                            optionClass = 'border-line bg-surface opacity-70';
                          }
                        }

                        return `
                          <label class="flex items-start gap-3 p-3 rounded-md border-[1.5px] transition-colors ${submitted ? 'cursor-default' : 'cursor-pointer'} ${optionClass}">
                            <input
                              type="radio"
                              name="${q.id}"
                              value="${optIdx}"
                              ${checked ? 'checked' : ''}
                              ${submitted ? 'disabled' : ''}
                              class="mt-1 accent-cobalt shrink-0"
                            />
                            <span class="font-mono text-xs font-bold w-5 h-5 rounded bg-surface border border-line-strong flex items-center justify-center shrink-0 mt-0.5">${letters[optIdx]}</span>
                            <span class="text-sm text-ink leading-relaxed">${escapeHtml(opt)}</span>
                          </label>
                        `;
                      })
                      .join('')}
                  </div>

                  ${
                    submitted
                      ? `
                      <div class="${isCorrect ? 'wb-callout-emerald' : 'wb-callout'} text-sm">
                        <p class="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">Pembahasan:</p>
                        <p class="mt-1 leading-relaxed text-ink">${escapeHtml(q.explanation)}</p>
                      </div>
                    `
                      : ''
                  }
                </fieldset>
              `;
            })
            .join('')}

          ${
            validationMsg
              ? `<p class="text-sm font-semibold text-coral flex items-center gap-1.5">${icon('alert', 16)} ${escapeHtml(validationMsg)}</p>`
              : ''
          }

          ${
            submitted
              ? `
              <div class="${passed ? 'wb-callout-emerald' : 'wb-callout'} space-y-1">
                <p class="font-display font-bold text-base text-ink">
                  ${passed ? 'Hasil yang baik! Kamu sudah memahami materi pada bagian ini.' : 'Skor sudah tersimpan. Pelajari kembali pembahasan di atas, lalu coba kerjakan ulang.'}
                </p>
                <p class="text-sm text-ink">
                  Skor kamu: <strong>${score} benar dari ${questions.length} soal (${percent}%)</strong>. Progres belajar otomatis diperbarui.
                </p>
              </div>
            `
              : ''
          }

          <div class="flex flex-wrap items-center gap-3 pt-2">
            ${
              submitted
                ? `
                <button type="button" id="${quizId}-retry-btn" class="wb-btn-secondary">
                  ${icon('refresh', 15)}
                  <span>Coba Ulang Kuis</span>
                </button>
              `
                : `
                <button type="submit" id="${quizId}-submit-btn" class="wb-btn-primary">
                  ${icon('checkCircle', 16)}
                  <span>Periksa Jawaban &amp; Lihat Pembahasan</span>
                </button>
              `
            }
          </div>
        </form>
      </div>
    `;

    const form = container.querySelector(`#${quizId}-form`);
    form?.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener('change', (e) => {
        currentAnswers[e.target.name] = Number(e.target.value);
        validationMsg = '';
        render();
      });
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitted) return;
      const unanswered = questions.filter((q) => currentAnswers[q.id] === undefined);
      if (unanswered.length > 0) {
        validationMsg = `Masih ada ${unanswered.length} soal yang belum dijawab. Lengkapi semua nomor terlebih dahulu.`;
        render();
        return;
      }
      score = questions.reduce(
        (acc, q) => acc + (currentAnswers[q.id] === q.correctIndex ? 1 : 0),
        0
      );
      submitted = true;
      validationMsg = '';
      if (typeof onSubmit === 'function') {
        onSubmit(score, questions.length, currentAnswers);
      }
      render();
    });

    container.querySelector(`#${quizId}-retry-btn`)?.addEventListener('click', () => {
      currentAnswers = {};
      submitted = false;
      score = 0;
      validationMsg = '';
      if (typeof onReset === 'function') {
        onReset();
      }
      render();
    });
  }

  render();
}
