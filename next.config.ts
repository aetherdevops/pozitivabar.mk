import type { NextConfig } from "next";

// Static export: `next build` writes a plain HTML/CSS/JS site to out/ for zemi.mk shared hosting.
// cacheComponents / partialPrefetching are intentionally absent: they cannot be combined with export.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
