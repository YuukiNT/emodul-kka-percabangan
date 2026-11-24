/**
 * curriculum.js - Struktur 9 layar navigasi, CP KKA Fase D
 * (Keputusan Kepala BSKAP No. 046/H/KR/2025), serta TP KB 1 sampai KB 4.
 */

export const MODULE_META = {
  title: 'E-Modul Interaktif Percabangan',
  subtitle: 'Koding dan Kecerdasan Artifisial (KKA) Kelas IX SMP Negeri 9 Samarinda',
  shortTitle: 'E-Modul KKA IX',
  school: 'SMP Negeri 9 Samarinda',
  defaultClass: 'IX-D',
  classOptions: ['IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F', 'IX-G', 'IX-H'],
  curriculumRef: 'Keputusan Kepala BSKAP No. 046/H/KR/2025 (Fase D)',
};

export const SCREENS = [
  { id: 1, code: '01', shortTitle: 'Beranda', title: 'Beranda & Profil Belajar', group: 'Orientasi', icon: 'compass' },
  { id: 2, code: '02', shortTitle: 'Petunjuk', title: 'Petunjuk Penggunaan & Mode Luring', group: 'Orientasi', icon: 'smartphone' },
  { id: 3, code: '03', shortTitle: 'CP & TP', title: 'Capaian & Tujuan Pembelajaran', group: 'Orientasi', icon: 'target' },
  { id: 4, code: '04', shortTitle: 'Daftar Isi', title: 'Menu Materi & Progres Belajar', group: 'Orientasi', icon: 'grid' },
  { id: 5, code: '05', shortTitle: 'KB 1: Flowchart', title: 'KB 1: Logika Keputusan & Flowchart', group: 'Kegiatan Belajar', icon: 'diamond' },
  { id: 6, code: '06', shortTitle: 'KB 2: Blok', title: 'KB 2: Percabangan Blok Visual', group: 'Kegiatan Belajar', icon: 'blocks' },
  { id: 7, code: '07', shortTitle: 'KB 3: Python', title: 'KB 3: Transisi Kode Python if-elif-else', group: 'Kegiatan Belajar', icon: 'code' },
  { id: 8, code: '08', shortTitle: 'KB 4: Pohon AI', title: 'KB 4: Pohon Keputusan AI (Decision Tree)', group: 'Kegiatan Belajar', icon: 'tree' },
  { id: 9, code: '09', shortTitle: 'Evaluasi', title: 'Evaluasi Mandiri & Sertifikat', group: 'Penilaian', icon: 'award' },
];

export const KB_SUMMARY_CARDS = [
  {
    id: 'kb1',
    screenId: 5,
    code: 'KB 1',
    title: 'Konsep Dasar Logika Keputusan & Flowchart',
    duration: '35 menit',
    summary: 'Mempelajari kondisi logis Benar/Salah (Boolean), 5 simbol dasar flowchart, 6 operator perbandingan, serta simulasi alur keputusan tunggal dan majemuk.',
    deliverable: 'Simulasi Flowchart & Kuis 5 Soal',
  },
  {
    id: 'kb2',
    screenId: 6,
    code: 'KB 2',
    title: 'Percabangan Blok Visual',
    duration: '40 menit',
    summary: 'Menyusun percabangan satu kondisi (if), dua kondisi (if-else), dan lebih dari dua kondisi (if-elif-else) dengan blok puzzle serta tampilan kode Python langsung.',
    deliverable: 'Simulasi Blok Puzzle (2 Level) & Kuis 5 Soal',
  },
  {
    id: 'kb3',
    screenId: 7,
    code: 'KB 3',
    title: 'Transisi ke Kode Python (if-elif-else)',
    duration: '45 menit',
    summary: 'Menerjemahkan susunan blok visual ke sintaks Python secara luring dengan editor interaktif dan petunjuk perbaikan kesalahan berbahasa Indonesia.',
    deliverable: 'Perbandingan Blok-Python & Editor Luring',
  },
  {
    id: 'kb4',
    screenId: 8,
    code: 'KB 4',
    title: 'Pohon Keputusan AI (Decision Tree)',
    duration: '40 menit',
    summary: 'Memahami bagaimana rangkaian aturan percabangan dipakai pada Pohon Keputusan untuk menentukan prediksi berdasarkan data latih.',
    deliverable: 'Diagram Pohon Keputusan & Tabel Data Latih',
  },
];

