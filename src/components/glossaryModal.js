/**
 * glossaryModal.js - Modal Kamus Istilah & Kartu Hafalan (Flashcard) Koding & AI
 * Mendukung pencarian cepat, filter 3 kategori, serta latihan tebak istilah 100% luring.
 */

import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } from '../data/glossaryData.js';
import { icon } from './icons.js';

const FLASHCARD_STORAGE_KEY = 'emodul_kka_ix_flashcards_v1';

let isOpen = false;
let activeMode = 'list'; // 'list' | 'flashcard'
let searchQuery = '';
let selectedCategory = 'Semua';

// State Kartu Hafalan
let deckOrder = [];
let currentCardIndex = 0;
let isCardFlipped = false;
let onlyUnmastered = false;
let masteredTerms = loadMasteredTerms();

function loadMasteredTerms() {
  try {
    const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function saveMasteredTerms() {
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify([...masteredTerms]));
  } catch {
    // Abaikan jika mode privat penuh
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getCategoryStyle(category) {
  if (category === 'Logika & Flowchart') return 'border-cobalt text-cobalt bg-cobalt-soft';
  if (category === 'Blok & Python') return 'border-amber text-ink bg-amber-soft';
  if (category === 'AI') return 'border-emerald text-ink bg-emerald-soft';
  return 'border-line text-ink-muted bg-canvas';
}

function getFilteredTerms() {
  const q = searchQuery.trim().toLowerCase();
  return GLOSSARY_TERMS.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    if (!matchCat) return false;
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q)
    );
  });
}

function buildFlashcardDeck(shuffle = false) {
  let pool = GLOSSARY_TERMS.filter(
    (item) => selectedCategory === 'Semua' || item.category === selectedCategory
  );
  if (onlyUnmastered) {
    pool = pool.filter((item) => !masteredTerms.has(item.term));
  }

  const nextDeck = [...pool];
  if (shuffle && nextDeck.length > 1) {
    for (let i = nextDeck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [nextDeck[i], nextDeck[j]] = [nextDeck[j], nextDeck[i]];
    }
  }

  deckOrder = nextDeck;
  currentCardIndex = 0;
  isCardFlipped = false;
}

function renderListHtml() {
  const items = getFilteredTerms();
  if (items.length === 0) {
    return `
      <div class="py-10 text-center border border-dashed border-line rounded-md bg-canvas">
        <p class="font-display font-bold text-ink">Istilah tidak ditemukan</p>
        <p class="text-sm text-ink-muted mt-1">Coba kata kunci lain seperti <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">flowchart</code>, <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">elif</code>, atau <code class="font-mono bg-surface px-1.5 py-0.5 rounded border border-line">boolean</code>.</p>
      </div>
    `;
  }

  return `
    <div class="divide-y divide-line border-t border-b border-line">
      ${items
        .map(
          (item) => `
          <article class="py-4 first:pt-3 last:pb-3">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <div class="flex flex-wrap items-baseline gap-2">
                <h4 class="font-display font-bold text-base text-ink">${escapeHtml(item.term)}</h4>
                <span class="font-mono text-xs text-ink-muted">(${escapeHtml(item.english)})</span>
                ${
                  masteredTerms.has(item.term)
                    ? `<span class="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald">${icon('checkCircle', 13)} Hafal</span>`
                    : ''
                }
              </div>
              <span class="font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${getCategoryStyle(item.category)}">
                ${escapeHtml(item.category)}
              </span>
            </div>
            <p class="text-sm text-ink mt-1.5 leading-relaxed">${escapeHtml(item.definition)}</p>
            <p class="text-xs text-ink-muted mt-2 bg-canvas border-l-2 border-line-strong pl-2.5 py-1.5">
              <span class="font-mono font-semibold text-ink uppercase tracking-wide mr-1">Contoh:</span>
              ${escapeHtml(item.example)}
            </p>
          </article>
        `
        )
        .join('')}
    </div>
  `;
}

