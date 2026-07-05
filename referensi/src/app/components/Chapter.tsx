import type { ReactNode } from "react";

// Standard chapter shell. `theme` drives light/dark cinematic rhythm.
// `data-chapter-inner` marks the wrapper the App fades out on scroll-exit
// (skip it for pinned chapters that manage their own motion).
export function Chapter({
  id,
  nav,
  theme = "light",
  className = "",
  innerClassName = "",
  exit = true,
  children,
}: {
  id: string;
  nav: number;
  theme?: "light" | "dark" | "sage";
  className?: string;
  innerClassName?: string;
  exit?: boolean;
  children: ReactNode;
}) {
  const bg =
    theme === "dark" ? "var(--ink)" : theme === "sage" ? "var(--sage-deep)" : "var(--background)";
  const fg = theme === "light" ? "var(--foreground)" : "var(--cream)";

  return (
    <section
      id={id}
      data-chapter
      data-nav={nav}
      data-theme={theme}
      className={`relative overflow-hidden ${className}`}
      style={{ background: bg, color: fg }}
    >
      <div {...(exit ? { "data-chapter-inner": "" } : {})} className={innerClassName}>
        {children}
      </div>
    </section>
  );
}
