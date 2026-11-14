import React from 'react';
import { HallOfFameCrown, PrestasiSiswa } from '@/components/sections/HallOfFameCrown';

const dummyPrestasi: PrestasiSiswa[] = [
  {
    id: "p1",
    nama: "Muhammad Fatih",
    judul: "Medali Emas Olimpiade Fisika",
    tingkat: "Nasional",
    tahun: "2026",
    kutipan: "Fisika adalah cara Allah menceritakan bagaimana alam semesta ini bekerja.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p2",
    nama: "Aisyah Zahra",
    judul: "Hafidzah 30 Juz Termuda",
    tingkat: "Provinsi",
    tahun: "2025",
    kutipan: "Al-Qur'an adalah kompas yang memandu setiap langkah di tengah badai kehidupan.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p3",
    nama: "Tariq Ibrahim",
    judul: "Juara 1 Lomba Robotik Islami",
    tingkat: "Internasional",
    tahun: "2026",
    kutipan: "Kami membangun masa depan dengan ketelitian algoritma dan keikhlasan doa.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p4",
    nama: "Sarah Aminah",
    judul: "Penulis Buku Best-Seller Remaja",
    tingkat: "Nasional",
    tahun: "2024",
    kutipan: "Menulis adalah caraku mengabadikan hikmah di atas kertas agar tak lekang oleh waktu.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p5",
    nama: "Hasan Al-Banna",
    judul: "Juara Debat Bahasa Arab",
    tingkat: "Internasional",
    tahun: "2025",
    kutipan: "Bahasa adalah senjata, dan retorika adalah seninya. Kami berdebat untuk mencari kebenaran.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p6",
    nama: "Nadia Faradiba",
    judul: "Medali Emas Olimpiade Biologi",
    tingkat: "Nasional",
    tahun: "2026",
    kutipan: "Mempelajari sel dan jaringan adalah caraku mensyukuri mahakarya Sang Pencipta.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p7",
    nama: "Yusuf Maulana",
    judul: "Pencipta Aplikasi Zakat Digital",
    tingkat: "Provinsi",
    tahun: "2023",
    kutipan: "Inovasi sejati adalah yang mampu menyelesaikan masalah umat dan membawa keberkahan.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p8",
    nama: "Fatimah Azzahra",
    judul: "Juara Kaligrafi Kontemporer",
    tingkat: "Nasional",
    tahun: "2025",
    kutipan: "Setiap goresan tinta adalah dzikir yang tak terucap namun terlihat oleh hati.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p9",
    nama: "Rizal Mukhtar",
    judul: "Atlet Panahan Beregu Emas",
    tingkat: "Internasional",
    tahun: "2026",
    kutipan: "Fokus, tarik nafas, lepaskan. Panahan mengajarkanku tentang tawakkal setelah ikhtiar.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "p10",
    nama: "Khadijah Nur Iman",
    judul: "Duta Literasi Nasional Termuda",
    tingkat: "Nasional",
    tahun: "2025",
    kutipan: "Membaca adalah kunci semua pintu. Menulis adalah kunci semua hati.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
  }
];

export default function TestBookPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Spacer to simulate scrolling into the section */}
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <h1 className="text-white text-2xl font-mono tracking-wide">SCROLL KE BAWAH UNTUK MEMASUKI RUANGAN MAHKOTA</h1>
      </div>
      
      <HallOfFameCrown prestasi={dummyPrestasi} />
      
      {/* Spacer to simulate scrolling past the section */}
      <div className="h-[50vh] w-full bg-zinc-950" />
    </main>
  );
}
