# Eugene Kipchirchir Koech · Portfolio

A fast, static portfolio. Live at [kipchirchirkoech.co.ke](https://kipchirchirkoech.co.ke).

- **Prerendered HTML.** The page is rendered to static HTML at build time and hydrated in the browser, so content shows before any JavaScript runs.
- **A live neural network in the hero.** A small MLP (2 → 10 → 10 → 1, tanh, Adam) trains in the browser. Backpropagation is hand-written in `src/lib/mlp.ts`, with no ML libraries. Click the canvas to add points.
- **A terminal.** Press `/`, `` ` `` or `⌘K`. Commands include `help`, `projects`, `learning` and `go run main.go`, and it understands simple questions.
- Dark and light themes, CSS-only scroll reveals, and support for reduced motion.

## Editing content

All content lives in [`src/data/profile.ts`](src/data/profile.ts): projects, experience, learning log, stats and toolbox.

## Commands

```sh
bun install
bun run dev       # dev server
bun run build     # typecheck, client build, SSR build, prerender into dist/
bun run preview   # serve dist/
bun run lint
```

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, self-hosted fonts (Inter, JetBrains Mono, Instrument Serif). Deployed on Vercel.
