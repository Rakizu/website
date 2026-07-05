import { useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { waLink } from "../data/content";

// Floating CTA (PRD §12) — "Daftar Sekarang" + WhatsApp.
// Collapses on fast scroll, hidden until the user has moved past the hero.
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > window.innerHeight * 0.8);
      setCompact(Math.abs(y - lastY.current) > 24 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 transition-all duration-500 sm:bottom-7"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 24}px)`,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href="#admission"
        className="group flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all duration-300 hover:gap-3 active:scale-[0.97]"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 10px 30px -8px rgba(42,32,26,0.5)" }}
      >
        <span className="text-[13px] font-medium tracking-wide">Daftar Sekarang</span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        className="flex items-center gap-2 rounded-full py-3 shadow-lg transition-all duration-300"
        style={{
          background: "var(--card)",
          color: "var(--primary)",
          border: "1px solid var(--border)",
          paddingInline: compact ? 12 : 18,
        }}
      >
        <MessageCircle size={17} />
        <span
          className="overflow-hidden whitespace-nowrap text-[13px] font-medium transition-all duration-300"
          style={{ maxWidth: compact ? 0 : 120, opacity: compact ? 0 : 1 }}
        >
          WhatsApp
        </span>
      </a>
    </div>
  );
}
