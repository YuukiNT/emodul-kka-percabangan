/**
 * main.js - App Shell Buku Kerja Fokus (Focus Reading Canvas)
 * Menghilangkan duplikasi bar navigasi bising & mengutamakan ruang baca yang tenang.
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
let desktopFocusMode = false;
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
  }, 3000);
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

function isScreenCompleted(scrId, state) {
  const m = state.milestones;
  if (scrId === 1) return Boolean(m.profileSaved);
  if (scrId === 2) return Boolean(m.guideRead);
  if (scrId === 3) return Boolean(m.objectivesRead);
  if (scrId === 4) return state.visitedScreens.includes(4);
  if (scrId === 5) return Boolean(m.kb1SimTested && m.kb1QuizDone);
  if (scrId === 6) return Boolean(m.kb2SimSolved && m.kb2QuizDone);
  if (scrId === 7) return Boolean(m.kb3CodeTested);
  if (scrId === 8) return Boolean(m.kb4TreeTested);
  if (scrId === 9) return Boolean(m.evalDone);
  return false;
}

function renderSidebarNavMarkup() {
  const state = getState();
  const groups = ['Orientasi', 'Kegiatan Belajar', 'Penilaian'];

  return `
    <div class="px-4 py-5 flex flex-col h-full justify-between gap-6">
      <div class="space-y-6">
        <div class="flex items-center justify-between lg:hidden pb-3 border-b border-line">
          <span class="font-display font-bold text-sm text-ink">Daftar Isi Modul</span>
          <button type="button" data-close-sidebar class="p-2 rounded hover:bg-surface text-ink-muted cursor-pointer" aria-label="Tutup daftar isi">
            ${icon('close', 18)}
          </button>
        </div>

        <nav aria-label="Daftar Isi 9 Halaman" class="space-y-5">
          ${groups
            .map((grp) => {
              const items = SCREENS.filter((s) => s.group === grp);
              return `
                <div>
                  <p class="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted px-2.5 mb-1.5">${grp}</p>
                  <ul class="space-y-0.5">
                    ${items
                      .map((scr) => {
                        const active = state.currentScreen === scr.id;
                        const done = isScreenCompleted(scr.id, state);
                        const visited = state.visitedScreens.includes(scr.id);
                        return `
                          <li>
                            <button
                              type="button"
                              data-nav-screen="${scr.id}"
                              aria-current="${active ? 'page' : 'false'}"
                              class="w-full min-h-[40px] text-left px-2.5 py-1.5 rounded-md text-[13px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                active
                                  ? 'bg-surface text-ink font-semibold border border-line-strong shadow-2xs'
                                  : 'text-ink-muted hover:text-ink hover:bg-surface/60 border border-transparent'
                              }"
                            >
                              <span class="flex items-center gap-2.5 min-w-0">
                                <span class="font-mono text-[11px] tabular-nums ${active ? 'text-cobalt font-bold' : 'text-ink-muted/80'}">${scr.code}</span>
                                <span class="truncate">${scr.shortTitle}</span>
                              </span>
                              ${
                                done
                                  ? `<span class="text-emerald shrink-0" title="Tuntas">${icon('check', 14)}</span>`
                                  : visited && !active
                                  ? `<span class="w-1.5 h-1.5 rounded-full bg-line-strong/45 shrink-0" title="Sudah dibuka"></span>`
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

      <div class="pt-4 border-t border-line space-y-1.5">
        <button type="button" data-open-glossary class="w-full min-h-[40px] text-left px-2.5 py-1.5 rounded-md hover:bg-surface text-xs font-medium text-ink-muted hover:text-ink flex items-center justify-between cursor-pointer transition-colors">
          <span class="flex items-center gap-2">${icon('book', 15, 'text-cobalt')} Kamus Istilah</span>
          <span class="font-mono text-[11px] tabular-nums">18</span>
        </button>
        <button type="button" data-open-notes class="w-full min-h-[40px] text-left px-2.5 py-1.5 rounded-md hover:bg-surface text-xs font-medium text-ink-muted hover:text-ink flex items-center justify-between cursor-pointer transition-colors">
          <span class="flex items-center gap-2">${icon('notebook', 15, 'text-cobalt')} Buku Catatan</span>
          <span class="font-mono text-[11px] text-cobalt font-bold tabular-nums" data-notes-badge>${currentNotesCount}</span>
        </button>
        <p class="text-[11px] text-ink-muted/80 px-2.5 pt-2">
          ${MODULE_META.school}
        </p>
      </div>
    </div>
  `;
}

/**
 * Penanda Halaman (Folio Track) yang tenang di atas kanvas, bukan bar tombol kotak kedua.
 * Di layar HP (< lg) dapat digeser horizontal dengan mudah oleh jempol.
 */
