import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes a plain HTML/CSS/JS site to `out/`.
  // This keeps hosting portable — Cloudflare Pages, Netlify or GitHub Pages
  // can all serve `out/` with no server runtime.
  output: "export",

  // Static export has no image optimization server, so images are served as-is.
  images: { unoptimized: true },
};

export default nextConfig;
