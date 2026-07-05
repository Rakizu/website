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
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Parallax effect on images
    const images = sectionRef.current.querySelectorAll('.parallax-img');
    images.forEach(img => {
      gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });

    // Reveal animation for cards
    const cards = sectionRef.current.querySelectorAll('.alumni-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="py-32 md:py-48 bg-canvas-white relative overflow-hidden"
      id="alumni"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* Header */}
        <div className="text-center mb-24 md:mb-40">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-6 text-charcoal-ink">
            Hall of Fame.
          </h2>
          <p className="text-xl text-muted-steel font-accent italic max-w-2xl mx-auto">
            Mereka yang telah melangkah lebih jauh, membawa nilai-nilai abadi ke pentas global.
          </p>
        </div>

        {/* Asymmetrical Vertical Masonry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-24 md:gap-y-48">
          {alumni.map((a, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={a.id} 
                className={`alumni-card flex flex-col gap-8 ${isEven ? 'md:mt-0' : 'md:mt-48'}`}
              >
                {/* Photo Frame */}
                <div 
                  className="relative w-full aspect-[3/4] overflow-hidden bg-charcoal-ink p-2 shadow-2xl"
                  style={{ borderRadius: isEven ? '3rem 1rem 3rem 1rem' : '1rem 3rem 1rem 3rem' }}
                >
                  <div className="w-full h-full relative overflow-hidden rounded-3xl border border-white/20">
                    <img 
                      src={a.image} 
                      alt={a.nama}
                      className="parallax-img absolute -top-[10%] left-0 w-full h-[120%] object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700 origin-center"
                    />
                  </div>
                  
                  {/* Floating Badge */}
                  <div className={`absolute ${isEven ? '-right-4' : '-left-4'} top-12 z-20`}>
                    <div className="bg-accent-gold text-pure-surface text-xs font-mono font-bold tracking-widest uppercase py-3 px-6 shadow-xl transform -rotate-90 origin-bottom">
                      Class of '{a.tahunLulus.slice(-2)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col pl-4 border-l-2 border-accent-gold/30">
                  <h3 className="text-4xl font-heading font-bold tracking-tight mb-2 text-charcoal-ink">
                    {a.nama}
                  </h3>
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-steel mb-6">
                    {a.tujuan}
                  </div>
                  <blockquote className="font-accent italic text-lg text-charcoal-ink/80 leading-relaxed">
                    &ldquo;{a.testimoni}&rdquo;
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
