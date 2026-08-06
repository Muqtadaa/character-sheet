import type { BabProgression, SaveProgression } from './types';

/** Base attack bonus contributed by a single class at a given level. */
export function babForClass(progression: BabProgression, level: number): number {
  switch (progression) {
    case 'good':
      return level; // 1/level
    case 'average':
      return Math.floor((level * 3) / 4); // 3/4
    case 'poor':
      return Math.floor(level / 2); // 1/2
  }
}

/** Base save contributed by a single class at a given level. */
export function saveForClass(progression: SaveProgression, level: number): number {
  return progression === 'good' ? 2 + Math.floor(level / 2) : Math.floor(level / 3);
}

/**
 * Iterative attacks from a total BAB: a bonus attack at −5 for each +5 of BAB
 * beyond the first (e.g. BAB 11 → [11, 6, 1]).
 */
export function iterativeAttacks(baseAttackBonus: number): number[] {
  if (baseAttackBonus <= 0) return [baseAttackBonus];
  const attacks: number[] = [];
  for (let bonus = baseAttackBonus; bonus > 0 || attacks.length === 0; bonus -= 5) {
    attacks.push(bonus);
    if (attacks.length >= 4) break; // 3.5e caps iteratives from BAB at 4
  }
  return attacks;
}

/** Ability modifier: floor((score - 10) / 2). */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
