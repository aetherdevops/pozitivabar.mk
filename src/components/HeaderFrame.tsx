"use client";

import { useEffect, useRef, useState } from "react";

/** Fixed header that turns solid after scrolling and tucks away while scrolling down. */
export function HeaderFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        const focusInside = ref.current?.contains(document.activeElement);
        const navOpen = !!document.documentElement.dataset.navOpen;
        const pin = document.querySelector<HTMLElement>("[data-header-pin]");
        if (pin) {
          // A page with its own sticky bar (the menu): stay tucked away while that bar is pinned.
          setHidden(pin.getBoundingClientRect().top < (ref.current?.offsetHeight ?? 64) + 24 && !focusInside && !navOpen);
        } else if (y > 480 && y > last + 6 && !focusInside && !navOpen) setHidden(true);
        else if (y < last - 6 || y < 480) setHidden(false);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled={scrolled}
      data-hidden={hidden}
      className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-300 ease-out data-[hidden=true]:-translate-y-full data-[scrolled=true]:bg-bg/85 data-[scrolled=true]:shadow-[0_1px_0_var(--pz-line)] data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
