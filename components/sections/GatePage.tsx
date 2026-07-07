'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

const wordsData = [
  { text: "Sholeh", className: "font-heading font-bold" },
  { text: "Mandiri", className: "font-accent italic font-light" },
  { text: "Kreatif", className: "font-heading font-bold" },
  { text: "Berprestasi", className: "font-accent italic font-medium text-accent-gold" },
];

export const GatePage = () => {
  const container = useRef<HTMLElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasPreloaded = sessionStorage.getItem('hasPreloaded');
    if (hasPreloaded === 'true') {
      setIsCompleted(true);
      return;
    }
    
    // Lock scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useGSAP(() => {
    if (isCompleted || !container.current || !textContainer.current || !counterRef.current) return;

    const wordElements = textContainer.current.querySelectorAll('.gate-word');
    const counterElement = counterRef.current.parentElement;
    const progressObj = { value: 0 };

    // Set initial state
    gsap.set(wordElements, { opacity: 0, scale: 0.9, filter: "blur(20px)" });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('hasPreloaded', 'true');
        document.body.style.overflow = '';
        setIsCompleted(true);
      }
    });

    // 1. Loading Counter (0 to 100%)
    tl.to(progressObj, {
      value: 100,
      duration: 2.5, // Immersive delay
      ease: "power3.inOut", // Smooth acceleration/deceleration
      onUpdate: () => {
        if (counterRef.current) {
          // Format with leading zero if needed, but plain numbers feel raw and editorial
          counterRef.current.innerText = Math.round(progressObj.value).toString();
        }
      }
    });

    // 2. Fade out counter
    tl.to(counterElement, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.3");

    // 3. Cinematic Word Flash Sequence
    wordElements.forEach((word, i) => {
      const isLast = i === wordElements.length - 1;
      
      // Flash in
      tl.to(word, { 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px)", 
        duration: 0.8, 
        ease: "expo.out" 
      }, i === 0 ? "-=0.1" : "-=0.6");

      // Flash out (unless it's the very last word, we let it linger a tiny bit)
      if (!isLast) {
        tl.to(word, { 
          opacity: 0, 
          scale: 1.1, 
          filter: "blur(15px)", 
          duration: 0.6, 
          ease: "power2.in" 
        }, "+=0.1"); // Very brief hold
      } else {
        // Last word explosive fade out
        tl.to(word, { 
          opacity: 0, 
          scale: 1.5, 
          filter: "blur(20px)", 
          duration: 1.2, 
          ease: "power3.in" 
        }, "+=0.4");
      }
    });

    // 4. Slide up the entire gate page like a theater curtain
    tl.to(container.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "cubic-bezier(0.85, 0, 0.15, 1)", // Premium awwwards easing
    }, "-=0.6");

  }, { scope: container, dependencies: [isCompleted] });

  // If already completed, render nothing to save DOM nodes and immediately reveal Hero
  if (isCompleted) return null;

  return (
    <section
      ref={container}
      data-theme="dark"
      className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center z-[99999] overflow-hidden bg-ink"
    >
      {/* Warm cinematic light leak */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(120%_80%_at_70%_15%,rgba(231,193,121,0.4),transparent_55%)]"
      />

      {/* Islamic Pattern Overlay */}
      <IslamicPattern color="#f6efe2" opacity={0.05} />

      {/* Cinematic Fog & Fluid Organic Clouds */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Micro-Noise Film Grain */}
        <div 
          className="absolute inset-0 opacity-[0.06] z-20 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"
        />
      </div>

      {/* Percentage Loading Counter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="text-[#FDF6EC] font-accent italic text-2xl md:text-3xl tracking-widest flex items-end gap-1">
          <span ref={counterRef} className="text-5xl md:text-7xl font-light">0</span>
          <span className="text-xl md:text-2xl mb-1 md:mb-2 opacity-50">%</span>
        </div>
      </div>

      {/* Text Container */}
      <div ref={textContainer} className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {wordsData.map((w, i) => (
          <div
            key={i}
            className={`gate-word absolute text-5xl md:text-8xl lg:text-[9rem] tracking-tighter whitespace-nowrap transform-gpu opacity-0 drop-shadow-[0_10px_40px_rgba(231,193,121,0.3)] ${w.className} ${w.className.includes('text-accent-gold') ? '' : 'text-[#FDF6EC]'}`}
          >
            {w.text}
          </div>
        ))}
      </div>

    </section>
  );
};
