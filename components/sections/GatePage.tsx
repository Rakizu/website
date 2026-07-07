'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

const wordsData = [
  { text: "Sholeh", className: "font-heading font-bold" },
  { text: "Mandiri", className: "font-accent italic font-light" },
  { text: "Kreatif", className: "font-heading font-bold" },
  { text: "Berprestasi", className: "font-accent italic font-medium text-accent-gold" },
];

export const GatePage = () => {
  const container = useRef<HTMLElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !textContainer.current) return;

    const wordElements = textContainer.current.querySelectorAll('.gate-word');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    wordElements.forEach((word, i) => {
      tl.fromTo(word,
        { opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }
      );

      if (i < wordElements.length - 1) {
        tl.to(word,
          { opacity: 0, y: -50, scale: 1.1, filter: "blur(10px)", duration: 1, ease: "power2.in" },
          "+=0.5"
        );
      } else {
        tl.to(word,
          { opacity: 0, scale: 1.5, filter: "blur(20px)", duration: 1.5, ease: "power3.in" },
          "+=1"
        );
      }
    });

    // Animate clouds over the entire duration of the pinning
    tl.to('.cloud-layer', {
      scale: 2.5,
      opacity: 0,
      duration: tl.duration(), // span the entire timeline
      ease: "power2.in",
      stagger: 0.2
    }, 0); // Start at the very beginning (0)

  }, { scope: container });

  return (
    <section
      ref={container}
      data-theme="dark"
      className="relative w-full h-screen flex items-center justify-center z-[999] overflow-hidden bg-ink"
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
        
        {/* Organic Fluid Cloud System */}
        <div className="absolute inset-0 z-10 w-full h-full opacity-80 overflow-hidden">
            {/* User SVG Cloud Asset */}
            <div className="cloud-layer absolute inset-0 w-full h-full opacity-40 mix-blend-screen animate-[float_20s_ease-in-out_infinite]">
              {/* Alpha Transparency applied via opacity class */}
              <img src="/cloud.svg" alt="" className="w-full h-full object-cover object-center opacity-70" />
            </div>
        </div>
      </div>

      {/* Text Container */}
      <div ref={textContainer} className="relative z-10 w-full h-full flex items-center justify-center">
        {wordsData.map((w, i) => (
          <div
            key={i}
            className={`gate-word absolute text-6xl md:text-8xl lg:text-[9rem] tracking-tighter whitespace-nowrap transform-gpu opacity-0 drop-shadow-[0_10px_40px_rgba(231,193,121,0.3)] ${w.className} ${w.className.includes('text-accent-gold') ? '' : 'text-[#FDF6EC]'}`}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f6efe2]/50"
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Gulir</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold-soft" />
        </span>
      </div>

      <style>{`
        @keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}
        @keyframes float {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(3%, 3%, 0) scale(1.05); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
      `}</style>
    </section>
  );
};
