/**
 * glossaryData.js — 18 Istilah Kunci Koding & AI ramah siswa SMP Kelas IX
 */

export const GLOSSARY_CATEGORIES = [
  'Semua',
  'Logika & Flowchart',
  'Blok & Python',
  'AI',
];

export const GLOSSARY_TERMS = [
  {
    term: 'Algoritma',
    english: 'Algorithm',
    category: 'Logika & Flowchart',
    definition: 'Urutan langkah-langkah logis yang jelas dan teratur untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.',
    example: 'Langkah menyeduh mie instan atau langkah mengecek kelulusan nilai KKM.',
  },
  {
    term: 'Percabangan',
    english: 'Branching / Conditional',
    category: 'Logika & Flowchart',
    definition: 'Struktur kontrol program yang membuat komputer memilih jalur aksi berbeda berdasarkan hasil pemeriksaan suatu kondisi.',
    example: 'Jika nilai >= 75 maka Lulus KKM, selain itu Ikuti Remedial.',
  },
  {
    term: 'Kondisi',
    english: 'Condition',
    category: 'Logika & Flowchart',
    definition: 'Pernyataan atau pertanyaan perbandingan yang diuji oleh komputer dan hanya menghasilkan dua kemungkinan: Benar (True) atau Salah (False).',
    example: 'baterai < 20 atau nilai >= 75.',
  },
  {
    term: 'Boolean',
    english: 'Boolean Value',
    category: 'Logika & Flowchart',
    definition: 'Tipe data logika yang hanya memiliki dua nilai mutlak, yaitu True (Benar) dan False (Salah). Komputer tidak mengenal jawaban "mungkin".',
    example: 'Ekspresi 80 >= 75 menghasilkan nilai Boolean True.',
  },
  {
    term: 'Flowchart',
    english: 'Diagram Alir',
    category: 'Logika & Flowchart',
    definition: 'Gambar diagram yang memakai simbol-simbol standar (oval, persegi panjang, belah ketupat, dan panah) untuk memetakan alur kerja algoritma.',
    example: 'Diagram alir penentuan predikat nilai A, B, dan C.',
  },
  {
    term: 'Terminator',
    english: 'Start / End Symbol',
    category: 'Logika & Flowchart',
    definition: 'Simbol flowchart berbentuk oval (kapsul) yang menandai titik awal (Mulai) dan titik akhir (Selesai) sebuah alur program.',
    example: 'Setiap flowchart selalu diawali oval "Mulai" dan diakhiri oval "Selesai".',
  },
  {
    term: 'Operator Perbandingan',
    english: 'Comparison Operator',
    category: 'Logika & Flowchart',
    definition: 'Tanda simbolik untuk membandingkan dua nilai, terdiri dari == (sama dengan), != (tidak sama), > (lebih besar), < (lebih kecil), >= (lebih besar atau sama), dan <= (lebih kecil atau sama).',
    example: 'nilai == 100 mengecek apakah variabel nilai persis bernilai 100.',
  },
  {
    term: 'Variabel',
    english: 'Variable',
    category: 'Blok & Python',
    definition: 'Wadah bernama di dalam memori komputer yang digunakan untuk menyimpan data (seperti angka nilai atau teks cuaca) yang isinya bisa berubah.',
    example: 'nilai = 82 menyimpan angka 82 ke dalam wadah bernama nilai.',
  },
  {
    term: 'Blok Visual',
    english: 'Visual Programming Block',
    category: 'Blok & Python',
    definition: 'Kepingan perintah berbentuk puzzle yang saling mengunci agar pemula dapat menyusun logika program tanpa takut salah ketik sintaks.',
    example: 'Blok "JIKA nilai >= 75" yang mengunci dengan blok aksi "CETAK Lulus".',
  },
  {
    term: 'Sintaks',
    english: 'Syntax',
    category: 'Blok & Python',
    definition: 'Aturan penulisan kode dalam bahasa pemrograman (seperti penempatan tanda titik dua ":" dan tanda kutip) agar komputer dapat memahami perintah.',
    example: 'Pada Python, baris if nilai >= 75: wajib diakhiri tanda titik dua (:).',
  },
  {
    term: 'Indentasi',
    english: 'Indentation',
    category: 'Blok & Python',
    definition: 'Jarak menjorok ke dalam (umumnya 4 spasi) pada baris kode di bawah if, elif, atau else untuk menandai perintah mana yang berada di dalam cabang tersebut.',
    example: 'Baris print("Lulus") ditulis menjorok 4 spasi di bawah baris if nilai >= 75:.',
  },
  {
    term: 'Else',
    english: 'Cabang Selain Itu',
    category: 'Blok & Python',
    definition: 'Cabang cadangan terakhir dalam struktur percabangan yang dijalankan secara otomatis apabila seluruh kondisi if dan elif di atasnya bernilai Salah (False).',
    example: 'else: print("Perlu Remedial") dijalankan saat nilai < 75.',
  },
  {
    term: 'Elif',
    english: 'Else If (Atau Jika)',
    category: 'Blok & Python',
    definition: 'Singkatan dari "else if" di Python. Dipakai untuk menambahkan pemeriksaan kondisi tambahan ketika ada lebih dari dua kemungkinan hasil.',
    example: 'elif nilai >= 75: diperiksa hanya jika kondisi if nilai >= 90: bernilai False.',
  },
  {
    term: 'Debugging',
    english: 'Pelacakan Kesalahan',
    category: 'Blok & Python',
    definition: 'Proses mencari, memahami, dan memperbaiki kesalahan (bug) pada program, baik kesalahan aturan tulis (sintaks) maupun kesalahan alur logika.',
    example: 'Memperbaiki urutan pengecekan >= 75 dan >= 90 yang terbalik.',
  },
  {
    term: 'Decision Tree',
    english: 'Pohon Keputusan',
    category: 'AI',
    definition: 'Model Kecerdasan Artifisial berbentuk struktur bercabang seperti pohon terbalik yang mengambil keputusan dengan mengajukan serangkaian pertanyaan kondisi secara bertahap.',
    example: 'Pohon keputusan untuk memprediksi apakah pelajaran olahraga dilakukan di lapangan atau di kelas.',
  },
  {
    term: 'Root Node',
    english: 'Simpul Akar',
    category: 'AI',
    definition: 'Simpul paling atas pada Pohon Keputusan yang menjadi pertanyaan kondisi pertama untuk memisahkan seluruh data.',
    example: 'Pertanyaan awal "Bagaimana Cuaca hari ini?" berada di Root Node.',
  },
  {
    term: 'Internal Node',
    english: 'Simpul Cabang',
    category: 'AI',
    definition: 'Simpul di bagian tengah Pohon Keputusan yang berisi pertanyaan lanjutan setelah jawaban dari simpul sebelumnya belum cukup untuk mengambil keputusan akhir.',
    example: 'Setelah Cuaca = Cerah, Internal Node menanyakan "Bagaimana kecepatan Angin?".',
  },
  {
    term: 'Leaf Node',
    english: 'Simpul Daun',
    category: 'AI',
    definition: 'Simpul paling ujung pada Pohon Keputusan yang tidak bercabang lagi karena sudah memuat hasil keputusan atau prediksi akhir.',
    example: 'Keputusan akhir "Olahraga di Lapangan" atau "Kegiatan di Kelas".',
  },
];
