'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =====================================================================
// 📖 HALL OF FAME — Kitab Emas (page-flip Canvas Mode) + Awwwards Polish
// =====================================================================

export interface PrestasiSiswa {
  id: string;
  nama: string;
  judul: string;
  tingkat: string;
  tahun: string;
  kutipan: string;
  image: string;
}

// ─── ORNAMEN ───
const GoldCorner = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <path d="M4 0C2 0 0 2 0 4L0 28C2 24 6 20 12 18L12 12L18 12C20 6 24 2 28 0Z" fill="url(#gc)" />
    <path d="M0 4C4 6 8 10 10 14" stroke="#B8860B" strokeWidth="0.6" opacity="0.5" />
    <path d="M4 0C6 4 10 8 14 10" stroke="#B8860B" strokeWidth="0.6" opacity="0.5" />
    <circle cx="9" cy="9" r="1.2" fill="#D4AF37" opacity="0.7" />
    <defs>
      <linearGradient id="gc" x1="0" y1="0" x2="28" y2="28">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="45%" stopColor="#F5E6A3" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

const GoldRule = ({ width = 'w-32' }: { width?: string }) => (
  <div className={`flex items-center gap-2 ${width} mx-auto`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent" />
    <div className="w-1 h-1 rotate-45 bg-[#D4AF37]/80" />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent" />
  </div>
);

const FourCorners = ({ size = 'w-10 h-10' }: { size?: string }) => (
  <>
    <GoldCorner className={`absolute top-3 left-3 ${size}`} />
    <GoldCorner className={`absolute top-3 right-3 ${size} -scale-x-100`} />
    <GoldCorner className={`absolute bottom-3 left-3 ${size} -scale-y-100`} />
    <GoldCorner className={`absolute bottom-3 right-3 ${size} -scale-x-100 -scale-y-100`} />
  </>
);

const RealisticWaxSeal = () => (
  <div className="relative flex flex-col items-center justify-center pointer-events-none">
    <div className="relative w-40 h-40 flex items-center justify-center">
      <Image src="/stempel.png" alt="Royal Wax Seal" fill className="object-contain" priority />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// KOMPONEN UTAMA
// ═══════════════════════════════════════════════════════
export const HallOfFameCrown = ({ prestasi }: { prestasi: PrestasiSiswa[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<import('page-flip').PageFlip | null>(null);
  const lastFlippedPage = useRef<number>(0);
  
  // ─── Awwwards Polish Refs ───
  const glowRef = useRef<HTMLDivElement>(null);
  const totalPages = (prestasi.length * 2) + 2;

  // Inisialisasi page-flip Canvas engine
  useEffect(() => {
    if (!bookContainerRef.current) return;
    let pf: import('page-flip').PageFlip | null = null;

    const initFlipBook = async () => {
      const { PageFlip } = await import('page-flip');
      const container = bookContainerRef.current;
      if (!container) return;

      pf = new PageFlip(container, {
        width: 400,
        height: 550,
        size: 'stretch',
        minWidth: 280,
        maxWidth: 600,
        minHeight: 380,
        maxHeight: 700,
        showCover: true,
        mobileScrollSupport: false,
        drawShadow: true,
        flippingTime: 1500,
        usePortrait: false,
        startZIndex: 0,
        autoSize: false,
        maxShadowOpacity: 0.8,
        showPageCorners: false, // Dimatikan agar user tidak bingung mencoba men-drag
        disableFlipByClick: true, // Scroll adalah satu-satunya sumber kebenaran (source of truth)
        useMouseEvents: false, // Dimatikan agar tidak konflik dengan ScrollTrigger
        swipeDistance: 30,
        clickEventForward: true,
        startPage: 0,
      });

      const pages = container.querySelectorAll('.pf-page');
      if (pages.length > 0) {
        pf.loadFromHTML(pages as NodeListOf<HTMLElement>);
        pageFlipRef.current = pf;

        pf.on('flip', () => {
          // Page flipped cleanly without audio overhead
        });
      }
    };

    initFlipBook();
    return () => {
      if (pf) { try { pf.destroy(); } catch { /* ignore */ } }
      pageFlipRef.current = null;
    };
  }, [totalPages]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ─── Awwwards Polish: GPU-Accelerated Section-Scoped Glow & 3D Tilt ───
    if (glowRef.current) {
      gsap.set(glowRef.current, { xPercent: -50, yPercent: -50, force3D: true });
    }
    const glowXTo = glowRef.current
      ? gsap.quickTo(glowRef.current, 'x', { duration: 0.45, ease: 'power3.out' })
      : null;
    const glowYTo = glowRef.current
      ? gsap.quickTo(glowRef.current, 'y', { duration: 0.45, ease: 'power3.out' })
      : null;
    const tiltXTo = bookContainerRef.current
      ? gsap.quickTo(bookContainerRef.current, 'rotationX', { duration: 0.6, ease: 'power2.out' })
      : null;
    const tiltYTo = bookContainerRef.current
      ? gsap.quickTo(bookContainerRef.current, 'rotationY', { duration: 0.6, ease: 'power2.out' })
      : null;

    let rafId: number | null = null;
    let lastClientX = 0;
    let lastClientY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const localX = lastClientX - rect.left;
        const localY = lastClientY - rect.top;

        glowXTo?.(localX);
        glowYTo?.(localY);

        if (tiltXTo && tiltYTo) {
          const xOffset = (lastClientX / window.innerWidth - 0.5) * 2;
          const yOffset = (lastClientY / window.innerHeight - 0.5) * 2;
          tiltYTo(xOffset * 3);
          tiltXTo(-yOffset * 3);
        }
        rafId = null;
      });
    };

    const handlePointerLeave = () => {
      tiltXTo?.(0);
      tiltYTo?.(0);
    };

    section.addEventListener('pointermove', handlePointerMove, { passive: true });
    section.addEventListener('pointerleave', handlePointerLeave);

    // ─── GSAP Scroll Sequence ───
    const scrollLength = 200 + (prestasi.length * 130);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollLength}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const pf = pageFlipRef.current;
          if (!pf) return;
          const progress = self.progress;
          
          const bookStart = 0.15;
          const bookEnd = 0.70; // Buku selesai membalik dan tertutup rapat di 70% scroll
          
          let clampedTarget = 0;
          if (progress <= bookStart) {
            clampedTarget = 0;
          } else if (progress >= bookEnd) {
            clampedTarget = totalPages - 1;
          } else {
            const bookProgress = (progress - bookStart) / (bookEnd - bookStart);
            clampedTarget = Math.min(totalPages - 1, Math.max(0, Math.floor(bookProgress * totalPages)));
          }
          
          if (clampedTarget !== lastFlippedPage.current) {
            try {
              const state = pf.getState();
              if (state === 'read') {
                pf.flip(clampedTarget);
                lastFlippedPage.current = clampedTarget;
              }
            } catch { /* pf not ready yet */ }
          }
        }
      }
    });

    // ── ACT 1: GERBANG TERBUKA (0% - 15% scroll) ──
    tl.to('#global-navbar', { yPercent: -150, opacity: 0, duration: 0.8, ease: 'power2.in' }, 0);
    tl.to('.curtain-left', { xPercent: -100, duration: 1.4, ease: 'power3.inOut' }, 0);
    tl.to('.curtain-right', { xPercent: 100, duration: 1.4, ease: 'power3.inOut' }, 0);
    tl.to('.wax-seal-left', { x: '-50vw', duration: 1.4, ease: 'power3.inOut' }, 0);
    tl.to('.wax-seal-right', { x: '50vw', duration: 1.4, ease: 'power3.inOut' }, 0);
    tl.fromTo('.jolt-left', { rotation: 0, x: 0 }, { rotation: -6, x: -10, y: 5, duration: 0.3, ease: 'power4.out' }, 0);
    tl.fromTo('.jolt-right', { rotation: 0, x: 0 }, { rotation: 6, x: 10, y: 5, duration: 0.3, ease: 'power4.out' }, 0);

    tl.fromTo('.book-wrapper',
      { opacity: 0, scale: 0.85, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.7
    );

    // ── ACT 2: WAKTU MEMBACA BUKU (15% - 75% scroll) ──
    // Memberikan ruang scroll luas khusus membaca buku
    tl.to({}, { duration: 6.0 }, 1.5);

    // ── ACT 3: GERBANG TERTUTUP SETELAH BUKU TERTUTUP (75% - 100% scroll) ──
    // 1. Buku yang sudah tertutup rapi memudar perlahan
    tl.to('.book-wrapper', { opacity: 0, scale: 0.92, y: -20, duration: 0.6, ease: 'power2.inOut' }, 7.5);

    // 2. SETELAH buku memudar, gerbang meluncur menutup
    tl.to('#global-navbar', { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 8.1);
    tl.to('.curtain-left', { xPercent: 0, duration: 1.2, ease: 'power4.inOut' }, 8.1);
    tl.to('.curtain-right', { xPercent: 0, duration: 1.2, ease: 'power4.inOut' }, 8.1);
    tl.to('.curtain-text', { opacity: 0, duration: 0.5, ease: 'power2.out' }, 8.1);

    // 3. Kutipan penutup muncul di atas gerbang yang sudah tertutup rapat
    tl.fromTo('.closing-quote',
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
      9.1
    );

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, { scope: sectionRef });

  return (
    <section id="hall-of-fame" ref={sectionRef} className="relative min-h-[100dvh] bg-[#0A0604] overflow-clip [isolation:isolate] text-[#F8F7F2] font-sans">
      
      {/* ─── FIX CSS 3D GLITCH ─── */}
      <style dangerouslySetInnerHTML={{__html: `
        .pf-page {
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          transform: translateZ(0);
        }
      `}} />

      {/* ─── AMBIENT GLOW LIGHTING (GPU-Translated Radial Layer) ─── */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-[760px] h-[760px] rounded-full z-10 pointer-events-none will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%)' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0604] via-[#12100D] to-[#0A0604]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `repeating-linear-gradient(90deg, #D4AF37 0px, transparent 1px, transparent 100px)` }} />

      {/* ─── BUKU (page-flip Canvas) ─── */}
      <div className="book-wrapper absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0" style={{ transformStyle: 'preserve-3d' }}>
        <div 
          data-cursor="scroll"
          className="pointer-events-auto w-[76vw] md:w-[63vw] max-w-[810px] aspect-[800/550]"
        >
          <div ref={bookContainerRef} className="w-full h-full relative z-20">
            
            {/* ═══ SAMPUL DEPAN ═══ */}
            <div className="pf-page" data-density="hard">
              <div className="relative w-full h-full select-none bg-gradient-to-br from-[#1A120B] via-[#2A1F14] to-[#0D0907] overflow-hidden">
                {/* Royal Islamic Geometry Pattern Background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_width=%2240%22_height=%2240%22_viewBox=%220_0_40_40%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath_d=%22M20_3.333L36.667_20_20_36.667_3.333_20_20_3.333zm0_2.357L5.69_20_20_34.31_34.31_20_20_5.69z%22_fill=%22%23D4AF37%22_fill-opacity=%220.15%22_fill-rule=%22evenodd%22/%3E%3C/svg%3E')] bg-repeat opacity-40" />
                
                {/* Ornamen Garis Kerajaan */}
                <div className="absolute inset-[16px] border-double border-[6px] border-[#D4AF37]/30 rounded-sm" />
                <div className="absolute inset-[24px] border border-[#D4AF37]/15 rounded-sm" />
                
                <FourCorners size="w-16 h-16" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-[#F8F7F2]">
                  <div className="relative w-28 h-28 mb-8">
                    <div className="absolute inset-0 rounded-full border-dashed border-[2px] border-[#D4AF37]/40 animate-[spin_30s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-[#D4AF37]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src="/stempel.png" alt="Seal" width={80} height={80} className="object-contain opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                    </div>
                  </div>
                  
                  <GoldRule width="w-32" />
                  <h1 className="text-[36px] md:text-[46px] leading-[1.1] font-heading font-black tracking-[0.2em] uppercase mt-6 mb-3 bg-[linear-gradient(160deg,#D4AF37,#F5E6A3_45%,#D4AF37_55%,#B8860B)] bg-clip-text text-transparent drop-shadow-md">
                    Hall of Fame
                  </h1>
                  <p className="text-[#D4AF37]/60 text-[14px] tracking-[0.8em] uppercase font-mono font-semibold">كتاب الشرف</p>
                  <GoldRule width="w-32" />
                  
                  <p className="text-[#F8F7F2]/40 text-[11px] tracking-[0.3em] uppercase mt-8 font-mono border-t border-b border-[#D4AF37]/20 py-2 px-6">Kitab Kehormatan</p>
                </div>
              </div>
            </div>

            {/* ═══ HALAMAN ISI (Photo → Detail pairs) ═══ */}
            {prestasi.map((item, i) => (
              <React.Fragment key={item.id}>
                {/* Halaman FOTO */}
                <div className="pf-page" data-density={i === 0 ? 'hard' : 'soft'}>
                  <div className="relative w-full h-full select-none bg-gradient-to-br from-[#FCF5E5] via-[#F7F0DF] to-[#EAD8C1]">
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                      backgroundImage: `repeating-linear-gradient(0deg, #8B7355 0px, transparent 1px, transparent 3px)`,
                      backgroundSize: '100% 3px',
                    }} />
                    <div className="absolute inset-4 border border-[#C8B48A]/40" />
                    <FourCorners size="w-8 h-8" />
                    <div className="absolute inset-6 overflow-hidden bg-[#1A120B] rounded-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.nama} className="absolute inset-0 w-full h-full object-cover opacity-95 contrast-[1.05] sepia-[0.1]" loading="lazy" />
                      
                      {/* Soft vintage vignette */}
                      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(26,18,11,0.5)] pointer-events-none" />
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A120B]/95 via-[#1A120B]/60 to-transparent pt-12 pb-4 px-4 text-center z-10">
                        <p className="text-[#F5E6A3] text-[11px] tracking-[0.3em] uppercase font-mono">{item.tahun} · {item.tingkat}</p>
                        <p className="text-white/90 text-sm font-heading font-semibold mt-1 drop-shadow-md">{item.nama}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Halaman DETAIL */}
                <div className="pf-page" data-density={i === prestasi.length - 1 ? 'hard' : 'soft'}>
                  <div className="relative w-full h-full select-none bg-gradient-to-bl from-[#FCF5E5] via-[#F8F2E4] to-[#F0E6D2]">
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, #8B7355 0px, transparent 1px, transparent 4px)`,
                      backgroundSize: '4px 100%',
                    }} />
                    <div className="absolute inset-4 border border-[#C8B48A]/30" />
                    <FourCorners size="w-7 h-7" />
                    <div className="absolute inset-0 flex flex-col justify-center px-7 md:px-10 py-8">
                      <span className="text-[#B8860B]/40 text-[10px] font-mono tracking-[0.5em] uppercase mb-5">— No. {String(i + 1).padStart(2, '0')} —</span>
                      <h2 className="text-[20px] md:text-[26px] font-heading font-bold tracking-tight leading-[1.15] text-[#2C1810] mb-2">{item.nama}</h2>
                      <p className="text-[#5C3D2E] text-[11px] md:text-[12px] tracking-[0.12em] uppercase font-medium mb-4 leading-relaxed">{item.judul}</p>
                      <div className="flex items-center gap-2.5 mb-5">
                        <span className="px-2.5 py-1 border border-[#B8860B]/30 text-[#8B6914] text-[9px] tracking-[0.15em] uppercase font-mono rounded-sm bg-[#D4AF37]/5">{item.tingkat}</span>
                        <span className="text-[#B8860B]/30 text-[10px]">•</span>
                        <span className="text-[#8B7355]/60 text-[9px] tracking-[0.15em] uppercase font-mono">{item.tahun}</span>
                      </div>
                      <GoldRule width="w-20" />
                      <blockquote className="mt-5 relative pl-4 border-l-2 border-[#D4AF37]/30">
                        <span className="text-[#B8860B]/30 text-3xl font-serif absolute -top-3 -left-1 leading-none">&ldquo;</span>
                        <p className="text-[#3E2A1C] text-[12px] md:text-[14px] italic leading-[1.7] font-light">{item.kutipan}</p>
                        <span className="text-[#B8860B]/30 text-3xl font-serif leading-none">&rdquo;</span>
                      </blockquote>
                      <div className="mt-6 flex items-center gap-2 opacity-20">
                        <div className="relative w-7 h-7">
                          <Image src="/stempel.png" alt="seal" fill className="object-contain" />
                        </div>
                        <div className="h-px flex-1 bg-[#B8860B]/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* ═══ SAMPUL BELAKANG ═══ */}
            <div className="pf-page" data-density="hard">
              <div className="relative w-full h-full select-none bg-gradient-to-br from-[#1A120B] via-[#2A1F14] to-[#0D0907]">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle,#D4AF37_0.4px,transparent_0.4px)] bg-[length:20px_20px]" />
                <div className="absolute inset-[10px] border border-[#D4AF37]/18 rounded-sm" />
                <div className="absolute inset-[16px] border border-[#D4AF37]/8 rounded-sm" />
                <FourCorners size="w-10 h-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-[#F8F7F2]">
                  <GoldRule width="w-20" />
                  <blockquote className="text-[16px] md:text-[20px] font-heading font-normal tracking-tight leading-relaxed max-w-[260px] mt-3 mb-3 bg-[linear-gradient(160deg,#D4AF37,#F5E6A3_45%,#D4AF37_55%,#B8860B)] bg-clip-text text-transparent">
                    &ldquo;Kejayaan Bukanlah Akhir, Melainkan Awal dari Sejarah Baru.&rdquo;
                  </blockquote>
                  <GoldRule width="w-20" />
                  <p className="text-[#F8F7F2]/25 text-[9px] tracking-[0.5em] uppercase font-mono mt-4">Teruslah Berkarya</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══ TIRAI KIRI ═══ */}
      <div className="curtain-left absolute top-0 left-0 w-1/2 h-full z-40 bg-gradient-to-r from-[#0F0102] to-[#1A0306] border-r border-[#D4AF37]/25 overflow-hidden pointer-events-none">
        <h1 className="curtain-text absolute top-[35%] left-full -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[12vw] leading-none font-black font-heading tracking-tight text-[#D4AF37] whitespace-nowrap opacity-15">HALL OF FAME</h1>
      </div>

      {/* ═══ TIRAI KANAN ═══ */}
      <div className="curtain-right absolute top-0 right-0 w-1/2 h-full z-40 bg-gradient-to-l from-[#0F0102] to-[#1A0306] border-l border-[#D4AF37]/25 overflow-hidden pointer-events-none">
        <h1 className="curtain-text absolute top-[35%] left-0 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[12vw] leading-none font-black font-heading tracking-tight text-[#D4AF37] whitespace-nowrap opacity-15">HALL OF FAME</h1>
      </div>

      {/* ═══ SEGEL LILIN ═══ */}
      <div className="absolute top-1/2 left-1/2 z-[60] pointer-events-none">
        <div className="wax-seal-left absolute top-0 left-0 origin-center">
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="jolt-left origin-bottom-right">
              <div style={{ clipPath: 'polygon(0% 0%, 50% 0%, 48% 12%, 49% 15%, 54% 22%, 55% 26%, 46% 33%, 45% 36%, 50% 41%, 51% 52%, 48% 60%, 47% 65%, 53% 72%, 54% 78%, 49% 88%, 50% 95%, 50% 100%, 0% 100%)' }}>
                <RealisticWaxSeal />
              </div>
            </div>
          </div>
        </div>
        <div className="wax-seal-right absolute top-0 left-0 origin-center">
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="jolt-right origin-bottom-left">
              <div style={{ clipPath: 'polygon(100% 0%, 100% 100%, 50% 100%, 50% 95%, 49% 88%, 54% 78%, 53% 72%, 47% 65%, 48% 60%, 51% 52%, 50% 41%, 45% 36%, 46% 33%, 55% 26%, 54% 22%, 49% 15%, 48% 12%, 50% 0%)' }}>
                <RealisticWaxSeal />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ KUTIPAN PENUTUP ═══ */}
      <div className="closing-quote absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center opacity-0 pointer-events-none">
        <div className="w-10 h-10 mb-6 border border-[#D4AF37]/25 rounded-full flex items-center justify-center bg-white/5">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-normal tracking-tight leading-snug max-w-3xl mb-6"
          style={{ background: 'linear-gradient(160deg, #D4AF37, #F5E6A3 45%, #D4AF37 55%, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >&ldquo;Kejayaan Bukanlah Akhir,<br />Melainkan Awal dari Sejarah Baru.&rdquo;</h2>
        <span className="text-[#F8F7F2]/40 text-[10px] md:text-xs font-mono tracking-[0.5em] uppercase">Teruslah Berkarya</span>
      </div>
    </section>
  );
};
