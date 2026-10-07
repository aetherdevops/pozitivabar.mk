"use client";

import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/hooks";

type Props = {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  cta: { href: string; label: string };
  lang: { href: string; label: string; hrefLang: string };
  footnote: string;
};

/** Full-screen sheet for small screens. Portaled to <body>: the header's backdrop-filter would
 *  otherwise become the containing block of this fixed panel. */
export function MobileNav({ links, openLabel, closeLabel, cta, lang, footnote }: Props) {
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      delete root.dataset.navOpen;
      root.style.overflow = "";
      return;
    }
    root.dataset.navOpen = "1";
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        opener.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };

  return (
    <div className="lg:hidden">
      <button
        ref={opener}
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full bg-sunk shadow-[inset_0_0_0_1px_var(--pz-line)]"
      >
        <List aria-hidden weight="bold" className="size-5" />
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-nav"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={openLabel}
            hidden={!open}
            className="fixed inset-0 z-70 h-dvh flex-col overflow-y-auto bg-bg px-5 pb-8 pt-4 [&:not([hidden])]:flex lg:hidden"
          >
            <div className="flex justify-end">
              <button
                type="button"
                aria-label={closeLabel}
                onClick={close}
                className="grid size-11 place-items-center rounded-full bg-sunk"
              >
                <X aria-hidden weight="bold" className="size-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label={openLabel}>
              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="mobile-link py-1 font-display text-[2.4rem] font-bold leading-tight tracking-tight"
                  style={{ animationDelay: `${i * 60 + 60}ms` }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={lang.href}
                hrefLang={lang.hrefLang}
                lang={lang.hrefLang}
                className="mobile-link mt-5 inline-flex min-h-11 items-center text-kicker text-ink-soft"
                style={{ animationDelay: `${links.length * 60 + 60}ms` }}
              >
                {lang.label}
              </a>
            </nav>
            <a href={cta.href} target="_blank" rel="noopener" className="btn btn-primary mt-8 w-full">
              {cta.label}
              <ArrowUpRight aria-hidden weight="bold" className="size-5" />
            </a>
            <p className="mt-4 text-center text-sm text-ink-soft">{footnote}</p>
          </div>,
          document.body,
        )}
    </div>
  );
}
