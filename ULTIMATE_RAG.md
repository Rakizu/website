# 🏫 ULTIMATE RAG — SMPIT Thoriqul Jannah Website

> **Versi:** 2.0 | **Terakhir diperbarui:** 21 Juli 2026
> **Path Proyek:** `/Volumes/Project/Main_Project_Jangan_Hapus/school/web/`
> **Dokumen ini adalah sumber kebenaran tunggal (Single Source of Truth) untuk seluruh AI agent yang bekerja di repositori ini.**

---

## 1. Identitas & Misi Proyek

| Properti | Nilai |
|---|---|
| **Nama** | Website SMPIT Thoriqul Jannah |
| **Tujuan** | Landing page sekolah Islam premium + CMS Admin (Studio) |
| **Target Audiens** | Orang tua calon siswa di Indonesia |
| **Standar Visual** | Awwwards-tier / $150k Agency Build |
| **Tone** | Warm Islamic Cinematic (publik) · Clean Enterprise SaaS (admin) |

---

## 2. Tech Stack

### 2.1 Core Dependencies

| Package | Versi | Fungsi |
|---|---|---|
| `next` | `16.2.10` | Framework SSR/SSG (App Router) |
| `react` | `19.2.4` | UI Library |
| `tailwindcss` | `^4` | CSS Utility (PostCSS, inline `@theme`) |
| `gsap` | `^3.15.0` | Animasi sinematik (ScrollTrigger, timeline) |
| `@gsap/react` | `^2.1.2` | Hook `useGSAP` untuk React lifecycle |
| `lenis` | `^1.3.25` | Smooth scroll (lerp: 0.1) |
| `lucide-react` | `^1.23.0` | Ikon SVG (hanya admin) |
| `sanity` | `^5.31.1` | CMS headless (dipersiapkan, belum aktif) |
| `next-sanity` | `^13.1.1` | Integrasi Sanity + Next.js |
| `zod` | `^4.4.3` | Validasi schema data |

### 2.2 Dev Dependencies

| Package | Versi |
|---|---|
| `@tailwindcss/postcss` | `^4` |
| `typescript` | `^5` |
| `eslint` + `eslint-config-next` | `^9` / `16.2.10` |
| `@sanity/vision` | `^6.3.0` |

### 2.3 Scripts

```bash
npm run dev    # Menjalankan dev server (Turbopack)
npm run build  # Build produksi
npm run start  # Menjalankan build produksi
npm run lint   # ESLint
```

---

## 3. Arsitektur Proyek

### 3.1 Peta Direktori

```
school/web/
├── app/
│   ├── layout.tsx          # Root layout (font, Navbar, Footer, SmoothScroll, Cursor, IslamicPattern)
│   ├── page.tsx            # Landing page compositor (Server Component, ISR 60s)
│   ├── globals.css         # Tailwind v4 @theme inline + CSS custom properties
│   ├── artikel/
│   │   └── [id]/page.tsx   # Detail artikel (SSG via generateStaticParams)
│   ├── admin/
│   │   ├── layout.tsx      # Admin shell (Enterprise SaaS style, role badge)
│   │   ├── login/page.tsx  # Halaman login admin
│   │   └── artikel/
│   │       ├── page.tsx          # Dashboard artikel
│   │       └── editor/[id]/page.tsx  # Editor artikel
│   └── api/
│       ├── auth/login/     # POST: autentikasi (cookie tj_session)
│       ├── auth/logout/    # POST: hapus sesi
│       ├── auth/me/        # GET: cek sesi aktif
│       ├── artikel/        # GET/POST: CRUD artikel
│       ├── artikel/[id]/   # GET/PUT/DELETE: artikel spesifik
│       └── upload/         # POST: upload gambar
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Glassmorphism pill nav + Curtain transition
│   │   ├── Footer.tsx      # Massive typography footer + GSAP 3D reveal
│   │   └── SmoothScroll.tsx # Lenis wrapper + GSAP ticker sync
│   ├── sections/           # 15+ komponen section (detail di §6)
│   └── ui/
│       ├── CustomCursor.tsx # GSAP quickTo cursor (morph states)
│       ├── IslamicPattern.tsx # SVG tessellated geometric pattern
│       └── CurtainLink.tsx  # Wrapper link → navigate-curtain event
├── content/
│   └── data.json           # Simulasi CMS statis (profil, guru, kurikulum, dll)
├── public/                 # Aset statis
└── .agents/
    ├── AGENTS.md           # Aturan utama untuk AI agent
    └── skills/             # 24 skill AI terpasang
```

