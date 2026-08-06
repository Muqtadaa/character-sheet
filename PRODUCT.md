# PRODUCT.md — Grimoire

> Design context for Impeccable. Authored to the `/impeccable init` format
> (audience, positioning, voice). Read alongside DESIGN.md.

## What it is

Grimoire is a **D&D 3.5e character sheet builder and play companion** for a
private gaming group. It builds and derives characters with a real rules
engine, lets the table author and share homebrew, and runs live at the table
(HP, buffs/debuffs, dice, session notes).

## Audience

- **Players** at one table who want their sheet math to be *correct* and
  *fast* — multiclassing, level adjustment, skills, feats, spells — without a
  spreadsheet.
- **The DM**, who authors homebrew and shares it so everyone computes the same.
- Comfort with 3.5e terminology is assumed; the UI should respect that fluency
  rather than over-explain.

## Positioning

The sheet is **dense but calm**. It carries dozens of interacting numbers and
must make them scannable and trustworthy — every derived value can show its
breakdown. It should feel like a **well-kept tome**, not a tax form: characterful
where it counts (headers, identity), quiet and precise where the numbers live.

## Voice

- **Confident and concise.** Label things by their real 3.5e names (BAB, Fort,
  ECL). No hand-holding copy.
- **Warm, not whimsical.** A touch of the arcane in headings; plain and exact in
  stat blocks and validation messages.
- **Honest.** Validation warns rather than blocks (house rules exist). When the
  engine can't fully derive something, it says so.

## Core surfaces

1. **Creation wizard** — identity → race → classes (multiclass) → abilities →
   skills → feats → avatar.
2. **Derived sheet** — the read view with provenance tooltips and roll-from-
   modifier dice.
3. **Play mode** — HP, effects, inventory, dice, session log.
4. **Homebrew builders** — race/class/feat/item/spell, plus pack export/import.
