# 🏫 Aturan Utama: Premium Islamic School Website

Selamat datang, Agen AI! Anda sedang bekerja pada proyek **Premium Islamic School Website**. Proyek ini sangat mengedepankan kualitas visual *(Awwwards-level)* dan fungsionalitas korporat *(Enterprise)*. Harap patuhi aturan berikut dengan sangat ketat:

## 0. Referensi Utama (WAJIB DIBACA)

Sebelum melakukan perubahan apapun, **WAJIB** baca file berikut:
- **`ULTIMATE_RAG.md`** — Knowledge base super lengkap: arsitektur, design system, component registry, animasi GSAP, data layer, API routes, konvensi kode, responsive strategy, performance guardrails, dan panduan kontribusi.

## 1. Dualitas Filosofi Desain (KRITIKAL)
Proyek ini terbagi menjadi dua dunia visual yang tidak boleh dicampuradukkan:
- **Public Frontend (`app/(publik)/*`, komponen section dll):** Wajib bergaya sinematik, dramatis, dan emosional. Gunakan warna `charcoal-ink` (hitam pekat), `accent-gold` (emas), dan `accent-sage` (hijau olive). Wajib menggunakan animasi mikro GSAP ScrollTrigger yang sangat halus (*buttery-smooth*).
- **Studio CMS (`app/admin/*`):** Wajib bergaya "Clean Enterprise" yang sangat utilitarian dan bersih layaknya alat kerja korporasi (seperti Stripe atau Linear). Gunakan warna latar `Ghost White` (`bg-[#FAFAFA]`), tipografi skala `Slate`, kartu `bg-white`, dan garis tepi `border-slate-200`. **DILARANG KERAS** menggunakan tema gelap/sinematik di rute ini.

## 2. Stack Teknologi & Konvensi
- **Next.js 16+ App Router:** Gunakan *Server Components* secara bawaan. Gunakan direktif `'use client'` HANYA JIKA komponen membutuhkan React hooks (`useState`, `useEffect`) atau API peramban (*browser*) seperti GSAP.
- **Tailwind CSS v4:** Menggunakan `@theme inline` di `globals.css`. DILARANG menulis CSS kustom manual kecuali untuk kebutuhan animasi yang sangat kompleks.
- **GSAP:** Selalu gunakan `useGSAP` dari `@gsap/react`, BUKAN `useEffect`. Hanya animasikan `transform` dan `opacity`.
- **Autentikasi & Keamanan:** Semua rute `/admin` dilindungi oleh cookie `tj_session`. Logout harus `POST`, bukan GET.

## 3. Pengambilan Konteks RAG
Jika pengguna meminta Anda untuk mengubah struktur utama, menambah fitur CMS, mengubah animasi, atau menangani sistem *Role-Based Access Control* (RBAC), Anda **WAJIB** memuat dan membaca `ULTIMATE_RAG.md` terlebih dahulu untuk memahami arsitektur internal repositori ini secara lengkap.

## 4. Performance Guardrails
- JANGAN tambahkan film grain / noise overlay (sudah dihapus karena performa).
- JANGAN tambahkan vignette overlay (sudah dihapus karena performa).
- JANGAN gunakan `backdrop-blur` pada elemen scroll.
- JANGAN gunakan `h-screen` — gunakan `min-h-[100dvh]`.
- SELALU jalankan `npm run build` sebelum commit untuk memastikan 0 error.
