'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ProgramUnggulanProps {
  programs: string[];
}

const mockPhotos = [
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop", // IPA (0)
  "https://images.unsplash.com/photo-1632516643720-e7f5d7d6eca8?q=80&w=800&auto=format&fit=crop", // Math (1)
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop", // English (2)
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800&auto=format&fit=crop", // Arabic (3)
  "https://images.unsplash.com/photo-1590082729930-b3b44b80eec9?q=80&w=800&auto=format&fit=crop"  // Tahfidz (4)
];

export const ProgramUnggulan: React.FC<ProgramUnggulanProps> = ({ programs }) => {
  const containerRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !leftRef.current || !rightRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const items = gsap.utils.toArray('.mobile-item') as HTMLElement[];
      items.forEach(item => {
        gsap.fromTo(item,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );
      });
      return;
    }

    const rightList = rightRef.current;
    const totalItems = programs.length;
    
    // Exact height per item ensures perfect centering math
    const itemHeight = window.innerHeight;
    const scrollDistance = (totalItems - 1) * itemHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1, 
        pin: true,
        anticipatePin: 1,
      }
    });

    // Scroll the list (must be exactly duration 1 to sync with absolute timeline math)
    tl.to(rightList, {
      y: -scrollDistance,
      ease: "none",
      duration: 1
    }, 0);

    const images = leftRef.current.querySelectorAll('.program-img');
    const textItems = rightList.querySelectorAll('.program-item');

    images.forEach((img, i) => {
      if (i === 0) return; 
      
      // Image crossfade starts halfway from previous item and finishes exactly when this item is centered
      const start = (i - 0.5) / (totalItems - 1);
      const end = i / (totalItems - 1);
      
      tl.fromTo(img, 
        { opacity: 0, scale: 1.1 },
        { 
          opacity: 1, 
          scale: 1,
          ease: "power2.inOut",
          duration: end - start,
        },
        start
      );
    });

    textItems.forEach((item, i) => {
      const activePoint = i / (totalItems - 1);
      
      if (i !== 0) gsap.set(item, { opacity: 0.15, x: 20 });
      else gsap.set(item, { opacity: 1, x: 0 });

      if (i > 0) {
        tl.to(item, { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" }, activePoint - 0.2);
      }
      if (i < totalItems - 1) {
        tl.to(item, { opacity: 0.15, x: 20, duration: 0.2, ease: "power2.in" }, activePoint + 0.1);
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative bg-charcoal-ink text-pure-surface overflow-hidden md:h-screen"
      id="unggulan"
    >
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Left Side: Pinned Cinematic Images */}
        <div 
          ref={leftRef}
          className="hidden md:block w-1/2 h-full relative overflow-hidden"
        >
          {programs.map((p, i) => (
            <div 
              key={i} 
              className="program-img absolute inset-0 w-full h-full"
              style={{ zIndex: i }}
            >
              <img 
                src={mockPhotos[i % mockPhotos.length]} 
                alt={p}
                className="w-full h-full object-cover grayscale-[30%] sepia-[0.1]"
              />
              <div className="absolute inset-0 bg-charcoal-ink/40 mix-blend-multiply" />
            </div>
          ))}
          
          <div className="absolute bottom-12 left-12 z-50">
             <h2 className="text-sm font-heading font-bold uppercase tracking-[0.4em] text-pure-surface/70 drop-shadow-lg">
              Program Unggulan Sekolah
            </h2>
          </div>
        </div>

        {/* Right Side: Scrolling Typography List */}
        <div className="w-full md:w-1/2 h-full relative">
          
          <div 
            ref={rightRef}
            className="flex flex-col"
          >
            {programs.map((p, i) => (
              <div key={i} className="program-item mobile-item flex flex-col justify-center min-h-[50vh] md:h-screen px-8 md:px-16 lg:px-24">
                
                <div className="md:hidden w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8">
                  <img src={mockPhotos[i % mockPhotos.length]} alt={p} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center">
                  <h3 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold tracking-tighter uppercase leading-[0.9]">
                    {p}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          
        </div>

      </div>
    </section>
  );
};
