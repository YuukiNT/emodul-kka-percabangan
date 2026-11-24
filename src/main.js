/**
 * main.js - App Shell 9 Layar, Kamus Istilah, Buku Catatan, dan Mode Luring (PWA)
 */

import './styles/app.css';

import { MODULE_META, SCREENS } from './data/curriculum.js';
import {
  getProgress,
  getState,
  setCurrentScreen,
  subscribeStore,
} from './storage/localStore.js';
import { initNotesDb } from './storage/notesDb.js';
import { initPwa, subscribePwa } from './pwa/pwaManager.js';
import { icon } from './components/icons.js';
import { openGlossaryModal } from './components/glossaryModal.js';
import { openNotesDrawer, setNotesCountListener } from './components/notesDrawer.js';

import { renderScreen1Home } from './screens/screen1Home.js';
import { renderScreen2Guide } from './screens/screen2Guide.js';
import { renderScreen3Objectives } from './screens/screen3Objectives.js';
import { renderScreen4Menu } from './screens/screen4Menu.js';
import { renderScreen5Kb1 } from './screens/screen5Kb1.js';
import { renderScreen6Kb2 } from './screens/screen6Kb2.js';
import { renderScreen7Kb3Preview } from './screens/screen7Kb3Preview.js';
import { renderScreen8Kb4Preview } from './screens/screen8Kb4Preview.js';
import { renderScreen9EvalPreview } from './screens/screen9EvalPreview.js';

