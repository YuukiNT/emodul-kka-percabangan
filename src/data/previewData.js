/**
 * previewData.js - Data materi & latihan untuk Layar 7 (KB 3 Python),
 * Layar 8 (KB 4 Pohon Keputusan AI), dan Layar 9 (Evaluasi Mandiri 10 Soal).
 */

export const KB3_PREVIEW_DATA = {
  sampleCode: `nilai = 84

if nilai >= 90:
    print("Predikat A (Sangat Baik)")
elif nilai >= 75:
    print("Predikat B (Baik - Tuntas KKM)")
else:
    print("Predikat C (Perlu Bimbingan)")`,
  sampleOutput: 'Predikat B (Baik - Tuntas KKM)',
  errorHintsPreview: [
    {
      code: 'SyntaxError',
      title: 'Lupa Tanda Titik Dua (:) di Akhir Baris Kondisi',
      cause: 'Menulis "if nilai >= 75" tanpa menutup baris dengan titik dua (:).',
      fix: 'Tambahkan tanda : di ujung baris -> if nilai >= 75:',
    },
    {
      code: 'IndentationError',
      title: 'Jarak Spasi (Indentasi) Tidak Sejajar',
      cause: 'Baris print(...) ditulis rata kiri sejajar dengan if, bukan menjorok 4 spasi.',
      fix: 'Tambahkan 4 spasi atau tekan Tab sebelum perintah di dalam cabang if/elif/else.',
    },
  ],
};

export const KB4_PREVIEW_DATA = {
  anatomy: [
    {
      name: 'Root Node (Simpul Akar)',
      color: 'cobalt',
      desc: 'Pertanyaan pertama di puncak pohon yang memisahkan data latih paling awal, misalnya "Bagaimana Cuaca hari ini?".',
    },
    {
      name: 'Internal Node (Simpul Cabang)',
      color: 'amber',
      desc: 'Pertanyaan lanjutan jika satu atribut belum cukup menentukan hasil, misalnya "Bagaimana kecepatan Angin?".',
    },
    {
      name: 'Leaf Node (Simpul Daun)',
      color: 'emerald',
      desc: 'Ujung cabang yang sudah berisi keputusan akhir, misalnya "Olahraga di Lapangan" atau "Kegiatan di Kelas".',
    },
  ],
  trainingDataset: [
    { no: 1, cuaca: 'Cerah', suhu: 'Hangat', angin: 'Lemah', keputusan: 'Lapangan' },
    { no: 2, cuaca: 'Cerah', suhu: 'Panas', angin: 'Lemah', keputusan: 'Lapangan' },
    { no: 3, cuaca: 'Cerah', suhu: 'Panas', angin: 'Kuat', keputusan: 'Kelas' },
    { no: 4, cuaca: 'Berawan', suhu: 'Sejuk', angin: 'Lemah', keputusan: 'Lapangan' },
    { no: 5, cuaca: 'Berawan', suhu: 'Hangat', angin: 'Kuat', keputusan: 'Lapangan' },
    { no: 6, cuaca: 'Hujan', suhu: 'Sejuk', angin: 'Lemah', keputusan: 'Kelas' },
    { no: 7, cuaca: 'Hujan', suhu: 'Sejuk', angin: 'Kuat', keputusan: 'Kelas' },
    { no: 8, cuaca: 'Cerah', suhu: 'Sejuk', angin: 'Lemah', keputusan: 'Lapangan' },
  ],
};

