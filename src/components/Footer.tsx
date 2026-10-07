import { ArrowUp, InstagramLogo } from "@phosphor-icons/react/ssr";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import { otherLang, paths, type Lang } from "@/lib/i18n";
import type { Page } from "./Header";
import { Wordmark } from "./ui/Wordmark";

export function Footer({ lang, page }: { lang: Lang; page: Page }) {
  const c = COPY[lang];
  const f = c.footer;
  const alt = otherLang(lang);
  return (
    <footer className="cv-auto relative overflow-hidden border-t border-line pb-10 pt-16 lg:pt-24">
      <div className="container-pz">
        <Wordmark withBar className="block w-full text-logo" />
        <p className="text-lede mt-8 text-center text-ink-soft">{f.tagline}</p>

        <div className="mt-14 grid gap-10 text-[0.975rem] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-kicker text-gold-ink">{f.address}</h2>
            <p className="mt-3 leading-relaxed">
              <a href={SITE.maps} target="_blank" rel="noopener" className="link-underline">
                {c.visit.lines[0]}
                <br />
                {c.visit.lines[1]}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-kicker text-gold-ink">{f.hours}</h2>
            <p className="mt-3">{f.hoursValue}</p>
          </div>
          <div>
            <h2 className="text-kicker text-gold-ink">{f.contact}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`tel:${SITE.phone}`} className="link-underline">
                  {SITE.phoneIntl}
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2">
                  <InstagramLogo aria-hidden weight="bold" className="size-4" />
                  <span className="link-underline">{SITE.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-kicker text-gold-ink">{f.pages}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={paths.home(lang)} className="link-underline">
                  {c.nav.home}
                </a>
              </li>
              <li>
                <a href={paths.menu(lang)} className="link-underline">
                  {c.nav.menu}
                </a>
              </li>
              <li>
                <a href={page === "home" ? paths.home(alt) : paths.menu(alt)} hrefLang={alt} lang={alt} className="link-underline">
                  {alt === "mk" ? "Македонски" : "English"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>{f.rights}</p>
          <a href="#top" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink">
            <ArrowUp aria-hidden weight="bold" className="size-4" />
            {f.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
