'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const mockPrograms = [
  { stage: "Unit 01", title: "Fundamental Logika", desc: "Dasar pemikiran komputasi dan pemecahan masalah.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 02", title: "Struktur Data", desc: "Penyusunan dan manipulasi data secara efisien di memori.", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 03", title: "Desain Antarmuka", desc: "Membangun interaksi pengguna dengan visual yang responsif.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 04", title: "Arsitektur Basis Data", desc: "Penyimpanan dan perancangan skema data skala besar.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 05", title: "Sistem Backend", desc: "Pengelolaan logika bisnis dan API di sisi server.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 06", title: "Otomatisasi DevOps", desc: "Integrasi sistem pipeline untuk deployment berkelanjutan.", img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 07", title: "Komputasi Awan", desc: "Distribusi sistem di infrastruktur cloud secara global.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 08", title: "Keamanan Sistem", desc: "Enkripsi data dan perlindungan dari ancaman siber.", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 09", title: "Machine Learning", desc: "Model kecerdasan buatan untuk analisis prediktif.", img: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 10", title: "Blockchain Dasar", desc: "Konsep desentralisasi, token, dan kontrak pintar web3.", img: "https://images.unsplash.com/photo-1639762681485-074b7f4ec674?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 11", title: "Arsitektur Skala", desc: "Menangani jutaan trafik dengan pola microservices.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" },
  { stage: "Unit 12", title: "Tech Mastery", desc: "Kepemimpinan produk digital di tingkat arsitek global.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" }
];

