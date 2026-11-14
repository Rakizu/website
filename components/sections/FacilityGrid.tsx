'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Fasilitas {
  id: string;
  nama: string;
  deskripsi: string;
  image: string;
}

interface FacilityGridProps {
  fasilitas: Fasilitas[];
}

export const FacilityGrid: React.FC<FacilityGridProps> = ({ fasilitas }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const items = container.current.querySelectorAll('.fasilitas-item');
    
    // Staggered reveal for grid items
    gsap.fromTo(items,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          once: true,
        }
      }
    );

    // Parallax effect on hover is handled via CSS transition for better performance
  }, { scope: container });

  return (
    <section 
      id="fasilitas"
      data-theme="light"
      ref={container}
      className="py-24 md:py-32 bg-canvas-white relative z-10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-whisper-border pb-12">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-charcoal-ink tracking-tight">
            Ruang<br />Tumbuh.
          </h2>
          <p className="text-lg md:text-xl lg:text-[22px] text-charcoal-ink/75 max-w-md leading-[1.6]">
            Fasilitas modern yang didesain secara khusus untuk menunjang eksplorasi tanpa batas.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[340px]">
          {fasilitas.map((f, i) => {
            // Dynamic cycle pattern every 4 items
            const patternIndex = i % 4;
            let spanClass = "md:col-span-4 md:row-span-1";
            if (patternIndex === 0) spanClass = "md:col-span-8 md:row-span-2";
            else if (patternIndex === 3) spanClass = "md:col-span-12 md:row-span-1";

            return (
              <div 
                key={f.id} 
                className={`fasilitas-item group relative rounded-[2rem] overflow-hidden bg-[#16110d] border border-white/10 hover:border-[#c79a45]/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out ${spanClass}`}
              >
                {/* Top edge light dispersion bar (Hairline Shimmer) */}
                <div className="absolute inset-x-0 top-0 h-px rounded-t-[2rem] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />
                
                {/* Image Layer with subtle scale on hover */}
                <Image 
                  src={f.image || '/images/placeholder.jpg'} 
                  alt={f.nama} 
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/90 via-charcoal-ink/20 to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <h3 className="text-2xl md:text-3xl font-heading text-white mb-2.5 tracking-tight drop-shadow-md">
                      {f.nama}
                    </h3>
                    <p className="text-white/90 text-[15px] md:text-[16px] font-body leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 drop-shadow-sm">
                      {f.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
