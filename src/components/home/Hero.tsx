import { ArrowRight, Coffee, MapPin, Martini, Star } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import { paths, type Lang } from "@/lib/i18n";
import { Photo } from "../ui/Photo";
import { Bokeh, Palms, Sticker } from "./Decor";
import { FauxLine, OpenStatus, SunLine } from "./HeroIslands";

const HERO_EAGER = `(function(){var t=document.documentElement.getAttribute("data-theme")==="night"?"night":"day";var i=document.querySelector('[data-hero="'+t+'"] img');if(i){i.loading="eager";i.fetchPriority="high"}})();`;

export function Hero({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const h = c.hero;
  const words = h.title.split(" ");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-28 lg:pb-28 lg:pt-36">
      <Palms className="only-day pointer-events-none absolute -right-40 -top-24 -z-10 w-[min(62rem,130vw)] opacity-[0.17] mix-blend-multiply" />
      <Bokeh className="only-night pointer-events-none absolute inset-0 -z-10" />

      <div className="container-pz grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          {/* The kicker is part of the H1 so the heading says what and where (кафе бар, коктел бар, Скопје),
              not only the slogan. Stacked on phones, one dotted row from md up. */}
          <h1 id="hero-title" className="text-ink">
            <span className="text-kicker flex flex-col gap-y-2 text-gold-ink md:flex-row md:flex-wrap md:items-center md:gap-x-3">
              <span className="inline-flex items-center gap-1.5 [:root[data-theme=night]_&]:opacity-55">
                <Coffee aria-hidden weight="bold" className="size-4" />
                {h.kickerDay}
              </span>{" "}
              <span aria-hidden="true" className="hidden md:inline">·</span>{" "}
              <span className="inline-flex items-center gap-1.5 [:root:not([data-theme=night])_&]:opacity-55">
                <Martini aria-hidden weight="bold" className="size-4" />
                {h.kickerNight}
              </span>{" "}
              <span aria-hidden="true" className="hidden md:inline">·</span>{" "}
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden weight="bold" className="size-4" />
                {h.kickerCity}
              </span>
            </span>{" "}
            <span className="text-hero mt-6 block">
              {words.map((w, i) => (
                <span key={i}>
                  <span className="word-rise" style={{ "--i": i } as React.CSSProperties}>
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            <span className="only-day">{h.subDay}</span>
            <span className="only-night">{h.subNight}</span>
          </p>

          <FauxLine item={h.fauxItem} price={h.fauxPrice} stamp={h.stamp} />

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={paths.menu(lang)} className="btn btn-primary">
              {h.ctaMenu}
              <ArrowRight aria-hidden weight="bold" className="btn-arrow size-5" />
            </a>
            <a href="#loyalty" className="btn btn-ghost">
              {h.ctaLoyalty}
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5 text-sm">
            <OpenStatus
              labels={{ ...c.status, everyDay: c.footer.hoursValue }}
            />
            <a href={SITE.maps} target="_blank" rel="noopener" className="chip hover:shadow-[inset_0_0_0_1px_var(--pz-gold)]">
              <Star aria-hidden weight="fill" className="size-4 text-gold" />
              <span>
                {h.rating} · {h.reviews}
              </span>
              <span className="sr-only">{c.a11y.newTab}</span>
            </a>
          </div>
        </div>

        <div className="relative min-w-0 lg:col-span-5">
          <div className="arch-wrap relative mx-auto w-full max-w-[25rem] lg:ml-auto lg:mr-4">
            <div aria-hidden="true" className="arch absolute inset-0 translate-x-3.5 translate-y-3.5 shadow-[inset_0_0_0_2px_var(--pz-gold)]" />
            <div className="arch relative aspect-[4/5] bg-sunk shadow-[var(--pz-shadow)]">
              <div data-hero="day" className="only-day">
                <Photo
                  name="hero-day"
                  alt={h.altDay}
                  sizes="(min-width: 1024px) 25rem, 90vw"
                  imgClassName="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div data-hero="night" className="only-night">
                <Photo
                  name="hero-night"
                  alt={h.altNight}
                  sizes="(min-width: 1024px) 25rem, 90vw"
                  imgClassName="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                />
              </div>
              {/* Both photos are lazy so the hidden theme never downloads; promote the visible one (the LCP). */}
              <script dangerouslySetInnerHTML={{ __html: HERO_EAGER }} />
            </div>
            <Sticker ring={h.ring} className="absolute -bottom-6 -left-3 size-28 text-ink sm:-left-8 sm:size-32" />
          </div>
          <SunLine sunset={h.sunset} sunrise={h.sunrise} />
        </div>
      </div>
    </section>
  );
}
