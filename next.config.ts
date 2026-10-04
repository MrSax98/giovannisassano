import type { NextConfig } from "next";

/**
 * Fully static export: the site is plain HTML/CSS/JS in `out/`,
 * deployable on any static host (Vercel, Cloudflare, GitHub Pages, Netlify).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
