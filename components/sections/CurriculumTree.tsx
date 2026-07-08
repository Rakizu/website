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
  const dropRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !dropRef.current) return;

    // Cinematic Waterfall Drop (golden liquid tail effect)
    gsap.fromTo(dropRef.current, 
      { y: -300 }, // Start fully above the track
      {
        y: () => container.current!.offsetHeight, // Travel all the way down
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top 40%",
          end: "bottom 80%",
          scrub: 1.5,
        }
      }
    );

    // Animate content nodes revealing with ultra-premium physics
    const nodes = container.current.querySelectorAll('.kurikulum-node');
    nodes.forEach((node, i) => {
      const isLeft = i % 2 === 0;
      const dot = node.querySelector('.timeline-dot');
      
      gsap.fromTo(node,
        { 
          opacity: 0, 
          x: isLeft ? -50 : 50,
          y: 40,
          filter: 'blur(12px)'
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 75%",
            once: true,
            onEnter: () => {
              if (dot) {
                gsap.to(dot, { 
                  scale: 1.6, 
                  backgroundColor: '#D4AF37', // accent-gold
                  borderColor: '#D4AF37',
                  boxShadow: '0 0 25px rgba(212,175,55,0.7)',
                  duration: 1,
                  ease: "back.out(2)"
                });
              }
            }
          }
        }
      );
    });

  }, { scope: container });

  // Map the CMS data into a unified array for the timeline
  const journey = [
    {
      nama: "Utama",
      waktu: kurikulum.konsep,
      fokus: "Sistem terpadu yang memastikan setiap jam yang dihabiskan siswa bernilai ibadah dan ilmu."
    },
    ...kurikulum.sesi
  ];

  return (
    <section 
      id="kurikulum"
      data-theme="light"
      ref={container}
      className="py-32 md:py-48 bg-canvas-white relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-32 md:mb-48 relative">
          <div className="inline-flex border border-charcoal-ink/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold mb-8 rounded-full bg-white shadow-sm">
            Struktur Pembelajaran
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.1] text-charcoal-ink mb-6">
            Proses Terpadu.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-steel max-w-[55ch] mx-auto font-body">
            Kurikulum kami dirancang untuk menyeimbangkan keunggulan akademik nasional dengan pembentukan karakter Islami yang kuat.
          </p>
        </div>

        {/* Center Line (Waterfall Drop) */}
        <div className="absolute left-[36px] md:left-1/2 top-56 bottom-0 w-[3px] md:-translate-x-1/2 z-0 overflow-hidden rounded-full">
          {/* Faint background track */}
          <div className="absolute inset-0 bg-charcoal-ink/5 w-full h-full" />
          
          {/* The Falling Drop */}
          <div 
            ref={dropRef}
            className="absolute top-0 left-0 w-full h-[200px] md:h-[300px] bg-gradient-to-b from-transparent via-accent-gold/60 to-accent-gold will-change-transform"
          >
            {/* The bright glowing head of the drop */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_4px_rgba(212,175,55,0.8)]" />
          </div>
        </div>

        {/* Nodes / Content */}
        <div className="relative z-10 flex flex-col gap-32 md:gap-40 pl-16 md:pl-0">
          
          {journey.map((s, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div 
                key={i}
                className={`kurikulum-node w-full md:w-1/2 relative ${isLeft ? 'md:pr-24 self-start text-left md:text-right' : 'md:pl-24 self-end text-left'}`}
              >
                {/* Mobile Dot */}
                <div className="timeline-dot md:hidden absolute left-[-64px] top-3 w-4 h-4 rounded-full bg-canvas-white border-[3px] border-charcoal-ink/20 shadow-sm will-change-transform" />
                {/* Desktop Dot */}
                <div className={`timeline-dot hidden md:block absolute ${isLeft ? 'right-[-8px]' : 'left-[-8px]'} top-4 w-4 h-4 rounded-full bg-canvas-white border-[3px] border-charcoal-ink/20 shadow-sm will-change-transform`} />
                
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-gold mb-4">
                  {i === 0 ? 'Konsep' : `Sesi ${s.nama}`}
                </h3>
                
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal-ink mb-6 tracking-tight leading-[1.2]">
                  {s.waktu}
                </h4>
                
                <p className={`text-base md:text-lg text-muted-steel font-body leading-relaxed max-w-[40ch] ${isLeft ? 'md:ml-auto' : ''}`}>
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
