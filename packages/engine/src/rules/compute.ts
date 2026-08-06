import {
  SIZE_AC_ATTACK,
  SIZE_CARRY_MULTIPLIER,
  SIZE_GRAPPLE,
  LIGHT_LOAD_BY_STR,
  ABILITY_KEYS,
} from './constants';
import { resolveBonuses } from './bonuses';
import { abilityModifier, babForClass, iterativeAttacks, saveForClass } from './progression';
import type {
  AbilityKey,
  BonusEntry,
  CharacterState,
  DerivedAbility,
  DerivedSheet,
  SkillDefinition,
  Size,
  StatWithProvenance,
} from './types';

export interface DeriveOptions {
  skills?: SkillDefinition[];
}

/** Average HP for a hit die (rounded up: d10→6, d8→5, d6→4, d4→3, d12→7). */
function averageHitPoints(hitDie: number): number {
  return Math.floor(hitDie / 2) + 1;
}

/** SRD light-load capacity for a Str score, applying the ×4-per-+10 rule above 29. */
function lightLoad(str: number): number {
  if (str <= 0) return 0;
  if (str <= 29) return LIGHT_LOAD_BY_STR[str] ?? 0;
  return lightLoad(str - 10) * 4;
}

export function deriveSheet(state: CharacterState, options: DeriveOptions = {}): DerivedSheet {
  const warnings: string[] = [];
  const bonuses = state.bonuses ?? [];
  const skillDefs = options.skills ?? [];

  // ---- Abilities ----
  const abilities = {} as Record<AbilityKey, DerivedAbility>;
  for (const key of ABILITY_KEYS) {
    const base = state.baseAbilityScores[key];
    const racial = state.race.abilityAdjustments?.[key] ?? 0;
    const levelIncrease = state.abilityLevelIncreases?.[key] ?? 0;
    const effects = resolveBonuses(bonuses.filter((b) => b.target === `ability:${key}`)).total;
    const total = base + racial + levelIncrease + effects;
    abilities[key] = { base, racial, levelIncrease, effects, total, modifier: abilityModifier(total) };
  }
  const mod = (key: AbilityKey) => abilities[key].modifier;

  // ---- Levels ----
  const classLevels = state.classes.reduce((sum, c) => sum + c.level, 0);
  const racialHitDice = state.race.racialHitDice ?? 0;
  const levelAdjustment = state.race.levelAdjustment ?? 0;
  const totalHitDice = classLevels + racialHitDice;
  const ecl = classLevels + racialHitDice + levelAdjustment;
  if (racialHitDice > 0) {
    warnings.push('Racial Hit Dice contribute HP and max ranks here, but their BAB/base saves/feats vary by creature type — add those via bonus entries.');
  }

  // ---- Hit Points ----
  let baseHp = 0;
  for (const cls of state.classes) {
    if (cls.hitPointsRolled && cls.hitPointsRolled.length === cls.level) {
      baseHp += cls.hitPointsRolled.reduce((s, v) => s + v, 0);
    } else {
      baseHp += cls.level * averageHitPoints(cls.hitDie);
    }
  }
  baseHp += racialHitDice * averageHitPoints(state.race.racialHitDieSize ?? 8);
  const hpBonus = resolveBonuses(bonuses.filter((b) => b.target === 'hp')).total;
  const conContribution = mod('con') * totalHitDice;
  const maxHp = Math.max(1, baseHp + conContribution + hpBonus);
  const damage = state.hpAdjustments?.damage ?? 0;
  const currentHp = maxHp - damage;
  if (currentHp <= 0) warnings.push(currentHp === 0 ? 'Disabled (0 HP).' : 'Dying or dead (negative HP).');

  // ---- BAB & attacks ----
  const baseAttackBonus = state.classes.reduce((sum, c) => sum + babForClass(c.babProgression, c.level), 0);
  const size: Size = state.race.size;
  const sizeAcAttack = SIZE_AC_ATTACK[size];

  const attackBonus = (extraTarget: string) =>
    resolveBonuses(bonuses.filter((b) => b.target === 'attack' || b.target === extraTarget)).total;

  const meleeBonus = attackBonus('attack:melee');
  const rangedBonus = attackBonus('attack:ranged');
  const grappleBonus = resolveBonuses(bonuses.filter((b) => b.target === 'grapple')).total;

  const melee: StatWithProvenance = {
    total: baseAttackBonus + mod('str') + sizeAcAttack + meleeBonus,
    breakdown: [
      { label: 'BAB', value: baseAttackBonus },
      { label: 'Str', value: mod('str') },
      { label: 'size', value: sizeAcAttack },
      { label: 'misc', value: meleeBonus },
    ],
  };
  const ranged: StatWithProvenance = {
    total: baseAttackBonus + mod('dex') + sizeAcAttack + rangedBonus,
    breakdown: [
      { label: 'BAB', value: baseAttackBonus },
      { label: 'Dex', value: mod('dex') },
      { label: 'size', value: sizeAcAttack },
      { label: 'misc', value: rangedBonus },
    ],
  };
  const grapple: StatWithProvenance = {
    total: baseAttackBonus + mod('str') + SIZE_GRAPPLE[size] + grappleBonus,
    breakdown: [
      { label: 'BAB', value: baseAttackBonus },
      { label: 'Str', value: mod('str') },
      { label: 'size', value: SIZE_GRAPPLE[size] },
      { label: 'misc', value: grappleBonus },
    ],
  };
  const iteratives = iterativeAttacks(baseAttackBonus).map((a) => a + mod('str') + sizeAcAttack + meleeBonus);

  // ---- Armor Class ----
  const acEntries: BonusEntry[] = [...bonuses.filter((b) => b.target === 'ac')];
  if (state.race.naturalArmor) {
    acEntries.push({ target: 'ac', type: 'natural-armor', value: state.race.naturalArmor, source: `${state.race.name} natural armor` });
  }
  const acResolved = resolveBonuses(acEntries);
  const rawDex = mod('dex');
  const cappedDex = state.armor?.maxDex != null ? Math.min(rawDex, state.armor.maxDex) : rawDex;
  const sumApplied = (pred: (t: BonusEntry['type']) => boolean) =>
    acResolved.applied.filter((e) => pred(e.type)).reduce((s, e) => s + e.value, 0);
  const armorLike = sumApplied((t) => t === 'armor' || t === 'shield' || t === 'natural-armor');
  const dodgePart = sumApplied((t) => t === 'dodge');

  const normalAc = 10 + cappedDex + sizeAcAttack + acResolved.total;
  const armorClass = {
    normal: {
      total: normalAc,
      breakdown: [
        { label: 'base', value: 10 },
        { label: 'Dex', value: cappedDex },
        { label: 'size', value: sizeAcAttack },
        ...acResolved.applied.map((e) => ({ label: e.type, value: e.value })),
      ],
    } as StatWithProvenance,
    touch: 10 + cappedDex + sizeAcAttack + (acResolved.total - armorLike),
    flatFooted: normalAc - cappedDex - dodgePart,
  };

  // ---- Initiative ----
  const initBonus = resolveBonuses(bonuses.filter((b) => b.target === 'initiative')).total;
  const initiative: StatWithProvenance = {
    total: rawDex + initBonus,
    breakdown: [
      { label: 'Dex', value: rawDex },
      { label: 'misc', value: initBonus },
    ],
  };

  // ---- Saves ----
  const saveStat = (which: 'fort' | 'ref' | 'will', ability: AbilityKey): StatWithProvenance => {
    const base = state.classes.reduce((sum, c) => sum + saveForClass(c[which], c.level), 0);
    const misc = resolveBonuses(bonuses.filter((b) => b.target === `save:${which}` || b.target === 'saves')).total;
    return {
      total: base + mod(ability) + misc,
      breakdown: [
        { label: 'base', value: base },
        { label: ability, value: mod(ability) },
        { label: 'misc', value: misc },
      ],
    };
  };
  const saves = {
    fort: saveStat('fort', 'con'),
    ref: saveStat('ref', 'dex'),
    will: saveStat('will', 'wis'),
  };

  // ---- Skills ----
  const classSkillIds = new Set(state.classes.flatMap((c) => c.classSkills));
  const skillRanks = state.skillRanks ?? {};
  const acp = state.armor?.checkPenalty ?? 0;

  // Precompute synergy grants: sourceSkill ranks ≥ N → +bonus to target skill.
  const synergyBonus: Record<string, number> = {};
  for (const def of skillDefs) {
    for (const syn of def.synergies ?? []) {
      const have = skillRanks[syn.fromSkillId] ?? 0;
      if (have >= syn.ranks) synergyBonus[syn.toSkillId] = (synergyBonus[syn.toSkillId] ?? 0) + syn.bonus;
    }
  }

  const skills: DerivedSheet['skills'] = {};
  const skillIds = new Set<string>([...skillDefs.map((d) => d.id), ...Object.keys(skillRanks)]);
  for (const id of skillIds) {
    const def = skillDefs.find((d) => d.id === id);
    const ranks = skillRanks[id] ?? 0;
    const abilityMod = def ? mod(def.keyAbility) : 0;
    const isClassSkill = classSkillIds.has(id);
    const maxRanks = isClassSkill ? totalHitDice + 3 : Math.floor((totalHitDice + 3) / 2);
    const skillBonusEntries = bonuses.filter((b) => b.target === `skill:${id}`);
    let misc = resolveBonuses(skillBonusEntries).total + (synergyBonus[id] ?? 0);
    if (def?.armorCheckPenalty) misc += acp;
    const overMax = ranks > maxRanks;
    if (overMax) warnings.push(`${def?.name ?? id}: ${ranks} ranks exceeds max ${maxRanks}.`);
    skills[id] = { total: ranks + abilityMod + misc, ranks, abilityMod, misc, isClassSkill, maxRanks, overMax };
  }

  // ---- Skill point budget ----
  const intMod = mod('int');
  const bonusPerLevel = state.race.bonusSkillPointsPerLevel ?? 0;
  const perLevelPoints = (skillPointsPerLevel: number) => Math.max(1, skillPointsPerLevel + intMod + bonusPerLevel);
  let available = state.classes.reduce((sum, c) => sum + perLevelPoints(c.skillPointsPerLevel) * c.level, 0);
  const firstClass = state.classes[0];
  if (firstClass) available += 3 * perLevelPoints(firstClass.skillPointsPerLevel); // 1st level counts ×4
  const spent = Object.entries(skillRanks).reduce(
    (sum, [id, ranks]) => sum + (classSkillIds.has(id) ? ranks : ranks * 2),
    0,
  );
  const over = spent > available;
  if (over) warnings.push(`Overspent skill points: ${spent} used of ${available} available.`);

  // ---- Encumbrance ----
  const strScore = abilities.str.total;
  const carryMult = SIZE_CARRY_MULTIPLIER[size];
  const light = Math.floor(lightLoad(strScore) * carryMult);
  const encumbrance = { light, medium: light * 2, heavy: light * 3, maxDexFromLoad: null };

  return {
    name: state.name,
    size,
    levels: { classLevels, racialHitDice, levelAdjustment, ecl },
    abilities,
    hitPoints: { max: maxHp, current: currentHp, nonlethal: state.hpAdjustments?.nonlethal ?? 0, temp: state.hpAdjustments?.temp ?? 0 },
    baseAttackBonus,
    attacks: { melee, ranged, grapple, iteratives },
    armorClass,
    initiative,
    saves,
    skills,
    skillPoints: { spent, available, over },
    encumbrance,
    warnings,
  };
}
