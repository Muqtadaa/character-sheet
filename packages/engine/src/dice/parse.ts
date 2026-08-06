import type { DiceExpression, DiceTerm, FlatTerm, KeepDrop, Term } from './types';

export class DiceParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiceParseError';
  }
}

// A single dice term: [count]d<faces>[ ! ][ kh|kl|dh|dl <n> ]  (modifiers order-insensitive)
const DICE_TERM = /^(\d*)d(\d+)((?:!|kh\d+|kl\d+|dh\d+|dl\d+)*)$/i;
const KEEPDROP_TOKEN = /(kh|kl|dh|dl)(\d+)/gi;

/**
 * Parse standard dice notation into a structured expression.
 *
 * Supports: `NdX`, flat modifiers, multiple additive terms (`2d6+1d4+3`),
 * keep/drop (`4d6dl1`, `2d20kh1`), and exploding dice (`3d6!`). Case- and
 * whitespace-insensitive.
 */
export function parseDice(input: string): DiceExpression {
  const source = input.trim();
  if (source === '') throw new DiceParseError('Empty dice expression.');

  // Split into signed tokens while keeping the sign. Normalise leading sign.
  const normalised = source.replace(/\s+/g, '');
  const tokens = normalised.match(/[+-]?[^+-]+/g);
  if (!tokens) throw new DiceParseError(`Could not parse "${source}".`);

  const terms: Term[] = tokens.map((token) => parseToken(token, source));
  return { source, terms };
}

function parseToken(token: string, source: string): Term {
  let sign: 1 | -1 = 1;
  let body = token;
  if (body.startsWith('+')) body = body.slice(1);
  else if (body.startsWith('-')) {
    sign = -1;
    body = body.slice(1);
  }
  if (body === '') throw new DiceParseError(`Dangling sign in "${source}".`);

  // Flat integer modifier.
  if (/^\d+$/.test(body)) {
    const flat: FlatTerm = { kind: 'flat', sign, value: Number(body), raw: token };
    return flat;
  }

  const match = DICE_TERM.exec(body);
  if (!match) throw new DiceParseError(`Unrecognised term "${token}" in "${source}".`);

  const count = match[1] === '' ? 1 : Number(match[1]);
  const faces = Number(match[2]);
  const modifiers = match[3] ?? '';

  if (count < 1) throw new DiceParseError(`Dice count must be ≥ 1 in "${token}".`);
  if (faces < 2) throw new DiceParseError(`Dice must have ≥ 2 faces in "${token}".`);

  const explode = /!/.test(modifiers);
  const keepDrop = parseKeepDrop(modifiers, count, token);

  const dice: DiceTerm = {
    kind: 'dice',
    sign,
    count,
    faces,
    explode,
    ...(keepDrop ? { keepDrop } : {}),
    raw: token,
  };
  return dice;
}

function parseKeepDrop(modifiers: string, count: number, token: string): KeepDrop | undefined {
  const matches = [...modifiers.matchAll(KEEPDROP_TOKEN)];
  if (matches.length === 0) return undefined;
  if (matches.length > 1) {
    throw new DiceParseError(`Only one keep/drop selector allowed in "${token}".`);
  }
  const [, mode, n] = matches[0]!;
  const selector: KeepDrop = { mode: mode!.toLowerCase() as KeepDrop['mode'], count: Number(n) };
  if (selector.count < 1 || selector.count > count) {
    throw new DiceParseError(`Keep/drop count out of range in "${token}".`);
  }
  return selector;
}
