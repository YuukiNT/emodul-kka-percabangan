/**
 * kb2BlockSim.js - Simulasi Blok Visual Puzzle Bergigi (Scratch / MakeCode + Josh Comeau Craft)
 * - Drag-and-Drop (mouse) + Tap-to-Place (sentuh HP) dengan target ketuk ramah jempol
 * - Sorotan Jejak Eksekusi Sinkron 1-ke-1: saat nilai uji digeser, blok yang aktif di kiri
 *   dan baris kode Python pasangannya di kanan menyala bersamaan tanpa kedip DOM!
 */

import { KB2_PUZZLE_LEVELS } from '../data/kb2Data.js';
import { getState, markKb2LevelSolved } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getBlockClass(kind) {
  switch (kind) {
    case 'if':
      return 'puzzle-block--if';
    case 'elif':
      return 'puzzle-block--elif';
    case 'else':
      return 'puzzle-block--else';
    case 'action-true':
      return 'puzzle-block--action-true';
    case 'action-amber':
      return 'puzzle-block--action-amber';
    case 'action-false':
      return 'puzzle-block--action-false';
    default:
      return 'puzzle-block--action-true';
  }
}

function getPythonStripeClass(color) {
  switch (color) {
    case 'cobalt':
      return 'border-l-cobalt bg-cobalt-soft/55';
    case 'emerald':
      return 'border-l-emerald bg-emerald-soft/60';
    case 'amber':
      return 'border-l-amber bg-amber-soft/70';
    case 'coral':
      return 'border-l-coral bg-coral-soft/60';
    default:
      return 'border-l-line bg-canvas';
  }
}

