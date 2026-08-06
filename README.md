# Grimoire — D&D 3.5e Character Sheet Builder

A web app to build, save, and **play** D&D 3.5e characters, with a real rules
engine, guided homebrew builders + shareable content packs, and live in-session
tracking. Built for a private table.

## Status

Foundation in place:

- ✅ **Next.js 14 (App Router, TypeScript) + Tailwind** scaffold with a
  tokens-first, theme-aware design system (`src/app/globals.css`).
- ✅ **Pure rules engine** (`packages/engine`) — framework-agnostic, unit-tested:
  - `dice/` — seedable dice engine: `NdX±M` notation, keep/drop (4d6 drop
    lowest), exploding dice, `rollD20(mod)` for click-a-modifier rolls.
  - `rules/` — the 3.5e correctness core: bonus-type **stacking resolver**,
    ability mods, HP, multiclass BAB + iteratives, saves, AC (+ touch /
    flat-footed), skills (budget, caps, synergy, ACP), encumbrance — every
    derived number carries its provenance/breakdown.
- ✅ **Database migration** (`supabase/migrations/0001_initial_schema.sql`) —
  reference + character tables, the live-play effect layer, session log,
  homebrew pack tags, RLS, and the avatar storage bucket.
- ✅ **Homebrew export/import** (`src/lib/homebrew`) — self-contained
  `.dnd35pack.json` bundles, validation, and a conflict resolver
  (skip / replace / import-as-copy).
- ✅ **Zod schemas** (`src/lib/schemas`) shared across app + engine.

See the full implementation plan for the roadmap (spellcasting, creation
wizard, custom-content builders, play mode, print/PDF sheet, etc.).

## Getting started

```bash
npm install
npm run test        # engine + homebrew unit tests (Vitest)
npm run build       # type-check + production build
npm run dev         # local dev server
```

### Environment

Copy `.env.example` to `.env.local` and fill in Supabase credentials. Apply the
migration with the Supabase CLI or MCP tooling. The **dev-only passwordless test
login** is gated behind `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true` and must never be
enabled in production.

## Architecture

The **rules engine is pure** (no React/DB imports) so it is unit-testable in
isolation and reusable for the screen sheet, print export, and future clients.
The app resolves reference rows (built-in or custom) into the engine's plain
input types and renders the derived sheet.

```
Reference data (builtin + custom) ─┐
Character choices                  ─┼─► [ pure engine ] ─► DerivedSheet ─► UI / print / play
Active in-play effects             ─┘
```

## Design system

Authored and enforced with **Impeccable** (`npx impeccable install` →
`/impeccable init`; Node ≥ 22.12). Semantic design tokens are the single source
of truth; components consume tokens, never raw literals.
