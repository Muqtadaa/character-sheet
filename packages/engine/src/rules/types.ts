export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type AbilityScores = Record<AbilityKey, number>;

export type Size =
  | 'fine'
  | 'diminutive'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan'
  | 'colossal';

/** BAB advancement per class level. */
export type BabProgression = 'good' | 'average' | 'poor'; // 1, 3/4, 1/2

/** Saving-throw advancement per class level. */
export type SaveProgression = 'good' | 'poor';

/**
 * 3.5e bonus types. Only `dodge`, `circumstance`, and `untyped` stack with
 * themselves; every other named type takes the single highest bonus. Penalties
 * always stack regardless of type.
 */
export type BonusType =
  | 'untyped'
  | 'enhancement'
  | 'morale'
  | 'luck'
  | 'sacred'
  | 'profane'
  | 'insight'
  | 'competence'
  | 'resistance'
  | 'deflection'
  | 'natural-armor'
  | 'armor'
  | 'shield'
  | 'dodge'
  | 'size'
  | 'circumstance'
  | 'racial'
  | 'alchemical'
  | 'inherent';

/** A single bonus/penalty applied to a named target (e.g. `ac`, `save:fort`, `ability:str`, `skill:hide`). */
export interface BonusEntry {
  target: string;
  type: BonusType;
  value: number;
  source: string;
  /** When false the entry is currently inactive (a toggled-off buff) and ignored. */
  active?: boolean;
}

export interface ResolvedBonus {
  total: number;
  applied: BonusEntry[];
  suppressed: BonusEntry[];
}

/** A class (or prestige class) the character has levels in. */
export interface ClassEntry {
  name: string;
  level: number;
  babProgression: BabProgression;
  fort: SaveProgression;
  ref: SaveProgression;
  will: SaveProgression;
  hitDie: number; // e.g. 10 for a d10 class
  skillPointsPerLevel: number; // base, before Int modifier
  classSkills: string[];
  /** Fixed HP rolled per level, if tracked; otherwise average is used. */
  hitPointsRolled?: number[];
}

export interface RaceEntry {
  name: string;
  size: Size;
  speed: number;
  abilityAdjustments?: Partial<AbilityScores>;
  levelAdjustment?: number;
  racialHitDice?: number;
  racialHitDieSize?: number;
  naturalArmor?: number;
  /** e.g. Human's bonus skill point per level. */
  bonusSkillPointsPerLevel?: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  keyAbility: AbilityKey;
  armorCheckPenalty: boolean;
  /** `{ fromSkillId, ranks: 5, bonus: 2 }` — grants a bonus when you have ≥ranks. */
  synergies?: { fromSkillId: string; ranks: number; bonus: number; toSkillId: string }[];
}

/** The raw character the engine derives a sheet from. */
export interface CharacterState {
  name: string;
  race: RaceEntry;
  classes: ClassEntry[];
  /** Base ability scores BEFORE racial adjustments and effects. */
  baseAbilityScores: AbilityScores;
  /** Ability increases chosen at 4th/8th/… level, per ability. */
  abilityLevelIncreases?: Partial<Record<AbilityKey, number>>;
  /** Total ranks invested per skill id. */
  skillRanks?: Record<string, number>;
  /** Bonuses from feats, items, armor, and active in-play effects. */
  bonuses?: BonusEntry[];
  /** Armor's max-Dex cap and check penalty (worst of worn armor + shield). */
  armor?: { maxDex?: number; checkPenalty?: number };
  /** HP lost / nonlethal / temporary — the live play layer. */
  hpAdjustments?: { damage?: number; nonlethal?: number; temp?: number };
}

export interface DerivedAbility {
  base: number;
  racial: number;
  levelIncrease: number;
  effects: number;
  total: number;
  modifier: number;
}

export interface StatWithProvenance {
  total: number;
  breakdown: { label: string; value: number }[];
}

export interface DerivedSheet {
  name: string;
  size: Size;
  levels: { classLevels: number; racialHitDice: number; levelAdjustment: number; ecl: number };
  abilities: Record<AbilityKey, DerivedAbility>;
  hitPoints: { max: number; current: number; nonlethal: number; temp: number };
  baseAttackBonus: number;
  attacks: { melee: StatWithProvenance; ranged: StatWithProvenance; grapple: StatWithProvenance; iteratives: number[] };
  armorClass: { normal: StatWithProvenance; touch: number; flatFooted: number };
  initiative: StatWithProvenance;
  saves: Record<'fort' | 'ref' | 'will', StatWithProvenance>;
  skills: Record<string, { total: number; ranks: number; abilityMod: number; misc: number; isClassSkill: boolean; maxRanks: number; overMax: boolean }>;
  skillPoints: { spent: number; available: number; over: boolean };
  encumbrance: { light: number; medium: number; heavy: number; maxDexFromLoad: number | null };
  warnings: string[];
}
