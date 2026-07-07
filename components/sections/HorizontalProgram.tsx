'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalProgramProps {
  programs: string[];
}

const mockPhotos = [
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop", // IPA
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop", // Math
  "https://images.unsplash.com/photo-1546410531-ef4ce3ef648c?q=80&w=800&auto=format&fit=crop", // English
  "https://images.unsplash.com/photo-1584851212852-c827c15ff92f?q=80&w=800&auto=format&fit=crop", // Arabic
  "https://images.unsplash.com/photo-1606105417614-7264a780e060?q=80&w=800&auto=format&fit=crop"  // Tahfidz
];

export const HorizontalProgram: React.FC<HorizontalProgramProps> = ({ programs }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !trackRef.current || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const items = sectionRef.current.querySelectorAll('.program-item');
      gsap.fromTo(items,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
      return;
    }

    // Horizontal Scroll
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

    // Typography Parallax (Outline to Solid effect)
    const texts = sectionRef.current.querySelectorAll('.program-text');
    texts.forEach(text => {
      gsap.to(text, {
        color: 'var(--cream)',
        WebkitTextStroke: '0px transparent',
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          containerAnimation: gsap.getById("programScroll"),
          start: "left center",
          end: "right center",
          scrub: true,
        }
      });
    });

    // Image strong parallax to give depth
    const images = sectionRef.current.querySelectorAll('.arch-img');
    images.forEach(img => {
      gsap.to(img, {
        xPercent: 20,
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
      className="relative bg-charcoal-ink text-pure-surface overflow-hidden"
      id="unggulan"
    >
      <div ref={containerRef} className="relative h-auto md:h-screen flex flex-col justify-center py-24 md:py-0">
        
        {/* Fixed Header */}
        <div className="absolute top-12 md:top-24 left-6 md:left-16 z-20">
          <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-accent-gold mb-2">
            Program Unggulan
          </h2>
          <p className="text-muted-steel font-body max-w-sm">
            Kurikulum yang dirancang khusus untuk memacu keunggulan spesifik tiap siswa.
          </p>
        </div>

        {/* Scroll Track */}
        <div 
          className="mt-32 md:mt-0 flex flex-col md:flex-row items-center px-6 md:px-32 md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-max"
          ref={trackRef}
        >
          {programs.map((p, i) => (
            <div 
              key={i}
              className="program-item relative flex items-center md:mr-32 group cursor-default shrink-0 my-6 md:my-0"
            >
              {/* Unique Arch Window Frame overlapping the massive text */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-[15%] top-1/2 -translate-y-1/2 w-[220px] md:w-[320px] aspect-[1/1.5] z-10 overflow-hidden border border-white/10 opacity-90 hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto rounded-[10rem_10rem_1rem_1rem]"
              >
                <img 
                  src={mockPhotos[i % mockPhotos.length]} 
                  alt={p}
                  className="arch-img w-[130%] h-full object-cover origin-left"
                />
                {/* Vintage overlay tint */}
                <div className="absolute inset-0 bg-accent-gold/10"></div>
              </div>

              {/* Number Kicker */}
              <div className="relative z-20 text-xl md:text-3xl font-accent italic text-accent-gold mr-4 md:mr-10 md:-mt-16 bg-charcoal-ink/90 p-2 rounded-full hidden md:block">
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Massive Typography Backdrop */}
              <h3 
                className="program-text relative z-0 text-5xl md:text-[8rem] lg:text-[10rem] font-heading font-bold tracking-tighter uppercase whitespace-nowrap transition-colors duration-500 text-transparent [-webkit-text-stroke:1.5px_rgba(113,113,122,0.4)] hover:text-cream hover:[-webkit-text-stroke:0px_transparent]"
              >
                {p}
              </h3>
            </div>
          ))}
          
          <div className="hidden md:flex w-[200px] shrink-0 items-center justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-steel">Lanjut ke bawah</span>
          </div>
        </div>

      </div>
    </section>
  );
};
