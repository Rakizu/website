import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { school } from "../data/content";
import { OrnamentDivider } from "./IslamicPattern";

// Cinematic themed preloader (PRD §10). Counts up, then lifts like a curtain.
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          onDone();
          setGone(true);
        },
      });

      tl.from(".pre-mark", { opacity: 0, y: 30, duration: 0.9, ease: "power3.out" })
        .from(".pre-line", { scaleX: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
        .to(
          counter,
          {
            v: 100,
            duration: reduce ? 0.3 : 1.6,
            ease: "power1.inOut",
            onUpdate: () => setCount(Math.round(counter.v)),
          },
          "-=0.3",
        )
        .to(".pre-content", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, "+=0.2")
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        }, "-=0.1");
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      <div className="pre-content flex flex-col items-center px-8 text-center" style={{ color: "var(--cream)" }}>
        <span className="pre-mark text-kicker" style={{ color: "var(--gold-soft)" }}>
          Bismillahirrahmanirrahim
        </span>
        <h1 className="pre-mark font-display mt-6" style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 700, lineHeight: 1.1 }}>
          {school.name}
        </h1>
        <OrnamentDivider className="pre-mark mt-6" />
        <div className="pre-line mx-auto mt-8 h-px w-40 origin-left" style={{ background: "var(--gold)" }} />
        <span className="pre-mark mt-6 font-serif italic" style={{ color: "rgba(246,239,226,0.6)" }}>
          Menyiapkan perjalanan… {count}%
        </span>
      </div>
    </div>
  );
}
