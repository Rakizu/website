'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { IslamicPattern } from '@/components/ui/IslamicPattern';

gsap.registerPlugin(ScrollTrigger);

export const AdmissionForm = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        once: true,
      }
    });

    // Reveal text and form container
    tl.fromTo(container.current.querySelectorAll('.spmb-reveal'),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power3.out" }
    );

    // Draw the input borders cinematically
    const inputs = container.current.querySelectorAll('input');
    inputs.forEach((input, i) => {
      // Create a wrapper for custom border animation
      const wrapper = input.parentElement;
      if (!wrapper) return;
      
      const line = document.createElement('div');
      line.className = 'absolute bottom-0 left-0 h-[2px] bg-charcoal-ink/20 w-full origin-left transform scale-x-0';
      wrapper.style.position = 'relative';
      input.classList.remove('border-b-2', 'border-whisper-border'); // We use custom line
      input.classList.add('border-b-2', 'border-transparent');
      wrapper.appendChild(line);

      tl.to(line, {
        scaleX: 1,
        duration: 1,
        ease: "power4.inOut"
      }, "-=0.8");
    });
  }, { scope: container });

  return (
    <section 
      id="daftar"
      data-theme="dark"
      ref={container}
      className="py-32 md:py-48 bg-chapter-sage text-pure-surface relative overflow-hidden"
    >
      <IslamicPattern color="#c79a45" opacity={0.05} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-canvas-white/5 skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-[800px] mx-auto px-6 md:px-16 relative z-10 text-center">
        <h2 className="spmb-reveal text-5xl md:text-7xl font-heading font-medium tracking-tighter mb-6">
          Waktunya Memilih.
        </h2>
        <p className="spmb-reveal text-lg text-cream/80 mb-16 max-w-lg mx-auto">
          Pendaftaran siswa baru tahun ajaran 2026/2027 telah dibuka. Amankan kursi untuk putra-putri Anda.
        </p>

        <form className="spmb-reveal text-left flex flex-col gap-8 bg-pure-surface p-10 md:p-16 rounded-[2rem] shadow-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium uppercase tracking-widest text-charcoal-ink">Nama Lengkap Anak</label>
            <input 
              type="text" 
              className="w-full border-b-2 border-whisper-border bg-transparent py-4 text-lg text-charcoal-ink focus:outline-none focus:border-accent-sage transition-colors placeholder:text-muted-steel/50"
              placeholder="Sesuai Akta Kelahiran"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium uppercase tracking-widest text-charcoal-ink">Nama Orang Tua</label>
              <input 
                type="text" 
                className="w-full border-b-2 border-whisper-border bg-transparent py-4 text-lg text-charcoal-ink focus:outline-none focus:border-accent-sage transition-colors placeholder:text-muted-steel/50"
                placeholder="Ayah atau Ibu"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium uppercase tracking-widest text-charcoal-ink">Nomor WhatsApp</label>
              <input 
                type="tel" 
                className="w-full border-b-2 border-whisper-border bg-transparent py-4 text-lg text-charcoal-ink focus:outline-none focus:border-accent-sage transition-colors placeholder:text-muted-steel/50"
                placeholder="08..."
              />
            </div>
          </div>

          <button 
            type="button"
            className="mt-8 group relative w-full py-6 bg-charcoal-ink text-pure-surface font-medium text-sm tracking-widest uppercase overflow-hidden active:scale-[0.99] transition-transform"
          >
            <span className="relative z-10">Kirim Pendaftaran</span>
            <div className="absolute inset-0 bg-accent-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </button>
        </form>

      </div>
    </section>
  );
};
