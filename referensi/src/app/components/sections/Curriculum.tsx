import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IslamicPattern } from "../IslamicPattern";
import { curriculumSessions, programs } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Bab 6 ⭐ — Momen Wow (PRD §7): "pohon cahaya tumbuh" digambar oleh scroll.
// Pinned section; SVG stroke-dashoffset + reveal nodes driven by one scrubbed timeline.
export function Curriculum() {
  const root = useRef<HTMLElement>(null);
  const stemRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stem = stemRef.current;
      if (!stem) return;

      const len = stem.getTotalLength();
      gsap.set(stem, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
      gsap.set([".cur-node", ".cur-branch", ".cur-prog"], { opacity: reduce ? 1 : 0 });

      if (reduce) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".cur-head", { opacity: 1, y: 0, duration: 0.15 }, 0)
        .to(stem, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
        .to(".cur-branch", { opacity: 1, duration: 0.4, stagger: 0.15 }, 0.35)
        .to(".cur-node-1", { opacity: 1, x: 0, duration: 0.25 }, 0.2)
        .to(".cur-node-2", { opacity: 1, x: 0, duration: 0.25 }, 0.5)
        .to(".cur-prog", { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 }, 0.65)
        .to(".cur-glow", { opacity: 1, scale: 1, duration: 0.4 }, 0.8);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="curriculum"
      data-chapter
      data-nav="5"
      data-theme="dark"
      className="cinematic-grain relative flex h-screen min-h-[640px] items-center overflow-hidden"
      style={{ background: "var(--ink-2)", color: "var(--cream)" }}
    >
      <IslamicPattern className="pointer-events-none absolute inset-0" color="#e3c179" opacity={0.05} />
      {/* growing warm glow at the crown of the tree */}
      <div
        className="cur-glow pointer-events-none absolute left-[16%] top-[18%] h-64 w-64 -translate-x-1/2 rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(231,193,121,0.55), transparent 70%)", filter: "blur(12px)", transform: "scale(0.6)" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1300px] grid-cols-1 items-center gap-10 px-6 sm:px-10 md:grid-cols-2">
        {/* ── The growing tree of light ── */}
        <div className="relative order-2 h-[46vh] w-full md:order-1 md:h-[70vh]">
          <svg viewBox="0 0 400 620" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
            <g stroke="#e3c179" strokeWidth="2.5" strokeLinecap="round">
              {/* main stem, drawn by scroll */}
              <path
                ref={stemRef}
                d="M200 610 C 200 500 200 470 198 420 C 196 360 205 320 200 250 C 196 190 202 150 200 70"
              />
              {/* branches (decorative, fade in) */}
              <path className="cur-branch" d="M198 420 C 150 400 120 380 92 360" opacity="0" />
              <path className="cur-branch" d="M200 320 C 250 300 285 285 320 260" opacity="0" />
              <path className="cur-branch" d="M200 250 C 158 232 130 215 104 188" opacity="0" />
              <path className="cur-branch" d="M200 150 C 246 132 272 112 300 86" opacity="0" />
            </g>
            {/* leaf/light dots at branch tips */}
            <g fill="#e3c179">
              <circle className="cur-branch" cx="92" cy="360" r="4" opacity="0" />
              <circle className="cur-branch" cx="320" cy="260" r="4" opacity="0" />
              <circle className="cur-branch" cx="104" cy="188" r="4" opacity="0" />
              <circle className="cur-branch" cx="300" cy="86" r="5" opacity="0" />
              <circle cx="200" cy="70" r="6" fill="#f6efe2" />
            </g>
          </svg>
        </div>

        {/* ── Narrative ── */}
        <div className="order-1 md:order-2">
          <div className="cur-head" style={{ opacity: 0, transform: "translateY(20px)" }}>
            <span className="text-kicker block" style={{ color: "var(--gold-soft)" }}>
              Bab 06 — Kurikulum
            </span>
            <h2 className="text-chapter font-display mt-5 max-w-[16ch]">
              Satu hari yang menumbuhkan seluruh dirinya.
            </h2>
            <p className="mt-5 max-w-[44ch] text-lead" style={{ color: "rgba(246,239,226,0.8)" }}>
              Konsep <em className="font-serif">Full Day School</em> menyatukan penguasaan akademik
              dengan pembinaan ruhani — dari pagi hingga Ashar berjamaah.
            </p>
          </div>

          <div className="mt-9 space-y-5">
            {curriculumSessions.map((s, i) => (
              <div
                key={s.title}
                className={`cur-node cur-node-${i + 1} flex gap-5`}
                style={{ opacity: 0, transform: "translateX(24px)" }}
              >
                <span className="mt-1 font-display tabular-nums" style={{ fontSize: "0.85rem", color: "var(--gold-soft)", minWidth: 92 }}>
                  {s.time}
                </span>
                <div className="border-l pl-5" style={{ borderColor: "rgba(231,193,121,0.4)" }}>
                  <h3 className="font-display" style={{ fontWeight: 600, fontSize: "1.2rem" }}>{s.title}</h3>
                  <p className="mt-1 max-w-[40ch] text-[14px]" style={{ color: "rgba(246,239,226,0.75)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {programs.map((p) => (
              <span
                key={p}
                className="cur-prog rounded-full px-4 py-2 text-[13px]"
                style={{
                  opacity: 0,
                  transform: "translateY(12px)",
                  border: "1px solid rgba(231,193,121,0.4)",
                  color: "var(--gold-soft)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
