# PRD: Website Sekolah — Pendekatan Storytelling & Scrollytelling (v6.0)

> Dokumen ini fokus pada kebutuhan produk. Detail implementasi teknis (struktur folder, arsitektur komponen, skema database, daftar animasi, infrastructure) ada di dokumen terpisah: *Lampiran Teknis v2.0*.
>
> **Changelog v6.0**: Identitas visual diputuskan (§6), KPI diperkuat dengan angka target spesifik (§8, §13), performance budget ditambahkan (§14), roadmap dilengkapi estimasi waktu (§17), section baru: Content Strategy (§18), Data Privacy & Security (§19), Testing & Validasi (§20).

---

## 1. Ringkasan & Tujuan

Website sekolah berbasis storytelling/scrollytelling yang memposisikan orang tua sebagai "hero" dalam perjalanan mengambil keputusan pendidikan untuk anaknya. Tujuan utama: **membangun kepercayaan orang tua dan mendorong pendaftaran (SPMB)** — ini adalah tolok ukur untuk setiap keputusan desain di dokumen ini.

---

## 2. User Persona

| Persona | Kebutuhan Utama | Bab Paling Relevan |
|---|---|---|
| **Orang tua siswa SD** (target utama, sedang memilih SMP) | Bukti kualitas (kurikulum, guru, prestasi), rasa aman/percaya, kemudahan mendaftar | Guru, Kurikulum, Prestasi, SPMB |
| **Calon siswa** (anak, ikut melihat bersama orang tua) | Merasa "tempat ini seru", identifikasi diri dengan ekskul/lingkungan | Fasilitas, Ekskul, Artikel |
| **Alumni** | Nostalgia, validasi bahwa sekolah masih relevan, kemungkinan referral | Life After Graduation, Artikel |
| **Guru/calon guru** (sekunder) | Gambaran budaya kerja, kualitas institusi | Guru, Visi Misi |
| **Mitra sekolah** (sekunder — vendor, sekolah lain, dinas) | Kredibilitas institusi, kontak resmi | Profil, Kontak |

**Implikasi desain**: konten dan CTA diprioritaskan untuk orang tua siswa SD sebagai persona primer. Persona lain terlayani secara alami lewat struktur yang sama, tanpa jalur terpisah — kecuali kebutuhan kontak/kemitraan yang butuh halaman/section sendiri (lihat §3 IA — "Kontak").

---

## 3. Information Architecture

Struktur navigasi eksplisit — penting untuk pengembangan modular dan SEO (URL/sitemap jelas), terpisah dari urutan storytelling di scroll utama.

```
Website
├── Home (Gate Page + Landing — entry point storytelling)
├── Profil
│   ├── Visi Misi
│   ├── Guru
│   └── Fasilitas
├── Akademik
│   ├── Kurikulum & Program
│   └── Ekstrakurikuler
├── Prestasi
├── Alumni (Life After Graduation)
├── Artikel
├── SPMB
│   ├── Alur Pendaftaran
│   ├── Biaya
│   └── Formulir
├── Kontak
└── Kebijakan Privasi ← (baru, wajib — lihat §19)
```

**Catatan penting**: struktur ini adalah peta navigasi/URL, **bukan** urutan scroll storytelling di §8. Homepage tetap menyajikan cerita berurutan; menu ini memberi jalur pintas bagi pengunjung yang tidak ingin mengikuti alur linear (relevan dengan navigasi pintas di §12). Setiap node di struktur ini idealnya juga punya URL sendiri (mis. `/akademik`, `/prestasi`) untuk kebutuhan SEO dan share link, meski secara visual kontennya bagian dari satu halaman scroll di homepage.

---

## 4. User Journey

Alur makro dari luar situs sampai konversi:

**Melihat iklan/rekomendasi → Membuka website → Menjelajahi cerita (Gate → Landing → Fasilitas → Visi Misi → Guru) → Melihat Kurikulum & Ekskul → Melihat Prestasi → Membaca kisah Alumni → Menghubungi sekolah (CTA mengambang, opsional) → Mendaftar (SPMB) → Konfirmasi**

