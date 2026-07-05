import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chapter } from "../Chapter";
import { achievements } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Bab 8 — Prestasi / bukti. Animated stat counters.
export function Achievements() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value || "0");
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + suffix;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <Chapter id="achievements" nav={7} theme="dark" className="py-24 md:py-36">
      <div ref={root} className="mx-auto w-full max-w-[1300px] px-6 sm:px-10">
        <header className="mb-16 max-w-[44ch]">
          <span className="will-reveal text-kicker block" style={{ color: "var(--gold-soft)" }}>
            Bab 08 — Bukti, Bukan Sekadar Janji
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5">Angka yang menjaga kualitas tetap dekat.</h2>
        </header>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] md:grid-cols-4" style={{ background: "rgba(246,239,226,0.14)" }}>
          {achievements.map((a) => {
            const m = a.value.match(/^(\d+)(.*)$/);
            const num = m ? m[1] : null;
            const suffix = m ? m[2] : "";
            return (
              <div key={a.label} className="will-reveal p-7 md:p-9" style={{ background: "var(--ink)" }}>
                <span
                  className="stat-num font-display block tabular-nums"
                  style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 700, color: "var(--gold-soft)", lineHeight: 1 }}
                  data-value={num ?? ""}
                  data-suffix={suffix}
                >
                  {num ? "0" + suffix : a.value}
                </span>
                <p className="mt-4 text-[14px]" style={{ color: "rgba(246,239,226,0.85)" }}>{a.label}</p>
                <p className="mt-1 text-[12px] italic" style={{ color: "rgba(246,239,226,0.5)" }}>{a.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Chapter>
  );
}
