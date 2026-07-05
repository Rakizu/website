'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CurtainLink } from '@/components/ui/CurtainLink';

interface Artikel {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  excerpt: string;
  image: string;
}

interface ArticleExploreProps {
  articles: Artikel[];
}

export const ArticleExplore: React.FC<ArticleExploreProps> = ({ articles }) => {
  const [query, setQuery] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    return articles.filter(a => 
      a.judul.toLowerCase().includes(query.toLowerCase()) || 
      a.kategori.toLowerCase().includes(query.toLowerCase())
    );
  }, [articles, query]);

  // Animate grid items when filtered list changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.explore-card');
    if (cards.length === 0) return;
    
    gsap.killTweensOf(cards);
    gsap.fromTo(cards, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }
    );
  }, [filtered]);

  return (
    <section id="artikel" className="py-24 md:py-32 bg-pure-surface text-charcoal-ink border-t border-charcoal-ink/10 relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* Giant Typographic Search */}
        <div className="mb-20 relative group max-w-4xl">
          <input 
            type="text" 
            placeholder="Cari Artikel..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => {
              const inputElement = e.target as HTMLInputElement;
              const rect = inputElement.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              
              // Hanya gulir ke atas JIKA posisi input berada di bawah 45% dari layar
              if (rect.top > viewportHeight * 0.45) {
                const section = inputElement.closest('section');
                if (section) {
                  setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 150);
                }
              }
            }}
            className="w-full bg-transparent border-none outline-none font-heading text-2xl md:text-4xl lg:text-5xl tracking-tight text-charcoal-ink placeholder-charcoal-ink/20 py-4 transition-all"
          />
          {/* Animated Gold Underline */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal-ink/10">
             <div className="h-full bg-accent-gold w-0 group-focus-within:w-full transition-all duration-700 ease-in-out" />
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div ref={gridRef} className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {filtered.length > 0 ? (
            filtered.map((a) => (
              <CurtainLink 
                key={a.id} 
                href={`/artikel/${a.id}`} 
                isRoute={true}
                className="explore-card group block break-inside-avoid relative overflow-hidden bg-charcoal-ink/5 rounded-xl p-4 md:p-6 border border-charcoal-ink/5 hover:border-accent-gold/30 transition-colors duration-500"
              >
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-charcoal-ink/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={a.image} 
                    alt={a.judul}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-widest font-semibold text-accent-gold">
                    {a.kategori}
                  </span>
                  <span className="text-xs font-mono text-muted-steel">
                    {a.tanggal}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-medium tracking-tight group-hover:text-accent-gold transition-colors duration-300">
                  {a.judul}
                </h3>
              </CurtainLink>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-steel text-xl break-inside-avoid">
              Maaf, artikel yang Anda cari tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
