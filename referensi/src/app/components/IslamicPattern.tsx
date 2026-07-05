// Subtle geometric Islamic ornament — used as background texture & dividers.
// Kept low-opacity per PRD (§6: ornament subtle, not dominant).

export function IslamicPattern({
  className = "",
  color = "currentColor",
  opacity = 0.08,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="islamic-star"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          {/* eight-point star tessellation */}
          <g fill="none" stroke={color} strokeWidth="1">
            <path d="M28 4 L34 16 L46 10 L40 22 L52 28 L40 34 L46 46 L34 40 L28 52 L22 40 L10 46 L16 34 L4 28 L16 22 L10 10 L22 16 Z" />
            <circle cx="28" cy="28" r="5" />
            <path d="M0 0 L8 8 M56 0 L48 8 M0 56 L8 48 M56 56 L48 48" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
  );
}

// A small centered ornament used to separate narrative beats.
export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-16 bg-current opacity-30" />
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M17 2 L21 13 L32 17 L21 21 L17 32 L13 21 L2 17 L13 13 Z" />
          <circle cx="17" cy="17" r="3.5" />
        </g>
      </svg>
      <span className="h-px w-16 bg-current opacity-30" />
    </div>
  );
}