let mobileSidebarOpen = false;
let currentNotesCount = 0;
let pwaSnapshot = { online: true, swRegistered: false, cacheReady: false, cachedCount: 0 };

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function showToast(message) {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const toast = document.createElement('div');
  toast.className =
    'pointer-events-auto max-w-xs sm:max-w-sm px-4 py-2.5 rounded-md bg-ink text-surface border border-line-strong shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-opacity duration-200';
  toast.innerHTML = `${icon('checkCircle', 16, 'text-emerald-soft shrink-0')}<span>${escapeHtml(message)}</span>`;
  root.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function screenFromHash() {
  const match = window.location.hash.match(/^#layar-(\d)$/);
  if (!match) return null;
  const num = Number(match[1]);
  return num >= 1 && num <= 9 ? num : null;
}

function navigate(screenId, { updateHash = true } = {}) {
  const n = Math.max(1, Math.min(9, Number(screenId) || 1));
  mobileSidebarOpen = false;
  setCurrentScreen(n);
  if (updateHash) {
    const targetHash = `#layar-${n}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }
  renderActiveScreen();
  updateShellChrome();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSidebarNavMarkup() {
  const state = getState();
  const groups = ['Orientasi', 'Kegiatan Belajar', 'Penilaian'];

  return `
    <div class="p-4 flex flex-col h-full justify-between gap-6">
      <div class="space-y-5">
        <div class="pb-3 border-b border-line flex items-center justify-between">
          <div>
            <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">Daftar Layar</p>
            <p class="font-display font-bold text-sm text-ink">Navigasi E-Modul</p>
          </div>
          <button type="button" data-close-sidebar class="lg:hidden p-1.5 rounded hover:bg-canvas text-ink-muted cursor-pointer" aria-label="Tutup menu navigasi">
            ${icon('close', 18)}
          </button>
        </div>

        <nav aria-label="Menu utama 9 layar" class="space-y-4">
          ${groups
            .map((grp) => {
              const items = SCREENS.filter((s) => s.group === grp);
              return `
                <div>
                  <p class="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted px-2 mb-1.5">${grp}</p>
                  <ul class="space-y-1">
                    ${items
                      .map((scr) => {
                        const active = state.currentScreen === scr.id;
                        const visited = state.visitedScreens.includes(scr.id);
                        return `
                          <li>
                            <button
                              type="button"
                              data-nav-screen="${scr.id}"
                              aria-current="${active ? 'page' : 'false'}"
                              class="w-full text-left px-2.5 py-2 rounded-md text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                active
                                  ? 'bg-ink text-surface font-semibold'
                                  : 'text-ink hover:bg-canvas'
                              }"
                            >
                              <span class="flex items-center gap-2 min-w-0">
                                <span class="font-mono text-[11px] font-bold ${active ? 'text-cobalt-soft' : 'text-ink-muted'}">${scr.code}</span>
                                ${icon(scr.icon, 15, active ? 'text-surface' : 'text-cobalt')}
                                <span class="truncate">${scr.shortTitle}</span>
                              </span>
                              ${
                                visited && !active
                                  ? `<span class="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" title="Sudah dibuka"></span>`
                                  : ''
                              }
                            </button>
                          </li>
                        `;
                      })
                      .join('')}
                  </ul>
                </div>
              `;
            })
            .join('')}
        </nav>
      </div>

      <div class="pt-4 border-t border-line space-y-2">
        <p class="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted px-1">Alat Bantu</p>
        <button type="button" data-open-glossary class="w-full text-left px-2.5 py-2 rounded-md border border-line bg-canvas hover:border-line-strong text-xs font-semibold text-ink flex items-center justify-between cursor-pointer">
          <span class="flex items-center gap-2">${icon('book', 15, 'text-cobalt')} Kamus Istilah</span>
          <span class="font-mono text-[10.5px] text-ink-muted">18</span>
        </button>
        <button type="button" data-open-notes class="w-full text-left px-2.5 py-2 rounded-md border border-line bg-canvas hover:border-line-strong text-xs font-semibold text-ink flex items-center justify-between cursor-pointer">
          <span class="flex items-center gap-2">${icon('notebook', 15, 'text-cobalt')} Buku Catatan</span>
          <span class="font-mono text-[10.5px] text-cobalt font-bold" data-notes-badge>${currentNotesCount}</span>
        </button>
        <p class="text-[10.5px] text-ink-muted px-1 pt-1 leading-snug">
          ${MODULE_META.school} · KKA Kelas IX
        </p>
      </div>
    </div>
  `;
}

function renderStepperMarkup() {
  const state = getState();
  return `
    <div class="bg-surface border-b border-line">
      <div class="max-w-5xl mx-auto px-3 sm:px-6 py-2">
        <nav aria-label="Stepper 9 Layar" class="stepper-scroll flex items-center gap-1.5 overflow-x-auto pb-0.5">
          ${SCREENS.map((scr) => {
            const active = state.currentScreen === scr.id;
            const visited = state.visitedScreens.includes(scr.id);
            return `
              <button
                type="button"
                data-step-screen="${scr.id}"
                aria-current="${active ? 'step' : 'false'}"
                class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-cobalt text-surface border-line-strong font-semibold'
                    : visited
                    ? 'bg-canvas text-ink border-line hover:border-line-strong'
                    : 'bg-surface text-ink-muted border-transparent hover:border-line hover:text-ink'
                }"
              >
                <span class="font-mono text-[11px] font-bold">${scr.id}</span>
                <span class="whitespace-nowrap">${scr.shortTitle}</span>
              </button>
            `;
          }).join('')}
        </nav>
      </div>
    </div>
  `;
}

function buildAppShell() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <header class="sticky top-0 z-30 bg-surface/95 backdrop-blur-xs border-b-2 border-line-strong">
      <div class="px-3 sm:px-5 h-15 flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            id="mobile-menu-toggle"
            class="lg:hidden p-2 rounded-md border border-line hover:border-line-strong bg-canvas text-ink cursor-pointer"
            aria-label="Buka menu navigasi"
            aria-expanded="false"
          >
            ${icon('menu', 19)}
          </button>

          <button type="button" id="brand-home-btn" class="flex items-center gap-2.5 text-left min-w-0 cursor-pointer">
            <img src="./icons/icon.svg" alt="" class="w-8 h-8 rounded-md shrink-0 border border-line-strong" />
            <div class="min-w-0">
              <span class="font-display font-extrabold text-sm sm:text-base text-ink block leading-none truncate">E-Modul KKA</span>
              <span class="font-mono text-[10px] text-ink-muted hidden sm:block mt-0.5">Percabangan · Kelas IX</span>
            </div>
          </button>
        </div>

        <div class="hidden md:flex items-center gap-2.5 min-w-[170px] max-w-[240px] flex-1">
          <div class="flex-1">
            <div class="flex items-center justify-between text-[11px] font-mono mb-1">
              <span class="text-ink-muted uppercase">Progres</span>
              <span id="header-progress-text" class="font-bold text-cobalt">0%</span>
            </div>
            <div class="w-full h-2 bg-canvas border border-line-strong rounded-full overflow-hidden">
              <div id="header-progress-bar" class="h-full bg-cobalt transition-all duration-300" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            id="header-network-badge"
            class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-mono font-semibold border-emerald bg-emerald-soft text-ink"
            title="Status koneksi perangkat"
          >
            ${icon('wifi', 13, 'text-emerald')}
            <span class="hidden sm:inline">Daring</span>
          </span>

          <button
            type="button"
            id="header-glossary-btn"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line hover:border-line-strong bg-canvas text-xs font-semibold text-ink cursor-pointer"
            title="Buka Kamus Istilah Koding & AI"
          >
            ${icon('book', 15, 'text-cobalt')}
            <span class="hidden sm:inline">Kamus</span>
          </button>

          <button
            type="button"
            id="header-notes-btn"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line hover:border-line-strong bg-canvas text-xs font-semibold text-ink cursor-pointer"
            title="Buka Buku Catatan Belajar"
          >
            ${icon('notebook', 15, 'text-cobalt')}
            <span class="hidden sm:inline">Catatan</span>
            <span data-notes-badge class="font-mono text-[10.5px] px-1.5 rounded bg-cobalt-soft text-cobalt font-bold">0</span>
          </button>

          <button
            type="button"
            id="header-profile-chip"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line-strong bg-surface hover:bg-canvas text-xs font-semibold text-ink cursor-pointer max-w-[130px] sm:max-w-[180px]"
            title="Ubah profil siswa di Beranda"
          >
            ${icon('user', 14, 'text-cobalt')}
            <span id="header-profile-label" class="truncate">Profil</span>
          </button>
        </div>
      </div>

      <div class="md:hidden px-3 py-1.5 bg-canvas border-t border-line flex items-center gap-2.5">
        <span class="font-mono text-[10.5px] text-ink-muted uppercase shrink-0">Progres Belajar</span>
        <div class="flex-1 h-1.5 bg-surface border border-line-strong rounded-full overflow-hidden">
          <div id="mobile-progress-bar" class="h-full bg-cobalt transition-all duration-300" style="width: 0%"></div>
        </div>
        <span id="mobile-progress-text" class="font-mono text-[11px] font-bold text-cobalt shrink-0">0%</span>
      </div>
    </header>

    <div class="flex-1 flex min-w-0 relative">
      <aside id="desktop-sidebar" class="hidden lg:block w-64 shrink-0 bg-surface border-r border-line sticky top-15 h-[calc(100vh-3.75rem)] overflow-y-auto">
      </aside>

      <div id="mobile-sidebar-overlay" class="fixed inset-0 z-40 bg-ink/45 hidden lg:hidden">
        <aside id="mobile-sidebar-panel" class="w-72 max-w-[85vw] h-full bg-surface border-r-2 border-line-strong overflow-y-auto shadow-xl"></aside>
      </div>

      <div class="flex-1 min-w-0 flex flex-col">
        <div id="stepper-mount"></div>
        <main id="screen-mount" class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        </main>
      </div>
    </div>
  `;

  document.getElementById('brand-home-btn')?.addEventListener('click', () => navigate(1));
  document.getElementById('header-glossary-btn')?.addEventListener('click', () => openGlossaryModal());
  document.getElementById('header-notes-btn')?.addEventListener('click', () => openNotesDrawer());
  document.getElementById('header-profile-chip')?.addEventListener('click', () => navigate(1));

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    mobileSidebarOpen = !mobileSidebarOpen;
    syncMobileSidebarVisibility();
  });

  document.getElementById('mobile-sidebar-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'mobile-sidebar-overlay') {
      mobileSidebarOpen = false;
      syncMobileSidebarVisibility();
    }
  });
}

