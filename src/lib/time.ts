import { CLOSE_HOUR, OPEN_HOUR } from "@/content/site";

/**
 * Sunrise and sunset in Skopje as UTC minutes after midnight (NOAA approximation, ~2 min error).
 * Must stay self-contained (no outer references): it is also inlined into the pre-paint theme
 * script via Function.prototype.toString().
 */
export function skopjeSun(ms: number): [number, number] {
  const d = new Date(ms);
  const doy = Math.floor((ms - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
  const g = ((2 * Math.PI) / 365) * (doy - 1);
  const eq =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = (42.0 * Math.PI) / 180;
  const ha =
    (Math.acos(Math.cos((90.833 * Math.PI) / 180) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)) * 180) /
    Math.PI;
  return [720 - 4 * (21.37 + ha) - eq, 720 - 4 * (21.37 - ha) - eq];
}

export function isNightAt(ms: number): boolean {
  const [rise, set] = skopjeSun(ms);
  const d = new Date(ms);
  const m = d.getUTCHours() * 60 + d.getUTCMinutes();
  return m < rise || m >= set;
}

const skopjeClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Skopje",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "18:08" for a given count of UTC minutes on the day of `ms`, shown in Skopje time. */
export function skopjeClockAt(ms: number, utcMinutes: number): string {
  const d = new Date(ms);
  const at = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, Math.round(utcMinutes));
  return skopjeClock.format(at);
}

/** Current hour/minute/weekday in Skopje (weekday: 0 = Monday). */
export function skopjeNow(ms = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Skopje",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(ms);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return { hour: Number(get("hour")), minute: Number(get("minute")), weekday: Math.max(0, days.indexOf(get("weekday"))) };
}

export function isOpenAt(ms = Date.now()): boolean {
  const { hour } = skopjeNow(ms);
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

