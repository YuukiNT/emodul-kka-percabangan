/**
 * screen1Home.js - Layar 1: Sampul Buku Kerja & Identitas Belajar
 * Komposisi editorial terbuka di atas kertas hangat (tanpa tumpukan kotak berlapis).
 */

import { KB_SUMMARY_CARDS, MODULE_META } from '../data/curriculum.js';
import { getProgress, getState, saveProfile } from '../storage/localStore.js';
import { icon, mascotIllustration } from '../components/icons.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getNextLearningScreen(state) {
  const m = state.milestones;
  if (!m.kb1SimTested || !m.kb1QuizDone) return { id: 5, label: 'KB 1: Flowchart' };
  if (!m.kb2SimSolved || !m.kb2QuizDone) return { id: 6, label: 'KB 2: Blok Visual' };
  if (!m.kb3CodeTested) return { id: 7, label: 'KB 3: Kode Python' };
  if (!m.kb4TreeTested) return { id: 8, label: 'KB 4: Pohon Keputusan' };
  return { id: 9, label: 'Evaluasi Mandiri' };
}

export function renderScreen1Home(container, { navigate, showToast }) {
  const state = getState();
  const { profile } = state;
  const progress = getProgress();
  const nextTarget = getNextLearningScreen(state);

  container.innerHTML = `
    <section class="screen-enter space-y-12 pb-12">
      <!-- Sampul Pembuka Buku Kerja -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        <div class="lg:col-span-7 space-y-5">
          <p class="editorial-index">${escapeHtml(MODULE_META.school)} · Kelas IX · KKA</p>

          <h1 class="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-ink">
            Bagaimana Komputer Mengambil Keputusan?
          </h1>

          <p class="prose-wb text-ink-muted text-base">
            Selamat datang di buku kerja interaktif <strong>Materi Percabangan</strong>. Di sini kamu tidak hanya membaca teori, tetapi langsung mencoba menggerakkan <strong>diagram alir</strong>, menyusun <strong>blok puzzle</strong>, menulis <strong>kode Python</strong>, hingga menelusuri <strong>Pohon Keputusan AI</strong>.
          </p>

          <dl class="flex flex-wrap gap-x-7 gap-y-3 pt-1 text-xs text-ink-muted border-t border-line pt-4">
            <div>
              <dt class="font-mono font-semibold text-ink">4 Kegiatan Belajar</dt>
              <dd class="mt-0.5">Bertahap dari nol untuk pemula</dd>
            </div>
            <div>
              <dt class="font-mono font-semibold text-ink">Siap Tanpa Kuota</dt>
              <dd class="mt-0.5">Tetap berjalan saat mode luring</dd>
            </div>
            <div>
              <dt class="font-mono font-semibold text-ink">HP &amp; Komputer Lab</dt>
              <dd class="mt-0.5">Progres tersimpan otomatis</dd>
            </div>
          </dl>
        </div>

        <div class="lg:col-span-5 flex justify-center lg:justify-end">
          ${mascotIllustration()}
        </div>
      </header>

      <!-- Satu-satunya Kartu Panggung Interaktif di Layar 1: Identitas Siswa -->
      <section aria-labelledby="profile-section-title" class="wb-stage p-5 sm:p-7">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-5 space-y-2">
            <h2 id="profile-section-title" class="font-display font-bold text-xl sm:text-2xl text-ink">
              ${profile.name ? `Halo kembali, ${escapeHtml(profile.name)}!` : 'Tulis Namamu Sebelum Mulai'}
            </h2>
            <p class="text-sm text-ink-muted leading-relaxed">
              ${
                profile.name
                  ? `Progres belajarmu saat ini <strong class="text-cobalt font-mono tabular-nums">${progress.percent}%</strong>. Kamu bisa langsung melanjutkan materi atau memperbarui identitas di samping.`
                  : 'Nama dan kelasmu disimpan di perangkat ini untuk mencatat kemajuan belajar serta mencetak sertifikat di akhir modul.'
              }
            </p>
            ${
              profile.name
                ? `
                <div class="pt-2">
                  <button type="button" id="resume-learning-btn" class="wb-btn-secondary text-xs">
                    <span>Lanjutkan ${escapeHtml(nextTarget.label)}</span>
                    ${icon('arrowRight', 15)}
                  </button>
                </div>
              `
                : ''
            }
          </div>

          <form id="home-profile-form" class="lg:col-span-7 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <label class="sm:col-span-2 block">
                <span class="block text-xs font-mono font-semibold text-ink mb-1.5">
                  Nama Lengkap
                </span>
                <input
                  type="text"
                  id="student-name-input"
                  name="studentName"
                  required
                  maxlength="60"
                  value="${escapeHtml(profile.name)}"
                  placeholder="Contoh: Nadira Putri Ramadhan"
                  class="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-canvas border-[1.5px] border-line-strong rounded-md text-ink placeholder:text-ink-muted focus:bg-surface focus:border-cobalt"
                />
              </label>

              <label class="block">
                <span class="block text-xs font-mono font-semibold text-ink mb-1.5">
                  Kelas
                </span>
                <select
                  id="student-class-input"
                  name="studentClass"
                  class="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-canvas border-[1.5px] border-line-strong rounded-md text-ink focus:bg-surface focus:border-cobalt"
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
                <span>${profile.name ? 'Simpan &amp; Buka Panduan' : 'Mulai Belajar'}</span>
                ${icon('arrowRight', 17)}
              </button>
              <button type="button" id="skip-to-menu-btn" class="wb-btn-ghost border border-line">
                ${icon('grid', 15)}
                <span>Lihat Daftar Isi</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Alur 4 Kegiatan Belajar (Editorial Open Index, Tanpa Kotak Kartu Berulang) -->
      <section aria-labelledby="kb-overview-title" class="space-y-5 pt-2">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="kb-overview-title" class="font-display font-bold text-2xl text-ink">
            Alur Belajar dalam Modul Ini
          </h2>
          <span class="font-mono text-xs text-ink-muted">CP KKA Fase D · BSKAP 046/H/KR/2025</span>
        </div>

        <div class="divide-y divide-line border-t border-b border-line">
          ${KB_SUMMARY_CARDS.map(
            (kb, idx) => `
            <article class="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline">
              <div class="md:col-span-3 flex items-baseline gap-2.5">
                <span class="font-mono text-sm font-bold text-cobalt tabular-nums">0${idx + 1}</span>
                <span class="font-mono text-xs font-semibold text-ink-muted">${escapeHtml(kb.code)} · ${escapeHtml(kb.duration)}</span>
              </div>
              <div class="md:col-span-7 space-y-1">
                <h3 class="font-display font-bold text-lg text-ink">${escapeHtml(kb.title)}</h3>
                <p class="text-sm text-ink-muted leading-relaxed">${escapeHtml(kb.summary)}</p>
              </div>
              <div class="md:col-span-2 md:text-right pt-1 md:pt-0">
                <button type="button" data-go-screen="${kb.screenId}" class="text-xs font-semibold text-cobalt hover:underline inline-flex items-center gap-1 cursor-pointer min-h-[36px]">
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

  document.getElementById('resume-learning-btn')?.addEventListener('click', () => {
    navigate(nextTarget.id);
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
