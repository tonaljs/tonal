/**
 * A named spacing of a voicing, or the chord steps between neighbour voices.
 *
 * - `"close"`: each voice one chord step above the one below (C4 E4 G4 B4)
 * - `"open"`: each voice two chord steps above (C4 G4 E5)
 * - `"drop2"`, `"drop3"`: a close voicing with the 2nd or 3rd voice from the
 *   top an octave lower (G3 C4 E4 B4, E3 C4 G4 B4)
 * - `"drop24"`: the 2nd and 4th voices from the top an octave lower
 * - `"spread"`: the root at the bottom, then a wide interval (a 5th, 7th or
 *   10th, or a 3rd followed by a 4th or more), then intervals from a minor
 *   2nd to a major 6th; more than an octave in all
 * - `"block"`: close voicing under the top note, with the top note doubled an
 *   octave lower at the bottom
 * - a list of numbers: the chord steps between each pair of neighbour voices
 *
 * Chord steps are counted along the voicing's own pitch classes.
 */
export type VoicingSpacing =
  | "close"
  | "open"
  | "drop2"
  | "drop3"
  | "drop24"
  | "spread"
  | "block"
  | number[];

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/**
 * The chord steps between neighbour voices: how many notes of the voicing's
 * own pitch classes there are from one voice up to the next (1 in close
 * position, 2 in open position).
 *
 * Source: Dmitri Tymoczko, *Tonality: An Owner's Manual* (2023), prelude to
 * ch. 2: a voicing is "the pattern of registral spacing measured in steps
 * along the chord itself"; close position is one chord step between
 * neighbours and open position two.
 *
 * @private
 */
export function stepsOf(midis: number[]): number[] {
  const chromas = [...new Set(midis.map(mod12))];
  const steps: number[] = [];
  for (let i = 1; i < midis.length; i++) {
    let count = 0;
    for (let m = midis[i - 1] + 1; m <= midis[i]; m++) {
      if (chromas.includes(mod12(m))) count++;
    }
    steps.push(count);
  }
  return steps;
}

const isClose = (midis: number[]) =>
  midis.length > 1 && stepsOf(midis).every((s) => s === 1);

// Raise the given voices (indexes from the bottom) an octave: is it a close
// voicing with those voices at the given positions?
function undrop(midis: number[], lowest: number, positions: number[]) {
  if (midis.length < Math.max(...positions) || midis.length < 3) return false;
  const raised = midis.map((m, i) => (i < lowest ? m + 12 : m));
  const sorted = [...raised].sort((a, b) => a - b);
  if (new Set(sorted).size !== sorted.length || !isClose(sorted)) return false;
  // where the raised voices land, counted from the top (1 is the top)
  const fromTop = midis
    .slice(0, lowest)
    .map((m) => sorted.length - sorted.indexOf(m + 12))
    .sort((a, b) => a - b);
  return positions.every((p, i) => fromTop[i] === p);
}

// a 5th, a 7th or a 10th
const SPREAD_BOTTOM = [7, 10, 11, 15, 16];

/**
 * Does a voicing (midi numbers, from the bottom) have a spacing?
 *
 * Sources:
 *
 * - Close, open and steps along the chord: Dmitri Tymoczko, *Tonality: An
 *   Owner's Manual* (2023), prelude to ch. 2.
 * - Drop 2, drop 3 and drop 2 & 4: Gary Lindsay, *Jazz Arranging Techniques*
 *   (2005), ch. 11 ("Drop 2 is derived from 4 Way Close by lowering the 2nd
 *   voice from the top, one octave").
 * - Spread: Lindsay, ch. 16 (the root at the bottom, usually in the octave
 *   below middle C; then a 10th, 7th, 5th or 3rd; then intervals from a minor
 *   2nd to a major 6th). tonal asks a 3rd at the bottom to be followed by a
 *   4th or more, so a spread voicing is wide at the bottom.
 * - Block chords: Mark Levine, *The Jazz Piano Book* (1989), ch. 19, and Tim
 *   Richards, *Exploring Jazz Piano*, vol. 1, p. 223 (four-way close under the
 *   melody, the melody doubled an octave below).
 *
 * @private
 */
export function hasSpacing(
  midis: number[],
  spacing: VoicingSpacing,
  rootChroma?: number,
): boolean {
  const steps = stepsOf(midis);
  if (Array.isArray(spacing)) {
    return (
      spacing.length === steps.length && spacing.every((s, i) => s === steps[i])
    );
  }
  switch (spacing) {
    case "close":
      return isClose(midis);
    case "open":
      return midis.length > 1 && steps.every((s) => s === 2);
    case "drop2":
      return undrop(midis, 1, [2]);
    case "drop3":
      return midis.length >= 4 && undrop(midis, 1, [3]);
    case "drop24":
      return midis.length >= 4 && undrop(midis, 2, [2, 4]);
    case "spread": {
      if (midis.length < 3 || rootChroma === undefined) return false;
      if (mod12(midis[0]) !== rootChroma) return false;
      const gaps = midis.slice(1).map((m, i) => m - midis[i]);
      // a wide interval at the bottom: a 5th, 7th or 10th, or a 3rd followed
      // by a 4th or more
      const wide =
        SPREAD_BOTTOM.includes(gaps[0]) ||
        ([3, 4].includes(gaps[0]) && gaps[1] >= 5);
      return (
        wide &&
        midis[midis.length - 1] - midis[0] > 12 &&
        gaps.slice(1).every((g) => g >= 1 && g <= 9)
      );
    }
    case "block": {
      const n = midis.length;
      return (
        n >= 4 && midis[n - 1] - midis[0] === 12 && isClose(midis.slice(1))
      );
    }
  }
  return false;
}

/** The first named spacing a voicing has, or "". @private */
export function spacingName(
  midis: number[],
  rootChroma?: number,
): Exclude<VoicingSpacing, number[]> | "" {
  // the more specific names first: a block voicing is also close, and an
  // open triad is also a drop 2
  const names = [
    "block",
    "close",
    "open",
    "drop2",
    "drop3",
    "drop24",
    "spread",
  ] as const;
  return names.find((name) => hasSpacing(midis, name, rootChroma)) ?? "";
}
