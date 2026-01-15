# AGENTS.md

This repository is a **Vite + React + TypeScript** app (ESM) with **Tailwind CSS** and a **Convex** backend (see `convex/`).

This file is intended for agentic coding assistants. Follow it when making changes.

## Quick Facts

- Runtime: browser (React 19, React Router v7)
- Build tool: Vite
- Typecheck: `tsc -b` (project references)
- Lint: ESLint (flat config)
- Styling: Tailwind CSS v4 + `clsx`/`tailwind-merge` helper (`cn`)
- Backend: Convex functions + Better Auth integration

## Commands (Build / Lint / Test)

### Install

- `bun install`

### Dev server

- `bun run dev`

### Production build

- `bun run build`
  - Runs `tsc -b` then `vite build`.

### Preview production build

- `npm run preview`

### Lint

- `npm run lint`
  - Runs `eslint .` using `eslint.config.js`.

### Typecheck only

- `npx tsc -b --pretty false`

### Convex

This repo contains a Convex functions directory at `convex/`.

Common Convex commands (via npx):

- `npx convex dev` (runs Convex locally / syncs functions)
- `npx convex deploy` (deploys)
- `npx convex -h` (help)

Notes:

- Convex auth routes are set up in `convex/http.ts`.
- Convex Better Auth integration lives in `convex/auth.ts` and `convex/auth.config.ts`.

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

- `src/` application code
  - `src/main.tsx` app entry, router setup, providers
  - `src/pages/` route pages
  - `src/components/` shared components
  - `src/components/ui/` UI primitives (shadcn/base-ui style)
  - `src/hooks/` React hooks
  - `src/lib/` small utilities, types, client wrappers
- `convex/` backend functions and generated types
  - `convex/_generated/` (generated; do not hand-edit)

## Code Style (TypeScript / React)

### Formatting

- Existing files mix semicolons/no-semicolons; prefer **match the file** you’re editing.
- Prefer **2-space indentation**, as shown in the codebase.
- Keep JSX readable; break large prop lists over multiple lines.

### Imports

Use this ordering (match existing patterns):

1. React + React Router imports
2. Third-party libs (e.g. `lucide-react`, `convex/*`, `better-auth/*`)
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
- Prefer `useSyncExternalStore` for external synchronous stores (see `src/hooks/use-auth.ts`).
- Use `useEffect` for DOM side effects and subscriptions; always clean up.

### State and persistence

- Local storage is used for:
  - Auth state (`src/hooks/use-auth.ts`)
  - Blog content during development (`src/hooks/use-blog.ts`)

If you change storage formats:

- Provide a migration or tolerate older values (guard `JSON.parse` with try/catch).

### Styling

- Use Tailwind class strings.
- For conditional class names, use `cn` from `src/lib/utils.ts`.
- Avoid introducing new styling libraries unless necessary.

### Routing

- Routes are defined in `src/main.tsx` using React Router.
- Keep page components in `src/pages/`.

## Error Handling Guidelines

- Prefer user-safe error messages at UI boundaries; avoid leaking raw server errors.
- Use `try/catch` around:
  - `JSON.parse` of localStorage values
  - auth/network operations
- When catching errors:
  - If failure is non-critical (e.g. sign-out after local state cleared), swallow safely.
  - Otherwise rethrow a new `Error` with a helpful message (see `useAuth.signIn`).

## Convex Guidelines

- Do not edit generated files under `convex/_generated/`.
- Prefer `query`/`mutation` wrappers from `convex/_generated/server`.
- Use Convex `v` validators (`convex/values`) for arguments.
- When integrating auth:
  - `convex/http.ts` registers auth routes.
  - `convex/auth.ts` exposes `getCurrentUser` which returns `null` on unauthenticated access.

## Environment Variables

Used in the client:

- `VITE_CONVEX_URL` (see `src/main.tsx`)
- `VITE_CONVEX_SITE_URL` (see `src/lib/auth-client.ts`)

Used in Convex (server):

- `SITE_URL` (see `convex/auth.ts`)

Agents should not hardcode these; thread them through configuration.

## Do / Don’t For Agents

- Do keep changes focused and consistent with nearby code.
- Do prefer `@/…` imports over long relatives.
- Do run at least `npm run lint` + `npx tsc -b` for validation.
- Don’t add heavy dependencies without a clear requirement.
- Don’t modify `convex/_generated/*` manually.
- Don’t introduce a test runner unless requested; if you do, update this file.

## Cursor / Copilot Rules

No Cursor rules found (`.cursorrules` or `.cursor/rules/`).
No Copilot instructions found (`.github/copilot-instructions.md`).

If such files are added later, mirror any relevant constraints here.
