"use client";

import { ArrowsClockwise } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Word } from "@/content/words";
import { useClientValue } from "@/lib/hooks";

const GLYPHS = "АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ#%&*@";

type Props = { words: Word[]; next: string; noun: string };

/** Dictionary card. Today's entry is picked by date; "next" scrambles the headword into the new one. */
export function WordOfDay({ words, next, noun }: Props) {
  // Today's entry rotates by calendar day; the static HTML shows the first entry.
  const today = useClientValue(() => Math.floor(Date.now() / 864e5) % words.length, 0);
  const [clicks, setClicks] = useState(0);
  const [scramble, setScramble] = useState<string | null>(null);
  const raf = useRef(0);
  const i = (today + clicks) % words.length;
  const shown = scramble ?? words[i].word;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function go() {
    const n = (i + 1) % words.length;
    setClicks((c) => c + 1);
    const target = words[n].word.toUpperCase();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now();
    const dur = 520;
    cancelAnimationFrame(raf.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const settled = Math.floor(p * target.length);
      let s = target.slice(0, settled);
      for (let k = settled; k < target.length; k++) s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      setScramble(p < 1 ? s : null);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  const w = words[i];
  return (
    <div className="card relative overflow-hidden p-7 sm:p-10">
      <p className="sr-only" aria-live="polite">
        {w.word}, {noun}: {w.definition}
      </p>
      <div aria-hidden="true" key={clicks} className="min-h-[13rem] animate-[pz-rise_520ms_var(--ease-soft)_both] sm:min-h-[12.5rem]">
        <p className="font-display text-[clamp(2.3rem,6vw,4rem)] font-extrabold uppercase leading-none tracking-tight text-ink">
          {shown}
        </p>
        <p className="mt-3 font-serif text-lg italic text-gold-ink">
          [{w.syllables}] · {noun}
        </p>
        <p className="mt-6 max-w-[34ch] font-serif text-[clamp(1.35rem,2.3vw,1.85rem)] italic leading-snug text-ink">
          {w.definition}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
        <span className="tabular text-sm font-semibold text-ink-soft">
          {i + 1} / {words.length}
        </span>
        <button type="button" onClick={go} className="btn btn-ghost min-h-11 py-2.5">
          <ArrowsClockwise aria-hidden weight="bold" className="size-5 transition-transform duration-500 [button:active_&]:rotate-180" />
          {next}
        </button>
      </div>
    </div>
  );
}