function renderFlashcardStageHtml() {
  if (deckOrder.length === 0) {
    return `
      <div class="py-10 px-4 text-center border border-line-strong rounded-lg bg-canvas my-3 space-y-3">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-soft border border-emerald text-emerald">
          ${icon('checkCircle', 20)}
        </div>
        <h4 class="font-display font-bold text-lg text-ink">Semua kartu pada filter ini sudah kamu kuasai!</h4>
        <p class="text-sm text-ink-muted max-w-md mx-auto">Kamu bisa menampilkan kembali seluruh istilah untuk mengulang latihan kapan saja.</p>
        <div class="flex flex-wrap justify-center gap-2 pt-1">
          <button type="button" id="flashcard-show-all-btn" class="wb-btn-primary text-xs px-3.5 py-2">
            Tampilkan Semua Kartu
          </button>
          <button type="button" id="flashcard-reset-empty-btn" class="wb-btn-secondary text-xs px-3.5 py-2">
            Ulangi Status Hafalan
          </button>
        </div>
      </div>
    `;
  }

  const safeIdx = Math.min(Math.max(0, currentCardIndex), deckOrder.length - 1);
  const item = deckOrder[safeIdx];
  const isMastered = masteredTerms.has(item.term);
  const posLabel = `${String(safeIdx + 1).padStart(2, '0')} / ${String(deckOrder.length).padStart(2, '0')}`;

  return `
    <div class="py-3 space-y-3.5">
      <!-- Baris kontrol ringkas dek -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-mono font-semibold text-ink tabular-nums bg-canvas border border-line px-2.5 py-1 rounded">
            KARTU ${posLabel}
          </span>
          <button
            type="button"
            id="flashcard-unmastered-btn"
            class="px-2.5 py-1 rounded border font-medium transition-colors cursor-pointer ${
              onlyUnmastered
                ? 'bg-amber-soft border-amber text-ink font-semibold'
                : 'bg-canvas border-line text-ink-muted hover:text-ink hover:border-line-strong'
            }"
          >
            ${onlyUnmastered ? 'Filter: Belum Hafal' : 'Fokus Belum Hafal'}
          </button>
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" id="flashcard-shuffle-btn" class="wb-btn-ghost text-xs py-1 px-2.5">
            ${icon('refresh', 14)}
            <span>Acak Kartu</span>
          </button>
          ${
            masteredTerms.size > 0
              ? `<button type="button" id="flashcard-reset-btn" class="wb-btn-ghost text-xs py-1 px-2 text-ink-muted hover:text-coral">Reset (${masteredTerms.size})</button>`
              : ''
          }
        </div>
      </div>

      <!-- Kartu Indeks Interaktif (Depan / Belakang) -->
      <div
        id="flashcard-card-surface"
        role="button"
        tabindex="0"
        aria-label="${isCardFlipped ? 'Balik kembali ke nama istilah' : 'Ketuk untuk melihat arti istilah'}"
        class="flashcard-reveal wb-sheet-framed w-full min-h-[228px] p-5 sm:p-6 flex flex-col justify-between cursor-pointer select-none transition-colors ${
          isCardFlipped ? 'bg-canvas' : 'bg-surface hover:bg-canvas/55'
        }"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-[11px] font-semibold uppercase tracking-wider ${
            isCardFlipped ? 'text-cobalt' : 'text-ink-muted'
          }">
            ${isCardFlipped ? ' Sisi Belakang · Arti & Contoh' : 'Sisi Depan · Tebak Artinya'}
          </span>
          <div class="flex items-center gap-1.5">
            ${
              isMastered
                ? `<span class="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald bg-emerald-soft text-ink">${icon('check', 12, 'text-emerald')} Sudah Paham</span>`
                : ''
            }
            <span class="font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${getCategoryStyle(item.category)}">
              ${escapeHtml(item.category)}
            </span>
          </div>
        </div>

        ${
          !isCardFlipped
            ? `
              <div class="py-7 text-center space-y-2">
                <h4 class="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
                  ${escapeHtml(item.term)}
                </h4>
                <p class="font-mono text-sm text-ink-muted">(${escapeHtml(item.english)})</p>
              </div>
              <div class="pt-3 border-t border-line flex items-center justify-center gap-2 text-xs text-ink-muted">
                ${icon('refresh', 14, 'text-cobalt')}
                <span>Pikirkan artinya sejenak, lalu <strong class="text-ink">ketuk kartu</strong> untuk membalik</span>
              </div>
            `
            : `
              <div class="py-4 space-y-3">
                <div class="flex flex-wrap items-baseline gap-2">
                  <h4 class="font-display font-bold text-lg text-ink">${escapeHtml(item.term)}</h4>
                  <span class="font-mono text-xs text-ink-muted">(${escapeHtml(item.english)})</span>
                </div>
                <p class="text-sm sm:text-base text-ink leading-relaxed">
                  ${escapeHtml(item.definition)}
                </p>
                <div class="bg-surface border-l-2 border-cobalt px-3 py-2 rounded-r text-xs sm:text-sm text-ink-muted">
                  <span class="font-mono font-semibold text-ink uppercase tracking-wide mr-1">Contoh:</span>
                  ${escapeHtml(item.example)}
                </div>
              </div>
              <div class="pt-2 text-[11px] font-mono text-ink-muted text-right">
                Ketuk kartu untuk menutup jawaban
              </div>
            `
        }
      </div>

      <!-- Tombol Penilaian Diri (Muncul menonjol saat kartu terbuka) -->
      ${
        isCardFlipped
          ? `
            <div class="grid grid-cols-2 gap-2.5 pt-0.5">
              <button
                type="button"
                id="flashcard-retry-btn"
                class="min-h-[44px] px-3 py-2 rounded-md border-[1.5px] border-amber bg-amber-soft text-ink font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-98 active:scale-[0.99]"
              >
                ${icon('refresh', 15)}
                <span>Masih Ragu, Ulangi Nanti</span>
              </button>
              <button
                type="button"
                id="flashcard-know-btn"
                class="min-h-[44px] px-3 py-2 rounded-md border-[1.5px] border-emerald bg-emerald-soft text-ink font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-98 active:scale-[0.99]"
              >
                ${icon('checkCircle', 16, 'text-emerald')}
                <span>Sudah Paham</span>
              </button>
            </div>
          `
          : ''
      }

      <!-- Navigasi Sebelumnya / Balik / Berikutnya -->
      <div class="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          id="flashcard-prev-btn"
          class="wb-btn-secondary text-xs px-3 py-2"
          ${deckOrder.length <= 1 ? 'disabled' : ''}
        >
          ${icon('arrowLeft', 15)}
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          id="flashcard-flip-btn"
          class="wb-btn-ghost text-xs px-3 py-2 font-semibold text-cobalt"
        >
          ${isCardFlipped ? 'Tutup Jawaban' : 'Lihat Arti'}
        </button>

        <button
          type="button"
          id="flashcard-next-btn"
          class="wb-btn-secondary text-xs px-3 py-2"
          ${deckOrder.length <= 1 ? 'disabled' : ''}
        >
          <span>Berikutnya</span>
          ${icon('arrowRight', 15)}
        </button>
      </div>
    </div>
  `;
}