export const CAPAIAN_PEMBELAJARAN = [
  {
    code: 'Elemen 1',
    element: 'Berpikir Komputasional (BK)',
    statement:
      'Peserta didik mampu menerapkan berpikir komputasional untuk memecahkan persoalan sehari-hari yang mengandung struktur keputusan, dengan merumuskan kondisi logis, membandingkan nilai, dan menyusun langkah pemecahan masalah secara sistematis menggunakan diagram alir (flowchart).',
  },
  {
    code: 'Elemen 2',
    element: 'Algoritma dan Pemrograman (AP)',
    statement:
      'Peserta didik mampu membaca, merancang, dan menerapkan struktur kontrol percabangan (if, if-else, if-elif-else) secara bertahap mulai dari pemrograman berbasis blok visual hingga bahasa pemrograman teks Python sederhana, serta mampu menguji dan memperbaiki kesalahan logika maupun sintaks (debugging).',
  },
  {
    code: 'Elemen 3',
    element: 'Literasi dan Etika Kecerdasan Artifisial (KA)',
    statement:
      'Peserta didik mampu memahami keterkaitan antara aturan logika percabangan dengan cara kerja model Kecerdasan Artifisial sederhana seperti Pohon Keputusan (Decision Tree), mengenali peran data latih dalam menghasilkan keputusan otomatis, serta bersikap kritis terhadap hasil prediksi.',
  },
];

export const TUJUAN_PEMBELAJARAN = [
  {
    kb: 'KB 1',
    screenId: 5,
    title: 'Konsep Dasar Logika Keputusan & Flowchart',
    items: [
      'Menjelaskan pengertian kondisi logis bernilai Benar (True) atau Salah (False) pada situasi keseharian siswa SMP.',
      'Mengidentifikasi fungsi 5 simbol dasar flowchart (Terminator, Input/Output, Proses, Keputusan, dan Panah Alur).',
      'Menggunakan 6 operator perbandingan (==, !=, >, <, >=, <=) untuk menentukan kebenaran suatu kondisi secara tepat.',
      'Menelusuri alur keputusan tunggal dan keputusan majemuk pada simulasi flowchart interaktif.',
    ],
  },
  {
    kb: 'KB 2',
    screenId: 6,
    title: 'Percabangan Blok Visual',
    items: [
      'Membedakan penggunaan struktur percabangan satu kondisi (if), dua kondisi (if-else), dan lebih dari dua kondisi (if-elif-else).',
      'Menjelaskan pentingnya urutan pemeriksaan kondisi pada percabangan bertingkat agar tidak menimbulkan kesalahan logika.',
      'Menyusun blok visual percabangan secara benar untuk menyelesaikan studi kasus nilai KKM dan predikat nilai.',
      'Membaca keterkaitan langsung antara susunan blok visual yang menjorok (indentasi) dengan bentuk kode Python.',
    ],
  },
  {
    kb: 'KB 3',
    screenId: 7,
    title: 'Transisi Kode Python (if-elif-else)',
    items: [
      'Menulis sintaks percabangan Python (if, elif, else) dengan tanda titik dua (:) dan indentasi 4 spasi yang tepat.',
      'Menjalankan dan menguji program Python percabangan secara luring serta memperbaiki kesalahan sintaks berdasarkan petunjuk error.',
    ],
  },
  {
    kb: 'KB 4',
    screenId: 8,
    title: 'Pohon Keputusan AI (Decision Tree)',
    items: [
      'Mengenali bagian-bagian Pohon Keputusan (Root Node, Internal Node, dan Leaf Node) sebagai rangkaian percabangan logis.',
      'Menelusuri cara sistem menentukan keputusan berdasarkan kombinasi atribut input dan proporsi data latih.',
    ],
  },
];
