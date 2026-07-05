import { MapPin, Clock, Phone } from "lucide-react";
import { Chapter } from "../Chapter";
import { OrnamentDivider, IslamicPattern } from "../IslamicPattern";
import { school, contacts } from "../../data/content";

// Penutup — ending emosional + kontak panitia + footer.
export function Closing() {
  return (
    <Chapter id="closing" nav={10} theme="dark" className="relative" exit={false}>
      <IslamicPattern className="pointer-events-none absolute inset-0" color="#e3c179" opacity={0.045} />
      <div className="relative mx-auto w-full max-w-[1000px] px-6 py-28 text-center sm:px-10 md:py-40">
        <span className="will-reveal text-kicker block" style={{ color: "var(--gold-soft)" }}>Penutup</span>
        <p
          className="will-reveal font-display mx-auto mt-8 max-w-[22ch] text-balance"
          style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.12, fontWeight: 600 }}
        >
          Perjalanan setiap anak dimulai dari satu keputusan penuh cinta.
        </p>
        <p className="will-reveal font-serif mx-auto mt-8 max-w-[46ch] text-lead italic" style={{ color: "rgba(246,239,226,0.75)" }}>
          Kami menantikan kehadiran putra-putri Anda di {school.name}.
        </p>
        <OrnamentDivider className="will-reveal mx-auto mt-12" />
      </div>

      {/* contact + footer */}
      <div className="relative border-t" style={{ borderColor: "rgba(246,239,226,0.14)" }}>
        <div className="mx-auto w-full max-w-[1300px] px-6 py-16 sm:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{school.name}</h3>
              <ul className="mt-6 space-y-3 text-[14.5px]" style={{ color: "rgba(246,239,226,0.8)" }}>
                <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--gold-soft)" }} />{school.address}</li>
                <li className="flex items-center gap-3"><Clock size={16} className="shrink-0" style={{ color: "var(--gold-soft)" }} />{school.hours}</li>
              </ul>
            </div>

            <div className="md:col-span-7">
              <div className="mb-5 flex items-center gap-2 text-[13px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-soft)" }}>
                <Phone size={15} /> Panitia SPMB
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {contacts.map((c) => (
                  <a
                    key={c.wa}
                    href={`https://wa.me/62${c.wa.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[4px] p-4 transition-colors hover:bg-white/5"
                    style={{ border: "1px solid rgba(246,239,226,0.16)" }}
                  >
                    <p className="font-display" style={{ fontWeight: 600, fontSize: "0.95rem" }}>{c.name}</p>
                    <p className="mt-1 text-[12.5px]" style={{ color: "rgba(246,239,226,0.6)" }}>{c.role}</p>
                    <p className="mt-2 text-[13.5px]" style={{ color: "var(--gold-soft)" }}>{c.wa}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-6 text-[12.5px] sm:flex-row" style={{ borderColor: "rgba(246,239,226,0.12)", color: "rgba(246,239,226,0.5)" }}>
            <span>© {new Date().getFullYear()} {school.name}. Seluruh hak cipta dilindungi.</span>
            <span>Kebijakan Privasi · Data pendaftar diproses sesuai UU PDP No. 27/2022.</span>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
