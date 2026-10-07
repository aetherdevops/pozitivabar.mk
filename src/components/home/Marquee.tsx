import { Sparkle } from "./Decor";

/** Tilted ticker band. Purely decorative repetition of facts stated elsewhere, so hidden from AT. */
export function Marquee({ items }: { items: string[] }) {
  const row = (key: string) => (
    <ul key={key} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 sm:px-8">{t}</span>
          <Sparkle className="size-4 text-band-ink/70 sm:size-5" />
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-hidden="true" className="relative z-10 overflow-x-clip">
      <div className="-my-2 -rotate-[1.4deg] scale-[1.03]">
      <div className="marquee overflow-hidden bg-band py-4 text-band-ink shadow-[0_18px_40px_-24px_rgb(0_0_0/0.5)] sm:py-5">
        <div className="marquee-track flex w-max font-display text-[clamp(1.05rem,2.1vw,1.6rem)] font-semibold uppercase tracking-tight">
          {row("a")}
          {row("b")}
        </div>
      </div>
      </div>
    </div>
  );
}
