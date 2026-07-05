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

interface HorizontalAlumniProps {
  alumni: Alumni[];
}

export const HorizontalAlumni: React.FC<HorizontalAlumniProps> = ({ alumni }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const items = sectionRef.current.querySelectorAll('.alumni-frame');
      gsap.fromTo(items,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
      return;
    }

    // Horizontal Scroll Logic
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

    // Inner Image Parallax while scrolling horizontally
    const images = sectionRef.current.querySelectorAll('.parallax-img');
    images.forEach(img => {
      gsap.to(img, {
        xPercent: 15, // Move image slightly right as container moves left
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: true,
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-canvas-white text-charcoal-ink overflow-hidden"
      id="alumni"
    >
      <div ref={containerRef} className="relative h-auto md:h-screen flex flex-col justify-center py-24 md:py-0">
        
        {/* Fixed Header */}
        <div className="absolute top-12 md:top-24 left-6 md:left-16 z-20">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-2 text-charcoal-ink">
            Hall of Fame.
          </h2>
          <p className="text-muted-steel font-accent italic text-lg max-w-sm">
            Mereka yang telah melangkah lebih jauh.
          </p>
        </div>

        {/* Horizontal Track */}
        <div 
          className="mt-40 md:mt-0 flex flex-col md:flex-row items-center gap-12 md:gap-32 px-6 md:px-32 md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-max"
          ref={trackRef}
        >
          {alumni.map((a, i) => {
            // Unique frame design: staggered heights, overlapping typography, film-like thin borders
            const isEven = i % 2 === 0;
            return (
              <div 
                key={a.id}
                className={`alumni-frame relative flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full md:w-[800px] shrink-0 ${isEven ? 'md:items-start' : 'md:items-end'}`}
              >
                {/* Unique Frame Mask */}
                <div 
                  className={`relative w-full md:w-[450px] overflow-hidden ${isEven ? 'aspect-[3/4]' : 'aspect-square'} border border-whisper-border bg-charcoal-ink p-2 md:p-4`}
                  style={{ borderRadius: isEven ? '2rem 0 2rem 0' : '0 2rem 0 2rem' }}
                >
                  <div className="w-full h-full overflow-hidden relative rounded-xl border border-white/10">
                    <img 
                      src={a.image} 
                      alt={a.nama}
                      className="parallax-img absolute inset-0 w-[120%] h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 origin-left"
                    />
                  </div>
                </div>

                {/* Overlapping Content */}
                <div className={`w-full md:w-[350px] flex flex-col ${isEven ? 'md:-mt-20' : 'md:mb-20'} relative z-10 bg-canvas-white md:bg-transparent p-6 md:p-0`}>
                  <div className="text-sm font-mono text-accent-gold tracking-widest mb-2 border-b border-accent-gold/30 pb-2 inline-block w-max">
                    ALUMNI &apos;{a.tahunLulus.slice(-2)}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-4">
                    {a.nama}
                  </h3>
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-steel mb-8">
                    {a.tujuan}
                  </div>
                  <blockquote className="font-accent italic text-xl md:text-2xl text-charcoal-ink leading-relaxed border-l-2 border-charcoal-ink pl-6">
                    &ldquo;{a.testimoni}&rdquo;
                  </blockquote>
                </div>
              </div>
            );
          })}
          
          <div className="hidden md:flex w-[300px] shrink-0 items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-steel">Akhir Galeri</span>
          </div>
        </div>

      </div>
    </section>
  );
};
