import {
  homebrewPackSchema,
  type HomebrewEntry,
  type HomebrewPack,
} from '@/lib/schemas/content';

export class HomebrewImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HomebrewImportError';
  }
}

export interface BuildPackArgs {
  pack: string;
  packVersion: number;
  author?: string;
  entries: HomebrewEntry[];
}

/**
 * Assemble a portable homebrew pack. Entries should already include every
 * dependency (a class's granted feats, an item's referenced spell, …) so the
 * bundle is self-contained — see `collectDependencies`.
 */
export function buildPack(args: BuildPackArgs): HomebrewPack {
  const candidate = {
    format: 'dnd35pack' as const,
    formatVersion: 1 as const,
    pack: args.pack,
    packVersion: args.packVersion,
    author: args.author,
    entries: args.entries,
  };
  const parsed = homebrewPackSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new HomebrewImportError(`Invalid pack: ${parsed.error.issues[0]?.message ?? 'unknown error'}`);
  }
  return parsed.data;
}

export function serializePack(pack: HomebrewPack): string {
  return JSON.stringify(pack, null, 2);
}

/** Parse and validate an uploaded `.dnd35pack.json` file; never corrupt on bad input. */
export function parsePack(json: string): HomebrewPack {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new HomebrewImportError('File is not valid JSON.');
  }
  const parsed = homebrewPackSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new HomebrewImportError(
      `Not a valid homebrew pack${issue ? `: ${issue.path.join('.')} — ${issue.message}` : '.'}`,
    );
  }
  return parsed.data;
}

export interface ExistingContentRef {
  kind: HomebrewEntry['kind'];
  slug: string;
  id: string;
}

export type ConflictReason = 'same-id' | 'same-slug';

export interface ImportConflict {
  entry: HomebrewEntry;
  reason: ConflictReason;
  existingId: string;
}

/**
 * Compare a pack against the importing user's existing custom content and flag
 * collisions. `same-id` means a re-import (update candidate); `same-slug` means
 * a name clash the resolver should offer skip / replace / import-as-copy for.
 */
export function detectConflicts(pack: HomebrewPack, existing: ExistingContentRef[]): ImportConflict[] {
  const conflicts: ImportConflict[] = [];
  for (const entry of pack.entries) {
    const byId = existing.find((e) => e.kind === entry.kind && e.id === entry.id);
    if (byId) {
      conflicts.push({ entry, reason: 'same-id', existingId: byId.id });
      continue;
    }
    const bySlug = existing.find((e) => e.kind === entry.kind && e.slug === entry.slug);
    if (bySlug) conflicts.push({ entry, reason: 'same-slug', existingId: bySlug.id });
  }
  return conflicts;
}

export type ResolutionChoice = 'skip' | 'replace' | 'copy';

export interface ImportPlanItem {
  entry: HomebrewEntry;
  action: 'insert' | 'update' | 'skip' | 'insert-copy';
}

/**
 * Turn a pack + conflicts + per-entry decisions into a concrete write plan.
 * Non-conflicting entries insert; conflicting ones follow the chosen resolution
 * (default: replace same-id updates, import-as-copy same-slug).
 */
export function planImport(
  pack: HomebrewPack,
  conflicts: ImportConflict[],
  decisions: Record<string, ResolutionChoice> = {},
): ImportPlanItem[] {
  const conflictById = new Map(conflicts.map((c) => [c.entry.id, c]));
  return pack.entries.map((entry) => {
    const conflict = conflictById.get(entry.id);
    if (!conflict) return { entry, action: 'insert' };

    const choice = decisions[entry.id] ?? (conflict.reason === 'same-id' ? 'replace' : 'copy');
    switch (choice) {
      case 'skip':
        return { entry, action: 'skip' };
      case 'replace':
        return { entry, action: 'update' };
      case 'copy':
        return { entry, action: 'insert-copy' };
    }
  });
}
