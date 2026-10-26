# AGENTS.md

This repository is a **static** single-page portfolio: **Vite + React + TypeScript** (ESM) with **Tailwind CSS**. It is prerendered to HTML at build time. There is no backend.

This file is intended for agentic coding assistants. Follow it when making changes.

## Quick Facts

- Runtime: browser (React 19), single page with no router
- Build tool: Vite, plus an SSR build and `scripts/prerender.mjs` that writes static HTML into `dist/index.html`
- Typecheck: `tsc -b` (project references)
- Lint: ESLint (flat config)
- Styling: Tailwind CSS v4 + `clsx`/`tailwind-merge` helper (`cn`)
- Content: `src/data/profile.ts`

## Commands (Build / Lint / Test)

### Install

- `bun install`

### Dev server

- `bun run dev`

### Production build

- `bun run build`
  - Runs `tsc -b`, `vite build`, an SSR build of `src/entry-server.tsx` into `dist-ssr/`, then `node scripts/prerender.mjs`, which injects the rendered HTML into `dist/index.html` at `<!--app-html-->` and deletes `dist-ssr/`.

### Preview production build

- `npm run preview`

### Lint

- `npm run lint`
  - Runs `eslint .` using `eslint.config.js`.

### Typecheck only

- `npx tsc -b --pretty false`

### Tests

There is **no test runner configured** in this repo (no `vitest`, `jest`, `playwright`, etc.).

If tests are added later, update this section with:

- `npm test`
- how to run a single test file
- how to run a single test by name

For now, validate changes with:

- `npm run lint`
- `npx tsc -b --pretty false`
- `npm run build`

## Project Layout

- `index.html` page shell, meta tags, theme bootstrap script, `<!--app-html-->` placeholder
- `scripts/prerender.mjs` build-time prerender step
- `src/`
  - `src/main.tsx` client entry (hydrates prerendered HTML; renders from scratch in dev)
  - `src/entry-server.tsx` SSR entry used only by the prerender step
  - `src/App.tsx` page composition
  - `src/data/profile.ts` all site content
  - `src/components/` page sections (`Hero`, `Work`, `Lab`, `Experience`, `Contact`, `Terminal`, `NeuralPlayground`, …)
  - `src/hooks/` React hooks (`use-theme.ts`)
  - `src/lib/` utilities: `mlp.ts` (neural net), `terminal-commands.tsx`, `terminal-store.ts`, `go-snippet.ts`, `utils.ts`

## Code Style (TypeScript / React)

### Formatting

- Existing files mix semicolons/no-semicolons; prefer **match the file** you’re editing.
- Prefer **2-space indentation**, as shown in the codebase.
- Keep JSX readable; break large prop lists over multiple lines.

### Imports

Use this ordering (match existing patterns):

1. React imports
2. Third-party libs (e.g. `lucide-react`)
3. App imports via alias `@/…` (preferred)
4. Relative imports (`./…`) and CSS last

Notes:

- The repo supports path alias `@/*` → `src/*` (see `tsconfig.json` and `vite.config.ts`).
- Prefer importing types with `type` modifiers:
  - `import { foo, type Foo } from "…";`

### Naming conventions

- Components: `PascalCase` (e.g. `AdminPage`, `ThemeToggle`).
- Hooks: `useXxx` (e.g. `useAuth`, `useCurrentUser`).
- Files:
  - React components/pages: `PascalCase.tsx` is used in `src/pages/`.
  - Utilities: `kebab-case.ts` is used in `src/lib/` (e.g. `blog-types.ts`).
- Constants: `SCREAMING_SNAKE_CASE` for module-level constants (e.g. storage keys).

### Types

- Prefer explicit return types for exported helpers when non-trivial.
- Avoid `any`; use `unknown` + narrowing when needed.
- Use union string literals for small state machines (e.g. theme: `"light" | "dark"`).

### React patterns

- Prefer functional components.
- Prefer `useCallback` when passing handlers deeply or when referenced in deps.
- Prefer `useSyncExternalStore` for external synchronous stores (see `src/hooks/use-theme.ts`, `src/lib/terminal-store.ts`).
- Use `useEffect` for DOM side effects and subscriptions; always clean up.

### State and persistence

- Local storage is used only for the theme (`src/hooks/use-theme.ts` and the inline script in `index.html`).

If you change storage formats:

- Provide a migration or tolerate older values (guard `JSON.parse` with try/catch).

### Styling

- Use Tailwind class strings.
- For conditional class names, use `cn` from `src/lib/utils.ts`.
- Avoid introducing new styling libraries unless necessary.

### Prerendering / hydration

- Components render on the server (Node) during the build. Do not touch `window`, `document` or `localStorage` during render; use effects.
- Values that differ between server and client (time, theme) must render a stable placeholder first (see `NairobiClock`, and `useTheme`'s server snapshot).

## Error Handling Guidelines

- Prefer user-safe error messages at UI boundaries; avoid leaking raw server errors.
- Use `try/catch` around:
  - `JSON.parse` of localStorage values
  - clipboard/network operations
- When catching errors:
  - If failure is non-critical (e.g. localStorage unavailable), swallow safely.
  - Otherwise rethrow a new `Error` with a helpful message.

## Environment Variables

None. The site is fully static.

## Do / Don’t For Agents

- Do keep changes focused and consistent with nearby code.
- Do prefer `@/…` imports over long relatives.
- Do run at least `npm run lint` + `npx tsc -b` for validation.
- Don’t add heavy dependencies without a clear requirement.
- Don’t introduce a test runner unless requested; if you do, update this file.

## Cursor / Copilot Rules

No Cursor rules found (`.cursorrules` or `.cursor/rules/`).
No Copilot instructions found (`.github/copilot-instructions.md`).

If such files are added later, mirror any relevant constraints here.
