'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface TargetItem {
  id: string;
  judul: string;
  deskripsi: string;
}

interface GraduateTargetsProps {
  targetLulusan: TargetItem[];
}

export const GraduateTargets: React.FC<GraduateTargetsProps> = ({ targetLulusan }) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const cards = container.current.querySelectorAll('.target-card');
    
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        }
      }
    );

  }, { scope: container });

  return (
    <section 
      ref={container}
      className="py-24 md:py-32 bg-pure-surface"
      id="target-lulusan"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.1] text-charcoal-ink mb-6">
            Target Lulusan.
          </h2>
          <p className="text-muted-steel font-body max-w-[65ch] text-base md:text-lg leading-relaxed">
            Empat pilar utama yang menjadi standar kompetensi dan karakter bagi setiap siswa yang lulus dari Thoriqul Jannah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {targetLulusan.map((item, index) => (
            <div 
              key={item.id} 
              className="target-card flex flex-col gap-6 p-8 rounded-3xl bg-canvas-white border border-charcoal-ink/5 hover:border-accent-gold/30 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="text-5xl md:text-6xl font-heading font-light text-accent-sage/20 group-hover:text-accent-gold/40 transition-colors duration-500">
                0{index + 1}
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-charcoal-ink mb-4 group-hover:text-accent-sage transition-colors duration-300">
                  {item.judul}
                </h3>
                <p className="text-muted-steel leading-relaxed font-body text-sm md:text-base">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
