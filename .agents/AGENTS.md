# 🏫 Aturan Utama: Premium Islamic School Website

Selamat datang, Agen AI! Anda sedang bekerja pada proyek **Premium Islamic School Website**. Proyek ini sangat mengedepankan kualitas visual *(Awwwards-level)* dan fungsionalitas korporat *(Enterprise)*. Harap patuhi aturan berikut dengan sangat ketat:

## 1. Dualitas Filosofi Desain (KRITIKAL)
Proyek ini terbagi menjadi dua dunia visual yang tidak boleh dicampuradukkan:
- **Public Frontend (`app/(publik)/*`, komponen section dll):** Wajib bergaya sinematik, dramatis, dan emosional. Gunakan warna `charcoal-ink` (hitam pekat), `accent-gold` (emas), dan `primary` (hijau sage gelap). Wajib menggunakan animasi mikro GSAP ScrollTrigger yang sangat halus (*buttery-smooth*).
- **Studio CMS (`app/admin/*`):** Wajib bergaya "Clean Enterprise" yang sangat utilitarian dan bersih layaknya alat kerja korporasi (seperti Stripe atau Linear). Gunakan warna latar `Ghost White` (`bg-[#F8F8FF]`), tipografi skala `Slate`, kartu `bg-white`, dan garis tepi `border-slate-200`. **DILARANG KERAS** menggunakan tema gelap/sinematik di rute ini.

## 2. Stack Teknologi & Konvensi
- **Next.js 15+ App Router:** Gunakan *Server Components* secara bawaan. Gunakan direktif `'use client'` HANYA JIKA komponen membutuhkan React hooks (`useState`, `useEffect`) atau API peramban (*browser*) seperti GSAP.
- **Tailwind CSS:** Dilarang keras menulis CSS kustom manual kecuali untuk kebutuhan animasi yang sangat kompleks. Gunakan sistem warna yang sudah didefinisikan di `tailwind.config.ts`.
- **Autentikasi & Keamanan:** Semua rute `/admin` dilindungi oleh Edge Middleware (`middleware.ts`). Sistem autentikasi bergantung pada *cookie* sederhana bernama `tj_session`.

## 3. Pengambilan Konteks RAG (Retrieval-Augmented Generation)
Jika pengguna meminta Anda untuk mengubah struktur utama, menambah fitur CMS, atau menangani sistem *Role-Based Access Control* (RBAC), Anda **WAJIB** memuat dan membaca *Skill* `project-context` terlebih dahulu untuk memahami arsitektur internal repositori ini.
