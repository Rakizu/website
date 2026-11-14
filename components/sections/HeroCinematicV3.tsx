'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematicV3 = () => {
  const container = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    // 1. Entrance Animation (Sync with GatePageV2 opening)
    const tl = gsap.timeline({ delay: 0.2 });

    gsap.set(imageRef.current, { scale: 1.05, opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 1 }); // Start pitch black
    gsap.set(eyebrowRef.current, { y: 20, opacity: 0 });
    gsap.set(titleRef.current, { y: 60, opacity: 0 });
    gsap.set(subtitleRef.current, { y: 20, opacity: 0 });

    tl.to(overlayRef.current, {
      opacity: 0.35, // Reveal image cleanly
      duration: 3,
      ease: 'power2.inOut'
    }, 0)
    .to(imageRef.current, {
      opacity: 1,
      scale: 1,
      duration: 3.5,
      ease: 'power3.out'
    }, 0)
    .to(eyebrowRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power3.out'
    }, 0.5)
    .to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.8,
      ease: 'power4.out'
    }, 0.6)
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power3.out'
    }, 0.8);

    // 2. Subtle Scroll Parallax
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    scrollTl.to(imageRef.current, {
      yPercent: 15,
      ease: 'none'
    }, 0);

    scrollTl.to(titleWrapperRef.current, {
      yPercent: -20,
      ease: 'none'
    }, 0);

    // 3. Scroll Indicator Continuous Animation
    if (scrollIndicatorRef.current) {
      gsap.fromTo(scrollIndicatorRef.current, 
        { yPercent: -100, opacity: 0 },
        { 
          yPercent: 200, 
          opacity: 1, 
          duration: 2, 
          ease: 'power1.inOut',
          repeat: -1,
          keyframes: {
            "0%": { opacity: 0 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0 }
          }
        }
      );
    }

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-[100dvh] bg-[#0a0806] overflow-hidden flex flex-col justify-center items-center">
      
      {/* ── SINGLE POWERFUL BACKGROUND IMAGE ── */}
      <div ref={imageRef} className="absolute inset-0 w-full h-[115%] -top-[7.5%] transform-gpu origin-center">
        <Image
          src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2000&auto=format&fit=crop"
          alt="SMP IT Thoriqul Jannah Campus"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ── CINEMATIC OVERLAY (Dark gradient for text contrast) ── */}
      <div ref={overlayRef} className="absolute inset-0 bg-[#0a0806] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/40 to-[#0a0806]/20 z-10 pointer-events-none" />
      
      {/* Smooth transition into the next canvas-white section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-canvas-white to-transparent z-20 pointer-events-none" />

      {/* ── ABSOLUTE TYPOGRAPHY LOCKUP ── */}
      <div ref={titleWrapperRef} className="relative z-30 flex flex-col items-center justify-center text-center px-6 w-full transform-gpu pointer-events-none">
        
        <div className="overflow-hidden mb-4 md:mb-6">
          <div ref={eyebrowRef} className="text-[#c79a45] font-body text-xs md:text-sm font-semibold uppercase tracking-[0.4em]">
            SMP IT
          </div>
        </div>
        
        <div className="overflow-hidden w-full">
          <h1 
            ref={titleRef} 
            className="font-heading font-bold text-[12vw] md:text-[9vw] leading-[0.9] tracking-[-0.02em] text-[#FDF6EC] uppercase"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.6)' }}
          >
            Thoriqul Jannah
          </h1>
        </div>

        <div className="overflow-hidden mt-6 md:mt-8">
          <p ref={subtitleRef} className="font-accent italic text-[#FDF6EC]/80 text-lg md:text-2xl tracking-wide max-w-xl mx-auto font-light" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            Membentuk generasi unggul yang berakar pada nilai spiritual.
          </p>
        </div>

      </div>

      {/* ── MINIMALIST SCROLL INDICATOR ── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-50 pointer-events-none">
        <span className="text-white font-body text-[9px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div ref={scrollIndicatorRef} className="absolute top-0 left-0 w-full h-1/2 bg-white" />
        </div>
      </div>

    </section>
  );
};
