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

  useGSAP(() => {
    if (!container.current) return;

    // Scroll reveal for cards with heavy physics (Z-Axis Cascade)
    const cards = container.current.querySelectorAll('.cascade-card-wrapper');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { 
          y: 80, 
          opacity: 0,
          filter: 'blur(12px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Trigger slightly before the card enters completely
            once: true,
          }
        }
      );
    });

  }, { scope: container });

  // Array map
  const journey = [
    { 
      title: 'Konsep Utama', 
      subtitle: kurikulum.konsep, 
      content: 'Sistem terpadu yang memastikan setiap jam yang dihabiskan siswa bernilai ibadah dan ilmu.' 
    },
    ...kurikulum.sesi.map(s => ({
      title: `Sesi ${s.nama}`,
      subtitle: s.waktu,
      content: s.fokus,
    }))
  ];

  // Rotation array for the cascade effect (only applied on desktop)
  const rotations = ['md:-rotate-1', 'md:rotate-2', 'md:-rotate-2', 'md:rotate-1'];

  return (
    <section 
      id="kurikulum"
      data-theme="dark"
      ref={container}
      className="py-32 md:py-48 bg-[#050505] text-white relative overflow-hidden"
    >
      <IslamicPattern color="#c79a45" opacity={0.03} />
      
      {/* Subtle radial gradient background for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,154,69,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 md:mb-40">
          <div className="inline-flex border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold/80 mb-8 rounded-full backdrop-blur-sm">
            Struktur Pembelajaran
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.1] text-white mb-6">
            Proses Terpadu.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-white/50 max-w-[55ch] mx-auto font-body">
            Kurikulum kami dirancang untuk menyeimbangkan keunggulan akademik nasional dengan pembentukan karakter Islami yang kuat.
          </p>
        </div>

        {/* Z-Axis Cascade Stack */}
        <div className="flex flex-col items-center gap-8 md:gap-0 perspective-[1000px]">
          {journey.map((item, i) => {
            const rotClass = rotations[i % rotations.length];
            // Negative margin top for overlap on desktop, except the first item
            const overlapClass = i === 0 ? '' : 'md:-mt-16 lg:-mt-24';
            
            return (
              <div 
                key={i} 
                className={`cascade-card-wrapper w-full max-w-[800px] relative will-change-transform ${overlapClass} ${rotClass}`}
                style={{ zIndex: i + 1 }}
              >
                {/* Double-Bezel Outer Shell */}
                <div className="p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md group hover:-translate-y-2 hover:scale-[1.01] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  
                  {/* Double-Bezel Inner Core */}
                  <div className="relative bg-[#0d0d12]/95 backdrop-blur-3xl rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2.5rem-0.5rem)] p-8 md:p-16 overflow-hidden border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    
                    {/* Ambient Glow / Ethereal Glass element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-sage/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
                      
                      {/* Big Numerals */}
                      <div className="flex-shrink-0 text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white/5 select-none transform group-hover:-translate-y-2 transition-transform duration-700">
                        0{i + 1}
                      </div>

                      <div className="flex-col flex">
                        <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block">
                          {item.title}
                        </span>
                        
                        <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6 leading-[1.2]">
                          {item.subtitle}
                        </h3>
                        
                        <p className="text-base md:text-lg text-white/60 font-body leading-relaxed max-w-[45ch]">
                          {item.content}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
