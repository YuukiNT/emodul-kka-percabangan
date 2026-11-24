/**
 * Service Worker — E-Modul Interaktif Percabangan KKA (SMPN 9 Samarinda)
 * Strategi: Cache-First untuk seluruh aset statis agar e-modul berjalan penuh saat luring.
 */

const BUILD_CACHE_NAME = '__CACHE_NAME__';
const CACHE_NAME = BUILD_CACHE_NAME.includes('CACHE_NAME') ? 'emodul-kka-dev-v050' : BUILD_CACHE_NAME;

const INJECTED_PRECACHE = /*__PRECACHE_URLS__*/[];

const DEFAULT_PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './fonts/bricolage-grotesque-700.woff2',
  './fonts/bricolage-grotesque-800.woff2',
  './fonts/plus-jakarta-sans-400.woff2',
  './fonts/plus-jakarta-sans-500.woff2',
  './fonts/plus-jakarta-sans-600.woff2',
  './fonts/plus-jakarta-sans-700.woff2',
  './fonts/jetbrains-mono-400.woff2',
  './fonts/jetbrains-mono-600.woff2',
];

const PRECACHE_URLS = INJECTED_PRECACHE.length > 0 ? INJECTED_PRECACHE : DEFAULT_PRECACHE;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Simpan tiap aset secara toleran agar kegagalan 1 aset dev tidak menggagalkan instalasi SW
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Abaikan HMR / endpoint dev Vite tertentu
  if (url.pathname.includes('/@vite/') || url.pathname.includes('/__vite_ping')) {
    return;
  }

  // Strategi Cache-First untuk seluruh aset statis & navigasi App Shell
  // ignoreVary: true penting agar script/CSS/font crossorigin Vite cocok sempurna saat luring
  event.respondWith(
    caches
      .match(request, { ignoreSearch: true, ignoreVary: true })
      .then((cached) => cached || caches.match(request.url, { ignoreSearch: true, ignoreVary: true }))
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone).catch(() => null);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // Fallback navigasi ke index.html saat luring
            if (request.mode === 'navigate') {
              const fallback =
                (await caches.match('./index.html', { ignoreVary: true })) ||
                (await caches.match('./', { ignoreVary: true }));
              if (fallback) return fallback;
            }
            return new Response('Aset belum tersedia di cache luring.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_CACHE_STATUS' && event.ports && event.ports[0]) {
    caches.open(CACHE_NAME).then(async (cache) => {
      const keys = await cache.keys();
      event.ports[0].postMessage({
        cacheName: CACHE_NAME,
        cachedCount: keys.length,
        ready: keys.length > 0,
      });
    });
  }
});
