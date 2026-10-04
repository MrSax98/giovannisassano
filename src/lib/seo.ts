import { profile, siteUrl } from "@/content/profile";
import { stack } from "@/content/expertise";

/** schema.org Person, rendered as JSON-LD in the root layout. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.summary,
    worksFor: {
      "@type": "Organization",
      name: `${profile.employer.name} ${profile.employer.unit}`,
      url: profile.employer.url,
    },
    homeLocation: { "@type": "Place", name: profile.location },
    birthPlace: { "@type": "Place", name: profile.origin },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Università degli Studi della Basilicata" },
      { "@type": "CollegeOrUniversity", name: "Sapienza Università di Roma" },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Databricks Certified Generative AI Engineer Associate",
      },
      { "@type": "EducationalOccupationalCredential", name: "IBM Basics of Quantum Information" },
    ],
    knowsAbout: [
      "Mathematics",
      "Probability",
      "Statistics",
      "Stochastic processes",
      "Mathematical optimization",
      "Machine learning",
      "Retrieval-augmented generation",
      "Data engineering",
      ...stack,
    ],
    sameAs: [profile.links.linkedin, profile.links.substack, profile.links.github].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: siteUrl,
    inLanguage: "en",
    author: { "@type": "Person", name: profile.name },
  };
}
