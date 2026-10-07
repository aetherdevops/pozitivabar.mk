"use client";

import { Coffee, Martini } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/hooks";

type Theme = "day" | "night";

const THEME_COLOR: Record<Theme, string> = { day: "#f4ecdd", night: "#0c1712" };

function syncThemeColor(t: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[t]);
}

/**
 * The Sunset switch. Day = cafe, night = bar. The knob position is pure CSS (driven by the root
 * data-theme set before paint), so there is no flash or jump on load; React only tracks aria state.
 */
export function ThemeToggle({ label, dayLabel, nightLabel }: { label: string; dayLabel: string; nightLabel: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  useEffect(() => syncThemeColor(theme), [theme]);

  function apply(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      sessionStorage.setItem("pz-theme", next);
    } catch {}
  }

  function toggle() {
    const next: Theme = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce || !ref.current) {
      apply(next);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => apply(next));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 780, easing: "cubic-bezier(.65,0,.25,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={theme === "night"}
      aria-label={label}
      title={theme === "night" ? nightLabel : dayLabel}
      onClick={toggle}
      className="theme-toggle group relative inline-flex h-11 w-[4.75rem] shrink-0 items-center rounded-full bg-sunk p-1 shadow-[inset_0_0_0_1px_var(--pz-line)] transition-colors"
    >
      <Coffee aria-hidden weight="bold" className="absolute left-3 size-4 text-ink-soft opacity-60" />
      <Martini aria-hidden weight="bold" className="absolute right-3 size-4 text-ink-soft opacity-60" />
      <span className="theme-knob relative z-10 grid size-9 place-items-center rounded-full bg-ink text-bg shadow-md transition-transform duration-500 ease-[var(--ease-spring)] group-active:scale-90">
        <Coffee aria-hidden weight="fill" className="theme-icon-day absolute size-[1.15rem] transition-all duration-500" />
        <Martini aria-hidden weight="fill" className="theme-icon-night absolute size-[1.15rem] transition-all duration-500" />
      </span>
    </button>
  );
}
