import { z } from 'zod';

/**
 * Zod schemas for reference content `data` payloads and the homebrew
 * export/import bundle. These are the single validation source shared by the
 * builders, the import conflict-resolver, and the API — and they mirror the
 * engine's input types in @dnd/engine.
 */

export const abilityKeySchema = z.enum(['str', 'dex', 'con', 'int', 'wis', 'cha']);

export const sizeSchema = z.enum([
  'fine',
  'diminutive',
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
  'gargantuan',
  'colossal',
]);

export const babProgressionSchema = z.enum(['good', 'average', 'poor']);
export const saveProgressionSchema = z.enum(['good', 'poor']);

export const abilityAdjustmentsSchema = z.record(abilityKeySchema, z.number().int());

export const raceDataSchema = z.object({
  size: sizeSchema,
  speed: z.number().int().nonnegative(),
  abilityAdjustments: abilityAdjustmentsSchema.optional(),
  levelAdjustment: z.number().int().optional(),
  racialHitDice: z.number().int().nonnegative().optional(),
  racialHitDieSize: z.number().int().positive().optional(),
  naturalArmor: z.number().int().optional(),
  bonusSkillPointsPerLevel: z.number().int().optional(),
  traits: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export const classFeatureSchema = z.object({
  name: z.string(),
  level: z.number().int().positive(),
  description: z.string().optional(),
  hook: z.string().optional(), // structured effect key, e.g. "bonus-feat", "sneak-attack"
  value: z.union([z.number(), z.string()]).optional(),
});

export const spellcastingSchema = z.object({
  type: z.enum(['prepared', 'spontaneous', 'none']).default('none'),
  ability: abilityKeySchema.optional(),
  list: z.string().optional(),
  slotsPerDay: z.record(z.string(), z.array(z.number().int())).optional(),
  spellsKnown: z.record(z.string(), z.array(z.number().int())).optional(),
  domains: z.boolean().optional(),
});

export const classDataSchema = z.object({
  isPrestige: z.boolean().default(false),
  hitDie: z.number().int().positive(),
  babProgression: babProgressionSchema,
  fort: saveProgressionSchema,
  ref: saveProgressionSchema,
  will: saveProgressionSchema,
  skillPointsPerLevel: z.number().int().nonnegative(),
  classSkills: z.array(z.string()),
  features: z.array(classFeatureSchema).default([]),
  spellcasting: spellcastingSchema.optional(),
  prerequisites: z.array(z.string()).optional(), // prestige-class entry reqs
});

export const skillDataSchema = z.object({
  keyAbility: abilityKeySchema,
  armorCheckPenalty: z.boolean().default(false),
  trainedOnly: z.boolean().default(false),
  synergies: z
    .array(
      z.object({
        fromSkillId: z.string(),
        ranks: z.number().int().positive(),
        bonus: z.number().int(),
        toSkillId: z.string(),
      }),
    )
    .optional(),
});

export const featPrerequisiteSchema = z.object({
  bab: z.number().int().optional(),
  abilities: abilityAdjustmentsSchema.optional(),
  skills: z.record(z.string(), z.number().int()).optional(),
  feats: z.array(z.string()).optional(),
  casterLevel: z.number().int().optional(),
  special: z.string().optional(),
});

export const featDataSchema = z.object({
  featType: z.string().default('general'),
  prerequisites: featPrerequisiteSchema.optional(),
  benefit: z.string().optional(),
  grants: z
    .array(z.object({ target: z.string(), type: z.string(), value: z.number().int() }))
    .optional(),
});

export type RaceData = z.infer<typeof raceDataSchema>;
export type ClassData = z.infer<typeof classDataSchema>;
export type SkillData = z.infer<typeof skillDataSchema>;
export type FeatData = z.infer<typeof featDataSchema>;

// ---- Homebrew export/import bundle ----

const contentKind = z.enum(['race', 'class', 'skill', 'feat', 'spell', 'item', 'condition']);

export const homebrewEntrySchema = z.object({
  id: z.string().uuid(),
  kind: contentKind,
  name: z.string().min(1),
  slug: z.string().min(1),
  version: z.number().int().positive().default(1),
  data: z.record(z.string(), z.unknown()), // kind-specific; validated per-kind on import
});

/** A portable, self-contained `.dnd35pack.json` file. */
export const homebrewPackSchema = z.object({
  format: z.literal('dnd35pack'),
  formatVersion: z.literal(1),
  pack: z.string().min(1),
  packVersion: z.number().int().positive(),
  author: z.string().optional(),
  entries: z.array(homebrewEntrySchema).min(1),
});

export type HomebrewEntry = z.infer<typeof homebrewEntrySchema>;
export type HomebrewPack = z.infer<typeof homebrewPackSchema>;
