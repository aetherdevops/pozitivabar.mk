"use client";

import { useState } from "react";
import { useClientValue, useClock } from "@/lib/hooks";
import { isOpenAt, skopjeClockAt, skopjeSun } from "@/lib/time";

const fill = (s: string, t: string) => s.replace("{t}", t);

/** "Bad mood ...... 0 ден" with a rubber stamp that lands after load and re-stamps on hover/tap. */
export function FauxLine({ item, price, stamp }: { item: string; price: string; stamp: string }) {
  const [k, setK] = useState(0);
  return (
    <div
      onPointerEnter={() => setK((n) => n + 1)}
      className="relative mt-8 max-w-md select-none"
    >
      <div
        key={k}
        className="flex items-baseline rounded-2xl bg-surface px-5 py-4 shadow-[var(--pz-shadow)]"
        style={{ animation: `pz-thud 420ms ease ${k === 0 ? "1.25s" : "0s"} both` }}
      >
        <span className="font-display text-[0.95rem] font-semibold sm:text-base">{item}</span>
        <span className="leader" aria-hidden="true" />
        <span className="tabular font-display text-[0.95rem] font-semibold sm:text-base">{price}</span>
        <span
          className="rubber-stamp absolute -top-3 right-2 whitespace-nowrap sm:-right-4 rounded-lg border-[3px] border-current px-2.5 py-0.5 font-display text-sm font-extrabold tracking-wider sm:text-base"
          style={{ animation: `pz-stamp 480ms var(--ease-spring) ${k === 0 ? "1.1s" : "0s"} both` }}
        >
          {stamp}
        </span>
      </div>
    </div>
  );
}

type StatusLabels = { open: string; closed: string; until: string; opensAt: string; everyDay: string };

/** Live open/closed chip computed in Skopje time; static fallback text before hydration. */
export function OpenStatus({ labels }: { labels: StatusLabels }) {
  const open = useClock<boolean | null>(() => isOpenAt(), null);
  return (
    <span className="chip">
      <span aria-hidden="true" className={`live-dot ${open === false ? "text-gold" : "text-brand"}`} />
      <span>
        {open === null ? labels.everyDay : open ? `${labels.open} · ${labels.until}` : `${labels.closed} · ${labels.opensAt}`}
      </span>
    </span>
  );
}

/** Today's real Skopje sunset (day theme) or next sunrise (night theme). */
export function SunLine({ sunset, sunrise }: { sunset: string; sunrise: string }) {
  // "18:08|06:38" (today's sunset | next sunrise), computed in the browser only.
  const times = useClientValue<string | null>(() => {
    const now = Date.now();
    const [, set] = skopjeSun(now);
    const d = new Date(now);
    const m = d.getUTCHours() * 60 + d.getUTCMinutes();
    const riseDay = m >= set ? now + 864e5 : now;
    return `${skopjeClockAt(now, set)}|${skopjeClockAt(riseDay, skopjeSun(riseDay)[0])}`;
  }, null);
  const [setAt, riseAt] = times ? times.split("|") : ["", ""];
  const txt = times ? { day: fill(sunset, setAt), night: fill(sunrise, riseAt) } : null;
  return (
    <p className="mx-auto mt-7 min-h-[1.5em] max-w-[26rem] text-center font-serif text-lg italic text-ink-soft">
      {txt && (
        <>
          <span className="only-day">{txt.day}</span>
          <span className="only-night">{txt.night}</span>
        </>
      )}
    </p>
  );
}
