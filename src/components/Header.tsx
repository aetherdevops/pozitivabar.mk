import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import { otherLang, paths, type Lang } from "@/lib/i18n";
import { HeaderFrame } from "./HeaderFrame";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./ui/Wordmark";

export type Page = "home" | "menu";

export function Header({ lang, page }: { lang: Lang; page: Page }) {
  const c = COPY[lang];
  const alt = otherLang(lang);
  const altHref = page === "home" ? paths.home(alt) : paths.menu(alt);
  const links = [
    { href: paths.menu(lang), label: c.nav.menu, current: page === "menu" },
    { href: `${paths.home(lang)}#loyalty`, label: c.nav.loyalty, current: false },
    { href: `${paths.home(lang)}#visit`, label: c.nav.visit, current: false },
  ];

  return (
    <HeaderFrame>
      <a
        href="#main"
        className="sr-only z-80 rounded-full bg-action px-5 py-3 font-semibold text-on-action focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        {c.a11y.skip}
      </a>
      <div className="container-pz flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
        <a href={paths.home(lang)} aria-label={c.a11y.home} className="group flex items-center gap-2.5 rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo-badge-96.webp"
            width={40}
            height={40}
            alt=""
            className="size-10 rounded-full shadow-[0_0_0_1.5px_var(--pz-gold)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12"
          />
          <Wordmark className="w-[6.9rem] text-logo sm:w-[7.75rem]" />
        </a>

        <nav aria-label={c.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem] font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={l.current ? "page" : undefined}
                  className="link-underline py-2 aria-[current=page]:bg-[length:100%_2px]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={c.a11y.language}
            className="hidden items-center rounded-full bg-sunk p-1 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--pz-line)] sm:flex"
          >
            <span aria-current="true" className="rounded-full bg-ink px-3 py-1.5 text-bg">
              {lang === "mk" ? "МК" : "EN"}
            </span>
            <a href={altHref} hrefLang={alt} lang={alt} className="rounded-full px-3 py-1.5 text-ink-soft hover:text-ink">
              {alt === "mk" ? "МК" : "EN"}
            </a>
          </div>
          <ThemeToggle label={c.a11y.themeSwitch} dayLabel={c.theme.day} nightLabel={c.theme.night} />
          <MobileNav
            links={[{ href: paths.home(lang), label: c.nav.home }, ...links.map(({ href, label }) => ({ href, label }))]}
            openLabel={c.a11y.openNav}
            closeLabel={c.a11y.closeNav}
            cta={{ href: SITE.loyalty, label: c.loyalty.cta }}
            lang={{ href: altHref, label: alt === "mk" ? "Македонски" : "English", hrefLang: alt }}
            footnote={`${c.visit.lines[0]} · ${c.footer.hoursValue}`}
          />
        </div>
      </div>
    </HeaderFrame>
  );
}