function syncMobileSidebarVisibility() {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (!overlay) return;
  if (mobileSidebarOpen) {
    overlay.classList.remove('hidden');
    toggleBtn?.setAttribute('aria-expanded', 'true');
  } else {
    overlay.classList.add('hidden');
    toggleBtn?.setAttribute('aria-expanded', 'false');
  }
}

function bindSidebarInteractions(root) {
  if (!root) return;
  root.querySelectorAll('[data-nav-screen]').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigate(Number(btn.getAttribute('data-nav-screen')));
    });
  });
  root.querySelectorAll('[data-close-sidebar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileSidebarOpen = false;
      syncMobileSidebarVisibility();
    });
  });
  root.querySelectorAll('[data-open-glossary]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileSidebarOpen = false;
      syncMobileSidebarVisibility();
      openGlossaryModal();
    });
  });
  root.querySelectorAll('[data-open-notes]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileSidebarOpen = false;
      syncMobileSidebarVisibility();
      openNotesDrawer();
    });
  });
}

function updateShellChrome() {
  const state = getState();
  const progress = getProgress();

  const hPct = document.getElementById('header-progress-text');
  const hBar = document.getElementById('header-progress-bar');
  const mPct = document.getElementById('mobile-progress-text');
  const mBar = document.getElementById('mobile-progress-bar');
  if (hPct) hPct.textContent = `${progress.percent}%`;
  if (hBar) hBar.style.width = `${progress.percent}%`;
  if (mPct) mPct.textContent = `${progress.percent}%`;
  if (mBar) mBar.style.width = `${progress.percent}%`;

  const profLabel = document.getElementById('header-profile-label');
  if (profLabel) {
    profLabel.textContent = state.profile.name
      ? `${state.profile.name} (${state.profile.kelas})`
      : `Isi Profil (${state.profile.kelas || 'IX-D'})`;
  }

  const netBadge = document.getElementById('header-network-badge');
  if (netBadge) {
    if (pwaSnapshot.online) {
      netBadge.className =
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-mono font-semibold border-emerald bg-emerald-soft text-ink';
      netBadge.innerHTML = `${icon('wifi', 13, 'text-emerald')}<span class="hidden sm:inline">Daring</span>`;
    } else {
      netBadge.className =
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-mono font-semibold border-amber bg-amber-soft text-ink';
      netBadge.innerHTML = `${icon('wifiOff', 13, 'text-ink')}<span class="hidden sm:inline">Luring</span>`;
    }
  }

  const sidebarHtml = renderSidebarNavMarkup();
  const deskSidebar = document.getElementById('desktop-sidebar');
  const mobSidebar = document.getElementById('mobile-sidebar-panel');
  if (deskSidebar) {
    deskSidebar.innerHTML = sidebarHtml;
    bindSidebarInteractions(deskSidebar);
  }
  if (mobSidebar) {
    mobSidebar.innerHTML = sidebarHtml;
    bindSidebarInteractions(mobSidebar);
  }
  syncMobileSidebarVisibility();

  const stepperMount = document.getElementById('stepper-mount');
  if (stepperMount) {
    stepperMount.innerHTML = renderStepperMarkup();
    stepperMount.querySelectorAll('[data-step-screen]').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigate(Number(btn.getAttribute('data-step-screen')));
      });
    });
  }

  document.querySelectorAll('[data-notes-badge]').forEach((el) => {
    el.textContent = String(currentNotesCount);
  });
}

