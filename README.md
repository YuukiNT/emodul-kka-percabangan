# E-Modul Interaktif Percabangan (KKA Kelas IX SMP Negeri 9 Samarinda)

Aplikasi web progresif (PWA) bahan ajar interaktif materi Percabangan untuk Mata Pelajaran Koding dan Kecerdasan Artifisial (KKA) Kelas IX SMP Negeri 9 Samarinda.

## Fitur Utama
- Navigasi 9 layar lengkap (Beranda, Petunjuk PWA, CP & TP, Daftar Isi, KB 1 Flowchart, KB 2 Blok Visual, KB 3 Kode Python, KB 4 Pohon Keputusan, dan Evaluasi Mandiri).
- Simulasi interaktif Flowchart SVG (KB 1), simulasi blok puzzle bergigi dengan tampilan kode Python langsung (KB 2), editor kode Python luring dengan petunjuk kesalahan berbahasa Indonesia (KB 3), dan simulasi penelusuran Pohon Keputusan (KB 4).
- Kuis formatif KB 1, KB 2, latihan kode bertingkat, evaluasi akhir 10 soal, rekap skor, dan sertifikat belajar.
- Kamus 18 istilah kunci dan Buku Catatan Belajar tersimpan permanen di perangkat (IndexedDB), serta dukungan luring penuh melalui Service Worker.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Membangun versi produksi dan menjalankannya secara lokal:

```bash
npm run build
npm run preview
```

## Publikasi ke GitHub Pages atau Vercel
- **Vercel**: Import repositori, gunakan *Build Command* `npm run build` dan *Output Directory* `dist`.
- **GitHub Pages**: Jalankan `npm run build` lalu publikasikan isi folder `dist/`.
