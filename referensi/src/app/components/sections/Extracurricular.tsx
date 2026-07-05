import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { extracurriculars } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Bab 7 — Menemukan jati diri. Desktop: horizontal scroll (containerAnimation).
// Mobile: vertical scroll-snap (PRD §9).
export function Extracurricular() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (!track) return;
        const amount = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + amount(),
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="extracurricular"
      data-chapter
      data-nav="6"
      data-theme="light"
      className="relative overflow-hidden md:h-screen"
      style={{ background: "var(--secondary)" }}
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-6 py-20 md:h-screen md:flex-row md:items-center md:gap-8 md:px-0 md:py-0"
      >
        {/* intro panel */}
        <div className="flex shrink-0 flex-col justify-center md:h-screen md:w-[46vw] md:pl-14 md:pr-6">
          <span className="will-reveal text-kicker block" style={{ color: "var(--accent)" }}>
            Bab 07 — Menemukan Diri
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5 max-w-[14ch]">
            Di luar kelas, karakter menemukan bentuknya.
          </h2>
          <p className="will-reveal mt-6 max-w-[40ch] text-lead" style={{ color: "var(--muted-foreground)" }}>
            Tiga wadah untuk berani, tangguh, dan fokus — melengkapi apa yang diajarkan di dalam kelas.
          </p>
          <span className="mt-8 hidden items-center gap-3 text-[13px] tracking-[0.2em] uppercase md:flex" style={{ color: "var(--muted-foreground)" }}>
            Gulir untuk menjelajah →
          </span>
        </div>

        {extracurriculars.map((e, i) => (
          <article
            key={e.name}
            className="group relative shrink-0 overflow-hidden rounded-[4px] md:w-[34vw]"
            style={{ background: "var(--muted)" }}
          >
            <div className="relative" style={{ aspectRatio: "3/4" }}>
              <ImageWithFallback
                src={e.img}
                alt={`Ekstrakurikuler ${e.name}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(34,26,20,0.1) 30%, rgba(34,26,20,0.85) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-7" style={{ color: "var(--cream)" }}>
                <span className="text-[11px] tracking-[0.28em] uppercase" style={{ color: "var(--gold-soft)" }}>
                  {String(i + 1).padStart(2, "0")} · {e.tag}
                </span>
                <h3 className="font-display mt-2" style={{ fontSize: "clamp(1.6rem,2.4vw,2.2rem)", fontWeight: 700 }}>
                  {e.name}
                </h3>
                <p className="mt-3 max-w-[36ch] text-[14px]" style={{ color: "rgba(246,239,226,0.85)" }}>
                  {e.desc}
                </p>
              </div>
            </div>
          </article>
        ))}
        <div className="hidden shrink-0 md:block md:w-[8vw]" />
      </div>
    </section>
  );
}
