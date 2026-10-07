"use client";

import { DiceFive, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { MENU, type MenuItem } from "@/content/menu";
import type { Lang } from "@/lib/i18n";
import { findMatch, needlesFor, wholeWord } from "./search";

export type ControlLabels = {
  searchLabel: string;
  searchPlaceholder: string;
  clear: string;
  resultsOne: string;
  resultsMany: string;
  surprise: string;
  surpriseTitle: string;
  surpriseAgain: string;
  surpriseShow: string;
  close: string;
  tabs: string;
  currency: string;
};

const DAY_POOL = ["kafe", "bezalkoholni"];
const NIGHT_POOL = ["signature", "klasicni", "pivo"];
const ALL_IDS = MENU.map((s) => s.id);
const TOTAL = MENU.reduce((n, s) => n + s.items.length, 0);
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fade the tab rail's edge(s) where more tabs are hidden off-screen. */
function markEdges(list: HTMLElement) {
  const left = list.scrollLeft > 2;
  const right = list.scrollLeft + list.clientWidth < list.scrollWidth - 2;
  list.dataset.edge = left && right ? "both" : left ? "left" : right ? "right" : "none";
}

/** Wraps the first match in <mark>, built from DOM nodes (no innerHTML). */
function highlight(el: HTMLElement, needles: string[]) {
  const text = el.dataset.text ?? (el.dataset.text = el.textContent ?? "");
  const r = needles.length ? findMatch(text, needles) : null;
  if (!r) {
    if (el.childElementCount) el.textContent = text;
    return;
  }
  const mark = document.createElement("mark");
  mark.className = "rounded bg-gold/35 px-0.5 text-inherit";
  mark.textContent = text.slice(r[0], r[1]);
  el.replaceChildren(text.slice(0, r[0]), mark, text.slice(r[1]));
}

/** Sticky search + category tabs + "surprise me" for the server-rendered MenuList. */
export function MenuControls({ lang, labels }: { lang: Lang; labels: ControlLabels }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<string[]>(ALL_IDS);
  const [count, setCount] = useState(TOTAL);
  const [active, setActive] = useState(ALL_IDS[0]);
  const [pick, setPick] = useState<{ item: MenuItem; spinning: boolean; label: string } | null>(null);
  const tabsRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumping = useRef(false);

  function applyFilter(q: string) {
    const needles = needlesFor(q);
    const vis: string[] = [];
    let total = 0;
    const items = [...document.querySelectorAll<HTMLElement>("[data-menu-item]")];
    // Prefer whole-word hits ("gin" -> gin drinks, not ginger beer); fall back to substring matches.
    const exact = needles.length > 0 && items.some((li) => wholeWord(li.dataset.menuItem!, needles));
    const matches = (hay: string) => (exact ? wholeWord(hay, needles) : needles.some((nd) => hay.includes(nd)));
    document.querySelectorAll<HTMLElement>("[data-menu-section]").forEach((sec) => {
      let n = 0;
      sec.querySelectorAll<HTMLElement>("[data-menu-item]").forEach((li) => {
        const hit = !needles.length || matches(li.dataset.menuItem!);
        li.hidden = !hit;
        if (hit) n++;
        li.querySelectorAll<HTMLElement>("[data-hl]").forEach((el) => highlight(el, needles));
      });
      sec.hidden = n === 0;
      const badge = sec.querySelector("[data-menu-count]");
      if (badge) badge.textContent = String(n);
      if (n) vis.push(sec.id);
      total += n;
    });
    document.querySelectorAll<HTMLElement>("[data-menu-promo]").forEach((el) => (el.hidden = needles.length > 0));
    const empty = document.querySelector<HTMLElement>("[data-menu-empty]");
    if (empty) {
      empty.hidden = total > 0;
      empty.textContent = (empty.dataset.template ?? "").replace("{q}", q.trim());
    }
    setQuery(q);
    setVisible(vis);
    setCount(total);
  }

  // Scroll-spy: the section crossing the upper part of the viewport is "active".
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    document.querySelectorAll("[data-menu-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Slide the pill under the active tab and keep that tab in view.
  useEffect(() => {
    const list = tabsRef.current;
    const pill = pillRef.current;
    const tab = list?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!list || !pill) return;
    if (!tab) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    pill.style.opacity = "1";
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.offsetWidth / 2, behavior: reduceMotion() ? "auto" : "smooth" });
    markEdges(list);
  }, [active, visible]);

  /** Tap on a category: scroll so its heading sits right under the pinned bar. */
  function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    e.preventDefault();
    setActive(id);
    jumping.current = true;
    const bar = document.querySelector<HTMLElement>(".menu-bar");
    const top = section.getBoundingClientRect().top + window.scrollY - (bar?.offsetHeight ?? 0) - 16;
    // Instant jump + a short fade-in of the section: a long smooth scroll through the whole menu
    // looks busy on phones (and can checkerboard on slower ones).
    window.scrollTo({ top, behavior: "auto" });
    history.replaceState(null, "", `#${id}`);
    if (!reduceMotion()) {
      section.animate([{ opacity: 0.35, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
        duration: 280,
        easing: "cubic-bezier(.22,1,.36,1)",
      });
    }
    setTimeout(() => (jumping.current = false), 400);
  }

  useEffect(
    () => () => {
      if (spinTimer.current) clearTimeout(spinTimer.current);
    },
    [],
  );

  function surprise() {
    const night = document.documentElement.getAttribute("data-theme") === "night";
    const pool = MENU.filter((s) => (night ? NIGHT_POOL : DAY_POOL).includes(s.id)).flatMap((s) =>
      s.items.filter((i) => i.price).map((i) => ({ i, section: s.title[lang] })),
    );
    const final = pool[Math.floor(Math.random() * pool.length)];
    if (spinTimer.current) clearTimeout(spinTimer.current);
    if (reduceMotion()) {
      setPick({ item: final.i, spinning: false, label: final.section });
      return;
    }
    let n = 0;
    const spin = () => {
      n++;
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (n < 14) {
        setPick({ item: r.i, spinning: true, label: r.section });
        spinTimer.current = setTimeout(spin, 45 + n * n * 1.6);
      } else setPick({ item: final.i, spinning: false, label: final.section });
    };
    spin();
  }

  function showPick() {
    if (!pick) return;
    if (query) applyFilter("");
    const el = document.getElementById(`item-${pick.item.id}`);
    setPick(null);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "center" });
    el.dataset.flash = "1";
    setTimeout(() => delete el.dataset.flash, 1800);
  }

  return (
    <>
      {/* Marks where the bar pins; the header tucks away once it has (see HeaderFrame). */}
      <div data-header-pin aria-hidden="true" />
      <div className="menu-bar sticky z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-pz flex flex-col gap-2.5 py-3 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2 md:contents">
            <div role="search" className="relative min-w-0 flex-1 md:w-[19rem] md:flex-none md:shrink-0">
              <label htmlFor="menu-search" className="sr-only">
                {labels.searchLabel}
              </label>
              <MagnifyingGlass aria-hidden weight="bold" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
              <input
                id="menu-search"
                type="search"
                inputMode="search"
                autoComplete="off"
                enterKeyHint="search"
                value={query}
                onChange={(e) => applyFilter(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="h-12 w-full rounded-full bg-surface pl-12 pr-12 text-base text-ink shadow-[inset_0_0_0_1.5px_var(--pz-line)] outline-none placeholder:text-ink-soft/80 focus:shadow-[inset_0_0_0_2px_var(--pz-action)] [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => applyFilter("")}
                  aria-label={labels.clear}
                  className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-sunk"
                >
                  <X aria-hidden weight="bold" className="size-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={surprise}
              aria-label={labels.surprise}
              title={labels.surprise}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-action text-on-action shadow-[0_10px_24px_-12px_var(--pz-action)] transition-transform active:scale-95 md:hidden"
            >
              <DiceFive aria-hidden weight="bold" className="size-6" />
            </button>
          </div>

          <nav aria-label={labels.tabs} className="min-w-0 flex-1">
            <ul
              ref={tabsRef}
              onScroll={(e) => markEdges(e.currentTarget)}
              className="tab-rail relative flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute left-0 top-0 h-full rounded-full bg-ink opacity-0 transition-[transform,width] duration-250 ease-[var(--ease-soft)]"
              />
              {MENU.filter((s) => visible.includes(s.id)).map((s) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => jump(e, s.id)}
                    data-tab={s.id}
                    aria-current={active === s.id ? "true" : undefined}
                    className="relative z-10 inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-[0.95rem] font-semibold text-ink-soft transition-colors duration-300 hover:text-ink aria-[current=true]:text-bg"
                  >
                    {s.title[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" onClick={surprise} className="btn btn-ghost hidden shrink-0 md:inline-flex">
            <DiceFive aria-hidden weight="bold" className="size-5" />
            {labels.surprise}
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {query ? (count === 1 ? labels.resultsOne : labels.resultsMany.replace("{n}", String(count))) : ""}
      </p>

      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto max-w-md transition-all duration-300 ease-[var(--ease-spring)] ${pick ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      >
        {pick && (
          <div className="card relative overflow-hidden p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setPick(null)}
              aria-label={labels.close}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full hover:bg-sunk"
            >
              <X aria-hidden weight="bold" className="size-5" />
            </button>
            <p className="text-kicker text-gold-ink">{labels.surpriseTitle}</p>
            <p
              className={`mt-3 font-display text-3xl font-bold tracking-tight ${pick.spinning ? "opacity-60" : "animate-[pz-rise_400ms_var(--ease-spring)_both]"}`}
            >
              {pick.item.name[lang]}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {pick.label}
              {pick.item.price ? ` · ${pick.item.price} ${labels.currency}` : ""}
            </p>
            {!pick.spinning && pick.item.ingredients && (
              <p className="mt-3 font-serif text-lg italic text-ink-soft">{pick.item.ingredients[lang]}</p>
            )}
            {!pick.spinning && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={showPick} className="btn btn-primary min-h-11 py-2.5">
                  {labels.surpriseShow}
                </button>
                <button type="button" onClick={surprise} className="btn btn-ghost min-h-11 py-2.5">
                  <DiceFive aria-hidden weight="bold" className="size-5" />
                  {labels.surpriseAgain}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
