'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!container.current || !pathRef.current) return;

    // Calculate exact path length for drawing animation
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { 
      strokeDasharray: length, 
      strokeDashoffset: length 
    });

    // Animate path drawing on scroll
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top center",
        end: "bottom 80%",
        scrub: 1,
      }
    });

    // Animate content nodes revealing as the line reaches them
    const nodes = container.current.querySelectorAll('.kurikulum-node');
    nodes.forEach((node, i) => {
      gsap.fromTo(node,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 60%",
            once: true,
          }
        }
      );
    });

  }, { scope: container });

  return (
    <section 
      ref={container}
      className="py-32 md:py-48 bg-canvas-white relative overflow-hidden"
    >
      <div className="max-w-[1000px] mx-auto px-6 md:px-16 relative">
        
        {/* Header */}
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.1] text-charcoal-ink mb-6">
            Proses.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-steel max-w-[65ch] mx-auto">
            Kurikulum kami dirancang untuk menyeimbangkan keunggulan akademik nasional dengan pembentukan karakter Islami yang kuat.
          </p>
        </div>

        {/* Center SVG Line (The "Tree" or "Journey") */}
        <div className="absolute left-[24px] md:left-1/2 top-48 bottom-0 w-[2px] md:-translate-x-1/2 z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 2 1000">
            <path 
              ref={pathRef}
              d="M1 0V1000" 
              stroke="#D4AF37" // accent-gold
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          {/* Faint background line */}
          <div className="absolute inset-0 bg-whisper-border w-full h-full -z-10" />
        </div>

        {/* Nodes / Content */}
        <div className="relative z-10 flex flex-col gap-24 md:gap-48 pl-12 md:pl-0">
          
          {/* Node 1: Konsep Dasar */}
          <div className="kurikulum-node w-full md:w-1/2 md:pr-16 self-start text-left md:text-right">
            <div className="md:hidden absolute left-[-48px] top-2 w-4 h-4 rounded-full bg-canvas-white border-2 border-accent-gold" />
            <div className="hidden md:block absolute right-[-8px] top-2 w-4 h-4 rounded-full bg-canvas-white border-2 border-accent-gold" />
            
            <h3 className="text-sm font-medium uppercase tracking-widest text-accent-gold mb-4">
              Konsep Utama
            </h3>
            <div className="text-2xl md:text-3xl font-heading text-charcoal-ink mb-4">
              {kurikulum.konsep}
            </div>
            <p className="text-muted-steel leading-relaxed text-sm md:text-base max-w-[65ch] md:ml-auto">
              Sistem terpadu yang memastikan setiap jam yang dihabiskan siswa bernilai ibadah dan ilmu.
            </p>
          </div>

          {/* Node 2 & 3: Sesi (Mapped) */}
          {kurikulum.sesi.map((s, i) => {
            const isLeft = i % 2 !== 0; // Alternating layout
            return (
              <div 
                key={s.nama}
                className={`kurikulum-node w-full md:w-1/2 ${isLeft ? 'md:pr-16 self-start text-left md:text-right' : 'md:pl-16 self-end text-left'}`}
              >
                <div className={`md:hidden absolute left-[-48px] top-2 w-4 h-4 rounded-full bg-canvas-white border-2 border-accent-gold`} />
                <div className={`hidden md:block absolute ${isLeft ? 'right-[-8px]' : 'left-[-8px]'} top-2 w-4 h-4 rounded-full bg-canvas-white border-2 border-accent-gold`} />
                
                <h3 className="text-sm font-medium uppercase tracking-widest text-accent-gold mb-4">
                  Sesi {s.nama}
                </h3>
                <div className="text-xl md:text-2xl font-heading text-charcoal-ink mb-3">
                  {s.waktu}
                </div>
                <p className={`text-muted-steel leading-relaxed text-sm md:text-base max-w-[65ch] ${isLeft ? 'md:ml-auto' : ''}`}>
                  {s.fokus}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
