import images from "@/content/images.json";
import { skopjeSun } from "./time";

// Server-only: the inline, render-blocking <head> script.
// 1. marks JS as available (html.js) so scroll reveals may hide content until it scrolls in;
// 2. sets data-theme before first paint: night after the computed Skopje sunset (or the visitor's
//    choice for this browser session), so there is no light/dark flash;
// 3. on the home pages, preloads the hero photo for that theme at high priority (it is the LCP).
const srcset = (name: "hero-day" | "hero-night") =>
  images[name].widths.map((w) => `/img/${name}-${w}.avif ${w}w`).join(", ");

export const THEME_SCRIPT = `(function(){var r=document.documentElement;r.classList.add("js");try{var sun=${skopjeSun.toString()};var n=Date.now(),s=sun(n),d=new Date(n),m=d.getUTCHours()*60+d.getUTCMinutes();var t=(m<s[0]||m>=s[1])?"night":"day";try{var o=sessionStorage.getItem("pz-theme");if(o==="day"||o==="night")t=o}catch(e){}r.setAttribute("data-theme",t);var p=location.pathname;if(p==="/"||p==="/en/"||p==="/en"){var l=document.createElement("link");l.rel="preload";l.as="image";l.type="image/avif";l.setAttribute("imagesrcset",t==="night"?${JSON.stringify(srcset("hero-night"))}:${JSON.stringify(srcset("hero-day"))});l.setAttribute("imagesizes","(min-width: 1024px) 25rem, 90vw");l.setAttribute("fetchpriority","high");document.head.appendChild(l)}}catch(e){}})();`;
