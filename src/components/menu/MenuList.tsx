import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { Fragment } from "react";
import { MENU, type MenuItem } from "@/content/menu";
import type { Lang } from "@/lib/i18n";
import { normalize } from "./search";

type Props = {
  lang: Lang;
  currency: string;
  ask: string;
  empty: string;
  currencyNote: string;
  loyalty: { text: string; cta: string; href: string; newTab: string };
};

/** Searchable text for an item (both languages, ingredients, section), pre-normalized at build time. */
const haystack = (i: MenuItem, sectionTitles: string[]) =>
  normalize([i.name.mk, i.name.en, i.ingredients?.mk ?? "", i.ingredients?.en ?? "", ...sectionTitles].join(" | "));

function Price({ item, currency, ask }: { item: MenuItem; currency: string; ask: string }) {
  return item.price ? (
    <span className="tabular whitespace-nowrap font-display font-semibold">
      {item.price} <span className="text-[0.8em] font-medium text-ink-soft">{currency}</span>
    </span>
  ) : (
    <span className="rounded-full bg-sunk px-2.5 py-0.5 text-sm font-semibold text-ink-soft">{ask}</span>
  );
}

/**
 * The full menu as static, server-rendered HTML (readable without JS). MenuControls filters it in
 * place via the data-* hooks, so no menu row is hydrated by React.
 */
export function MenuList({ lang, currency, ask, empty, currencyNote, loyalty }: Props) {
  return (
    <div className="container-pz mt-10 flex flex-col gap-16 lg:mt-14 lg:gap-20">
      <p data-menu-empty data-template={empty} hidden className="py-10 text-center font-serif text-2xl italic text-ink-soft" />

      {MENU.map((s) => {
        const titles = [s.title.mk, s.title.en];
        return (
          <Fragment key={s.id}>
            <section id={s.id} data-menu-section aria-labelledby={`${s.id}-title`} className="scroll-mt-[10.5rem] md:scroll-mt-36">
              <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
                <h2 id={`${s.id}-title`} className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-tight">
                  {s.title[lang]}
                </h2>
                <span data-menu-count className="tabular pb-1 text-sm font-semibold text-ink-soft">
                  {s.items.length}
                </span>
              </div>
              {s.note && <p className="mt-3 font-serif text-lg italic text-ink-soft">{s.note[lang]}</p>}

              {s.kind === "cocktails" ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {s.items.map((i) => (
                    <li
                      key={i.id}
                      id={`item-${i.id}`}
                      data-menu-item={haystack(i, titles)}
                      className="menu-item card flex gap-4 p-5 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 size-14 shrink-0 rounded-full shadow-inner"
                        style={{ background: `conic-gradient(from 200deg, ${i.hue![0]}, ${i.hue![1]}, ${i.hue![2]}, ${i.hue![0]})` }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 data-hl className="font-display text-lg font-bold tracking-tight">
                            {i.name[lang]}
                          </h3>
                          <Price item={i} currency={currency} ask={ask} />
                        </div>
                        <p data-hl className="mt-1.5 font-serif text-[1.08rem] italic leading-snug text-ink-soft">
                          {i.ingredients![lang]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-4 gap-x-16 lg:columns-2">
                  {s.items.map((i) => (
                    <li
                      key={i.id}
                      id={`item-${i.id}`}
                      data-menu-item={haystack(i, titles)}
                      className="menu-item break-inside-avoid border-b border-line py-3.5"
                    >
                      <div className="flex items-baseline">
                        <span data-hl className="text-[1.05rem] font-medium">
                          {i.name[lang]}
                        </span>
                        <span className="leader" aria-hidden="true" />
                        <Price item={i} currency={currency} ask={ask} />
                      </div>
                      {i.ingredients && (
                        <p data-hl className="mt-0.5 font-serif text-[1.05rem] italic text-ink-soft">
                          {i.ingredients[lang]}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {s.id === "kafe" && (
              <aside
                data-theme="bar"
                data-menu-promo
                className="-mt-4 flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-bg p-6 text-ink sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:-mt-6"
              >
                <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{loyalty.text}</p>
                <a href={loyalty.href} target="_blank" rel="noopener" className="btn btn-primary">
                  {loyalty.cta}
                  <ArrowUpRight aria-hidden weight="bold" className="btn-arrow size-5" />
                  <span className="sr-only">{loyalty.newTab}</span>
                </a>
              </aside>
            )}
          </Fragment>
        );
      })}

      <p className="text-center text-sm text-ink-soft">{currencyNote}</p>
    </div>
  );
}
