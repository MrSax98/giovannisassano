import type { Profile } from "@/types/content";

/**
 * Single source of truth for identity, links and the canonical URL.
 * Change NEXT_PUBLIC_SITE_URL when a custom domain is connected.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://giovannisassano.vercel.app").replace(/\/$/, "");

export const profile: Profile = {
  name: "Giovanni Sassano",
  givenName: "Giovanni",
  familyName: "Sassano",
  role: "AI & Data Engineer",
  employer: {
    name: "Deloitte",
    unit: "Next Hub",
    url: "https://www.deloitte.com/it/it.html",
    since: "2025",
  },
  location: "Bari, Italy",
  origin: "Marsico Nuovo, Basilicata",
  email: "sassanogiovanni37@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/giovanni-sassano-565369119/",
    substack: "https://diariodiunosmarrito.substack.com/",
    github: "https://github.com/MrSax98",
  },
  summary:
    "Mathematician by training, AI & data engineer at Deloitte Next Hub, MSc candidate in Statistical Sciences at Sapienza. Stochastic models, retrieval systems, and the space between them.",
};

/** Facts shown as marginalia next to the About text. Keep them verifiable. */
export const facts: { k: string; v: string }[] = [
  { k: "Now", v: "AI & Data Engineer, Deloitte Next Hub, Bari · since 2025" },
  { k: "MSc", v: "Statistical Sciences, Sapienza University of Rome · in progress" },
  { k: "BSc", v: "Mathematics, University of Basilicata · thesis on Bell's theorem" },
  { k: "Certified", v: "Databricks Generative AI Engineer Associate · 2026" },
  { k: "Certified", v: "IBM, Basics of Quantum Information · 2026" },
  { k: "Before", v: "PLC automation for oil & gas plants, Val d'Agri · 2018–19" },
  { k: "Origin", v: "Marsico Nuovo, 788 m above sea level" },
];