Titik evaluasi UX yang paling penting di alur ini (lihat juga §13 Analytics):
- **Drop-off point**: di bab mana pengunjung paling banyak berhenti sebelum sampai Prestasi/Alumni — target drop-off per bab: ≤ 15%
- **Titik keputusan**: apakah pengunjung mendaftar langsung dari CTA mengambang (jalur cepat) atau menyelesaikan seluruh cerita dulu (jalur lengkap) — dua pola ini valid dan sebaiknya sama-sama difasilitasi, bukan dipaksa satu jalur
- **Funnel konversi** (target spesifik):
  - Homepage visit → scroll ke SPMB: ≥ 20%
  - Klik "Daftar Sekarang": ≥ 8%
  - Mulai isi form: ≥ 6%
  - Submit form lengkap: ≥ 4%

---

## 5. Konsep Narasi Utama

Struktur cerita: **Awal → Tantangan → Proses → Hasil → Masa Depan**

Benang konflik: *"Memilih sekolah adalah keputusan penting"* → *"Setiap anak memiliki potensi berbeda"* → *"Tidak semua siswa berkembang dengan cara yang sama."*

---

## 6. Identitas Visual

### Keputusan: Hybrid — "Warm Islamic Cinematic"

Menggabungkan kehangatan emosional "Warm, Human, Cinematic" dengan identitas "Modern Islamic School":

| Aspek | Keputusan |
|---|---|
| **Kesan keseluruhan** | Hangat + bermartabat — emosional tapi tidak berlebihan, islami tapi tidak kaku |
| **Warna** | Earth tone (warm brown, cream, ivory) sebagai basis + hijau sage sebagai primary + gold sebagai aksen islami |
| **Tipografi** | Humanist sans-serif untuk heading (Plus Jakarta Sans), readable sans untuk body (Inter), serif untuk kutipan (Lora) |
| **Fotografi** | Candid, golden hour, aktivitas nyata — bukan foto stok atau foto studio yang steril |
| **Ornamen** | Geometric Islamic pattern (subtle, sebagai divider/background pattern, bukan dominan) |
| **Ilustrasi** | Tidak digunakan di v1 — fokus ke fotografi asli untuk membangun trust |

**Alasan hybrid**: orang tua Indonesia (persona primer) mencari *kepercayaan* — campuran kehangatan emosional + nilai islami adalah kombinasi paling kuat untuk konteks SMP Islam di Indonesia.

Detail color palette, typography scale, breakpoints, spacing, dan motion tokens ada di *Lampiran Teknis v2.0 §1 Design System*.

---

## 7. Momen Wow — Signature Experience

Satu momen ikonik: motif cahaya pagi→sore berjalan di sepanjang halaman, puncak di Kurikulum berupa timeline "pohon tumbuh".

**Implementasi**: animasi stroke SVG (`stroke-dashoffset`) yang terikat scroll via GSAP ScrollTrigger — bukan DrawSVG (plugin berbayar). Detail teknis di *Lampiran Teknis v2.0 §6*.

---

## 8. Alur Halaman sebagai "Bab Cerita" + Success Criteria

Setiap bab punya **indikator keberhasilan** dengan metrik terukur — bukan cuma KPI global di §13, tapi tujuan spesifik yang bisa dievaluasi per bagian.

