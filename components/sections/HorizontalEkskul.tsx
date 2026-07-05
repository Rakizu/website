'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Ekskul {
  id: string;
  nama: string;
  deskripsi: string;
}

interface HorizontalEkskulProps {
  ekskul: Ekskul[];
}

export const HorizontalEkskul: React.FC<HorizontalEkskulProps> = ({ ekskul }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: subtle fade up
      const items = sectionRef.current.querySelectorAll('.ekskul-item');
      gsap.fromTo(items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
      return;
    }

    // Desktop: Horizontal Scroll
    const trackWidth = trackRef.current.scrollWidth;
    const sectionWidth = containerRef.current.offsetWidth;
    const scrollDistance = trackWidth - sectionWidth;

    gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-charcoal-ink text-pure-surface overflow-hidden"
    >
      <div ref={containerRef} className="relative h-auto md:h-screen flex flex-col justify-center py-24 md:py-0">
        
        {/* Header Title (Fixed position during pin on desktop) */}
        <div className="absolute top-12 md:top-24 left-6 md:left-16 z-20">
          <h2 className="text-4xl md:text-6xl font-heading tracking-tight mb-2">
            Minat & Bakat
          </h2>
          <p className="text-muted-steel font-body max-w-sm">
            Eksplorasi potensi di luar kelas akademik.
          </p>
        </div>

        {/* Scroll Track */}
        <div 
          className="mt-32 md:mt-0 flex flex-col md:flex-row gap-6 md:gap-12 px-6 md:px-16 md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-max"
          ref={trackRef}
        >
          {ekskul.map((e, i) => (
            <div 
              key={e.id}
              className="ekskul-item w-full md:w-[400px] aspect-[4/5] bg-canvas-white/5 border border-whisper-border/20 rounded-[2rem] p-10 flex flex-col justify-between group hover:bg-canvas-white/10 transition-colors duration-500 shrink-0"
            >
              <div className="text-5xl font-accent italic text-accent-gold/40 mb-8">
                {String(i + 1).padStart(2, '0')}
              </div>
              
              <div>
                <h3 className="text-3xl font-heading mb-4 group-hover:text-accent-gold transition-colors duration-500">
                  {e.nama}
                </h3>
                <p className="text-muted-steel leading-relaxed">
                  {e.deskripsi}
                </p>
              </div>
            </div>
          ))}
          
          <div className="hidden md:flex w-[200px] shrink-0 items-center justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-steel">Scroll untuk lanjut</span>
          </div>
        </div>

      </div>
    </section>
  );
};
