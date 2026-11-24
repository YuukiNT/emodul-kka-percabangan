/**
 * kb2Data.js - Materi KB 2: Percabangan Blok Visual, 2 level puzzle, dan kuis 5 soal.
 */

export const KB2_STRUCTURES = [
  {
    id: 'if-single',
    label: 'Struktur 1',
    title: 'Percabangan Satu Kondisi (if tunggal)',
    when: 'Dipakai saat kita hanya perlu menjalankan aksi tambahan jika syarat terpenuhi. Bila syarat tidak terpenuhi, program cukup melewatinya tanpa melakukan apa-apa.',
    context: 'Contoh keseharian: Notifikasi pengingat baterai HP lemah (< 20%).',
    blocks: [
      { kind: 'if', indent: 0, text: 'JIKA  baterai < 20  :' },
      { kind: 'action-true', indent: 1, text: 'TAMPILKAN  "Baterai lemah! Segera isi daya."' },
    ],
    trace: 'Jika baterai = 14, pesan muncul. Jika baterai = 68, tidak ada notifikasi yang muncul.',
  },
  {
    id: 'if-else',
    label: 'Struktur 2',
    title: 'Percabangan Dua Kondisi (if - else)',
    when: 'Dipakai saat ada tepat dua pilihan yang saling berlawanan. Salah satu cabang pasti dijalankan, tidak mungkin keduanya berjalan bersamaan atau keduanya dilewati.',
    context: 'Contoh keseharian: Penentuan kelulusan KKM nilai ulangan (batas 75).',
    blocks: [
      { kind: 'if', indent: 0, text: 'JIKA  nilai >= 75  :' },
      { kind: 'action-true', indent: 1, text: 'TAMPILKAN  "Lulus KKM (Tuntas)"' },
      { kind: 'else', indent: 0, text: 'SELAIN ITU  :' },
      { kind: 'action-false', indent: 1, text: 'TAMPILKAN  "Ikuti Remedial"' },
    ],
    trace: 'Jika nilai = 80, jalur JIKA berjalan ("Lulus KKM"). Jika nilai = 65, jalur SELAIN ITU berjalan ("Ikuti Remedial").',
  },
  {
    id: 'if-elif-else',
    label: 'Struktur 3',
    title: 'Percabangan Lebih dari Dua Kondisi (if - elif - else)',
    when: 'Dipakai saat pilihan hasil berjumlah tiga atau lebih. Komputer mengecek syarat satu per satu dari atas ke bawah, lalu langsung berhenti pada cabang pertama yang bernilai Benar.',
    context: 'Contoh keseharian: Kategori predikat nilai A, B, C atau diskon belanja di kantin.',
    blocks: [
      { kind: 'if', indent: 0, text: 'JIKA  nilai >= 90  :' },
      { kind: 'action-true', indent: 1, text: 'TAMPILKAN  "Predikat A (Sangat Baik)"' },
      { kind: 'elif', indent: 0, text: 'ATAU JIKA  nilai >= 75  :' },
      { kind: 'action-amber', indent: 1, text: 'TAMPILKAN  "Predikat B (Baik)"' },
      { kind: 'else', indent: 0, text: 'SELAIN ITU  :' },
      { kind: 'action-false', indent: 1, text: 'TAMPILKAN  "Predikat C (Perlu Bimbingan)"' },
    ],
    trace: 'Jika nilai = 92, berhenti di Predikat A. Jika nilai = 81, melewati A lalu masuk Predikat B. Jika nilai = 60, masuk Predikat C.',
  },
];