| Bab | Fungsi Narasi | Success Criteria | Metrik Terukur | Target |
|---|---|---|---|---|
| **1. Gate Page** | Undangan | Menarik perhatian — tidak bounce dalam 3 detik | Bounce rate Gate → Landing | ≤ 30% |
| **2. Landing** | Dunia baru + benih konflik | Membangun rasa ingin tahu | Scroll-through rate Landing → Fasilitas | ≥ 70% |
| **3. Fasilitas** | Berjalan menyusuri sekolah | Membangun rasa "familiar" | Waktu baca di bab ini | ≥ 20 detik |
| **4. Visi Misi** | Nilai sekolah | Menyampaikan filosofi tanpa menggurui | Scroll-through rate (tidak skip) | ≥ 60% |
| **5. Guru** | Orang di balik perjalanan | **Meningkatkan kepercayaan** | Waktu baca vs rata-rata semua bab | ≥ 1.2x rata-rata |
| **6. Kurikulum** ⭐ | Tantangan & proses | Menjawab keraguan | Scroll-through rate + waktu baca | ≥ 65%, ≥ 25 dtk |
| **7. Ekskul** | Menemukan jati diri | Keterikatan emosional | Interaksi (klik/swipe kartu) | ≥ 40% pengunjung |
| **8. Prestasi** | Hasil | **Menunjukkan bukti** | Scroll-through rate | ≥ 60% |
| **9. Life After Graduation** | Masa depan | **Keyakinan jangka panjang** | Waktu baca testimoni | ≥ 15 detik |
| **10. Artikel** | Kisah siswa saat ini | Bukti sosial personal | Click-through ke detail | ≥ 20% pengunjung |
| **11. SPMB** | Ajakan mendaftar | **Mendorong tindakan** | Form completion rate | ≥ 25% |
| **Penutup** | Ending emosional | Meninggalkan kesan | Scroll sampai akhir | ≥ 80% |

**Cara mengukur drop-off per bab**: fire analytics event saat bab masuk viewport (`chapter_enter`) dan saat keluar (`chapter_exit`). Drop-off Bab N = 1 − (enter Bab N+1 / enter Bab N). Detail implementasi di *Lampiran Teknis v2.0 §10*.

---

## 9. Responsive Storytelling

| Elemen | Desktop | Mobile |
|---|---|---|
| Hero Landing | Video full-screen (Fase 3) / foto sinematik (Fase 1) | Gambar sinematik statis |
| Timeline Kurikulum | Animasi pohon tumbuh penuh | Kartu vertikal berurutan, versi ringan |
| Ekskul | Horizontal scroll | Scroll-snap vertikal |
| Fasilitas | Parallax multi-layer | 1 layer atau fade sederhana |
| Pinning | Bebas dipakai | Dibatasi (rawan bug viewport) |

Prinsip: mobile-first untuk interaksi utama (CTA, form, navigasi); lapisan sinematik desktop adalah tambahan.

---

## 10. Loading Experience

Preloader ringan bertema, progressive loading (teks dulu, media berat menyusul), skeleton state untuk kartu berbasis CMS, transisi halus poster→video.

---

## 11. Error Experience

| Skenario | Fallback |
|---|---|
| Video gagal dimuat | Poster image statis |
| JavaScript nonaktif | Konten inti tetap terbaca (progressive enhancement) |
| Koneksi lambat | Turunkan kualitas otomatis |
| Gambar tidak tersedia | Placeholder bertema + alt text |
| CMS/API gagal | State kosong yang sopan, konten fallback dari `/content` statis |

---

## 12. UX, Audio, CTA Mengambang

- **Kelelahan scroll**: maks 1–2 viewport per bab, satu ide utama per bab, jeda visual, navigasi pintas.
- **Audio ambient**: opsional, default OFF, toggle eksplisit.
- **CTA mengambang**: "Daftar Sekarang" + "Hubungi Kami/WhatsApp", collapse saat scroll cepat.

---

## 13. Analytics & KPI

### 13.1 KPI Global (Primary)

| KPI | Target | Review |
|---|---|---|
| SPMB form completion rate | ≥ 25% dari yang membuka halaman SPMB | Bulanan selama SPMB |
| SPMB pendaftar via website | ≥ 30% dari total pendaftar semua jalur | Per periode SPMB |
| CTA click rate (mengambang) | ≥ 3% dari total pengunjung unik | Bulanan |
| Bounce rate homepage | ≤ 40% | Bulanan |
| Avg. session duration | ≥ 3 menit | Bulanan |

### 13.2 KPI Global (Secondary)

| KPI | Target | Review |
|---|---|---|
| Scroll depth ≥ 75% | ≥ 35% pengunjung homepage | Bulanan |
| Returning visitors | ≥ 15% dari total visitors | Bulanan |
| WhatsApp CTA click rate | ≥ 5% dari pengunjung unik | Bulanan |
| Artikel page views | ≥ 50 views/artikel dalam 30 hari pertama | Per artikel |
| Mobile vs desktop ratio | Tracking only | Quarterly |

