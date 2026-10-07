import { Plus } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import type { Lang } from "@/lib/i18n";

export function Faq({ lang }: { lang: Lang }) {
  const c = COPY[lang].faq;
  return (
    <section aria-labelledby="faq-title" className="section-y cv-auto pt-0 lg:pt-0">
      <div className="container-pz grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-4">
          <p className="text-kicker text-gold-ink">{c.kicker}</p>
          <h2 id="faq-title" className="text-h2 mt-4">
            {c.title}
          </h2>
        </div>
        <div className="reveal lg:col-span-8" style={{ "--d": 1 } as React.CSSProperties}>
          {c.items.map((f) => (
            <details key={f.q} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-[1.1rem] font-semibold tracking-tight sm:text-xl">
                {f.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunk transition-transform duration-300 group-open:rotate-45">
                  <Plus aria-hidden weight="bold" className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-lg leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
