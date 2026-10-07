"use client";

import { useRef } from "react";

/** Pointer-follow 3D tilt with a soft glare. Mouse only; skipped with reduced motion. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 9).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 11).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
    el.dataset.active = "1";
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.active;
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`tilt relative h-full transition-transform duration-300 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className ?? ""}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] opacity-0 mix-blend-soft-light transition-opacity duration-300 [[data-active]>&]:opacity-100"
        style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,30%), rgb(255 255 255 / .55), transparent 55%)" }}
      />
    </div>
  );
}
