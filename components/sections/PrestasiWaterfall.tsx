'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Prestasi {
  id: string;
  judul: string;
  tingkat: string;
  tahun: string;
}

interface PrestasiWaterfallProps {
  prestasi: Prestasi[];
}

export const PrestasiWaterfall: React.FC<PrestasiWaterfallProps> = ({ prestasi }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const cards = container.current.querySelectorAll('.prestasi-card');
    
    // Waterfall scatter reveal
    cards.forEach((card, i) => {
      // Create random offset for scatter effect
      const randomX = (i % 2 === 0 ? 1 : -1) * (Math.random() * 100 + 50);
      const randomY = Math.random() * 100 + 100;
      
      gsap.fromTo(card,
        { 
          x: randomX,
          y: randomY,
          opacity: 0,
          scale: 0.8,
          rotation: (Math.random() - 0.5) * 20 
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          delay: i * 0.1,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: container.current,
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-16 md:gap-32">
        
        {/* Fixed Header Column */}
        <div className="w-full md:w-5/12 shrink-0 md:sticky md:top-32 self-start">
          <span className="inline-block border-b border-charcoal-ink pb-2 mb-8 text-sm uppercase tracking-[0.25em] font-medium text-charcoal-ink">
            Hall of Fame
          </span>
          <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter text-charcoal-ink mb-6">
            Bukti Nyata.
          </h2>
          <p className="text-lg text-muted-steel leading-relaxed">
            Deretan prestasi yang mengukir sejarah dan membuktikan komitmen kami pada kualitas pendidikan.
          </p>
        </div>

        {/* Waterfall Cards Column */}
        <div className="w-full md:w-7/12 flex flex-col gap-8 md:pt-32">
          {prestasi.map((p, i) => (
            <div 
              key={p.id}
              className={`prestasi-card p-10 md:p-12 rounded-[2rem] bg-pure-surface border border-whisper-border shadow-sm hover:shadow-xl transition-shadow duration-500 ${i % 2 !== 0 ? 'md:ml-16' : ''}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-widest text-accent-gold font-medium">
                  {p.tingkat}
                </span>
                <div className="w-1 h-1 rounded-full bg-muted-steel/30" />
                <span className="text-xs font-mono text-muted-steel">
                  {p.tahun}
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-heading text-charcoal-ink">
                {p.judul}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
