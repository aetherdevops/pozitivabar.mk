"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useRef } from "react";

/** Horizontal photo rail: native touch scroll, mouse drag, and arrow buttons for keyboard users. */
export function Rail({ children, prev, next }: { children: React.ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const by = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 480), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 pt-4 [scrollbar-width:none] md:px-[max(2rem,calc((100vw-77.5rem)/2+3rem))] data-[dragging]:cursor-grabbing data-[dragging]:snap-none [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = ref.current;
          if (!d || !el) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 6) {
            d.moved = true;
            el.dataset.dragging = "1";
          }
          if (d.moved) el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current = null;
          if (ref.current) delete ref.current.dataset.dragging;
        }}
        onPointerLeave={() => {
          drag.current = null;
          if (ref.current) delete ref.current.dataset.dragging;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <div className="container-pz -mt-2 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => by(-1)} aria-label={prev} className="grid size-12 place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--pz-line)] transition hover:-translate-x-0.5">
          <ArrowLeft aria-hidden weight="bold" className="size-5" />
        </button>
        <button type="button" onClick={() => by(1)} aria-label={next} className="grid size-12 place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--pz-line)] transition hover:translate-x-0.5">
          <ArrowRight aria-hidden weight="bold" className="size-5" />
        </button>
      </div>
    </div>
  );
}
