'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematicV2 = () => {
  const container = useRef<HTMLElement>(null);
  const bgImage = useRef<HTMLDivElement>(null);
  const floatImage = useRef<HTMLDivElement>(null);
  const textThoriqul = useRef<HTMLSpanElement>(null);
  const textJannah = useRef<HTMLSpanElement>(null);
  const editorialText = useRef<HTMLDivElement>(null);
  const floatingText = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    // 1. Entrance Animation (Plays right after GatePage finishes)
    const tl = gsap.timeline({ delay: 0.2 }); // slight delay to sync with gate opening
    
    gsap.set(bgImage.current, { scale: 1.08, opacity: 0 });
    gsap.set(floatImage.current, { yPercent: 40, opacity: 0, rotate: -5 });
    gsap.set([textThoriqul.current, textJannah.current], { yPercent: 120, opacity: 0, rotate: 5 });
    gsap.set([editorialText.current, floatingText.current], { opacity: 0 });

    tl.to(bgImage.current, {
      scale: 1,
      opacity: 1,
      duration: 2.4,
      ease: 'power3.out'
    }, 0)
    .to(textThoriqul.current, {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: 2,
      ease: 'expo.out'
    }, 0.5)
    .to(textJannah.current, {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: 2,
      ease: 'expo.out'
    }, 0.7)
    .to(floatImage.current, {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: 2.5,
      ease: 'power4.out'
    }, 1.0)
    .to([editorialText.current, floatingText.current], {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 1.5);

    // 2. Extreme Multi-Layer Parallax Scroll
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Background moves up slowly (creates depth)
    scrollTl.to(bgImage.current, {
      yPercent: 15,
      ease: 'none'
    }, 0);

    // Text moves up at medium speed
    scrollTl.to([textThoriqul.current, textJannah.current], {
      yPercent: -50,
      ease: 'none'
    }, 0);

    // Floating image moves up VERY fast (foreground effect)
    scrollTl.to(floatImage.current, {
      yPercent: -120,
      ease: 'none'
    }, 0);

    // Micro-details fade out quickly
    scrollTl.to([editorialText.current, floatingText.current], {
      opacity: 0,
      y: -30,
      ease: 'none'
    }, 0);

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full min-h-[100dvh] bg-[#0a0806] overflow-hidden pt-20">
      
      {/* ── BACKGROUND LAYER (Z-0) ── */}
      <div ref={bgImage} className="absolute inset-0 w-full h-[120%] -top-[10%] transform-gpu origin-center pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2000&auto=format&fit=crop"
          alt="School Environment"
          fill
          priority
          className="object-cover opacity-35"
        />
        {/* Gradients to blend into the darkness and into the next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-canvas-white via-canvas-white/40 to-transparent" />
      </div>

      {/* ── TYPOGRAPHY LAYER (Z-10) ── */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-4 z-10 pt-12 md:pt-0">
        <div className="relative w-full max-w-[1400px] mx-auto flex flex-col items-center">
          <h1 className="flex flex-col items-center justify-center w-full relative">
            
            <div className="overflow-hidden w-full flex justify-center">
              <span 
                ref={textThoriqul} 
                className="block font-heading font-bold text-[19vw] md:text-[15vw] leading-[0.85] tracking-[-0.04em] text-white/5 uppercase select-none transform-gpu" 
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}
              >
                Thoriqul
              </span>
            </div>
            
            <div className="overflow-hidden w-full flex justify-center -mt-[6vw] md:-mt-[4vw] z-30">
              <span 
                ref={textJannah} 
                className="block font-heading font-bold text-[19vw] md:text-[15vw] leading-[0.85] tracking-[-0.04em] uppercase select-none transform-gpu" 
                style={{ 
                  background: 'linear-gradient(135deg, #f5e4a8 0%, #e3c179 30%, #c79a45 65%, #b08935 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))'
                }}
              >
                Jannah
              </span>
            </div>

          </h1>
        </div>
      </div>

      {/* ── FOREGROUND FLOATING IMAGE (Z-20) ── */}
      <div className="absolute top-[55%] md:top-[45%] right-[5%] md:right-[15%] w-[45vw] md:w-[22vw] aspect-[3/4] z-20 pointer-events-none transform-gpu">
        <div ref={floatImage} className="w-full h-full relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
          {/* Subtle light reflection on the card edge */}
          <div className="absolute inset-0 rounded-[2rem] border border-white/20 pointer-events-none z-10" />
          <Image
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
            alt="Student Excellence"
            fill
            className="object-cover sepia-[0.15] hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>
      </div>

      {/* ── FOREGROUND FLOATING TEXT (Z-20) ── */}
      <div ref={floatingText} className="absolute top-[40%] md:top-[35%] left-[8%] md:left-[12%] max-w-[280px] md:max-w-[360px] z-20 pointer-events-none">
         <p className="font-accent italic text-white/90 text-[17px] md:text-[21px] leading-[1.5] border-l-2 border-[#c79a45] pl-5 py-1" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
           Merajut keunggulan akademik dengan akar spiritual yang kuat.
         </p>
      </div>

      {/* ── EDITORIAL DETAILS (Z-30) ── */}
      <div ref={editorialText} className="absolute bottom-12 left-0 w-full px-6 md:px-16 flex justify-between items-end z-30 pointer-events-none">
        
        <div className="flex flex-col gap-2">
          <div className="text-[#c79a45] font-body text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-bold drop-shadow-md">
            Yayasan Islam Terpadu
          </div>
          <div className="text-white/40 font-body text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
            Sinjai, Sulawesi Selatan
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-white/40 font-body text-[8px] md:text-[9px] uppercase tracking-[0.3em] writing-vertical-rl rotate-180">
            Scroll to explore
          </span>
          <div className="w-px h-16 md:h-20 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#c79a45] animate-[scrollLine_2s_ease-in-out_infinite]" />
          </div>
        </div>

      </div>

      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
