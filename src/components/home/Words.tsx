import { InstagramLogo } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import { WORDS } from "@/content/words";
import type { Lang } from "@/lib/i18n";
import { WordOfDay } from "./WordOfDay";

export function Words({ lang }: { lang: Lang }) {
  const c = COPY[lang].words;
  return (
    <section aria-labelledby="words-title" className="section-y cv-auto relative">
      <div className="container-pz grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="text-kicker text-gold-ink">{c.kicker}</p>
          <h2 id="words-title" className="text-h2 mt-4">
            {c.title}
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink-soft">{c.sub}</p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex min-h-11 items-center gap-2.5 font-semibold"
          >
            <InstagramLogo aria-hidden weight="bold" className="size-5 text-gold-ink" />
            <span className="link-underline">{c.follow}</span>
            <span className="sr-only">{COPY[lang].a11y.newTab}</span>
          </a>
          <p className="mt-3 text-sm text-ink-soft">{c.source}</p>
        </div>
        <div className="reveal lg:col-span-7" style={{ "--d": 1 } as React.CSSProperties}>
          <WordOfDay words={WORDS[lang]} next={c.next} noun={c.noun} />
        </div>
      </div>
    </section>
  );
}
