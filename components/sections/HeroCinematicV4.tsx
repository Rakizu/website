'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematicV4 = () => {
  const container = useRef<HTMLElement>(null);
  const topTextRef = useRef<HTMLHeadingElement>(null);
  const bottomTextRef = useRef<HTMLHeadingElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position for the spotlight
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate percentage
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x: `${x}%`, y: `${y}%` });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    if (!container.current) return;

    // Entrance animation (sync with GatePage)
    gsap.fromTo(textWrapperRef.current, 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power3.out', delay: 0.5 }
    );

    // Scroll Zoom Animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=150%', // Pin for 1.5x screen height
        scrub: 1,
        pin: true,
      }
    });

    // We zoom IN massively into the text. 
    // We also fade out the outline text so only the image text remains.
    tl.to(bottomTextRef.current, {
      opacity: 0,
      duration: 0.2
    }, 0);

    // Scale up the wrapper massively
    tl.to(textWrapperRef.current, {
      scale: 150,
      xPercent: -500, // Try to aim for a hole in the letter
      yPercent: 100,
      ease: 'power1.inOut',
      duration: 1
    }, 0);

    // As it scales, we expand the mask so the whole image becomes visible
    // We can animate CSS variables in GSAP by targeting the element
    tl.to(topTextRef.current, {
      '--mask-size': '200vw',
      ease: 'power2.in',
      duration: 0.8
    }, 0.2);

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-[100dvh] bg-[#0a0806] overflow-hidden flex flex-col justify-center items-center cursor-crosshair">
      
      {/* Background stays dark */}
      <div className="absolute inset-0 bg-[#0a0806]" />

      {/* Text Wrapper */}
      <div ref={textWrapperRef} className="relative z-10 flex flex-col items-center justify-center w-full transform-gpu origin-center">
        
        {/* Eyebrow */}
        <div className="text-[#c79a45] font-body text-sm md:text-base font-semibold uppercase tracking-[0.4em] mb-4">
          SMP IT
        </div>

        {/* The Text Layers */}
        <div className="relative w-full text-center">
          
          {/* Layer 1: Hollow Outline (Always visible) */}
          <h1 
            ref={bottomTextRef}
            className="font-heading font-bold text-[13vw] leading-none tracking-tighter uppercase text-transparent"
            style={{ WebkitTextStroke: '1px rgba(253,246,236, 0.15)' }}
          >
            THORIQUL<br/>JANNAH
          </h1>

          {/* Layer 2: Image Fill with Spotlight Mask */}
          <h1 
            ref={topTextRef}
            className="absolute inset-0 font-heading font-bold text-[13vw] leading-none tracking-tighter uppercase text-transparent"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2000&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              WebkitBackgroundClip: 'text',
              // Use CSS variable for mask size so we can animate it
              '--mask-size': '15vw',
              maskImage: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, black 0%, transparent var(--mask-size))`,
              WebkitMaskImage: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, black 0%, transparent var(--mask-size))`
            } as React.CSSProperties}
          >
            THORIQUL<br/>JANNAH
          </h1>

        </div>
      </div>

    </section>
  );
};