### 13.3 KPI per Bab

Setiap bab punya metrik terukur — lihat tabel di §8 untuk detail. Metode: `chapter_enter` dan `chapter_exit` events saat bab masuk/keluar viewport.

### 13.4 Funnel Conversion

```
Homepage Visit         → 100% (baseline)
Scroll ke Bab SPMB     → ≥ 20%
Klik "Daftar Sekarang" → ≥ 8%
Mulai isi form         → ≥ 6%
Submit form lengkap    → ≥ 4%
```

### 13.5 Analytics Tools

| Tool | Fungsi | Biaya |
|---|---|---|
| **Umami** (primary) | Page views, scroll depth, events, funnel | Gratis (self-hosted) atau free tier cloud |
| **Google Search Console** | SEO performance, impressions, crawl | Gratis |
| **Google Analytics 4** (opsional, Fase 3) | Alternatif Umami jika butuh lebih detail | Gratis (butuh cookie consent banner) |

**Rekomendasi**: Umami sebagai primary — ringan, privacy-first, tidak butuh cookie consent banner, compliant dengan UU PDP (§19).

### 13.6 Review Cadence

| Aktivitas | Frekuensi | PIC |
|---|---|---|
| Cek dashboard analytics | Mingguan | Developer |
| Review KPI global | Bulanan | Developer → laporan ke kepsek |
| Review KPI per bab + drop-off | Per 2 bulan | Developer |
| Optimisasi berdasarkan data | Per quarter | Developer |
| Review tahunan | 1x/tahun (Juli) | Developer + kepsek |

### 13.7 Skenario Aksi Berdasarkan Data

| Temuan | Aksi |
|---|---|
| Bounce rate Gate Page > 40% | Revisi headline/visual, cek loading speed |
| Drop-off tinggi di Bab Visi Misi | Persingkat konten, tambah visual |
| Bab Guru waktu baca rendah | Revisi foto/kutipan, cek layout |
| SPMB form drop-off di step 2 | Sederhanakan pertanyaan, cek UX |
| CTA floating jarang diklik | Ubah posisi/warna/copy, A/B test |
| Mobile bounce > desktop | Cek responsive, loading speed, animasi |

---

## 14. Aksesibilitas, SEO, & Performance Budget

### 14.1 Aksesibilitas
- Animasi bisa dilewati (`prefers-reduced-motion` → fallback fade/disable)
- Keyboard navigation penuh (semua interactive element reachable via Tab)
- Kontras WCAG AA (rasio ≥ 4.5:1 teks normal, ≥ 3:1 teks besar)
- Subtitle video, audio opsional (default OFF)
- Heading hierarchy semantik (`h1` → `h2` → `h3` berurutan)
- Zoom 200% tidak merusak layout
- Focus indicator visible

### 14.2 SEO
- Heading `<h2>` semantik per bab
- Teks asli di DOM (bukan gambar teks)
- Metadata + Open Graph per halaman
- Schema.org (`School`, `Article`, `Person`, `FAQPage` untuk SPMB)
- Core Web Vitals dioptimasi (lihat §14.3)
- Struktur URL mengikuti IA di §3
- Sitemap XML otomatis
- Robots.txt

### 14.3 Performance Budget

| Metrik | Target | Ambang "Buruk" |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 detik | > 4.0 detik |
| **INP** (Interaction to Next Paint) | ≤ 200ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | > 0.25 |
| **TTFB** (Time to First Byte) | ≤ 800ms | > 1.8 detik |
| **Total JS bundle** | ≤ 250KB gzipped | > 400KB |
| **Total page weight** (first load) | ≤ 2MB (termasuk gambar above-fold) | > 5MB |
| **Lighthouse Score** | ≥ 90 (Performance, Accessibility, SEO) | < 70 |

Detail implementasi performa di *Lampiran Teknis v2.0 §11-12*.

---

## 15. Ruang Lingkup yang Sengaja Tidak Dimasukkan

