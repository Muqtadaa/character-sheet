import { describe, expect, it } from 'vitest';
import {
  buildPack,
  detectConflicts,
  HomebrewImportError,
  parsePack,
  planImport,
  serializePack,
  type ExistingContentRef,
} from './index';
import type { HomebrewEntry } from '@/lib/schemas/content';

const CUSTOM_FEAT: HomebrewEntry = {
  id: '11111111-1111-4111-8111-111111111111',
  kind: 'feat',
  name: 'Blade Dancer',
  slug: 'blade-dancer',
  version: 1,
  data: { featType: 'general', benefit: '+2 dodge AC while wielding a light blade.' },
};

const CUSTOM_CLASS: HomebrewEntry = {
  id: '22222222-2222-4222-8222-222222222222',
  kind: 'class',
  name: 'Duskblade',
  slug: 'duskblade',
  version: 2,
  data: {
    isPrestige: false,
    hitDie: 8,
    babProgression: 'good',
    fort: 'good',
    ref: 'poor',
    will: 'good',
    skillPointsPerLevel: 2,
    classSkills: ['spellcraft'],
    // depends on the custom feat above (bundled together → self-contained)
    features: [{ name: 'Bonus Feat', level: 1, hook: 'bonus-feat', value: 'blade-dancer' }],
  },
};

describe('homebrew pack round-trip', () => {
  it('build → serialize → parse preserves the pack', () => {
    const pack = buildPack({
      pack: "Steve's Homebrew",
      packVersion: 3,
      author: 'Steve',
      entries: [CUSTOM_FEAT, CUSTOM_CLASS],
    });
    const restored = parsePack(serializePack(pack));
    expect(restored).toEqual(pack);
    expect(restored.entries).toHaveLength(2);
    // the class's dependency (the feat) travels in the same self-contained bundle
    expect(restored.entries.some((e) => e.kind === 'feat' && e.slug === 'blade-dancer')).toBe(true);
  });

  it('rejects non-JSON and malformed packs with a readable error', () => {
    expect(() => parsePack('not json')).toThrow(HomebrewImportError);
    expect(() => parsePack('{"format":"wrong"}')).toThrow(HomebrewImportError);
  });
});

describe('import conflict resolution', () => {
  const pack = buildPack({ pack: 'P', packVersion: 1, entries: [CUSTOM_FEAT, CUSTOM_CLASS] });

  it('reports no conflicts for a fresh importer', () => {
    expect(detectConflicts(pack, [])).toHaveLength(0);
    const plan = planImport(pack, []);
    expect(plan.every((p) => p.action === 'insert')).toBe(true);
  });

  it('flags a re-import as same-id (update) and a name clash as same-slug (copy)', () => {
    const existing: ExistingContentRef[] = [
      { kind: 'feat', id: CUSTOM_FEAT.id, slug: 'blade-dancer' }, // same id → re-import
      { kind: 'class', id: 'different-id', slug: 'duskblade' }, // same slug, different id
    ];
    const conflicts = detectConflicts(pack, existing);
    expect(conflicts).toHaveLength(2);
    expect(conflicts.find((c) => c.entry.kind === 'feat')?.reason).toBe('same-id');
    expect(conflicts.find((c) => c.entry.kind === 'class')?.reason).toBe('same-slug');

    const plan = planImport(pack, conflicts);
    expect(plan.find((p) => p.entry.kind === 'feat')?.action).toBe('update'); // re-import updates
    expect(plan.find((p) => p.entry.kind === 'class')?.action).toBe('insert-copy'); // clash copies
  });

  it('honors explicit skip decisions', () => {
    const existing: ExistingContentRef[] = [{ kind: 'feat', id: CUSTOM_FEAT.id, slug: 'blade-dancer' }];
    const conflicts = detectConflicts(pack, existing);
    const plan = planImport(pack, conflicts, { [CUSTOM_FEAT.id]: 'skip' });
    expect(plan.find((p) => p.entry.kind === 'feat')?.action).toBe('skip');
  });
});
