import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chapter } from "../Chapter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { facilities } from "../../data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Bab 3 — walking through the school. Editorial asymmetric rows + gentle parallax.
export function Facilities() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".fac-img").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <Chapter id="facilities" nav={2} theme="light" className="py-24 md:py-36">
      <div ref={root} className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
        <header className="mb-16 max-w-[40ch]">
          <span className="will-reveal text-kicker block" style={{ color: "var(--accent)" }}>
            Bab 03 — Menyusuri Sekolah
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5">Rumah kedua bagi anak Anda.</h2>
          <p className="will-reveal mt-6 text-lead" style={{ color: "var(--muted-foreground)" }}>
            Setiap sudut dirancang bukan untuk mengesankan, tapi untuk menumbuhkan — tempat belajar,
            beribadah, dan bermain menyatu dalam satu ritme hari.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12">
          {facilities.map((f, i) => {
            // asymmetric editorial spans
            const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
            const tall = i % 2 === 1;
            return (
              <figure
                key={f.id}
                className={`will-reveal group relative overflow-hidden rounded-[4px] ${spans[i % 4]} ${
                  i === 1 ? "md:mt-16" : ""
                }`}
                style={{ background: "var(--muted)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: tall ? "3/4" : "4/3" }}>
                  <ImageWithFallback
                    src={f.img}
                    alt={f.name}
                    className="fac-img absolute inset-0 h-[116%] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 40%, rgba(34,26,20,0.78) 100%)" }}
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8" style={{ color: "var(--cream)" }}>
                  <h3 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.7rem)", fontWeight: 600 }}>
                    {f.name}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-[14px]" style={{ color: "rgba(246,239,226,0.82)" }}>
                    {f.desc}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </Chapter>
  );
}
