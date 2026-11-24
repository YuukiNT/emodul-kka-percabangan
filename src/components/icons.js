/**
 * icons.js — Pustaka ikon SVG inline garis tajam (stroke-width: 1.85, round cap/join)
 * dan ilustrasi maskot SVG vektor ringan custom. Bebas 100% dari emoji sistem OS.
 */

const ICON_PATHS = {
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>',
  notebook: '<path d="M4 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z"/><path d="M8 2v20"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>',
  wifiOff: '<line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 12.85a10 10 0 0 1 5.17-2.39"/><path d="M19 12.85a10 10 0 0 0-2.01-1.38"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><polyline points="8.5 12.5 11 15 15.5 9.5"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  arrowUp: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/>',
  arrowDown: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="18 13 12 19 6 13"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4"/>',
  diamond: '<polygon points="12 2 22 12 12 22 2 12 12 2"/>',
  blocks: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="8" y="13" width="8" height="8" rx="1.5"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>',
  tree: '<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M12 7.5V12M12 12H6v3.5M12 12h6v3.5"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14.5 7 22l5-2.5L17 22l-1.5-7.5"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  shareIos: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="16 8 14 14 8 16 10 10 16 8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  grip: '<circle cx="9" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
};

export function icon(name, size = 18, extraClass = '') {
  const path = ICON_PATHS[name] || ICON_PATHS.info;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="inline-block shrink-0 ${extraClass}" aria-hidden="true">${path}</svg>`;
}

/**
 * Maskot Vektor SVG kustom "Kaka" (teman belajar bergaya Editorial Blueprint Workbook)
 * Ringan (<2.5 KB), 100% vektor inline, bebas emoji & gambar raster berat.
 */
export function mascotIllustration() {
  return `
  <svg viewBox="0 0 320 270" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-[300px] h-auto select-none" role="img" aria-label="Ilustrasi maskot Kaka, pemandu belajar percabangan KKA">
    <!-- Lembar cetak biru tipis di latar -->
    <rect x="18" y="18" width="284" height="234" rx="14" fill="var(--color-surface)" stroke="var(--color-line-strong)" stroke-width="2"/>
    <path d="M36 46V34H48M272 34H284V46M284 224V236H272M48 236H36V224" stroke="var(--color-line)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Label sudut ringkas -->
    <text x="54" y="45" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="600" fill="var(--color-ink-muted)">MODUL KKA IX</text>

    <!-- Garis alur latar -->
    <path d="M72 152H48V198H86" stroke="var(--color-emerald)" stroke-width="2.2" stroke-dasharray="4 4" stroke-linecap="round"/>
    <path d="M248 152H272V198H234" stroke="var(--color-coral)" stroke-width="2.2" stroke-dasharray="4 4" stroke-linecap="round"/>

    <!-- Antena belah ketupat di atas kepala maskot -->
    <line x1="160" y1="68" x2="160" y2="88" stroke="var(--color-ink)" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="160,50 173,63 160,76 147,63" fill="var(--color-amber-soft)" stroke="var(--color-ink)" stroke-width="2.2" stroke-linejoin="round"/>

    <!-- Kepala Maskot Kaka (Buku Kerja Robotik) -->
    <rect x="96" y="88" width="128" height="84" rx="16" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2.5"/>
    <!-- Layar wajah -->
    <rect x="110" y="102" width="100" height="56" rx="10" fill="var(--color-ink)"/>
    <!-- Mata ekspresif vektor -->
    <circle cx="139" cy="126" r="6.5" fill="var(--color-emerald)"/>
    <circle cx="181" cy="126" r="6.5" fill="var(--color-emerald)"/>
    <!-- Senyum kecil bergaya kode -->
    <path d="M148 142C152 147 168 147 172 142" stroke="var(--color-surface)" stroke-width="2.4" stroke-linecap="round"/>
    <!-- Telinga konektor samping -->
    <rect x="84" y="116" width="12" height="28" rx="4" fill="var(--color-cobalt-soft)" stroke="var(--color-ink)" stroke-width="2"/>
    <rect x="224" y="116" width="12" height="28" rx="4" fill="var(--color-cobalt-soft)" stroke="var(--color-ink)" stroke-width="2"/>

    <!-- Leher & Badan -->
    <rect x="148" y="172" width="24" height="10" fill="var(--color-line)" stroke="var(--color-ink)" stroke-width="2"/>
    <rect x="108" y="182" width="104" height="54" rx="12" fill="var(--color-cobalt-soft)" stroke="var(--color-ink)" stroke-width="2.5"/>

    <!-- Lencana Belah Ketupat IF pada dada -->
    <polygon points="160,192 184,209 160,226 136,209" fill="var(--color-surface)" stroke="var(--color-cobalt)" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="160" y="213" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="700" fill="var(--color-cobalt)">IF</text>

    <!-- Lencana jalur kiri True (Emerald) & kanan False (Coral) -->
    <rect x="44" y="188" width="46" height="20" rx="4" fill="var(--color-emerald-soft)" stroke="var(--color-emerald)" stroke-width="1.6"/>
    <text x="67" y="202" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="var(--color-ink)">TRUE</text>

    <rect x="230" y="188" width="46" height="20" rx="4" fill="var(--color-coral-soft)" stroke="var(--color-coral)" stroke-width="1.6"/>
    <text x="253" y="202" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="var(--color-ink)">FALSE</text>
  </svg>`;
}
