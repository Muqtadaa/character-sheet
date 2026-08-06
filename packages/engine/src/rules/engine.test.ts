import { describe, expect, it } from 'vitest';
import { resolveBonuses } from './bonuses';
import { deriveSheet } from './compute';
import type { BonusEntry, ClassEntry, RaceEntry, SkillDefinition } from './types';

// ---- Shared fixtures ----
const HUMAN: RaceEntry = { name: 'Human', size: 'medium', speed: 30, bonusSkillPointsPerLevel: 1 };
const ELF: RaceEntry = {
  name: 'Elf',
  size: 'medium',
  speed: 30,
  abilityAdjustments: { dex: 2, con: -2 },
};

const FIGHTER = (level: number): ClassEntry => ({
  name: 'Fighter',
  level,
  babProgression: 'good',
  fort: 'good',
  ref: 'poor',
  will: 'poor',
  hitDie: 10,
  skillPointsPerLevel: 2,
  classSkills: ['climb', 'intimidate'],
});
const ROGUE = (level: number): ClassEntry => ({
  name: 'Rogue',
  level,
  babProgression: 'average',
  fort: 'poor',
  ref: 'good',
  will: 'poor',
  hitDie: 6,
  skillPointsPerLevel: 8,
  classSkills: ['hide', 'move-silently', 'tumble'],
});
const WIZARD = (level: number): ClassEntry => ({
  name: 'Wizard',
  level,
  babProgression: 'poor',
  fort: 'poor',
  ref: 'poor',
  will: 'good',
  hitDie: 4,
  skillPointsPerLevel: 2,
  classSkills: ['spellcraft', 'knowledge-arcana'],
});

const SKILLS: SkillDefinition[] = [
  { id: 'climb', name: 'Climb', keyAbility: 'str', armorCheckPenalty: true },
  { id: 'hide', name: 'Hide', keyAbility: 'dex', armorCheckPenalty: true },
  { id: 'tumble', name: 'Tumble', keyAbility: 'dex', armorCheckPenalty: true },
  { id: 'spellcraft', name: 'Spellcraft', keyAbility: 'int', armorCheckPenalty: false },
  {
    id: 'jump',
    name: 'Jump',
    keyAbility: 'str',
    armorCheckPenalty: true,
    synergies: [{ fromSkillId: 'tumble', ranks: 5, bonus: 2, toSkillId: 'jump' }],
  },
];

describe('resolveBonuses (3.5e stacking rules)', () => {
  const b = (value: number, type: BonusEntry['type']): BonusEntry => ({ target: 'x', type, value, source: 't' });

  it('same-type bonuses do not stack — highest wins', () => {
    expect(resolveBonuses([b(2, 'enhancement'), b(4, 'enhancement')]).total).toBe(4);
  });
  it('dodge, circumstance, and untyped bonuses stack', () => {
    expect(resolveBonuses([b(1, 'dodge'), b(1, 'dodge')]).total).toBe(2);
    expect(resolveBonuses([b(1, 'untyped'), b(1, 'untyped')]).total).toBe(2);
    expect(resolveBonuses([b(2, 'circumstance'), b(1, 'circumstance')]).total).toBe(3);
  });
  it('penalties always stack regardless of type', () => {
    expect(resolveBonuses([b(-2, 'enhancement'), b(-2, 'enhancement')]).total).toBe(-4);
  });
  it('mixes stacking, non-stacking, and penalties correctly', () => {
    const r = resolveBonuses([
      b(4, 'enhancement'),
      b(2, 'enhancement'), // suppressed
      b(1, 'dodge'),
      b(1, 'dodge'),
      b(1, 'untyped'),
      b(-1, 'untyped'),
    ]);
    expect(r.total).toBe(4 + 1 + 1 + 1 - 1); // 6
    expect(r.suppressed).toHaveLength(1);
  });
  it('ignores inactive entries', () => {
    expect(resolveBonuses([{ target: 'x', type: 'morale', value: 4, source: 't', active: false }]).total).toBe(0);
  });
});

describe('Human Fighter 5', () => {
  const sheet = deriveSheet(
    {
      name: 'Gundren',
      race: HUMAN,
      classes: [FIGHTER(5)],
      baseAbilityScores: { str: 16, dex: 13, con: 14, int: 10, wis: 12, cha: 8 },
      skillRanks: { climb: 8, intimidate: 8 },
    },
    { skills: SKILLS },
  );

  it('levels & BAB', () => {
    expect(sheet.levels.ecl).toBe(5);
    expect(sheet.baseAttackBonus).toBe(5);
  });
  it('ability modifiers', () => {
    expect(sheet.abilities.str.modifier).toBe(3);
    expect(sheet.abilities.con.modifier).toBe(2);
  });
  it('HP = 5×6 + 2×5 = 40', () => {
    expect(sheet.hitPoints.max).toBe(40);
  });
  it('saves: Fort 6, Ref 2, Will 2', () => {
    expect(sheet.saves.fort.total).toBe(6);
    expect(sheet.saves.ref.total).toBe(2);
    expect(sheet.saves.will.total).toBe(2);
  });
  it('melee +8, ranged +6, grapple +8', () => {
    expect(sheet.attacks.melee.total).toBe(8);
    expect(sheet.attacks.ranged.total).toBe(6);
    expect(sheet.attacks.grapple.total).toBe(8);
    expect(sheet.attacks.iteratives).toEqual([8]);
  });
  it('AC 11 / touch 11 / flat-footed 10 with no armor', () => {
    expect(sheet.armorClass.normal.total).toBe(11);
    expect(sheet.armorClass.touch).toBe(11);
    expect(sheet.armorClass.flatFooted).toBe(10);
  });
  it('skill points available = 24; class-skill max ranks = 8', () => {
    expect(sheet.skillPoints.available).toBe(24);
    expect(sheet.skills.climb.maxRanks).toBe(8);
    expect(sheet.skills.climb.isClassSkill).toBe(true);
  });
  it('encumbrance from Str 16: light 76 / heavy 228', () => {
    expect(sheet.encumbrance.light).toBe(76);
    expect(sheet.encumbrance.heavy).toBe(228);
  });
});

