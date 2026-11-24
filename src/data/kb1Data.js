/**
 * kb1Data.js — Materi utuh (self-contained & stand-alone) KB 1:
 * Konsep Dasar Logika Keputusan & Diagram Alir (Flowchart)
 */

export const KB1_EVERYDAY_EXAMPLES = [
  {
    context: 'Ketuntasan Nilai KKM',
    condition: 'Apakah nilai >= 75?',
    trueAction: 'Status: Lulus KKM (Tuntas)',
    falseAction: 'Status: Ikuti Remedial',
  },
  {
    context: 'Baterai Smartphone',
    condition: 'Apakah baterai < 20%?',
    trueAction: 'Munculkan notifikasi "Segera colok charger"',
    falseAction: 'Lanjutkan penggunaan normal',
  },
  {
    context: 'Berangkat ke SMPN 9 Samarinda',
    condition: 'Apakah di luar sedang hujan?',
    trueAction: 'Pakai jas hujan atau bawa payung',
    falseAction: 'Berangkat langsung tanpa jas hujan',
  },
  {
    context: 'Jajan di Kantin Sekolah',
    condition: 'Apakah uang >= Rp10.000?',
    trueAction: 'Bisa beli paket nasi + minuman',
    falseAction: 'Beli camilan ringan sesuai sisa uang',
  },
];

