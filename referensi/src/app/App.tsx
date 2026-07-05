import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader } from "./components/Preloader";
import { SideNav } from "./components/SideNav";
import { FloatingCTA } from "./components/FloatingCTA";

import { GateHero } from "./components/sections/GateHero";
import { ValueSequence } from "./components/sections/ValueSequence";
import { Landing } from "./components/sections/Landing";
import { Facilities } from "./components/sections/Facilities";
import { Vision } from "./components/sections/Vision";
import { Teachers } from "./components/sections/Teachers";
import { Curriculum } from "./components/sections/Curriculum";
import { Extracurricular } from "./components/sections/Extracurricular";
import { Achievements } from "./components/sections/Achievements";
import { Alumni } from "./components/sections/Alumni";
import { Admission } from "./components/sections/Admission";
import { Closing } from "./components/sections/Closing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── Scrollbar auto-hide ──
      let sbTimer: number;
      const onScrollDoc = () => {
        document.documentElement.classList.add("is-scrolling");
        window.clearTimeout(sbTimer);
        sbTimer = window.setTimeout(() => document.documentElement.classList.remove("is-scrolling"), 700);
      };
      window.addEventListener("scroll", onScrollDoc, { passive: true });

      // ── Moving light motif (morning → evening) + scroll progress ──
      gsap.set(".sun-glow", { xPercent: -50 });
      const setGlowY = gsap.quickSetter(".sun-glow", "y", "px");
      const progressBar = root.current?.querySelector<HTMLElement>(".scroll-line");
      // morning gold → noon warm → dusk amber
      const hues = ["#f2d79a", "#e9c877", "#d9a94e", "#b8843a"];
      const setGlowColor = (t: number) => {
        const seg = Math.min(hues.length - 2, Math.floor(t * (hues.length - 1)));
        const local = t * (hues.length - 1) - seg;
        const c = gsap.utils.interpolate(hues[seg], hues[seg + 1], local);
        gsap.set(".sun-glow", { backgroundColor: c });
      };

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!reduce) {
            setGlowY(window.innerHeight * (0.12 + self.progress * 0.72));
            setGlowColor(self.progress);
          }
          if (progressBar) progressBar.style.transform = `scaleY(${self.progress})`;
        },
      });

      // ── Active chapter tracking ──
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(Number(sec.dataset.nav || "0"));
          },
        });
      });

      if (!reduce) {
        // ── Generic reveal-in (batched) ──
        gsap.set(".will-reveal", { opacity: 0, y: 40 });
        ScrollTrigger.batch(".will-reveal", {
          start: "top 84%",
          onEnter: (b) =>
            gsap.to(b, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.09, overwrite: true }),
          onLeaveBack: (b) => gsap.to(b, { opacity: 0, y: 40, duration: 0.4, overwrite: true }),
        });

        // ── Generic exit-out: content lifts & fades as its chapter leaves ──
        gsap.utils.toArray<HTMLElement>("[data-chapter-inner]").forEach((el) => {
          gsap.to(el, {
            opacity: 0,
            y: -60,
            ease: "none",
            scrollTrigger: { trigger: el, start: "bottom 65%", end: "bottom 12%", scrub: true },
          });
        });
      }

      // Recalculate once fonts/images settle.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = window.setTimeout(refresh, 1200);

      return () => {
        window.removeEventListener("scroll", onScrollDoc);
        window.removeEventListener("load", refresh);
        window.clearTimeout(t);
        window.clearTimeout(sbTimer);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full overflow-x-clip">
      <Preloader onDone={() => setStarted(true)} />

      {/* fixed cinematic light motif behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="sun-glow absolute left-1/2 h-[60vh] w-[60vh] rounded-full"
          style={{ top: 0, backgroundColor: "#f2d79a", opacity: 0.16, filter: "blur(90px)" }}
        />
      </div>

      {/* left scroll-progress light line */}
      <div className="pointer-events-none fixed left-0 top-0 z-40 h-full w-[3px]" aria-hidden="true">
        <div className="h-full w-full" style={{ background: "color-mix(in oklab, var(--accent) 12%, transparent)" }} />
        <div
          className="scroll-line absolute left-0 top-0 h-full w-full origin-top"
          style={{ background: "linear-gradient(180deg, var(--gold-soft), var(--accent))", transform: "scaleY(0)" }}
        />
      </div>

      <SideNav active={active} />
      <FloatingCTA />

      <main className="relative z-10">
        <GateHero started={started} />
        <ValueSequence />
        <Landing />
        <Facilities />
        <Vision />
        <Teachers />
        <Curriculum />
        <Extracurricular />
        <Achievements />
        <Alumni />
        <Admission />
        <Closing />
      </main>
    </div>
  );
}
