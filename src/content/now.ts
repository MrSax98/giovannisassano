import type { NowItem } from "@/types/content";

/**
 * The "Now" page convention (nownownow.com): what has my attention this season.
 * Update `updated` every time you edit the list; the UI shows how old it is.
 */
export const now = {
  updated: "2026-10-04",
  place: "Bari",
  items: [
    {
      verb: "Studying",
      what: "Causal inference, statistical decision theory, forecasting methods",
      note: "MSc courses at Sapienza, taken as a working student",
    },
    {
      verb: "Working with",
      what: "BigQuery, Vertex AI and Looker",
      note: "New in the toolbox this autumn, next to Databricks",
    },
    {
      verb: "Reading",
      what: "Homer's Odyssey, in Privitera's translation",
      note: "Greek on the left page, Italian on the right, patience in between",
    },
    {
      verb: "Serving as",
      what: "Treasurer, Rotaract Club Val d'Agri",
      note: "Rotary year 2026–27",
    },
    {
      verb: "Building",
      what: "This website",
      note: "In public, one commit at a time",
    },
  ] satisfies NowItem[],
};
