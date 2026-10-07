import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Позитива Бар",
    short_name: "Позитива",
    description: "Кафе преку ден, бар преку ноќ. Ѓорче Петров 3/1, Скопје.",
    lang: "mk",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ecdd",
    theme_color: "#0c1712",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
