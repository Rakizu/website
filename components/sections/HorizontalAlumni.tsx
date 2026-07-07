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
          y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
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
        scrub: 1, // Smooth scrub
        pin: true,
        anticipatePin: 1,
      }
    });

    // Inner Image Parallax while scrolling horizontally
    const images = sectionRef.current.querySelectorAll('.parallax-img');
    images.forEach(img => {
      gsap.to(img, {
        xPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1,
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
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

      <div ref={containerRef} className="relative h-auto md:h-screen flex flex-col justify-center py-24 md:py-0">
        
        {/* Fixed Header */}
        <div className="absolute top-12 md:top-24 left-6 md:left-16 z-20">
          <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-heading font-bold tracking-tighter mb-2 text-charcoal-ink leading-none">
            Hall of Fame<span className="text-accent-gold">.</span>
          </h2>
          <p className="text-muted-steel font-accent italic text-xl md:text-2xl mt-4 max-w-md">
            Mereka yang telah melangkah lebih jauh, membawa nilai-nilai abadi ke pentas global.
          </p>
        </div>

        {/* Horizontal Track */}
        <div 
          className="mt-40 md:mt-0 flex flex-col md:flex-row items-center gap-16 md:gap-40 px-6 md:px-40 md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-max"
          ref={trackRef}
        >
          {alumni.map((a, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={a.id}
                className={`alumni-frame relative flex flex-col md:flex-row items-center gap-8 md:gap-0 w-full md:w-[900px] shrink-0 ${isEven ? 'md:items-start' : 'md:items-end'}`}
              >
                {/* Unique Frame Mask */}
                <div 
                  className={`relative w-full md:w-[480px] overflow-hidden ${isEven ? 'aspect-[3/4]' : 'aspect-square'} bg-charcoal-ink p-3 shadow-2xl z-10 transition-transform duration-700 hover:scale-[1.02]`}
                  style={{ 
                    borderRadius: isEven ? '4rem 1rem 4rem 1rem' : '1rem 4rem 1rem 4rem',
                  }}
                >
                  <div className="w-full h-full overflow-hidden relative rounded-3xl md:rounded-[3rem] border border-white/20">
                    <img 
                      src={a.image} 
                      alt={a.nama}
                      className="parallax-img absolute inset-0 w-[120%] h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 origin-left"
                    />
                  </div>
                </div>

                {/* Overlapping Content Box */}
                <div 
                  className={`w-full md:w-[450px] flex flex-col ${isEven ? 'md:-ml-20 md:mt-32' : 'md:-ml-20 md:mb-32'} relative z-20 bg-white p-8 md:p-12 shadow-md border border-charcoal-ink/5`}
                  style={{ borderRadius: isEven ? '1rem 3rem 1rem 3rem' : '3rem 1rem 3rem 1rem' }}
                >
                  <div className="text-xs md:text-sm font-mono text-accent-gold tracking-[0.3em] mb-4 uppercase font-semibold">
                    Class of '{a.tahunLulus.slice(-2)}
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter mb-2 text-charcoal-ink">
                    {a.nama}
                  </h3>
                  
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-muted-steel mb-8">
                    {a.tujuan}
                  </div>
                  
                  <blockquote className="font-accent italic text-lg md:text-xl text-charcoal-ink/80 leading-relaxed border-l-2 border-accent-gold pl-6">
                    &ldquo;{a.testimoni}&rdquo;
                  </blockquote>
                </div>
              </div>
            );
          })}
          
          <div className="hidden md:flex w-[400px] shrink-0 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-px bg-charcoal-ink/20" />
              <span className="text-sm font-mono uppercase tracking-[0.4em] text-charcoal-ink/50">Akhir Galeri</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
