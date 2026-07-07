'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Alumni {
  id: string;
  nama: string;
  tahunLulus: string;
  tujuan: string;
  testimoni: string;
  image: string;
}

interface AlumniShowcaseProps {
  alumni: Alumni[];
}

export const AlumniShowcase: React.FC<AlumniShowcaseProps> = ({ alumni }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const cards = container.current.querySelectorAll('.alumni-card');

    gsap.fromTo(cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          once: true,
        }
      }
    );

    // Pull-quote text slow reveal
    const quote = container.current.querySelector('.alumni-header-quote');
    if (quote) {
      gsap.fromTo(quote,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }
  }, { scope: container });

  return (
    <section
      ref={container}
      className="py-32 md:py-48 bg-canvas-white relative overflow-hidden"
      id="alumni"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-whisper-border pb-16">
          <div>
            <span className="block text-xs uppercase tracking-[0.3em] font-medium text-accent-gold mb-6">
              Jejak Alumni
            </span>
            <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter text-charcoal-ink">
              Mereka<br />Telah Membuktikan.
            </h2>
          </div>
          <blockquote className="alumni-header-quote max-w-sm font-accent italic text-xl text-muted-steel leading-relaxed border-l-2 border-accent-gold pl-6">
            "Dari pesisir Sinjai, menuju penjuru nusantara. Ini adalah kisah mereka."
          </blockquote>
        </div>

        {/* Alumni Grid — Asymmetric two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {alumni.map((a, i) => (
            <div
              key={a.id}
              className={`alumni-card relative rounded-[2rem] overflow-hidden group ${i === 0 ? 'md:mt-0' : 'md:mt-24'}`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-ink">
                <img
                  src={a.image}
                  alt={a.nama}
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
                {/* Dark gradient bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/80 via-transparent to-transparent" />

                {/* Year badge */}
                <div className="absolute top-6 left-6 px-4 py-2 border border-pure-surface/30 bg-charcoal-ink/80">
                  <span className="text-xs font-mono text-pure-surface/80 tracking-widest">
                    Angkatan &apos;{a.tahunLulus.slice(-2)}
                  </span>
                </div>
              </div>

              {/* Content card below image */}
              <div className="p-8 md:p-10 bg-pure-surface border border-whisper-border border-t-0 rounded-b-[2rem]">
                <h3 className="text-2xl font-heading text-charcoal-ink mb-1">
                  {a.nama}
                </h3>
                <p className="text-sm text-accent-sage font-medium uppercase tracking-widest mb-6">
                  {a.tujuan}
                </p>
                <blockquote className="font-accent italic text-lg text-muted-steel leading-relaxed">
                  &ldquo;{a.testimoni}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
