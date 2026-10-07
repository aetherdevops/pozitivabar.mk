import { Coffee, Martini } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { findItem } from "@/content/menu";
import { SITE } from "@/content/site";
import { currency, paths, type Lang } from "@/lib/i18n";
import { barSchema, breadcrumbSchema, graph, menuSchema, webPageSchema } from "@/lib/schema";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Bokeh, Palms } from "../home/Decor";
import { JsonLd } from "../JsonLd";
import { RevealObserver } from "../ui/RevealObserver";
import { MenuControls } from "./MenuControls";
import { MenuList } from "./MenuList";

export function MenuPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const m = c.menu;
  const dayPick = findItem("freddo-espresso")!;
  const nightPick = findItem("drunk-monkey")!;

  return (
    <>
      <Header lang={lang} page="menu" />
      <main id="main" className="pb-28 md:pb-24">
        <section aria-labelledby="menu-title" className="relative isolate overflow-hidden pb-8 pt-28 lg:pb-12 lg:pt-36">
          <Palms className="only-day pointer-events-none absolute -right-48 -top-28 -z-10 w-[min(52rem,120vw)] opacity-[0.15] mix-blend-multiply" />
          <Bokeh className="only-night pointer-events-none absolute inset-0 -z-10" />
          <div className="container-pz flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <nav aria-label="Breadcrumb" className="text-sm font-medium text-ink-soft">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href={paths.home(lang)} className="link-underline">
                      {c.nav.home}
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink">
                    {c.nav.menu}
                  </li>
                </ol>
              </nav>
              <h1 id="menu-title" className="text-hero mt-5">
                <span className="word-rise">{m.title}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-soft">{m.sub}</p>
            </div>
            <p className="chip w-max gap-3 py-2.5 pl-3 pr-5 text-base">
              <span className="grid size-9 place-items-center rounded-full bg-ink text-bg">
                <Coffee aria-hidden weight="fill" className="only-day size-5" />
                <Martini aria-hidden weight="fill" className="only-night size-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{m.now}</span>
                <span className="only-day font-display font-semibold">
                  {dayPick.name[lang]} · {dayPick.price} {currency[lang]}
                </span>
                <span className="only-night font-display font-semibold">
                  {nightPick.name[lang]} · {nightPick.price} {currency[lang]}
                </span>
              </span>
            </p>
          </div>
        </section>

        <MenuControls
          lang={lang}
          labels={{
            searchLabel: m.searchLabel,
            searchPlaceholder: m.searchPlaceholder,
            clear: m.clear,
            resultsOne: m.resultsOne,
            resultsMany: m.resultsMany,
            surprise: m.surprise,
            surpriseTitle: m.surpriseTitle,
            surpriseAgain: m.surpriseAgain,
            surpriseShow: m.surpriseShow,
            close: m.close,
            tabs: m.tabs,
            currency: currency[lang],
          }}
        />
        <MenuList
          lang={lang}
          currency={currency[lang]}
          ask={m.ask}
          empty={m.empty}
          currencyNote={m.currencyNote}
          loyalty={{ text: m.loyalty, cta: m.loyaltyCta, href: SITE.loyalty, newTab: c.a11y.newTab }}
        />
      </main>
      <Footer lang={lang} page="menu" />
      <RevealObserver />
      <JsonLd data={graph(barSchema(lang), webPageSchema(lang, "menu"), menuSchema(lang), breadcrumbSchema(lang))} />
    </>
  );
}
