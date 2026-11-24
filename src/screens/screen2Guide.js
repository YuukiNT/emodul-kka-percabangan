/**
 * screen2Guide.js - Layar 2: Petunjuk Penggunaan & Mode Luring (PWA)
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
      'Ketuk tombol "Pasang Aplikasi (Install PWA)" di bawah, atau ketuk ikon titik tiga di pojok kanan atas Chrome.',
      'Pilih menu "Tambahkan ke Layar Utama" (Add to Home Screen) atau "Instal Aplikasi".',
      'Konfirmasi dengan menekan "Instal". Ikon E-Modul KKA akan muncul di layar utama HP dan bisa dibuka kapan saja tanpa internet.',
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop (Chrome / Edge)',
    icon: 'monitor',
    steps: [
      'Buka e-modul pada komputer lab sekolah melalui Google Chrome atau Microsoft Edge.',
      'Klik tombol "Pasang Aplikasi (Install PWA)" di bawah, atau klik ikon instalasi di ujung kanan kotak alamat browser.',
      'Klik "Install" pada jendela konfirmasi yang muncul.',
      'E-Modul akan terbuka pada jendela tersendiri agar belajar di lab lebih rapi dan fokus.',
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
      'Pastikan nama tertulis "E-Modul KKA", lalu ketuk "Tambah" (Add). Aplikasi kini siap dipakai secara luring dari layar utama.',
    ],
  },
];

export function renderScreen2Guide(container, { navigate, openGlossary, openNotes, showToast }) {
  const pwa = getPwaState();
  const currentTab = DEVICE_TABS.find((t) => t.id === activeDeviceTab) || DEVICE_TABS[0];

  container.innerHTML = `
    <section class="screen-enter space-y-9 pb-10">
      <header class="pb-6 border-b-2 border-line-strong flex flex-wrap items-end justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <span class="chapter-numeral text-5xl sm:text-6xl">02</span>
          <div class="border-l-2 border-line-strong pl-3.5">
            <p class="editorial-index">Orientasi · Panduan Penggunaan</p>
            <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
              Petunjuk Penggunaan &amp; Mode Luring
            </h1>
          </div>
        </div>
      </header>

      <section class="space-y-4">
        <div>
          <p class="editorial-index">Bagian A · Cara Navigasi</p>
          <h2 class="font-display font-bold text-xl text-ink mt-0.5">Empat Fitur Utama dalam E-Modul</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="wb-sheet p-4 space-y-1.5">
            <div class="flex items-center gap-2 text-cobalt font-display font-bold text-base">
              ${icon('layers', 18)}
              <span>1. Stepper 9 Layar &amp; Menu Samping</span>
            </div>
            <p class="text-sm text-ink-muted leading-relaxed">
              Gunakan deretan angka 1 sampai 9 di bagian atas atau daftar menu di sisi kiri (tombol garis tiga di HP) untuk berpindah antar halaman kapan saja.
            </p>
          </div>

          <div class="wb-sheet p-4 space-y-1.5">
            <div class="flex items-center gap-2 text-emerald font-display font-bold text-base">
              ${icon('target', 18)}
              <span>2. Progres Belajar Otomatis</span>
            </div>
            <p class="text-sm text-ink-muted leading-relaxed">
              Setiap kali kamu mencoba simulasi dan menyelesaikan kuis, persentase progres di bagian atas otomatis bertambah dan tersimpan di perangkat.
            </p>
          </div>

          <div class="wb-sheet p-4 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-cobalt font-display font-bold text-base">
                ${icon('book', 18)}
                <span>3. Kamus Istilah</span>
              </div>
              <button type="button" id="guide-open-glossary" class="text-xs font-semibold text-cobalt hover:underline cursor-pointer">Coba Buka</button>
            </div>
            <p class="text-sm text-ink-muted leading-relaxed">
              Menemukan istilah baru seperti <em>Boolean</em>, <em>Indentasi</em>, atau <em>Elif</em>? Klik tombol <strong>Kamus</strong> di atas untuk melihat artinya dengan cepat.
            </p>
          </div>

          <div class="wb-sheet p-4 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-amber font-display font-bold text-base">
                ${icon('notebook', 18)}
                <span class="text-ink">4. Buku Catatan Belajar</span>
              </div>
              <button type="button" id="guide-open-notes" class="text-xs font-semibold text-cobalt hover:underline cursor-pointer">Coba Buka</button>
            </div>
            <p class="text-sm text-ink-muted leading-relaxed">
              Catat rangkuman pribadi per bab langsung di dalam e-modul. Catatan tetap tersimpan di perangkat walau halaman ditutup atau tidak ada internet.
            </p>
          </div>
        </div>
      </section>

      <!-- Area Pasang PWA & Status Cache Luring -->
      <section class="wb-sheet-framed p-5 sm:p-6 space-y-5">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-7 space-y-2">
            <p class="editorial-index">Bagian B · Mode Luring (PWA)</p>
            <h2 class="font-display font-bold text-xl sm:text-2xl text-ink">
              Pasang ke Perangkat untuk Belajar Tanpa Kuota
            </h2>
            <p class="text-sm text-ink-muted leading-relaxed">
              Setelah e-modul dibuka satu kali, berkas halaman, simulasi, dan kuis tersimpan otomatis di memori perangkat. Kamu bisa mematikan Wi-Fi atau data seluler di rumah dan tetap belajar dengan lancar.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" id="pwa-install-btn" class="wb-btn-primary">
                ${icon('download', 17)}
                <span>${pwa.isInstalled ? 'Aplikasi Sudah Terpasang' : 'Pasang Aplikasi (Install PWA)'}</span>
              </button>
              <button type="button" id="pwa-refresh-cache-btn" class="wb-btn-secondary">
                ${icon('refresh', 15)}
                <span>Cek Ulang Status Luring</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 bg-canvas border border-line-strong rounded-md p-4 space-y-2.5">
            <p class="font-mono text-xs font-semibold uppercase tracking-wide text-ink flex items-center gap-1.5">
              ${icon('shieldCheck', 16, 'text-cobalt')}
              <span>Status Kesiapan Mode Luring</span>
            </p>

            <dl class="text-xs space-y-2 pt-1 border-t border-line">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Koneksi Saat Ini</dt>
                <dd class="font-mono font-semibold ${pwa.online ? 'text-emerald' : 'text-amber'}">
                  ${pwa.online ? 'Daring (Online)' : 'Luring (Offline)'}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Layanan Luring</dt>
                <dd id="guide-sw-status" class="font-mono font-semibold ${pwa.swRegistered ? 'text-emerald' : 'text-ink-muted'}">
                  ${pwa.swRegistered ? 'Terdaftar &amp; Aktif' : pwa.swSupported ? 'Menyiapkan...' : 'Tidak Didukung'}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Penyimpanan Aset</dt>
                <dd id="guide-cache-status" class="font-mono font-semibold ${pwa.cacheReady ? 'text-emerald' : 'text-ink-muted'}">
                  ${pwa.cacheReady ? `Siap (${pwa.cachedCount} berkas tersimpan)` : 'Menyiapkan berkas...'}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-ink-muted">Mode Tampilan</dt>
                <dd class="font-mono font-semibold text-ink">
                  ${pwa.isInstalled ? 'Aplikasi Terpasang' : 'Browser Web'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- Tab Panduan Instalasi Lintas Perangkat -->
      <section class="space-y-4">
        <div>
          <p class="editorial-index">Bagian C · Panduan per Perangkat</p>
          <h2 class="font-display font-bold text-xl text-ink mt-0.5">Langkah Pemasangan Manual</h2>
        </div>

        <div class="wb-sheet overflow-hidden">
          <div class="flex flex-wrap border-b border-line bg-canvas" role="tablist" aria-label="Pilih jenis perangkat">
            ${DEVICE_TABS.map((tab) => {
              const active = tab.id === activeDeviceTab;
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${active}"
                  data-device-tab="${tab.id}"
                  class="flex-1 min-w-[140px] px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-colors ${
                    active
                      ? 'border-cobalt text-cobalt bg-surface'
                      : 'border-transparent text-ink-muted hover:text-ink'
                  }"
                >
                  ${icon(tab.icon, 16)}
                  <span>${tab.label}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div class="p-5 sm:p-6">
            <ol class="space-y-3 text-sm text-ink max-w-2xl">
              ${currentTab.steps
                .map(
                  (step, idx) => `
                  <li class="flex items-start gap-3">
                    <span class="font-mono text-xs font-bold w-6 h-6 rounded-md bg-cobalt-soft text-cobalt border border-cobalt flex items-center justify-center shrink-0 mt-0.5">
                      ${idx + 1}
                    </span>
                    <span class="leading-relaxed">${step}</span>
                  </li>
                `
                )
                .join('')}
            </ol>
          </div>
        </div>
      </section>

      <nav class="pt-6 border-t border-line flex items-center justify-between gap-3">
        <button type="button" id="s2-prev" class="wb-btn-secondary">
          ${icon('arrowLeft', 16)}
          <span>Kembali: Beranda</span>
        </button>
        <button type="button" id="s2-next" class="wb-btn-primary">
          <span>Lanjut: Capaian &amp; Tujuan</span>
          ${icon('arrowRight', 16)}
        </button>
      </nav>
    </section>
  `;

  document.getElementById('guide-open-glossary')?.addEventListener('click', () => openGlossary());
  document.getElementById('guide-open-notes')?.addEventListener('click', () => openNotes());

  container.querySelectorAll('[data-device-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDeviceTab = btn.getAttribute('data-device-tab') || 'android';
      renderScreen2Guide(container, { navigate, openGlossary, openNotes, showToast });
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
      renderScreen2Guide(container, { navigate, openGlossary, openNotes, showToast });
      showToast('Di iOS Safari, ikuti langkah "Add to Home Screen" pada tab iOS di bawah.');
    } else if (res.status === 'dismissed') {
      showToast('Pemasangan dibatalkan. Kamu bisa mencobanya lagi nanti.');
    } else {
      showToast('Gunakan menu browser (Install / Add to Home Screen) sesuai panduan perangkat di bawah.');
    }
  });

  document.getElementById('pwa-refresh-cache-btn')?.addEventListener('click', async () => {
    await refreshCacheStatus();
    renderScreen2Guide(container, { navigate, openGlossary, openNotes, showToast });
    showToast('Status penyimpanan luring diperbarui.');
  });

  document.getElementById('s2-prev')?.addEventListener('click', () => navigate(1));
  document.getElementById('s2-next')?.addEventListener('click', () => navigate(3));
}
