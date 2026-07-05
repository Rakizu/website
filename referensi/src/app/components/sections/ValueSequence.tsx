import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IslamicPattern } from "../IslamicPattern";
import { values } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Gate climax — pinned dark sequence. Each value word takes the centre of the
// screen, animating IN then OUT as the user scrolls: Sholeh › Mandiri › Kreatif › Berprestasi.
export function ValueSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        // Static fallback: reveal all, no pin.
        gsap.set(".vs-item", { opacity: 1, position: "relative", filter: "none" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=" + values.length * 100 + "%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });

      values.forEach((_, i) => {
        const item = `.vs-item-${i}`;
        const step = `.vs-step-${i}`;

        // active stepper highlight
        tl.set(".vs-step", { color: "rgba(246,239,226,0.28)" }, i === 0 ? 0 : "<")
          .set(step, { color: "var(--gold-soft)" }, "<")
          // IN
          .fromTo(
            item,
            { opacity: 0, yPercent: 22, scale: 0.9, filter: "blur(16px)" },
            { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" },
            "<",
          )
          .to(`${item} .vs-line`, { scaleX: 1, duration: 0.6, ease: "power2.out" }, "<0.2")
          .to({}, { duration: 0.5 }); // hold

        // OUT — every word except the last lifts away before the next arrives
        if (i < values.length - 1) {
          tl.to(item, {
            opacity: 0,
            yPercent: -22,
            scale: 1.08,
            filter: "blur(16px)",
            duration: 0.9,
            ease: "power3.in",
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="gate-values"
      data-chapter
      data-nav="0"
      data-theme="dark"
      className="cinematic-grain relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      style={{ background: "var(--ink-2)", color: "var(--cream)" }}
    >
      <IslamicPattern className="pointer-events-none absolute inset-0" color="#e3c179" opacity={0.04} />
      {/* soft centre spotlight */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(231,193,121,0.14), transparent 68%)", filter: "blur(30px)" }}
      />

      {/* stepper — reinforces Sholeh › Mandiri › Kreatif › Berprestasi */}
      <div className="absolute top-[14%] left-1/2 flex -translate-x-1/2 items-center gap-3 px-4 text-center sm:gap-4">
        {values.map((v, i) => (
          <span key={v.title} className="flex items-center gap-3 sm:gap-4">
            <span
              className={`vs-step vs-step-${i} text-[10px] tracking-[0.32em] uppercase sm:text-[12px]`}
              style={{ color: "rgba(246,239,226,0.28)" }}
            >
              {v.title}
            </span>
            {i < values.length - 1 && (
              <span aria-hidden="true" style={{ color: "rgba(231,193,121,0.5)" }}>›</span>
            )}
          </span>
        ))}
      </div>

      {/* stacked centre words — each overlays the full section and centres */}
      {values.map((v, i) => (
        <div
          key={v.title}
          className={`vs-item vs-item-${i} absolute inset-0 flex flex-col items-center justify-center px-6 text-center`}
          style={{ opacity: 0 }}
        >
          <span className="font-display block tabular-nums" style={{ fontSize: "0.85rem", letterSpacing: "0.4em", color: "var(--gold-soft)" }}>
            0{i + 1}
          </span>
          <h2
            className="font-display mt-6"
            style={{ fontSize: "clamp(3.5rem,13vw,11rem)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em" }}
          >
            {v.title}
          </h2>
          <span className="vs-line mt-7 block h-px w-24 origin-center" style={{ background: "var(--gold)", transform: "scaleX(0)" }} />
          <p
            className="font-serif mx-auto mt-7 max-w-[42ch] italic"
            style={{ fontSize: "clamp(1.05rem,1.7vw,1.45rem)", lineHeight: 1.6, color: "rgba(246,239,226,0.82)" }}
          >
            {v.line}
          </p>
        </div>
      ))}

      {/* scroll hint */}
      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.35em] uppercase" style={{ color: "rgba(246,239,226,0.4)" }}>
        Gulir untuk menyaksikan
      </span>
    </section>
  );
}