Untuk menjaga fokus pada tujuan utama (kepercayaan + pendaftaran) dan realistis untuk solo developer, hal berikut **sengaja dikeluarkan dari scope**, bukan terlupa:

- **AI chatbot** — tidak menambah kepercayaan orang tua secara langsung, menambah kompleksitas maintenance
- **AR/VR** — barrier akses terlalu tinggi untuk persona orang tua/device umum
- **3D penuh di seluruh halaman** — bertentangan dengan §7 (satu Momen Wow, bukan banyak), dan berisiko besar ke performa (§14)
- **WebGL di setiap section** — mengorbankan performa demi kesan teknis yang tidak menambah nilai naratif
- **Animasi kompleks yang tidak mendukung cerita** — bertentangan langsung dengan Prinsip Desain #1 dan #2 (§16)
- **Multi-bahasa** — persona primer berbahasa Indonesia, tidak perlu versi Inggris untuk v1
- **Portal siswa/guru** (login, nilai, e-learning) — di luar scope website marketing, ini domain aplikasi terpisah
- **Payment gateway** — pembayaran SPMB dilakukan offline/transfer, tidak perlu integrasi payment di v1

Jika ide-ide ini muncul kembali di tengah proyek, kembalikan ke pertanyaan: *apakah ini meningkatkan kepercayaan atau mendorong pendaftaran?* Jika tidak jelas jawabannya, ide tersebut di luar scope v1.

---

## 16. Prinsip Desain

1. Cerita lebih penting daripada animasi.
2. Animasi harus mendukung narasi, bukan mengalihkan perhatian.
3. Setiap bab hanya memiliki satu pesan utama.
4. Performa selalu lebih diprioritaskan daripada efek visual.
5. Mobile-first untuk interaksi utama.
6. Setiap keputusan desain harus mendukung tujuan utama: membangun kepercayaan orang tua dan mendorong pendaftaran.
7. Privasi data pengguna adalah kewajiban, bukan fitur opsional.

---

## 17. Roadmap Implementasi

### 17.1 Asumsi Perencanaan

| Faktor | Asumsi |
|---|---|
| Developer | 1 orang (solo), full vibe coding dengan AI |
| Waktu kerja/hari | 2-3 jam (malam, setelah jam mengajar) |
| Waktu kerja/minggu | ~15 jam (termasuk weekend lebih banyak) |
| Metode | AI-assisted coding (100% kode ditulis AI, developer sebagai validator) |
| Total estimasi | **5-6 bulan** dari mulai sampai full launch |

### 17.2 Fase & Timeline

**Fase 0 — Persiapan (Minggu 1-3)**
Setup project, design system, routing, CMS, Vercel deployment, analytics.
→ *Milestone M0*: Skeleton website online, navigasi berfungsi.

**Fase 1 — MVP Naratif Inti (Minggu 4-10)**
Landing, Kurikulum (versi sederhana), Prestasi, SPMB (info + form), floating CTA, loading/error fallback, privacy policy.
→ *Milestone M1*: **MVP Launch** — website bisa dibuka publik, pengunjung bisa melihat info dan mendaftar SPMB. Sudah bisa dipakai untuk promosi.

**Fase 2 — Kedalaman Cerita (Minggu 11-18)**
Fasilitas, Guru, Visi Misi, Ekskul, Life After Graduation, Artikel, Kontak, integrasi semua bab ke homepage scroll storytelling, analytics dasar (funnel + scroll-depth).
→ *Milestone M2*: Semua bab tersedia, narasi berjalan utuh.

**Fase 3 — Polish & Signature (Minggu 19-24)**
Gate Page cinematic, Momen Wow pohon tumbuh, motion signature, ending emosional, audio ambient, design system formal, analytics lanjutan, usability testing, final QA + performance optimization.
→ *Milestone M3*: **Full Launch** — website lengkap, di-test user asli, Lighthouse ≥ 90.

### 17.3 Dependency Map Kritis