### 3.2 Alur Render Halaman Utama

```
app/layout.tsx (Server)
├── IslamicPattern (fixed bg, pointer-events-none)
├── CustomCursor (client, morph states)
├── Navbar (client, glassmorphism + curtain transition)
├── SmoothScroll (client, Lenis + GSAP sync)
├── app/page.tsx (Server, ISR 60s)
│   └── getData() → content/data.json
│       ├── GatePage (preloader)
│       ├── HeroCinematic
│       ├── StoryVisionMission
│       ├── EditorialTeachers(guru)
│       ├── AlumniGallery(alumni)
│       ├── CurriculumTree(kurikulum)
│       ├── FeaturedPrograms(programs)
│       ├── HorizontalExtracurriculars(ekskul)
│       ├── FacilityGrid(fasilitas)
│       ├── ArticleHighlight(artikel)
│       └── AdmissionForm
└── Footer (client, 3D reveal)
```

### 3.3 Urutan Section di Landing Page

| # | Komponen | Data Props | Tema |
|---|---|---|---|
| 1 | `GatePage` | — | Dark (preloader) |
| 2 | `HeroCinematic` | — | Light |
| 3 | `StoryVisionMission` | — | Light → Dark |
| 4 | `EditorialTeachers` | `guru[]` | Light |
| 5 | `AlumniGallery` | `alumni[]` | Light |
| 6 | `CurriculumTree` | `kurikulum{}` | Light |
| 7 | `FeaturedPrograms` | `programUnggulan[]` | Dark |
| 8 | `HorizontalExtracurriculars` | `ekskul[]` | Light |
| 9 | `FacilityGrid` | `fasilitas[]` | Light |
| 10 | `ArticleHighlight` | `artikel[]` | Light |
| 11 | `AdmissionForm` | — | Light |

---

## 4. Design System

### 4.1 Palet Warna (CSS Custom Properties → Tailwind Utilities)

#### Warna Utama

| Token CSS | Nilai Hex | Utilitas Tailwind | Penggunaan |
|---|---|---|---|
| `--background` | `#f6efe2` | `bg-canvas-white`, `bg-canvas` | Latar belakang utama (ivory cream) |
| `--foreground` | `#2a201a` | `text-charcoal-ink`, `text-ink` | Teks utama (espresso gelap) |
| `--card` | `#fbf6ec` | `bg-pure-surface`, `bg-card-bg` | Panel kartu |
| `--muted` | `#ece3d1` | `bg-muted` | Latar muted (sand) |
| `--muted-fg` | `#73644f` | `text-muted-steel`, `text-muted-fg` | Teks sekunder |
| `--border-clr` | `rgba(42,32,26,0.12)` | `border-whisper-border`, `border-border` | Garis tepi halus |

#### Warna Aksen

| Token CSS | Nilai Hex | Utilitas Tailwind | Penggunaan |
|---|---|---|---|
| `--sage` | `#6b8e23` | `text-accent-sage`, `bg-sage` | Hijau olive (brand) |
| `--sage-deep` | `#354711` | `bg-sage-deep` | Section gelap hijau |
| `--gold` | `#c79a45` | `text-accent-gold`, `bg-gold` | Emas Islami (aksen utama) |
| `--gold-soft` | `#e3c179` | `bg-gold-soft` | Emas lembut |
| `--accent` | `#b98b32` | `bg-accent` | Aksen emas tua |

#### Warna Gelap (Chapter)

| Token CSS | Nilai Hex | Utilitas Tailwind | Penggunaan |
|---|---|---|---|
| `--ink` | `#221a14` | `bg-charcoal-ink`, `bg-dark-ink` | Section gelap (tinta) |
| `--ink-2` | `#191310` | `bg-dark-ink-2` | Lebih gelap dari ink |
| `--cream` | `#f6efe2` | `text-cream`, `bg-cream` | Teks terang di bg gelap |

### 4.2 Tipografi

| Variabel | Font | Utilitas Tailwind | Penggunaan |
|---|---|---|---|
| `--font-jakarta` | Plus Jakarta Sans | `font-heading` | Heading, judul, badge |
| `--font-outfit` | Outfit | `font-body` | Paragraf, teks deskripsi |
| `--font-lora` | Lora (+ italic) | `font-accent` | Kutipan, aksen editorial |

