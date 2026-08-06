/**
 * Random number generators for the dice engine.
 *
 * An `Rng` returns a float in [0, 1) just like `Math.random`. Tests inject a
 * seeded generator so rolls are deterministic; production uses `defaultRng`.
 */
export type Rng = () => number;

export const defaultRng: Rng = Math.random;

/**
 * mulberry32 — a tiny, fast, well-distributed seedable PRNG. Deterministic for
 * a given seed, which is exactly what the test suite needs.
 */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roll a single die with `faces` sides using `rng`. Returns 1..faces. */
export function rollDie(faces: number, rng: Rng): number {
  return Math.floor(rng() * faces) + 1;
}