```
Identitas Visual disetujui ──→ Design System ──→ Semua UI
Domain & hosting ready ──→ Deployment
Sanity CMS setup ──→ Konten bisa diinput ──→ Bab-bab website
Foto guru/fasilitas ready ──→ Bab Guru & Fasilitas (Fase 2)
Alumni testimoni terkumpul ──→ Bab Life After Graduation (Fase 2)
Video ready ──→ Gate Page cinematic (Fase 3)
```

**Pengumpulan konten** (foto, teks, testimoni) harus berjalan **paralel** dengan development sejak Minggu 1. Jika konten terlambat, development bisa pakai placeholder tapi launch tertunda.

### 17.4 Alignment Kalender SPMB

MVP harus live minimal **1-2 bulan sebelum SPMB dibuka**. Sesuaikan bulan mulai dengan kalender SPMB sekolah:

| Contoh Timeline | Fase | Event Sekolah |
|---|---|---|
| Agustus | Fase 0 | Tahun ajaran baru |
| September-Oktober | Fase 1 → MVP Launch | Mulai promosi informal |
| November-Januari | Fase 2 | Persiapan SPMB |
| Februari-Maret | Fase 3 → Full Launch | SPMB dibuka |

### 17.5 Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Burnout (kerja malam + ngajar) | Tinggi | Tinggi | Strict 2-3 jam/malam, libur 1 hari/minggu |
| Konten tidak siap | Tinggi | Sedang | Kumpulkan paralel dari Minggu 1, placeholder dulu |
| GSAP learning curve | Sedang | Sedang | Mulai animasi sederhana, tingkatkan gradual |
| Scope creep | Sedang | Tinggi | Kembalikan ke §15 — "apakah ini meningkatkan kepercayaan?" |
| Bug responsive/mobile | Tinggi | Sedang | Mobile-first, test device asli tiap minggu |
| Stakeholder berubah pikiran | Sedang | Sedang | PRD ini sebagai kontrak, perubahan besar lewat review formal |

---

## 18. Content Strategy & Operations

### 18.1 Inventaris Konten per Bab

| Bab | Aset Dibutuhkan | Sumber / PIC | Fase |
|---|---|---|---|
| Gate Page | 1 video (15-30 dtk) ATAU 1 foto hero sinematik, tagline | Vendor foto/video; developer | Fase 3 (Fase 1: foto saja) |
| Landing | 3-5 foto suasana sekolah (golden hour), headline naratif | Fotografer; developer | Fase 1 |
| Fasilitas | 8-12 foto ruangan, deskripsi per ruang | Fotografer; wakasek sarpras | Fase 2 |
| Visi Misi | Teks visi/misi/nilai inti; 1-2 foto | Dokumen resmi sekolah | Fase 2 |
| Guru | Foto profil tiap guru, nama, mapel, kutipan, pengalaman | Sesi foto khusus; kepsek/TU | Fase 2 |
| Kurikulum | Deskripsi program, keunggulan, infografis | Wakasek kurikulum; developer | Fase 1 |
| Ekskul | Daftar + deskripsi, 2-3 foto per ekskul | Pembina ekskul; dokumentasi | Fase 2 |
| Prestasi | Daftar prestasi, foto piala/sertifikat/momen | Wakasek kesiswaan; arsip | Fase 1 |
| Alumni | Testimoni 5-10 alumni, foto, tujuan setelah lulus | Survey/wawancara alumni | Fase 2 |
| Artikel | 3-5 artikel awal (kegiatan, event) | Guru/developer | Fase 2 |
| SPMB | Alur, biaya, persyaratan, jadwal, formulir | Panitia SPMB/TU | Fase 1 |
| Kontak | Alamat, telepon, email, WhatsApp, peta | TU | Fase 1 |

### 18.2 Rencana Produksi Konten

Berjalan **paralel** dengan development (bukan setelahnya):

**Minggu 1-2**: Kumpulkan dokumen resmi (visi misi, kurikulum, guru, prestasi, SPMB).
**Minggu 3-4**: Sesi fotografi (guru individual, fasilitas, kegiatan belajar, ekskul).
**Minggu 5-6**: Copywriting per bab + kurasi kutipan guru + testimoni alumni.

