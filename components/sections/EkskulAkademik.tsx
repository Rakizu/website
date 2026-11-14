'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface EkskulAkademikProps {
  programs: {
    id: string;
    nama: string;
    deskripsi: string;
    mainImage?: string;
  }[];
}

const mockPhotos = [
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1600&auto=format&fit=crop"  
];

export const EkskulAkademik: React.FC<EkskulAkademikProps> = ({ programs }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const isMobile = window.innerWidth < 768;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    
    // Setup Awal: Kartu pertama ada di tengah (0%), sisanya bersembunyi di bawah (100%)
    cards.forEach((card, i) => {
      if (i !== 0) gsap.set(card, { yPercent: 100 });
      gsap.set(card, { zIndex: i + 1 }); // Menjamin kartu baru selalu menimpa kartu lama
    });

    // 1. Timeline Utama (Pinning Berurutan dengan Prioritas Tinggi)
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * 200}%`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      }
    });

    // 2. Transisi Bertumpuk Sekuensial
    cards.forEach((card, i) => {
      if (i === 0) {
         masterTl.to({}, { duration: 0.8 }); // Jeda baca
         return;
      }
      
      const prevCard = cards[i - 1];
      const cardTl = gsap.timeline();
      
      // A. Kartu sebelumnya mengecil, autoAlpha: 0 (visibility: hidden agar tidak render di GPU)
      if (!isMobile) {
        cardTl.to(prevCard, { scale: 0.9, autoAlpha: 0, yPercent: -10, ease: "power2.inOut", duration: 1.2 }, 0);
      }
      
      // B. Kartu baru meluncur ke atas dari luar layar
      cardTl.fromTo(card, { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, autoAlpha: 1, ease: "power2.inOut", duration: 1.2 }, 0);
      
      // C. Efek parallax internal (background kartu bergeser sedikit)
      const parallax = card.querySelector('.parallax-wrapper');
      if (parallax) {
        cardTl.fromTo(parallax, { yPercent: 15 }, { yPercent: 0, ease: "power2.inOut", duration: 1.2 }, 0);
      }
      
      masterTl.add(cardTl);
      
      // D. Jeda agar pengguna bisa membaca kartu yang baru mendarat
      masterTl.to({}, { duration: 0.8 }); // Jeda santai sebelum animasi kartu berikutnya
    });

    // 3. Efek Fade-Out Judul Latar Belakang (Anticipation Text)
    if (bgTextRef.current) {
      gsap.to(bgTextRef.current, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Dimulai saat kontainer mencapai 80% layar
          end: "top 30%",   // Berakhir saat di 30% layar
          scrub: 1
        }
      });
    }

  }, { scope: sectionRef });

  return (
    <section id="ekskul-akademik" ref={sectionRef} data-theme="light" className="relative bg-warm-50 pb-24 overflow-clip [isolation:isolate]">
      
      {/* 1. Background Sticky Title (Anticipation Builder) */}
      <div ref={bgTextRef} className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-center z-0 pointer-events-none px-6 text-center">
         <h2 className="text-xs md:text-sm font-heading font-bold uppercase tracking-[0.4em] text-primary-700 mb-6">
           Minat & Bakat
         </h2>
         <h3 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[1.1] text-warm-900">
           Ekskul<br/>Akademik
         </h3>
      </div>

      {/* 2. GSAP Hardware-Accelerated Container */}
      {/* margin-top: 70vh menjaga efek antisipasi di mana judul dibaca pengguna sebelum kartu pertama naik */}
      <div ref={containerRef} className="relative z-10 w-full h-[100dvh] mt-[70vh] overflow-hidden">
        
        {programs.map((p, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            // Mengganti "sticky" menjadi "absolute" untuk meratakan titik tumpu (0,0) pada GPU
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pt-24 pb-6 px-4 md:pt-32 md:pb-12 md:px-8 origin-top will-change-transform transform-gpu"
          >
            {/* Double-Bezel Massive Card */}
            <div className="group/card w-full max-w-[1400px] h-full rounded-[2rem] md:rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 via-transparent to-transparent hover:from-gold-300/40 hover:via-white/5 hover:to-transparent transition-all duration-700 shadow-xl relative flex-1">
              
              {/* Inner Core */}
              <div className="relative w-full h-full rounded-[calc(2rem-1px)] md:rounded-[calc(2.5rem-1px)] overflow-hidden group bg-charcoal-ink transform-gpu backface-hidden">
                
                {/* Parallax Wrapper - Ditambahkan backface-hidden dan scale-[1.01] untuk menghilangkan white line sub-pixel glitch */}
                <div className="parallax-wrapper absolute inset-[-10%] w-[120%] h-[120%] will-change-transform transform-gpu backface-hidden scale-[1.01] outline outline-1 outline-transparent">
                  <Image 
                     src={p.mainImage || mockPhotos[i % mockPhotos.length]} 
                     alt={p.nama}
                     fill
                     quality={75}
                     priority={i === 0}
                     className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-fluid will-change-transform transform-gpu backface-hidden"
                     sizes="(max-width: 1400px) 100vw, 1400px"
                  />
                </div>
                
                {/* Cinematic Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/95 via-charcoal-ink/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-ink/80 via-transparent to-transparent opacity-80" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16 text-white">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
                      
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center justify-center font-accent italic text-3xl md:text-4xl text-white font-bold bg-accent-gold px-5 py-2 rounded-xl mb-4 shadow-md">
                          0{i + 1}
                        </span>
                        <h4 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase tracking-tighter text-white drop-shadow-lg leading-[1.1]">
                          {p.nama}
                        </h4>
                      </div>

                      <div className="md:w-[52%] lg:w-[56%] shrink-0">
                        <p className="text-white text-[20px] md:text-[24px] lg:text-[32px] leading-[1.35] md:leading-[1.4] font-body font-normal border-l-4 border-accent-gold pl-5 md:pl-8 py-1 max-w-[55ch] drop-shadow-md">
                          {p.deskripsi}
                        </p>
                      </div>

                   </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