export function mountKb2BlockSim(container) {
  if (!container) return;

  const simState = {
    levelIndex: 0,
    slots: new Array(KB2_PUZZLE_LEVELS[0].solutionOrder.length).fill(null),
    lastSnappedSlot: -1,
    selectedBlockId: null,
    draggedBlockId: null,
    feedback: null,
    testValue: KB2_PUZZLE_LEVELS[0].defaultTestValue,
    isSolvedNow: false,
  };

  function currentLevel() {
    return KB2_PUZZLE_LEVELS[simState.levelIndex];
  }

  function getTrayBlockIds() {
    const level = currentLevel();
    const placed = new Set(simState.slots.filter(Boolean));
    return level.initialTrayOrder.filter((id) => !placed.has(id));
  }

  /**
   * Menentukan indeks slot mana yang sedang dieksekusi untuk nilai uji aktif
   * agar blok di kiri & baris Python di kanan menyala sinkron.
   */
  function getExecutingSlotIndices(level, val) {
    if (!simState.isSolvedNow) return [];
    const evalRes = level.evaluateOutput(val);
    if (level.id === 'level1') {
      return evalRes.branch === 'if' ? [0, 1] : [2, 3];
    }
    if (evalRes.branch === 'if') return [0, 1];
    if (evalRes.branch === 'elif') return [2, 3];
    return [4, 5];
  }

  function switchLevel(idx) {
    simState.levelIndex = idx;
    const lvl = currentLevel();
    simState.slots = new Array(lvl.solutionOrder.length).fill(null);
    simState.lastSnappedSlot = -1;
    simState.selectedBlockId = null;
    simState.draggedBlockId = null;
    simState.feedback = null;
    simState.testValue = lvl.defaultTestValue;
    simState.isSolvedNow = false;
    render();
  }

  function resetLevel() {
    switchLevel(simState.levelIndex);
  }

  function placeBlockInSlot(blockId, targetSlotIndex) {
    if (!blockId) return;
    const prevIndex = simState.slots.indexOf(blockId);
    const displaced = simState.slots[targetSlotIndex];

    if (prevIndex !== -1) {
      simState.slots[prevIndex] = displaced;
      simState.slots[targetSlotIndex] = blockId;
    } else {
      simState.slots[targetSlotIndex] = blockId;
    }

    simState.lastSnappedSlot = targetSlotIndex;
    simState.selectedBlockId = null;
    simState.feedback = null;
    simState.isSolvedNow = false;
    render();
  }

  function quickPlaceFromTray(blockId) {
    const firstEmpty = simState.slots.indexOf(null);
    if (firstEmpty !== -1) {
      placeBlockInSlot(blockId, firstEmpty);
    } else {
      simState.selectedBlockId = simState.selectedBlockId === blockId ? null : blockId;
      simState.lastSnappedSlot = -1;
      render();
    }
  }

  function removeBlockFromSlot(slotIndex) {
    simState.slots[slotIndex] = null;
    simState.lastSnappedSlot = -1;
    simState.selectedBlockId = null;
    simState.feedback = null;
    simState.isSolvedNow = false;
    render();
  }

  function moveSlot(slotIndex, delta) {
    const target = slotIndex + delta;
    if (target < 0 || target >= simState.slots.length) return;
    const tmp = simState.slots[target];
    simState.slots[target] = simState.slots[slotIndex];
    simState.slots[slotIndex] = tmp;
    simState.lastSnappedSlot = target;
    simState.feedback = null;
    simState.isSolvedNow = false;
    render();
  }

  function checkAnswer() {
    const level = currentLevel();
    const emptyCount = simState.slots.filter((s) => s === null).length;
    simState.lastSnappedSlot = -1;

    if (emptyCount > 0) {
      simState.isSolvedNow = false;
      simState.feedback = {
        ok: false,
        title: `Masih ada ${emptyCount} slot kosong`,
        detail: 'Ketuk atau seret seluruh kepingan blok dari Nampan Blok ke Slot Susunan terlebih dahulu.',
      };
      render();
      return;
    }

    const exactMatch = level.solutionOrder.every((id, i) => simState.slots[i] === id);
    if (exactMatch) {
      simState.isSolvedNow = true;
      markKb2LevelSolved(level.id);
      simState.feedback = {
        ok: true,
        title: `Susunan ${level.shortName} Tepat!`,
        detail:
          'Sekarang coba geser penguji nilai di sebelah kanan, lalu perhatikan blok dan baris Python mana yang menyala bersamaan!',
      };
      render();
      return;
    }

    simState.isSolvedNow = false;
    const firstBlock = level.blocks[simState.slots[0]];

    if (level.id === 'level1') {
      if (firstBlock.kind !== 'if') {
        simState.feedback = {
          ok: false,
          title: 'Slot 1 wajib diawali blok kondisi JIKA (if)',
          detail: `Saat ini Slot 1 berisi "${firstBlock.label}". Struktur percabangan selalu dimulai dari blok JIKA (if) di baris teratas.`,
        };
      } else if (simState.slots[2] !== 'l1_else') {
        simState.feedback = {
          ok: false,
          title: 'Posisi blok SELAIN ITU (else) belum tepat',
          detail: 'Blok SELAIN ITU (else) tidak menjorok dan harus berada di Slot 3, tepat setelah blok aksi jalur Benar.',
        };
      } else if (simState.slots[1] === 'l1_act_false' && simState.slots[3] === 'l1_act_true') {
        simState.feedback = {
          ok: false,
          title: 'Blok aksi "Lulus KKM" dan "Perlu Remedial" tertukar',
          detail: 'Saat nilai >= 75 bernilai Benar (Slot 2), program harus mencetak "Lulus KKM". Tukar isi Slot 2 dan Slot 4.',
        };
      } else {
        simState.feedback = {
          ok: false,
          title: 'Periksa kembali pasangan Kondisi dan Blok Aksi',
          detail: 'Pastikan blok AKSI (menjorok 4 spasi) diletakkan di Slot 2 dan Slot 4 tepat di bawah kondisi pasangannya.',
        };
      }
    } else {
      const posIf = simState.slots.indexOf('l2_if');
      const posElif = simState.slots.indexOf('l2_elif');
      const posElse = simState.slots.indexOf('l2_else');

      if (posElif < posIf) {
        simState.feedback = {
          ok: false,
          title: 'Urutan kondisi terbalik: ATAU JIKA (elif) sebelum JIKA (if)',
          detail: 'Awali selalu dari JIKA nilai >= 90 (batas tertinggi) di Slot 1, baru diikuti ATAU JIKA nilai >= 75 di Slot 3.',
        };
      } else if (posElse < posElif || posElse !== 4) {
        simState.feedback = {
          ok: false,
          title: 'Blok SELAIN ITU (else) harus menjadi cabang terakhir (Slot 5)',
          detail: 'Cabang else selalu diletakkan paling bawah setelah if dan semua elif selesai diperiksa.',
        };
      } else if (posIf !== 0 || posElif !== 2) {
        simState.feedback = {
          ok: false,
          title: 'Ikuti pola selang-seling: Kondisi lalu Aksi',
          detail: 'Slot 1 (if), Slot 3 (elif), dan Slot 5 (else) berisi kepala kondisi; Slot 2, 4, dan 6 berisi blok aksi yang menjorok.',
        };
      } else {
        simState.feedback = {
          ok: false,
          title: 'Blok Predikat A / B / C ada yang tertukar',
          detail: 'Cocokkan tiap cabang: >= 90 dengan Predikat A, >= 75 dengan Predikat B, dan else dengan Predikat C.',
        };
      }
    }

    render();
  }

  /**
   * Pembaruan uji nilai TANPA me-render ulang seluruh papan blok (Zero-Flicker)
   * sekaligus menyalakan sorotan sinkron pada Blok Puzzle <-> Baris Python!
   */
  function updateLiveExecutionTrace() {
    if (!simState.isSolvedNow) return;
    const level = currentLevel();
    const activeSlots = new Set(getExecutingSlotIndices(level, simState.testValue));
    const evalRes = level.evaluateOutput(simState.testValue);

    const pyVal = container.querySelector('#kb2-py-val');
    const testValLabel = container.querySelector('#kb2-test-val-label');
    if (pyVal) pyVal.textContent = String(simState.testValue);
    if (testValLabel) testValLabel.textContent = `${level.testVarName} = ${simState.testValue}`;

    const testSlider = container.querySelector('#kb2-test-slider');
    if (testSlider && Number(testSlider.value) !== simState.testValue) {
      testSlider.value = String(simState.testValue);
    }

    container.querySelectorAll('[data-placed-slot-idx]').forEach((el) => {
      const sIdx = Number(el.getAttribute('data-placed-slot-idx'));
      el.classList.toggle('is-executing', activeSlots.has(sIdx));
      el.classList.toggle('is-dimmed-exec', !activeSlots.has(sIdx));
    });

    container.querySelectorAll('[data-py-slot-idx]').forEach((el) => {
      const sIdx = Number(el.getAttribute('data-py-slot-idx'));
      el.classList.toggle('py-line-executing', activeSlots.has(sIdx));
    });

    const outText = container.querySelector('#kb2-live-output-text');
    const outReason = container.querySelector('#kb2-live-output-reason');
    if (outText) outText.textContent = evalRes.text;
    if (outReason) outReason.textContent = evalRes.reason;
  }

  function renderPythonPreview(level) {
    const activeSlots = new Set(getExecutingSlotIndices(level, simState.testValue));

    const lines = level.slotHints.map((hint, idx) => {
      const bId = simState.slots[idx];
      if (!bId) {
        return `
          <div class="flex items-center gap-3 px-3 py-2 border-l-[3px] border-l-line text-ink-muted/75 text-xs font-mono">
            <span class="w-4 text-right select-none opacity-60 tabular-nums">${idx + 2}</span>
            <span>${hint.indent ? '···· ' : ''}# [Slot ${idx + 1}: kosong]</span>
          </div>
        `;
      }
      const blk = level.blocks[bId];
      const indentPrefix = blk.indent === 1
        ? '<span class="text-ink-muted/60 select-none mr-1" title="Indentasi 4 spasi">····</span>'
        : '';
      const rawLine = blk.pythonLine.trimStart();
      const execClass = activeSlots.has(idx) ? 'py-line-executing' : '';

      return `
        <div data-py-slot-idx="${idx}" class="flex items-center gap-3 px-3 py-2 border-l-[3px] transition-colors ${getPythonStripeClass(blk.pythonColor)} ${execClass} text-xs sm:text-[13px] font-mono text-ink">
          <span class="w-4 text-right select-none text-ink-muted tabular-nums">${idx + 2}</span>
          <span class="font-semibold">${indentPrefix}${escapeHtml(rawLine)}</span>
        </div>
      `;
    });

    const evalRes = simState.isSolvedNow ? level.evaluateOutput(simState.testValue) : null;

    return `
      <div class="flex flex-col h-full justify-between gap-4">
        <div>
          <div class="flex items-center justify-between gap-2 pb-2.5 border-b border-line">
            <h4 class="font-display font-bold text-base text-ink flex items-center gap-1.5">
              ${icon('code', 17, 'text-cobalt')}
              <span>Tampilan Kode Python Langsung</span>
            </h4>
            <span class="font-mono text-[11px] px-2 py-0.5 rounded bg-surface border border-line text-ink-muted">main.py</span>
          </div>

          <p class="text-xs text-ink-muted mt-2.5 leading-relaxed">
            Setiap blok yang dipasang otomatis membentuk kode Python. Perhatikan titik dua (<code class="font-mono font-bold text-ink">:</code>) dan indentasi <code class="font-mono font-bold text-ink">····</code> (4 spasi).
          </p>

          <div class="mt-3 rounded-md border border-line-strong bg-surface overflow-hidden">
            <div class="flex items-center gap-3 px-3 py-2 bg-canvas border-b border-line text-xs font-mono text-ink">
              <span class="w-4 text-right select-none text-ink-muted tabular-nums">1</span>
              <span><span class="text-cobalt font-semibold">${level.testVarName}</span> = <strong id="kb2-py-val" class="tabular-nums">${simState.testValue}</strong></span>
            </div>
            <div class="divide-y divide-line/60">
              ${lines.join('')}
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-md border ${
          evalRes ? 'border-emerald bg-emerald-soft/60' : 'border-dashed border-line bg-surface'
        }">
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink">
              ${evalRes ? 'Geser Nilai & Amati Cabang Menyala' : 'Uji Output Program'}
            </span>
            <span id="kb2-test-val-label" class="font-mono text-xs font-bold text-cobalt tabular-nums">${level.testVarName} = ${simState.testValue}</span>
          </div>

          ${
            evalRes
              ? `
              <div class="mt-2 space-y-2">
                <input id="kb2-test-slider" type="range" min="40" max="100" value="${simState.testValue}" class="wb-slider" />
                <div class="flex flex-wrap gap-1.5">
                  ${level.testPresets
                    .map(
                      (v) => `<button type="button" data-kb2-preset="${v}" class="min-h-[32px] font-mono tabular-nums text-[11px] px-2.5 py-1 rounded border border-line-strong bg-surface hover:bg-cobalt-soft cursor-pointer">${level.testVarName} = ${v}</button>`
                    )
                    .join('')}
                </div>
                <div class="mt-2 p-2.5 rounded bg-ink text-surface font-mono text-xs">
                  <div class="text-surface/65 text-[10.5px]">&gt;&gt;&gt; Output:</div>
                  <div id="kb2-live-output-text" class="font-bold text-sm mt-0.5">${escapeHtml(evalRes.text)}</div>
                </div>
                <p id="kb2-live-output-reason" class="text-xs text-ink">${escapeHtml(evalRes.reason)}</p>
              </div>
            `
              : `
              <p class="text-xs text-ink-muted mt-1.5 leading-relaxed">
                Susun seluruh blok di sebelah kiri lalu tekan <strong>Cek Susunan Blok</strong> untuk menguji berbagai angka nilai secara langsung.
              </p>
            `
          }
        </div>
      </div>
    `;
  }

  function render() {
    const level = currentLevel();
    const trayIds = getTrayBlockIds();
    const solvedIds = getState().kb2.solvedLevels || [];
    const activeSlots = new Set(getExecutingSlotIndices(level, simState.testValue));

    container.innerHTML = `
      <div class="wb-stage overflow-hidden">
        <!-- Header & Pilih Level -->
        <div class="px-4 sm:px-6 py-4 bg-canvas border-b border-line-strong space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-display font-bold text-lg sm:text-xl text-ink">${escapeHtml(level.title)}</h3>
            <span class="font-mono text-[11px] text-ink-muted">Ketuk blok atau seret ke slot</span>
          </div>

          <div class="flex flex-wrap gap-2" role="tablist" aria-label="Pilih level tantangan blok">
            ${KB2_PUZZLE_LEVELS.map((lvl, i) => {
              const active = i === simState.levelIndex;
              const done = solvedIds.includes(lvl.id);
              return `
                <button type="button" data-kb2-level="${i}" class="min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  active ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
                }">
                  ${done ? icon('checkCircle', 14, active ? 'text-emerald-soft' : 'text-emerald') : icon('blocks', 14)}
                  <span>${escapeHtml(lvl.badge)}</span>
                </button>
              `;
            }).join('')}
          </div>

          <p class="text-sm text-ink leading-relaxed">${escapeHtml(level.instruction)}</p>
        </div>

        <!-- Area Kerja Utama -->
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- Kiri: Nampan & Slot Susunan -->
          <div class="lg:col-span-7 p-4 sm:p-5 bg-surface border-b lg:border-b-0 lg:border-r border-line space-y-5">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="font-mono text-xs font-semibold text-ink tabular-nums">1. Nampan Blok (${trayIds.length} tersisa)</span>
                <span class="text-[11px] text-ink-muted">Ketuk blok untuk memasang</span>
              </div>

              <div id="kb2-tray-zone" class="p-3 rounded-md border border-line bg-canvas min-h-[76px] space-y-2.5">
                ${
                  trayIds.length === 0
                    ? `<p class="text-xs font-mono text-emerald text-center py-3">Semua blok sudah terpasang. Klik "Cek Susunan Blok" di bawah.</p>`
                    : trayIds
                        .map((id) => {
                          const blk = level.blocks[id];
                          const selected = simState.selectedBlockId === id;
                          return `
                            <div
                              draggable="true"
                              data-tray-block="${id}"
                              role="button"
                              tabindex="0"
                              aria-label="Pasang blok ${escapeHtml(blk.label)}"
                              class="puzzle-block ${getBlockClass(blk.kind)} ${selected ? 'is-selected' : ''} !text-xs sm:!text-[13px] !px-3 sm:!px-3.5"
                            >
                              <div class="flex items-center gap-2 min-w-0">
                                ${icon('grip', 15, 'hidden sm:inline-block opacity-75')}
                                <span class="text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded bg-ink/15 font-mono uppercase tracking-wider shrink-0">${escapeHtml(blk.badge)}</span>
                                <span class="leading-snug break-words">${escapeHtml(blk.label)}</span>
                              </div>
                              <span class="text-[11px] font-sans font-semibold underline shrink-0 opacity-95">Pasang +</span>
                            </div>
                          `;
                        })
                        .join('')
                }
              </div>
            </div>

            <!-- Slot Susunan -->
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="font-mono text-xs font-semibold text-ink">2. Papan Susunan Logika</span>
                ${
                  simState.selectedBlockId
                    ? `<span class="text-[11px] font-semibold text-cobalt">Ketuk slot tujuan untuk menukar</span>`
                    : `<span class="text-[11px] text-ink-muted">Perhatikan garis indentasi</span>`
                }
              </div>

              <div class="space-y-2.5">
                ${level.slotHints
                  .map((hint, idx) => {
                    const placedId = simState.slots[idx];
                    const blk = placedId ? level.blocks[placedId] : null;
                    const snapClass = simState.lastSnappedSlot === idx ? 'puzzle-block--snapped' : '';
                    const execClass = simState.isSolvedNow
                      ? activeSlots.has(idx)
                        ? 'is-executing'
                        : 'is-dimmed-exec'
                      : '';

                    return `
                      <div
                        data-drop-slot="${idx}"
                        class="puzzle-slot ${hint.indent ? 'puzzle-slot--indented' : ''} ${simState.selectedBlockId ? 'is-targetable' : ''}"
                      >
                        ${
                          blk
                            ? `
                            <div
                              draggable="true"
                              data-placed-block="${blk.id}"
                              data-placed-slot-idx="${idx}"
                              data-from-slot="${idx}"
                              class="puzzle-block ${getBlockClass(blk.kind)} ${snapClass} ${execClass} ${simState.selectedBlockId === blk.id ? 'is-selected' : ''} !text-xs sm:!text-[13px] !px-2.5 sm:!px-3.5"
                            >
                              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                ${icon('grip', 15, 'hidden sm:inline-block opacity-75')}
                                <span class="text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded bg-ink/15 font-mono uppercase shrink-0">${escapeHtml(blk.badge)}</span>
                                <span class="leading-snug break-words">${escapeHtml(blk.label)}</span>
                              </div>
                              <div class="flex items-center gap-1 shrink-0">
                                <button type="button" data-move-up="${idx}" ${idx === 0 ? 'disabled' : ''} class="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-surface/25 hover:bg-surface/45 disabled:opacity-30 cursor-pointer" title="Geser ke atas" aria-label="Geser ke atas">
                                  ${icon('arrowUp', 14)}
                                </button>
                                <button type="button" data-move-down="${idx}" ${idx === level.slotHints.length - 1 ? 'disabled' : ''} class="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-surface/25 hover:bg-surface/45 disabled:opacity-30 cursor-pointer" title="Geser ke bawah" aria-label="Geser ke bawah">
                                  ${icon('arrowDown', 14)}
                                </button>
                                <button type="button" data-remove-slot="${idx}" class="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded bg-surface/25 hover:bg-surface/45 cursor-pointer" title="Lepas ke nampan" aria-label="Lepas blok dari slot ${idx + 1}">
                                  ${icon('close', 14)}
                                </button>
                              </div>
                            </div>
                          `
                            : `
                            <button type="button" data-empty-slot-btn="${idx}" class="w-full min-h-[46px] text-left px-3 py-2.5 text-xs font-mono text-ink-muted hover:text-cobalt cursor-pointer flex items-center justify-between gap-2">
                              <span>${escapeHtml(hint.label)}</span>
                              <span class="text-[10.5px] opacity-75 shrink-0">${hint.indent ? '4 spasi' : 'Rata kiri'}</span>
                            </button>
                          `
                        }
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <div class="pt-1 flex flex-wrap items-center gap-2.5">
              <button type="button" id="kb2-check-btn" class="wb-btn-primary">
                ${icon('checkCircle', 16)}
                <span>Cek Susunan Blok</span>
              </button>
              <button type="button" id="kb2-reset-btn" class="wb-btn-secondary">
                ${icon('refresh', 15)}
                <span>Susun Ulang</span>
              </button>
            </div>

            ${
              simState.feedback
                ? `
                <div id="kb2-feedback-box" class="${simState.feedback.ok ? 'wb-callout-emerald' : 'wb-callout-coral'}">
                  <p class="font-display font-bold text-sm text-ink flex items-center gap-1.5">
                    ${icon(simState.feedback.ok ? 'checkCircle' : 'alert', 17, simState.feedback.ok ? 'text-emerald' : 'text-coral')}
                    <span>${escapeHtml(simState.feedback.title)}</span>
                  </p>
                  <p class="text-sm text-ink mt-1 leading-relaxed">${escapeHtml(simState.feedback.detail)}</p>
                </div>
              `
                : ''
            }
          </div>

          <!-- Kanan: Tampilan Kode Python Langsung -->
          <div class="lg:col-span-5 p-4 sm:p-5 bg-canvas">
            ${renderPythonPreview(level)}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-kb2-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchLevel(Number(btn.getAttribute('data-kb2-level')));
      });
    });

    container.querySelectorAll('[data-tray-block]').forEach((el) => {
      const blockId = el.getAttribute('data-tray-block');
      el.addEventListener('click', () => quickPlaceFromTray(blockId));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          quickPlaceFromTray(blockId);
        }
      });
      el.addEventListener('dragstart', (e) => {
        simState.draggedBlockId = blockId;
        el.classList.add('is-dragging');
        e.dataTransfer?.setData('text/plain', blockId);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragend', () => {
        simState.draggedBlockId = null;
        el.classList.remove('is-dragging');
      });
    });

    container.querySelectorAll('[data-placed-block]').forEach((el) => {
      const blockId = el.getAttribute('data-placed-block');
      el.addEventListener('dragstart', (e) => {
        simState.draggedBlockId = blockId;
        el.classList.add('is-dragging');
        e.dataTransfer?.setData('text/plain', blockId);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragend', () => {
        simState.draggedBlockId = null;
        el.classList.remove('is-dragging');
      });
    });

    container.querySelectorAll('[data-move-up]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveSlot(Number(btn.getAttribute('data-move-up')), -1);
      });
    });

    container.querySelectorAll('[data-move-down]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveSlot(Number(btn.getAttribute('data-move-down')), 1);
      });
    });

    container.querySelectorAll('[data-remove-slot]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBlockFromSlot(Number(btn.getAttribute('data-remove-slot')));
      });
    });

    container.querySelectorAll('[data-drop-slot]').forEach((slotEl) => {
      const slotIndex = Number(slotEl.getAttribute('data-drop-slot'));
      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotEl.classList.add('is-dragover');
      });
      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('is-dragover');
      });
      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('is-dragover');
        const id = e.dataTransfer?.getData('text/plain') || simState.draggedBlockId;
        if (id) placeBlockInSlot(id, slotIndex);
      });
      slotEl.addEventListener('click', () => {
        if (simState.selectedBlockId) {
          placeBlockInSlot(simState.selectedBlockId, slotIndex);
        }
      });
    });

    const trayZone = container.querySelector('#kb2-tray-zone');
    trayZone?.addEventListener('dragover', (e) => e.preventDefault());
    trayZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer?.getData('text/plain') || simState.draggedBlockId;
      const idx = simState.slots.indexOf(id);
      if (idx !== -1) removeBlockFromSlot(idx);
    });

    container.querySelector('#kb2-check-btn')?.addEventListener('click', checkAnswer);
    container.querySelector('#kb2-reset-btn')?.addEventListener('click', resetLevel);

    // Uji nilai real-time tanpa kedip + sorotan sinkron Blok <-> Python
    container.querySelector('#kb2-test-slider')?.addEventListener('input', (e) => {
      simState.testValue = Number(e.target.value);
      updateLiveExecutionTrace();
    });

    container.querySelectorAll('[data-kb2-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        simState.testValue = Number(btn.getAttribute('data-kb2-preset'));
        updateLiveExecutionTrace();
      });
    });
  }

  render();
}