function renderActiveScreen() {
  const mount = document.getElementById('screen-mount');
  if (!mount) return;

  const { currentScreen } = getState();
  const ctx = {
    navigate,
    openGlossary: (term = '') => openGlossaryModal(term),
    openNotes: () => openNotesDrawer(),
    showToast,
  };

  switch (currentScreen) {
    case 1:
      renderScreen1Home(mount, ctx);
      break;
    case 2:
      renderScreen2Guide(mount, ctx);
      break;
    case 3:
      renderScreen3Objectives(mount, ctx);
      break;
    case 4:
      renderScreen4Menu(mount, ctx);
      break;
    case 5:
      renderScreen5Kb1(mount, ctx);
      break;
    case 6:
      renderScreen6Kb2(mount, ctx);
      break;
    case 7:
      renderScreen7Kb3Preview(mount, ctx);
      break;
    case 8:
      renderScreen8Kb4Preview(mount, ctx);
      break;
    case 9:
      renderScreen9EvalPreview(mount, ctx);
      break;
    default:
      renderScreen1Home(mount, ctx);
  }
}

async function bootstrap() {
  buildAppShell();

  const initialHashScreen = screenFromHash();
  if (initialHashScreen) {
    setCurrentScreen(initialHashScreen);
  }

  subscribeStore(() => {
    updateShellChrome();
  });

  await initNotesDb();
  setNotesCountListener((count) => {
    currentNotesCount = count;
    document.querySelectorAll('[data-notes-badge]').forEach((el) => {
      el.textContent = String(count);
    });
  });

  subscribePwa((nextPwa) => {
    pwaSnapshot = nextPwa;
    updateShellChrome();
    if (getState().currentScreen === 2) {
      const swEl = document.getElementById('guide-sw-status');
      const cacheEl = document.getElementById('guide-cache-status');
      if (swEl) {
        swEl.textContent = nextPwa.swRegistered ? 'Terdaftar & Aktif' : 'Menyiapkan...';
      }
      if (cacheEl) {
        cacheEl.textContent = nextPwa.cacheReady
          ? `Siap (${nextPwa.cachedCount} berkas tersimpan)`
          : 'Menyiapkan berkas...';
      }
    }
  });
  initPwa();

  window.addEventListener('hashchange', () => {
    const target = screenFromHash();
    if (target && target !== getState().currentScreen) {
      navigate(target, { updateHash: false });
    }
  });

  updateShellChrome();
  renderActiveScreen();
}

bootstrap();
