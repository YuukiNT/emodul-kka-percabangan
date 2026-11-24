/**
 * notesDrawer.js - Drawer Buku Catatan Belajar siswa berbasis IndexedDB
 */

import { addNote, deleteNote, getAllNotes, updateNote } from '../storage/notesDb.js';
import { getState } from '../storage/localStore.js';
import { icon } from './icons.js';

const CHAPTER_OPTIONS = [
  'Umum',
  'KB 1: Flowchart',
  'KB 2: Blok Visual',
  'KB 3: Python',
  'KB 4: Pohon Keputusan',
  'Evaluasi Mandiri',
];

let isOpen = false;
let notesCache = [];
let filterChapter = 'Semua';
let editingNoteId = null;
let onCountChangeCallback = null;
let statusMessage = '';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function defaultChapterFromScreen() {
  const screen = getState().currentScreen;
  if (screen === 5) return 'KB 1: Flowchart';
  if (screen === 6) return 'KB 2: Blok Visual';
  if (screen === 7) return 'KB 3: Python';
  if (screen === 8) return 'KB 4: Pohon Keputusan';
  if (screen === 9) return 'Evaluasi Mandiri';
  return 'Umum';
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return 'Baru saja';
  }
}

function notifyCount() {
  if (typeof onCountChangeCallback === 'function') {
    onCountChangeCallback(notesCache.length);
  }
}

async function refreshNotes() {
  try {
    notesCache = await getAllNotes();
    notifyCount();
  } catch {
    notesCache = [];
  }
}

