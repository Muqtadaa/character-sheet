# DESIGN.md — Grimoire design language

> Design context for Impeccable's detector (`.impeccable/config.json` →
> `detector.designSystem.enabled`). The tokens here are the single source of
> truth; they are implemented as CSS custom properties in
> `src/app/globals.css` and surfaced through Tailwind in `tailwind.config.ts`.
> Components MUST consume semantic tokens, never raw color literals.

## Identity

Parchment-and-ink "tome, not tax form." Warm neutral surfaces, deep ink text,
a single burnished-copper arcane accent. Dense stat areas stay quiet; identity
and headings carry the character.

## Color — semantic tokens (light / dark)

All colors are `R G B` triples so Tailwind `<alpha-value>` opacity works. Never
reference raw hex/rgb in components — use the token name.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--surface` | page background | `244 240 232` | `24 22 20` |
| `--surface-raised` | cards, panels | `252 249 243` | `34 31 28` |
| `--surface-sunken` | wells, insets | `235 229 218` | `18 16 14` |
| `--border` | hairlines | `210 200 182` | `58 52 46` |
| `--text-primary` | body/ink | `38 32 26` | `234 228 218` |
| `--text-muted` | secondary | `104 94 80` | `166 156 142` |
| `--accent` | interactive emphasis | `122 74 44` | `198 146 96` |
| `--accent-fg` | text on accent | `252 249 243` | `24 22 20` |
| `--stat-positive` | heal / buff | `40 110 72` | `96 190 132` |
| `--stat-negative` | damage / debuff | `168 44 44` | `232 108 100` |
| `--stat-temp` | temporary HP | `58 96 150` | `128 172 224` |
| `--danger` | destructive / errors | `168 44 44` | `232 108 100` |

**Status color rule:** `stat-positive` / `stat-negative` / `stat-temp` must
NEVER be the only signal. Always pair with an icon and an explicit sign
(`+`/`−`) so a buff is not merely "green." All status colors are chosen for
WCAG AA contrast on their surface in both themes.

Both themes ship from day one via `@media (prefers-color-scheme)` plus a
`data-theme` override that wins in both directions.

## Typography

- **Display / headers** (`--font-display`): a characterful serif (the tome
  voice). Used for titles, section headers, character name. NOT for stat rows.
- **Body / UI / numbers** (`--font-body`): a highly legible humanist sans with
  **tabular figures** (`font-variant-numeric: tabular-nums`) so columns of
  modifiers align. All stats render in tabular figures.
- Tight modular scale. Generous line-height in prose/notes; dense in stat blocks.

## Components (domain catalog)

Assemble screens from these; do not restyle ad hoc:
`StatBlock`, `AbilityScoreCard`, `ModifierBreakdown` (provenance tooltip),
`SkillRow`, `AttackRow`, `SpellSlotTracker`, `HPBar`, `EffectChip`,
`DiceButton` / `DiceTray`, `SectionCard`, `WizardStepper`, `ValidationBadge`.

Every rollable number is a `DiceButton` affordance (click → `1d20 + modifier`).

## Motion

Functional only. A number that changes from an applied effect briefly flashes
`stat-positive` / `stat-negative`. Effect chips animate in/out. Honor
`prefers-reduced-motion`. **No bounce/elastic easing** — use ease-out/standard.

## Spacing & layout

8px rhythm. Responsive grid reflows the classic three-column paper sheet into a
mobile stack. Consistent density: dense in stat blocks, roomy in prose.

## Accessibility (requirements, not nice-to-haves)

- WCAG AA contrast everywhere; verified for status colors on both themes.
- Full keyboard operability (creation and play mode usable without a mouse).
- Visible focus rings; semantic landmarks; labels on icon-only controls.

## Anti-patterns (Impeccable enforces)

- No overused/system-default display fonts (Arial, Inter, plain system-ui) for
  brand/headers — the display font must be an intentional serif.
- No gray text on colored backgrounds.
- No bounce/elastic easing.
- No raw color literals in components — semantic tokens only.
- No color-only status signaling — always icon + sign as well.
- The page body never scrolls horizontally; wide tables/diagrams scroll inside
  their own container.
