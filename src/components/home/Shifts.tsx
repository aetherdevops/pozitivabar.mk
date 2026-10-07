import { ArrowRight, Coffee, Martini } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { findItem } from "@/content/menu";
import { currency, paths, type Lang } from "@/lib/i18n";
import { LoopVideo } from "../ui/LoopVideo";

const SHIFTS = [
  { key: "day", theme: "day", video: "espresso-pour", w: 480, h: 600, items: ["espresso", "cappuccino", "freddo-espresso"], anchor: "kafe" },
  { key: "night", theme: "night", video: "drunk-monkey", w: 480, h: 480, items: ["drunk-monkey", "aperol-spritz", "moscow-mule"], anchor: "signature" },
] as const;

/** Cafe vs bar side by side. Each card keeps its own shift's palette whatever the page theme is. */
export function Shifts({ lang }: { lang: Lang }) {
  const c = COPY[lang].shifts;
  return (
    <section aria-labelledby="shifts-title" className="section-y cv-auto">
      <div className="container-pz">
        <div className="reveal max-w-3xl">
          <p className="text-kicker text-gold-ink">{c.kicker}</p>
          <h2 id="shifts-title" className="text-h2 mt-4">
            {c.title}
          </h2>
        </div>

        <div className="shifts mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {SHIFTS.map((s, i) => {
            const t = c[s.key];
            const Icon = s.key === "day" ? Coffee : Martini;
            return (
              <article
                key={s.key}
                data-theme={s.theme}
                style={{ "--d": i } as React.CSSProperties}
                className="shift-card reveal card group relative grid overflow-hidden text-ink transition-[opacity,transform] duration-500 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sunk sm:aspect-auto">
                  <LoopVideo
                    src={`/video/${s.video}.mp4`}
                    poster={`/video/${s.video}-poster.webp`}
                    width={s.w}
                    height={s.h}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <p className="chip w-max text-ink">
                    <Icon aria-hidden weight="bold" className="size-4 text-gold-ink" />
                    {t.hours}
                  </p>
                  <h3 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight">{t.title}</h3>
                  <p className="text-ink-soft">{t.text}</p>
                  <ul className="mt-1">
                    {s.items.map((id) => {
                      const item = findItem(id)!;
                      return (
                        <li key={id} className="flex items-baseline border-b border-line py-2.5 last:border-0">
                          <span className="font-medium">{item.name[lang]}</span>
                          <span className="leader" aria-hidden="true" />
                          <span className="tabular font-display font-semibold">
                            {item.price} {currency[lang]}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href={`${paths.menu(lang)}#${s.anchor}`}
                    className="mt-auto inline-flex min-h-11 w-max items-center gap-2 font-semibold text-ink"
                  >
                    <span className="link-underline">{t.link}</span>
                    <ArrowRight aria-hidden weight="bold" className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
