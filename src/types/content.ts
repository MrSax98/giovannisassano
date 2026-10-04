/**
 * Content model. Everything the site says lives in `src/content/*` and is
 * typed here, so adding a project or a note never requires touching UI code.
 */

export type LinkRef = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  givenName: string;
  familyName: string;
  role: string;
  employer: { name: string; unit: string; url: string; since: string };
  location: string;
  origin: string;
  email: string;
  links: {
    linkedin: string;
    substack: string;
    /** Leave null until you have a public profile: the UI hides it. */
    github: string | null;
  };
  /** One sentence, used for <meta description> and social cards. */
  summary: string;
};

export type ExpertiseNode = {
  id: string;
  label: string;
  /** Cluster drives colour and grouping in the graph. */
  cluster: "math" | "stats" | "ml" | "eng";
  /** Coordinates in a 100 x 62 design space (golden ratio canvas). */
  x: number;
  y: number;
  detail: string;
  tools?: string[];
};

export type ExpertiseEdge = [from: string, to: string];

export type GlyphKind = "gbm" | "rl" | "agents" | "bell" | "rag" | "optim";

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  context: "Work" | "Research" | "Academic" | "Personal R&D";
  summary: string;
  problem: string;
  approach: string[];
  stack: string[];
  /** Only state results you can defend. Leave undefined otherwise. */
  outcome?: string;
  links?: LinkRef[];
  glyph: GlyphKind;
  /** Optional mathematical "signature" shown on the detail page. */
  formula?: string;
};

export type Writing = {
  title: string;
  venue: string;
  year?: string;
  href: string;
  lang: "it" | "en";
  blurb: string;
};

export type Inquiry = {
  symbol: string;
  title: string;
  body: string;
};

export type NowItem = {
  verb: "Studying" | "Building" | "Reading" | "Working with" | "Serving as";
  what: string;
  note?: string;
};

export type Shelf = { label: string; count: number };
