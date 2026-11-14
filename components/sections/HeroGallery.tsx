'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY = {
  sholeh: [
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=1200&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop"  
  ],
  mandiri: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1200&auto=format&fit=crop"
  ],
  kreatif: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop"
  ],
  prestasi: [
    "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501250987900-211872d97eaa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop"
  ]
};

export const HeroGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1 = useRef<HTMLDivElement>(null);
  const col2 = useRef<HTMLDivElement>(null);
  const col3 = useRef<HTMLDivElement>(null);
  const col4 = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const schoolNameRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    // Simulasi delay GatePage
    const timer = setTimeout(() => setCanPlay(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!canPlay || !containerRef.current) return;

    // AWWWARDS-LEVEL COMPLEXITY SETUP
    // Gambar baru disembunyikan menggunakan clip-path murni (terpotong dari bawah)
    gsap.set('.gallery-wrapper-1, .gallery-wrapper-2, .gallery-wrapper-3', { 
      clipPath: 'inset(100% 0 0 0)' // Tersembunyi sempurna di bawah
    });

    // Gambar di dalamnya kita siapkan untuk efek parallax berlawanan dan zoom out
    gsap.set('.gallery-inner-1, .gallery-inner-2, .gallery-inner-3', { 
      yPercent: 15,
      scale: 1.2
    });

    // Overlay tenggelam (untuk foto lama) dimulai dari 0
    gsap.set('.sink-overlay', { opacity: 0 });

    const enterTl = gsap.timeline();
    
    // 2. ENTER CHOREOGRAPHY (Fluid clip-path reveal instead of sliding blocks)
    enterTl.fromTo([col1.current, col2.current, col3.current, col4.current], {
      clipPath: 'inset(100% 0 0 0)'
    }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 2.0,
      stagger: { amount: 0.25, from: "start" as const, ease: "power2.out" },
      ease: "power4.inOut"
    });

    const wordEls = wordsRef.current?.querySelectorAll('.word-title');
    if (wordEls) {
      enterTl.fromTo(wordEls, {
        y: 40,
        opacity: 0,
        scale: 0.95
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        stagger: 0.1,
        ease: "expo.out"
      }, "-=1.0");
    }

    // 3. COMPLEX OVERLAPPING CHOREOGRAPHY ("TERSINGKAP" EFFECT)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.5, // Scrub sangat tinggi untuk fluiditas buttery
        anticipatePin: 1
      }
    });

    const EASE_CURVE = "power3.inOut";
    const STAGGER_SETTING = { amount: 0.3, from: "start" as const };

    // === PHASE 1 ===
    // Foto Baru (Set 1) menyingkap dari bawah
    scrollTl.to('.gallery-wrapper-1', {
      clipPath: 'inset(0% 0 0 0)',
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase1');
    // Foto Baru melakukan parallax kebalikannya agar terasa "membuka"
    scrollTl.to('.gallery-inner-1', {
      yPercent: 0,
      scale: 1,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase1');
    // Foto Lama (Set 0) tenggelam ke belakang (sink) dan menjadi gelap
    scrollTl.to('.gallery-inner-0', {
      yPercent: -15, // Hanya bergeser sedikit (parallax)
      scale: 0.9,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase1');
    scrollTl.to('.sink-overlay-0', {
      opacity: 0.6,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase1');


    // === PHASE 2 ===
    scrollTl.to('.gallery-wrapper-2', {
      clipPath: 'inset(0% 0 0 0)',
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase2');
    scrollTl.to('.gallery-inner-2', {
      yPercent: 0,
      scale: 1,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase2');
    scrollTl.to('.gallery-inner-1', {
      yPercent: -15,
      scale: 0.9,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase2');
    scrollTl.to('.sink-overlay-1', {
      opacity: 0.6,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase2');


    // === PHASE 3 ===
    scrollTl.to('.gallery-wrapper-3', {
      clipPath: 'inset(0% 0 0 0)',
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase3');
    scrollTl.to('.gallery-inner-3', {
      yPercent: 0,
      scale: 1,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase3');
    scrollTl.to('.gallery-inner-2', {
      yPercent: -15,
      scale: 0.9,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase3');
    scrollTl.to('.sink-overlay-2', {
      opacity: 0.6,
      stagger: STAGGER_SETTING,
      ease: EASE_CURVE,
      duration: 1
    }, 'phase3');

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

  }, { dependencies: [canPlay], scope: containerRef });

  const renderColumn = (
    colRef: React.RefObject<HTMLDivElement | null>,
    images: string[],
    label: string
  ) => (
    <div ref={colRef} className="relative w-1/4 h-full border-r border-[#c79a45]/10 transform-gpu will-change-transform opacity-100">
      {images.map((src, i) => (
        // Wrapper digunakan untuk Clip-Path (sebagai "pisau" pemotong)
        <div 
          key={i} 
          className={`absolute inset-0 w-full h-full transform-gpu gallery-wrapper-${i} ${i === 0 ? 'z-0' : i === 1 ? 'z-10' : i === 2 ? 'z-20' : 'z-30'}`}
        >
          {/* Inner digunakan untuk transform parallax & scale (isi lukisannya) */}
          <div className={`absolute inset-0 w-full h-full transform-gpu gallery-inner-${i}`}>
            <img 
              src={src} 
              alt={`${label} ${i}`} 
              className="absolute inset-0 w-full h-full object-cover" 
              loading={i === 0 ? "eager" : "lazy"} 
              crossOrigin="anonymous" 
            />
            {/* Lapisan emas ringan tanpa mix-blend untuk performa */}
            <div className="absolute inset-0 bg-[#c79a45] opacity-[0.08]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100D0B] via-transparent to-[#100D0B]/30" />
            
            {/* Sink Overlay: Lapisan hitam yang akan menebal saat foto ini digeser ke belakang */}
            <div className={`absolute inset-0 bg-[#000000] sink-overlay sink-overlay-${i} pointer-events-none`} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] bg-[#100D0B] overflow-hidden">
      <div
        ref={horizonRef}
        className="absolute top-1/2 left-[5%] right-[5%] h-[2px] z-40 pointer-events-none bg-[linear-gradient(90deg,transparent_0%,rgba(199,154,69,0.35)_10%,#c79a45_30%,#e3c179_50%,#c79a45_70%,rgba(199,154,69,0.35)_90%,transparent_100%)] shadow-[0_0_15px_rgba(199,154,69,0.5)]"
      />

      <div
        ref={schoolNameRef}
        className="absolute top-1/2 -translate-y-[calc(50%+2.5rem)] md:-translate-y-[calc(50%+3rem)] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 md:gap-4 w-[90%] md:w-auto pointer-events-none"
      >
        <span className="font-heading text-base sm:text-lg md:text-2xl lg:text-3xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[#c79a45] drop-shadow-[0_4px_20px_rgba(199,154,69,0.4)] text-center leading-snug">
          SMP IT Thoriqul Jannah
        </span>
        <div className="w-12 md:w-16 h-px bg-[linear-gradient(90deg,transparent,#c79a45,transparent)]" />
      </div>

      <div className="absolute inset-0 flex w-full h-full z-30">
        {renderColumn(col1, GALLERY.sholeh, "Sholeh")}
        {renderColumn(col2, GALLERY.mandiri, "Mandiri")}
        {renderColumn(col3, GALLERY.kreatif, "Kreatif")}
        {renderColumn(col4, GALLERY.prestasi, "Prestasi")}
      </div>

      <div ref={wordsRef} className="absolute inset-0 pointer-events-none z-50">
        <div className="word-title absolute bottom-[10%] left-5 md:left-8 opacity-0">
          <span className="block font-heading font-black text-4xl md:text-[4.5vw] text-[#FDF6EC] uppercase tracking-tight leading-[0.85] [text-shadow:0_6px_40px_rgba(0,0,0,0.7)]">
            Sholeh
          </span>
          <div className="mt-3 w-10 h-[2px] bg-[#6b8e23] shadow-[0_0_8px_rgba(107,142,35,0.6)]" />
        </div>
        <div className="word-title absolute top-[10%] left-[27%] md:left-[27%] opacity-0">
          <div className="mb-3 w-10 h-[2px] bg-[#6b8e23] shadow-[0_0_8px_rgba(107,142,35,0.6)]" />
          <span className="block font-accent italic font-light text-4xl md:text-[4.5vw] text-[#c79a45] leading-[0.85] [text-shadow:0_6px_40px_rgba(0,0,0,0.7)]">
            Mandiri
          </span>
        </div>
        <div className="word-title absolute bottom-[10%] right-[27%] md:right-[27%] text-right opacity-0">
          <span className="block font-heading font-bold text-3xl md:text-[3.5vw] text-transparent uppercase tracking-wider leading-[0.85] [-webkit-text-stroke:1.5px_rgba(246,239,226,0.65)] [text-shadow:0_0_50px_rgba(199,154,69,0.15)]">
            Kreatif
          </span>
          <div className="mt-3 ml-auto w-10 h-[2px] bg-[#6b8e23] shadow-[0_0_8px_rgba(107,142,35,0.6)]" />
        </div>
        <div className="word-title absolute top-[10%] right-5 md:right-8 text-right opacity-0">
          <div className="mb-3 ml-auto w-10 h-[2px] bg-[#6b8e23] shadow-[0_0_8px_rgba(107,142,35,0.6)]" />
          <span className="block font-heading font-bold text-3xl md:text-[3.5vw] uppercase tracking-tight leading-[0.85] bg-[linear-gradient(135deg,#f5e4a8_0%,#e3c179_30%,#c79a45_65%,#b08935_100%)] bg-clip-text text-transparent drop-shadow-[0_6px_25px_rgba(199,154,69,0.35)]">
            Berprestasi
          </span>
        </div>
      </div>
    </section>
  );
};
