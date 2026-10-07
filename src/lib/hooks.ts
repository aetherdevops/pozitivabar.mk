import { useSyncExternalStore } from "react";

// Client-only values without setState-in-effect: the server snapshot is used for the static HTML and
// hydration, then React switches to the live client value.

const never = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(never, () => true, () => false);
}

function everyHalfMinute(cb: () => void) {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
}

/** Re-reads `get` every 30 s. `get` must return a primitive so snapshots compare by value. */
export function useClock<T extends string | number | boolean | null>(get: () => T, server: T): T {
  return useSyncExternalStore(everyHalfMinute, get, () => server);
}

/** A value that is fixed once the page is loaded in a browser (e.g. derived from today's date). */
export function useClientValue<T extends string | number | boolean | null>(get: () => T, server: T): T {
  return useSyncExternalStore(never, get, () => server);
}

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function useTheme(): "day" | "night" {
  return useSyncExternalStore(
    subscribeTheme,
    () => (document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day"),
    () => "day",
  );
}