Opsi fotografer:
| Opsi | Biaya | Kualitas | Rekomendasi |
|---|---|---|---|
| Vendor profesional | Rp 2-5 juta (1 hari) | Tinggi | Untuk hero/guru |
| Internal (guru/OSIS terampil) | Rp 0 | Sedang | Untuk fasilitas, ekskul |
| **Kombinasi** | **Rp 2-3 juta** | **Tinggi-Sedang** | **✅ Rekomendasi** |

Video: **tidak perlu untuk Fase 1** — foto statis + animasi CSS sudah cukup. Video dianggarkan di Fase 3.

### 18.3 CMS Admin — Siapa yang Mengelola?

| Role | Siapa | Level Teknis | Akses |
|---|---|---|---|
| Super Admin | Developer | Tinggi | Full (konfigurasi + skema) |
| Editor | Guru IT / wakasek | Rendah-Sedang | CRUD artikel, update guru/prestasi/agenda |
| Viewer | Kepala sekolah | Rendah | Preview (opsional) |

Workflow konten untuk v1: **sederhana** — `Draft → Preview → Publish` (oleh Editor). Approval kepsek di luar sistem (verbal/WhatsApp). Multi-level approval di CMS menambah kompleksitas yang tidak sebanding untuk skala sekolah.

Training CMS untuk staff non-teknis: 3 sesi (total ~2 jam) + PDF/video panduan.

### 18.4 Content Maintenance Plan (Pasca-Launch)

| Konten | Frekuensi Update | PIC | Trigger |
|---|---|---|---|
| Artikel | 2-4x per bulan | Guru piket / OSIS | Kegiatan baru |
| Prestasi | Per event | Wakasek kesiswaan | Siswa menang lomba |
| Data guru | Per semester | TU / admin | Mutasi / guru baru |
| Info SPMB | 1x per tahun | Panitia SPMB | Awal periode pendaftaran |
| Foto fasilitas | 1x per tahun | Dokumentasi | Renovasi / fasilitas baru |
| Alumni | 1x per tahun | Guru BK | Kelulusan baru |

**Review tahunan** (bulan Juli): developer cek semua konten masih akurat sebelum tahun ajaran baru.

**Risiko konten basi**: website storytelling yang kontennya basi *lebih buruk* daripada website biasa — karena ekspektasi pengunjung sudah dinaikkan. Mitigasi: reminder WhatsApp bulanan ke PIC konten.

---

## 19. Data Privacy & Security

### 19.1 Dasar Hukum

Website ini mengumpulkan data pribadi (pendaftar SPMB, kontak, data guru/alumni publik). Wajib mematuhi **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**.

### 19.2 Klasifikasi Data

| Kategori | Contoh | Sensitivitas | Perlakuan |
|---|---|---|---|
| Data pendaftar SPMB | Nama anak, tanggal lahir, nama ortu, alamat, HP | **Tinggi** (data anak di bawah umur) | Enkripsi, akses terbatas, consent ortu wajib |
| Data kontak (form inquiry) | Nama, HP, email | Sedang | Enkripsi, retensi terbatas |
| Data publik guru/alumni | Nama, foto, mapel, testimoni | Rendah | Standar, consent tertulis |
| Analytics | IP, device, halaman dikunjungi | Minimal | Aggregated, privacy-friendly tool |

### 19.3 Kebijakan Privasi

Website **wajib** menampilkan halaman Kebijakan Privasi (accessible dari footer & link di form SPMB) yang mencakup:
1. Identitas pengendali data (nama sekolah, kontak DPO)
2. Data yang dikumpulkan & tujuan pengumpulan
3. Dasar hukum (consent eksplisit, UU PDP Pasal 20)
4. Penerima data (internal sekolah saja, tidak dibagikan ke pihak ketiga)
5. Masa retensi data (lihat §19.5)
6. Hak subjek data (akses, koreksi, hapus, tarik consent)
7. Langkah keamanan teknis
8. Cookie & analytics (Umami: privacy-first, tanpa cookie personal)
9. Kontak pengaduan privasi

### 19.4 Consent Flow (SPMB Form)

```
☐ Saya menyetujui Kebijakan Privasi dan mengizinkan sekolah
  memproses data ini untuk keperluan pendaftaran siswa baru.

  Baca Kebijakan Privasi lengkap →
```