export const HelixGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProxyRef = useRef<HTMLDivElement>(null); 
  const helixRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !helixRef.current || !sceneRef.current || !scrollProxyRef.current) return;

    // Parameters
    let radius = window.innerWidth <= 800 ? 360 : 460;      
    const angleStep = 35;  
    const yStep = 45;      

    // Set initial 3D transform depth
    const updateRadius = () => {
      radius = window.innerWidth <= 800 ? 360 : 460;
      sceneRef.current!.style.transform = `translateZ(${-radius - 200}px)`;
    };
    window.addEventListener('resize', updateRadius);
    updateRadius();

    // Render loop driven by GSAP progress
    const renderScene = (progress: number) => {
      const maxRotationY = (mockPrograms.length - 1) * angleStep;
      const maxTranslateY = (mockPrograms.length - 1) * yStep;

      const currentRotY = progress * maxRotationY;
      const currentTransY = progress * maxTranslateY;

      // Rotate and move the helix wrapper
      helixRef.current!.style.transform = `translateY(${currentTransY}px) rotateY(${-currentRotY}deg)`;

      const activeFloatIndex = progress * (mockPrograms.length - 1);
      const activeIndex = Math.round(activeFloatIndex); 

      // Evaluate each card
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const cardAngle = index * angleStep;
        const linearDiff = Math.abs(index - activeFloatIndex);

        let scale = 0.8;
        let opacity = 0; 
        let blur = 5;
        let brightness = 0.2;
        let visibility = 'hidden'; 
        let pointerEvents = 'none';
        let boxShadow = 'none';
        let borderColor = 'transparent';

        const badge = card.querySelector('.badge') as HTMLElement;
        const borderBottom = card.querySelector('.img-wrapper') as HTMLElement;

        if (index === activeIndex) {
            // TIER 1: CENTER HIGHLIGHT (Layar Utama)
            scale = 1.05;
            opacity = 1;
            blur = 0;
            brightness = 1.1;
            visibility = 'visible';
            pointerEvents = 'auto';
            
            // Elegant styling for the active card (Premium)
            boxShadow = '0 25px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15)'; 
            borderColor = 'rgba(212, 175, 55, 0.6)'; 
            
            if (borderBottom) borderBottom.style.borderColor = 'rgba(212, 175, 55, 0.8)';
            if (badge) {
              badge.style.background = '#D4AF37'; 
              badge.style.color = '#16100c'; 
              badge.style.borderColor = '#D4AF37';
            }
        } 
        else if (linearDiff <= 4) {
            // TIER 2: SISI SAMPING
            visibility = 'visible';
            
            let fadeRatio = (linearDiff - 0.5) / 3.5;
            fadeRatio = Math.max(0, Math.min(1, fadeRatio));

            scale = 0.95 - (fadeRatio * 0.15); 
            opacity = 0.6 - (fadeRatio * 0.45); 
            blur = 1 + (fadeRatio * 3);         
            brightness = 0.7 - (fadeRatio * 0.4);

            boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
            borderColor = 'rgba(255, 255, 255, 0.05)'; 
            
            if (borderBottom) borderBottom.style.borderColor = 'transparent';
            if (badge) {
              badge.style.background = 'rgba(255, 255, 255, 0.05)';
              badge.style.color = '#D4AF37';
              badge.style.borderColor = 'rgba(212, 175, 55, 0.2)';
            }
        }
        else if (linearDiff <= 9.5) {
            // TIER 3: BACKGROUND HELIX TAIL
            visibility = 'visible';
            let tailRatio = (linearDiff - 4) / 5.5; 
            
            scale = 0.8;
            opacity = 0.15 * (1 - tailRatio); 
            blur = 4 + (tailRatio * 2); 
            brightness = 0.3 * (1 - tailRatio); 
            
            boxShadow = 'none';
            borderColor = 'transparent';
            
            if (borderBottom) borderBottom.style.borderColor = 'transparent';
            if (badge) {
              badge.style.background = 'rgba(255, 255, 255, 0.02)';
              badge.style.color = '#a0aabf'; 
              badge.style.borderColor = 'transparent';
            }
        }

        // Apply via direct DOM for maximum performance
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px) translateY(${index * -yStep}px) scale(${scale})`;
        card.style.opacity = opacity.toString();
        card.style.visibility = visibility;
        card.style.filter = `blur(${blur}px) brightness(${brightness})`;
        card.style.boxShadow = boxShadow;
        card.style.borderColor = borderColor;
        card.style.pointerEvents = pointerEvents as any;
      });
    };

    // The Magic GSAP Scroll Proxy replacing the heavy manual rAF lerp!
    const proxy = { progress: 0 };
    gsap.to(proxy, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scrollProxyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // buttery smooth and very responsive
        onUpdate: (self) => {
          renderScene(self.progress);
        }
      }
    });

    // Force first render
    renderScene(0);

    return () => {
      window.removeEventListener('resize', updateRadius);
    };
  }, []);

  return (
    <>
      {/* Scroll Proxy (Provides the scrolling height) */}
      <div ref={scrollProxyRef} className="w-full h-[600vh]" />

      {/* Viewport Pinned to Screen */}
      <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden bg-charcoal-ink" style={{ perspective: '1100px' }}>
        
        {/* Static Background (Cinematic Depth of Field) */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
          {/* Base heavily blurred image */}
          <div 
            className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-cover bg-center filter blur-[40px] brightness-[0.25]"
            style={{ backgroundImage: `url(${mockPrograms[0].img})` }}
          />
          {/* Vignette Overlay for extra Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#16100c_100%)] opacity-100" />
        </div>

        {/* 3D Scene */}
        <div ref={sceneRef} className="absolute top-1/2 left-1/2 transform-gpu will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Rotating Helix Wrapper */}
          <div ref={helixRef} className="absolute transform-gpu will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {mockPrograms.map((prog, i) => (
              <div 
                key={`card-${i}`}
                ref={el => { cardsRef.current[i] = el; }}
                className="absolute w-[220px] md:w-[250px] h-[270px] md:h-[300px] -left-[110px] md:-left-[125px] -top-[135px] md:-top-[150px] bg-[#1a1410] rounded-xl flex flex-col overflow-hidden border border-transparent transform-gpu transition-[border-color,box-shadow] duration-500 will-change-[transform,opacity,filter,visibility]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="img-wrapper relative w-full h-[110px] md:h-[125px] shrink-0 border-b-2 transition-colors duration-500">
                  <Image src={prog.img} alt={prog.title} fill className="object-cover" sizes="(max-width: 800px) 220px, 250px" />
                </div>
                
                <div className="flex flex-col grow items-center justify-center text-center p-4 md:px-6 md:py-4">
                  <div className="badge inline-block text-[9px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-full border mb-3 transition-all duration-500 shadow-sm">
                    {prog.stage}
                  </div>
                  <h3 className="text-pure-surface text-sm md:text-base font-heading font-bold leading-[1.2] mb-2">{prog.title}</h3>
                  <p className="text-muted-steel text-[11px] md:text-[11.5px] leading-[1.4] m-0">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Scroll Hint overlay */}
      <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 text-accent-gold text-[10px] font-accent font-bold tracking-[3px] uppercase flex flex-col items-center pointer-events-none opacity-60 z-50">
        Scroll To Explore
        <span className="mt-2 block w-[1px] h-[25px] bg-gradient-to-b from-accent-gold to-transparent" />
      </div>
    </>
  );
};