function renderFolioStepperMarkup() {
  const state = getState();
  const activeScreenObj = SCREENS.find((s) => s.id === state.currentScreen) || SCREENS[0];

  return `
    <div class="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
      <div class="flex items-center justify-between gap-3 pb-3 border-b border-line/80">
        <span class="hidden sm:inline-block font-mono text-[11px] text-ink-muted tabular-nums">
          Halaman ${activeScreenObj.code} / 09 · <strong class="font-semibold text-ink">${escapeHtml(activeScreenObj.group)}</strong>
        </span>

        <nav aria-label="Pindah cepat halaman 1 sampai 9" class="stepper-scroll flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-0.5">
          ${SCREENS.map((scr) => {
            const active = state.currentScreen === scr.id;
            const done = isScreenCompleted(scr.id, state);
            return `
              <button
                type="button"
                data-step-screen="${scr.id}"
                aria-current="${active ? 'step' : 'false'}"
                title="${escapeHtml(scr.title)}"
                class="shrink-0 min-h-[34px] lg:min-h-[28px] px-2.5 lg:px-2 rounded text-xs font-mono tabular-nums inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-ink text-surface font-bold'
                    : done
                    ? 'text-emerald hover:bg-emerald-soft/70 font-semibold'
                    : 'text-ink-muted hover:text-ink hover:bg-line/40'
                }"
              >
                <span>${scr.id}</span>
                <span class="${active ? 'inline' : 'inline lg:hidden'} font-sans text-[11.5px]">${scr.shortTitle}</span>
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
    <!-- Header Atas Ringkas + Garis Progres Tipis di Tepi Atas -->
    <header class="sticky top-0 z-30 bg-canvas/95 backdrop-blur-xs border-b border-line">
      <div class="w-full h-[3px] bg-line/60 overflow-hidden" aria-hidden="true">
        <div id="header-progress-bar" class="h-full bg-cobalt transition-all duration-300" style="width: 0%"></div>
      </div>

      <div class="px-3 sm:px-5 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-2 min-w-0">
          <!-- Tombol Daftar Isi di HP -->
          <button
            type="button"
            id="mobile-menu-toggle"
            class="lg:hidden min-w-[40px] min-h-[40px] p-2 rounded-md border border-line hover:border-line-strong bg-surface text-ink flex items-center justify-center cursor-pointer"
            aria-label="Buka daftar isi"
            aria-expanded="false"
          >
            ${icon('menu', 18)}
          </button>

          <!-- Tombol Lipat/Buka Daftar Isi (Mode Fokus Baca) di Desktop -->
          <button
            type="button"
            id="desktop-focus-toggle"
            class="hidden lg:inline-flex p-2 rounded-md text-ink-muted hover:text-ink hover:bg-line/40 cursor-pointer"
            title="Sembunyikan atau tampilkan daftar isi samping (Mode Fokus)"
            aria-label="Mode Fokus Baca"
          >
            ${icon('menu', 17)}
          </button>

          <button type="button" id="brand-home-btn" class="flex items-center gap-2.5 text-left min-w-0 cursor-pointer">
            <img src="./icons/icon.svg" alt="" class="w-7 h-7 rounded shrink-0 border border-line-strong" />
            <span class="font-display font-extrabold text-sm sm:text-[15px] text-ink truncate">E-Modul KKA</span>
          </button>
        </div>

        <!-- Kanan: Progres Tabular + Status Koneksi + Kamus + Catatan + Profil -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono tabular-nums text-ink-muted" title="Progres penyelesaian modul">
            <span>Progres</span>
            <strong id="header-progress-text" class="text-cobalt font-bold">0%</strong>
          </div>

          <span
            id="header-network-badge"
            class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-medium text-ink-muted"
            title="Status koneksi perangkat"
          >
            <span class="w-2 h-2 rounded-full bg-emerald inline-block"></span>
            <span class="hidden sm:inline">Daring</span>
          </span>

          <button
            type="button"
            id="header-glossary-btn"
            class="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line hover:border-line-strong bg-surface text-xs font-semibold text-ink cursor-pointer"
            title="Buka Kamus Istilah Koding & AI"
          >
            ${icon('book', 15, 'text-cobalt')}
            <span class="hidden sm:inline">Kamus</span>
          </button>

          <button
            type="button"
            id="header-notes-btn"
            class="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line hover:border-line-strong bg-surface text-xs font-semibold text-ink cursor-pointer"
            title="Buka Buku Catatan Belajar"
          >
            ${icon('notebook', 15, 'text-cobalt')}
            <span class="hidden sm:inline">Catatan</span>
            <span data-notes-badge class="font-mono text-[10.5px] tabular-nums px-1.5 rounded bg-cobalt-soft text-cobalt font-bold">0</span>
          </button>

          <button
            type="button"
            id="header-profile-chip"
            class="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line-strong bg-surface hover:bg-canvas text-xs font-semibold text-ink cursor-pointer max-w-[132px] sm:max-w-[180px]"
            title="Identitas siswa"
          >
            ${icon('user', 14, 'text-cobalt')}
            <span id="header-profile-label" class="truncate">Profil</span>
          </button>
        </div>
      </div>

      <!-- Info Progres Ringkas di HP -->
      <div class="md:hidden px-3 py-1 bg-canvas border-t border-line/70 flex items-center justify-between text-[11px] font-mono tabular-nums text-ink-muted">
        <span>Kemajuan Belajar</span>
        <span id="mobile-progress-text" class="font-bold text-cobalt">0%</span>
      </div>
    </header>

    <!-- Layout Utama: Daftar Isi Buku Kerja (Kiri) + Kanvas Baca Fokus (Kanan) -->
    <div class="flex-1 flex min-w-0 relative">
      <aside id="desktop-sidebar" class="hidden lg:block w-60 shrink-0 bg-canvas border-r border-line sticky top-[3.6rem] h-[calc(100vh-3.6rem)] overflow-y-auto">
      </aside>

      <div id="mobile-sidebar-overlay" class="fixed inset-0 z-40 bg-ink/45 hidden lg:hidden">
        <aside id="mobile-sidebar-panel" class="w-72 max-w-[85vw] h-full bg-canvas border-r-2 border-line-strong overflow-y-auto shadow-xl"></aside>
      </div>

      <div class="flex-1 min-w-0 flex flex-col">
        <div id="stepper-mount"></div>
        <main id="screen-mount" class="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        </main>
      </div>
    </div>
  `;

  document.getElementById('brand-home-btn')?.addEventListener('click', () => navigate(1));
  document.getElementById('header-glossary-btn')?.addEventListener('click', () => openGlossaryModal());
  document.getElementById('header-notes-btn')?.addEventListener('click', () => openNotesDrawer());
  document.getElementById('header-profile-chip')?.addEventListener('click', () => navigate(1));

  document.getElementById('desktop-focus-toggle')?.addEventListener('click', () => {
    desktopFocusMode = !desktopFocusMode;
    syncSidebarVisibility();
  });

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    mobileSidebarOpen = !mobileSidebarOpen;
    syncSidebarVisibility();
  });

  document.getElementById('mobile-sidebar-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'mobile-sidebar-overlay') {
      mobileSidebarOpen = false;
      syncSidebarVisibility();
    }
  });
}

function syncSidebarVisibility() {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const deskSidebar = document.getElementById('desktop-sidebar');

  if (overlay) {
    if (mobileSidebarOpen) {
      overlay.classList.remove('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      overlay.classList.add('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
  }

  if (deskSidebar) {
    if (desktopFocusMode) {
      deskSidebar.classList.remove('lg:block');
    } else {
      deskSidebar.classList.add('lg:block');
    }
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
      syncSidebarVisibility();
    });
  });
  root.querySelectorAll('[data-open-glossary]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileSidebarOpen = false;
      syncSidebarVisibility();
      openGlossaryModal();
    });
  });
  root.querySelectorAll('[data-open-notes]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobileSidebarOpen = false;
      syncSidebarVisibility();
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
  if (hPct) hPct.textContent = `${progress.percent}%`;
  if (hBar) hBar.style.width = `${progress.percent}%`;
  if (mPct) mPct.textContent = `${progress.percent}%`;

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
        'inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-semibold text-ink';
      netBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald inline-block"></span><span class="hidden sm:inline">Daring</span>`;
    } else {
      netBadge.className =
        'inline-flex items-center gap-1.5 px-2 py-1 rounded border border-amber bg-amber-soft text-[11px] font-mono font-semibold text-ink';
      netBadge.innerHTML = `${icon('wifiOff', 12, 'text-ink')}<span class="hidden sm:inline">Luring</span>`;
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
  syncSidebarVisibility();

  const stepperMount = document.getElementById('stepper-mount');
  if (stepperMount) {
    stepperMount.innerHTML = renderFolioStepperMarkup();
    stepperMount.querySelectorAll('[data-step-screen]').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigate(Number(btn.getAttribute('data-step-screen')));
      });
    });
    const navRail = stepperMount.querySelector('nav');
    const activeBtn = stepperMount.querySelector('[aria-current="step"]');
    if (navRail && activeBtn) {
      const targetLeft = activeBtn.offsetLeft - navRail.clientWidth / 2 + activeBtn.clientWidth / 2;
      navRail.scrollLeft = Math.max(0, targetLeft);
    }
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
    openGlossary: (term = '', mode = 'list') => openGlossaryModal(term, mode),
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
