import { semitones } from "@tonaljs/interval";
import { ChordDegreeName, degreeToInterval } from "./degrees";

/**
 * The tensions of a chord by its 3rd, 5th and 7th, before removing the ones
 * the chord already says (see `tensionsOf`).
 *
 * Sources, both read on the books' pages:
 *
 * - Ted Pease, *Jazz Composition: Theory and Practice*, "Available Tensions by
 *   Chord Type", p. xv.
 * - John Novello, *The Contemporary Keyboardist*, "Tension Chart", example 5B,
 *   p. 96.
 *
 * They agree on the dominant 7th, maj7, mMaj7, augmented 7th and dim7 (a
 * whole step above each chord tone). Tensions marked "rare" (Pease) or "used
 * less often" (Novello, circled) are left out. Where they differ:
 *
 * - 6 and m6: the major 7th is Pease's "special situation"; Novello leaves it
 *   out (and circles #11 on m6, left out).
 * - m7: 9 and 11. Pease takes b9, b13 and 13 from the mode (Phrygian, Aeolian,
 *   Dorian) and Novello circles the 13, so they come from a scale.
 * - m7b5: Novello circles b9; the 9 is in both.
 * - 7sus4: neither table has a row; the b9 is Mark Levine's susb9 (*The Jazz
 *   Piano Book*, ch. 9).
 *
 * @private
 */
export function baseTensions(formula: ChordDegreeName[]): ChordDegreeName[] {
  const has = (...degrees: string[]) =>
    degrees.some((d) => formula.includes(d));
  if (has("b3")) {
    if (has("b5") && has("bb7")) return ["9", "11", "b13", "7"];
    if (has("b5")) return ["9", "11", "b13"];
    if (has("7")) return ["9", "11", "13"];
    if (has("6")) return ["9", "11", "7"];
    return ["9", "11"];
  }
  if (has("3")) {
    if (has("b7") && has("#5")) return ["9", "#11"];
    if (has("b7")) return ["b9", "9", "#9", "#11", "b13", "13"];
    if (has("#5")) return ["9", "#11"];
    if (has("6")) return ["9", "#11", "7"];
    return ["9", "#11", "13"];
  }
  if (has("b7")) return ["b9", "9", "13"];
  return ["9", "11", "13"];
}

/** The pitch class of a degree name, from the root (0 to 11), or -1. @private */
export function degreePc(degree: ChordDegreeName): number {
  const ivl = degreeToInterval(degree);
  return ivl ? ((semitones(ivl) % 12) + 12) % 12 : -1;
}

/**
 * The tensions of a chord from its formula: the base tensions without the
 * ones the chord already says. @private
 */
export function tensionsOf(formula: ChordDegreeName[]): ChordDegreeName[] {
  if (!formula.length) return [];
  const tones = new Set(formula.map(degreePc));
  const has = (d: string) => formula.includes(d);
  const major = has("3");
  return baseTensions(formula).filter((t) => {
    // 1. the pitch class of a chord tone
    if (tones.has(degreePc(t))) return false;
    // 2. over a major 3rd, the 9 and its alterations exclude each other
    if (major && t === "9" && (has("b9") || has("#9"))) return false;
    if (major && (t === "b9" || t === "#9") && has("9")) return false;
    // 3. the 13 and the b13 exclude each other
    if (t === "b13" && has("13")) return false;
    if (t === "13" && has("b13")) return false;
    return true;
  });
}

/**
 * The pitch classes (from the root) that are another form of a chord's 3rd,
 * 5th or 7th: the slots the chord fills. @private
 */
export function slotPcs(formula: ChordDegreeName[]): Set<number> {
  const has = (...degrees: string[]) =>
    degrees.some((d) => formula.includes(d));
  const pcs: number[] = [];
  if (has("b3", "3")) pcs.push(3, 4);
  if (has("b5", "5", "#5")) pcs.push(6, 7, 8);
  if (has("bb7")) pcs.push(9, 10, 11);
  else if (has("b7", "7")) pcs.push(10, 11);
  return new Set(pcs);
}

/**
 * A note (pitch class from the root) that clashes with a chord: a half step
 * above a chord tone, or another form of its 3rd, 5th or 7th, unless it's a
 * tension. Chord tones never clash. @private
 */
export function clashes(
  pc: number,
  tones: Set<number>,
  slots: Set<number>,
  tensions: Set<number>,
): boolean {
  if (tones.has(pc) || tensions.has(pc)) return false;
  return tones.has((pc + 11) % 12) || slots.has(pc);
}

/**
 * The common chord scales, in the order they are preferred: the modes of
 * major, melodic minor and harmonic minor, the two diminished scales and
 * whole tone. @private
 */
export const COMMON_CHORD_SCALES = [
  "major",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "aeolian",
  "locrian",
  "melodic minor",
  "dorian b2",
  "lydian augmented",
  "lydian dominant",
  "mixolydian b6",
  "locrian #2",
  "altered",
  "harmonic minor",
  "locrian 6",
  "major augmented",
  "dorian #4",
  "phrygian dominant",
  "lydian #9",
  "ultralocrian",
  "whole-half diminished",
  "half-whole diminished",
  "whole tone",
];

/** The pitch classes of a chroma ("101011010101"), rotated by `from`. @private */
export function chromaPcs(chroma: string, from = 0): number[] {
  const pcs: number[] = [];
  for (let i = 0; i < chroma.length; i++) {
    if (chroma[i] === "1") pcs.push((i - from + 12) % 12);
  }
  return pcs;
}
