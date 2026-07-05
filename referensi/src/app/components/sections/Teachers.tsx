import { Chapter } from "../Chapter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { teachers } from "../../data/content";

// Bab 5 — Para Guru. Chapter that carries trust (PRD §8: raise confidence).
export function Teachers() {
  return (
    <Chapter id="teachers" nav={4} theme="light" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
        <header className="mb-16 max-w-[62ch]">
          <span className="will-reveal text-kicker block" style={{ color: "var(--accent)" }}>
            Bab 05 — Orang di Balik Perjalanan
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5 max-w-[18ch]">
            Guru yang mengenal anak Anda, bukan sekadar mengajarinya.
          </h2>
          <p className="will-reveal mt-6 text-lead" style={{ color: "var(--muted-foreground)" }}>
            Di kelas kecil, tidak ada anak yang luput. Setiap wali kelas menghafal nama,
            kebiasaan, dan kesulitan tiap murid — karena kepercayaan dibangun dari perhatian.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {teachers.map((t) => (
            <figure key={t.name} className="will-reveal group">
              <div className="relative overflow-hidden rounded-[4px]" style={{ aspectRatio: "4/5", background: "var(--muted)" }}>
                <ImageWithFallback
                  src={t.img}
                  alt={`Potret ${t.name}, ${t.role}`}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.15] transition-all duration-[1s] ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(34,26,20,0.35) 100%)" }} />
              </div>
              <figcaption className="mt-5">
                <blockquote className="font-serif italic" style={{ fontSize: "1.15rem", lineHeight: 1.6 }}>
                  “{t.quote}”
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <span className="h-px w-6" style={{ background: "var(--accent)" }} />
                  <div>
                    <p className="font-display" style={{ fontWeight: 600, fontSize: "0.98rem" }}>{t.name}</p>
                    <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>{t.role}</p>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
