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

    tl.to(container.current, { autoAlpha: 0, duration: 1, ease: "power2.inOut" });

  }, { scope: container });

  return (
    <section
      ref={container}
      data-theme="dark"
      className="relative w-full h-screen flex items-center justify-center z-[999] overflow-hidden"
      style={{ background: 'var(--ink)' }}
    >
      {/* Warm cinematic light leak */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(120% 80% at 70% 15%, rgba(231,193,121,0.4), transparent 55%)'
        }}
      />

      {/* Islamic Pattern Overlay */}
      <IslamicPattern color="#f6efe2" opacity={0.05} />

      {/* Text Container */}
      <div ref={textContainer} className="relative z-10 w-full h-full flex items-center justify-center">
        {wordsData.map((w, i) => (
          <div
            key={i}
            className={`gate-word absolute text-6xl md:text-8xl lg:text-[9rem] tracking-tighter whitespace-nowrap transform-gpu ${w.className}`}
            style={{ 
              opacity: 0, 
              color: w.className.includes('text-accent-gold') ? undefined : '#FDF6EC' 
            }}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(246,239,226,0.5)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Gulir</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite]" style={{ background: 'var(--gold-soft)' }} />
        </span>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>
    </section>
  );
};
