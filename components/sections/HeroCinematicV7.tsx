'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const HeroCinematicV7 = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const metaRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Text Reveal (Clip-path from bottom)
    // We animate the clip-path of each line of text
    tl.fromTo(textRefs.current,
      { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }
    );

    // 2. Image Reveal (Scale + Clip)
    tl.fromTo(imageWrapperRef.current,
      { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'power4.inOut' },
      "-=1.0"
    );
    tl.fromTo(imageInnerRef.current,
      { scale: 1.4 },
      { scale: 1, duration: 2, ease: 'power3.out' },
      "-=1.5"
    );

    // 3. Hairline border and Meta data reveal
    tl.fromTo(hairlineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: 'power4.inOut' },
      "-=1.2"
    );
    tl.fromTo(metaRefs.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      "-=0.5"
    );

    // 4. Parallax Scroll Effect on Image
    gsap.to(imageInnerRef.current, {
      y: '20%', // Move image down slightly as user scrolls down
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[100dvh] bg-[#0a0806] pt-32 pb-12 flex flex-col justify-between overflow-hidden">
      
      {/* ── THE ARCHITECTURAL GRID ── */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 flex-grow">
        
        {/* LEFT COLUMN: MASSIVE TYPOGRAPHY (Col 1-7) */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center pb-12 md:pb-24 pt-12">
          
          <div className="overflow-hidden mb-6">
            <p 
              ref={el => { metaRefs.current[0] = el; }} 
              className="font-body text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-[#FDF6EC]/60"
            >
              The Modern Islamic Paradigm
            </p>
          </div>

          <h1 className="font-heading font-bold text-[14vw] md:text-[8vw] leading-[0.85] tracking-tighter uppercase text-[#FDF6EC]">
            <div className="overflow-hidden pb-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
              <span ref={el => { textRefs.current[0] = el; }} className="block transform-gpu">
                SMP IT
              </span>
            </div>
            <div className="overflow-hidden pb-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
              <span ref={el => { textRefs.current[1] = el; }} className="block transform-gpu text-[#c79a45]">
                THORIQUL
              </span>
            </div>
            <div className="overflow-hidden pb-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
              <span ref={el => { textRefs.current[2] = el; }} className="block transform-gpu">
                JANNAH
              </span>
            </div>
          </h1>

          <div className="mt-12 max-w-md overflow-hidden">
            <p 
              ref={el => { metaRefs.current[1] = el; }} 
              className="font-accent italic text-lg md:text-xl text-[#FDF6EC]/80 font-light leading-relaxed"
            >
              Membangun fondasi teknologi dengan kedisiplinan spiritual yang kokoh. Pendidikan bertaraf global di Sinjai Utara.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: EDITORIAL IMAGE (Col 8-12) */}
        <div className="col-span-1 md:col-span-5 flex items-center justify-end">
          {/* Outer wrapper provides the clip path bounds */}
          <div 
            ref={imageWrapperRef} 
            className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden"
          >
            {/* Inner image has absolute scale/translate to allow parallax without breaking bounds */}
            <Image
              ref={imageInnerRef as any}
              src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=1200&auto=format&fit=crop"
              alt="Architecture"
              fill
              className="object-cover transform-gpu origin-center"
              priority
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

      </div>

      {/* ── THE BOTTOM HAIRLINE & META DATA ── */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 mt-12 md:mt-0">
        
        {/* 1px Hairline */}
        <div className="w-full h-[1px] bg-white/10 origin-left" ref={hairlineRef} />
        
        {/* Meta Data Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-[#FDF6EC]/50 font-body text-[10px] md:text-xs uppercase tracking-[0.1em]">
          <div ref={el => { metaRefs.current[2] = el; }}>
            <span className="block text-white/30 mb-1">Status</span>
            <span className="text-[#FDF6EC]">Swasta IT</span>
          </div>
          <div ref={el => { metaRefs.current[3] = el; }}>
            <span className="block text-white/30 mb-1">NPSN</span>
            <span className="text-[#FDF6EC]">70054289</span>
          </div>
          <div ref={el => { metaRefs.current[4] = el; }} className="col-span-2 text-right md:text-left">
            <span className="block text-white/30 mb-1">Lokasi</span>
            <span className="text-[#FDF6EC]">Jl. Lamatti, Kel. Bongki, Sinjai Utara</span>
          </div>
        </div>

      </div>

    </section>
  );
};