#### Kelas Tipografi Kustom

| Kelas | Ukuran | Line Height | Konteks |
|---|---|---|---|
| `.text-hero` | `clamp(2.75rem, 9vw, 8.5rem)` | 0.95 | Judul raksasa hero |
| `.text-chapter` | `clamp(2rem, 5.5vw, 5rem)` | 1.02 | Judul chapter/section |
| `.text-kicker` | `clamp(0.7rem, 1vw, 0.8rem)` | — | Eyebrow badge (UPPERCASE) |
| `.text-lead` | `clamp(1.05rem, 1.6vw, 1.4rem)` | 1.7 | Paragraf utama |

### 4.3 Easing Curves Premium

| Variabel | Nilai | Konteks |
|---|---|---|
| `--ease-fluid` | `cubic-bezier(0.104, 0.204, 0.492, 1)` | Transisi umum |
| `--ease-organic` | `cubic-bezier(0.306, 0.968, 0.632, 1)` | Transisi organik |

### 4.4 Utilitas CSS Kustom

```css
.will-reveal        /* opacity: 0, translateY(38px) — untuk GSAP reveal */
.bg-chapter-dark    /* bg: ink, color: cream */
.bg-chapter-sage    /* bg: sage-deep, color: cream */
.bg-chapter-cream   /* bg: background, color: foreground */
.gold-line          /* gradient emas horizontal (separator) */
.hide-default-cursor /* cursor: none !important */
```

---

## 5. Sistem Animasi (GSAP)

### 5.1 Prinsip Dasar

**WAJIB DIBACA sebelum menyentuh animasi apapun.**

1. **HANYA animasikan `transform` dan `opacity`.** DILARANG menganimasikan `top`, `left`, `width`, `height` (menyebabkan reflow).
2. **Gunakan `useGSAP` dari `@gsap/react`** — BUKAN `useEffect`. Hook ini menangani cleanup otomatis.
3. **Selalu sertakan `{ scope: containerRef }`** pada `useGSAP` agar GSAP hanya mencari elemen di dalam kontainer tersebut.
4. **ScrollTrigger:** Gunakan `trigger`, `start`, `end`, dan `scrub` untuk animasi berbasis scroll. Hindari `window.addEventListener('scroll')`.
5. **`once: true`** pada ScrollTrigger untuk animasi masuk yang hanya terjadi sekali. Jangan biarkan animasi berulang saat scroll naik-turun.
6. **Blur filter** hati-hati — hanya untuk animasi masuk singkat. JANGAN gunakan `backdrop-blur` pada elemen scroll besar.

### 5.2 Pola Animasi per Komponen

| Komponen | Teknik GSAP | Deskripsi |
|---|---|---|
| **GatePage** | `gsap.to` + delay + mask | Hitung mundur 0-100%, reveal kata visi, tirai naik |
| **HeroCinematic** | `stagger` + `clip-path` + parallax | Judul raksasa + gambar parallax yoyo |
| **StoryVisionMission** | ScrollTrigger `scrub` per baris | Teks terungkap baris demi baris dramatis |
| **EditorialTeachers** | Parallax Y + grayscale filter | Foto guru parallax, filter warna berubah |
| **CurriculumTree** | `strokeDashoffset` + dot elastic | Gelombang SVG emas digambar saat scroll |
| **FeaturedPrograms** | ScrollTrigger `pin` + sticky stack | Kartu tertumpuk, kartu lama mengecil ke belakang |
| **HorizontalExtracurriculars** | ScrollTrigger `pin` + translateX | Scroll horizontal pada sumbu X (pinned) |
| **FacilityGrid** | `stagger` + `power4.out` | Grid bento muncul satu-per-satu |
| **AlumniGallery** | `stagger` + masonry | Dua kolom asimetris, reveal bertahap |
| **ArticleHighlight** | Parallax lokal pada thumbnail | Gambar bergeser lambat di dalam bingkai |
| **AdmissionForm** | Transform scaleX pada pseudo-border | Efek ketik pada garis bawah input |
| **Navbar** | ScrollTrigger shrink + SVG morph | Pill mengecil + transisi tirai sinematik |
| **Footer** | `rotationX` 3D reveal | Teks "Mari Melangkah" naik dari bawah |

### 5.3 Transisi Halaman: Cinematic Curtain

