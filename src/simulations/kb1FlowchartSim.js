/**
 * kb1FlowchartSim.js — Simulasi Flowchart SVG Interaktif (KB 1)
 * Mendukung 3 skenario:
 * 1) Cek Kelulusan Nilai KKM >= 75 (Keputusan Tunggal)
 * 2) Penentuan Predikat Nilai A / B / C (Keputusan Majemuk)
 * 3) Rekomendasi Berangkat Sekolah — Cuaca & Jas Hujan (Keputusan Majemuk Kontekstual)
 */

import { markKb1SimTested } from '../storage/localStore.js';
import { icon } from '../components/icons.js';

export function mountKb1FlowchartSim(container) {
  if (!container) return;

  const simState = {
    scenario: 'kkm', // 'kkm' | 'predikat' | 'cuaca'
    nilaiKkm: 82,
    nilaiPredikat: 78,
    curahHujan: 65,
    bawaJasHujan: true,
    testedCount: 0,
  };

  function renderSvgKkm(nilai) {
    const isTrue = nilai >= 75;
    const trueStroke = isTrue ? 'var(--color-emerald)' : 'var(--color-line)';
    const falseStroke = !isTrue ? 'var(--color-coral)' : 'var(--color-line)';
    const trueWidth = isTrue ? 3.2 : 1.8;
    const falseWidth = !isTrue ? 3.2 : 1.8;

    return `
      <svg viewBox="0 0 640 420" class="w-full h-auto max-w-[640px] mx-auto" role="img" aria-label="Diagram alir interaktif cek kelulusan KKM nilai ${nilai}">
        <defs>
          <marker id="arr-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-ink)"/>
          </marker>
          <marker id="arr-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-emerald)"/>
          </marker>
          <marker id="arr-coral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-coral)"/>
          </marker>
          <marker id="arr-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-line)"/>
          </marker>
        </defs>

        <!-- Terminator Mulai -->
        <rect x="255" y="14" width="130" height="38" rx="19" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="320" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="600" fill="var(--color-ink)">Mulai</text>
        <line x1="320" y1="52" x2="320" y2="80" stroke="var(--color-ink)" stroke-width="2.2" marker-end="url(#arr-ink)"/>

        <!-- Input Jajar Genjang -->
        <polygon points="232,84 426,84 408,128 214,128" fill="var(--color-surface)" stroke="var(--color-ink)" stroke-width="2" stroke-linejoin="round"/>
        <text x="320" y="111" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600" fill="var(--color-ink)">Input: nilai = ${nilai}</text>
        <line x1="320" y1="128" x2="320" y2="156" stroke="var(--color-ink)" stroke-width="2.2" marker-end="url(#arr-ink)"/>

        <!-- Belah Ketupat Keputusan -->
        <polygon points="320,160 426,214 320,268 214,214" fill="var(--color-cobalt-soft)" stroke="var(--color-cobalt)" stroke-width="2.6" stroke-linejoin="round"/>
        <text x="320" y="210" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="var(--color-cobalt)">nilai &gt;= 75 ?</text>
        <text x="320" y="229" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="var(--color-ink-muted)">(${nilai} &gt;= 75 → ${isTrue ? 'True' : 'False'})</text>

        <!-- Cabang Kiri: YA (True) -->
        <path d="M 214 214 H 126 V 280" fill="none" stroke="${trueStroke}" stroke-width="${trueWidth}" class="${isTrue ? 'fc-flow-active' : ''}" marker-end="url(#${isTrue ? 'arr-emerald' : 'arr-muted'})"/>
        <rect x="134" y="191" width="66" height="20" rx="4" fill="${isTrue ? 'var(--color-emerald-soft)' : 'var(--color-canvas)'}" stroke="${trueStroke}" stroke-width="1.3"/>
        <text x="167" y="205" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="${isTrue ? 'var(--color-ink)' : 'var(--color-ink-muted)'}">YA (True)</text>

        <g class="fc-node ${isTrue ? '' : 'fc-dimmed'}">
          <rect x="34" y="284" width="184" height="54" rx="6" fill="${isTrue ? 'var(--color-emerald-soft)' : 'var(--color-surface)'}" stroke="${isTrue ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isTrue ? 2.6 : 1.6}"/>
          <text x="126" y="307" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Lulus KKM (Tuntas)</text>
          <text x="126" y="325" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">Jalur True aktif</text>
        </g>

        <!-- Cabang Kanan: TIDAK (False) -->
        <path d="M 426 214 H 514 V 280" fill="none" stroke="${falseStroke}" stroke-width="${falseWidth}" class="${!isTrue ? 'fc-flow-active' : ''}" marker-end="url(#${!isTrue ? 'arr-coral' : 'arr-muted'})"/>
        <rect x="434" y="191" width="84" height="20" rx="4" fill="${!isTrue ? 'var(--color-coral-soft)' : 'var(--color-canvas)'}" stroke="${falseStroke}" stroke-width="1.3"/>
        <text x="476" y="205" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${!isTrue ? 'var(--color-ink)' : 'var(--color-ink-muted)'}">TIDAK (False)</text>

        <g class="fc-node ${!isTrue ? '' : 'fc-dimmed'}">
          <rect x="422" y="284" width="184" height="54" rx="6" fill="${!isTrue ? 'var(--color-coral-soft)' : 'var(--color-surface)'}" stroke="${!isTrue ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${!isTrue ? 2.6 : 1.6}"/>
          <text x="514" y="307" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Perlu Remedial</text>
          <text x="514" y="325" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">Jalur False aktif</text>
        </g>

        <!-- Gabung ke Terminator Selesai -->
        <path d="M 126 338 V 388 H 251" fill="none" stroke="${trueStroke}" stroke-width="${trueWidth}" marker-end="url(#${isTrue ? 'arr-emerald' : 'arr-muted'})"/>
        <path d="M 514 338 V 388 H 389" fill="none" stroke="${falseStroke}" stroke-width="${falseWidth}" marker-end="url(#${!isTrue ? 'arr-coral' : 'arr-muted'})"/>

        <rect x="255" y="369" width="130" height="38" rx="19" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="320" y="393" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="600" fill="var(--color-ink)">Selesai</text>
      </svg>
    `;
  }

  function renderSvgPredikat(nilai) {
    const isA = nilai >= 90;
    const isB = !isA && nilai >= 75;
    const isC = !isA && !isB;

    return `
      <svg viewBox="0 0 660 475" class="w-full h-auto max-w-[660px] mx-auto" role="img" aria-label="Diagram alir interaktif predikat nilai ${nilai}">
        <defs>
          <marker id="p-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-ink)"/></marker>
          <marker id="p-em" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-emerald)"/></marker>
          <marker id="p-am" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-amber)"/></marker>
          <marker id="p-co" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-coral)"/></marker>
          <marker id="p-mu" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-line)"/></marker>
        </defs>

        <!-- Mulai & Input -->
        <rect x="265" y="10" width="130" height="34" rx="17" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="330" y="32" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="var(--color-ink)">Mulai</text>
        <line x1="330" y1="44" x2="330" y2="66" stroke="var(--color-ink)" stroke-width="2" marker-end="url(#p-ink)"/>

        <polygon points="244,70 434,70 416,108 226,108" fill="var(--color-surface)" stroke="var(--color-ink)" stroke-width="2" stroke-linejoin="round"/>
        <text x="330" y="94" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="600" fill="var(--color-ink)">Input: nilai = ${nilai}</text>
        <line x1="330" y1="108" x2="330" y2="132" stroke="var(--color-ink)" stroke-width="2" marker-end="url(#p-ink)"/>

        <!-- Keputusan 1: nilai >= 90 -->
        <polygon points="330,136 432,182 330,228 228,182" fill="var(--color-cobalt-soft)" stroke="var(--color-cobalt)" stroke-width="2.5" stroke-linejoin="round"/>
        <text x="330" y="179" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="700" fill="var(--color-cobalt)">1) nilai &gt;= 90 ?</text>
        <text x="330" y="196" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">${nilai} &gt;= 90 → ${isA ? 'True' : 'False'}</text>

        <!-- Jalur YA dari Keputusan 1 -> Predikat A -->
        <path d="M 228 182 H 112 V 256" fill="none" stroke="${isA ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isA ? 3.2 : 1.8}" class="${isA ? 'fc-flow-active' : ''}" marker-end="url(#${isA ? 'p-em' : 'p-mu'})"/>
        <text x="165" y="174" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="${isA ? 'var(--color-emerald)' : 'var(--color-ink-muted)'}">YA (True)</text>

        <g class="fc-node ${isA ? '' : 'fc-dimmed'}">
          <rect x="24" y="260" width="176" height="58" rx="6" fill="${isA ? 'var(--color-emerald-soft)' : 'var(--color-surface)'}" stroke="${isA ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isA ? 2.6 : 1.6}"/>
          <text x="112" y="285" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Predikat A</text>
          <text x="112" y="303" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">Sangat Baik</text>
        </g>

        <!-- Jalur TIDAK dari Keputusan 1 -> Keputusan 2 -->
        <path d="M 432 182 H 492 V 222" fill="none" stroke="${!isA ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${!isA ? 3.0 : 1.8}" class="${!isA ? 'fc-flow-active' : ''}" marker-end="url(#${!isA ? 'p-co' : 'p-mu'})"/>
        <text x="488" y="174" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${!isA ? 'var(--color-coral)' : 'var(--color-ink-muted)'}">TIDAK (False)</text>

        <!-- Keputusan 2: nilai >= 75 -->
        <g class="fc-node ${!isA ? '' : 'fc-dimmed'}">
          <polygon points="492,226 592,272 492,318 392,272" fill="${!isA ? 'var(--color-amber-soft)' : 'var(--color-surface)'}" stroke="${!isA ? 'var(--color-amber)' : 'var(--color-line)'}" stroke-width="${!isA ? 2.6 : 1.6}" stroke-linejoin="round"/>
          <text x="492" y="269" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--color-ink)">2) nilai &gt;= 75 ?</text>
          <text x="492" y="286" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--color-ink-muted)">${!isA ? `${nilai} &gt;= 75 → ${isB ? 'True' : 'False'}` : 'Dilewati'}</text>
        </g>

        <!-- Jalur YA dari Keputusan 2 -> Predikat B -->
        <path d="M 392 272 H 316 V 344" fill="none" stroke="${isB ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isB ? 3.2 : 1.8}" class="${isB ? 'fc-flow-active' : ''}" marker-end="url(#${isB ? 'p-em' : 'p-mu'})"/>
        <text x="352" y="264" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${isB ? 'var(--color-emerald)' : 'var(--color-ink-muted)'}">YA (True)</text>

        <g class="fc-node ${isB ? '' : 'fc-dimmed'}">
          <rect x="234" y="348" width="164" height="54" rx="6" fill="${isB ? 'var(--color-emerald-soft)' : 'var(--color-surface)'}" stroke="${isB ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isB ? 2.6 : 1.6}"/>
          <text x="316" y="371" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Predikat B</text>
          <text x="316" y="389" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">Baik (Tuntas KKM)</text>
        </g>

        <!-- Jalur TIDAK dari Keputusan 2 -> Predikat C -->
        <path d="M 592 272 H 624 V 344 H 558" fill="none" stroke="${isC ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${isC ? 3.2 : 1.8}" class="${isC ? 'fc-flow-active' : ''}" marker-end="url(#${isC ? 'p-co' : 'p-mu'})"/>
        <text x="585" y="336" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${isC ? 'var(--color-coral)' : 'var(--color-ink-muted)'}">TIDAK (False)</text>

        <g class="fc-node ${isC ? '' : 'fc-dimmed'}">
          <rect x="448" y="348" width="176" height="54" rx="6" fill="${isC ? 'var(--color-coral-soft)' : 'var(--color-surface)'}" stroke="${isC ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${isC ? 2.6 : 1.6}"/>
          <text x="536" y="371" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12.5" font-weight="700" fill="var(--color-ink)">Predikat C</text>
          <text x="536" y="389" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">Perlu Bimbingan</text>
        </g>

        <!-- Gabung ke Selesai -->
        <path d="M 112 318 V 448 H 251" fill="none" stroke="${isA ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isA ? 2.8 : 1.5}" marker-end="url(#${isA ? 'p-em' : 'p-mu'})"/>
        <line x1="316" y1="402" x2="316" y2="426" stroke="${isB ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${isB ? 2.8 : 1.5}" marker-end="url(#${isB ? 'p-em' : 'p-mu'})"/>
        <path d="M 536 402 V 448 H 389" fill="none" stroke="${isC ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${isC ? 2.8 : 1.5}" marker-end="url(#${isC ? 'p-co' : 'p-mu'})"/>

        <rect x="255" y="430" width="130" height="34" rx="17" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="320" y="452" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="var(--color-ink)">Selesai</text>
      </svg>
    `;
  }

  function renderSvgCuaca(curah, jas) {
    const hujan = curah >= 50;
    const pakaiJas = hujan && jas;
    const tunggu = hujan && !jas;

    return `
      <svg viewBox="0 0 660 475" class="w-full h-auto max-w-[660px] mx-auto" role="img" aria-label="Diagram alir interaktif cuaca berangkat sekolah curah hujan ${curah} persen">
        <defs>
          <marker id="c-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-ink)"/></marker>
          <marker id="c-em" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-emerald)"/></marker>
          <marker id="c-co" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-coral)"/></marker>
          <marker id="c-mu" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-line)"/></marker>
        </defs>

        <rect x="265" y="10" width="130" height="34" rx="17" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="330" y="32" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="var(--color-ink)">Mulai</text>
        <line x1="330" y1="44" x2="330" y2="66" stroke="var(--color-ink)" stroke-width="2" marker-end="url(#c-ink)"/>

        <polygon points="204,70 474,70 456,108 186,108" fill="var(--color-surface)" stroke="var(--color-ink)" stroke-width="2" stroke-linejoin="round"/>
        <text x="330" y="94" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="600" fill="var(--color-ink)">curah = ${curah}% | jasHujan = ${jas ? 'Ya' : 'Tidak'}</text>
        <line x1="330" y1="108" x2="330" y2="132" stroke="var(--color-ink)" stroke-width="2" marker-end="url(#c-ink)"/>

        <!-- Keputusan 1: curah >= 50 -->
        <polygon points="330,136 438,182 330,228 222,182" fill="var(--color-cobalt-soft)" stroke="var(--color-cobalt)" stroke-width="2.5" stroke-linejoin="round"/>
        <text x="330" y="179" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="var(--color-cobalt)">1) curah &gt;= 50% ?</text>
        <text x="330" y="196" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--color-ink-muted)">${curah} &gt;= 50 → ${hujan ? 'True (Hujan)' : 'False (Cerah)'}</text>

        <!-- Jalur TIDAK (Cerah) -->
        <path d="M 222 182 H 112 V 256" fill="none" stroke="${!hujan ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${!hujan ? 3.2 : 1.8}" class="${!hujan ? 'fc-flow-active' : ''}" marker-end="url(#${!hujan ? 'c-em' : 'c-mu'})"/>
        <text x="162" y="174" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${!hujan ? 'var(--color-emerald)' : 'var(--color-ink-muted)'}">TIDAK (Cerah)</text>

        <g class="fc-node ${!hujan ? '' : 'fc-dimmed'}">
          <rect x="20" y="260" width="184" height="58" rx="6" fill="${!hujan ? 'var(--color-emerald-soft)' : 'var(--color-surface)'}" stroke="${!hujan ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${!hujan ? 2.6 : 1.6}"/>
          <text x="112" y="285" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="var(--color-ink)">Berangkat Langsung</text>
          <text x="112" y="303" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--color-ink-muted)">Cuaca cerah / gerimis tipis</text>
        </g>

        <!-- Jalur YA (Hujan) -> Keputusan 2 -->
        <path d="M 438 182 H 492 V 222" fill="none" stroke="${hujan ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${hujan ? 3.0 : 1.8}" class="${hujan ? 'fc-flow-active' : ''}" marker-end="url(#${hujan ? 'c-em' : 'c-mu'})"/>
        <text x="488" y="174" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${hujan ? 'var(--color-emerald)' : 'var(--color-ink-muted)'}">YA (Hujan)</text>

        <g class="fc-node ${hujan ? '' : 'fc-dimmed'}">
          <polygon points="492,226 598,272 492,318 386,272" fill="${hujan ? 'var(--color-amber-soft)' : 'var(--color-surface)'}" stroke="${hujan ? 'var(--color-amber)' : 'var(--color-line)'}" stroke-width="${hujan ? 2.6 : 1.6}" stroke-linejoin="round"/>
          <text x="492" y="269" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="700" fill="var(--color-ink)">2) bawaJasHujan?</text>
          <text x="492" y="286" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--color-ink-muted)">${hujan ? (jas ? 'True (Bawa)' : 'False (Tidak)') : 'Dilewati'}</text>
        </g>

        <!-- YA bawa jas hujan -->
        <path d="M 386 272 H 316 V 344" fill="none" stroke="${pakaiJas ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${pakaiJas ? 3.2 : 1.8}" class="${pakaiJas ? 'fc-flow-active' : ''}" marker-end="url(#${pakaiJas ? 'c-em' : 'c-mu'})"/>
        <text x="350" y="264" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${pakaiJas ? 'var(--color-emerald)' : 'var(--color-ink-muted)'}">YA (True)</text>

        <g class="fc-node ${pakaiJas ? '' : 'fc-dimmed'}">
          <rect x="230" y="348" width="172" height="54" rx="6" fill="${pakaiJas ? 'var(--color-emerald-soft)' : 'var(--color-surface)'}" stroke="${pakaiJas ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${pakaiJas ? 2.6 : 1.6}"/>
          <text x="316" y="371" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="var(--color-ink)">Pakai Jas Hujan</text>
          <text x="316" y="389" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--color-ink-muted)">Aman berangkat ke sekolah</text>
        </g>

        <!-- TIDAK bawa jas hujan -->
        <path d="M 598 272 H 628 V 344 H 558" fill="none" stroke="${tunggu ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${tunggu ? 3.2 : 1.8}" class="${tunggu ? 'fc-flow-active' : ''}" marker-end="url(#${tunggu ? 'c-co' : 'c-mu'})"/>
        <text x="588" y="336" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${tunggu ? 'var(--color-coral)' : 'var(--color-ink-muted)'}">TIDAK (False)</text>

        <g class="fc-node ${tunggu ? '' : 'fc-dimmed'}">
          <rect x="444" y="348" width="184" height="54" rx="6" fill="${tunggu ? 'var(--color-coral-soft)' : 'var(--color-surface)'}" stroke="${tunggu ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${tunggu ? 2.6 : 1.6}"/>
          <text x="536" y="371" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="var(--color-ink)">Tunggu Hujan Reda</text>
          <text x="536" y="389" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--color-ink-muted)">Atau pinjam payung dulu</text>
        </g>

        <path d="M 112 318 V 448 H 251" fill="none" stroke="${!hujan ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${!hujan ? 2.8 : 1.5}" marker-end="url(#${!hujan ? 'c-em' : 'c-mu'})"/>
        <line x1="316" y1="402" x2="316" y2="426" stroke="${pakaiJas ? 'var(--color-emerald)' : 'var(--color-line)'}" stroke-width="${pakaiJas ? 2.8 : 1.5}" marker-end="url(#${pakaiJas ? 'c-em' : 'c-mu'})"/>
        <path d="M 536 402 V 448 H 389" fill="none" stroke="${tunggu ? 'var(--color-coral)' : 'var(--color-line)'}" stroke-width="${tunggu ? 2.8 : 1.5}" marker-end="url(#${tunggu ? 'c-co' : 'c-mu'})"/>

        <rect x="255" y="430" width="130" height="34" rx="17" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
        <text x="320" y="452" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="var(--color-ink)">Selesai</text>
      </svg>
    `;
  }

  function getTraceSteps() {
    if (simState.scenario === 'kkm') {
      const n = simState.nilaiKkm;
      const ok = n >= 75;
      return {
        outcomeTitle: ok ? 'Lulus KKM (Tuntas)' : 'Perlu Remedial',
        outcomeTone: ok ? 'emerald' : 'coral',
        steps: [
          `Mulai program dan baca masukan: nilai = ${n}.`,
          `Uji simbol Belah Ketupat: apakah ${n} >= 75? Hasilnya ${ok ? 'True (Benar)' : 'False (Salah)'}.`,
          ok
            ? 'Ikuti panah jalur YA (hijau emerald) menuju kotak proses "Lulus KKM (Tuntas)".'
            : 'Ikuti panah jalur TIDAK (merah coral) menuju kotak proses "Perlu Remedial".',
          'Alur berakhir pada simbol Terminator "Selesai".',
        ],
      };
    }

    if (simState.scenario === 'predikat') {
      const n = simState.nilaiPredikat;
      if (n >= 90) {
        return {
          outcomeTitle: 'Predikat A (Sangat Baik)',
          outcomeTone: 'emerald',
          steps: [
            `Baca masukan: nilai = ${n}.`,
            `Uji Belah Ketupat 1: ${n} >= 90? Hasilnya True (Benar).`,
            'Langsung ikuti jalur YA menuju "Predikat A (Sangat Baik)". Belah Ketupat 2 tidak perlu diperiksa.',
            'Program menuju simbol "Selesai".',
          ],
        };
      }
      if (n >= 75) {
        return {
          outcomeTitle: 'Predikat B (Baik, Tuntas KKM)',
          outcomeTone: 'emerald',
          steps: [
            `Baca masukan: nilai = ${n}.`,
            `Uji Belah Ketupat 1: ${n} >= 90? Hasilnya False, lalu lanjut ke jalur TIDAK.`,
            `Uji Belah Ketupat 2: ${n} >= 75? Hasilnya True, lalu masuk ke "Predikat B (Baik, Tuntas KKM)".`,
            'Program menuju simbol "Selesai".',
          ],
        };
      }
      return {
        outcomeTitle: 'Predikat C (Perlu Bimbingan)',
        outcomeTone: 'coral',
        steps: [
          `Baca masukan: nilai = ${n}.`,
          `Uji Belah Ketupat 1: ${n} >= 90? Hasilnya False, lalu lanjut ke jalur TIDAK.`,
          `Uji Belah Ketupat 2: ${n} >= 75? Hasilnya juga False, sehingga masuk ke jalur TIDAK terakhir ("Predikat C").`,
          'Program menuju simbol "Selesai".',
        ],
      };
    }

    // Skenario Cuaca
    const c = simState.curahHujan;
    const j = simState.bawaJasHujan;
    if (c < 50) {
      return {
        outcomeTitle: 'Berangkat Langsung ke Sekolah',
        outcomeTone: 'emerald',
        steps: [
          `Baca masukan: curahHujan = ${c}%, bawaJasHujan = ${j ? 'Ya' : 'Tidak'}.`,
          `Uji Belah Ketupat 1: ${c} >= 50? Hasilnya False (tidak hujan deras).`,
          'Ikuti jalur TIDAK menuju "Berangkat Langsung". Pengecekan jas hujan dilewati.',
          'Alur selesai.',
        ],
      };
    }
    if (j) {
      return {
        outcomeTitle: 'Pakai Jas Hujan lalu Berangkat',
        outcomeTone: 'emerald',
        steps: [
          `Baca masukan: curahHujan = ${c}%, bawaJasHujan = Ya.`,
          `Uji Belah Ketupat 1: ${c} >= 50? Hasilnya True (hujan), lalu lanjut ke Belah Ketupat 2.`,
          'Uji Belah Ketupat 2: bawaJasHujan == Ya? Hasilnya True, sehingga menjalankan "Pakai Jas Hujan".',
          'Alur selesai.',
        ],
      };
    }
    return {
      outcomeTitle: 'Tunggu Hujan Reda atau Pinjam Payung',
      outcomeTone: 'coral',
      steps: [
        `Baca masukan: curahHujan = ${c}%, bawaJasHujan = Tidak.`,
        `Uji Belah Ketupat 1: ${c} >= 50? Hasilnya True (hujan), lalu lanjut ke Belah Ketupat 2.`,
        'Uji Belah Ketupat 2: bawaJasHujan == Ya? Hasilnya False, sehingga menjalankan "Tunggu Hujan Reda".',
        'Alur selesai.',
      ],
    };
  }

  function render() {
    const trace = getTraceSteps();
    const isKkm = simState.scenario === 'kkm';
    const isPred = simState.scenario === 'predikat';
    const isCuaca = simState.scenario === 'cuaca';

    const svgMarkup = isKkm
      ? renderSvgKkm(simState.nilaiKkm)
      : isPred
      ? renderSvgPredikat(simState.nilaiPredikat)
      : renderSvgCuaca(simState.curahHujan, simState.bawaJasHujan);

    const outcomeStyle =
      trace.outcomeTone === 'emerald'
        ? 'border-emerald bg-emerald-soft text-ink'
        : 'border-coral bg-coral-soft text-ink';

    container.innerHTML = `
      <div class="wb-sheet-framed overflow-hidden">
        <!-- Header Simulasi + Tab Skenario -->
        <div class="px-4 sm:px-6 py-4 bg-canvas border-b border-line-strong">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="editorial-index">Simulasi KB 1</p>
              <h3 class="font-display font-bold text-lg sm:text-xl text-ink mt-0.5">Uji Alur Flowchart Secara Langsung</h3>
            </div>
            <span class="font-mono text-xs px-2.5 py-1 rounded border border-line bg-surface text-ink-muted">
              Penelusuran Langsung
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mt-3" role="tablist" aria-label="Pilih skenario flowchart">
            <button type="button" data-sim-scenario="kkm" class="px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
              isKkm ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
            }">
              Skenario 1: Kelulusan KKM (Tunggal)
            </button>
            <button type="button" data-sim-scenario="predikat" class="px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
              isPred ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
            }">
              Skenario 2: Predikat Nilai (Majemuk)
            </button>
            <button type="button" data-sim-scenario="cuaca" class="px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-colors ${
              isCuaca ? 'bg-ink text-surface border-ink' : 'bg-surface text-ink border-line-strong hover:bg-canvas'
            }">
              Skenario 3: Cuaca Sekolah (Majemuk)
            </button>
          </div>
        </div>

        <!-- Area Kontrol Input -->
        <div class="px-4 sm:px-6 py-4 bg-surface border-b border-line">
          ${
            isKkm || isPred
              ? `
              <div class="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="kb1-sim-slider" class="text-sm font-semibold text-ink">
                      Geser Nilai Uji (<code class="font-mono text-cobalt">nilai</code>)
                    </label>
                    <span id="kb1-sim-value-badge" class="font-mono text-lg font-bold text-cobalt bg-cobalt-soft px-2.5 py-0.5 rounded border border-cobalt">
                      ${isKkm ? simState.nilaiKkm : simState.nilaiPredikat}
                    </span>
                  </div>
                  <input
                    id="kb1-sim-slider"
                    type="range"
                    min="0"
                    max="100"
                    value="${isKkm ? simState.nilaiKkm : simState.nilaiPredikat}"
                    class="wb-slider"
                  />
                  <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span class="font-mono text-[11px] text-ink-muted mr-1">Uji cepat:</span>
                    ${(isKkm ? [55, 74, 75, 92] : [58, 75, 84, 95])
                      .map(
                        (preset) => `
                        <button type="button" data-sim-preset="${preset}" class="font-mono text-xs px-2 py-0.5 rounded border border-line bg-canvas hover:border-cobalt text-ink cursor-pointer">
                          ${preset}
                        </button>
                      `
                      )
                      .join('')}
                  </div>
                </div>
                <div class="shrink-0">
                  <button type="button" id="kb1-run-test-btn" class="wb-btn-primary w-full md:w-auto">
                    ${icon('play', 16)}
                    <span>Uji Kondisi</span>
                  </button>
                </div>
              </div>
            `
              : `
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div class="md:col-span-6">
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="kb1-cuaca-slider" class="text-sm font-semibold text-ink">
                      Intensitas Hujan (<code class="font-mono text-cobalt">curahHujan</code>)
                    </label>
                    <span class="font-mono text-base font-bold text-cobalt bg-cobalt-soft px-2 py-0.5 rounded border border-cobalt">
                      ${simState.curahHujan}%
                    </span>
                  </div>
                  <input id="kb1-cuaca-slider" type="range" min="0" max="100" value="${simState.curahHujan}" class="wb-slider" />
                  <p class="text-xs text-ink-muted mt-1">Batas hujan deras: <strong>&gt;= 50%</strong></p>
                </div>
                <div class="md:col-span-3">
                  <span class="block text-xs font-mono uppercase text-ink-muted mb-1">Bawa Jas Hujan?</span>
                  <div class="flex gap-1.5">
                    <button type="button" data-jas-toggle="true" class="flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                      simState.bawaJasHujan ? 'bg-emerald-soft border-emerald text-ink' : 'bg-canvas border-line text-ink-muted'
                    }">Ya</button>
                    <button type="button" data-jas-toggle="false" class="flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                      !simState.bawaJasHujan ? 'bg-coral-soft border-coral text-ink' : 'bg-canvas border-line text-ink-muted'
                    }">Tidak</button>
                  </div>
                </div>
                <div class="md:col-span-3 flex md:justify-end">
                  <button type="button" id="kb1-run-test-btn" class="wb-btn-primary w-full md:w-auto">
                    ${icon('play', 16)}
                    <span>Uji Kondisi</span>
                  </button>
                </div>
              </div>
            `
          }
        </div>

        <!-- Diagram Flowchart + Penelusuran Langkah -->
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <div class="lg:col-span-8 p-4 sm:p-5 bg-surface border-b lg:border-b-0 lg:border-r border-line overflow-x-auto">
            ${svgMarkup}
          </div>

          <div class="lg:col-span-4 p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
            <div>
              <p class="editorial-index">Hasil &amp; Penelusuran Alur</p>
              <div id="kb1-sim-outcome" class="mt-2 p-3 rounded-md border-2 ${outcomeStyle}">
                <span class="font-mono text-[11px] uppercase tracking-wide text-ink-muted block">Output Akhir:</span>
                <p class="font-display font-bold text-base mt-0.5">${trace.outcomeTitle}</p>
              </div>

              <ol class="mt-4 space-y-2.5 text-sm">
                ${trace.steps
                  .map(
                    (step, idx) => `
                    <li class="flex items-start gap-2.5">
                      <span class="font-mono text-xs font-bold w-5 h-5 rounded-full bg-surface border border-line-strong flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                      <span class="text-ink leading-snug">${step}</span>
                    </li>
                  `
                  )
                  .join('')}
              </ol>
            </div>

            <div class="pt-3 border-t border-line text-xs text-ink-muted flex items-center justify-between">
              <span>Legenda jalur:</span>
              <div class="flex items-center gap-3 font-mono">
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald inline-block"></span>True</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-coral inline-block"></span>False</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind events
    container.querySelectorAll('[data-sim-scenario]').forEach((btn) => {
      btn.addEventListener('click', () => {
        simState.scenario = btn.getAttribute('data-sim-scenario');
        markKb1SimTested(simState.scenario);
        render();
      });
    });

    const slider = container.querySelector('#kb1-sim-slider');
    slider?.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      if (simState.scenario === 'kkm') simState.nilaiKkm = val;
      else simState.nilaiPredikat = val;
      markKb1SimTested(simState.scenario);
      render();
      const restored = container.querySelector('#kb1-sim-slider');
      restored?.focus();
    });

    const cuacaSlider = container.querySelector('#kb1-cuaca-slider');
    cuacaSlider?.addEventListener('input', (e) => {
      simState.curahHujan = Number(e.target.value);
      markKb1SimTested('cuaca');
      render();
      container.querySelector('#kb1-cuaca-slider')?.focus();
    });

    container.querySelectorAll('[data-jas-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        simState.bawaJasHujan = btn.getAttribute('data-jas-toggle') === 'true';
        markKb1SimTested('cuaca');
        render();
      });
    });

    container.querySelectorAll('[data-sim-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = Number(btn.getAttribute('data-sim-preset'));
        if (simState.scenario === 'kkm') simState.nilaiKkm = val;
        else simState.nilaiPredikat = val;
        markKb1SimTested(simState.scenario);
        render();
      });
    });

    container.querySelector('#kb1-run-test-btn')?.addEventListener('click', () => {
      simState.testedCount += 1;
      markKb1SimTested(simState.scenario);
      const outcomeEl = container.querySelector('#kb1-sim-outcome');
      if (outcomeEl) {
        outcomeEl.classList.add('ring-2', 'ring-cobalt');
        setTimeout(() => outcomeEl.classList.remove('ring-2', 'ring-cobalt'), 650);
      }
    });
  }

  render();
}
