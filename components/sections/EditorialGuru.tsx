'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

interface Guru {
  id: string;
  nama: string;
  mapel: string;
  quote: string;
  image: string;
}

interface EditorialGuruProps {
  guru: Guru[];
}

export const EditorialGuru: React.FC<EditorialGuruProps> = ({ guru }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const sections = container.current.querySelectorAll('.guru-row');

    sections.forEach((section) => {
      const img = section.querySelector('.guru-img');
      const textBlock = section.querySelector('.guru-text');

      // Lightweight Image Parallax (Translate Y only, no scale)
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }

      // Text reveal
      if (textBlock) {
        gsap.fromTo(textBlock,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            }
          }
        );
      }
    });
  }, { scope: container });

  return (
    <section 
      ref={container}
      className="py-24 md:py-32 bg-chapter-sage text-cream relative overflow-hidden"
    >
      <IslamicPattern color="#c79a45" opacity={0.05} />
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="mb-32">
          <div className="inline-block border border-whisper-border px-4 py-2 text-base font-semibold uppercase tracking-[0.25em] text-cream/90 mb-8">
            Para Pendidik
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter max-w-2xl">
            Di Balik Setiap Perjalanan Hebat.
          </h2>
        </div>

        {/* Editorial Rows */}
        <div className="flex flex-col gap-32 md:gap-48">
          {guru.map((g, i) => {
            const isEven = i % 2 === 0;
            return (
              <div 
                key={g.id} 
                className={`guru-row flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}
              >
                {/* Image Side */}
                <div className="w-full md:w-5/12 aspect-[3/4] overflow-hidden rounded-sm relative bg-sage/20">
                  <div className="absolute inset-0 bg-sage-deep z-10 opacity-10 mix-blend-multiply pointer-events-none" />
                  <Image 
                    src={g.image} 
                    alt={g.nama} 
                    fill
                    className="guru-img object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out will-change-transform scale-[1.15]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>

                {/* Text Side */}
                <div className="guru-text w-full md:w-7/12 flex flex-col">
                  <span className="text-accent-gold font-semibold uppercase tracking-[0.2em] text-lg mb-6">
                    {g.mapel}
                  </span>
                  
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading text-pure-surface mb-12 tracking-tight">
                    {g.nama}
                  </h3>

                  <blockquote className="text-2xl md:text-3xl font-accent italic text-cream/80 leading-relaxed max-w-xl border-l-2 border-accent-gold pl-8">
                    &quot;{g.quote}&quot;
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
