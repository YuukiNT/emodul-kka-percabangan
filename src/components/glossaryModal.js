/**
 * glossaryModal.js - Modal Kamus Istilah Koding & AI
 * Pencarian cepat dan filter 3 kategori (Logika & Flowchart, Blok & Python, AI)
 */

import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } from '../data/glossaryData.js';
import { icon } from './icons.js';

let isOpen = false;
let searchQuery = '';
let selectedCategory = 'Semua';

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

function updateResultsDom() {
  const listEl = document.getElementById('glossary-list-container');
  const countEl = document.getElementById('glossary-count-label');
  if (!listEl || !countEl) return;
  const items = getFilteredTerms();
  countEl.textContent = `Menampilkan ${items.length} dari ${GLOSSARY_TERMS.length} istilah`;
  listEl.innerHTML = renderListHtml();
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

  const filtered = getFilteredTerms();

  root.innerHTML = `
    <div id="glossary-backdrop" class="fixed inset-0 z-50 bg-ink/45 flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="glossary-modal-title">
      <div class="wb-sheet-framed w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden bg-surface">
        <div class="px-5 py-4 border-b border-line-strong flex items-center justify-between gap-3 bg-canvas">
          <div>
            <p class="editorial-index">Referensi Cepat</p>
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
          <div class="flex flex-wrap items-center justify-between gap-2">
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
            <span id="glossary-count-label" class="font-mono text-xs text-ink-muted">
              Menampilkan ${filtered.length} dari ${GLOSSARY_TERMS.length} istilah
            </span>
          </div>
        </div>

        <div id="glossary-list-container" class="px-5 py-2 overflow-y-auto flex-1">
          ${renderListHtml()}
        </div>

        <div class="px-5 py-3 border-t border-line bg-canvas flex items-center justify-between text-xs text-ink-muted">
          <span>Dapat diakses penuh saat luring.</span>
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

  root.querySelectorAll('[data-glossary-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-glossary-cat') || 'Semua';
      renderModal();
      const inputAfter = document.getElementById('glossary-search-input');
      if (inputAfter) {
        inputAfter.focus();
        inputAfter.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  });

  setTimeout(() => {
    searchInput?.focus();
  }, 40);
}

function handleEscape(e) {
  if (e.key === 'Escape' && isOpen) {
    closeGlossaryModal();
  }
}

export function openGlossaryModal(initialTerm = '') {
  isOpen = true;
  if (typeof initialTerm === 'string' && initialTerm.length > 0) {
    searchQuery = initialTerm;
    selectedCategory = 'Semua';
  }
  document.addEventListener('keydown', handleEscape);
  renderModal();
}

export function closeGlossaryModal() {
  isOpen = false;
  document.removeEventListener('keydown', handleEscape);
  renderModal();
}
