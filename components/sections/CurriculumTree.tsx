'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

interface KurikulumProps {
  kurikulum: {
    konsep: string;
    sesi: Array<{ nama: string; waktu: string; fokus: string }>;
    programUnggulan: string[];
  };
}

export const CurriculumTree: React.FC<KurikulumProps> = ({ kurikulum }) => {
  const container = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !trackRef.current) return;

    const track = trackRef.current;
    
    // Calculate total horizontal scroll distance
    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth;
    };

    // The horizontal translation tween
    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    // Pinning and scrubbing
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true, // Recalculates on resize
    });

  }, { scope: container });

  // Map the CMS data into a unified array for the horizontal journey
  const journey = [
    { 
      type: 'intro', 
      title: 'Desain Kurikulum', 
      subtitle: 'Sebuah Perjalanan Tanpa Batas', 
      content: 'Bukan sekadar deretan jam pelajaran. Ini adalah orkestrasi antara keunggulan akademik, pembentukan karakter, dan spiritualitas yang mendalam.' 
    },
    { 
      type: 'konsep', 
      title: 'Konsep Utama', 
      subtitle: kurikulum.konsep, 
      content: 'Sistem terpadu yang didesain secara presisi, memastikan setiap detik yang dihabiskan siswa bernilai ibadah sekaligus memperluas cakrawala ilmu.' 
    },
    ...kurikulum.sesi.map(s => ({
      type: 'sesi',
      title: `Fase ${s.nama}`,
      subtitle: s.waktu,
      content: s.fokus,
    }))
  ];

  return (
    <section 
      id="kurikulum"
      data-theme="dark"
      ref={container}
      className="bg-[#1A1A2E] text-white relative h-screen"
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <IslamicPattern color="#c79a45" opacity={0.03} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,154,69,0.05),transparent_70%)]" />
      </div>

      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center z-10">
        <div 
          ref={trackRef}
          className="flex items-center gap-12 md:gap-24 px-[10vw] md:px-[15vw] h-full w-max will-change-transform"
        >
          {journey.map((item, i) => (
            <div 
              key={i} 
              className="curriculum-card relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/3] max-h-[70vh] rounded-[32px] overflow-hidden group border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-accent-gold/40 hover:bg-white/10 cursor-default"
            >
              {/* Giant Watermark Typography */}
              <div className="absolute -right-8 -bottom-16 text-[10rem] md:text-[16rem] font-heading font-black text-white/5 group-hover:text-accent-gold/10 transition-colors duration-1000 pointer-events-none select-none tracking-tighter leading-none mix-blend-overlay">
                0{i + 1}
              </div>

              {/* Glowing Ambient Light */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              <div className="relative z-10 p-8 md:p-16 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-12 h-[2px] bg-accent-gold transform origin-left group-hover:scale-x-150 transition-transform duration-700 ease-out" />
                    <span className="text-accent-gold font-bold tracking-[0.3em] uppercase text-xs md:text-sm">{item.title}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-[1.2] mb-6">
                    {item.subtitle}
                  </h3>
                </div>
                
                <p className="text-base md:text-lg lg:text-xl text-white/70 font-body leading-relaxed max-w-[40ch]">
                  {item.content}
                </p>
              </div>
            </div>
          ))}

          {/* Outro/CTA Node */}
          <div className="curriculum-card relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[30vw] h-[50vh] flex items-center justify-center">
            <div className="text-center px-8">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c79a45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6">Sebuah Investasi Masa Depan</h3>
              <a href="#daftar" className="inline-flex items-center gap-3 text-accent-gold hover:text-white transition-colors uppercase tracking-[0.2em] font-bold text-xs md:text-sm border-b border-accent-gold/30 hover:border-white pb-2">
                Jelajahi Program Unggulan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