```
User klik link → CustomEvent 'navigate-curtain' → Navbar mendengar →
SVG layar penuh mengembang (GSAP path morphing) → Navigasi terjadi →
SVG menyusut kembali → Halaman baru terlihat
```

- **Event Name:** `navigate-curtain`
- **Detail:** `{ href: string }` (hash `#section` atau URL `/artikel/id`)
- **Komponen Pemicu:** `CurtainLink.tsx` atau `Footer.tsx` (via `window.dispatchEvent`)
- **Komponen Penerima:** `Navbar.tsx` (via `window.addEventListener`)

### 5.4 Smooth Scroll (Lenis)

```typescript
// SmoothScroll.tsx — Sinkronisasi Lenis ↔ GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## 6. Component Registry (Lengkap)

### 6.1 Layout Components

#### `Navbar.tsx` — Navigasi Glassmorphism
- **Path:** `components/layout/Navbar.tsx`
- **Direktif:** `'use client'`
- **Fitur:** Floating pill nav, backdrop-blur, menu mobile expand, curtain page transition (SVG morph)
- **Event:** Mendengarkan `navigate-curtain`, mengirim navigasi via `router.push` atau `lenis.scrollTo`
- **Dependensi:** `gsap`, `ScrollTrigger`, `useGSAP`, `usePathname`, `useRouter`, `lenis`

#### `Footer.tsx` — Footer Premium
- **Path:** `components/layout/Footer.tsx`
- **Direktif:** `'use client'`
- **Fitur:** Teks "Mari Melangkah" raksasa (12vw) dengan 3D rotationX reveal, navigasi grid 2 kolom, NPSN badge bercahaya, ambient gold glow
- **Mode Compact:** Otomatis di route `/artikel/*` (menyembunyikan tipografi masif)
- **Dependensi:** `gsap`, `ScrollTrigger`, `useGSAP`, `usePathname`

#### `SmoothScroll.tsx` — Lenis Wrapper
- **Path:** `components/layout/SmoothScroll.tsx`
- **Direktif:** `'use client'`
- **Fitur:** Inisialisasi Lenis, sinkronisasi dengan GSAP ticker
- **Dependensi:** `lenis`, `gsap`, `ScrollTrigger`

### 6.2 UI Components

#### `CustomCursor.tsx` — Kursor Kustom
- **Path:** `components/ui/CustomCursor.tsx`
- **Direktif:** `'use client'`
- **Fitur:** `gsap.quickTo` untuk latensi nol, morph states (default/hover/drag)
- **Pengecualian:** Otomatis dimatikan di route `/admin`
- **Dependensi:** `gsap`, `usePathname`

#### `IslamicPattern.tsx` — Ornamen Latar
- **Path:** `components/ui/IslamicPattern.tsx`
- **Props:** `color: string`, `opacity: number`
- **Fitur:** SVG tessellated bintang 8 sudut, `fixed inset-0`, `pointer-events-none`
- **Export Tambahan:** `OrnamentDivider` — separator ornamen horizontal

#### `CurtainLink.tsx` — Link Bertirai
- **Path:** `components/ui/CurtainLink.tsx`
- **Props:** `href: string`, `isRoute?: boolean`, `className?: string`, `children`
- **Fitur:** Memicu `CustomEvent('navigate-curtain')` dengan `detail: { href }`

### 6.3 Section Components

#### `GatePage.tsx` — Preloader Pembukaan
- **Props:** —
- **Fitur:** Hitung mundur persentase 0-100%, reveal kata visi ("Sholeh", "Mandiri", "Kreatif", "Berprestasi"), tirai naik. Disimpan di `sessionStorage` (hanya tampil sekali per sesi).
- **Tema:** Dark (latar hitam ink)

#### `HeroCinematic.tsx` — Hero Utama
- **Props:** —
- **Fitur:** Judul `text-hero` raksasa dengan gambar inline (`clip-path` reveal), parallax yoyo, staggered text animation
- **Tema:** Light

#### `StoryVisionMission.tsx` — Cerita Visi & Misi
- **Props:** —
- **Fitur:** Reveal teks baris-per-baris dramatis (ScrollTrigger scrub), parallax gambar pada `.visi-image`
- **Tema:** Light → Dark transition

#### `EditorialTeachers.tsx` — Profil Guru
- **Props:** `guru: Array<{ id, nama, mapel, bio, image, quote }>`
- **Fitur:** Layout editorial majalah (gambar selang-seling kiri-kanan), parallax foto, filter grayscale→color, efek bayangan melayang (floating shadow DOF)
- **Tema:** Light

#### `AlumniGallery.tsx` — Galeri Alumni
- **Props:** `alumni: Array<{ id, nama, tahunLulus, tujuan, testimoni, image }>`
- **Fitur:** Masonry 2 kolom asimetris (kolom 2 digeser margin-top), stagger reveal
- **Tema:** Light

#### `CurriculumTree.tsx` — Timeline Kurikulum
- **Props:** `kurikulum: { konsep: string, sesi: Array<{ nama, waktu, fokus }>, programUnggulan: string[] }`
- **Fitur:** SVG Wavy Line (gelombang sinusoidal) besar di tengah, `strokeDashoffset` digambar saat scroll, dot timeline meledak (elastic out + glow) saat konten terlihat
- **Tema:** Light
- **SVG Path:** Kurva Bezier `C` berulang membentuk gelombang S organik

#### `FeaturedPrograms.tsx` — Program Unggulan
- **Props:** `programs: string[]`
- **Fitur:** Sticky Stack Cards (Z-Axis). Di desktop, ScrollTrigger `pin: true` menahan section sementara kartu-kartu naik dari bawah dan menumpuk. Kartu sebelumnya mengecil (scale: 0.9), mundur (y: -50), dan meredup.
- **Tema:** Dark

#### `HorizontalExtracurriculars.tsx` — Ekskul (Horizontal Scroll)
- **Props:** `ekskul: Array<{ id, nama, deskripsi }>`
- **Fitur:** ScrollTrigger `pin: true` menahan section, container `.track` digeser pada sumbu X (horizontal) menggunakan `scrollDistance` kalkulasi. Kartu ekskul tersusun horizontal.
- **Tema:** Light

#### `FacilityGrid.tsx` — Grid Fasilitas
- **Props:** `fasilitas: Array<{ id, nama, deskripsi }>`
- **Fitur:** Grid Bento asimetris (span variasi), stagger reveal `power4.out`, placeholder gambar
- **Tema:** Light

#### `ArticleHighlight.tsx` — Sorotan Artikel
- **Props:** `artikel: Array<{ id, judul, kategori, tanggal, excerpt, image }>`
- **Fitur:** Layout editorial majalah dengan thumbnail besar, garis tepi editorial, parallax lokal pada gambar di dalam bingkai
- **Tema:** Light

#### `AdmissionForm.tsx` — Formulir SPMB
- **Props:** —
- **Fitur:** Form pendaftaran dengan animasi garis bawah input (transform scaleX pada pseudo-border), CTA rounded-full
- **Tema:** Light

### 6.4 Komponen Cadangan / Tidak Aktif (.bak)

| File | Status | Catatan |
|---|---|---|
| `ArtikelHighlight.tsx.bak` | Tidak aktif | Versi lama highlight artikel |
| `EditorialGuru.tsx.bak` | Tidak aktif | Versi lama profil guru |
| `FormSPMB.tsx.bak` | Tidak aktif | Versi lama formulir SPMB |
| `StoryVisiMisi.tsx.bak` | Tidak aktif | Versi lama visi/misi |

### 6.5 Komponen Tersedia Tapi Tidak Digunakan di page.tsx

| Komponen | Deskripsi | Alasan |
|---|---|---|
| `AchievementWaterfall.tsx` | Prestasi air terjun | Digantikan / belum diintegrasikan |
| `AlumniShowcase.tsx` | Showcase alumni alternatif | Digantikan oleh `AlumniGallery` |
| `AlumniStack.tsx` | Alumni sticky stack | Opsi alternatif |
| `GraduateTargets.tsx` | Target lulusan | Belum diintegrasikan |
| `HorizontalAlumni.tsx` | Alumni horizontal scroll | Digantikan oleh `AlumniGallery` |
| `HorizontalProgram.tsx` | Program horizontal scroll | Digantikan oleh `FeaturedPrograms` |

---

## 7. Data Layer

### 7.1 Sumber Data Saat Ini

Data saat ini dibaca dari file statis `content/data.json` via `fs.readFileSync` di Server Component (`app/page.tsx`). ISR diaktifkan dengan `revalidate = 60`.

### 7.2 Struktur `data.json`

```typescript
interface SiteData {
  profilSekolah: {
    nama: string;
    npsn: string;
    visi: string;
    misi: string[];
    lokasi: string;
    email: string;
  };
  targetLulusan: Array<{
    id: string;
    judul: string;
    deskripsi: string;
  }>;
  kurikulum: {
    konsep: string;
    sesi: Array<{
      nama: string;    // "Pagi", "Siang", dll
      waktu: string;   // "07.00 - 12.00"
      fokus: string;   // Deskripsi fokus sesi
    }>;
    programUnggulan: string[];
  };
  guru: Array<{
    id: string;
    nama: string;
    mapel: string;
    bio: string;
    image: string;
    quote: string;
  }>;
  fasilitas: Array<{
    id: string;
    nama: string;
    deskripsi: string;
  }>;
  ekskul: Array<{
    id: string;
    nama: string;
    deskripsi: string;
  }>;
  prestasi: Array<{
    id: string;
    judul: string;
    tingkat: string;
    tahun: string;
  }>;
  alumni: Array<{
    id: string;
    nama: string;
    tahunLulus: string;
    tujuan: string;
    testimoni: string;
    image: string;
  }>;
  artikel: Array<{
    id: string;
    judul: string;
    kategori: string;
    tanggal: string;
    excerpt: string;
    image: string;
    content: string;
  }>;
}
```

### 7.3 Rencana Migrasi: Sanity CMS

Packages `sanity`, `@sanity/client`, dan `next-sanity` sudah terpasang. Environment variables Sanity sudah diisi di `.env.local`. Migrasi dari `data.json` ke Sanity fetch tinggal mengganti fungsi `getData()` di `app/page.tsx`.

---

## 8. API Routes

| Endpoint | Method | Fungsi | Auth |
|---|---|---|---|
| `/api/auth/login` | POST | Login admin (set cookie `tj_session`) | Public |
| `/api/auth/logout` | POST | Logout admin (hapus cookie) | Public |
| `/api/auth/me` | GET | Cek sesi aktif | Cookie |
| `/api/artikel` | GET | Ambil semua artikel | Public |
| `/api/artikel` | POST | Buat artikel baru | Cookie |
| `/api/artikel/[id]` | GET | Ambil artikel by ID | Public |
| `/api/artikel/[id]` | PUT | Update artikel | Cookie |
| `/api/artikel/[id]` | DELETE | Hapus artikel | Cookie |
| `/api/upload` | POST | Upload gambar | Cookie |

### Autentikasi

- **Cookie Name:** `tj_session`
- **Role Values:** `'writer'` atau `'publisher'`
- **Mekanisme:** Cookie sederhana, diperiksa di API routes dan `app/admin/layout.tsx`
- **Logout:** `POST` method (form action), BUKAN link `<a>` GET — penting!

---

## 9. Dualitas Filosofi Desain (KRITIKAL)

**JANGAN PERNAH mencampuradukkan kedua gaya ini.**

### 9.1 Public Frontend (Sinematik)

| Aspek | Aturan |
|---|---|
| **Latar Belakang** | `bg-canvas-white` (#f6efe2) atau `bg-charcoal-ink` (#221a14) |
| **Warna Aksen** | `accent-gold` (#c79a45), `accent-sage` (#6b8e23) |
| **Font** | Heading: Plus Jakarta Sans, Body: Outfit, Kutipan: Lora italic |
| **Animasi** | GSAP ScrollTrigger wajib, easing premium (cubic-bezier) |
| **Kursor** | Custom cursor GSAP (morph states) |
| **Scrollbar** | Tersembunyi, muncul saat scroll (emas transparan) |
| **Selection** | Emas (bg-accent-gold, text-white) |

### 9.2 Admin Studio (Enterprise)

| Aspek | Aturan |
|---|---|
| **Latar Belakang** | `bg-[#FAFAFA]` (Ghost White) |
| **Warna** | Skala `slate` (Tailwind bawaan) |
| **Kartu** | `bg-white`, `border-slate-200`, `shadow-sm` |
| **Font** | System font (sans-serif) |
| **Animasi** | Minimal, CSS transitions saja |
| **Kursor** | Bawaan browser |
| **Navbar/Footer publik** | Disembunyikan via `<style>` di admin layout |

---

## 10. Konvensi & Aturan Kode

### 10.1 Penamaan

| Jenis | Konvensi | Contoh |
|---|---|---|
| File komponen | PascalCase | `EditorialTeachers.tsx` |
| File konfigurasi | camelCase / kebab-case | `next.config.ts` |
| CSS class | Tailwind utilities / BEM untuk kustom | `kurikulum-node`, `footer-text` |
| Event kustom | kebab-case | `navigate-curtain` |
| Variabel CSS | `--kebab-case` | `--accent-gold` |

### 10.2 Import Order

```typescript
// 1. Direktif
'use client';

// 2. React / Next.js
import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';

// 3. Library eksternal
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// 4. Komponen lokal
import { IslamicPattern } from '@/components/ui/IslamicPattern';

// 5. Data / tipe
import type { Guru } from '@/types';
```

### 10.3 Pola Komponen Section

```typescript
'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  // Props dari data.json
}

export const SectionName: React.FC<SectionProps> = ({ data }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    // Animasi GSAP di sini
  }, { scope: container });

  return (
    <section
      id="section-id"           // Untuk navigasi hash
      data-theme="light"        // "light" atau "dark"
      ref={container}
      className="py-32 md:py-48 bg-canvas-white relative overflow-hidden"
    >
      {/* Konten */}
    </section>
  );
};
```

### 10.4 Anti-Patterns (DILARANG)

| ❌ Jangan | ✅ Gunakan |
|---|---|
| `useEffect` untuk GSAP | `useGSAP` dari `@gsap/react` |
| `window.addEventListener('scroll')` | GSAP `ScrollTrigger` |
| `linear` atau `ease-in-out` | Custom `cubic-bezier` |
| Animasi `width`, `height`, `top`, `left` | `transform` + `opacity` |
| `backdrop-blur` pada scroll container | `backdrop-blur` hanya pada fixed/sticky |
| CSS kustom manual | Tailwind utilities |
| Tema gelap di admin | Tema terang (Ghost White + Slate) |
| Tema terang di section publik gelap | `bg-charcoal-ink` + `text-cream` |
| Film grain / noise overlay | Sudah dihapus karena performa |
| Vignette overlay | Sudah dihapus karena performa |

---

## 11. Responsive Strategy

### 11.1 Breakpoints

| Breakpoint | Pixel | Konteks |
|---|---|---|
| Default (mobile) | `< 768px` | Stack vertikal, `px-6`, font lebih kecil |
| `md:` | `≥ 768px` | Tablet, layout 2 kolom |
| `lg:` | `≥ 1024px` | Desktop, layout penuh |

### 11.2 Aturan Responsif

1. **Mobile-first:** Selalu tulis kelas mobile dulu, lalu override dengan `md:` dan `lg:`.
2. **Horizontal scroll** (pinned) otomatis dimatikan di mobile — fallback ke stack vertikal.
3. **Rotasi / overlap** (Z-Axis) otomatis dimatikan di mobile.
4. **Section padding:** `py-32` (mobile) → `md:py-48` (desktop).
5. **Container max-width:** `max-w-[1200px]` standar, `max-w-[1400px]` untuk section sangat lebar.
6. **JANGAN gunakan `h-screen`** — gunakan `min-h-[100dvh]` untuk menghindari masalah iOS Safari.

---

## 12. Performance Guardrails

| Aturan | Detail |
|---|---|
| **GPU-safe animation** | Hanya `transform` + `opacity`. Gunakan `will-change-transform` hanya saat aktif animasi. |
| **Blur constraint** | `backdrop-blur` hanya pada fixed/sticky (navbar, overlay). BUKAN pada scrolling content. |
| **Image optimization** | Next.js `<Image>` dengan format `avif`/`webp`. Remote patterns: `hostname: '**'`. |
| **Security headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`. |
| **Static caching** | `_next/static/*` → `max-age=31536000, immutable`. |
| **ISR** | Landing page di-revalidasi setiap 60 detik. |
| **Film grain / noise** | Sudah dihapus karena masalah performa. Jangan tambahkan kembali. |
| **Vignette** | Sudah dihapus karena masalah performa. Jangan tambahkan kembali. |

