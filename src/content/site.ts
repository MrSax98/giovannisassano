/** Section index. Order here = order on the page = order in the navigation. */
export const sections = [
  { id: "about", label: "About", n: "01" },
  { id: "expertise", label: "Expertise", n: "02" },
  { id: "projects", label: "Projects", n: "03" },
  { id: "thinking", label: "Thinking", n: "04" },
  { id: "now", label: "Now", n: "05" },
  { id: "beyond", label: "Beyond data", n: "06" },
  { id: "contact", label: "Contact", n: "07" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
