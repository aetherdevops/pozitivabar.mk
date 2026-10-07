// Decoration: palm-leaf shadows (day, see scripts/palms.mjs), warm bokeh (night), the spinning sticker.

export function Palms({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/palms.svg" alt="" width={860} height={760} decoding="async" className="palm-sway h-auto w-full will-change-transform" />
    </div>
  );
}

const ORBS = [
  { x: "8%", y: "18%", s: "18rem", c: "rgb(216 178 106 / .30)", d: "14s" },
  { x: "62%", y: "8%", s: "22rem", c: "rgb(255 122 92 / .22)", d: "18s" },
  { x: "78%", y: "58%", s: "16rem", c: "rgb(47 164 106 / .22)", d: "16s" },
  { x: "28%", y: "70%", s: "12rem", c: "rgb(216 178 106 / .18)", d: "12s" },
];

export function Bokeh({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {ORBS.map((o, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: o.x,
            top: o.y,
            width: o.s,
            height: o.s,
            background: `radial-gradient(circle, ${o.c} 0%, transparent 68%)`,
            animation: `pz-drift ${o.d} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Round sticker: logo badge in the middle, a slowly spinning text ring around it. */
export function Sticker({ ring, className }: { ring: string; className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative size-full">
        <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full">
          <defs>
            <path id="pz-ring" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
          </defs>
          <circle cx="60" cy="60" r="59" fill="var(--pz-surface)" stroke="var(--pz-gold)" strokeWidth="1" />
          <text
            fill="currentColor"
            fontFamily="var(--font-display)"
            fontWeight="600"
            fontSize="9.6"
            textLength="292"
            lengthAdjust="spacing"
          >
            <textPath href="#pz-ring">{ring}</textPath>
          </text>
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/logo-badge-96.webp"
          alt=""
          width={96}
          height={96}
          className="absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </div>
    </div>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}
