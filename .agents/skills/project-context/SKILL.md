---
name: project-context
description: Panduan arsitektur (RAG Context) untuk Next.js 15, struktur database JSON, sistem keamanan Role-Based Access Control (RBAC), dan panduan animasi GSAP pada proyek website sekolah Islam ini. Baca dokumen ini jika Anda akan merombak bagian krusial aplikasi!
---

# 📚 Arsitektur & Konteks Proyek (RAG Document)

Dokumen ini berfungsi sebagai "Knowledge Base" atau konteks *Retrieval-Augmented Generation* (RAG) untuk agen AI yang bekerja di repositori ini.

## 📁 Struktur Direktori Utama
- `/app`: Direktori utama aplikasi Next.js 15 (App Router).
  - `/app/api`: Titik akhir API (*Backend endpoint*) seperti `/api/auth` dan `/api/artikel`.
  - `/app/admin`: Antarmuka **Studio CMS** berdesain *Clean Enterprise* untuk pengelola konten.
  - `/app/artikel`: Halaman publik (Front-End) untuk membaca artikel, berdesain *Cinematic*.
- `/components`: Komponen-komponen UI React.
  - `/components/sections`: Bagian layout halaman berukuran besar (misalnya: `HeroCinematic.tsx`, `TargetLulusan.tsx`).
  - `/components/ui`: Komponen kecil yang dapat digunakan ulang (tombol, tautan tirai, dll).
- `/content`: Menyimpan berkas `data.json` yang berfungsi sebagai *database statis* untuk menyimpan seluruh artikel dan *metadata* aplikasi.

## 🔐 Arsitektur Sistem RBAC (*Role-Based Access Control*)
Studio CMS ini tidak sembarangan bisa diakses. Terdapat dua hierarki peran (Role) yang dikendalikan melalui *cookies*:
1. **Publisher (admin):** Memiliki akses tertinggi tanpa batas. Bisa membuat, mengedit, mempublikasikan, dan menghapus artikel.
2. **Writer (writer):** Akses terbatas. Bisa membuat dan mengedit artikel, namun **TIDAK BISA** mempublikasikannya secara mandiri (status dipaksa terkunci menjadi 'Draft') dan **TIDAK BISA** menghapus artikel apa pun.

**Detail Implementasi Keamanan:**
- `middleware.ts`: Berjalan di Edge Network, memblokir siapa pun yang mencoba mengakses `/admin` tanpa *cookie* sesi yang sah dan melemparnya kembali ke `/admin/login`.
- `/api/auth/login`: Titik masuk pengguna yang memvalidasi *hardcoded user* dan menanam *HTTP-only cookie* bernama `tj_session` yang berisi peran pengguna.
- `/api/auth/me`: Komponen *client* (seperti `app/admin/artikel/page.tsx`) memanggil *endpoint* ini untuk mengetahui siapa pengguna yang sedang aktif dan menyembunyikan tombol UI (seperti tombol 'Hapus') jika perannya tidak memadai.

## 🎨 Sistem Desain: "Clean Enterprise" (Khusus Admin)
Semua halaman di dalam rute `app/admin` wajib mengikuti bahasa desain "Clean Enterprise".
**Kelas Tailwind Utama yang Digunakan:**
- **Latar Belakang:** `bg-[#F8F8FF]` (Ghost White) untuk kanvas dasar, `bg-white` untuk wadah kartu konten.
- **Garis Tepi:** `border-slate-200` (abu-abu sejuk yang presisi).
- **Teks Utama:** `text-slate-900` untuk judul tajam, `text-slate-500` untuk teks pendukung/metadata.
- **Interaksi Mikro:** Tombol dan kartu wajib memiliki animasi balasan saat disentuh, gunakan kelas `hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-95`.

## 💫 Panduan Animasi (Khusus Frontend)
Saat memodifikasi *section* di halaman publik, gunakan pustaka **GSAP** (GreenSock).
- Inisialisasi GSAP selalu di dalam *hook* `useEffect` pada komponen dengan penanda `'use client'`.
- Gunakan `gsap.context()` untuk memastikan animasi terbungkus dalam cakupan React (agar tidak bocor memori).
- Standar kemunculan gulir (*scroll reveal*): `y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'`.
