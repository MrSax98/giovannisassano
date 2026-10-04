import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { profile, siteUrl } from "@/content/profile";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import "./globals.css";

/*
 * Fonts are self-hosted from src/fonts (SIL Open Font License): no request to
 * Google at runtime or build time, no layout shift (next/font sizes fallbacks).
 */
const serif = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});
const sans = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const mono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

const title = `${profile.name} · Mathematics, statistics, AI engineering`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: profile.summary,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Giovanni Sassano",
    "AI engineer",
    "data engineer",
    "statistician",
    "mathematician",
    "RAG",
    "stochastic processes",
    "Bari",
    "Deloitte Next Hub",
    "Sapienza",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: profile.name,
    title,
    description: profile.summary,
    locale: "en_GB",
    firstName: profile.givenName,
    lastName: profile.familyName,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: `${profile.name}: random walks converging to a normal density` },
    ],
  },
  twitter: { card: "summary_large_image", title, description: profile.summary, images: ["/og.png"] },
  robots: { index: true, follow: true },
  formatDetection: { email: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0d" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Runs before paint: applies a stored theme choice without a flash. */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1";
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd(), websiteJsonLd()]) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Cursor />
        {analytics && <Analytics />}
      </body>
    </html>
  );
}
