'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Visi', href: '#visi' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Guru', href: '#guru' },
  { label: 'Akademik', href: '#kurikulum' },
  { label: 'Unggulan', href: '#unggulan' },
  { label: 'Ekskul', href: '#ekskul' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Artikel', href: '#artikel' },
];
export const Footer = () => {
  const container = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isCompact = pathname?.startsWith('/artikel');
  
  useGSAP(() => {
    if (!container.current || isCompact) return;
    
    const text = container.current.querySelector('.footer-text');
    
    // Split the text into two lines if needed, or just mask reveal the whole thing
    gsap.fromTo(text,
      { yPercent: 100, opacity: 0, rotationX: -45, transformPerspective: 1000 },
      { 
        yPercent: 0, 
        opacity: 0.9, 
        rotationX: 0,
        duration: 1.5, 
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: container });

  return (
    <footer ref={container} data-theme="dark" className={`bg-charcoal-ink text-pure-surface ${isCompact ? 'pt-16 md:pt-24' : 'pt-32 md:pt-48'} pb-12 border-t border-white/5 overflow-hidden relative`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col items-center text-center relative z-10">
        
        {/* Massive Footer Typography (Hidden on compact mode) */}
        {!isCompact && (
          <div className="overflow-hidden mb-16 md:mb-24 perspective-[1000px]">
            <h2 className="footer-text origin-bottom text-[12vw] font-heading font-black uppercase tracking-tighter leading-[0.8] text-white">
              Mari <span className="text-accent-gold italic font-light tracking-normal">Melangkah</span>
            </h2>
          </div>
        )}
        
        <div className={`flex flex-col md:flex-row justify-between w-full ${isCompact ? 'mt-4' : 'mt-12 pt-16 border-t border-white/10'} gap-16 md:gap-12 text-left`}>
          
          <div className="max-w-sm">
            <div className="font-heading font-bold text-3xl mb-6 text-white tracking-tight">SMPIT Thoriqul Jannah</div>
            <p className="text-muted-steel leading-relaxed mb-8 text-lg font-body max-w-[35ch]">
              Mencetak Generasi Sholeh, Mandiri, Kreatif, dan Berprestasi. Sebuah langkah nyata untuk masa depan.
            </p>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                NPSN: 69947963
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-16 md:gap-32">
            <div className="flex flex-col gap-8">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40">Navigasi</h4>
              <div className="grid grid-cols-2 gap-x-16 gap-y-5">
                {navLinks.map(link => (
                  <a 
                    key={link.label} 
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(
                        new CustomEvent('navigate-curtain', { detail: { href: link.href } })
                      );
                    }}
                    className="group relative flex items-center text-white/70 hover:text-accent-gold transition-colors duration-300 font-body text-lg"
                  >
                    <span className="relative overflow-hidden">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-gold origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white/40">Kontak & Lokasi</h4>
              <div className="flex flex-col gap-5 text-muted-steel max-w-[250px] font-body text-base">
                <p className="leading-relaxed">
                  Jl. Lamatti, Kel. Bongki, Kec. Sinjai Utara, Kode Pos 92615
                </p>
                <a href="mailto:admin@thoriquljannah.sch.id" className="hover:text-accent-gold transition-colors mt-2 inline-flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors duration-500">
                    <svg className="w-4 h-4 text-white/50 group-hover:text-accent-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Kirim Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-24 pt-8 border-t border-white/5 text-sm text-white/40 font-body">
          <p>&copy; {new Date().getFullYear()} SMPIT Thoriqul Jannah. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-right-4 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-1 after:bg-white/20 after:rounded-full">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
