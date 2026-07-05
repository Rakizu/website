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

interface AlumniStackProps {
  alumni: Alumni[];
}

export const AlumniStack: React.FC<AlumniStackProps> = ({ alumni }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Card Stacking Logic using GSAP
    const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
    
    // We want the total scroll duration to be proportional to the number of cards
    // The section needs to be pinned
    
    // Actually, ScrollTrigger has a native way to do this if we pin each card.
    // Or we pin the container, and move the cards up sequentially.
    
    // Let's use the simplest method: Pin the section, and animate the cards overlapping.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${cards.length * 100}%`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Assume all cards are position: absolute, top: 100vh initially (except the first one).
    // Actually, they are absolute, and we just animate their `y` or `top`.
    
    cards.forEach((card, i) => {
      if (i > 0) {
        // Bring the card up from the bottom
        tl.fromTo(card,
          { yPercent: 100 },
          { yPercent: 0, ease: "none", duration: 1 },
          i * 1 // Start at 1, 2, 3...
        );
      }
      
      // Scale down and darken the PREVIOUS cards when a new card comes up over them
      if (i < cards.length - 1) {
        // Find all cards that are below the new one (0 to i)
        for (let j = 0; j <= i; j++) {
          tl.to(cards[j], {
            scale: 1 - ((i - j + 1) * 0.05), // Scale down by 5% each time
            filter: `brightness(${100 - ((i - j + 1) * 20)}%)`, // Darken
            ease: "none",
            duration: 1
          }, (i + 1) * 1); // Animate concurrently with the new card rising
        }
      }
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-canvas-white overflow-hidden"
      id="alumni"
    >
      <div className="absolute inset-0 z-0">
        {alumni.map((a, i) => {
          return (
            <div 
              key={a.id}
              className="stack-card absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-12 origin-top"
              style={{
                zIndex: i + 1,
                // Only the first card is visible at start, others are pushed down via GSAP (fromTo)
              }}
            >
              {/* Card Container */}
              <div className="relative w-full h-full max-w-[1400px] bg-charcoal-ink text-pure-surface rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
                
                {/* Left: Image with Parallax */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                  <img 
                    src={a.image} 
                    alt={a.nama}
                    className="absolute inset-0 w-full h-full object-cover sepia-[0.3] contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink via-transparent to-transparent md:hidden"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-ink hidden md:block"></div>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-20 flex flex-col justify-center relative z-10 bg-charcoal-ink md:bg-transparent">
                  
                  <div className="text-xs font-mono text-accent-gold tracking-[0.3em] mb-4 uppercase">
                    Alumni Showcase &apos;{a.tahunLulus.slice(-2)}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-4 text-white">
                    {a.nama}
                  </h3>
                  
                  <div className="text-sm uppercase tracking-[0.2em] text-white/50 mb-8 border-b border-white/10 pb-4 inline-block w-max">
                    {a.tujuan}
                  </div>
                  
                  <blockquote className="font-accent italic text-xl md:text-3xl text-pure-surface/90 leading-relaxed border-l-2 border-accent-gold pl-6">
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