export const KB2_PUZZLE_LEVELS = [
  {
    id: 'level1',
    shortName: 'Level 1',
    badge: 'Level 1: Percabangan 2 Kondisi (if-else)',
    title: 'Tantangan KKM Kelas IX-D',
    instruction:
      'Susun 4 keping blok puzzle berikut agar program memeriksa apakah nilai >= 75. Jika Benar tampilkan "Lulus KKM", dan jika Salah tampilkan "Perlu Remedial".',
    testVarName: 'nilai',
    defaultTestValue: 82,
    testPresets: [60, 75, 88],
    slotHints: [
      { index: 0, indent: false, label: 'Slot 1: Blok Kondisi Utama (if)' },
      { index: 1, indent: true, label: 'Slot 2: Blok Aksi Jalur Benar (menjorok 4 spasi)' },
      { index: 2, indent: false, label: 'Slot 3: Blok Cabang Lainnya (else)' },
      { index: 3, indent: true, label: 'Slot 4: Blok Aksi Jalur Salah (menjorok 4 spasi)' },
    ],
    solutionOrder: ['l1_if', 'l1_act_true', 'l1_else', 'l1_act_false'],
    initialTrayOrder: ['l1_act_false', 'l1_if', 'l1_else', 'l1_act_true'],
    blocks: {
      l1_if: {
        id: 'l1_if',
        kind: 'if',
        indent: 0,
        badge: 'IF',
        label: 'JIKA  nilai >= 75 :',
        pythonLine: 'if nilai >= 75:',
        pythonColor: 'cobalt',
      },
      l1_act_true: {
        id: 'l1_act_true',
        kind: 'action-true',
        indent: 1,
        badge: 'AKSI',
        label: 'CETAK  "Lulus KKM"',
        pythonLine: '    print("Lulus KKM")',
        pythonColor: 'emerald',
      },
      l1_else: {
        id: 'l1_else',
        kind: 'else',
        indent: 0,
        badge: 'ELSE',
        label: 'SELAIN ITU :',
        pythonLine: 'else:',
        pythonColor: 'coral',
      },
      l1_act_false: {
        id: 'l1_act_false',
        kind: 'action-false',
        indent: 1,
        badge: 'AKSI',
        label: 'CETAK  "Perlu Remedial"',
        pythonLine: '    print("Perlu Remedial")',
        pythonColor: 'coral',
      },
    },
    evaluateOutput(val) {
      return val >= 75
        ? { branch: 'if', text: 'Lulus KKM', tone: 'emerald', reason: `${val} >= 75 bernilai True, jadi cabang if yang dijalankan.` }
        : { branch: 'else', text: 'Perlu Remedial', tone: 'coral', reason: `${val} >= 75 bernilai False, jadi program beralih ke cabang else.` };
    },
  },
  {
    id: 'level2',
    shortName: 'Level 2',
    badge: 'Level 2: Percabangan >2 Kondisi (if-elif-else)',
    title: 'Tantangan Predikat Nilai A / B / C',
    instruction:
      'Susun 6 keping blok secara tepat untuk menentukan Predikat A (nilai >= 90), Predikat B (nilai >= 75), dan Predikat C (selain itu). Ingat aturan urutan kondisi!',
    testVarName: 'nilai',
    defaultTestValue: 86,
    testPresets: [62, 78, 94],
    slotHints: [
      { index: 0, indent: false, label: 'Slot 1: Kondisi Pertama (tertinggi: if)' },
      { index: 1, indent: true, label: 'Slot 2: Aksi Predikat A (menjorok 4 spasi)' },
      { index: 2, indent: false, label: 'Slot 3: Kondisi Kedua (elif)' },
      { index: 3, indent: true, label: 'Slot 4: Aksi Predikat B (menjorok 4 spasi)' },
      { index: 4, indent: false, label: 'Slot 5: Cabang Terakhir (else)' },
      { index: 5, indent: true, label: 'Slot 6: Aksi Predikat C (menjorok 4 spasi)' },
    ],
    solutionOrder: ['l2_if', 'l2_act_a', 'l2_elif', 'l2_act_b', 'l2_else', 'l2_act_c'],
    initialTrayOrder: ['l2_elif', 'l2_act_c', 'l2_act_a', 'l2_if', 'l2_act_b', 'l2_else'],
    blocks: {
      l2_if: {
        id: 'l2_if',
        kind: 'if',
        indent: 0,
        badge: 'IF',
        label: 'JIKA  nilai >= 90 :',
        pythonLine: 'if nilai >= 90:',
        pythonColor: 'cobalt',
      },
      l2_act_a: {
        id: 'l2_act_a',
        kind: 'action-true',
        indent: 1,
        badge: 'AKSI',
        label: 'CETAK  "Predikat A"',
        pythonLine: '    print("Predikat A")',
        pythonColor: 'emerald',
      },
      l2_elif: {
        id: 'l2_elif',
        kind: 'elif',
        indent: 0,
        badge: 'ELIF',
        label: 'ATAU JIKA  nilai >= 75 :',
        pythonLine: 'elif nilai >= 75:',
        pythonColor: 'amber',
      },
      l2_act_b: {
        id: 'l2_act_b',
        kind: 'action-amber',
        indent: 1,
        badge: 'AKSI',
        label: 'CETAK  "Predikat B"',
        pythonLine: '    print("Predikat B")',
        pythonColor: 'amber',
      },
      l2_else: {
        id: 'l2_else',
        kind: 'else',
        indent: 0,
        badge: 'ELSE',
        label: 'SELAIN ITU :',
        pythonLine: 'else:',
        pythonColor: 'coral',
      },
      l2_act_c: {
        id: 'l2_act_c',
        kind: 'action-false',
        indent: 1,
        badge: 'AKSI',
        label: 'CETAK  "Predikat C"',
        pythonLine: '    print("Predikat C")',
        pythonColor: 'coral',
      },
    },
    evaluateOutput(val) {
      if (val >= 90) {
        return { branch: 'if', text: 'Predikat A', tone: 'emerald', reason: `${val} >= 90 bernilai True, sehingga langsung berhenti di cabang if.` };
      }
      if (val >= 75) {
        return { branch: 'elif', text: 'Predikat B', tone: 'amber', reason: `${val} >= 90 False, lalu ${val} >= 75 True, sehingga cabang elif dijalankan.` };
      }
      return { branch: 'else', text: 'Predikat C', tone: 'coral', reason: `${val} < 75 sehingga if dan elif bernilai False, lalu masuk ke cabang else.` };
    },
  },
];