---

## 13. Skills AI Terpasang (24 Skill)

Skill-skill ini terletak di `.agents/skills/` dan memandu AI agent dalam pengambilan keputusan desain:

| Skill | Fungsi |
|---|---|
| `project-context` | Konteks arsitektur internal repositori |
| `high-end-visual-design` | Panduan Awwwards-tier ($150k agency) |
| `design-taste-frontend` | Anti-slop rules, layout discipline |
| `design-taste-frontend-v1` | Versi 1 design taste |
| `stitch-design-taste` | Penggabungan selera desain |
| `gpt-taste` | Selera visual GPT |
| `brandkit` | Brand kit sekolah |
| `gsap-core` | GSAP core API |
| `gsap-react` | GSAP + React integration |
| `gsap-scrolltrigger` | ScrollTrigger deep dive |
| `gsap-timeline` | GSAP Timeline mastery |
| `gsap-plugins` | Plugin GSAP tambahan |
| `gsap-utils` | Utilitas GSAP |
| `gsap-performance` | Optimasi performa GSAP |
| `gsap-frameworks` | GSAP + framework integration |
| `gsap-skills` | Koleksi skill GSAP |
| `animate-css-skill` | Animasi CSS |
| `image-to-code` | Konversi gambar → kode |
| `imagegen-frontend-web` | Generasi gambar frontend web |
| `imagegen-frontend-mobile` | Generasi gambar frontend mobile |
| `minimalist-ui` | Panduan UI minimalis |
| `industrial-brutalist-ui` | Panduan UI brutalist |
| `redesign-existing-projects` | Panduan redesain proyek |
| `full-output-enforcement` | Enforce output lengkap |

