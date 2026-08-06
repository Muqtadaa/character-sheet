# CLAUDE.md — working notes for this repo

Grimoire is a D&D 3.5e character sheet builder. Stack: Next.js 14 (App Router,
TS) + Supabase (Postgres/Auth/Storage) + Vercel. Design system via Impeccable.

## Layout

- `packages/engine/` — **pure** rules engine. No React/Next/Supabase imports.
  - `src/dice/` — dice notation parser + seedable roller.
  - `src/rules/` — bonus resolver, ability/HP/BAB/saves/AC/skills/encumbrance.
  - Tests live beside sources as `*.test.ts` (Vitest).
- `src/app/` — Next.js routes. `globals.css` holds the semantic design tokens.
- `src/lib/schemas/` — Zod schemas shared across app + engine (content + character).
- `src/lib/homebrew/` — export/import bundle build/parse + conflict resolver.
- `supabase/migrations/` — SQL. `0001_initial_schema.sql` is the base schema + RLS.

## Conventions

- **Never hardcode 3.5e math in components** — it all goes through
  `packages/engine`. Components render the `DerivedSheet` the engine returns.
- **Design tokens only** — use Tailwind semantic tokens (`bg-surface`,
  `text-stat-negative`, …), never raw color literals. Status color is always
  paired with an icon + sign, never color-alone.
- **Content is `builtin` or `custom`** — the engine treats them identically.
  Custom content is owner-scoped (RLS) and shareable via homebrew packs.
- **Strict engine typecheck** — `packages/engine` uses `noUncheckedIndexedAccess`.

## Commands

- `npm run test` — Vitest (engine + homebrew). Keep this green.
- `npm run build` — type-check + Next build.
- `npm run typecheck` — root + workspace type-checks.

## Guardrails

- The passwordless **test login is dev-only** (`NEXT_PUBLIC_ENABLE_TEST_LOGIN`);
  never enable in production.
- Private app for one gaming group — no content-licensing guardrails needed.
