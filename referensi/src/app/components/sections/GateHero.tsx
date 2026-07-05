import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { IslamicPattern } from "../IslamicPattern";
import { school, heroImage } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Bab 1+2 — Gate Page & Landing. Cinematic full-bleed opening.
export function GateHero({ started }: { started: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Intro — plays as the preloader curtain lifts.
      if (started && !reduce) {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from(".hero-kicker", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out" })
          .from(
            ".hero-word",
            { opacity: 0, yPercent: 120, duration: 1.1, ease: "power4.out", stagger: 0.12 },
            "-=0.4",
          )
          .from(".hero-tag", { opacity: 0, y: 26, duration: 0.9, ease: "power3.out" }, "-=0.6")
          .from(".hero-cue", { opacity: 0, duration: 0.8 }, "-=0.3");
      }

      if (reduce) return;

      // Parallax: image drifts slower, content lifts away as we scroll on.
      gsap.to(".hero-img", {
        yPercent: 22,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: -28,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [started] },
  );

  return (
    <section
      ref={root}
      id="gate"
      data-chapter
      data-nav="0"
      data-theme="dark"
      className="cinematic-grain vignette relative flex min-h-[100dvh] items-end overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      <ImageWithFallback
        src={heroImage}
        alt="Suasana belajar siswa SMPIT Thoriqul Jannah di dalam kelas saat pagi hari"
        className="hero-img absolute inset-0 h-full w-full object-cover"
        style={{ willChange: "transform" }}
      />
      {/* warm cinematic grade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,26,20,0.55) 0%, rgba(34,26,20,0.15) 35%, rgba(34,26,20,0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{ background: "radial-gradient(120% 80% at 70% 15%, rgba(231,193,121,0.5), transparent 55%)" }}
      />
      <IslamicPattern className="absolute inset-0" color="#f6efe2" opacity={0.05} />

      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 sm:px-10 md:pb-28">
        <span className="hero-kicker text-kicker block" style={{ color: "var(--gold-soft)" }}>
          SPMB {school.year} &nbsp;·&nbsp; {school.hours}
        </span>

        <h1 className="text-hero font-display mt-5 max-w-[15ch]" style={{ color: "var(--cream)" }}>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-word inline-block">Setiap anak membawa</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-word inline-block">
              <span style={{ color: "var(--gold-soft)" }}>cahaya</span> yang berbeda.
            </span>
          </span>
        </h1>

        <p
          className="hero-tag font-serif mt-7 max-w-[44ch] text-lead italic"
          style={{ color: "rgba(246,239,226,0.82)" }}
        >
          {school.tagline}.
        </p>
      </div>

      <div
        className="hero-cue absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ color: "rgba(246,239,226,0.6)" }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">Gulir</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite]" style={{ background: "var(--gold-soft)" }} />
        </span>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>
    </section>
  );
}
