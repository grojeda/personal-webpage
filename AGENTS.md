# Repository Guidelines

## Project Structure & Module Organization
Astro sources live in `src`, with React panels under `src/components`, layouts in `src/layouts`, Astro entrypoints in `src/pages`, typed config in `src/config`, and shared helpers/types in `src/shared`. Global styles and Tailwind layers sit in `src/styles/global.css`, while static assets (icons, fonts) belong in `public`. Deployment and framework settings are captured in `astro.config.ts`, `tsconfig.json`, and `vercel.json`; keep them aligned with any new runtime behavior.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies; run after pulling lockfile changes.
- `pnpm dev` — start Astro in watch mode for local iteration at `http://localhost:4321`.
- `pnpm build` — produce the production-ready `dist/` bundle used by Vercel.
- `pnpm preview` — serve the last build locally to sanity-check routing before deploying.
- `pnpm lint` / `pnpm format` — enforce ESLint + Prettier prior to commits; CI expects a clean run.

## Coding Style & Naming Conventions
Use TypeScript throughout (`.astro`, `.ts`, `.tsx`), defaulting to 2-space indentation in scripts and tabs in CSS when mirroring `global.css`. Prefer descriptive PascalCase component names (e.g., `ContactPanel.tsx`) and camelCase helpers. Prettier enforces single quotes, 100-character lines, and Tailwind class sorting via `prettier-plugin-tailwindcss`; do not hand-sort utility classes. ESLint extends the Astro and React recommendations, so fix all reported issues instead of disabling rules locally.

## Testing Guidelines
Dedicated automated tests are not yet in place. Before opening a PR, run `pnpm dev` and validate each interactive window (Terminal, About, Jobs, Contact) plus any new panel in all breakpoints referenced in `Desktop.tsx`. Prefer adding minimal Vitest or Playwright coverage for new stateful hooks in `src/hooks/` so future contributors can run `pnpm test` once such suites are introduced; colocate specs alongside the unit under test using the `.test.ts` suffix.

## Commit & Pull Request Guidelines
Follow the existing gitmoji-style prefix used in the log (`✨: add feature`, `💄: tweak styles`). Keep commit scopes tight and reference affected panels or configs in the subject after the emoji. For pull requests, include: concise summary, screenshots or recordings of UI changes (desktop + mobile), reproduction steps for bug fixes, and links to any tracked issues. Note environment updates (e.g., Vercel settings, new env vars) explicitly so reviewers can mirror them before merging.
