import { z } from 'zod';
import { abilityKeySchema, sizeSchema } from './content';

/** Persistence/validation schema for a character's editable state. */
export const abilityScoresSchema = z.object({
  str: z.number().int(),
  dex: z.number().int(),
  con: z.number().int(),
  int: z.number().int(),
  wis: z.number().int(),
  cha: z.number().int(),
});

export const characterIdentitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  playerName: z.string().optional(),
  alignment: z.string().optional(),
  deity: z.string().optional(),
  size: sizeSchema.default('medium'),
  age: z.number().int().positive().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  eyes: z.string().optional(),
  hair: z.string().optional(),
  skin: z.string().optional(),
});

export const characterClassRefSchema = z.object({
  classId: z.string().uuid().optional(),
  level: z.number().int().positive(),
  position: z.number().int().nonnegative(),
  hitPointsRolled: z.array(z.number().int()).optional(),
});

export const hpAdjustmentsSchema = z.object({
  damage: z.number().int().nonnegative().default(0),
  nonlethal: z.number().int().nonnegative().default(0),
  temp: z.number().int().nonnegative().default(0),
});

export const effectSchema = z.object({
  target: z.string().min(1),
  bonusType: z.string().default('untyped'),
  value: z.number().int(),
  source: z.string().min(1),
  duration: z.string().optional(),
  active: z.boolean().default(true),
});

export const characterInputSchema = z.object({
  identity: characterIdentitySchema,
  raceId: z.string().uuid().optional(),
  classes: z.array(characterClassRefSchema).min(1),
  baseAbilityScores: abilityScoresSchema,
  abilityLevelIncreases: z.record(abilityKeySchema, z.number().int()).default({}),
  skillRanks: z.record(z.string(), z.number()).default({}),
  hpAdjustments: hpAdjustmentsSchema.default({ damage: 0, nonlethal: 0, temp: 0 }),
});

export type CharacterInput = z.infer<typeof characterInputSchema>;
export type CharacterEffect = z.infer<typeof effectSchema>;