function updateMasteredBadgeDom() {
  const badgeEl = document.getElementById('glossary-mastered-badge');
  if (badgeEl) {
    badgeEl.textContent = `${masteredTerms.size}/${GLOSSARY_TERMS.length}`;
  }
}

function updateResultsDom() {
  const listEl = document.getElementById('glossary-list-container');
  const countEl = document.getElementById('glossary-count-label');
  if (!listEl) return;

  updateMasteredBadgeDom();

  if (activeMode === 'list') {
    const items = getFilteredTerms();
    if (countEl) {
      countEl.textContent = `Menampilkan ${items.length} dari ${GLOSSARY_TERMS.length} istilah`;
    }
    listEl.innerHTML = renderListHtml();
  } else {
    if (countEl) {
      countEl.textContent = `Dikuasai ${masteredTerms.size} dari ${GLOSSARY_TERMS.length} istilah`;
    }
    listEl.innerHTML = renderFlashcardStageHtml();
    bindFlashcardStageEvents();
  }
}

function advanceCard(step) {
  if (deckOrder.length === 0) return;
  currentCardIndex = (currentCardIndex + step + deckOrder.length) % deckOrder.length;
  isCardFlipped = false;
  updateResultsDom();
}

function flipCurrentCard() {
  if (deckOrder.length === 0) return;
  isCardFlipped = !isCardFlipped;
  updateResultsDom();
}

