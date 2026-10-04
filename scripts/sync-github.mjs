/**
 * Optional build step: pulls public, non-fork repositories for GITHUB_USERNAME
 * into src/content/github.json, which the Projects section renders.
 * Without the variable (or without network) it leaves the file untouched,
 * so the build never fails because of GitHub.
 */
import { writeFile, readFile } from "node:fs/promises";

const user = process.env.GITHUB_USERNAME?.trim();
const out = new URL("../src/content/github.json", import.meta.url);

if (!user) {
  console.log("[sync-github] GITHUB_USERNAME not set, skipping.");
  process.exit(0);
}

try {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos = (await res.json())
    .filter((r) => !r.fork && !r.archived && !r.private && r.description)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      updated: r.pushed_at,
    }));
  await writeFile(out, JSON.stringify(repos, null, 2) + "\n");
  console.log(`[sync-github] wrote ${repos.length} repositories.`);
} catch (err) {
  const existing = await readFile(out, "utf8").catch(() => "[]");
  console.warn(`[sync-github] ${err.message}; keeping existing data (${JSON.parse(existing).length} repos).`);
}
