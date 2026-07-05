import { Chapter } from "../Chapter";
import { OrnamentDivider } from "../IslamicPattern";

// Bab 2 continuation — the "seed of conflict": choosing a school matters.
export function Landing() {
  return (
    <Chapter
      id="landing"
      nav={1}
      theme="light"
      className="flex min-h-screen items-center"
      innerClassName="mx-auto w-full max-w-[1100px] px-6 py-28 text-center sm:px-10"
    >
      <span className="will-reveal text-kicker block" style={{ color: "var(--accent)" }}>
        Sebuah Keputusan
      </span>

      <p
        className="will-reveal font-display mx-auto mt-8 max-w-[20ch] text-balance"
        style={{ fontSize: "clamp(1.8rem,4.6vw,3.8rem)", lineHeight: 1.15, fontWeight: 600 }}
      >
        Memilih sekolah untuk anak adalah salah satu{" "}
        <span style={{ color: "var(--primary)" }}>keputusan paling penting</span> yang akan Anda ambil.
      </p>

      <OrnamentDivider className="will-reveal mx-auto mt-12" />

      <p
        className="will-reveal font-serif mx-auto mt-10 max-w-[52ch] text-lead italic"
        style={{ color: "var(--muted-foreground)" }}
      >
        Karena tidak semua anak tumbuh dengan cara yang sama. Ada yang cepat membaca,
        ada yang tenang menghafal, ada yang berani berbicara. Tugas kami bukan menyamakan mereka —
        tapi mengenali cahaya masing-masing, dan merawatnya hingga terang.
      </p>

      <p className="will-reveal mt-12 text-[13px] tracking-[0.25em] uppercase" style={{ color: "var(--muted-foreground)" }}>
        Mari susuri perjalanannya
      </p>
    </Chapter>
  );
}
