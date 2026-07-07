'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Ekskul {
  id: string;
  nama: string;
  deskripsi: string;
}

const mockImages = [
  "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=800&auto=format&fit=crop", // Pramuka
  "https://images.unsplash.com/photo-1609599006353-e629aaab315d?q=80&w=800&auto=format&fit=crop", // Klub Tahfidz
  "https://images.unsplash.com/photo-1546410531-bea518040081?q=80&w=800&auto=format&fit=crop", // English Club
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=800&auto=format&fit=crop", // Science Club
  "https://images.unsplash.com/photo-1518605368461-1e12d6a5674d?q=80&w=800&auto=format&fit=crop"  // Olahraga
];

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
              className="ekskul-item relative w-full md:w-[440px] aspect-[4/5] rounded-[2.5rem] p-10 flex flex-col justify-end group overflow-hidden shadow-2xl shrink-0"
            >
              {/* Background Mock Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image 
                  src={mockImages[i % mockImages.length]} 
                  alt={e.nama}
                  fill
                  className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 440px"
                />
              </div>
              
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink via-charcoal-ink/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h3 className="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-4 text-white group-hover:text-accent-gold transition-colors duration-500">
                  {e.nama}
                </h3>
                <p className="text-muted-steel leading-relaxed text-sm md:text-base max-w-[90%]">
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
