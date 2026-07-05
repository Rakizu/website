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
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop", // IPA
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop", // Math
  "https://images.unsplash.com/photo-1546410531-ef4ce3ef648c?q=80&w=800&auto=format&fit=crop", // English
  "https://images.unsplash.com/photo-1584851212852-c827c15ff92f?q=80&w=800&auto=format&fit=crop", // Arabic
  "https://images.unsplash.com/photo-1606105417614-7264a780e060?q=80&w=800&auto=format&fit=crop"  // Tahfidz
];

export const ProgramUnggulan: React.FC<ProgramUnggulanProps> = ({ programs }) => {
  const containerRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !leftRef.current || !rightRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile fallback: Simple vertical fade in
      const items = gsap.utils.toArray('.mobile-item') as HTMLElement[];
      items.forEach(item => {
        gsap.fromTo(item,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );
      });
      return;
    }

    // Desktop: Split Screen Pinned Scrolling
    const rightList = rightRef.current;
    
    // Calculate how far to scroll the right list
    // We want to pin the container, and scroll the right list up
    const scrollDistance = rightList.scrollHeight - window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Animate the right list scrolling up
    tl.to(rightList, {
      y: -scrollDistance,
      ease: "none"
    });

    // Image swapping logic based on scroll progress
    const images = leftRef.current.querySelectorAll('.program-img');
    const textItems = rightList.querySelectorAll('.program-text');
    const totalItems = programs.length;

    // We can use a simple stagger or just tie opacity to specific progress points
    // But since it's a scrubbed timeline, we can create individual tweens for each image
    
    images.forEach((img, i) => {
      if (i === 0) return; // First image is visible by default
      
      const startTrigger = i / totalItems;
      const endTrigger = (i + 0.1) / totalItems;

      tl.fromTo(img, 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          ease: "none",
          duration: endTrigger - startTrigger, // Fraction of the timeline
        },
        startTrigger // Absolute time in timeline (fraction)
      );
    });

    // Text highlighting logic
    textItems.forEach((text, i) => {
      const startTrigger = (i - 0.5) / totalItems;
      const activeTrigger = i / totalItems;
      const endTrigger = (i + 0.5) / totalItems;

      // Ensure first item starts active
      if (i !== 0) {
        gsap.set(text, { color: 'rgba(255, 255, 255, 0.2)' });
      } else {
        gsap.set(text, { color: 'rgba(255, 255, 255, 1)' });
      }

      // Add color changes to timeline using absolute position based on scroll fraction
      if (i > 0) {
        tl.to(text, {
          color: 'rgba(255, 255, 255, 1)',
          duration: 0.1,
          ease: "none"
        }, activeTrigger); // Using fraction 0-1
      }
      
      if (i < totalItems - 1) {
        tl.to(text, {
          color: 'rgba(255, 255, 255, 0.2)',
          duration: 0.1,
          ease: "none"
        }, endTrigger);
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
        
        {/* Left Side: Pinned Cinematic Images (Desktop only) */}
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
                className="w-full h-full object-cover sepia-[0.2]"
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-charcoal-ink/30 mix-blend-multiply"></div>
            </div>
          ))}
          
          <div className="absolute top-12 left-16 z-50">
             <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-accent-gold mb-2 drop-shadow-md">
              Program Unggulan
            </h2>
          </div>
        </div>

        {/* Right Side: Scrolling Typography List */}
        <div className="w-full md:w-1/2 h-full relative">
          
          <div 
            ref={rightRef}
            className="flex flex-col pt-[30vh] pb-[50vh] px-8 md:px-20"
          >
            {/* Mobile Header */}
            <h2 className="md:hidden text-xs font-mono uppercase tracking-[0.4em] text-accent-gold mb-12">
              Program Unggulan
            </h2>

            {programs.map((p, i) => (
              <div key={i} className="mobile-item flex flex-col justify-center min-h-[50vh] md:min-h-0 md:mb-[30vh]">
                
                {/* Mobile Image (hidden on desktop) */}
                <div className="md:hidden w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8">
                  <img src={mockPhotos[i % mockPhotos.length]} alt={p} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-start gap-4 md:gap-8">
                  <span className="text-sm md:text-xl font-mono text-accent-gold mt-2 md:mt-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="program-text text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter uppercase leading-[0.9]">
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
