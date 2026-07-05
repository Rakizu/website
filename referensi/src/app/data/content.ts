// Konten SMPIT Thoriqul Jannah — dipetakan dari brosur SPMB TA 2026/2027 & PRD Storytelling v6.
// Semua data statis (frontend-only, tanpa backend/CMS).

const U = (id: string, w = 1600, h = 1100) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=80`;

export const school = {
  name: "SMPIT Thoriqul Jannah",
  short: "Thoriqul Jannah",
  tagline: "Mencetak Generasi Sholeh, Mandiri, Kreatif, dan Berprestasi",
  address:
    "Jl. Lamatti, Kel. Bongki, Kec. Sinjai Utara — Kode Pos 92615",
  hours: "Full Day School · 07.30 – 16.30",
  year: "2026 / 2027",
  quota: 60,
};

// ── Chapter navigation map ──────────────────────────────────────
export const chapters = [
  { id: "gate", label: "Pembuka" },
  { id: "landing", label: "Sebuah Perjalanan" },
  { id: "facilities", label: "Menyusuri Sekolah" },
  { id: "vision", label: "Nilai Kami" },
  { id: "teachers", label: "Para Guru" },
  { id: "curriculum", label: "Kurikulum" },
  { id: "extracurricular", label: "Menemukan Diri" },
  { id: "achievements", label: "Bukti" },
  { id: "alumni", label: "Setelah Lulus" },
  { id: "admission", label: "Bergabung" },
  { id: "closing", label: "Penutup" },
] as const;

// ── Hero / gate imagery ─────────────────────────────────────────
export const heroImage = U("1742549586702-c23994895082", 2400, 1500);
export const gateImage = U("1717246070626-b236a59ef2cc", 2000, 2600);

// ── Fasilitas (Bab 3) ───────────────────────────────────────────
export const facilities = [
  {
    id: "kelas",
    name: "Ruang Kelas Ber-AC",
    desc: "Belajar tenang dengan rasio kelas kecil — setiap anak terlihat, setiap suara terdengar.",
    img: U("1643216755260-cb0bc30473c8", 1400, 1800),
  },
  {
    id: "masjid",
    name: "Masjid Sekolah",
    desc: "Pusat ruh sekolah. Sholat berjamaah lima waktu menata hari, dari Subuh hingga Ashar.",
    img: U("1581141444721-0e6f8fa8397e", 1400, 1800),
  },
  {
    id: "tahfidz",
    name: "Halaqah Tahfidz",
    desc: "Sudut hangat tempat hafalan Al-Qur'an tumbuh, satu ayat setiap hari.",
    img: U("1732588234812-02a7b9e208f9", 1400, 1800),
  },
  {
    id: "lapangan",
    name: "Lapangan & Ruang Gerak",
    desc: "Tempat energi anak-anak menemukan salurannya — futsal, panahan, dan latihan pramuka.",
    img: U("1600077063877-22118d6290eb", 1400, 1800),
  },
];

// ── Visi / Nilai (Bab 4) — Target Lulusan dinarasikan ulang ─────
export const values = [
  {
    key: "01",
    title: "Sholeh",
    line: "Aqidah yang lurus, ibadah yang tertib, dan hafalan Al-Qur'an yang tumbuh setiap hari.",
  },
  {
    key: "02",
    title: "Mandiri",
    line: "Kecakapan hidup, disiplin waktu, dan kemampuan menata diri dalam aktivitas harian.",
  },
  {
    key: "03",
    title: "Kreatif",
    line: "Berpikir kritis, mengembangkan potensi, dan menghasilkan karya yang berarti.",
  },
  {
    key: "04",
    title: "Berprestasi",
    line: "Mencapai standar kompetensi nasional dan siap berkompetisi meraih yang terbaik.",
  },
];

// ── Guru (Bab 5) ────────────────────────────────────────────────
export const teachers = [
  {
    name: "Kurniati, S.Pd. Gr",
    role: "Wali Kelas · Pembina",
    quote:
      "Kami tidak sekadar mengajar pelajaran. Kami menemani anak-anak menemukan siapa diri mereka.",
    img: U("1580894732930-0babd100d356", 900, 1100),
  },
  {
    name: "Hanif Nur R., S.Ap",
    role: "Pembina Tahfidz",
    quote:
      "Setiap ayat yang dihafal seorang anak adalah cahaya yang ia bawa pulang untuk keluarganya.",
    img: U("1589995635011-078e0bb91d11", 900, 1100),
  },
  {
    name: "Sulfiani, S.E",
    role: "Guru & Humas",
    quote:
      "Kepercayaan orang tua adalah amanah. Kami menjaganya dengan kesungguhan setiap hari.",
    img: U("1512238972088-8acb84db0771", 900, 1100),
  },
];

// ── Kurikulum (Bab 6, signature) ────────────────────────────────
export const curriculumSessions = [
  {
    time: "07.30 – 12.30",
    title: "Sesi Nasional",
    desc: "Penuntasan materi akademik sesuai standar kurikulum nasional.",
  },
  {
    time: "12.30 – 16.30",
    title: "Sesi Pesantren",
    desc: "Diniyah, Tahfidz & pembinaan karakter. Pulang setelah Ashar berjamaah.",
  },
];

export const programs = [
  "Bina Olimpiade IPA",
  "Bina Matematika",
  "English Class",
  "Kelas Bahasa Arab",
  "Kelas Tahfidz",
];

// ── Ekstrakurikuler (Bab 7) ─────────────────────────────────────
export const extracurriculars = [
  {
    name: "Pramuka",
    tag: "Kepemimpinan & Alam",
    desc: "Belajar mandiri, tangguh, dan bekerja sama di bawah langit terbuka.",
    img: U("1700459565926-d1ee8291cd9e", 1200, 1500),
  },
  {
    name: "Futsal",
    tag: "Sportivitas & Tim",
    desc: "Menyalurkan energi, membangun kekompakan, dan belajar menang tanpa merendahkan.",
    img: U("1598399615261-adafbbb044fc", 1200, 1500),
  },
  {
    name: "Panahan",
    tag: "Fokus & Sunnah",
    desc: "Olahraga yang dianjurkan Rasulullah — melatih ketenangan, ketepatan, dan kesabaran.",
    img: U("1656764984996-6c93471ce2cc", 1200, 1500),
  },
];

// ── Prestasi (Bab 8) ────────────────────────────────────────────
export const achievements = [
  { value: "60", label: "Kuota siswa terpilih tiap angkatan", note: "kelas kecil, perhatian besar" },
  { value: "5×", label: "Sholat berjamaah setiap hari", note: "menata ritme & disiplin" },
  { value: "9 jam", label: "Full Day School terstruktur", note: "akademik + pesantren" },
  { value: "5", label: "Program unggulan akademik", note: "olimpiade, bahasa, tahfidz" },
];

// ── Alumni / Life After Graduation (Bab 9) ──────────────────────
export const alumni = [
  {
    name: "Rafi Alfarizi",
    now: "Santri & Pelajar SMA Unggulan",
    quote:
      "Yang saya bawa dari sini bukan cuma nilai. Tapi cara bangun subuh tanpa disuruh, dan hafalan yang masih terjaga.",
    img: U("1629273229664-11fabc0becc0", 800, 800),
  },
  {
    name: "Naila Zahra",
    now: "Finalis Olimpiade Sains",
    quote:
      "Guru-guru di Thoriqul Jannah percaya pada saya sebelum saya percaya pada diri sendiri.",
    img: U("1720604568178-444a03bf4cdf", 800, 800),
  },
];

// ── SPMB (Bab 11) ───────────────────────────────────────────────
export const admissionWaves = [
  {
    wave: "Gelombang I",
    register: "5 Jan – 31 Mar 2026",
    test: "1 – 2 April 2026",
  },
  {
    wave: "Gelombang II",
    register: "1 Apr – 30 Jun 2026",
    test: "1 – 2 Juli 2026",
  },
];

export const requirements = [
  "Isi Formulir Pendaftaran",
  "FC Akte & Kartu Keluarga (1 lembar)",
  "FC KTP Orang Tua (1 lembar)",
  "Pas Foto 3×4 (2 lembar)",
  "Lunas Biaya Awal Pendaftaran",
];

// ── Kontak / Panitia SPMB ───────────────────────────────────────
export const contacts = [
  { name: "Kurniati, S.Pd. Gr", role: "Ketua Panitia", wa: "085326999906" },
  { name: "Hanif Nur R., S.Ap", role: "Sekretaris", wa: "082344075695" },
  { name: "Sulfiani, S.E", role: "Humas", wa: "082331508108" },
];

export const primaryWa = contacts[0].wa;
export const waMessage = encodeURIComponent(
  "Assalamu'alaikum, saya ingin bertanya tentang pendaftaran SMPIT Thoriqul Jannah TA 2026/2027.",
);
export const waLink = `https://wa.me/62${primaryWa.replace(/^0/, "")}?text=${waMessage}`;
