/**
 * screen1Home.js - Layar 1: Beranda dan Pengisian Profil Peserta Didik
 */

import { KB_SUMMARY_CARDS, MODULE_META } from '../data/curriculum.js';
import { getState, saveProfile } from '../storage/localStore.js';
import { icon, mascotIllustration } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function renderScreen1Home(container, { navigate, showToast }) {
  const { profile } = getState();

  container.innerHTML = `
    <section class="screen-enter space-y-10 pb-10">
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b-2 border-line-strong">
        <div class="lg:col-span-7 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="chapter-numeral text-5xl sm:text-6xl">01</span>
            <div class="border-l-2 border-line-strong pl-3">
              <p class="editorial-index">${escapeHtml(MODULE_META.school)} · Kelas IX</p>
              <p class="font-mono text-xs text-cobalt font-semibold">Koding &amp; Kecerdasan Artifisial (KKA)</p>
            </div>
          </div>

          <h1 class="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] text-ink">
            E-Modul Interaktif<br />Materi Percabangan
          </h1>

          <p class="prose-wb text-ink-muted text-[15.5px]">
            Bahan ajar digital interaktif untuk siswa kelas IX. Di sini kamu akan belajar cara komputer mengambil keputusan secara bertahap, mulai dari <strong class="text-ink">logika flowchart</strong>, <strong class="text-ink">blok visual puzzle</strong>, <strong class="text-ink">kode Python</strong>, hingga <strong class="text-ink">Pohon Keputusan</strong>.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div class="border-l-2 border-cobalt pl-3 py-0.5">
              <p class="font-mono text-xs font-semibold text-ink uppercase">Ramah Pemula</p>
              <p class="text-xs text-ink-muted mt-0.5">Materi bertahap dengan contoh kegiatan harian siswa SMP.</p>
            </div>
            <div class="border-l-2 border-emerald pl-3 py-0.5">
              <p class="font-mono text-xs font-semibold text-ink uppercase">Bisa Luring (PWA)</p>
              <p class="text-xs text-ink-muted mt-0.5">Tetap bisa dibuka di HP rumah walau tanpa paket data.</p>
            </div>
            <div class="border-l-2 border-amber pl-3 py-0.5">
              <p class="font-mono text-xs font-semibold text-ink uppercase">Ringan &amp; Responsif</p>
              <p class="text-xs text-ink-muted mt-0.5">Nyaman dipakai di komputer lab sekolah maupun layar HP.</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 flex justify-center lg:justify-end">
          ${mascotIllustration()}
        </div>
      </header>

      <!-- Formulir Profil Peserta Didik -->
      <section aria-labelledby="profile-section-title" class="wb-sheet-framed p-5 sm:p-7">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-5 space-y-2">
            <p class="editorial-index">Identitas Belajar</p>
            <h2 id="profile-section-title" class="font-display font-bold text-2xl text-ink">
              Isi Profil Peserta Didik
            </h2>
            <p class="text-sm text-ink-muted leading-relaxed">
              Nama dan kelasmu disimpan otomatis di perangkat ini untuk mencatat progres belajar serta melengkapi sertifikat di bagian akhir modul.
            </p>
            ${
              profile.name
                ? `<p class="text-xs font-mono text-emerald font-semibold pt-1 flex items-center gap-1.5">${icon('checkCircle', 15)} Profil aktif: ${escapeHtml(profile.name)} (${escapeHtml(profile.kelas)})</p>`
                : ''
            }
          </div>

          <form id="home-profile-form" class="lg:col-span-7 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <label class="sm:col-span-2 block">
                <span class="block text-xs font-mono font-semibold uppercase tracking-wide text-ink mb-1.5">
                  Nama Lengkap Siswa
                </span>
                <input
                  type="text"
                  id="student-name-input"
                  name="studentName"
                  required
                  maxlength="60"
                  value="${escapeHtml(profile.name)}"
                  placeholder="Contoh: Nadira Putri Ramadhan"
                  class="w-full px-3.5 py-2.5 text-sm bg-canvas border-[1.5px] border-line-strong rounded-md text-ink placeholder:text-ink-muted focus:bg-surface focus:border-cobalt"
                />
              </label>

              <label class="block">
                <span class="block text-xs font-mono font-semibold uppercase tracking-wide text-ink mb-1.5">
                  Kelas
                </span>
                <select
                  id="student-class-input"
                  name="studentClass"
                  class="w-full px-3.5 py-2.5 text-sm bg-canvas border-[1.5px] border-line-strong rounded-md text-ink focus:bg-surface focus:border-cobalt"
                >
                  ${MODULE_META.classOptions
                    .map(
                      (cls) =>
                        `<option value="${cls}" ${cls === (profile.kelas || 'IX-D') ? 'selected' : ''}>${cls}</option>`
                    )
                    .join('')}
                </select>
              </label>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button type="submit" id="start-learning-btn" class="wb-btn-primary">
                <span>${profile.name ? 'Perbarui Profil &amp; Lanjut Belajar' : 'Mulai Belajar'}</span>
                ${icon('arrowRight', 17)}
              </button>
              <button type="button" id="skip-to-menu-btn" class="wb-btn-secondary">
                ${icon('grid', 16)}
                <span>Langsung ke Daftar Isi</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Ringkasan 4 Kegiatan Belajar -->
      <section aria-labelledby="kb-overview-title" class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-2 pb-2 border-b border-line">
          <div>
            <p class="editorial-index">Peta Materi</p>
            <h2 id="kb-overview-title" class="font-display font-bold text-2xl text-ink mt-0.5">
              4 Kegiatan Belajar dalam E-Modul Ini
            </h2>
          </div>
          <span class="font-mono text-xs text-ink-muted">Kurikulum KKA Fase D · BSKAP 046/H/KR/2025</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-1">
          ${KB_SUMMARY_CARDS.map(
            (kb) => `
            <article class="border-t-2 border-line-strong pt-4 flex flex-col justify-between gap-3">
              <div>
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-xs font-bold tracking-wider uppercase text-cobalt">
                    ${escapeHtml(kb.code)} · ${escapeHtml(kb.duration)}
                  </span>
                </div>
                <h3 class="font-display font-bold text-lg text-ink mt-1.5">${escapeHtml(kb.title)}</h3>
                <p class="text-sm text-ink-muted mt-1 leading-relaxed">${escapeHtml(kb.summary)}</p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-line/70">
                <span class="font-mono text-[11px] text-ink-muted">${escapeHtml(kb.deliverable)}</span>
                <button type="button" data-go-screen="${kb.screenId}" class="text-xs font-semibold text-cobalt hover:underline inline-flex items-center gap-1 cursor-pointer">
                  <span>Buka ${escapeHtml(kb.code)}</span>
                  ${icon('arrowRight', 13)}
                </button>
              </div>
            </article>
          `
          ).join('')}
        </div>
      </section>
    </section>
  `;

  document.getElementById('home-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('student-name-input');
    const classInput = document.getElementById('student-class-input');
    const nameVal = nameInput?.value.trim() || '';
    const classVal = classInput?.value || 'IX-D';
    if (!nameVal) {
      nameInput?.focus();
      return;
    }
    saveProfile(nameVal, classVal);
    showToast(`Selamat belajar, ${nameVal} (${classVal}). Profil tersimpan!`);
    navigate(2);
  });

  document.getElementById('skip-to-menu-btn')?.addEventListener('click', () => {
    navigate(4);
  });

  container.querySelectorAll('[data-go-screen]').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigate(Number(btn.getAttribute('data-go-screen')));
    });
  });
}
