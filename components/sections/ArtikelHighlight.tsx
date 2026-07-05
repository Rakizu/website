'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Artikel {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  excerpt: string;
  image: string;
}

interface ArtikelHighlightProps {
  artikel: Artikel[];
}

export const ArtikelHighlight: React.FC<ArtikelHighlightProps> = ({ artikel }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const items = container.current.querySelectorAll('.artikel-item');
    gsap.fromTo(items,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          once: true,
        }
      }
    );
  }, { scope: container });

  return (
    <section
      ref={container}
      id="artikel"
      className="py-32 md:py-48 bg-charcoal-ink text-pure-surface"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter">
            Cerita &<br />Kabar Terbaru.
          </h2>
          <button className="group flex items-center gap-3 text-sm uppercase tracking-widest text-muted-steel hover:text-accent-gold transition-colors duration-300">
            Lihat Semua Artikel
            <span className="w-12 h-px bg-muted-steel group-hover:bg-accent-gold group-hover:w-20 transition-all duration-500" />
          </button>
        </div>

        {/* Article List — Editorial divider style */}
        <div className="flex flex-col divide-y divide-pure-surface/10">
          {artikel.map((a, i) => (
            <article
              key={a.id}
              className="artikel-item group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 cursor-pointer"
            >
              {/* Index Number */}
              <div className="hidden md:flex items-start md:col-span-1 pt-1">
                <span className="font-mono text-sm text-pure-surface/30 tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Category + Date */}
              <div className="md:col-span-2 flex flex-row md:flex-col gap-4 md:gap-2 items-center md:items-start">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-accent-gold">
                  {a.kategori}
                </span>
                <span className="text-xs font-mono text-muted-steel">{a.tanggal}</span>
              </div>

              {/* Title + Excerpt */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <h3 className="text-2xl md:text-3xl font-heading tracking-tight text-pure-surface group-hover:text-accent-gold transition-colors duration-500">
                  {a.judul}
                </h3>
                <p className="text-muted-steel leading-relaxed max-w-xl hidden md:block">
                  {a.excerpt}
                </p>
              </div>

              {/* Thumbnail */}
              <div className="md:col-span-3 aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={a.image}
                  alt={a.judul}
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
