'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematic = () => {
  const container = useRef<HTMLElement>(null);
  const headlineWords = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    if (!container.current) return;

    gsap.from(headlineWords.current, {
      yPercent: 120,
      opacity: 0,
      duration: 1.8,
      stagger: 0.1,
      ease: "elastic.out(1, 0.75)",
      delay: 0.2,
    });

    gsap.from(".hero-subtext", {
      opacity: 0,
      y: 40,
      duration: 1.5,
      ease: "power3.out",
      delay: 1,
    });

    gsap.to(".inline-img", {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5,
    });

    gsap.to(container.current, {
      yPercent: 20,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
  }, { scope: container });

  const setWordRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) headlineWords.current[index] = el;
  };

  return (
    <section
      ref={container}
      data-theme="dark"
      className="cinematic-grain vignette relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 overflow-hidden pt-24 pb-12"
      style={{ background: 'var(--ink)' }}
    >
      {/* Radial warm glow (from referensi GateHero pattern) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(80% 60% at 15% 100%, rgba(199,154,69,0.12), transparent 65%)'
        }}
      />

      {/* Islamic Pattern subtle overlay */}
      <IslamicPattern color="#2a201a" opacity={0.05} />

      <div className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col h-full justify-between gap-16 md:gap-24">

        {/* Eyebrow text */}
        <div className="hero-subtext self-start max-w-sm">
          <p
            className="font-accent italic text-lg leading-relaxed border-l pl-6"
            style={{
              color: 'var(--muted)',
              borderColor: 'rgba(253, 246, 236, 0.15)'
            }}
          >
            Membangun generasi yang tidak hanya unggul dalam akademik, tetapi juga berakar kuat pada nilai-nilai spiritual.
          </p>
        </div>

        {/* Massive Headline */}
        <h1
          className="font-heading font-bold text-5xl md:text-8xl lg:text-[8rem] leading-[1.1] md:leading-[0.95] tracking-tighter uppercase flex flex-wrap items-center gap-x-4 gap-y-6"
          style={{ color: 'var(--cream)' }}
        >
          <span className="overflow-hidden inline-block relative h-[1.1em]">
            <span ref={(el) => setWordRef(el, 0)} className="inline-block">Generasi</span>
          </span>

          <span className="inline-img relative w-20 h-16 md:w-36 md:h-24 lg:w-48 lg:h-32 rounded-full overflow-hidden inline-block shrink-0"
            style={{ border: '1px solid rgba(253, 246, 236, 0.15)' }}>
            <img
              src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=400&auto=format&fit=crop"
              alt="Portrait"
              className="object-cover w-full h-full"
            />
          </span>

          <span className="overflow-hidden inline-block relative h-[1.1em]">
            <span ref={(el) => setWordRef(el, 1)} className="inline-block">Sholeh,</span>
          </span>

          <span className="overflow-hidden inline-block relative h-[1.1em] w-full md:w-auto">
            <span ref={(el) => setWordRef(el, 2)} className="inline-block" style={{ color: 'var(--sage)' }}>Mandiri</span>
          </span>

          <span className="inline-img relative w-16 h-16 md:w-28 md:h-24 lg:w-36 lg:h-32 rounded-[2rem] overflow-hidden inline-block shrink-0">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=400&auto=format&fit=crop"
              alt="Education"
              className="object-cover w-full h-full"
              style={{ filter: 'sepia(0.3)' }}
            />
          </span>

          <span className="overflow-hidden inline-block relative h-[1.1em]">
            <span ref={(el) => setWordRef(el, 3)} className="inline-block">&amp; Kreatif</span>
          </span>
        </h1>

        {/* Bottom row */}
        <div className="hero-subtext flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-12 self-end">
          <div className="text-sm font-body uppercase tracking-[0.25em] font-semibold" style={{ color: 'var(--cream)' }}>
            SMPIT Thoriqul Jannah
          </div>

          <button
            className="group relative px-8 py-4 font-medium text-sm tracking-widest uppercase overflow-hidden"
            style={{ background: 'var(--ink)', color: 'var(--cream)' }}
          >
            <span className="relative z-10">Mulai Perjalanan</span>
            <div
              className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{ background: 'var(--gold)' }}
            />
          </button>
        </div>
      </div>
    </section>
  );
};
