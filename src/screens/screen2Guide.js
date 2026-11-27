/**
 * screen2Guide.js - Layar 2: Petunjuk Penggunaan & Mode Luring (PWA)
 * Narasi terbuka untuk cara pemakaian + 1 Panggung Interaktif untuk instalasi & cek cache PWA.
 */

import { getPwaState, refreshCacheStatus, triggerInstallPrompt } from '../pwa/pwaManager.js';
import { icon } from '../components/icons.js';

let activeDeviceTab = 'android';

const DEVICE_TABS = [
  {
    id: 'android',
    label: 'Android (Chrome)',
    icon: 'smartphone',
    steps: [
      'Buka e-modul ini melalui browser Google Chrome di HP Android.',
      'Ketuk tombol "Pasang Aplikasi (Install PWA)" di atas, atau ketuk ikon titik tiga di pojok kanan atas Chrome.',
      'Pilih menu "Tambahkan ke Layar Utama" (Add to Home Screen) atau "Instal Aplikasi".',
      'Konfirmasi dengan menekan "Instal". Ikon E-Modul KKA akan muncul di layar utama HP dan siap dibuka tanpa internet.',
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop (Chrome / Edge)',
    icon: 'monitor',
    steps: [
      'Buka e-modul pada komputer lab sekolah melalui Google Chrome atau Microsoft Edge.',
      'Klik tombol "Pasang Aplikasi (Install PWA)" di atas, atau klik ikon instalasi di ujung kanan kotak alamat browser.',
      'Klik "Install" pada jendela konfirmasi yang muncul.',
      'E-Modul akan terbuka pada jendela tersendiri tanpa gangguan banyak tab.',
    ],
  },
  {
    id: 'ios',
    label: 'iOS (Safari)',
    icon: 'shareIos',
    steps: [
      'Buka e-modul melalui browser bawaan Safari di iPhone atau iPad.',
      'Ketuk tombol Bagikan (Share, ikon kotak dengan panah ke atas) di bagian bawah Safari.',
      'Geser menu ke bawah lalu pilih "Tambahkan ke Layar Utama" (Add to Home Screen).',
      'Ketuk "Tambah" (Add). Aplikasi kini siap dipakai secara luring dari layar utama.',
    ],
  },
];

export function renderScreen2Guide(container, { navigate, openGlossary, openNotes, showToast }) {
  const pwa = getPwaState();

  function renderDeviceTabContent() {
    const tab = DEVICE_TABS.find((t) => t.id === activeDeviceTab) || DEVICE_TABS[0];
    const bodyEl = container.querySelector('#device-steps-body');
    if (!bodyEl) return;

    container.querySelectorAll('[data-device-tab]').forEach((btn) => {
      const active = btn.getAttribute('data-device-tab') === activeDeviceTab;
      btn.setAttribute('aria-selected', String(active));
      btn.className = `flex-1 min-w-[140px] min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-colors ${
        active
          ? 'border-cobalt text-cobalt bg-surface'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`;
    });

    bodyEl.innerHTML = `
      <ol class="space-y-3 text-sm text-ink max-w-2xl quiz-step-enter">
        ${tab.steps
          .map(
            (step, idx) => `
            <li class="flex items-start gap-3">
              <span class="font-mono tabular-nums text-xs font-bold w-6 h-6 rounded bg-cobalt-soft text-cobalt border border-cobalt/50 flex items-center justify-center shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <span class="leading-relaxed">${step}</span>
            </li>
          `
          )
          .join('')}
      </ol>
    `;
  }

  container.innerHTML = `
    <section class="screen-enter space-y-11 pb-12">
      <!-- Pembuka Bab (1 Kicker Saja) -->
      <header class="pb-6 border-b border-line space-y-2">
        <p class="editorial-index">Orientasi Belajar · Halaman 02</p>
        <div class="flex items-baseline gap-3.5">
          <span class="chapter-numeral text-4xl sm:text-5xl">02</span>
          <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Cara Menggunakan Modul &amp; Belajar Tanpa Kuota
          </h1>
        </div>
      </header>

      <!-- Bagian 1: Fitur Utama (Terbuka di Atas Kanvas, Tanpa Kotak-Kotak) -->
      <section class="space-y-5">
        <h2 class="font-display font-bold text-xl text-ink">
          Empat Alat Bantu Selama Kamu Belajar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 pt-1">
          <div class="flex items-start gap-3.5">
            <span class="w-9 h-9 rounded-md bg-surface border border-line flex items-center justify-center text-cobalt shrink-0 mt-0.5">
              ${icon('layers', 18)}
            </span>
            <div class="space-y-1">
              <h3 class="font-display font-bold text-base text-ink">Daftar Isi &amp; Mode Fokus</h3>
              <p class="text-sm text-ink-muted leading-relaxed">
                Pindah halaman lewat daftar isi di kiri (atau tombol garis tiga di HP). Di komputer, klik ikon garis tiga di kiri atas untuk menyembunyikan menu saat ingin fokus membaca.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3.5">
            <span class="w-9 h-9 rounded-md bg-surface border border-line flex items-center justify-center text-emerald shrink-0 mt-0.5">
              ${icon('target', 18)}
            </span>
            <div class="space-y-1">
              <h3 class="font-display font-bold text-base text-ink">Garis Kemajuan Otomatis</h3>
              <p class="text-sm text-ink-muted leading-relaxed">
                Garis biru di tepi paling atas layar bertambah otomatis setiap kali kamu mencoba simulasi dan menyelesaikan kuis bertahap.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3.5">
            <span class="w-9 h-9 rounded-md bg-surface border border-line flex items-center justify-center text-cobalt shrink-0 mt-0.5">
              ${icon('book', 18)}
            </span>
            <div class="space-y-1">
              <div class="flex items-center gap-2.5">
                <h3 class="font-display font-bold text-base text-ink">Kamus 18 Istilah</h3>
                <button type="button" id="guide-open-glossary" class="text-xs font-semibold text-cobalt hover:underline cursor-pointer">Buka Kamus →</button>
              </div>
              <p class="text-sm text-ink-muted leading-relaxed">
                Lupa arti kata <em>Boolean</em>, <em>Indentasi</em>, atau <em>Elif</em>? Ketuk kata bergaris titik-titik di dalam teks atau tombol Kamus di atas.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3.5">
            <span class="w-9 h-9 rounded-md bg-surface border border-line flex items-center justify-center text-ink shrink-0 mt-0.5">
              ${icon('notebook', 18)}
            </span>
            <div class="space-y-1">
              <div class="flex items-center gap-2.5">
                <h3 class="font-display font-bold text-base text-ink">Buku Catatan Pribadi</h3>
                <button type="button" id="guide-open-notes" class="text-xs font-semibold text-cobalt hover:underline cursor-pointer">Buka Catatan →</button>
              </div>
              <p class="text-sm text-ink-muted leading-relaxed">
                Tulis rangkuman versimu sendiri per bab. Catatan disimpan permanen di perangkat sehingga tetap aman walau tanpa internet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bagian 2: Panggung Interaktif Pasang Aplikasi PWA + Panduan Perangkat Terpadu -->
      <section class="wb-stage overflow-hidden">
        <div class="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-line">
          <div class="lg:col-span-7 space-y-2.5">
            <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
              Pasang ke Layar Utama untuk Belajar Luring
            </h2>
            <p class="text-sm text-ink-muted leading-relaxed">
              Setelah dibuka sekali, seluruh materi, gambar diagram, dan kuis tersimpan di memori perangkat. Kamu tetap bisa belajar penuh di rumah walau paket data dimatikan.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" id="pwa-install-btn" class="wb-btn-primary">
                ${icon('download', 17)}
                <span>${pwa.isInstalled ? 'Aplikasi Sudah Terpasang' : 'Pasang Aplikasi (Install PWA)'}</span>
              </button>
              <button type="button" id="pwa-refresh-cache-btn" class="wb-btn-secondary">
                ${icon('refresh', 15)}
                <span>Periksa Penyimpanan Luring</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 bg-canvas border border-line rounded-md p-4 space-y-2">
            <p class="font-mono text-xs font-semibold text-ink flex items-center gap-1.5">
              ${icon('shieldCheck', 16, 'text-cobalt')}
              <span>Kesiapan Perangkat</span>
            </p>
            <dl class="text-xs space-y-2 pt-1.5 border-t border-line tabular-nums">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Koneksi</dt>
                <dd class="font-mono font-semibold ${pwa.online ? 'text-emerald' : 'text-amber'}">
                  ${pwa.online ? 'Daring (Online)' : 'Luring (Offline)'}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Layanan Luring</dt>
                <dd id="guide-sw-status" class="font-mono font-semibold ${pwa.swRegistered ? 'text-emerald' : 'text-ink-muted'}">
                  ${pwa.swRegistered ? 'Terdaftar & Aktif' : pwa.swSupported ? 'Menyiapkan...' : 'Tidak Didukung'}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Berkas Tersimpan</dt>
                <dd id="guide-cache-status" class="font-mono font-semibold ${pwa.cacheReady ? 'text-emerald' : 'text-ink-muted'}">
                  ${pwa.cacheReady ? `Siap (${pwa.cachedCount} berkas)` : 'Menyimpan berkas...'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Tab Panduan Perangkat (Update In-Place Tanpa Kedip) -->
        <div class="flex flex-wrap border-b border-line bg-canvas" role="tablist" aria-label="Pilih jenis perangkat">
          ${DEVICE_TABS.map(
            (tab) => `
              <button
                type="button"
                role="tab"
                data-device-tab="${tab.id}"
              >
                ${icon(tab.icon, 16)}
                <span>${tab.label}</span>
              </button>
            `
          ).join('')}
        </div>

        <div id="device-steps-body" class="p-5 sm:p-6 bg-surface"></div>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s2-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Beranda</span>
        </button>
        <button type="button" id="s2-next" class="wb-btn-primary">
          <span>Capaian &amp; Tujuan</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  renderDeviceTabContent();

  document.getElementById('guide-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('guide-open-notes')?.addEventListener('click', () => openNotes());

  container.querySelectorAll('[data-device-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDeviceTab = btn.getAttribute('data-device-tab') || 'android';
      renderDeviceTabContent();
    });
  });

  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    const res = await triggerInstallPrompt();
    if (res.status === 'accepted') {
      showToast('E-Modul berhasil dipasang ke perangkatmu.');
    } else if (res.status === 'already-installed') {
      showToast('E-Modul sudah berjalan dalam mode aplikasi terpasang.');
    } else if (res.status === 'ios-manual') {
      activeDeviceTab = 'ios';
      renderDeviceTabContent();
      showToast('Di iOS Safari, ikuti langkah "Add to Home Screen" pada tab iOS di bawah.');
    } else if (res.status === 'dismissed') {
      showToast('Pemasangan dibatalkan. Kamu bisa mencobanya lagi nanti.');
    } else {
      showToast('Gunakan menu browser sesuai langkah perangkat di bawah.');
    }
  });

  document.getElementById('pwa-refresh-cache-btn')?.addEventListener('click', async () => {
    await refreshCacheStatus();
    const updated = getPwaState();
    const swEl = document.getElementById('guide-sw-status');
    const cacheEl = document.getElementById('guide-cache-status');
    if (swEl) swEl.textContent = updated.swRegistered ? 'Terdaftar & Aktif' : 'Menyiapkan...';
    if (cacheEl) cacheEl.textContent = updated.cacheReady ? `Siap (${updated.cachedCount} berkas)` : 'Menyimpan berkas...';
    showToast('Status penyimpanan luring diperbarui.');
  });

  document.getElementById('s2-prev')?.addEventListener('click', () => navigate(1));
  document.getElementById('s2-next')?.addEventListener('click', () => navigate(3));
}
