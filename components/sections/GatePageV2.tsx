'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * GatePageV2 — Cinematic Awwwards-level preloader
 * 
 * Refined Architecture:
 * ACT 0: Silence — 0.8s of pure black. Tension.
 * ACT 1: The Horizon — twin gold lines crawl from center outward + glow bloom
 * ACT 2: Spatial Lockup — words compose as an editorial poster with varied 
 *         axes, clip-paths, and a gentle ambient drift while composed
 * ACT 3: Fly-Through — composition zooms 25x, bg splits asymmetrically
 */
export const GatePageV2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const horizonGlowRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const splitTopRef = useRef<HTMLDivElement>(null);
  const splitBotRef = useRef<HTMLDivElement>(null);
  const decorLineLeftRef = useRef<HTMLDivElement>(null);
  const decorLineRightRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('hasPreloaded_v2') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isCompleted) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCompleted]);

  useGSAP(() => {
    if (isCompleted || !container.current || !horizonRef.current || !lockupRef.current) return;

    const horizon = horizonRef.current;
    const horizonGlow = horizonGlowRef.current;
    const lockup = lockupRef.current;
    const splitTop = splitTopRef.current;
    const splitBot = splitBotRef.current;
    const decorLeft = decorLineLeftRef.current;
    const decorRight = decorLineRightRef.current;

    const wordSholeh = lockup.querySelector('.word-sholeh') as HTMLElement;
    const wordMandiri = lockup.querySelector('.word-mandiri') as HTMLElement;
    const wordKreatif = lockup.querySelector('.word-kreatif') as HTMLElement;
    const wordBerprestasi = lockup.querySelector('.word-berprestasi') as HTMLElement;
    const schoolName = lockup.querySelector('.school-name') as HTMLElement;
    const yearTag = lockup.querySelector('.year-tag') as HTMLElement;

    // ── Initial states ──
    gsap.set(horizon, { scaleX: 0, transformOrigin: 'center center' });
    gsap.set(horizonGlow, { scaleX: 0, transformOrigin: 'center center', opacity: 0 });
    gsap.set([wordSholeh, wordMandiri, wordKreatif, wordBerprestasi, schoolName, yearTag], { opacity: 0 });
    gsap.set([decorLeft, decorRight], { scaleY: 0, transformOrigin: 'top center', opacity: 0 });

    // Sholeh: clip-path reveal from bottom
    gsap.set(wordSholeh, { clipPath: 'inset(100% 0 0 0)', opacity: 1, y: 0 });
    // Mandiri: enter from far left
    gsap.set(wordMandiri, { x: -200, opacity: 0 });
    // Kreatif: hollow outline — start massive and ethereal  
    gsap.set(wordKreatif, { scale: 2.5, opacity: 0 });
    // Berprestasi: scale & opacity reveal from below
    gsap.set(wordBerprestasi, { y: 40, opacity: 0, scale: 0.94 });
    // School name: compressed letter spacing, transparent
    gsap.set(schoolName, { opacity: 0, y: 15, letterSpacing: '0.8em' });
    // Year tag
    gsap.set(yearTag, { opacity: 0, x: -10 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('hasPreloaded_v2', 'true');
        document.body.style.overflow = '';
        setIsCompleted(true);
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    });

    // ═══════════════════════════════════════════════
    // ACT 0: SILENCE (0s → 0.8s)
    // Pure black. Nothing moves. Builds anticipation.
    // ═══════════════════════════════════════════════
    tl.addLabel('silence', 0);
    tl.set({}, {}, '+=0.8');

    // ═══════════════════════════════════════════════
    // ACT 1: THE HORIZON (0.8s → 3.2s)
    // ═══════════════════════════════════════════════
    tl.addLabel('horizon', '>');

    // Line itself
    tl.to(horizon, {
      scaleX: 1,
      duration: 2.8,
      ease: 'power3.inOut',
    }, 'horizon');

    // Glow bloom
    tl.to(horizonGlow, {
      scaleX: 1,
      opacity: 1,
      duration: 3.0,
      ease: 'power3.inOut',
    }, 'horizon+=0.2');

    // ═══════════════════════════════════════════════
    // ACT 2: SPATIAL LOCKUP (Starts while horizon is drawing)
    // ═══════════════════════════════════════════════
    tl.addLabel('words', 'horizon+=1.5');

    // "Kreatif" hollow outline — slow, majestic shrink
    tl.to(wordKreatif, {
      scale: 1,
      opacity: 1,
      duration: 3.0,
      ease: 'power3.out',
    }, 'words');

    // "Sholeh" — smooth clip-path
    tl.to(wordSholeh, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 2.0,
      ease: 'power4.out',
    }, 'words+=0.3');

    // "Mandiri" — glides in
    tl.to(wordMandiri, {
      x: 0,
      opacity: 1,
      duration: 1.8,
      ease: 'power3.out',
    }, 'words+=0.5');

    // "Berprestasi" — scale & opacity resolve
    tl.to(wordBerprestasi, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: 'power3.out',
    }, 'words+=0.7');

    // Decorative lines
    tl.to([decorLeft, decorRight], {
      scaleY: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.2,
    }, 'words+=0.8');

    // School name
    tl.to(schoolName, {
      opacity: 0.6,
      y: 0,
      letterSpacing: '0.3em',
      duration: 1.5,
      ease: 'power2.out',
    }, 'words+=1.0');

    // NPSN tag 
    tl.to(yearTag, {
      opacity: 0.35,
      x: 0,
      duration: 1.0,
      ease: 'power2.out',
    }, 'words+=1.2');

    // ═══════════════════════════════════════════════
    // CONTINUOUS DRIFT & EXIT (Seamless overlap)
    // ═══════════════════════════════════════════════
    tl.addLabel('composed', 'words+=1.5');

    // Start gentle drift
    tl.to(lockup, {
      scale: 1.025,
      rotate: 0.5,
      duration: 3.5,
      ease: 'sine.inOut',
    }, 'composed');

    tl.to(horizonGlow, {
      opacity: 0.8,
      duration: 2.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 'composed');

    // Enter Exit phase smoothly
    tl.addLabel('exit', 'composed+=2.2');

    // The lockup zooms to extreme scale — fly through the text
    tl.to(lockup, {
      scale: 25,
      rotate: -1.5,
      opacity: 0,
      duration: 2.0,
      ease: 'power3.in',
    }, 'exit');

    // Horizon dissolves quickly
    tl.to(horizon, {
      opacity: 0,
      scaleX: 1.5,
      duration: 0.8,
      ease: 'power2.in',
    }, 'exit');

    tl.to(horizonGlow, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, 'exit');

    // Decorative lines disappear
    tl.to([decorLeft, decorRight], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 'exit');

    // Background splits — asymmetric timing for organic feel
    if (splitTop && splitBot) {
      tl.to(splitTop, {
        yPercent: -100,
        duration: 1.8,
        ease: 'power3.inOut',
      }, 'exit+=0.4');

      tl.to(splitBot, {
        yPercent: 100,
        duration: 1.8,
        ease: 'power3.inOut',
      }, 'exit+=0.55'); // Asymmetric 0.15s offset
    }

  }, { scope: container, dependencies: [isCompleted] });

  if (isCompleted) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 w-full h-[100dvh] z-[99999] overflow-hidden"
    >
      {/* ── Split Background — Top Half ── */}
      <div
        ref={splitTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#0a0806]"
        style={{ willChange: 'transform' }}
      >
        {/* Warm cinematic light leak — top right corner */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(ellipse_90%_70%_at_75%_25%,rgba(199,154,69,0.3),transparent_55%)]" />
        {/* Split edge shadow for depth */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ── Split Background — Bottom Half ── */}
      <div
        ref={splitBotRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#0a0806]"
        style={{ willChange: 'transform' }}
      >
        {/* Subtle warm glow — bottom left corner */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_25%_75%,rgba(199,154,69,0.25),transparent_50%)]" />
        {/* Split edge shadow for depth */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ── The Horizon Line — 1px gold, center of screen ── */}
      <div
        ref={horizonRef}
        className="absolute top-1/2 left-[6%] right-[6%] h-px z-30 pointer-events-none scale-x-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(199,154,69,0.4) 10%, #c79a45 30%, #e3c179 50%, #c79a45 70%, rgba(199,154,69,0.4) 90%, transparent 100%)',
          willChange: 'transform',
        }}
      />
      {/* Horizon glow bloom — wider, softer, behind the line */}
      <div
        ref={horizonGlowRef}
        className="absolute top-1/2 -translate-y-1/2 left-[6%] right-[6%] h-[3px] z-29 pointer-events-none rounded-full opacity-0 scale-x-0"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(231,193,121,0.3) 25%, rgba(231,193,121,0.5) 50%, rgba(231,193,121,0.3) 75%, transparent 95%)',
          filter: 'blur(6px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* ── Vertical Decorative Lines ── */}
      <div
        ref={decorLineLeftRef}
        className="absolute left-[12%] md:left-[15%] top-[25%] w-px h-[50%] z-10 pointer-events-none transform-gpu opacity-0"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(199,154,69,0.12) 30%, rgba(199,154,69,0.12) 70%, transparent)',
          willChange: 'transform, opacity',
        }}
      />
      <div
        ref={decorLineRightRef}
        className="absolute right-[12%] md:right-[15%] top-[20%] w-px h-[55%] z-10 pointer-events-none transform-gpu opacity-0"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(199,154,69,0.08) 25%, rgba(199,154,69,0.08) 75%, transparent)',
          willChange: 'transform, opacity',
        }}
      />

      {/* ── Spatial Typographic Lockup ── */}
      <div
        ref={lockupRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative w-full max-w-[92vw] md:max-w-[82vw] h-[60vh] md:h-[70vh] flex items-center justify-center">

          {/* ▸ "Kreatif" — Background hollow outline, massive, centered */}
          <div
            className="word-kreatif absolute inset-0 flex items-center justify-center transform-gpu opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <span
              className="font-heading font-bold text-[24vw] md:text-[19vw] leading-none tracking-[-0.04em] uppercase select-none"
              style={{
                WebkitTextStroke: '1.5px rgba(199,154,69,0.25)',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              Kreatif
            </span>
          </div>

          {/* ▸ "Sholeh" — top-left, bold, clip-path reveal */}
          <div
            className="word-sholeh absolute top-[8%] md:top-[10%] left-[4%] md:left-[7%] transform-gpu opacity-0"
            style={{ willChange: 'clip-path' }}
          >
            <span
              className="font-heading font-bold text-[13vw] md:text-[9vw] leading-[0.85] tracking-[-0.03em] text-[#FDF6EC] uppercase block"
              style={{ textShadow: '0 0 60px rgba(199,154,69,0.25), 0 4px 20px rgba(0,0,0,0.4)' }}
            >
              Sholeh
            </span>
            {/* Thin accent line beneath Sholeh */}
            <div
              className="mt-2 md:mt-3 h-px w-[60%]"
              style={{ background: 'linear-gradient(90deg, #c79a45 0%, transparent 100%)' }}
            />
          </div>

          {/* ▸ "Mandiri" — center-left area, italic, elegant and understated */}
          <div
            className="word-mandiri absolute top-[38%] md:top-[40%] left-[2%] md:left-[5%] transform-gpu opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <span
              className="font-accent italic font-normal text-[7vw] md:text-[4.5vw] leading-none tracking-[0.04em] text-[#FDF6EC]/80"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}
            >
              Mandiri
            </span>
          </div>

          {/* ▸ "Berprestasi" — bottom-right, golden gradient, the finale word */}
          <div
            className="word-berprestasi absolute bottom-[12%] md:bottom-[14%] right-[2%] md:right-[4%] transform-gpu text-right opacity-0"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            <span
              className="font-heading font-bold text-[10vw] md:text-[7vw] leading-[0.85] tracking-[-0.02em] uppercase block"
              style={{
                background: 'linear-gradient(135deg, #f5e4a8 0%, #e3c179 30%, #c79a45 65%, #b08935 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 20px rgba(199,154,69,0.3))',
              }}
            >
              Berprestasi
            </span>
            {/* Thin accent line above Berprestasi */}
            <div
              className="mb-2 md:mb-3 h-px w-[40%] ml-auto"
              style={{ background: 'linear-gradient(90deg, transparent 0%, #c79a45 100%)' }}
            />
          </div>

          {/* ▸ Year tag — editorial detail, top-right */}
          <div
            className="year-tag absolute top-[10%] right-[5%] md:right-[7%] transform-gpu opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="font-body text-[9px] md:text-[10px] font-medium uppercase tracking-[0.25em] text-[#FDF6EC]/30">
              NPSN: 70054289
            </span>
          </div>

          {/* ▸ School Name — bottom center, refined */}
          <div
            className="school-name absolute bottom-[2%] md:bottom-[3%] left-1/2 -translate-x-1/2 transform-gpu flex flex-col items-center gap-2 opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <div
              className="w-5 h-px mb-1"
              style={{ background: 'linear-gradient(90deg, transparent, #c79a45, transparent)' }}
            />
            <span className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#c79a45]">
              SMP IT Thoriqul Jannah
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
