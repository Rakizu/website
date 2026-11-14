'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowDownRight, Play, RotateCcw } from 'lucide-react';

type View = 'gate' | 'hero';

export function ThresholdGateHero() {
  const [view, setView] = useState<View>('gate');
  const gateRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (view === 'gate') document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [view]);

  useEffect(() => {
    if (view !== 'hero' || !heroRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo('.threshold-hero-image', { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.35 })
        .fromTo('.threshold-hero-word', { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: 0.12, ease: 'expo.out' }, '-=0.82')
        .fromTo('.threshold-hero-copy', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 }, '-=0.46')
        .fromTo('.threshold-hero-detail', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, '-=0.52');
    }, heroRef);

    return () => ctx.revert();
  }, [view]);

  const enter = () => {
    if (!gateRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setView('hero');
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: () => setView('hero'),
      });

      timeline
        .to('.threshold-gate-copy', { y: -22, autoAlpha: 0, duration: 0.42 })
        .to('.threshold-gate-orbit', { rotation: 12, scale: 1.1, duration: 0.78 }, '<')
        .to('.threshold-gate-left', { xPercent: -108, duration: 1.15 }, '-=0.08')
        .to('.threshold-gate-right', { xPercent: 108, duration: 1.15 }, '<')
        .to('.threshold-gate-veil', { autoAlpha: 0, duration: 0.3 }, '-=0.15');
    }, gateRef);
  };

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setView('gate');
  };

  const explore = () => {
    document.getElementById('test-threshold-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-[100dvh] overflow-x-clip bg-[#071011] text-[#f6f1e7]">
      <style>{`nav.fixed, footer { display: none !important; }`}</style>

      {view === 'gate' && (
        <section ref={gateRef} className="fixed inset-0 z-[3000] overflow-hidden bg-[#071011]">
          <div className="threshold-gate-veil absolute inset-0 bg-[#071011]" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(246,241,231,0.14)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[#d7b46d]/45" />

          <div className="relative grid min-h-[100dvh] grid-cols-2">
            <div className="threshold-gate-left relative overflow-hidden border-r border-[#d7b46d]/30 bg-[#071011]" />
            <div className="threshold-gate-right relative overflow-hidden bg-[#071011]" />
          </div>

          <div className="threshold-gate-orbit pointer-events-none absolute left-1/2 top-1/2 h-[min(86vw,860px)] w-[min(86vw,860px)] -translate-x-1/2 -translate-y-1/2 rounded-t-[50%] border border-[#d7b46d]/70 shadow-[0_0_100px_rgba(215,180,109,0.12)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(74vw,740px)] w-[min(74vw,740px)] -translate-x-1/2 -translate-y-1/2 rounded-t-[50%] border border-[#d7b46d]/20" />

          <div className="threshold-gate-copy absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d7b46d]">SMPIT Thoriqul Jannah</p>
            <h1 className="max-w-4xl font-heading text-5xl font-bold leading-[0.94] tracking-[-0.055em] text-[#f6f1e7] sm:text-7xl md:text-8xl">
              Memulai perjalanan<br />yang berarti.
            </h1>
            <p className="mt-7 max-w-md text-sm leading-6 text-[#f6f1e7]/68 md:text-base">
              Sebuah ruang untuk iman, ilmu, dan keberanian bertumbuh bersama.
            </p>
            <button
              type="button"
              onClick={enter}
              className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#d7b46d]/70 bg-[#d7b46d] px-5 py-3 text-xs font-bold tracking-wide text-[#071011] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Play size={14} fill="currentColor" aria-hidden="true" />
              Masuk ke perjalanan
            </button>
          </div>

          <p className="absolute bottom-6 left-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f6f1e7]/40 md:bottom-8 md:left-8">Eksperimen Gate + Hero</p>
        </section>
      )}

      {view === 'hero' && (
        <>
          <section ref={heroRef} className="relative grid min-h-[100dvh] overflow-hidden bg-[#071011] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_14%,rgba(215,180,109,0.16),transparent_22%),linear-gradient(90deg,#071011_8%,rgba(7,16,17,0.7)_46%,rgba(7,16,17,0.04)_100%)] lg:z-10" />
            <div className="threshold-hero-image absolute inset-y-0 right-0 w-full origin-center lg:w-[60%]">
              <Image src="/test-assets/threshold-hero-v1.png" alt="Murid berjalan menuju area belajar sekolah pada pagi hari" fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071011] via-transparent to-[#071011]/20 lg:bg-gradient-to-r lg:from-[#071011] lg:via-transparent lg:to-transparent" />
            </div>

            <div className="relative z-20 flex min-h-[100dvh] items-end px-6 pb-10 pt-28 sm:px-10 lg:col-start-1 lg:items-center lg:px-16 lg:pb-20 xl:px-24">
              <div className="max-w-3xl">
                <p className="threshold-hero-detail mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d7b46d]">Pendidikan yang memberi arah</p>
                <h2 className="font-heading text-[clamp(3.3rem,8vw,8rem)] font-bold leading-[0.82] tracking-[-0.065em] text-[#f6f1e7]">
                  <span className="block overflow-hidden pb-2"><span className="threshold-hero-word block">Tumbuh</span></span>
                  <span className="block overflow-hidden pb-2"><span className="threshold-hero-word block text-[#d7b46d]">dengan</span></span>
                  <span className="block overflow-hidden pb-2"><span className="threshold-hero-word block">arah.</span></span>
                </h2>
                <div className="threshold-hero-copy mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-sm text-sm leading-6 text-[#f6f1e7]/72 md:text-base">Lingkungan belajar yang membentuk adab, mengasah daya pikir, dan menguatkan ikhtiar.</p>
                  <button type="button" onClick={explore} className="inline-flex shrink-0 items-center gap-2 self-start border-b border-[#d7b46d] pb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f6f1e7] transition-colors hover:text-[#d7b46d] sm:self-auto">
                    Jelajahi sekolah <ArrowDownRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="threshold-hero-detail absolute bottom-10 right-6 z-20 hidden max-w-[12rem] border-l border-[#d7b46d]/70 pl-4 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7b46d]">Tahun ajaran</p>
              <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#f6f1e7]">2026/2027</p>
            </div>

            <button type="button" onClick={replay} className="threshold-hero-detail absolute right-6 top-7 z-30 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071011]/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f6f1e7] backdrop-blur-sm transition-colors hover:border-[#d7b46d] hover:text-[#d7b46d]">
              <RotateCcw size={13} aria-hidden="true" /> Ulangi gate
            </button>
          </section>

          <section id="test-threshold-story" className="relative min-h-[70dvh] border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d7b46d]">Setelah hero</p>
              <h2 className="mt-5 font-heading text-5xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-7xl">Gate selesai. Narasi dimulai.</h2>
              <p className="mt-8 max-w-xl text-base leading-7 text-[#f6f1e7]/66">Area ini sengaja sederhana untuk menguji rasa transisi dari portal masuk ke perjalanan konten berikutnya.</p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
