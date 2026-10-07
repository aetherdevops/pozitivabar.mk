/* eslint-disable @next/next/no-html-link-for-pages -- static export: plain links, full page loads */
import "./globals.css";
import type { Metadata } from "next";
import { Wordmark } from "@/components/ui/Wordmark";
import { COPY } from "@/content/copy";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/themeScript";

export const metadata: Metadata = {
  title: "404 | Позитива Бар",
  description: COPY.mk.notFound.title,
};

// One static 404.html serves both languages, so it speaks both.
export default function GlobalNotFound() {
  return (
    <html lang="mk" data-theme="day" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <main className="container-pz flex min-h-dvh flex-col items-center justify-center py-16 text-center">
          <a href="/" aria-label={COPY.mk.a11y.home} className="w-56 text-logo sm:w-72">
            <Wordmark withBar className="block" />
          </a>
          <p className="mt-12 font-display text-[clamp(4rem,14vw,9rem)] font-extrabold leading-none tracking-tight text-gold">404</p>
          {(["mk", "en"] as const).map((l) => (
            <div key={l} lang={l} className="mt-8 max-w-md">
              <h1 className="font-display text-2xl font-bold tracking-tight">{COPY[l].notFound.title}</h1>
              <p className="mt-2 text-ink-soft">{COPY[l].notFound.text}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a href={l === "mk" ? "/" : "/en/"} className="btn btn-primary">
                  {COPY[l].notFound.home}
                </a>
                <a href={l === "mk" ? "/menu/" : "/en/menu/"} className="btn btn-ghost">
                  {COPY[l].notFound.menu}
                </a>
              </div>
            </div>
          ))}
        </main>
      </body>
    </html>
  );
}
