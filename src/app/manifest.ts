import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: "G. Sassano",
    description: profile.summary,
    start_url: "/",
    display: "browser",
    background_color: "#f3f0e8",
    theme_color: "#f3f0e8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
