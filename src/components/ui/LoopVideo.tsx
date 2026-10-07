"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; poster: string; className?: string; width: number; height: number };

/**
 * Muted decorative loop. The poster is attached only when the video nears the viewport (browsers
 * fetch posters eagerly, which would compete with the hero image), the file only when it is on
 * screen, and nothing plays with reduced motion.
 */
export function LoopVideo({ src, poster, className, width, height }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        v.poster = poster;
        near.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    const onScreen = new IntersectionObserver(
      ([e]) => {
        if (reduce) return;
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.src = src;
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.25 },
    );
    near.observe(v);
    onScreen.observe(v);
    return () => {
      near.disconnect();
      onScreen.disconnect();
    };
  }, [src, poster]);

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
