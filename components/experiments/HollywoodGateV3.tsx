'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  RotateCcw, 
  ArrowRight, 
  ArrowDownRight, 
  Sparkles, 
  Layers, 
  Compass, 
  Feather, 
  Building2,
  LucideIcon
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

type ChoreographyStyle = 'monolith' | 'astrolabe' | 'editorial' | 'sanctuary';

interface ChoreographyMeta {
  id: ChoreographyStyle;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  themeColor: string;
}

const CHOREOGRAPHIES: ChoreographyMeta[] = [
  {
    id: 'monolith',
    label: '1. Monolith',
    sublabel: 'Quiet Luxury Shutter',
    icon: Building2,
    themeColor: '#C79A45',
  },
  {
    id: 'astrolabe',
    label: '2. Astrolabe',
    sublabel: 'Sacred Geometric Iris',
    icon: Compass,
    themeColor: '#E2B867',
  },
  {
    id: 'editorial',
    label: '3. Editorial',
    sublabel: 'Asymmetric Kinetic Slash',
    icon: Layers,
    themeColor: '#D49B35',
  },
  {
    id: 'sanctuary',
    label: '4. Sanctuary',
    sublabel: 'Ethereal Ambient Veil',
    icon: Feather,
    themeColor: '#8FA372',
  },
];