function bindFlashcardStageEvents() {
  const cardSurface = document.getElementById('flashcard-card-surface');
  cardSurface?.addEventListener('click', flipCurrentCard);
  cardSurface?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      flipCurrentCard();
    }
  });

  document.getElementById('flashcard-flip-btn')?.addEventListener('click', flipCurrentCard);
  document.getElementById('flashcard-prev-btn')?.addEventListener('click', () => advanceCard(-1));
  document.getElementById('flashcard-next-btn')?.addEventListener('click', () => advanceCard(1));

  document.getElementById('flashcard-shuffle-btn')?.addEventListener('click', () => {
    buildFlashcardDeck(true);
    updateResultsDom();
  });

  document.getElementById('flashcard-unmastered-btn')?.addEventListener('click', () => {
    onlyUnmastered = !onlyUnmastered;
    buildFlashcardDeck(false);
    updateResultsDom();
  });

  document.getElementById('flashcard-show-all-btn')?.addEventListener('click', () => {
    onlyUnmastered = false;
    selectedCategory = 'Semua';
    buildFlashcardDeck(false);
    renderModal();
  });

  const handleReset = () => {
    masteredTerms.clear();
    onlyUnmastered = false;
    saveMasteredTerms();
    buildFlashcardDeck(false);
    updateResultsDom();
  };

  document.getElementById('flashcard-reset-btn')?.addEventListener('click', handleReset);
  document.getElementById('flashcard-reset-empty-btn')?.addEventListener('click', handleReset);

  document.getElementById('flashcard-know-btn')?.addEventListener('click', () => {
    const item = deckOrder[currentCardIndex];
    if (!item) return;
    masteredTerms.add(item.term);
    saveMasteredTerms();
    if (onlyUnmastered) {
      buildFlashcardDeck(false);
      updateResultsDom();
    } else {
      advanceCard(1);
    }
  });

  document.getElementById('flashcard-retry-btn')?.addEventListener('click', () => {
    const item = deckOrder[currentCardIndex];
    if (item && masteredTerms.has(item.term)) {
      masteredTerms.delete(item.term);
      saveMasteredTerms();
    }
    advanceCard(1);
  });
}

function renderModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;

  if (!isOpen) {
    root.innerHTML = '';
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  if (activeMode === 'flashcard' && deckOrder.length === 0 && !onlyUnmastered) {
    buildFlashcardDeck(false);
  }

  const filtered = getFilteredTerms();

  root.innerHTML = `
    <div id="glossary-backdrop" class="fixed inset-0 z-50 bg-ink/45 flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="glossary-modal-title">
      <div class="wb-sheet-framed w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-surface">
        <div class="px-5 py-4 border-b border-line-strong flex items-center justify-between gap-3 bg-canvas">
          <div>
            <p class="editorial-index">Referensi &amp; Latihan Cepat</p>
            <h3 id="glossary-modal-title" class="font-display font-bold text-xl text-ink flex items-center gap-2 mt-0.5">
              ${icon('book', 20, 'text-cobalt')}
              <span>Kamus Istilah Koding &amp; AI</span>
            </h3>
          </div>
          <button type="button" id="glossary-close-btn" class="wb-btn-ghost p-2" aria-label="Tutup Kamus Istilah">
            ${icon('close', 20)}
          </button>
        </div>

        <div class="px-5 py-3.5 border-b border-line bg-surface space-y-3">
          <!-- Pengalih Mode: Daftar Istilah vs Kartu Hafalan -->
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="inline-flex p-1 rounded-md bg-canvas border border-line" role="tablist" aria-label="Mode Kamus">
              <button
                type="button"
                data-glossary-mode="list"
                role="tab"
                aria-selected="${activeMode === 'list' ? 'true' : 'false'}"
                class="px-3 py-1.5 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'list'
                    ? 'bg-ink text-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }"
              >
                ${icon('book', 14)}
                <span>Daftar Istilah</span>
              </button>
              <button
                type="button"
                data-glossary-mode="flashcard"
                role="tab"
                aria-selected="${activeMode === 'flashcard' ? 'true' : 'false'}"
                class="px-3 py-1.5 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'flashcard'
                    ? 'bg-cobalt text-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }"
              >
                ${icon('layers', 14)}
                <span>Kartu Hafalan</span>
                <span id="glossary-mastered-badge" class="font-mono text-[11px] px-1.5 py-0.2 rounded tabular-nums ${
                  activeMode === 'flashcard'
                    ? 'bg-surface/20 text-surface'
                    : 'bg-surface border border-line text-ink-muted'
                }">${masteredTerms.size}/${GLOSSARY_TERMS.length}</span>
              </button>
            </div>

            <span id="glossary-count-label" class="font-mono text-xs text-ink-muted tabular-nums">
              ${
                activeMode === 'list'
                  ? `Menampilkan ${filtered.length} dari ${GLOSSARY_TERMS.length} istilah`
                  : `Dikuasai ${masteredTerms.size} dari ${GLOSSARY_TERMS.length} istilah`
              }
            </span>
          </div>

          ${
            activeMode === 'list'
              ? `
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
                    ${icon('search', 16)}
                  </span>
                  <input
                    type="search"
                    id="glossary-search-input"
                    value="${escapeHtml(searchQuery)}"
                    placeholder="Cari istilah (misal: Boolean, Indentasi, Elif, Decision Tree)..."
                    class="w-full pl-9 pr-3 py-2 text-sm bg-canvas border border-line-strong rounded-md text-ink placeholder:text-ink-muted focus:border-cobalt focus:bg-surface"
                  />
                </div>
              `
              : ''
          }

          <div class="flex flex-wrap gap-1.5" role="tablist" aria-label="Kategori istilah">
            ${GLOSSARY_CATEGORIES.map((cat) => {
              const active = cat === selectedCategory;
              return `
                <button
                  type="button"
                  data-glossary-cat="${escapeHtml(cat)}"
                  class="px-2.5 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    active
                      ? 'bg-ink text-surface border-ink'
                      : 'bg-canvas text-ink border-line hover:border-line-strong'
                  }"
                >${escapeHtml(cat)}</button>
              `;
            }).join('')}
          </div>
        </div>

        <div id="glossary-list-container" class="px-5 py-2 overflow-y-auto flex-1">
          ${activeMode === 'list' ? renderListHtml() : renderFlashcardStageHtml()}
        </div>

        <div class="px-5 py-3 border-t border-line bg-canvas flex items-center justify-between gap-2 text-xs text-ink-muted">
          <span>${
            activeMode === 'flashcard'
              ? 'Tips PC Lab: Spasi untuk balik kartu, Panah Kiri/Kanan untuk pindah.'
              : 'Tersedia penuh saat luring.'
          }</span>
          <button type="button" id="glossary-done-btn" class="wb-btn-secondary py-1.5 px-3 text-xs">Tutup Kamus</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('glossary-close-btn')?.addEventListener('click', closeGlossaryModal);
  document.getElementById('glossary-done-btn')?.addEventListener('click', closeGlossaryModal);
  document.getElementById('glossary-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'glossary-backdrop') closeGlossaryModal();
  });

  const searchInput = document.getElementById('glossary-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateResultsDom();
  });

  root.querySelectorAll('[data-glossary-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextMode = btn.getAttribute('data-glossary-mode') || 'list';
      if (nextMode === activeMode) return;
      activeMode = nextMode;
      if (activeMode === 'flashcard') {
        buildFlashcardDeck(false);
      }
      renderModal();
    });
  });

  root.querySelectorAll('[data-glossary-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-glossary-cat') || 'Semua';
      if (activeMode === 'flashcard') {
        buildFlashcardDeck(false);
      }
      renderModal();
      if (activeMode === 'list') {
        const inputAfter = document.getElementById('glossary-search-input');
        if (inputAfter) {
          inputAfter.focus();
          inputAfter.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      }
    });
  });

  if (activeMode === 'flashcard') {
    bindFlashcardStageEvents();
  } else {
    setTimeout(() => {
      searchInput?.focus();
    }, 40);
  }
}

function handleKeydown(e) {
  if (!isOpen) return;
  if (e.key === 'Escape') {
    closeGlossaryModal();
    return;
  }

  if (activeMode === 'flashcard') {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === ' ') {
      e.preventDefault();
      flipCurrentCard();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      advanceCard(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      advanceCard(-1);
    }
  }
}

export function openGlossaryModal(initialTerm = '', mode = 'list') {
  isOpen = true;
  masteredTerms = loadMasteredTerms();
  if (typeof initialTerm === 'string' && initialTerm.length > 0) {
    searchQuery = initialTerm;
    selectedCategory = 'Semua';
    activeMode = 'list';
  } else if (mode === 'flashcard') {
    activeMode = 'flashcard';
    buildFlashcardDeck(false);
  }
  document.addEventListener('keydown', handleKeydown);
  renderModal();
}

export function closeGlossaryModal() {
  isOpen = false;
  document.removeEventListener('keydown', handleKeydown);
  renderModal();
}
