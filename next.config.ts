import type { NextConfig } from "next";

/**
 * Fully static export: the site is plain HTML/CSS/JS in `out/`,
 * deployable on any static host (Vercel, Cloudflare, GitHub Pages, Netlify).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
