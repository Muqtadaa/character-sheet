import type { BonusEntry, BonusType, ResolvedBonus } from './types';

/** Bonus types that stack with themselves (all others take the single highest). */
const STACKING_TYPES: ReadonlySet<BonusType> = new Set(['untyped', 'dodge', 'circumstance']);

/**
 * The 3.5e bonus-stacking resolver — the correctness core.
 *
 * Rules:
 *  - Penalties (negative values) ALWAYS stack, regardless of type.
 *  - Positive bonuses of a stacking type (untyped/dodge/circumstance) all add.
 *  - Positive bonuses of any other named type: only the single highest applies;
 *    the rest are suppressed (reported for transparency, not counted).
 *
 * Returns the total plus the list of applied and suppressed entries so the UI
 * can show exactly which bonuses made up a number.
 */
export function resolveBonuses(entries: BonusEntry[]): ResolvedBonus {
  const active = entries.filter((e) => e.active !== false);

  const applied: BonusEntry[] = [];
  const suppressed: BonusEntry[] = [];

  // Penalties always stack.
  for (const entry of active) {
    if (entry.value < 0) applied.push(entry);
  }

  const positives = active.filter((e) => e.value > 0);

  // Stacking-type positives all apply.
  for (const entry of positives) {
    if (STACKING_TYPES.has(entry.type)) applied.push(entry);
  }

  // Non-stacking positives: highest per type applies, rest suppressed.
  const byType = new Map<BonusType, BonusEntry[]>();
  for (const entry of positives) {
    if (STACKING_TYPES.has(entry.type)) continue;
    const list = byType.get(entry.type) ?? [];
    list.push(entry);
    byType.set(entry.type, list);
  }
  for (const list of byType.values()) {
    let best = list[0]!;
    for (const entry of list) if (entry.value > best.value) best = entry;
    for (const entry of list) (entry === best ? applied : suppressed).push(entry);
  }

  const total = applied.reduce((sum, e) => sum + e.value, 0);
  return { total, applied, suppressed };
}

/** Filter a bonus list down to a single target, then resolve it. */
export function resolveTarget(entries: BonusEntry[], target: string): ResolvedBonus {
  return resolveBonuses(entries.filter((e) => e.target === target));
}