export function HollywoodGateV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Active choreography mode
  const [style, setStyle] = useState<ChoreographyStyle>('monolith');
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lock scroll while gate is closed
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Reset & switch choreography
  const selectChoreography = (newStyle: ChoreographyStyle) => {
    if (isTransitioning) return;
    setStyle(newStyle);
    setIsOpen(false);
    setIsTransitioning(false);
  };

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsOpen(false);
    setIsTransitioning(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // GSAP ENTRANCE CHOREOGRAPHIES (100% GPU-Accelerated, ZERO CSS Blur Filters)
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!containerRef.current || isOpen) return;

    const ctx = gsap.context(() => {
      // 1. Monolith Choreography Setup
      if (style === 'monolith') {
        gsap.set('.mono-shutter-top', { yPercent: 0 });
        gsap.set('.mono-shutter-bot', { yPercent: 0 });
        gsap.set('.mono-line', { scaleX: 0, transformOrigin: 'center center' });
        gsap.set('.mono-seal', { scale: 0.6, opacity: 0 });
        gsap.set('.mono-title-line', { yPercent: 125 });
        gsap.set('.mono-fade', { opacity: 0, y: 16 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.mono-line', { scaleX: 1, duration: 1.1, ease: 'expo.out' }, 0.2)
          .to('.mono-seal', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }, 0.4)
          .to('.mono-title-line', { yPercent: 0, duration: 1.0, stagger: 0.12, ease: 'power4.out' }, 0.6)
          .to('.mono-fade', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.9);
      }

      // 2. Astrolabe Choreography Setup
      if (style === 'astrolabe') {
        gsap.set('.astro-ring-outer', { scale: 0.5, opacity: 0, rotation: -45, transformOrigin: 'center center' });
        gsap.set('.astro-ring-inner', { scale: 0.4, opacity: 0, rotation: 60, transformOrigin: 'center center' });
        gsap.set('.astro-star', { scale: 0.2, opacity: 0, transformOrigin: 'center center' });
        gsap.set('.astro-text-wrap', { opacity: 0, y: 25 });
        gsap.set('.astro-cta', { opacity: 0, scale: 0.9 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.astro-ring-outer', { scale: 1, opacity: 0.8, rotation: 0, duration: 1.4, ease: 'power3.out' }, 0.2)
          .to('.astro-ring-inner', { scale: 1, opacity: 0.9, rotation: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
          .to('.astro-star', { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(2)' }, 0.6)
          .to('.astro-text-wrap', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.8)
          .to('.astro-cta', { opacity: 1, scale: 1, duration: 0.6 }, 1.1);
      }

      // 3. Editorial Choreography Setup
      if (style === 'editorial') {
        gsap.set('.edit-col-1', { yPercent: 0 });
        gsap.set('.edit-col-2', { yPercent: 0 });
        gsap.set('.edit-col-3', { yPercent: 0 });
        gsap.set('.edit-tag', { opacity: 0, x: -20 });
        gsap.set('.edit-headline-word', { yPercent: 110 });
        gsap.set('.edit-card', { opacity: 0, y: 30 });
        gsap.set('.edit-cta', { opacity: 0, scale: 0.95 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.edit-tag', { opacity: 1, x: 0, duration: 0.7 }, 0.2)
          .to('.edit-headline-word', { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, 0.4)
          .to('.edit-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0.7)
          .to('.edit-cta', { opacity: 1, scale: 1, duration: 0.6 }, 1.0);
      }

      // 4. Sanctuary Choreography Setup
      if (style === 'sanctuary') {
        gsap.set('.sanc-veil', { opacity: 1 });
        gsap.set('.sanc-aura', { scale: 0.6, opacity: 0 });
        gsap.set('.sanc-emblem', { opacity: 0, y: 15 });
        gsap.set('.sanc-verse', { opacity: 0, y: 20 });
        gsap.set('.sanc-title', { opacity: 0, y: 25 });
        gsap.set('.sanc-cta', { opacity: 0, y: 15 });

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.to('.sanc-aura', { scale: 1, opacity: 0.45, duration: 1.8, ease: 'sine.out' }, 0.2)
          .to('.sanc-emblem', { opacity: 1, y: 0, duration: 1.0 }, 0.5)
          .to('.sanc-verse', { opacity: 1, y: 0, duration: 1.2 }, 0.7)
          .to('.sanc-title', { opacity: 1, y: 0, duration: 1.0 }, 1.0)
          .to('.sanc-cta', { opacity: 1, y: 0, duration: 0.8 }, 1.3);
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef, dependencies: [style, isOpen] });

  // ─────────────────────────────────────────────────────────────────────────────
  // GATE TRANSITION DISPATCHER (Unique per Choreography)
  // ─────────────────────────────────────────────────────────────────────────────
  const triggerOpenGate = useCallback(() => {
    if (isTransitioning || isOpen || !containerRef.current) return;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setIsTransitioning(false);
      },
    });

    // MODE 1: Monolith (Clean Architectural Shutter Split)
    if (style === 'monolith') {
      tl.to('.mono-content-zone', { opacity: 0, y: -25, duration: 0.35, ease: 'power2.in' }, 0)
        .to('.mono-shutter-top', { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 0.2)
        .to('.mono-shutter-bot', { yPercent: 100, duration: 0.85, ease: 'expo.inOut' }, 0.2);
    }

    // MODE 2: Astrolabe (Geometric Iris Radial Expansion)
    else if (style === 'astrolabe') {
      tl.to('.astro-text-wrap, .astro-cta', { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' }, 0)
        .to('.astro-star', { scale: 12, rotation: 90, opacity: 0, duration: 0.9, ease: 'expo.in' }, 0.15)
        .to('.astro-ring-inner', { scale: 8, opacity: 0, duration: 0.8, ease: 'power3.in' }, 0.2)
        .to('.astro-ring-outer', { scale: 6, opacity: 0, duration: 0.7, ease: 'power3.in' }, 0.25)
        .to('.astro-backdrop', { opacity: 0, duration: 0.65, ease: 'power2.out' }, 0.45);
    }

    // MODE 3: Editorial (Triple Asymmetric Vertical Slash)
    else if (style === 'editorial') {
      tl.to('.edit-content-zone', { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in' }, 0)
        .to('.edit-col-1', { yPercent: -105, duration: 0.8, ease: 'expo.inOut' }, 0.15)
        .to('.edit-col-2', { yPercent: 105, duration: 0.85, ease: 'expo.inOut' }, 0.22)
        .to('.edit-col-3', { yPercent: -105, duration: 0.8, ease: 'expo.inOut' }, 0.28);
    }

    // MODE 4: Sanctuary (Serene Ethereal Dissolve & Lift)
    else if (style === 'sanctuary') {
      tl.to('.sanc-content-zone', { opacity: 0, y: -15, duration: 0.5, ease: 'sine.in' }, 0)
        .to('.sanc-veil', { opacity: 0, scale: 1.05, duration: 1.0, ease: 'sine.inOut' }, 0.25);
    }

    // Universal Hero Reveal (Fluid & Instant)
    tl.fromTo('.hero-visual-layer', {
      scale: 1.06,
      opacity: 0.3,
    }, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
    }, 0.35)
    .fromTo('.hero-text-line', {
      yPercent: 105,
    }, {
      yPercent: 0,
      duration: 0.95,
      stagger: 0.08,
      ease: 'power4.out',
    }, 0.5)
    .fromTo('.hero-fade-item', {
      opacity: 0,
      y: 18,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.07,
      ease: 'power2.out',
    }, 0.75);

  }, [style, isTransitioning, isOpen]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-[100dvh] bg-[#0A0908] text-[#F6EFE2] font-sans overflow-x-hidden selection:bg-[#C79A45] selection:text-[#0A0908]"
    >
      <style>{`nav.fixed, footer { display: none !important; }`}</style>

      {/* ─────────────────────────────────────────────────────────────────────────
          FLOATING CHOREOGRAPHY STUDIO DOCK (DIRECTOR'S SWITCHER)
      ───────────────────────────────────────────────────────────────────────── */}
      <nav 
        aria-label="Choreography Studio Switcher" 
        className="fixed top-4 sm:top-6 inset-x-0 z-[4000] flex justify-center px-4 pointer-events-none"
      >
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-[#14120E]/90 border border-[#C79A45]/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] pointer-events-auto max-w-full overflow-x-auto scrollbar-none">
          <div className="hidden md:flex items-center gap-2 pl-3 pr-2 border-r border-white/10 text-[10px] font-mono text-[#C79A45] tracking-widest uppercase">
            <Sparkles size={12} />
            <span>Koreografi</span>
          </div>

          {CHOREOGRAPHIES.map((item) => {
            const Icon = item.icon;
            const isActive = style === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectChoreography(item.id)}
                disabled={isTransitioning}
                className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#C79A45] text-[#0A0908] font-bold shadow-md' 
                    : 'text-[#F6EFE2]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-[#0A0908]' : 'text-[#C79A45]'} />
                <span>{item.label}</span>
                <span className={`hidden lg:inline text-[9px] font-mono opacity-60 ${isActive ? 'text-[#0A0908]' : 'text-[#F6EFE2]'}`}>
                  ({item.sublabel})
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────
          GATE VIEWS (4 DISTINCT CHOREOGRAPHIES)
      ───────────────────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <section 
          ref={gateRef}
          className="fixed inset-0 z-[3000] flex items-center justify-center overflow-hidden"
        >

          {/* ═════════════════════════════════════════════════════════════════════
              CHOREOGRAPHY 1: THE ARCHITECTURAL MONOLITH
          ═════════════════════════════════════════════════════════════════════ */}
          {style === 'monolith' && (
            <div className="absolute inset-0 flex flex-col justify-between bg-[#0A0908] overflow-hidden">
              {/* Dual Architectural Shutter Panels */}
              <div className="mono-shutter-top absolute top-0 inset-x-0 h-1/2 bg-[#0C0A09] border-b border-[#C79A45]/20 z-10 will-change-transform" />
              <div className="mono-shutter-bot absolute bottom-0 inset-x-0 h-1/2 bg-[#0C0A09] border-t border-[#C79A45]/20 z-10 will-change-transform" />

              <div className="mono-content-zone relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full pt-16">
                {/* Fine Golden Horizon Line */}
                <div className="relative flex items-center justify-center w-full max-w-md my-6">
                  <div className="mono-line flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C79A45]/60 to-[#C79A45]" />
                  <div className="mono-seal mx-5 w-11 h-11 flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-[#C79A45]/80 rotate-45" />
                    <div className="absolute inset-0 border border-[#C79A45]/80 rotate-0" />
                    <div className="w-2 h-2 rounded-full bg-[#C79A45]" />
                  </div>
                  <div className="mono-line flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#C79A45]/60 to-[#C79A45]" />
                </div>

                <p className="mono-fade text-[11px] font-mono tracking-[0.35em] text-[#C79A45] uppercase mb-4">
                  SMPIT Thoriqul Jannah
                </p>

                <div className="overflow-hidden py-1">
                  <h1 className="mono-title-line font-heading font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#F6EFE2] uppercase leading-[0.92]">
                    Monolit Masa Depan
                  </h1>
                </div>
                <div className="overflow-hidden py-1">
                  <h2 className="mono-title-line font-heading font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#C79A45] italic font-serif leading-[0.95]">
                    Adab, Iman &amp; Ilmu
                  </h2>
                </div>

                <div className="mono-fade mt-6 flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-sans tracking-widest text-[#F6EFE2]/60 uppercase">
                  <span>Sholeh</span>
                  <span className="text-[#C79A45]">•</span>
                  <span>Mandiri</span>
                  <span className="text-[#C79A45]">•</span>
                  <span>Kreatif</span>
                  <span className="text-[#C79A45]">•</span>
                  <span>Berprestasi</span>
                </div>

                <div className="mono-fade mt-10 sm:mt-12">
                  <button
                    type="button"
                    onClick={triggerOpenGate}
                    disabled={isTransitioning}
                    className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full bg-[#C79A45] text-[#0A0908] font-sans font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#F5E6A3] hover:scale-[1.03] active:scale-[0.98] shadow-[0_10px_30px_rgba(199,154,69,0.25)]"
                  >
                    <span>Buka Shutter Monolit</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mono-content-zone relative z-20 px-8 py-6 flex justify-between items-center text-[10px] font-mono text-[#F6EFE2]/40 tracking-widest uppercase">
                <span>EST. 2018 · BEKASI TIMUR</span>
                <span>KOREOGRAFI 01 // ARCHITECTURAL SHUTTER</span>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              CHOREOGRAPHY 2: THE SACRED ASTROLABE (GEOMETRIC IRIS)
          ═════════════════════════════════════════════════════════════════════ */}
          {style === 'astrolabe' && (
            <div className="astro-backdrop absolute inset-0 flex flex-col items-center justify-center bg-[#07090D] overflow-hidden px-6">
              {/* Celestial Radial Lattice Grid */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E2B867_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

              {/* Dynamic Astrolabe SVG */}
              <div className="relative pointer-events-none flex items-center justify-center w-[min(85vw,560px)] h-[min(85vw,560px)]">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                  {/* Outer Graduation Ring */}
                  <g className="astro-ring-outer">
                    <circle cx="200" cy="200" r="185" stroke="#E2B867" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
                    <circle cx="200" cy="200" r="175" stroke="#E2B867" strokeWidth="1.2" opacity="0.7" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
                      <line 
                        key={d} 
                        x1="200" 
                        y1="15" 
                        x2="200" 
                        y2="28" 
                        stroke="#E2B867" 
                        strokeWidth="1.5" 
                        transform={`rotate(${d} 200 200)`} 
                      />
                    ))}
                  </g>

                  {/* Inner Planetary Ring */}
                  <g className="astro-ring-inner">
                    <circle cx="200" cy="200" r="130" stroke="#E2B867" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.6" />
                    <circle cx="200" cy="200" r="95" stroke="#E2B867" strokeWidth="1" opacity="0.8" />
                  </g>

                  {/* Sacred 8-Point Rub el Hizb Star Core */}
                  <g className="astro-star">
                    <rect x="140" y="140" width="120" height="120" stroke="#E2B867" strokeWidth="1.5" fill="none" opacity="0.85" />
                    <rect x="140" y="140" width="120" height="120" stroke="#E2B867" strokeWidth="1.5" fill="none" transform="rotate(45 200 200)" opacity="0.85" />
                    <circle cx="200" cy="200" r="32" stroke="#E2B867" strokeWidth="1" opacity="0.7" />
                    <circle cx="200" cy="200" r="5" fill="#E2B867" />
                  </g>
                </svg>
              </div>

              {/* Title & Call To Action */}
              <div className="astro-text-wrap absolute z-20 flex flex-col items-center text-center max-w-2xl px-6 pt-16 pointer-events-auto">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#E2B867] mb-3">
                  Gerbang Sains Falakiyah Islam
                </span>
                <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#F6EFE2] uppercase">
                  Astrolabe Thoriqul
                </h1>
                <p className="mt-4 max-w-md text-sm text-[#F6EFE2]/70 leading-relaxed font-sans">
                  Menghidupkan kembali tradisi ilmu pengetahuan peradaban Islam dengan nalar kritis dan keteguhan iman.
                </p>

                <button
                  type="button"
                  onClick={triggerOpenGate}
                  disabled={isTransitioning}
                  className="astro-cta mt-8 group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E2B867] text-[#07090D] font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(226,184,103,0.3)]"
                >
                  <span>Buka Iris Astrolabe</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              CHOREOGRAPHY 3: THE ASYMMETRIC EDITORIAL (TRIPLE SLASH)
          ═════════════════════════════════════════════════════════════════════ */}
          {style === 'editorial' && (
            <div className="absolute inset-0 flex bg-[#14100D] overflow-hidden">
              {/* Triple Asymmetric Vertical Columns for Staggered Slash Reveal */}
              <div className="edit-col-1 w-1/3 h-full bg-[#16120E] border-r border-[#C79A45]/15 z-10 will-change-transform" />
              <div className="edit-col-2 w-1/3 h-full bg-[#191410] border-r border-[#C79A45]/15 z-10 will-change-transform" />
              <div className="edit-col-3 w-1/3 h-full bg-[#16120E] z-10 will-change-transform" />

              {/* Main Editorial Content Zone */}
              <div className="edit-content-zone absolute inset-0 z-20 flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-24 sm:py-28 max-w-6xl mx-auto w-full">
                <div className="edit-tag flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C79A45]" />
                  <span className="text-[11px] font-mono tracking-[0.28em] text-[#C79A45] uppercase">
                    EDITORIAL ISSUE 2026/2027
                  </span>
                </div>

                <div className="my-auto max-w-3xl">
                  <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-[-0.04em] text-[#F6EFE2] uppercase">
                    <span className="block overflow-hidden py-1"><span className="edit-headline-word block">Membentuk</span></span>
                    <span className="block overflow-hidden py-1"><span className="edit-headline-word block text-[#C79A45]">Generasi</span></span>
                    <span className="block overflow-hidden py-1"><span className="edit-headline-word block font-serif italic font-light text-[#F6EFE2]/90">Pemimpin.</span></span>
                  </h1>

                  <div className="edit-card mt-8 flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-white/10">
                    <p className="max-w-md text-sm sm:text-base text-[#F6EFE2]/70 leading-relaxed font-sans">
                      Kurikulum holistik terpadu untuk membentuk kepribadian berkarakter mandiri, fasih berbahasa, dan berakhlak mulia.
                    </p>

                    <button
                      type="button"
                      onClick={triggerOpenGate}
                      disabled={isTransitioning}
                      className="edit-cta inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#C79A45] text-[#0E0C0A] font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 shadow-xl"
                    >
                      <span>Masuk Narasi</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#F6EFE2]/40 tracking-widest uppercase">
                  <span>SMPIT THORIQUL JANNAH</span>
                  <span>KOREOGRAFI 03 // ASYMMETRIC SLASH</span>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              CHOREOGRAPHY 4: THE WHISPERING SANCTUARY (CALM ZEN)
          ═════════════════════════════════════════════════════════════════════ */}
          {style === 'sanctuary' && (
            <div className="sanc-veil absolute inset-0 flex flex-col items-center justify-center bg-[#10130F] overflow-hidden px-6">
              {/* Soft Ambient Radial Light Aura */}
              <div className="sanc-aura absolute w-[700px] h-[700px] rounded-full bg-radial from-[#8FA372]/30 via-[#3A452D]/10 to-transparent pointer-events-none" />

              <div className="sanc-content-zone relative z-20 flex flex-col items-center text-center max-w-2xl pt-16">
                <div className="sanc-emblem w-10 h-10 rounded-full border border-[#8FA372]/60 flex items-center justify-center text-[#8FA372] mb-6">
                  <Feather size={16} />
                </div>

                <p className="sanc-verse text-xs sm:text-sm font-serif italic text-[#8FA372] tracking-wider mb-4">
                  &ldquo;Bismillahir Rahmanir Rahim — Menumbuhkan Fitrah Santri&rdquo;
                </p>

                <h1 className="sanc-title font-heading font-medium text-4xl sm:text-6xl tracking-tight text-[#F6EFE2]">
                  Ruang Teduh Menuntut Ilmu
                </h1>

                <p className="sanc-title mt-6 text-sm sm:text-base text-[#F6EFE2]/70 leading-relaxed font-body max-w-lg">
                  Sebuah suaka pendidikan bernuansa islami yang menanamkan ketenangan jiwa, 
                  keindahan adab, dan kecintaan tulus terhadap Al-Qur&apos;an.
                </p>

                <button
                  type="button"
                  onClick={triggerOpenGate}
                  disabled={isTransitioning}
                  className="sanc-cta mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#8FA372] bg-[#8FA372]/15 hover:bg-[#8FA372] text-[#F6EFE2] hover:text-[#0E120B] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 active:scale-95"
                >
                  <span>Melangkah Masuk</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          LIVING HERO SECTION (SHARED LUXURY EDITORIAL REALM)
      ───────────────────────────────────────────────────────────────────────── */}
      <section 
        ref={heroRef}
        className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#0A0908]"
      >
        {/* Layer 1: Background Visual with Controlled Vignette */}
        <div className="hero-visual-layer absolute inset-y-0 right-0 w-full lg:w-[60%] h-full pointer-events-none will-change-transform">
          <Image 
            src="/test-assets/threshold-hero-v1.png"
            alt="Santri SMPIT Thoriqul Jannah menggapai masa depan beradab"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center brightness-[0.78] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-[#0A0908]/50 lg:bg-gradient-to-r lg:from-[#0A0908] lg:via-[#0A0908]/60 lg:to-transparent" />
        </div>

        {/* Layer 2: Top Header HUD */}
        <header className="hero-fade-item relative z-20 w-full px-6 sm:px-12 pt-24 sm:pt-28 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C79A45] flex items-center justify-center text-[#C79A45] text-xs font-bold font-serif">
              TJ
            </div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#F6EFE2]">
              SMPIT Thoriqul Jannah
            </span>
          </div>

          {/* Replay Gate Button */}
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#C79A45] bg-[#0A0908]/80 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase text-[#F6EFE2]/80 hover:text-[#C79A45] transition-colors shadow-lg"
          >
            <RotateCcw size={12} />
            <span>Ulangi Gerbang</span>
          </button>
        </header>

        {/* Layer 3: Main Editorial Content Block (AIDA 2-Line Iron Rule) */}
        <div className="relative z-20 px-6 sm:px-12 py-16 sm:py-24 max-w-3xl">
          <div className="hero-fade-item inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C79A45]/40 bg-[#C79A45]/10 mb-6 backdrop-blur-md">
            <Sparkles size={11} className="text-[#C79A45]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#C79A45]">
              Kurikulum Karakter Terpadu
            </span>
          </div>

          <div className="space-y-1">
            <div className="overflow-hidden">
              <h2 className="hero-text-line font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#F6EFE2]">
                Tumbuh Berakar Iman,
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="hero-text-line font-heading font-light font-serif italic text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#C79A45]">
                Menjulang Menggapai
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="hero-text-line font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#F6EFE2]">
                Peradaban Dunia.
              </h2>
            </div>
          </div>

          <div className="hero-fade-item mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#F6EFE2]/70 font-sans">
              Membina fitrah santri melalui perpaduan tahfidz Al-Qur&apos;an, 
              keunggulan sains global, dan keteladanan akhlak karimah.
            </p>

            <button
              type="button"
              onClick={() => document.getElementById('narrative-target')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 self-start sm:self-auto text-xs font-bold tracking-[0.18em] uppercase text-[#C79A45] border-b border-[#C79A45] pb-1 hover:text-white hover:border-white transition-colors"
            >
              <span>Telusuri Nilai Kami</span>
              <ArrowDownRight size={15} />
            </button>
          </div>
        </div>

        {/* Layer 4: Minimal Footer Info Bar */}
        <footer className="hero-fade-item relative z-20 px-6 sm:px-12 pb-8 sm:pb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-white/10 pt-6 text-[10px] font-mono text-[#F6EFE2]/40 tracking-widest uppercase">
          <span>TAHUN AJARAN 2026/2027 · NPSN 69989021</span>
          <span className="text-[#C79A45]">PENERIMAAN SANTRI BARU TELAH DIBUKA</span>
        </footer>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          SUBSEQUENT NARRATIVE SECTION (FOR SMOOTH SCROLL VERIFICATION)
      ───────────────────────────────────────────────────────────────────────── */}
      <section 
        id="narrative-target"
        className="relative min-h-[70dvh] bg-[#100E0C] border-t border-[#C79A45]/20 px-6 sm:px-12 lg:px-24 py-28 flex flex-col justify-center"
      >
        <div className="max-w-2xl">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-[#C79A45] mb-4">
            CHAPTER 01 // LANDASAN ADAB
          </p>
          <h3 className="font-heading font-bold text-3xl sm:text-5xl text-[#F6EFE2] leading-tight">
            Adab sebelum ilmu, iman sebelum amal.
          </h3>
          <p className="mt-6 text-base text-[#F6EFE2]/70 leading-relaxed">
            Pendidikan bukan sekadar transfer wawasan kognitif, melainkan penanaman nilai rabbani 
            yang membimbing setiap langkah hidup anak dalam menghadapi tantangan zaman.
          </p>
        </div>
      </section>
    </div>
  );
}
