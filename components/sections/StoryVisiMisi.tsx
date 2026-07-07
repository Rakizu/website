'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const StoryVisiMisi = () => {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !textRef.current) return;

    // Split text into lines for dramatic waterfall reveal
    const lines = textRef.current.querySelectorAll('.story-line');
    
    gsap.fromTo(lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          once: true,
        }
      }
    );

    // Image subtle parallax
    gsap.to('.visi-image', {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: container });

  return (
    <section 
      ref={container}
      className="relative py-32 md:py-48 bg-pure-surface overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
        
        {/* Left Side: Editorial Image */}
        <div className="w-full lg:w-5/12 aspect-[3/4] relative overflow-hidden rounded-[2rem] bg-canvas-white">
        <div className="visi-image absolute inset-[-10%] w-[120%] h-[120%]">
            <Image 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" 
              alt="Perpustakaan Digital" 
              fill
              className="object-cover scale-110 sepia-[0.2] contrast-[1.1]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Side: Massive Serif Storytelling */}
        <div className="w-full lg:w-7/12 flex flex-col" ref={textRef}>
          <div className="story-line text-accent-sage font-semibold uppercase tracking-[0.25em] text-lg mb-12">
            Target Lulusan
          </div>
          
          <h2 className="font-accent italic text-4xl md:text-5xl lg:text-[4rem] text-charcoal-ink leading-[1.3] md:leading-[1.2] tracking-tight">
            <div className="story-line overflow-hidden pb-2">Tidak sekadar menguasai</div>
            <div className="story-line overflow-hidden pb-2">ilmu dunia, mereka adalah</div>
            <div className="story-line overflow-hidden pb-2 text-accent-sage">penerus yang sholeh,</div>
            <div className="story-line overflow-hidden pb-2">mandiri, dan berprestasi.</div>
          </h2>
          
          <div className="story-line mt-12 max-w-xl">
            <p className="text-muted-steel text-lg leading-relaxed font-body">
              Kami percaya setiap anak memiliki jalan cahayanya masing-masing. Tugas kami bukanlah menyeragamkan mereka, melainkan menuntun potensi unik mereka menjadi karya nyata di masa depan.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
