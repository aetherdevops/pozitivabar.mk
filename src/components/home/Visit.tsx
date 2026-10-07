import { InstagramLogo, NavigationArrow, Phone, Star } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { CopyAddress, HoursTable, MapCard } from "./VisitIslands";

export function Visit({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const v = c.visit;
  return (
    <section id="visit" aria-labelledby="visit-title" className="section-y cv-auto">
      <div className="container-pz">
        <div className="reveal max-w-3xl">
          <p className="text-kicker text-gold-ink">{v.kicker}</p>
          <h2 id="visit-title" className="text-h2 mt-4">
            {v.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="reveal card p-6 sm:p-9 lg:col-span-7">
            <address className="not-italic">
              <p className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight tracking-tight">{v.lines[0]}</p>
              <p className="mt-1 text-lg text-ink-soft">{v.lines[1]}</p>
              <p className="mt-4">
                <a href={`tel:${SITE.phone}`} className="link-underline text-lg font-semibold">
                  {SITE.phoneIntl}
                </a>
              </p>
            </address>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={SITE.directions} target="_blank" rel="noopener" className="btn btn-primary">
                <NavigationArrow aria-hidden weight="fill" className="size-5 -scale-x-100" />
                {v.directions}
                <span className="sr-only">{c.a11y.newTab}</span>
              </a>
              <a href={`tel:${SITE.phone}`} className="btn btn-ghost">
                <Phone aria-hidden weight="bold" className="size-5" />
                {v.call}
              </a>
              <CopyAddress text={`${v.lines[0]}, ${v.lines[1]}`} label={v.copy} done={v.copied} />
            </div>

            <h3 className="text-kicker mt-10 text-gold-ink">{v.hoursTitle}</h3>
            <div className="mt-3">
              <HoursTable days={v.days} hours={v.hours} today={v.today} status={{ open: c.status.open, closed: c.status.closed }} />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <a href={SITE.maps} target="_blank" rel="noopener" className="chip hover:shadow-[inset_0_0_0_1px_var(--pz-gold)]">
                <Star aria-hidden weight="fill" className="size-4 text-gold" />
                {v.rating}
                <span className="sr-only">{c.a11y.newTab}</span>
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener" className="chip hover:shadow-[inset_0_0_0_1px_var(--pz-gold)]">
                <InstagramLogo aria-hidden weight="bold" className="size-4" />
                {SITE.instagramHandle}
                <span className="sr-only">{c.a11y.newTab}</span>
              </a>
            </div>
          </div>

          <div className="reveal lg:col-span-5" style={{ "--d": 1 } as React.CSSProperties}>
            <MapCard embed={SITE.mapEmbed} title={v.mapTitle} show={v.showMap} note={v.mapNote} />
          </div>
        </div>
      </div>
    </section>
  );
}
