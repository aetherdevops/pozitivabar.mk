import { ArrowUpRight, Coffee, Gift } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { qrSvg } from "@/lib/qr";
import { Photo } from "../ui/Photo";

/** The conversion section. Always on the green "bar" palette (the slatted bar front). */
export async function Loyalty({ lang }: { lang: Lang }) {
  const c = COPY[lang].loyalty;
  const qr = await qrSvg(SITE.loyalty, `${c.qr}: ${SITE.loyalty}`);

  return (
    <section
      id="loyalty"
      data-theme="bar"
      aria-labelledby="loyalty-title"
      className="section-y cv-auto relative isolate overflow-hidden bg-bg text-ink"
    >
      {/* slatted bar front */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgb(0 0 0 / .13) 0 2px, transparent 2px 9px, rgb(255 255 255 / .05) 9px 11px, transparent 11px 26px)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgb(0_0_0/.28)_80%)]" />

      <div className="container-pz grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="reveal lg:col-span-7">
          <p className="text-kicker text-gold">{c.kicker}</p>
          <h2 id="loyalty-title" className="text-h2 mt-4 max-w-[18ch]">
            {c.title}
          </h2>
          <p className="mt-5 font-display text-[clamp(1.5rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-gold">
            {c.lead}
          </p>

          <ol className="mt-9 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {c.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 sm:flex-col sm:gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-base font-bold text-bg">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="stamps reveal mt-10" aria-hidden="true">
            <ol className="flex max-w-[34rem] items-center justify-between gap-1.5 sm:gap-2.5">
              {Array.from({ length: 10 }, (_, i) => (
                <li key={i} className="stamp-cup relative grid aspect-square w-full max-w-11 place-items-center rounded-full bg-sunk" style={{ "--i": i } as React.CSSProperties}>
                  {i < 9 ? <Coffee weight="fill" className="size-[55%]" /> : <Gift weight="fill" className="size-[55%]" />}
                  {i === 9 && (
                    <span className="stamp-free absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-action px-2 py-0.5 text-[0.65rem] font-extrabold tracking-wider text-on-action">
                      {c.free}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={SITE.loyalty} target="_blank" rel="noopener" className="btn btn-primary px-7 text-[1.05rem]">
              {c.cta}
              <ArrowUpRight aria-hidden weight="bold" className="btn-arrow size-5" />
              <span className="sr-only">{COPY[lang].a11y.newTab}</span>
            </a>
            <p className="text-sm font-medium text-ink-soft">{c.note}</p>
          </div>
        </div>

        <div className="reveal relative flex items-end justify-center gap-6 lg:col-span-5" style={{ "--d": 1 } as React.CSSProperties}>
          <div className="bob relative w-[15rem] drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)] sm:w-[16.7rem]">
            <Photo name="loyalty-phone" alt={c.phoneAlt} sizes="267px" imgClassName="h-auto w-full" />
          </div>
          <div className="mb-6 hidden w-40 shrink-0 rounded-3xl bg-[#f4ecdd] p-4 text-[#14271d] shadow-[var(--pz-shadow)] md:block">
            <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
            <p className="mt-3 text-center text-xs font-semibold leading-tight">{c.qr}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
