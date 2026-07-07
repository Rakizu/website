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
    <footer ref={container} data-theme="dark" className={`bg-charcoal-ink text-pure-surface ${isCompact ? 'pt-12 md:pt-16' : 'pt-16 md:pt-24'} pb-8 border-t border-whisper-border/10 overflow-hidden relative`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col items-center text-center relative z-10">
        
        {/* Massive Footer Typography (Hidden on compact mode) */}
        {!isCompact && (
          <div className="overflow-hidden mb-8 perspective-[1000px]">
            <h2 className="footer-text origin-bottom text-[10vw] font-heading font-bold uppercase tracking-tighter leading-none text-pure-surface/90">
              Mari Melangkah
            </h2>
          </div>
        )}
        
        <div className={`flex flex-col md:flex-row justify-between w-full ${isCompact ? 'mt-4' : 'mt-12 pt-10 border-t border-pure-surface/10'} gap-12 text-left`}>
          
          <div className="max-w-sm">
            <div className="font-heading font-bold text-2xl mb-4">SMPIT Thoriqul Jannah</div>
            <p className="text-muted-steel leading-relaxed mb-6">
              Mencetak Generasi Sholeh, Mandiri, Kreatif, dan Berprestasi. Sebuah langkah nyata untuk masa depan.
            </p>
            <div className="text-sm font-medium uppercase tracking-widest text-accent-gold">
              NPSN: 69947963
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <h4 className="text-xs uppercase tracking-widest font-medium text-pure-surface/50">Navigasi</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
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
                    className="group relative flex items-center text-pure-surface/80 hover:text-accent-gold transition-colors duration-300"
                  >
                    <span className="absolute left-0 w-4 h-[1px] bg-accent-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="group-hover:translate-x-6 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-xs uppercase tracking-widest font-medium text-pure-surface/50">Kontak</h4>
              <div className="flex flex-col gap-3 text-muted-steel max-w-xs">
                <p className="leading-relaxed">
                  Jl. Lamatti, Kel. Bongki, Kec. Sinjai Utara, Kode Pos 92615
                </p>
                <a href="mailto:admin@thoriquljannah.sch.id" className="hover:text-accent-gold transition-colors mt-2 inline-flex items-center gap-3 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform text-pure-surface/50 group-hover:text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>admin@thoriquljannah.sch.id</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-12 md:mt-16 text-sm text-pure-surface/40">
          <p>&copy; {new Date().getFullYear()} SMPIT Thoriqul Jannah. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-pure-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-pure-surface transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
