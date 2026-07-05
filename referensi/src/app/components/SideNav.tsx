import { chapters } from "../data/content";

// Chapter dots — quick-jump navigation (PRD §12 "navigasi pintas").
export function SideNav({ active }: { active: number }) {
  return (
    <nav
      aria-label="Navigasi bab"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {chapters.map((c, i) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="group flex items-center gap-3"
          aria-label={c.label}
          aria-current={active === i ? "true" : undefined}
        >
          <span
            className="whitespace-nowrap text-[11px] tracking-[0.2em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
            style={{ color: "var(--foreground)" }}
          >
            {c.label}
          </span>
          <span
            className="relative block rounded-full transition-all duration-300"
            style={{
              width: active === i ? 10 : 7,
              height: active === i ? 10 : 7,
              background: active === i ? "var(--accent)" : "var(--muted-foreground)",
              boxShadow: active === i ? "0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)" : "none",
              opacity: active === i ? 1 : 0.45,
            }}
          />
        </a>
      ))}
    </nav>
  );
}
