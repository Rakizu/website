import { Chapter } from "../Chapter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { OrnamentDivider } from "../IslamicPattern";
import { alumni } from "../../data/content";

// Bab 9 — Life After Graduation. Long-term confidence.
export function Alumni() {
  return (
    <Chapter id="alumni" nav={8} theme="light" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-10">
        <header className="mb-14 text-center">
          <span className="will-reveal text-kicker block" style={{ color: "var(--accent)" }}>
            Bab 09 — Setelah Lulus
          </span>
          <h2 className="will-reveal text-chapter font-display mx-auto mt-5 max-w-[20ch]">
            Yang mereka bawa pulang bertahan jauh lebih lama dari nilai rapor.
          </h2>
        </header>

        <div className="space-y-16">
          {alumni.map((a, i) => (
            <figure
              key={a.name}
              className={`will-reveal flex flex-col items-center gap-8 md:flex-row md:gap-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="relative shrink-0 overflow-hidden rounded-full" style={{ width: 148, height: 148, background: "var(--muted)" }}>
                <ImageWithFallback src={a.img} alt={`Alumni ${a.name}`} className="h-full w-full object-cover" />
              </div>
              <div className={`text-center ${i % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                <blockquote className="font-serif italic" style={{ fontSize: "clamp(1.25rem,2.3vw,1.9rem)", lineHeight: 1.5 }}>
                  “{a.quote}”
                </blockquote>
                <figcaption className="mt-5">
                  <p className="font-display" style={{ fontWeight: 600 }}>{a.name}</p>
                  <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>{a.now}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <OrnamentDivider className="will-reveal mx-auto mt-20" />
      </div>
    </Chapter>
  );
}
