'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematicV5 = () => {
  const containerRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !pinWrapperRef.current) return;

    // 1. Entrance Animation
    gsap.fromTo(
      pinWrapperRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    );

    // 2. The Cinematic Pin & Scroll Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%', // Pin for 2x viewport height
        scrub: 1, // Smooth scrubbing
        pin: pinWrapperRef.current,
      }
    });

    // Move the cards wrapper up significantly to scroll through the cards
    // Assuming 3 cards, we move it up by roughly 2 cards height
    tl.to(cardsWrapperRef.current, {
      y: '-65%', 
      ease: 'none'
    }, 0);

    // 3. Card Interpolation (Scale & Fade based on position)
    // We animate each card's scale and opacity based on its scroll progress
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      // Each card enters the "sweet spot" at a specific time in the timeline
      // Card 0 is in the sweet spot at 0%
      // Card 1 is in the sweet spot at ~50%
      // Card 2 is in the sweet spot at ~100%
      
      const startFocus = index === 0 ? 0 : (index / 2) - 0.2;
      const endFocus = index === 2 ? 1 : (index / 2) + 0.2;

      // Animate from small/dim to full
      if (index !== 0) {
        tl.fromTo(card,
          { scale: 0.85, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.inOut' },
          startFocus
        );
      }

      // Animate from full to small/dim (except the last card)
      if (index !== 2) {
        tl.to(card,
          { scale: 0.85, opacity: 0.4, duration: 0.2, ease: 'power2.inOut' },
          endFocus
        );
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-[#0a0806] overflow-visible">
      
      {/* ── PINNED WRAPPER ── */}
      {/* Takes 100dvh, gets pinned by GSAP while container scrolls 300vh */}
      <div 
        ref={pinWrapperRef} 
        className="relative w-full h-[100dvh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 overflow-hidden max-w-screen-2xl mx-auto"
      >
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-[#c79a45]/5 blur-[120px] pointer-events-none" />

        {/* ── LEFT: EDITORIAL TYPOGRAPHY ── */}
        <div className="w-full md:w-[55%] flex flex-col items-start justify-center pt-24 md:pt-0 z-20">
          
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c79a45] animate-pulse" />
            <span className="font-body text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#FDF6EC]/80">
              Penerimaan Siswa Baru Dibuka
            </span>
          </div>

          <h1 className="font-heading font-bold text-[12vw] md:text-[6.5vw] leading-[1.05] tracking-tight uppercase text-[#FDF6EC]">
            SMP IT
            <br />
            THORIQUL 
            {/* INLINE IMAGE */}
            <span 
              className="inline-block align-middle w-[16vw] md:w-[12vw] h-[0.7em] mx-3 md:mx-4 rounded-full border border-white/20 bg-cover bg-center shadow-lg transform-gpu -translate-y-[4px]"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop")' }}
            />
            JANNAH
          </h1>

          <p className="mt-8 font-accent italic text-lg md:text-2xl text-[#FDF6EC]/70 max-w-xl font-light leading-relaxed">
            Merekayasa masa depan digital tanpa meninggalkan akar spiritual. Pendidikan bertaraf agensi global.
          </p>

          {/* BUTTON-IN-BUTTON CTA */}
          <div className="mt-12 group relative inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-[#c79a45] text-[#0a0806] font-semibold tracking-wide hover:scale-[0.98] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer">
            <span>Jelajahi Program</span>
            <div className="w-10 h-10 rounded-full bg-[#0a0806]/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>

        </div>

        {/* ── RIGHT: DOUBLE-BEZEL FLOATING GALLERY ── */}
        <div className="w-full md:w-[40%] h-[70vh] md:h-[85vh] relative flex flex-col justify-center mt-12 md:mt-0 z-10 pointer-events-none">
          <div ref={cardsWrapperRef} className="absolute top-[15vh] w-full flex flex-col gap-12 md:gap-24">
            
            {/* Card 1 */}
            <div ref={(el) => { cardsRef.current[0] = el; }} className="w-full origin-center">
              {/* Outer Shell */}
              <div className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                {/* Inner Core */}
                <div className="relative w-full aspect-[3/4] md:aspect-[9/13] rounded-[calc(2rem-8px)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-black/40">
                  <Image 
                    src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=1200&auto=format&fit=crop" 
                    alt="Campus" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-body text-xs tracking-widest uppercase mb-1 opacity-80">01. Fasilitas</p>
                    <p className="text-white font-heading font-medium text-lg md:text-xl">Kampus Terpadu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div ref={(el) => { cardsRef.current[1] = el; }} className="w-full origin-center scale-[0.85] opacity-40">
              <div className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="relative w-full aspect-[3/4] md:aspect-[9/13] rounded-[calc(2rem-8px)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-black/40">
                  <Image 
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop" 
                    alt="Pendidikan" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-body text-xs tracking-widest uppercase mb-1 opacity-80">02. Kurikulum</p>
                    <p className="text-white font-heading font-medium text-lg md:text-xl">Integrasi IT & Diniyah</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div ref={(el) => { cardsRef.current[2] = el; }} className="w-full origin-center scale-[0.85] opacity-40">
              <div className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="relative w-full aspect-[3/4] md:aspect-[9/13] rounded-[calc(2rem-8px)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-black/40">
                  <Image 
                    src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1200&auto=format&fit=crop" 
                    alt="Prestasi" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-body text-xs tracking-widest uppercase mb-1 opacity-80">03. Prestasi</p>
                    <p className="text-white font-heading font-medium text-lg md:text-xl">Generasi Juara</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