describe('Elf Wizard 5', () => {
  const sheet = deriveSheet(
    {
      name: 'Aelar',
      race: ELF,
      classes: [WIZARD(5)],
      baseAbilityScores: { str: 8, dex: 15, con: 14, int: 17, wis: 12, cha: 10 },
    },
    { skills: SKILLS },
  );

  it('racial adjustments: Dex 17 (+3), Con 12 (+1)', () => {
    expect(sheet.abilities.dex.total).toBe(17);
    expect(sheet.abilities.dex.modifier).toBe(3);
    expect(sheet.abilities.con.total).toBe(12);
  });
  it('BAB 2, HP 20', () => {
    expect(sheet.baseAttackBonus).toBe(2);
    expect(sheet.hitPoints.max).toBe(20); // 5×3 + 1×5
  });
  it('saves: Fort 2, Ref 4, Will 5', () => {
    expect(sheet.saves.fort.total).toBe(2);
    expect(sheet.saves.ref.total).toBe(4);
    expect(sheet.saves.will.total).toBe(5);
  });
  it('skill points available = 40 (2 + Int 3 per level)', () => {
    expect(sheet.skillPoints.available).toBe(40);
  });
});

describe('Fighter 2 / Rogue 3 multiclass', () => {
  const sheet = deriveSheet(
    {
      name: 'Shadow',
      race: HUMAN,
      classes: [FIGHTER(2), ROGUE(3)],
      baseAbilityScores: { str: 14, dex: 16, con: 13, int: 12, wis: 10, cha: 8 },
      skillRanks: { tumble: 8, hide: 8, jump: 4 },
    },
    { skills: SKILLS },
  );

  it('BAB adds across classes: 2 + 2 = 4', () => {
    expect(sheet.baseAttackBonus).toBe(4);
  });
  it('base saves add across classes: Fort 5, Ref 6, Will 1', () => {
    expect(sheet.saves.fort.total).toBe(5); // (3+1) + Con 1
    expect(sheet.saves.ref.total).toBe(6); // (0+3) + Dex 3
    expect(sheet.saves.will.total).toBe(1); // (0+1) + Wis 0
  });
  it('HP = 2×6 + 3×4 + 1×5 = 29', () => {
    expect(sheet.hitPoints.max).toBe(29);
  });
  it('skill point budget = 50', () => {
    expect(sheet.skillPoints.available).toBe(50);
  });
  it('Tumble→Jump synergy grants +2 when Tumble ≥ 5 ranks', () => {
    // Jump: 4 ranks + Str 2 + synergy 2 = 8
    expect(sheet.skills.jump.misc).toBe(2);
    expect(sheet.skills.jump.total).toBe(8);
  });
});

describe('Monster race with Level Adjustment + racial Hit Dice', () => {
  const OGREKIN: RaceEntry = {
    name: 'Ogrekin',
    size: 'large',
    speed: 40,
    abilityAdjustments: { str: 10, dex: -2, con: 4 },
    levelAdjustment: 2,
    racialHitDice: 4,
    racialHitDieSize: 8,
    naturalArmor: 5,
  };
  const sheet = deriveSheet(
    {
      name: 'Grull',
      race: OGREKIN,
      classes: [FIGHTER(1)],
      baseAbilityScores: { str: 10, dex: 12, con: 10, int: 10, wis: 10, cha: 10 },
    },
    { skills: SKILLS },
  );

  it('ECL = class 1 + racial HD 4 + LA 2 = 7', () => {
    expect(sheet.levels.ecl).toBe(7);
    expect(sheet.levels.racialHitDice).toBe(4);
  });
  it('Str 20 (+5) after +10 racial', () => {
    expect(sheet.abilities.str.total).toBe(20);
    expect(sheet.abilities.str.modifier).toBe(5);
  });
  it('HP includes racial HD: 1×6 + 4×5 + Con2×5 = 36', () => {
    expect(sheet.hitPoints.max).toBe(36);
  });
  it('Large size: melee +5 (1 BAB +5 Str −1 size), grapple +10', () => {
    expect(sheet.attacks.melee.total).toBe(5);
    expect(sheet.attacks.grapple.total).toBe(10); // 1 + 5 + 4 (large grapple)
  });
  it('AC 14 with +5 natural armor; touch 9; carrying doubled for Large', () => {
    expect(sheet.armorClass.normal.total).toBe(14); // 10 + 0 Dex − 1 size + 5 natural
    expect(sheet.armorClass.touch).toBe(9);
    expect(sheet.encumbrance.light).toBe(266); // Str 20 → 133 × 2 (Large)
  });
  it('warns that racial HD BAB/saves are not auto-derived', () => {
    expect(sheet.warnings.some((w) => w.includes('Racial Hit Dice'))).toBe(true);
  });
});
