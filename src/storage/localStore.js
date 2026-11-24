/**
 * localStore.js - Penyimpanan profil siswa, progres belajar (0%-100%), dan skor kuis.
 */

const STORAGE_KEY = 'emodul_kka_percabangan_v1';

const DEFAULT_STATE = {
  profile: {
    name: '',
    kelas: 'IX-D',
    savedAt: null,
  },
  currentScreen: 1,
  visitedScreens: [1],
  milestones: {
    profileSaved: false,
    guideRead: false,
    objectivesRead: false,
    kb1SimTested: false,
    kb1QuizDone: false,
    kb2SimSolved: false,
    kb2QuizDone: false,
    kb3CodeTested: false,
    kb4TreeTested: false,
    evalDone: false,
  },
  kb1: {
    testedScenarios: [],
    quizScore: null,
    quizTotal: 5,
    quizAnswers: {},
  },
  kb2: {
    solvedLevels: [],
    quizScore: null,
    quizTotal: 5,
    quizAnswers: {},
  },
  evalQuiz: {
    quizScore: null,
    quizTotal: 10,
    quizAnswers: {},
  },
};

const listeners = new Set();

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadRawState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefault();
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefault(),
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      milestones: { ...DEFAULT_STATE.milestones, ...(parsed.milestones || {}) },
      kb1: { ...DEFAULT_STATE.kb1, ...(parsed.kb1 || {}) },
      kb2: { ...DEFAULT_STATE.kb2, ...(parsed.kb2 || {}) },
      evalQuiz: { ...DEFAULT_STATE.evalQuiz, ...(parsed.evalQuiz || {}) },
      visitedScreens: Array.isArray(parsed.visitedScreens) ? parsed.visitedScreens : [1],
    };
  } catch {
    return cloneDefault();
  }
}

let state = loadRawState();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Abaikan jika penyimpanan browser dibatasi
  }
  listeners.forEach((cb) => {
    try {
      cb(state);
    } catch {
      // Lanjutkan subscriber berikutnya
    }
  });
}