export const SCREEN9_PREVIEW_DATA = {
  codingLevels: [
    {
      id: 'lvl1',
      label: 'Level 1: Dasar (if tunggal)',
      title: 'Pengingat Baterai HP Rendah',
      prompt: 'Coba ubah nilai baterai (misalnya 15 atau 60), lalu tekan Jalankan Kode untuk melihat kapan pesan pengingat muncul.',
      starter: `baterai = 15\n\nif baterai < 20:\n    print("Isi daya sekarang")`,
    },
    {
      id: 'lvl2',
      label: 'Level 2: Menengah (if-else)',
      title: 'Cek Ketuntasan Nilai KKM',
      prompt: 'Uji angka di bawah 75, tepat 75, dan di atas 75 pada program if-else berikut.',
      starter: `nilai = 72\n\nif nilai >= 75:\n    print("Lulus KKM")\nelse:\n    print("Perlu Remedial")`,
    },
    {
      id: 'lvl3',
      label: 'Level 3: Tantangan (if-elif-else)',
      title: 'Sistem Diskon Kantin SMPN 9',
      prompt: 'Uji nominal belanja berbeda (misalnya 30000, 18000, dan 9000) untuk memeriksa setiap cabang diskon.',
      starter: `belanja = 18000\n\nif belanja >= 25000:\n    print("Diskon 15%")\nelif belanja >= 15000:\n    print("Diskon 5%")\nelse:\n    print("Harga Normal")`,
    },
  ],
  finalQuizQuestions: [
    {
      id: 'ev_q1',
      level: 'KB 1: Kondisi Boolean',
      question: 'Tipe nilai logika yang hanya memiliki dua kemungkinan hasil, yaitu Benar (True) dan Salah (False), disebut...',
      options: ['Integer', 'Boolean', 'Flowline', 'Indentasi'],
      correctIndex: 1,
      explanation: 'Boolean adalah tipe data logika yang hanya bernilai True atau False.',
    },
    {
      id: 'ev_q2',
      level: 'KB 1: Simbol Flowchart',
      question: 'Simbol berbentuk oval pada awal dan akhir diagram alir (flowchart) disebut...',
      options: ['Proses', 'Keputusan', 'Terminator', 'Input/Output'],
      correctIndex: 2,
      explanation: 'Terminator (oval) digunakan untuk menandai titik Mulai dan Selesai.',
    },
    {
      id: 'ev_q3',
      level: 'KB 1: Operator Perbandingan',
      question: 'Jika nilai = 75, ekspresi perbandingan manakah yang menghasilkan nilai True?',
      options: ['nilai > 75', 'nilai < 75', 'nilai != 75', 'nilai >= 75'],
      correctIndex: 3,
      explanation: 'Operator >= menyertakan nilai batas sehingga 75 >= 75 bernilai True.',
    },
    {
      id: 'ev_q4',
      level: 'KB 2: Struktur if-else',
      question: 'Struktur percabangan yang tepat untuk menentukan tepat dua hasil berlawanan (Lulus atau Remedial) adalah...',
      options: ['if tunggal', 'if - else', 'if - elif tanpa else', 'print berurutan'],
      correctIndex: 1,
      explanation: 'Struktur if-else menjamin salah satu dari dua cabang pasti dijalankan.',
    },
    {
      id: 'ev_q5',
      level: 'KB 2: Urutan Kondisi',
      question: 'Pada aturan predikat nilai (>= 90 A, >= 75 B, selainnya C), syarat manakah yang wajib dicek paling awal?',
      options: ['nilai >= 75', 'nilai >= 90', 'nilai < 75', 'Boleh acak urutannya'],
      correctIndex: 1,
      explanation: 'Batas tertinggi (>= 90) harus diperiksa lebih dulu agar nilai 95 tidak terjebak di syarat >= 75.',
    },
    {
      id: 'ev_q6',
      level: 'KB 3: Sintaks Python',
      question: 'Tanda baca yang wajib ditulis di ujung baris if, elif, dan else pada bahasa Python adalah...',
      options: ['Titik koma (;)', 'Tanda seru (!)', 'Titik dua (:)', 'Tanda tanya (?)'],
      correctIndex: 2,
      explanation: 'Python mewajibkan tanda titik dua (:) di akhir setiap baris if, elif, dan else.',
    },
    {
      id: 'ev_q7',
      level: 'KB 3: Debugging Indentasi',
      question: 'Jika baris print("Lulus") ditulis sejajar rata kiri dengan if nilai >= 75:, jenis kesalahan yang muncul di Python adalah...',
      options: ['IndentationError', 'BooleanError', 'FlowchartError', 'ZeroError'],
      correctIndex: 0,
      explanation: 'Perintah di dalam cabang if wajib menjorok (indentasi 4 spasi), jika tidak akan muncul IndentationError.',
    },
    {
      id: 'ev_q8',
      level: 'KB 3: Menelusuri Output',
      question: 'Perhatikan kode: uang = 12000; if uang >= 20000: print("Paket A"); elif uang >= 10000: print("Paket B"); else: print("Camilan"). Output yang tercetak adalah...',
      options: ['Paket A', 'Paket B', 'Camilan', 'Paket A dan Paket B'],
      correctIndex: 1,
      explanation: '12000 >= 20000 bernilai False, lalu 12000 >= 10000 bernilai True sehingga mencetak "Paket B".',
    },
    {
      id: 'ev_q9',
      level: 'KB 4: Anatomi Pohon Keputusan',
      question: 'Simpul paling ujung pada Pohon Keputusan (Decision Tree) yang memuat hasil keputusan akhir disebut...',
      options: ['Root Node', 'Internal Node', 'Leaf Node', 'Flow Node'],
      correctIndex: 2,
      explanation: 'Leaf Node (simpul daun) adalah ujung cabang yang langsung menyimpan keputusan akhir.',
    },
    {
      id: 'ev_q10',
      level: 'KB 4: Prediksi Data Latih',
      question: 'Berdasarkan Pohon Keputusan olahraga sekolah, jika Cuaca = Cerah dan Angin = Lemah, keputusan yang dihasilkan adalah...',
      options: ['Kegiatan di Kelas', 'Olahraga di Lapangan', 'Libur Sekolah', 'Menunggu Hujan'],
      correctIndex: 1,
      explanation: 'Cabang Cuaca = Cerah lalu Angin = Lemah mengarah ke Leaf Node "Olahraga di Lapangan".',
    },
  ],
};
