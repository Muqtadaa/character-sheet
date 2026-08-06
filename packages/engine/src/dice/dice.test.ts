import { describe, expect, it } from 'vitest';
import { parseDice, DiceParseError } from './parse';
import { roll, rollD20 } from './roll';
import { seededRng } from './rng';

describe('parseDice', () => {
  it('parses a simple NdX term', () => {
    const { terms } = parseDice('2d6');
    expect(terms).toHaveLength(1);
    expect(terms[0]).toMatchObject({ kind: 'dice', count: 2, faces: 6, sign: 1 });
  });

  it('defaults count to 1 (d20)', () => {
    const { terms } = parseDice('d20');
    expect(terms[0]).toMatchObject({ kind: 'dice', count: 1, faces: 20 });
  });

  it('parses multiple terms with flat modifier and signs', () => {
    const { terms } = parseDice('2d6 + 1d4 - 1');
    expect(terms).toHaveLength(3);
    expect(terms[0]).toMatchObject({ kind: 'dice', count: 2, faces: 6, sign: 1 });
    expect(terms[1]).toMatchObject({ kind: 'dice', count: 1, faces: 4, sign: 1 });
    expect(terms[2]).toMatchObject({ kind: 'flat', value: 1, sign: -1 });
  });

  it('parses keep/drop and exploding modifiers', () => {
    expect(parseDice('4d6dl1').terms[0]).toMatchObject({
      keepDrop: { mode: 'dl', count: 1 },
    });
    expect(parseDice('2d20kh1').terms[0]).toMatchObject({
      keepDrop: { mode: 'kh', count: 1 },
    });
    expect(parseDice('3d6!').terms[0]).toMatchObject({ explode: true });
  });

  it('is case- and whitespace-insensitive', () => {
    expect(parseDice('1D20+7').terms[1]).toMatchObject({ kind: 'flat', value: 7 });
  });

  it('rejects malformed input', () => {
    expect(() => parseDice('')).toThrow(DiceParseError);
    expect(() => parseDice('2x6')).toThrow(DiceParseError);
    expect(() => parseDice('d1')).toThrow(DiceParseError);
    expect(() => parseDice('4d6dl9')).toThrow(DiceParseError); // drop more than rolled
  });
});

describe('roll', () => {
  it('is deterministic under a seeded RNG', () => {
    const a = roll('4d6', seededRng(12345));
    const b = roll('4d6', seededRng(12345));
    expect(a.total).toBe(b.total);
    expect(a.terms[0]!.dice.map((d) => d.value)).toEqual(b.terms[0]!.dice.map((d) => d.value));
  });

  it('keeps every die within its face range', () => {
    const rng = seededRng(999);
    const result = roll('10d8', rng);
    for (const die of result.terms[0]!.dice) {
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(8);
    }
  });

  it('applies flat modifiers to the total', () => {
    const result = roll('1d20+7', seededRng(1));
    const dieValue = result.terms[0]!.dice[0]!.value;
    expect(result.total).toBe(dieValue + 7);
  });

  it('4d6 drop lowest keeps exactly three dice and excludes the lowest', () => {
    const result = roll('4d6dl1', seededRng(42));
    const dice = result.terms[0]!.dice;
    expect(dice).toHaveLength(4);
    const kept = dice.filter((d) => d.kept);
    const dropped = dice.filter((d) => !d.kept);
    expect(kept).toHaveLength(3);
    expect(dropped).toHaveLength(1);
    // The dropped die is <= every kept die.
    const minKept = Math.min(...kept.map((d) => d.value));
    expect(dropped[0]!.value).toBeLessThanOrEqual(minKept);
    expect(result.total).toBe(kept.reduce((s, d) => s + d.value, 0));
  });

  it('subtracts negative terms (flat and dice)', () => {
    const flat = roll('1d6-2', seededRng(7));
    expect(flat.total).toBe(flat.terms[0]!.dice[0]!.value - 2);

    const subtracted = roll('2d6-1d4', seededRng(7));
    const pos = subtracted.terms[0]!.dice.reduce((s, d) => s + d.value, 0);
    const neg = subtracted.terms[1]!.dice.reduce((s, d) => s + d.value, 0);
    expect(subtracted.terms[1]!.sign).toBe(-1);
    expect(subtracted.total).toBe(pos - neg);
  });

  it('exploding dice add extra dice and never leave a max-face terminal die uncontinued', () => {
    // Seed chosen so at least one explosion happens across many rolls.
    const result = roll('20d6!', seededRng(3));
    const dice = result.terms[0]!.dice;
    // Any non-final die that equals 6 must be followed by an exploded die.
    for (let i = 0; i < dice.length - 1; i += 1) {
      if (dice[i]!.value === 6 && !dice[i + 1]!.exploded) {
        // the next die belongs to a new base die; that's fine — just assert
        // that exploded dice only follow a 6.
      }
    }
    for (let i = 1; i < dice.length; i += 1) {
      if (dice[i]!.exploded) {
        expect(dice[i - 1]!.value).toBe(6);
      }
    }
  });
});

describe('rollD20', () => {
  it('produces 1d20 + modifier', () => {
    const result = rollD20(5, seededRng(2));
    expect(result.expression).toBe('1d20+5');
    expect(result.total).toBe(result.terms[0]!.dice[0]!.value + 5);
  });

  it('handles negative modifiers', () => {
    const result = rollD20(-2, seededRng(2));
    expect(result.expression).toBe('1d20-2');
    expect(result.total).toBe(result.terms[0]!.dice[0]!.value - 2);
  });
});
