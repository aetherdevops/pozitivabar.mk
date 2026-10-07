"use client";

import { Check, Copy, MapPin } from "@phosphor-icons/react";
import { useState } from "react";
import { useClock } from "@/lib/hooks";
import { isOpenAt, skopjeNow } from "@/lib/time";

export function CopyAddress({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        } catch {}
      }}
      className="btn btn-ghost"
    >
      {copied ? <Check aria-hidden weight="bold" className="size-5 text-brand" /> : <Copy aria-hidden weight="bold" className="size-5" />}
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}

type HoursProps = {
  days: string[];
  hours: string;
  today: string;
  status: { open: string; closed: string };
};

/** Weekly hours; today's row is highlighted with a live open/closed badge (Skopje time). */
export function HoursTable({ days, hours, today, status }: HoursProps) {
  const snap = useClock<string | null>(() => `${skopjeNow().weekday}|${isOpenAt() ? 1 : 0}`, null);
  const state = snap ? { day: Number(snap.split("|")[0]), open: snap.endsWith("|1") } : null;

  return (
    <table className="w-full text-[0.975rem]">
      <tbody>
        {days.map((d, i) => {
          const isToday = state?.day === i;
          return (
            <tr
              key={d}
              aria-current={isToday ? "date" : undefined}
              className="border-b border-line last:border-0 aria-[current=date]:font-semibold"
            >
              <th scope="row" className="py-2.5 pr-4 text-left font-[inherit]">
                <span className="inline-flex items-center gap-2">
                  {d}
                  {isToday && (
                    <span className="rounded-full bg-sunk px-2 py-0.5 text-xs font-semibold text-ink-soft">{today}</span>
                  )}
                </span>
              </th>
              <td className="tabular py-2.5 text-right">
                {isToday ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className={`live-dot ${state.open ? "text-brand" : "text-gold"}`} />
                    <span className="sr-only">{state.open ? status.open : status.closed}, </span>
                    {hours}
                  </span>
                ) : (
                  hours
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Click-to-load Google map (no third-party requests until asked). */
export function MapCard({ embed, title, show, note }: { embed: string; title: string; show: string; note: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[var(--radius-card)] bg-sunk shadow-[var(--pz-shadow)]">
      {on ? (
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-ink/15" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
            <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
              <path d="M-20 210 C 80 190, 160 230, 260 170 S 380 120, 430 140" />
              <path d="M120 -20 L 170 320" strokeWidth="7" />
              <path d="M-20 80 L 430 110" strokeWidth="5" />
              <path d="M300 -20 C 280 80, 320 200, 290 320" strokeWidth="6" />
            </g>
            <g fill="currentColor" opacity=".5">
              <rect x="20" y="20" width="70" height="40" rx="6" />
              <rect x="200" y="20" width="80" height="60" rx="6" />
              <rect x="20" y="240" width="80" height="50" rx="6" />
              <rect x="320" y="200" width="70" height="80" rx="6" />
            </g>
          </svg>
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
            <span className="relative grid size-14 place-items-center rounded-full bg-action text-on-action shadow-lg">
              <MapPin aria-hidden weight="fill" className="size-7" />
              <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-action/40" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6">
            <button type="button" onClick={() => setOn(true)} className="btn btn-ghost bg-surface">
              {show}
            </button>
            <p className="text-xs text-ink-soft">{note}</p>
          </div>
        </>
      )}
    </div>
  );
}