function renderDrawer() {
  const root = document.getElementById('drawer-root');
  if (!root) return;

  if (!isOpen) {
    root.innerHTML = '';
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  const editingItem = editingNoteId ? notesCache.find((n) => n.id === editingNoteId) : null;
  const activeChapter = editingItem ? editingItem.chapter : defaultChapterFromScreen();

  const visibleNotes =
    filterChapter === 'Semua'
      ? notesCache
      : notesCache.filter((n) => n.chapter === filterChapter);

  root.innerHTML = `
    <div id="notes-drawer-backdrop" class="fixed inset-0 z-50 bg-ink/45 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="notes-drawer-title">
      <aside class="w-full max-w-md bg-surface border-l-2 border-line-strong h-full flex flex-col shadow-xl">
        <div class="px-5 py-4 border-b border-line-strong bg-canvas flex items-start justify-between gap-3">
          <div>
            <p class="editorial-index">Catatan Pribadi</p>
            <h3 id="notes-drawer-title" class="font-display font-bold text-xl text-ink flex items-center gap-2 mt-0.5">
              ${icon('notebook', 20, 'text-cobalt')}
              <span>Buku Catatan Belajar</span>
            </h3>
            <p class="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald inline-block"></span>
              <span>Tersimpan otomatis di perangkat meski luring</span>
            </p>
          </div>
          <button type="button" id="notes-close-btn" class="wb-btn-ghost p-2" aria-label="Tutup Buku Catatan">
            ${icon('close', 20)}
          </button>
        </div>

        <form id="note-form" class="p-4 border-b border-line bg-surface space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-semibold uppercase tracking-wide text-ink">
              ${editingItem ? 'Ubah Catatan Terpilih' : 'Tulis Catatan Baru'}
            </span>
            ${
              editingItem
                ? '<button type="button" id="note-cancel-edit" class="text-xs font-semibold text-coral hover:underline cursor-pointer">Batal Edit</button>'
                : ''
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="block">
              <span class="sr-only">Pilih Bab</span>
              <select
                id="note-chapter-input"
                name="chapter"
                class="w-full px-2.5 py-2 text-xs font-medium bg-canvas border border-line-strong rounded-md text-ink"
              >
                ${CHAPTER_OPTIONS.map(
                  (opt) =>
                    `<option value="${escapeHtml(opt)}" ${opt === activeChapter ? 'selected' : ''}>${escapeHtml(opt)}</option>`
                ).join('')}
              </select>
            </label>
            <label class="block">
              <span class="sr-only">Judul Catatan</span>
              <input
                type="text"
                id="note-title-input"
                name="title"
                required
                maxlength="80"
                value="${editingItem ? escapeHtml(editingItem.title) : ''}"
                placeholder="Judul singkat catatan..."
                class="w-full px-2.5 py-2 text-xs bg-canvas border border-line-strong rounded-md text-ink placeholder:text-ink-muted focus:bg-surface"
              />
            </label>
          </div>

          <label class="block">
            <span class="sr-only">Isi Catatan</span>
            <textarea
              id="note-content-input"
              name="content"
              rows="3"
              required
              placeholder="Catat rumus perbandingan, poin penting flowchart, atau hal yang ingin ditanyakan ke guru..."
              class="w-full px-3 py-2 text-sm bg-canvas border border-line-strong rounded-md text-ink placeholder:text-ink-muted focus:bg-surface resize-y"
            >${editingItem ? escapeHtml(editingItem.content) : ''}</textarea>
          </label>

          <div class="flex items-center justify-between gap-2 pt-0.5">
            <span id="note-status-msg" class="text-xs text-emerald font-medium">${escapeHtml(statusMessage)}</span>
            <button type="submit" id="note-submit-btn" class="wb-btn-primary py-1.5 px-3.5 text-xs">
              ${icon(editingItem ? 'check' : 'plus', 15)}
              <span>${editingItem ? 'Perbarui Catatan' : 'Simpan Catatan'}</span>
            </button>
          </div>
        </form>

        <div class="px-4 py-2.5 bg-canvas border-b border-line flex items-center justify-between gap-2">
          <label class="flex items-center gap-2 text-xs text-ink-muted">
            <span class="font-mono uppercase font-semibold">Filter:</span>
            <select id="notes-filter-select" class="bg-surface border border-line rounded px-2 py-1 text-xs text-ink">
              <option value="Semua" ${filterChapter === 'Semua' ? 'selected' : ''}>Semua Bab (${notesCache.length})</option>
              ${CHAPTER_OPTIONS.map((ch) => {
                const count = notesCache.filter((n) => n.chapter === ch).length;
                return `<option value="${escapeHtml(ch)}" ${filterChapter === ch ? 'selected' : ''}>${escapeHtml(ch)} (${count})</option>`;
              }).join('')}
            </select>
          </label>
          <span class="font-mono text-xs text-ink-muted">${visibleNotes.length} catatan</span>
        </div>

        <div id="notes-list-body" class="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas">
          ${
            visibleNotes.length === 0
              ? `
                <div class="text-center py-10 px-4 border border-dashed border-line rounded-md bg-surface">
                  <p class="font-display font-bold text-sm text-ink">Belum ada catatan pada filter ini</p>
                  <p class="text-xs text-ink-muted mt-1 leading-relaxed">
                    Tulis poin penting dari materi di formulir atas. Catatan tetap tersimpan walau halaman dimuat ulang atau tanpa internet.
                  </p>
                </div>
              `
              : visibleNotes
                  .map(
                    (note) => `
                  <article class="wb-sheet p-3.5 ${editingNoteId === note.id ? 'border-cobalt ring-1 ring-cobalt' : ''}" data-note-id="${note.id}">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <span class="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-cobalt">
                          ${escapeHtml(note.chapter)}
                        </span>
                        <h4 class="font-display font-bold text-sm text-ink mt-0.5">${escapeHtml(note.title)}</h4>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <button type="button" data-edit-note="${note.id}" class="p-1.5 text-ink-muted hover:text-cobalt rounded hover:bg-canvas cursor-pointer" title="Ubah catatan" aria-label="Ubah catatan ${escapeHtml(note.title)}">
                          ${icon('edit', 15)}
                        </button>
                        <button type="button" data-delete-note="${note.id}" class="p-1.5 text-ink-muted hover:text-coral rounded hover:bg-canvas cursor-pointer" title="Hapus catatan" aria-label="Hapus catatan ${escapeHtml(note.title)}">
                          ${icon('trash', 15)}
                        </button>
                      </div>
                    </div>
                    <p class="text-sm text-ink mt-2 whitespace-pre-line leading-relaxed">${escapeHtml(note.content)}</p>
                    <p class="font-mono text-[10.5px] text-ink-muted mt-2.5 pt-2 border-t border-line">
                      Diperbarui: ${escapeHtml(formatDate(note.updatedAt))}
                    </p>
                  </article>
                `
                  )
                  .join('')
          }
        </div>
      </aside>
    </div>
  `;

  document.getElementById('notes-close-btn')?.addEventListener('click', closeNotesDrawer);
  document.getElementById('notes-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'notes-drawer-backdrop') closeNotesDrawer();
  });

  document.getElementById('note-cancel-edit')?.addEventListener('click', () => {
    editingNoteId = null;
    statusMessage = '';
    renderDrawer();
  });

  document.getElementById('notes-filter-select')?.addEventListener('change', (e) => {
    filterChapter = e.target.value;
    renderDrawer();
  });

  document.getElementById('note-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const chapter = document.getElementById('note-chapter-input')?.value || 'Umum';
    const title = document.getElementById('note-title-input')?.value.trim() || '';
    const content = document.getElementById('note-content-input')?.value.trim() || '';
    if (!title || !content) return;

    if (editingNoteId) {
      await updateNote(editingNoteId, { chapter, title, content });
      editingNoteId = null;
      statusMessage = 'Catatan berhasil diperbarui.';
    } else {
      await addNote({ chapter, title, content });
      statusMessage = 'Catatan berhasil disimpan.';
    }
    await refreshNotes();
    renderDrawer();
  });

  root.querySelectorAll('[data-edit-note]').forEach((btn) => {
    btn.addEventListener('click', () => {
      editingNoteId = Number(btn.getAttribute('data-edit-note'));
      statusMessage = '';
      renderDrawer();
      document.getElementById('note-title-input')?.focus();
    });
  });

  root.querySelectorAll('[data-delete-note]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.getAttribute('data-delete-note'));
      await deleteNote(id);
      if (editingNoteId === id) editingNoteId = null;
      statusMessage = 'Catatan dihapus.';
      await refreshNotes();
      renderDrawer();
    });
  });
}

function handleEscape(e) {
  if (e.key === 'Escape' && isOpen) {
    closeNotesDrawer();
  }
}

export function setNotesCountListener(cb) {
  onCountChangeCallback = cb;
  refreshNotes();
}

export async function openNotesDrawer() {
  isOpen = true;
  statusMessage = '';
  document.addEventListener('keydown', handleEscape);
  await refreshNotes();
  renderDrawer();
}

export function closeNotesDrawer() {
  isOpen = false;
  editingNoteId = null;
  document.removeEventListener('keydown', handleEscape);
  renderDrawer();
}