---

## 14. Panduan Kontribusi untuk AI Agent

### 14.1 Sebelum Mengubah Apapun

1. **BACA** dokumen ini (`ULTIMATE_RAG.md`) secara keseluruhan.
2. **BACA** `.agents/AGENTS.md` untuk aturan dasar.
3. **IDENTIFIKASI** apakah perubahan Anda di area **publik** atau **admin** — terapkan filosofi desain yang sesuai (§9).
4. **CEK** apakah komponen yang ingin Anda ubah sudah ada di Component Registry (§6).

### 14.2 Menambah Section Baru

1. Buat file di `components/sections/NamaSection.tsx`.
2. Ikuti pola di §10.3 (gunakan `useGSAP`, `ref`, `data-theme`, padding standar).
3. Tambahkan data baru ke `content/data.json` jika perlu.
4. Impor dan tempatkan di `app/page.tsx` sesuai urutan naratif.
5. Pastikan responsif (mobile-first, breakpoint `md:` dan `lg:`).

### 14.3 Mengubah Animasi

1. **JANGAN PERNAH** menghapus atau merusak animasi GSAP yang sudah berjalan tanpa alasan kuat.
2. Gunakan `gsap.registerPlugin(ScrollTrigger)` di awal file.
3. Pastikan `once: true` untuk animasi masuk.
4. Test di mobile (pastikan tidak ada frame drop).

