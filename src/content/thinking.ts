import type { Inquiry, Writing } from "@/types/content";
import { profile } from "./profile";

/** Open questions. Short, specific, and each one something actually studied. */
export const inquiries: Inquiry[] = [
  {
    symbol: "∇f = Σλᵢ∇gᵢ",
    title: "Optimisation under constraints",
    body: "Duality, KKT and Fritz John conditions. Most of machine learning is a constrained problem that prefers not to mention it.",
  },
  {
    symbol: "dWₜ",
    title: "Stochastic processes",
    body: "Brownian motion as the honest default for not knowing, Itô calculus as its grammar, simulation as the way to check both.",
  },
  {
    symbol: "do(X = x)",
    title: "Causal inference",
    body: "The move from what correlates to what would happen if. Studying it formally this year, with a growing suspicion about most dashboards.",
  },
  {
    symbol: "min 𝔼[L(θ, δ)]",
    title: "Decisions under uncertainty",
    body: "Statistical decision theory: choose with an explicit loss function, instead of the implicit one every meeting uses.",
  },
  {
    symbol: "⟨ψ|φ⟩",
    title: "Quantum information",
    body: "Where my mathematics began. Probability that is not ignorance, and the inequality that proved it.",
  },
  {
    symbol: "π → π′",
    title: "Agent behaviour",
    body: "How populations of LLM agents drift from the norms they were given. An engineering problem that keeps turning into a philosophical one.",
  },
];

/** Published writing. Add an entry per article; the list renders newest first. */
export const writing: Writing[] = [
  {
    title: "Diario di uno smarrito",
    venue: "Substack",
    href: profile.links.substack,
    lang: "it",
    blurb:
      "Personal essays in Italian: on goals chosen versus inherited, on reading, on the strange discipline of paying attention.",
  },
  {
    title: "Articles on LinkedIn",
    venue: "LinkedIn",
    year: "2019–2024",
    href: `${profile.links.linkedin}recent-activity/articles/`,
    lang: "it",
    blurb: "Earlier pieces on technology and work, written between automation plants and data platforms.",
  },
];

/** How I study. A method, stated plainly. */
export const method = {
  title: "A method, not a motivation",
  body: [
    "I study as a working student, so the method has to survive tired evenings. Every course becomes a set of compendia written in my own words, then questions, then flashcards spaced at one, three, seven, fourteen and thirty days.",
    "The test is Feynman's: if I cannot explain it plainly at a whiteboard, I do not know it yet. The whiteboard is usually right.",
  ],
  schedule: [1, 3, 7, 14, 30],
};