export const KB2_QUIZ = [
  {
    id: 'kb2_q1',
    level: 'Struktur Blok',
    question: 'Kapan kita sebaiknya menggunakan struktur "if tunggal" dibandingkan "if-else"?',
    options: [
      'Ketika ada 3 kategori jawaban berbeda (misalnya A, B, dan C).',
      'Ketika kita hanya ingin menjalankan aksi bila syarat terpenuhi, dan tidak melakukan apa-apa bila syarat salah.',
      'Ketika kita ingin semua cabang selalu dijalankan bersama-sama.',
      'Ketika program tidak memiliki syarat perbandingan sama sekali.',
    ],
    correctIndex: 1,
    explanation:
      'Struktur if tunggal cocok untuk aksi opsional seperti notifikasi baterai < 20%. Jika syarat tidak terpenuhi, tidak ada aksi alternatif yang perlu dijalankan.',
  },
  {
    id: 'kb2_q2',
    level: 'Peran Cabang elif',
    question: 'Dalam percabangan bertingkat (if - elif - else), kapan kondisi pada blok "ATAU JIKA (elif)" akan diperiksa oleh komputer?',
    options: [
      'Selalu diperiksa walaupun kondisi if di atasnya sudah bernilai Benar.',
      'Diperiksa terlebih dahulu sebelum blok if.',
      'Hanya diperiksa apabila kondisi if di atasnya bernilai Salah (False).',
      'Hanya diperiksa jika pengguna menekan tombol Reset.',
    ],
    correctIndex: 2,
    explanation:
      'Komputer membaca dari atas ke bawah. Jika if sudah bernilai True, blok elif dan else langsung dilewati. Elif baru diuji jika if sebelumnya False.',
  },
  {
    id: 'kb2_q3',
    level: 'Urutan Kondisi',
    question: 'Seorang siswa menyusun blok dengan urutan terbalik: baris 1 "JIKA nilai >= 75 -> Predikat B", lalu baris 2 "ATAU JIKA nilai >= 90 -> Predikat A". Jika nilai = 95, apa yang akan ditampilkan program?',
    options: [
      'Predikat A',
      'Predikat B',
      'Predikat A dan Predikat B sekaligus',
      'Program langsung error dan tidak bisa berjalan',
    ],
    correctIndex: 1,
    explanation:
      'Karena 95 >= 75 sudah bernilai True pada pemeriksaan pertama, komputer langsung mencetak "Predikat B" dan berhenti, tidak pernah mencapai syarat >= 90. Oleh karena itu syarat paling tinggi (>= 90) harus diletakkan di urutan atas.',
  },
  {
    id: 'kb2_q4',
    level: 'Indentasi Blok ke Python',
    question: 'Pada simulasi penyusunan blok, blok aksi CETAK terlihat menjorok ke kanan di bawah blok JIKA/SELAIN ITU. Di kode Python, posisi menjorok ini disebut...',
    options: [
      'Terminator',
      'Indentasi (4 spasi)',
      'Variabel',
      'Operator Perbandingan',
    ],
    correctIndex: 1,
    explanation:
      'Indentasi (menjorok 4 spasi) memberi tahu Python perintah mana yang berada di dalam cabang if, elif, atau else di atasnya.',
  },
  {
    id: 'kb2_q5',
    level: 'Mencocokkan Blok dengan Output',
    question: 'Perhatikan susunan blok kantin berikut: JIKA belanja >= 20000 -> CETAK "Diskon Rp3.000"; ATAU JIKA belanja >= 10000 -> CETAK "Diskon Rp1.000"; SELAIN ITU -> CETAK "Harga Normal". Jika Dira berbelanja Rp15.000, hasil yang muncul adalah...',
    options: [
      'Diskon Rp3.000',
      'Diskon Rp1.000',
      'Harga Normal',
      'Diskon Rp4.000',
    ],
    correctIndex: 1,
    explanation:
      '15000 >= 20000 bernilai False lalu lanjut ke elif. 15000 >= 10000 bernilai True sehingga mencetak "Diskon Rp1.000" lalu selesai.',
  },
];
