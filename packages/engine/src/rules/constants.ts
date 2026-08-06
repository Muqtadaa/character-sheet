import type { AbilityKey, Size } from './types';

export const ABILITY_KEYS: readonly AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const SIZES: readonly Size[] = [
  'fine',
  'diminutive',
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
  'gargantuan',
  'colossal',
];

/** Size modifier to AC and attack rolls (SRD Table: Creature Size and Scale). */
export const SIZE_AC_ATTACK: Record<Size, number> = {
  fine: 8,
  diminutive: 4,
  tiny: 2,
  small: 1,
  medium: 0,
  large: -1,
  huge: -2,
  gargantuan: -4,
  colossal: -8,
};

/** Special size modifier to grapple checks (inverse scale of the AC/attack mod). */
export const SIZE_GRAPPLE: Record<Size, number> = {
  fine: -16,
  diminutive: -12,
  tiny: -8,
  small: -4,
  medium: 0,
  large: 4,
  huge: 8,
  gargantuan: 12,
  colossal: 16,
};

/** Carrying-capacity multiplier vs the Str/load table, for bipedal creatures. */
export const SIZE_CARRY_MULTIPLIER: Record<Size, number> = {
  fine: 0.125,
  diminutive: 0.25,
  tiny: 0.5,
  small: 0.75,
  medium: 1,
  large: 2,
  huge: 4,
  gargantuan: 8,
  colossal: 16,
};

/**
 * SRD "Carrying Capacity" table: max weight for a LIGHT load at a given Str,
 * for a Medium biped. Heavy-load max = 3× this value; medium = 2×. Str 1–29
 * are tabulated; 30+ follows the ×4-per-+10 doubling rule handled in code.
 */
export const LIGHT_LOAD_BY_STR: Record<number, number> = {
  1: 3, 2: 6, 3: 10, 4: 13, 5: 16, 6: 20, 7: 23, 8: 26, 9: 30, 10: 33,
  11: 38, 12: 43, 13: 50, 14: 58, 15: 66, 16: 76, 17: 86, 18: 100, 19: 116, 20: 133,
  21: 153, 22: 173, 23: 200, 24: 233, 25: 266, 26: 306, 27: 346, 28: 400, 29: 466,
};
