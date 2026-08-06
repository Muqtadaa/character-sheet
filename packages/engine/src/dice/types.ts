/** Standard polyhedral dice available in the free-form tray. */
export const STANDARD_DICE = [4, 6, 8, 10, 12, 20, 100] as const;
export type StandardDie = (typeof STANDARD_DICE)[number];

/** Keep/drop selector applied to a dice term (e.g. 4d6 drop lowest 1). */
export interface KeepDrop {
  mode: 'kh' | 'kl' | 'dh' | 'dl';
  count: number;
}

/** A parsed dice term such as `4d6dl1` or `2d8`. */
export interface DiceTerm {
  kind: 'dice';
  sign: 1 | -1;
  count: number;
  faces: number;
  keepDrop?: KeepDrop;
  explode: boolean;
  raw: string;
}

/** A parsed flat modifier such as `+7`. */
export interface FlatTerm {
  kind: 'flat';
  sign: 1 | -1;
  value: number;
  raw: string;
}

export type Term = DiceTerm | FlatTerm;

/** A fully parsed dice expression (e.g. `2d6+1d4+3`). */
export interface DiceExpression {
  source: string;
  terms: Term[];
}

/** A single physical die after rolling. */
export interface RolledDie {
  faces: number;
  value: number;
  /** false when removed by a keep/drop selector — shown struck-through in UI. */
  kept: boolean;
  /** true for extra dice produced by an exploding max-face roll. */
  exploded?: boolean;
}

export interface RolledTerm {
  raw: string;
  sign: 1 | -1;
  dice: RolledDie[];
  flat?: number;
  /** signed contribution of this term to the grand total. */
  subtotal: number;
}

/** The structured result the engine returns for every roll. */
export interface RollResult {
  expression: string;
  terms: RolledTerm[];
  total: number;
}
