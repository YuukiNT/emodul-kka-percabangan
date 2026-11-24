/**
 * kb2BlockSim.js — Simulasi Penyusunan Blok Visual Puzzle Bergigi (KB 2)
 * - 2 Level: Level 1 (if-else) & Level 2 (if-elif-else)
 * - Mendukung Drag-and-Drop (desktop) SEKALIGUS Tap-to-Place / Klik-Pindah (mobile HP)
 * - Panel Pratinjau Kode Python Real-Time dengan warna semantik yang serasi dengan blok
 * - Umpan balik diagnostik spesifik + simulasi uji nilai output setelah benar
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
      return 'border-l-cobalt bg-cobalt-soft/60';
    case 'emerald':
      return 'border-l-emerald bg-emerald-soft/65';
    case 'amber':
      return 'border-l-amber bg-amber-soft/75';
    case 'coral':
      return 'border-l-coral bg-coral-soft/65';
    default:
      return 'border-l-line bg-canvas';
  }
}

export function mountKb2BlockSim(container) {
  if (!container) return;

  const simState = {
    levelIndex: 0,
    slots: new Array(KB2_PUZZLE_LEVELS[0].solutionOrder.length).fill(null),
    selectedBlockId: null, // Untuk interaksi tap-pilih -> tap-slot
    draggedBlockId: null,
    feedback: null, // { ok: boolean, title: string, detail: string }
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

  function switchLevel(idx) {
    simState.levelIndex = idx;
    const lvl = currentLevel();
    simState.slots = new Array(lvl.solutionOrder.length).fill(null);
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
      // Tukar posisi antar slot
      simState.slots[prevIndex] = displaced;
      simState.slots[targetSlotIndex] = blockId;
    } else {
      simState.slots[targetSlotIndex] = blockId;
    }

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
      // Jika semua slot penuh, tandai blok agar siswa bisa memilih slot pengganti
      simState.selectedBlockId = simState.selectedBlockId === blockId ? null : blockId;
      render();
    }
  }

  function removeBlockFromSlot(slotIndex) {
    simState.slots[slotIndex] = null;
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
    simState.feedback = null;
    simState.isSolvedNow = false;
    render();
  }

  function checkAnswer() {
    const level = currentLevel();
    const emptyCount = simState.slots.filter((s) => s === null).length;

    if (emptyCount > 0) {
      simState.isSolvedNow = false;
      simState.feedback = {
        ok: false,
        title: `Masih ada ${emptyCount} slot yang kosong`,
        detail: 'Pasang seluruh kepingan blok dari Nampan Blok ke Slot Susunan terlebih dahulu sebelum memeriksa jawaban.',
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
        title: `Susunan ${level.shortName} Benar!`,
        detail:
          'Urutan kondisi, kepingan pengunci, dan indentasi blok sudah tepat. Coba geser nilai uji di panel kode Python sebelah kanan untuk melihat cabang mana yang berjalan.',
      };
      render();
      return;
    }

    // Diagnosis spesifik agar siswa belajar dari kesalahannya
    simState.isSolvedNow = false;
    const firstBlock = level.blocks[simState.slots[0]];

    if (level.id === 'level1') {
      if (firstBlock.kind !== 'if') {
        simState.feedback = {
          ok: false,
          title: 'Slot 1 wajib diawali blok kondisi JIKA (if)',
          detail: `Saat ini Slot 1 berisi "${firstBlock.label}". Setiap struktur percabangan selalu dimulai dari blok JIKA (if) di baris paling atas.`,
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
          title: 'Blok aksi "Lulus KKM" dan "Perlu Remedial" tertukar!',
          detail: 'Jika nilai >= 75 bernilai Benar (Slot 2), program harus mencetak "Lulus KKM", bukan "Perlu Remedial". Tukar isi Slot 2 dan Slot 4.',
        };
      } else {
        simState.feedback = {
          ok: false,
          title: 'Periksa kembali pasangan Kondisi dan Blok Aksi',
          detail: 'Pastikan blok berkategori AKSI (menjorok 4 spasi) diletakkan di Slot 2 dan Slot 4 tepat di bawah kondisi pasangannya.',
        };
      }
    } else {
      // Diagnosis Level 2 (if-elif-else)
      const posIf = simState.slots.indexOf('l2_if');
      const posElif = simState.slots.indexOf('l2_elif');
      const posElse = simState.slots.indexOf('l2_else');

      if (posElif < posIf) {
        simState.feedback = {
          ok: false,
          title: 'Urutan kondisi terbalik: ATAU JIKA (elif) diletakkan sebelum JIKA (if)',
          detail: 'Struktur percabangan wajib diawali JIKA nilai >= 90 (batas tertinggi) di Slot 1, baru diikuti ATAU JIKA nilai >= 75 di Slot 3.',
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
          title: 'Perhatikan pola selang-seling: Kondisi, Aksi, Kondisi, Aksi',
          detail: 'Slot 1 (if), Slot 3 (elif), dan Slot 5 (else) berisi blok kepala kondisi, sedangkan Slot 2, 4, dan 6 berisi blok aksi yang menjorok.',
        };
      } else {
        simState.feedback = {
          ok: false,
          title: 'Struktur if-elif-else sudah benar, tetapi blok Predikat A / B / C ada yang tertukar',
          detail: 'Cocokkan tiap cabang: >= 90 berpasangan dengan Predikat A, >= 75 dengan Predikat B, dan else dengan Predikat C.',
        };
      }
    }

    render();
  }

  function renderPythonPreview(level) {
    const lines = level.slotHints.map((hint, idx) => {
      const bId = simState.slots[idx];
      if (!bId) {
        return `
          <div class="flex items-center gap-3 px-3 py-1.5 border-l-[3px] border-l-line text-ink-muted/75 text-xs font-mono">
            <span class="w-4 text-right select-none opacity-60">${idx + 2}</span>
            <span>${hint.indent ? '···· ' : ''}# [Slot ${idx + 1}: menunggu blok...]</span>
          </div>
        `;
      }
      const blk = level.blocks[bId];
      const indentPrefix = blk.indent === 1
        ? '<span class="text-ink-muted/60 select-none mr-1" title="Indentasi 4 spasi">····</span>'
        : '';
      const rawLine = blk.pythonLine.trimStart();

      return `
        <div class="flex items-center gap-3 px-3 py-1.5 border-l-[3px] ${getPythonStripeClass(blk.pythonColor)} text-xs sm:text-[13px] font-mono text-ink">
          <span class="w-4 text-right select-none text-ink-muted">${idx + 2}</span>
          <span class="font-semibold">${indentPrefix}${escapeHtml(rawLine)}</span>
        </div>
      `;
    });

    const evalRes = simState.isSolvedNow ? level.evaluateOutput(simState.testValue) : null;

    return `
      <div class="flex flex-col h-full justify-between gap-4">
        <div>
          <div class="flex items-center justify-between gap-2 pb-2.5 border-b border-line">
            <div>
              <p class="editorial-index">Transisi ke KB 3</p>
              <h4 class="font-display font-bold text-base text-ink flex items-center gap-1.5 mt-0.5">
                ${icon('code', 17, 'text-cobalt')}
                <span>Tampilan Kode Python Langsung</span>
              </h4>
            </div>
            <span class="font-mono text-[11px] px-2 py-0.5 rounded bg-canvas border border-line text-ink-muted">main.py</span>
          </div>

          <p class="text-xs text-ink-muted mt-2.5 leading-relaxed">
            Setiap blok yang kamu pasang otomatis berubah menjadi sintaks Python. Perhatikan titik dua (<code class="font-mono font-bold text-ink">:</code>) dan tanda <code class="font-mono font-bold text-ink">····</code> (4 spasi indentasi).
          </p>

          <!-- Panel Kode -->
          <div class="mt-3 rounded-md border border-line-strong bg-surface overflow-hidden">
            <div class="flex items-center gap-3 px-3 py-1.5 bg-canvas border-b border-line text-xs font-mono text-ink">
              <span class="w-4 text-right select-none text-ink-muted">1</span>
              <span><span class="text-cobalt font-semibold">${level.testVarName}</span> = <strong id="kb2-py-val">${simState.testValue}</strong></span>
            </div>
            <div class="divide-y divide-line/60">
              ${lines.join('')}
            </div>
          </div>

          <!-- Legenda Warna Blok -> Kode -->
          <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-ink-muted">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-cobalt inline-block"></span>if</span>
            ${level.id === 'level2' ? '<span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-amber inline-block"></span>elif</span>' : ''}
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-coral inline-block"></span>else</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-emerald inline-block"></span>Aksi True</span>
          </div>
        </div>

        <!-- Mini Uji Output setelah Susunan Benar -->
        <div class="p-3.5 rounded-md border ${
          evalRes ? 'border-emerald bg-emerald-soft/60' : 'border-dashed border-line bg-canvas'
        }">
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink">
              ${evalRes ? 'Uji Output Susunan Blokmu' : 'Output Program Python'}
            </span>
            <span class="font-mono text-xs font-bold text-cobalt">${level.testVarName} = ${simState.testValue}</span>
          </div>

          ${
            evalRes
              ? `
              <div class="mt-2 space-y-2">
                <input id="kb2-test-slider" type="range" min="40" max="100" value="${simState.testValue}" class="wb-slider" />
                <div class="flex flex-wrap gap-1.5">
                  ${level.testPresets
                    .map(
                      (v) => `<button type="button" data-kb2-preset="${v}" class="font-mono text-[11px] px-2 py-0.5 rounded border border-line-strong bg-surface hover:bg-cobalt-soft cursor-pointer">${level.testVarName} = ${v}</button>`
                    )
                    .join('')}
                </div>
                <div class="mt-2 p-2.5 rounded bg-ink text-surface font-mono text-xs">
                  <div class="text-surface/65 text-[10.5px]">&gt;&gt;&gt; Output:</div>
                  <div class="font-bold text-sm mt-0.5">${escapeHtml(evalRes.text)}</div>
                </div>
                <p class="text-xs text-ink">${escapeHtml(evalRes.reason)}</p>
              </div>
            `
              : `
              <p class="text-xs text-ink-muted mt-1.5 leading-relaxed">
                Susun seluruh blok di sebelah kiri lalu tekan <strong>Cek Susunan Blok</strong> untuk melihat hasil output kode Python yang terbentuk.
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

    container.innerHTML = `
      <div class="wb-sheet-framed overflow-hidden">
        <!-- Header & Pilih Level -->
        <div class="px-4 sm:px-6 py-4 bg-canvas border-b border-line-strong">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="editorial-index">Simulasi KB 2</p>
              <h3 class="font-display font-bold text-lg sm:text-xl text-ink mt-0.5">${escapeHtml(level.title)}</h3>
            </div>
            <span class="font-mono text-[11px] px-2.5 py-1 rounded border border-line bg-surface text-ink-muted">
              Seret atau Ketuk Blok
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mt-3" role="tablist" aria-label="Pilih level tantangan blok">
            ${KB2_PUZZLE_LEVELS.map((lvl, i) => {
              const active = i === simState.levelIndex;
              const done = solvedIds.includes(lvl.id);
              return `
                <button type="button" data-kb2-level="${i}" class="px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  active ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
                }">
                  ${done ? icon('checkCircle', 14, active ? 'text-emerald-soft' : 'text-emerald') : icon('blocks', 14)}
                  <span>${escapeHtml(lvl.badge)}</span>
                </button>
              `;
            }).join('')}
          </div>

          <p class="text-sm text-ink mt-3 leading-relaxed">${escapeHtml(level.instruction)}</p>
        </div>

        <!-- Area Kerja Utama: Kiri (Blok Puzzle) | Kanan (Pratinjau Python) -->
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- Kolom Kiri: Nampan & Slot Susunan -->
          <div class="lg:col-span-7 p-4 sm:p-5 bg-surface border-b lg:border-b-0 lg:border-r border-line space-y-5">
            <!-- Nampan Blok -->
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="editorial-index">1. Nampan Kepingan Blok (${trayIds.length} tersisa)</span>
                <span class="text-[11px] text-ink-muted">Ketuk blok untuk langsung memasang</span>
              </div>

              <div id="kb2-tray-zone" class="p-3 rounded-md border border-line bg-canvas min-h-[76px] space-y-2.5">
                ${
                  trayIds.length === 0
                    ? `<p class="text-xs font-mono text-emerald text-center py-3">Seluruh blok telah terpasang ke slot. Tekan "Cek Susunan Blok" di bawah!</p>`
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
                              class="puzzle-block ${getBlockClass(blk.kind)} ${selected ? 'is-selected' : ''} !text-xs sm:!text-[13px] !px-2.5 sm:!px-3.5"
                            >
                              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                ${icon('grip', 15, 'hidden sm:inline-block opacity-75')}
                                <span class="text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded bg-ink/15 font-mono uppercase tracking-wider shrink-0">${escapeHtml(blk.badge)}</span>
                                <span class="leading-snug break-words">${escapeHtml(blk.label)}</span>
                              </div>
                              <span class="text-[11px] font-sans font-semibold underline shrink-0 opacity-90">Pasang</span>
                            </div>
                          `;
                        })
                        .join('')
                }
              </div>
            </div>

            <!-- Slot Susunan Blok -->
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="editorial-index">2. Area Susunan Logika (Perhatikan Indentasi)</span>
                ${
                  simState.selectedBlockId
                    ? `<span class="text-[11px] font-semibold text-cobalt">Pilih slot tujuan untuk meletakkan blok</span>`
                    : ''
                }
              </div>

              <div class="space-y-2.5">
                ${level.slotHints
                  .map((hint, idx) => {
                    const placedId = simState.slots[idx];
                    const blk = placedId ? level.blocks[placedId] : null;
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
                              data-from-slot="${idx}"
                              class="puzzle-block ${getBlockClass(blk.kind)} ${simState.selectedBlockId === blk.id ? 'is-selected' : ''} !text-xs sm:!text-[13px] !px-2.5 sm:!px-3.5"
                            >
                              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                ${icon('grip', 15, 'hidden sm:inline-block opacity-75')}
                                <span class="text-[9.5px] sm:text-[10px] px-1.5 py-0.5 rounded bg-ink/15 font-mono uppercase shrink-0">${escapeHtml(blk.badge)}</span>
                                <span class="leading-snug break-words">${escapeHtml(blk.label)}</span>
                              </div>
                              <div class="flex items-center gap-0.5 sm:gap-1 shrink-0">
                                <button type="button" data-move-up="${idx}" ${idx === 0 ? 'disabled' : ''} class="p-1 rounded bg-surface/25 hover:bg-surface/45 disabled:opacity-30 cursor-pointer" title="Geser ke atas" aria-label="Geser ke atas">
                                  ${icon('arrowUp', 13)}
                                </button>
                                <button type="button" data-move-down="${idx}" ${idx === level.slotHints.length - 1 ? 'disabled' : ''} class="p-1 rounded bg-surface/25 hover:bg-surface/45 disabled:opacity-30 cursor-pointer" title="Geser ke bawah" aria-label="Geser ke bawah">
                                  ${icon('arrowDown', 13)}
                                </button>
                                <button type="button" data-remove-slot="${idx}" class="p-1 rounded bg-surface/25 hover:bg-surface/45 cursor-pointer" title="Lepas ke nampan" aria-label="Lepas blok dari slot ${idx + 1}">
                                  ${icon('close', 13)}
                                </button>
                              </div>
                            </div>
                          `
                            : `
                            <button type="button" data-empty-slot-btn="${idx}" class="w-full text-left px-3 py-2.5 text-xs font-mono text-ink-muted hover:text-cobalt cursor-pointer flex items-center justify-between gap-2">
                              <span>${escapeHtml(hint.label)}</span>
                              <span class="text-[10.5px] opacity-75">${hint.indent ? '4 spasi' : 'Rata kiri'}</span>
                            </button>
                          `
                        }
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- Tombol Aksi & Feedback -->
            <div class="pt-2 flex flex-wrap items-center gap-2.5">
              <button type="button" id="kb2-check-btn" class="wb-btn-primary">
                ${icon('checkCircle', 16)}
                <span>Cek Susunan Blok</span>
              </button>
              <button type="button" id="kb2-reset-btn" class="wb-btn-secondary">
                ${icon('refresh', 15)}
                <span>Reset</span>
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

          <!-- Kolom Kanan: Pratinjau Kode Python Real-Time -->
          <div class="lg:col-span-5 p-4 sm:p-5 bg-canvas">
            ${renderPythonPreview(level)}
          </div>
        </div>
      </div>
    `;

    // Bind Level tabs
    container.querySelectorAll('[data-kb2-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchLevel(Number(btn.getAttribute('data-kb2-level')));
      });
    });

    // Bind Tray tap-to-place & keyboard & drag
    container.querySelectorAll('[data-tray-block]').forEach((el) => {
      const blockId = el.getAttribute('data-tray-block');

      el.addEventListener('click', () => {
        quickPlaceFromTray(blockId);
      });

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

    // Bind Placed blocks drag + move up/down/remove
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

    // Bind Drop Slots (dragover, drop, click)
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

    // Tray as drop zone to remove placed block back to tray
    const trayZone = container.querySelector('#kb2-tray-zone');
    trayZone?.addEventListener('dragover', (e) => e.preventDefault());
    trayZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer?.getData('text/plain') || simState.draggedBlockId;
      const idx = simState.slots.indexOf(id);
      if (idx !== -1) removeBlockFromSlot(idx);
    });

    // Check & Reset buttons
    container.querySelector('#kb2-check-btn')?.addEventListener('click', checkAnswer);
    container.querySelector('#kb2-reset-btn')?.addEventListener('click', resetLevel);

    // Live test slider & presets when solved
    const testSlider = container.querySelector('#kb2-test-slider');
    testSlider?.addEventListener('input', (e) => {
      simState.testValue = Number(e.target.value);
      render();
      container.querySelector('#kb2-test-slider')?.focus();
    });

    container.querySelectorAll('[data-kb2-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        simState.testValue = Number(btn.getAttribute('data-kb2-preset'));
        render();
      });
    });
  }

  render();
}
