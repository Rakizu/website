import { Chapter } from "../Chapter";
import { IslamicPattern } from "../IslamicPattern";
import { values } from "../../data/content";

// Bab 4 — Nilai / Target Lulusan, dinarasikan (bukan poin kaku).
export function Vision() {
  return (
    <Chapter id="vision" nav={3} theme="sage" className="py-24 md:py-36">
      <IslamicPattern className="pointer-events-none absolute inset-0" color="#e3c179" opacity={0.06} />
      <div className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-10">
        <header className="mb-14 max-w-[46ch]">
          <span className="will-reveal text-kicker block" style={{ color: "var(--gold-soft)" }}>
            Bab 04 — Yang Kami Perjuangkan
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5">
            Empat hal yang ingin kami titipkan pada setiap lulusan.
          </h2>
        </header>

        <ul className="divide-y" style={{ borderColor: "rgba(246,239,226,0.16)" }}>
          {values.map((v) => (
            <li
              key={v.key}
              className="will-reveal group grid grid-cols-1 items-baseline gap-4 py-8 md:grid-cols-12 md:gap-8"
              style={{ borderColor: "rgba(246,239,226,0.16)" }}
            >
              <span
                className="font-display md:col-span-1"
                style={{ fontSize: "0.95rem", color: "var(--gold-soft)", letterSpacing: "0.1em" }}
              >
                {v.key}
              </span>
              <h3
                className="font-display md:col-span-4"
                style={{ fontSize: "clamp(1.8rem,3.4vw,2.8rem)", fontWeight: 600, lineHeight: 1 }}
              >
                {v.title}
              </h3>
              <p
                className="font-serif italic md:col-span-7"
                style={{ fontSize: "clamp(1.05rem,1.5vw,1.35rem)", lineHeight: 1.7, color: "rgba(246,239,226,0.85)" }}
              >
                {v.line}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
