import { parseDice } from './parse';
import { defaultRng, rollDie, type Rng } from './rng';
import type {
  DiceExpression,
  DiceTerm,
  KeepDrop,
  RolledDie,
  RolledTerm,
  RollResult,
} from './types';

/** Safety cap so a runaway exploding term can't loop forever. */
const MAX_DICE_PER_TERM = 1000;

/**
 * Roll a dice expression (string or pre-parsed) and return a structured,
 * fully-itemised result. Pass a seeded `rng` for deterministic tests.
 */
export function roll(input: string | DiceExpression, rng: Rng = defaultRng): RollResult {
  const expr = typeof input === 'string' ? parseDice(input) : input;

  const terms: RolledTerm[] = expr.terms.map((term) => {
    if (term.kind === 'flat') {
      return { raw: term.raw, sign: term.sign, dice: [], flat: term.value, subtotal: term.sign * term.value };
    }
    return rollDiceTerm(term, rng);
  });

  const total = terms.reduce((sum, t) => sum + t.subtotal, 0);
  return { expression: expr.source, terms, total };
}

function rollDiceTerm(term: DiceTerm, rng: Rng): RolledTerm {
  const dice: RolledDie[] = [];

  for (let i = 0; i < term.count; i += 1) {
    let value = rollDie(term.faces, rng);
    dice.push({ faces: term.faces, value, kept: true });

    if (term.explode) {
      while (value === term.faces && dice.length < MAX_DICE_PER_TERM) {
        value = rollDie(term.faces, rng);
        dice.push({ faces: term.faces, value, kept: true, exploded: true });
      }
    }
  }

  if (term.keepDrop) applyKeepDrop(dice, term.keepDrop);

  const subtotal = term.sign * dice.reduce((sum, d) => sum + (d.kept ? d.value : 0), 0);
  return { raw: term.raw, sign: term.sign, dice, subtotal };
}

/**
 * Mark dice as kept/dropped per the selector. Selection is by value; ties are
 * broken by original position so results are stable.
 */
function applyKeepDrop(dice: RolledDie[], selector: KeepDrop): void {
  const order = dice
    .map((die, index) => ({ index, value: die.value }))
    .sort((a, b) => a.value - b.value || a.index - b.index);

  const total = dice.length;
  let keepIndices: Set<number>;

  switch (selector.mode) {
    case 'kh':
      keepIndices = new Set(order.slice(total - selector.count).map((d) => d.index));
      break;
    case 'kl':
      keepIndices = new Set(order.slice(0, selector.count).map((d) => d.index));
      break;
    case 'dl':
      keepIndices = new Set(order.slice(selector.count).map((d) => d.index));
      break;
    case 'dh':
      keepIndices = new Set(order.slice(0, total - selector.count).map((d) => d.index));
      break;
  }

  dice.forEach((die, index) => {
    die.kept = keepIndices.has(index);
  });
}

/** Roll `1d20 + modifier` — the workhorse for click-a-modifier rolls. */
export function rollD20(modifier: number, rng: Rng = defaultRng): RollResult {
  const sign = modifier < 0 ? '-' : '+';
  return roll(`1d20${sign}${Math.abs(modifier)}`, rng);
}