### 14.4 Mengubah Warna / Font

1. Ubah di `app/globals.css` (bagian `:root` atau `@theme inline`).
2. **JANGAN** buat warna hardcoded di komponen — selalu gunakan utilitas Tailwind yang terdaftar.
3. Pastikan kontras WCAG AA minimal.

### 14.5 Verifikasi

```bash
# WAJIB dijalankan sebelum commit
npm run build

# Pastikan tidak ada error TypeScript atau build failure
```

---

## 15. Troubleshooting Umum

| Masalah | Solusi |
|---|---|
| Animasi tidak jalan | Pastikan `gsap.registerPlugin(ScrollTrigger)` dipanggil & `useGSAP` digunakan |
| Scroll tidak smooth | Pastikan `SmoothScroll.tsx` di-render di layout |
| Transisi halaman tidak bekerja | Pastikan link menggunakan `CurtainLink` atau memicu event `navigate-curtain` |
| Admin menampilkan navbar publik | Pastikan `<style>` di `admin/layout.tsx` menyembunyikan nav/footer |
| Build gagal | Periksa TypeScript errors — `npm run build` harus 0 error |
| Logout redirect ke URL API | Gunakan `POST` method (form action), BUKAN link `<a>` |
| Gambar tidak muncul | Pastikan domain ada di `next.config.ts` `remotePatterns` |

---

**Quick Start untuk Agent Baru:**
1. Baca §1-§4 untuk memahami identitas dan design system.
2. Baca §6 untuk mengetahui semua komponen yang ada.
3. Baca §9 untuk memahami dualitas desain (KRITIKAL).
4. Baca §10 untuk konvensi kode.
5. Mulai bekerja dengan percaya diri!
