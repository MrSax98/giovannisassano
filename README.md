# giovannisassano

Personal website of **Giovanni Sassano**: mathematician by training, AI & data engineer at Deloitte Next Hub, MSc candidate in Statistical Sciences at Sapienza.

The site uses mathematics as its visual language. Every figure is computed live and has a numbered caption, the way a paper would print it:

| Fig. | What it shows                                                                                   | Where               |
| ---- | ----------------------------------------------------------------------------------------------- | ------------------- |
| 1    | Random walks converging to a normal density (central limit theorem); the pointer sets the drift | Hero, Canvas 2D     |
| 2    | Expertise as a dependency graph                                                                 | Expertise, SVG      |
| 3    | Interactive gradient descent on a two-basin landscape (marching-squares contours)               | Thinking, Canvas 2D |
| 4    | Retention under spaced repetition, R(t) = exp(−t/S)                                             | Thinking, SVG       |
| 5    | The personal library as a unit chart, one mark per book                                         | Beyond data, SVG    |

Each project also has a seeded "signature plot" (GBM paths, PPO learning curve, agent graph, Bell correlation, k-NN retrieval).

## Stack

- **Next.js 16** (App Router) with `output: "export"`: the site is static HTML/CSS/JS, deployable anywhere.
- **TypeScript** (strict, `noUncheckedIndexedAccess`).
- **Tailwind CSS 4** with design tokens as CSS variables (light and dark themes).
- **Motion** for reveals, layout transitions, springs. **Lenis** for inertial scrolling on desktop only.
- **Canvas 2D and SVG** for figures. No D3, no Three.js: every figure is under 300 lines of plain TypeScript.
- Fonts self-hosted from `src/fonts` (Instrument Serif, Hanken Grotesk, JetBrains Mono, OFL).

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + production build
npm run build      # static export into out/
npm start          # serve out/ locally
npm run format     # prettier
```

Node 20.9+ (see `.nvmrc`).

## Structure

```text
src/
├── app/              routes, metadata, sitemap, robots, manifest, /og.png, 404
├── sections/         one file per home-page section (Hero, About, Expertise, ...)
├── components/       reusable UI: Nav, Reveal, SplitText, Magnetic, Cursor, Figure, ...
├── visualizations/   the figures (canvas and SVG), pure and self-contained
├── animations/       motion vocabulary (variants, easing) and hooks (reduced motion, theme)
├── content/          ALL text and data: edit these files to update the site
├── lib/              math (marching squares, moments), seeded RNG, JSON-LD
├── types/            content model
└── fonts/            self-hosted woff2
scripts/sync-github.mjs   optional: pulls public repos at build time
docs/PROGETTO.md          design and technical rationale (Italian)
```

## Updating content

| To change                                       | Edit                       |
| ----------------------------------------------- | -------------------------- |
| Name, links, email, facts                       | `src/content/profile.ts`   |
| Projects (each one becomes `/projects/<slug>/`) | `src/content/projects.ts`  |
| Expertise graph                                 | `src/content/expertise.ts` |
| Open questions, writing, method                 | `src/content/thinking.ts`  |
| Now section (update the date too)               | `src/content/now.ts`       |
| Library, favourites, personal notes             | `src/content/beyond.ts`    |

GitHub repositories: set `GITHUB_USERNAME` (and optionally `GITHUB_TOKEN`) in Vercel's environment variables; the next build lists your best six public repos under Projects. Without it, nothing is shown and nothing breaks. Then set `links.github` in `profile.ts`.

## Deployment

Vercel, connected to this GitHub repository: every push to `main` deploys production, every pull request gets a preview URL. CI (`.github/workflows/ci.yml`) runs typecheck, lint, format check and build on every push. Full instructions in `docs/PROGETTO.md`.

Environment variables (all optional, see `.env.example`): `NEXT_PUBLIC_SITE_URL`, `GITHUB_USERNAME`, `GITHUB_TOKEN`, `NEXT_PUBLIC_ENABLE_ANALYTICS`.

## License

Code: MIT. Text and figures: © Giovanni Sassano, all rights reserved.
