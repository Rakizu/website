import { useState } from "react";
import confetti from "canvas-confetti";
import { Check, ArrowRight, CalendarDays, FileText } from "lucide-react";
import { Chapter } from "../Chapter";
import { IslamicPattern } from "../IslamicPattern";
import { admissionWaves, requirements, school, waLink } from "../../data/content";

// Bab 11 — SPMB. Frontend-only: no backend, no persistence. Consent per PRD §19.4.
export function Admission() {
  const [form, setForm] = useState({ child: "", parent: "", wa: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = form.child.trim() && form.parent.trim() && form.wa.trim() && consent;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSent(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#c79a45", "#e3c179", "#4c5b3f", "#f6efe2"] });
  };

  const field =
    "w-full rounded-[4px] border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[color:var(--accent)]";

  return (
    <Chapter id="admission" nav={9} theme="dark" className="py-24 md:py-36" exit={false}>
      <IslamicPattern className="pointer-events-none absolute inset-0" color="#e3c179" opacity={0.05} />
      <div className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-10">
        <header className="mb-14 max-w-[46ch]">
          <span className="will-reveal text-kicker block" style={{ color: "var(--gold-soft)" }}>
            Bab 11 — Bergabung Bersama Kami
          </span>
          <h2 className="will-reveal text-chapter font-display mt-5">
            Tempat untuk {school.quota} anak, tahun ajaran {school.year}.
          </h2>
          <p className="will-reveal mt-6 text-lead" style={{ color: "rgba(246,239,226,0.8)" }}>
            Kuota terbatas dan diisi bertahap. Amankan langkah pertama anak Anda hari ini.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* left — waves + requirements */}
          <div className="lg:col-span-5">
            <div className="will-reveal mb-4 flex items-center gap-2 text-[13px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-soft)" }}>
              <CalendarDays size={15} /> Gelombang Pendaftaran
            </div>
            <div className="space-y-3">
              {admissionWaves.map((w) => (
                <div key={w.wave} className="will-reveal rounded-[4px] p-5" style={{ border: "1px solid rgba(246,239,226,0.18)" }}>
                  <p className="font-display" style={{ fontWeight: 600, fontSize: "1.05rem" }}>{w.wave}</p>
                  <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-[13.5px]" style={{ color: "rgba(246,239,226,0.8)" }}>
                    <span>Daftar: <b style={{ color: "var(--cream)" }}>{w.register}</b></span>
                    <span>Tes: <b style={{ color: "var(--cream)" }}>{w.test}</b></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="will-reveal mt-8 mb-4 flex items-center gap-2 text-[13px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-soft)" }}>
              <FileText size={15} /> Syarat Berkas
            </div>
            <ul className="space-y-2.5">
              {requirements.map((r) => (
                <li key={r} className="will-reveal flex items-start gap-3 text-[14.5px]" style={{ color: "rgba(246,239,226,0.85)" }}>
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--gold-soft)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* right — form */}
          <div className="lg:col-span-7">
            <div className="will-reveal rounded-[4px] p-7 md:p-10" style={{ background: "var(--cream)", color: "var(--foreground)" }}>
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                    <Check size={30} />
                  </span>
                  <h3 className="font-display mt-6" style={{ fontSize: "1.5rem", fontWeight: 600 }}>Alhamdulillah, terkirim!</h3>
                  <p className="mt-3 max-w-[40ch] text-[15px]" style={{ color: "var(--muted-foreground)" }}>
                    Terima kasih, {form.parent.split(" ")[0]}. Panitia SPMB akan menghubungi Anda via WhatsApp.
                    Untuk respon lebih cepat, sapa kami langsung.
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Chat Panitia <ArrowRight size={16} />
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 600 }}>Formulir Minat Pendaftaran</h3>
                  <p className="mt-2 text-[14px]" style={{ color: "var(--muted-foreground)" }}>
                    Isi data singkat — panitia akan menghubungi Anda untuk langkah berikutnya.
                  </p>

                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="child" className="mb-1.5 block text-[13px]" style={{ color: "var(--muted-foreground)" }}>Nama Anak</label>
                      <input id="child" required value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} className={field} style={{ borderColor: "var(--border)" }} placeholder="Nama lengkap calon siswa" />
                    </div>
                    <div>
                      <label htmlFor="parent" className="mb-1.5 block text-[13px]" style={{ color: "var(--muted-foreground)" }}>Nama Orang Tua / Wali</label>
                      <input id="parent" required value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className={field} style={{ borderColor: "var(--border)" }} placeholder="Nama Anda" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="wa" className="mb-1.5 block text-[13px]" style={{ color: "var(--muted-foreground)" }}>Nomor WhatsApp Aktif</label>
                    <input id="wa" required inputMode="tel" value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} className={field} style={{ borderColor: "var(--border)" }} placeholder="08xx-xxxx-xxxx" />
                  </div>

                  {/* consent — never pre-checked; submit blocked without it */}
                  <label className="mt-6 flex cursor-pointer items-start gap-3 text-[13.5px]" style={{ color: "var(--muted-foreground)" }}>
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--primary)]" />
                    <span>
                      Saya menyetujui Kebijakan Privasi dan mengizinkan sekolah memproses data ini untuk keperluan
                      pendaftaran siswa baru. <a href="#closing" className="underline" style={{ color: "var(--primary)" }}>Baca kebijakan privasi</a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!valid}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium transition-all active:scale-[0.98]"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", opacity: valid ? 1 : 0.45, cursor: valid ? "pointer" : "not-allowed" }}
                  >
                    Daftar Sekarang <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