- Checkbox **tidak boleh** pre-checked (UU PDP: consent harus aktif)
- Form tidak bisa di-submit tanpa centang
- Untuk data anak di bawah umur: consent dari orang tua/wali yang mengisi form

### 19.5 Retensi Data

| Data | Masa Retensi | Setelah Lewat |
|---|---|---|
| Pendaftar SPMB (diterima) | Selama siswa aktif + 1 tahun | Hapus atau arsip offline |
| Pendaftar SPMB (tidak diterima) | 1 tahun | Hapus otomatis |
| Data kontak / inquiry | 6 bulan | Hapus otomatis |
| Analytics | 2 tahun (aggregated) | Anonymize, hapus raw |

### 19.6 Hak Subjek Data

Orang tua bisa meminta: akses data, koreksi, penghapusan, atau penarikan consent — diproses maks 3×24 jam kerja via email/WhatsApp ke PIC data sekolah.

### 19.7 Incident Response

Jika terjadi kebocoran data:
1. Identifikasi & containment (0-2 jam) — Developer
2. Notifikasi kepala sekolah (2-4 jam) — Developer
3. Notifikasi subjek data terdampak (maks 3×24 jam, UU PDP Pasal 46) — Kepsek
4. Investigasi & perbaikan (1-14 hari) — Developer

### 19.8 Checklist Sebelum Launch

- [ ] Halaman Kebijakan Privasi live dan accessible dari footer
- [ ] Consent checkbox di form SPMB (tidak pre-checked)
- [ ] SSL/HTTPS aktif di seluruh website
- [ ] Enkripsi data sensitif di database/CMS
- [ ] Rate limiting aktif di form endpoints
- [ ] Input validation server-side
- [ ] PIC data / DPO sekolah ditunjuk
- [ ] Guru/alumni yang ditampilkan sudah consent tertulis

Detail implementasi keamanan teknis di *Lampiran Teknis v2.0 §15*.

---

## 20. Testing & Validasi

### 20.1 Prinsip Testing (Solo Developer)

Prioritaskan testing yang paling berdampak:
1. **Manual checklist** terstruktur (wajib setiap deploy) — 15 menit
2. **Automated E2E** untuk critical path (SPMB form, homepage scroll) — Playwright
3. **Usability testing** dengan orang tua asli (sebelum launch) — 3-5 peserta
4. **Performance testing** — Lighthouse ≥ 90

### 20.2 Usability Testing (Wajib Sebelum Launch)

| Aspek | Detail |
|---|---|
| Peserta | 3-5 orang tua siswa SD (target persona) |
| Format | Tatap muka / video call, 20-30 menit per peserta |
| Device | Smartphone peserta sendiri (kondisi real) |

Skenario test:
1. "Buka website ini, lihat-lihat" → *amati: pertama kali lihat apa? bingung di mana?*
2. "Cari informasi guru" → *amati: bisa menemukan? lewat menu atau scroll?*
3. "Bagaimana cara mendaftar?" → *amati: menemukan SPMB? lewat CTA atau menu?*
4. "Coba isi formulirnya" → *amati: stuck di step mana? error jelas?*
5. "Kesan pertama tentang sekolah ini?" → *ini mengukur apakah storytelling berhasil*

### 20.3 A/B Testing (Fase 3, Post-Launch)

Setelah ada data baseline (minimal 1 bulan), A/B test manual:
- CTA copy: "Daftar Sekarang" vs "Tanya Kami via WhatsApp"
- CTA posisi: bottom-right vs bottom-center full-width
- Gate Page headline: versi emosional vs informatif
- SPMB form length: 3 step vs 5 step

Metode sederhana: ganti variasi setiap 2 minggu, bandingkan metrics di analytics.

Detail implementasi testing di *Lampiran Teknis v2.0 §14*.

---

*Rujukan detail implementasi: lihat Lampiran Teknis v2.0 (design system lengkap, struktur folder, arsitektur komponen, CMS, animasi, rendering strategy, infrastructure, monitoring, testing, security).*