export const KB1_FLOWCHART_SYMBOLS = [
  {
    name: 'Terminator (Oval)',
    role: 'Penanda Awal & Akhir',
    desc: 'Menunjukkan titik dimulainya (Mulai) dan berhentinya (Selesai) suatu alur algoritma. Setiap diagram alir wajib diawali dan diakhiri simbol ini.',
    example: 'Mulai / Selesai',
    svg: `<svg viewBox="0 0 110 46" class="w-24 h-10" aria-hidden="true">
      <rect x="6" y="6" width="98" height="34" rx="17" fill="var(--color-canvas)" stroke="var(--color-ink)" stroke-width="2"/>
      <text x="55" y="27" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="var(--color-ink)">Mulai</text>
    </svg>`,
  },
  {
    name: 'Input / Output (Jajar Genjang)',
    role: 'Menerima Data & Menampilkan Hasil',
    desc: 'Digunakan saat komputer menerima masukan data dari pengguna (misalnya angka nilai) atau saat mencetak hasil akhir ke layar.',
    example: 'Input: nilai / Tampilkan Hasil',
    svg: `<svg viewBox="0 0 110 46" class="w-24 h-10" aria-hidden="true">
      <polygon points="18,6 104,6 92,40 6,40" fill="var(--color-surface)" stroke="var(--color-ink)" stroke-width="2" stroke-linejoin="round"/>
      <text x="55" y="27" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="600" fill="var(--color-ink)">Input</text>
    </svg>`,
  },
  {
    name: 'Proses (Persegi Panjang)',
    role: 'Menjalankan Aksi atau Perhitungan',
    desc: 'Menyatakan tindakan, pengolahan data, atau penetapan status yang dikerjakan komputer pada jalur tertentu.',
    example: 'status = "Lulus KKM"',
    svg: `<svg viewBox="0 0 110 46" class="w-24 h-10" aria-hidden="true">
      <rect x="8" y="6" width="94" height="34" rx="4" fill="var(--color-emerald-soft)" stroke="var(--color-emerald)" stroke-width="2"/>
      <text x="55" y="27" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="600" fill="var(--color-ink)">Proses</text>
    </svg>`,
  },
  {
    name: 'Keputusan (Belah Ketupat)',
    role: 'Menguji Kondisi Logis (Ya / Tidak)',
    desc: 'Simbol inti pada materi percabangan. Di dalamnya tertulis syarat/kondisi yang menghasilkan dua jalur keluar: YA (True) dan TIDAK (False).',
    example: 'nilai >= 75 ?',
    svg: `<svg viewBox="0 0 110 52" class="w-24 h-11" aria-hidden="true">
      <polygon points="55,4 104,26 55,48 6,26" fill="var(--color-cobalt-soft)" stroke="var(--color-cobalt)" stroke-width="2" stroke-linejoin="round"/>
      <text x="55" y="29" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="var(--color-cobalt)">Kondisi?</text>
    </svg>`,
  },
  {
    name: 'Panah Alur (Flowline)',
    role: 'Penunjuk Arah Urutan Langkah',
    desc: 'Garis berujung panah yang menghubungkan satu simbol ke simbol berikutnya agar pembaca tahu arah jalannya program.',
    example: 'Arah jalur YA / TIDAK',
    svg: `<svg viewBox="0 0 110 46" class="w-24 h-10" aria-hidden="true">
      <line x1="12" y1="23" x2="90" y2="23" stroke="var(--color-ink)" stroke-width="2.2" stroke-linecap="round"/>
      <polyline points="82,15 94,23 82,31" fill="none" stroke="var(--color-ink)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
];

export const KB1_OPERATORS = [
  {
    symbol: '==',
    name: 'Sama dengan',
    meaning: 'Memeriksa apakah kedua nilai persis sama',
    example: 'nilai == 100  (jika nilai = 100)',
    result: true,
    note: 'Hati-hati: dua tanda sama dengan (==), bukan satu (=).',
  },
  {
    symbol: '!=',
    name: 'Tidak sama dengan',
    meaning: 'Memeriksa apakah kedua nilai berbeda',
    example: 'uang != 0  (jika uang = 5000)',
    result: true,
    note: 'Tanda seru (!) berarti "tidak" dalam banyak bahasa koding.',
  },
  {
    symbol: '>',
    name: 'Lebih besar dari',
    meaning: 'Benar hanya jika sisi kiri murni lebih besar (batas tidak ikut)',
    example: '75 > 75',
    result: false,
    note: '75 tidak lebih besar dari 75, jadi hasilnya False.',
  },
  {
    symbol: '<',
    name: 'Lebih kecil dari',
    meaning: 'Benar hanya jika sisi kiri murni lebih kecil',
    example: 'baterai < 20  (jika baterai = 15)',
    result: true,
    note: 'Cocok untuk peringatan baterai lemah di bawah 20%.',
  },
  {
    symbol: '>=',
    name: 'Lebih besar atau sama dengan',
    meaning: 'Benar jika sisi kiri lebih besar ATAU persis sama dengan batas',
    example: 'nilai >= 75  (jika nilai = 75)',
    result: true,
    note: 'Dipakai untuk KKM karena nilai pas 75 sudah dinyatakan tuntas.',
  },
  {
    symbol: '<=',
    name: 'Lebih kecil atau sama dengan',
    meaning: 'Benar jika sisi kiri lebih kecil ATAU persis sama dengan batas',
    example: 'harga <= 10000  (jika harga = 12000)',
    result: false,
    note: '12000 melebihi 10000, maka hasilnya False.',
  },
];

export const KB1_QUIZ = [
  {
    id: 'kb1_q1',
    level: 'Identifikasi Kondisi',
    question: 'Di bawah ini, pernyataan manakah yang merupakan contoh kondisi logis (Boolean) yang dapat diuji langsung oleh komputer?',
    options: [
      'Tolong buatkan gambar yang agak bagus.',
      'Apakah sisa baterai HP < 20?',
      'Mungkin nanti sore cuaca cukup nyaman.',
      'Berapa jumlah siswa di kelas IX-D?',
    ],
    correctIndex: 1,
    explanation:
      'Kondisi logis harus dapat dijawab tegas dengan Benar (True) atau Salah (False). "Apakah sisa baterai HP < 20?" menghasilkan True atau False, sedangkan pertanyaan "berapa" atau kata "agak/mungkin" tidak bernilai Boolean.',
  },
  {
    id: 'kb1_q2',
    level: 'Membaca Simbol Flowchart',
    question: 'Pada diagram alir (flowchart), simbol yang digunakan untuk menuliskan pertanyaan pengujian syarat seperti "nilai >= 75?" adalah...',
    options: [
      'Oval (Terminator)',
      'Persegi Panjang (Proses)',
      'Belah Ketupat (Keputusan)',
      'Jajar Genjang (Input/Output)',
    ],
    correctIndex: 2,
    explanation:
      'Simbol Belah Ketupat (Decision) khusus dipakai untuk menguji kondisi dan selalu membagi alur menjadi cabang YA (True) dan TIDAK (False).',
  },
  {
    id: 'kb1_q3',
    level: 'Operator Perbandingan',
    question: 'Raka mendapatkan nilai ulangan KKA tepat 75, sedangkan batas KKM adalah 75. Jika komputer menguji kondisi "nilai >= 75" dan "nilai > 75", hasil keduanya berturut-turut adalah...',
    options: [
      'True dan True',
      'True dan False',
      'False dan True',
      'False dan False',
    ],
    correctIndex: 1,
    explanation:
      'Operator >= mengikutsertakan nilai batas, sehingga 75 >= 75 bernilai True. Sebaliknya, operator > mengharuskan nilai murni lebih besar, sehingga 75 > 75 bernilai False.',
  },
  {
    id: 'kb1_q4',
    level: 'Operator == vs =',
    question: 'Mengapa dalam pemrograman kita memakai tanda "==" saat membandingkan dua nilai, bukan tanda "=" saja?',
    options: [
      'Karena tanda "=" sudah dipakai untuk menyimpan/memberi nilai ke variabel, sedangkan "==" untuk membandingkan kesamaan.',
      'Karena tanda "==" hanya boleh dipakai untuk angka di atas 100.',
      'Karena tanda "=" tidak ada pada keyboard komputer lab.',
      'Karena tanda "==" berarti "tidak sama dengan".',
    ],
    correctIndex: 0,
    explanation:
      'Satu tanda sama dengan (=) adalah operator penugasan (contoh: nilai = 80), sedangkan dua tanda sama dengan (==) membandingkan apakah kiri dan kanan sama nilainya.',
  },
  {
    id: 'kb1_q5',
    level: 'Menelusuri Output Flowchart',
    question: 'Sebuah flowchart majemuk mengecek kondisi pertama "nilai >= 90?" (jika YA -> Predikat A). Jika TIDAK, dilanjutkan ke kondisi kedua "nilai >= 75?" (jika YA -> Predikat B, jika TIDAK -> Predikat C). Jika input nilai adalah 74, output yang keluar adalah...',
    options: [
      'Predikat A',
      'Predikat B',
      'Predikat C',
      'Tidak ada output yang keluar',
    ],
    correctIndex: 2,
    explanation:
      'Untuk nilai = 74: cek pertama 74 >= 90 bernilai False (lanjut ke jalur TIDAK). Cek kedua 74 >= 75 juga bernilai False, maka alur masuk ke jalur TIDAK terakhir dan menghasilkan "Predikat C".',
  },
];