export function subscribeStore(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function saveProfile(name, kelas = 'IX-D') {
  const cleanName = String(name || '').trim();
  const cleanKelas = String(kelas || 'IX-D').trim() || 'IX-D';
  state.profile = {
    name: cleanName,
    kelas: cleanKelas,
    savedAt: new Date().toISOString(),
  };
  if (cleanName.length > 0) {
    state.milestones.profileSaved = true;
  }
  persist();
}

export function setCurrentScreen(screenNumber) {
  const n = Math.max(1, Math.min(9, Number(screenNumber) || 1));
  state.currentScreen = n;
  if (!state.visitedScreens.includes(n)) {
    state.visitedScreens.push(n);
  }
  if (n === 2) state.milestones.guideRead = true;
  if (n === 3) state.milestones.objectivesRead = true;
  persist();
}

export function markKb1SimTested(scenarioId) {
  if (scenarioId && !state.kb1.testedScenarios.includes(scenarioId)) {
    state.kb1.testedScenarios.push(scenarioId);
  }
  state.milestones.kb1SimTested = true;
  persist();
}

export function saveKb1Quiz(score, total, answers) {
  state.kb1.quizScore = score;
  state.kb1.quizTotal = total;
  state.kb1.quizAnswers = { ...answers };
  state.milestones.kb1QuizDone = true;
  persist();
}

export function resetKb1Quiz() {
  state.kb1.quizScore = null;
  state.kb1.quizAnswers = {};
  state.milestones.kb1QuizDone = false;
  persist();
}

export function markKb2LevelSolved(levelId) {
  if (levelId && !state.kb2.solvedLevels.includes(levelId)) {
    state.kb2.solvedLevels.push(levelId);
  }
  state.milestones.kb2SimSolved = true;
  persist();
}

export function saveKb2Quiz(score, total, answers) {
  state.kb2.quizScore = score;
  state.kb2.quizTotal = total;
  state.kb2.quizAnswers = { ...answers };
  state.milestones.kb2QuizDone = true;
  persist();
}

export function resetKb2Quiz() {
  state.kb2.quizScore = null;
  state.kb2.quizAnswers = {};
  state.milestones.kb2QuizDone = false;
  persist();
}

export function markKb3CodeTested() {
  if (!state.milestones.kb3CodeTested) {
    state.milestones.kb3CodeTested = true;
    persist();
  }
}

export function markKb4TreeTested() {
  if (!state.milestones.kb4TreeTested) {
    state.milestones.kb4TreeTested = true;
    persist();
  }
}

export function saveEvalQuiz(score, total, answers) {
  state.evalQuiz.quizScore = score;
  state.evalQuiz.quizTotal = total;
  state.evalQuiz.quizAnswers = { ...answers };
  state.milestones.evalDone = true;
  persist();
}

export function resetEvalQuiz() {
  state.evalQuiz.quizScore = null;
  state.evalQuiz.quizAnswers = {};
  state.milestones.evalDone = false;
  persist();
}

/**
 * Menghitung progres belajar 0%-100% secara utuh di seluruh bab e-modul:
 * - Orientasi (Profil 5%, Petunjuk 5%, CP/TP 5%) = 15%
 * - KB 1 (Simulasi 10%, Kuis 15%) = 25%
 * - KB 2 (Simulasi 10%, Kuis 15%) = 25%
 * - KB 3 (Uji Editor Python 10%) = 10%
 * - KB 4 (Simulasi Pohon Keputusan 10%) = 10%
 * - Evaluasi Mandiri (15%) = 15%
 */
export function getProgress() {
  const m = state.milestones;
  let total = 0;
  if (m.profileSaved) total += 5;
  if (m.guideRead) total += 5;
  if (m.objectivesRead) total += 5;
  if (m.kb1SimTested) total += 10;
  if (m.kb1QuizDone) total += 15;
  if (m.kb2SimSolved) total += 10;
  if (m.kb2QuizDone) total += 15;
  if (m.kb3CodeTested) total += 10;
  if (m.kb4TreeTested) total += 10;
  if (m.evalDone) total += 15;

  const list = [
    m.profileSaved,
    m.guideRead,
    m.objectivesRead,
    m.kb1SimTested,
    m.kb1QuizDone,
    m.kb2SimSolved,
    m.kb2QuizDone,
    m.kb3CodeTested,
    m.kb4TreeTested,
    m.evalDone,
  ];

  return {
    percent: Math.min(100, total),
    completedCount: list.filter(Boolean).length,
    totalMilestones: list.length,
  };
}

export function getKbStatus(kbId) {
  if (kbId === 'kb1') {
    const { kb1SimTested, kb1QuizDone } = state.milestones;
    if (kb1SimTested && kb1QuizDone) return 'Selesai';
    if (kb1SimTested || kb1QuizDone || state.visitedScreens.includes(5)) return 'Sedang Dipelajari';
    return 'Belum Mulai';
  }
  if (kbId === 'kb2') {
    const { kb2SimSolved, kb2QuizDone } = state.milestones;
    if (kb2SimSolved && kb2QuizDone) return 'Selesai';
    if (kb2SimSolved || kb2QuizDone || state.visitedScreens.includes(6)) return 'Sedang Dipelajari';
    return 'Belum Mulai';
  }
  if (kbId === 'kb3') {
    if (state.milestones.kb3CodeTested) return 'Selesai';
    if (state.visitedScreens.includes(7)) return 'Sedang Dipelajari';
    return 'Belum Mulai';
  }
  if (kbId === 'kb4') {
    if (state.milestones.kb4TreeTested) return 'Selesai';
    if (state.visitedScreens.includes(8)) return 'Sedang Dipelajari';
    return 'Belum Mulai';
  }
  return 'Belum Mulai';
}
