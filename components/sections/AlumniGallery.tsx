'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Alumni {
  id: string;
  nama: string;
  tahunLulus: string;
  tujuan: string;
  testimoni: string;
  image: string;
}

interface AlumniGalleryProps {
  alumni: Alumni[];
}

export const AlumniGallery: React.FC<AlumniGalleryProps> = ({ alumni }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const isMobile = window.innerWidth < 768;
    
    const cardEls = gsap.utils.toArray<HTMLElement>('.alumni-card');
    cardEls.forEach((card, i) => {
      // Parallax effect on images is disabled to save GPU as requested earlier
      
      if (i === cardEls.length - 1) return; // Last card doesn't scale away
      
      if (!isMobile) {
        // The Z-Axis scale down (pushed into the background and fades out)
        gsap.to(card, {
          scale: 0.9,
          opacity: 0, // Fades out completely
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1], // Triggered by the arrival of the NEXT card
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      }
    });

    // Fade out header text as first card arrives
    if (headerRef.current && cardEls[0]) {
      gsap.to(headerRef.current, {
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
    <section id="alumni" className="relative bg-canvas-white">
      
      {/* Background Sticky Header */}
      <div ref={headerRef} className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-center z-0 pointer-events-none px-6 text-center">
        <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-heading font-bold tracking-tighter mb-6 text-charcoal-ink">
          Hall of Fame.
        </h2>
        <p className="text-xl md:text-2xl text-muted-steel font-accent italic max-w-2xl mx-auto">
          Mereka yang telah melangkah lebih jauh, membawa nilai-nilai abadi ke pentas global.
        </p>
      </div>

      {/* The Z-Axis Cascade Container */}
      <div ref={containerRef} className="relative z-10 w-full pb-24">
        
        {/* Spacer so the user can admire the title before the first card arrives */}
        <div className="h-[70vh] w-full pointer-events-none" />

        {alumni.map((a, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={a.id}
              className="alumni-card sticky top-0 min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 origin-top will-change-transform transform-gpu"
            >
              {/* Central Card */}
              <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl border border-charcoal-ink/5">
                
                {/* Photo Frame (Edge to Edge, No Border Padding) */}
                <div 
                  className={`relative w-full md:w-1/2 aspect-[3/4] overflow-hidden order-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}
                  style={{ borderRadius: isEven ? '3rem 1rem 3rem 1rem' : '1rem 3rem 1rem 3rem' }}
                >
                  <img 
                    src={a.image} 
                    alt={a.nama}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  />
                  
                  {/* Floating Badge */}
                  <div className={`absolute ${isEven ? '-right-4' : '-left-4'} top-12 z-20`}>
                    <div className="bg-accent-gold text-pure-surface text-xs font-mono font-bold tracking-widest uppercase py-3 px-6 shadow-xl transform -rotate-90 origin-bottom">
                      Class of '{a.tahunLulus.slice(-2)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-col w-full md:w-1/2 order-2 ${isEven ? 'md:order-2' : 'md:order-1'} pl-4 md:pl-8 border-l-2 border-accent-gold/30`}>
                  <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2 text-charcoal-ink">
                    {a.nama}
                  </h3>
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-steel mb-8">
                    {a.tujuan}
                  </div>
                  <blockquote className="font-accent italic text-xl md:text-2xl text-charcoal-ink/80 leading-relaxed">
                    &ldquo;{a.testimoni}&rdquo;
                  </blockquote>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
