'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface ProgramUnggulanProps {
  programs: string[];
}

const mockPhotos = [
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1427504494785-389a05b509d6?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1590082729930-b3b44b80eec9?q=80&w=1600&auto=format&fit=crop"  
];

const programDetails = [
  "Eksplorasi sains tingkat lanjut dengan fasilitas laboratorium modern dan kurikulum riset terapan.",
  "Pendekatan analitis dan pemecahan masalah komprehensif berstandar olimpiade internasional.",
  "Program imersi intensif untuk kefasihan global dan persiapan sertifikasi TOEFL/IELTS.",
  "Penguasaan bahasa Al-Qur'an dan sastra timur tengah dengan penutur asli (native speaker).",
  "Program karantina dan sertifikasi hafalan 30 Juz dengan sanad bersambung."
];

export const ProgramUnggulan: React.FC<ProgramUnggulanProps> = ({ programs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Desktop only for intense GSAP Z-Axis physics, mobile degrades gracefully to native sticky stack
    const isMobile = window.innerWidth < 768;
    
    const cardEls = gsap.utils.toArray<HTMLElement>('.stack-card');
    cardEls.forEach((card, i) => {
      // Internal image parallax (subtle zoom out as you scroll down)
      const img = card.querySelector('.parallax-img');
      if (img && !isMobile) {
        gsap.fromTo(img, 
          { scale: 1.15 },
          { 
            scale: 1, 
            ease: "none", 
            scrollTrigger: {
               trigger: card,
               start: "top bottom",
               end: "top top",
               scrub: true
            } 
          }
        );
      }

      if (i === cardEls.length - 1) return; // Last card doesn't scale away
      
      if (!isMobile) {
        // The Z-Axis scale down (pushed into the background)
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.3,
          y: -50, // Slight upward drift as it gets buried
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1], // Triggered by the arrival of the NEXT card
            start: "top bottom",     // When next card touches bottom of viewport
            end: "top top",          // When next card reaches top and pins
            scrub: true,
          },
        });
      }
    });

    // Fade out background text as first card arrives
    if (bgTextRef.current && cardEls[0]) {
      gsap.to(bgTextRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardEls[0],
          start: "top 80%",
          end: "top 30%",
          scrub: true
        }
      });
    }

  }, { scope: containerRef });

  return (
    <section id="unggulan" className="relative bg-warm-50">
      
      {/* 1. Background Sticky Title (Anticipation Builder) */}
      <div ref={bgTextRef} className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-center z-0 pointer-events-none px-6 text-center will-change-transform">
         <h2 className="text-xs md:text-sm font-heading font-bold uppercase tracking-[0.4em] text-primary-700 mb-6">
           Pilar Pendidikan
         </h2>
         <h3 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter text-warm-900 leading-[1.1]">
           Program<br/>Unggulan
         </h3>
      </div>

      {/* 2. The Z-Axis Cascade Container */}
      <div ref={containerRef} className="relative z-10 w-full pb-24">
        
        {/* Spacer so the user can admire the title before the first card arrives */}
        <div className="h-[70vh] w-full pointer-events-none" />

        {programs.map((p, i) => (
          <div
            key={i}
            className="stack-card sticky top-0 min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 origin-top will-change-transform"
          >
            {/* Double-Bezel Massive Card */}
            <div className="w-full max-w-[1400px] h-[85vh] md:h-[90vh] rounded-[2rem] md:rounded-[2.5rem] bg-charcoal-ink p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden ring-1 ring-charcoal-ink/10">
              
              {/* Inner Core */}
              <div className="relative w-full h-full rounded-[calc(2rem-0.5rem)] md:rounded-[calc(2.5rem-0.75rem)] overflow-hidden bg-charcoal-ink group">
                
                {/* Parallax Image */}
                <Image 
                   src={mockPhotos[i % mockPhotos.length]} 
                   alt={p}
                   fill
                   className="parallax-img object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                   sizes="100vw"
                />
                
                {/* Cinematic Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/95 via-charcoal-ink/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-ink/80 via-transparent to-transparent opacity-80" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-20">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
                      
                      <div className="flex flex-col">
                        <span className="font-accent italic text-4xl md:text-6xl lg:text-7xl text-gold-300 mb-2 md:mb-4 drop-shadow-md">
                          0{i + 1}
                        </span>
                        <h4 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold uppercase tracking-tighter text-pure-surface drop-shadow-lg leading-[0.9]">
                          {p}
                        </h4>
                      </div>

                      <div className="md:w-1/3 shrink-0">
                        <p className="text-pure-surface/80 text-sm md:text-lg leading-relaxed font-body border-l border-gold-300/30 pl-4 md:pl-6 py-2">
                          {programDetails[i % programDetails.length]}
                        </p>
                      </div>

                   </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
