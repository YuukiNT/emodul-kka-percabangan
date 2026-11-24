/**
 * pwaManager.js — Pengelola Service Worker, instalasi PWA (beforeinstallprompt),
 * deteksi mode luring/daring, dan status kesiapan Cache Mode Luring.
 */

const listeners = new Set();

let deferredInstallPrompt = null;

const pwaState = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  swSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
  swRegistered: false,
  swScope: '',
  cacheReady: false,
  cachedCount: 0,
  cacheName: '',
  canInstall: false,
  isInstalled: false,
  isIos: false,
};

function notify() {
  listeners.forEach((fn) => {
    try {
      fn({ ...pwaState });
    } catch {
      // Abaikan error listener individual
    }
  });
}

export function subscribePwa(fn) {
  listeners.add(fn);
  fn({ ...pwaState });
  return () => listeners.delete(fn);
}

export function getPwaState() {
  return { ...pwaState };
}

function detectEnvironment() {
  if (typeof window === 'undefined') return;
  const ua = window.navigator.userAgent || '';
  pwaState.isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const standaloneMedia = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = window.navigator.standalone === true;
  pwaState.isInstalled = Boolean(standaloneMedia || iosStandalone);
}

export async function refreshCacheStatus() {
  if (!('caches' in window)) return;
  try {
    const cacheNames = await window.caches.keys();
    const emodulCaches = cacheNames.filter((name) => name.startsWith('emodul-kka'));
    if (emodulCaches.length > 0) {
      const activeName = emodulCaches[emodulCaches.length - 1];
      const cache = await window.caches.open(activeName);
      const keys = await cache.keys();
      pwaState.cacheName = activeName;
      pwaState.cachedCount = keys.length;
      pwaState.cacheReady = keys.length > 0;
      notify();
      return;
    }

    // Fallback: tanyakan langsung ke Service Worker aktif bila tersedia
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.active) {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data) {
          pwaState.cacheName = event.data.cacheName || '';
          pwaState.cachedCount = event.data.cachedCount || 0;
          pwaState.cacheReady = Boolean(event.data.ready);
          notify();
        }
      };
      reg.active.postMessage({ type: 'GET_CACHE_STATUS' }, [channel.port2]);
    }
  } catch {
    // Abaikan jika browser membatasi Cache Storage
  }
}

export async function initPwa() {
  detectEnvironment();

  window.addEventListener('online', () => {
    pwaState.online = true;
    notify();
  });

  window.addEventListener('offline', () => {
    pwaState.online = false;
    notify();
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    pwaState.canInstall = true;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    pwaState.canInstall = false;
    pwaState.isInstalled = true;
    notify();
  });

  if (pwaState.swSupported) {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {
        scope: './',
      });
      pwaState.swRegistered = true;
      pwaState.swScope = registration.scope;
      notify();

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (installing) {
          installing.addEventListener('statechange', () => {
            if (installing.state === 'activated') {
              refreshCacheStatus();
            }
          });
        }
      });

      await navigator.serviceWorker.ready;
      await refreshCacheStatus();
      // Cek ulang singkat setelah precache install selesai
      setTimeout(refreshCacheStatus, 1200);
    } catch {
      pwaState.swRegistered = false;
      notify();
    }
  } else {
    notify();
  }
}

export async function triggerInstallPrompt() {
  if (pwaState.isInstalled) {
    return { status: 'already-installed' };
  }
  if (!deferredInstallPrompt) {
    return { status: pwaState.isIos ? 'ios-manual' : 'manual-guide' };
  }
  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredInstallPrompt = null;
      pwaState.canInstall = false;
      pwaState.isInstalled = true;
      notify();
      return { status: 'accepted' };
    }
    return { status: 'dismissed' };
  } catch {
    return { status: 'manual-guide' };
  }
}
