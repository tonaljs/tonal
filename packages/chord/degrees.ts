import { get as interval } from "@tonaljs/interval";

/**
 * The name of a chord degree: an optional accidental and a number, measured
 * from the root of the chord as in chord symbols: "1", "b3", "3", "4", "b5",
 * "5", "#5", "6", "bb7", "b7", "7", "b9", "9", "#9", "11", "#11", "b13", "13".
 *
 * The 2nd, 4th and 6th and the 9th, 11th and 13th are different degrees: a
 * chord tone is named after its interval in the chord type, so the 6 of C6 is
 * "6" and the 13 of C13 is "13".
 */
export type ChordDegreeName = string;

// The extensions keep their number. Every other interval is reduced to the
// first octave (the 10th of the quartal chord is its "b3").
function degreeNumber(num: number): number {
  return num === 9 || num === 11 || num === 13 ? num : ((num - 1) % 7) + 1;
}

/**
 * Get the degree name of an interval of a chord type.
 * @private
 */
export function intervalToDegree(ivl: string): ChordDegreeName {
  const i = interval(ivl);
  if (i.empty || i.dir < 0) return "";
  const acc = i.alt < 0 ? "b".repeat(-i.alt) : "#".repeat(i.alt);
  return acc + degreeNumber(i.num);
}

const DEGREE = /^(b*|#*)([1-9]\d*)$/;

/**
 * Get the interval of a degree name, or "" if it isn't one.
 * @private
 */
export function degreeToInterval(degree: ChordDegreeName): string {
  const m = DEGREE.exec(degree);
  if (!m) return "";
  const [, acc, numStr] = m;
  const num = +numStr;
  const alt = acc[0] === "b" ? -acc.length : acc.length;
  const perfectable = [1, 4, 5].includes(((num - 1) % 7) + 1);
  const quality = perfectable
    ? alt === 0
      ? "P"
      : alt > 0
        ? "A".repeat(alt)
        : "d".repeat(-alt)
    : alt === 0
      ? "M"
      : alt === -1
        ? "m"
        : alt > 0
          ? "A".repeat(alt)
          : "d".repeat(-alt - 1);
  return num + quality;
}

/**
 * The number of a degree name, without its accidentals.
 * @private
 */
export function degreeNum(degree: ChordDegreeName): number {
  const m = DEGREE.exec(degree);
  return m ? +m[2] : NaN;
}

// The most probable degree of a note that isn't a chord tone, by its distance
// in semitones from the root. Some depend on the chord (see below).
const PROBABLE = [
  "1",
  "b9",
  "9",
  "b3",
  "3",
  "11",
  "#11",
  "5",
  "b13",
  "13",
  "b7",
  "7",
];

/**
 * Get the most probable degree of a note that isn't a chord tone. A minor
 * third is "#9" over a major third, a fourth is "4" in a chord without third
 * and a major sixth is "6" in a chord without seventh.
 * @private
 */
export function probableDegree(
  semitones: number,
  degrees: ChordDegreeName[],
): ChordDegreeName {
  const has = (num: number) => degrees.some((d) => degreeNum(d) === num);
  const s = ((semitones % 12) + 12) % 12;
  return s === 3 && degrees.includes("3")
    ? "#9"
    : s === 5 && !has(3)
      ? "4"
      : s === 9 && !has(7)
        ? "6"
        : PROBABLE[s];
}

/**
 * Sort the degrees of a chord by how much they define it:
 *
 * 1. the third, or for chords without third the 4th, 2nd or 11th that
 *    replaces it
 * 2. the seventh, or the 6th for chords without seventh
 * 3. the fifth, if it's altered
 * 4. the extension that names the chord (the highest one), then the altered
 *    extensions
 * 5. the root
 * 6. the other extensions, implied by the one that names the chord
 * 7. the fifth, if it's natural
 *
 * See `Chord.degreesByImportance` for the sources: Dobbins, *The Contemporary
 * Jazz Pianist* vol. 2; Richards, *Exploring Jazz Piano*; Levine, *The Jazz
 * Piano Book*; DeGreg, *Jazz Keyboard Harmony*; Haerle, *Jazz Piano Voicing
 * Skills*.
 *
 * @private
 */
export function sortByImportance(
  degrees: ChordDegreeName[],
): ChordDegreeName[] {
  const find = (...nums: number[]) =>
    nums
      .map((num) => degrees.find((d) => degreeNum(d) === num))
      .find((d) => d !== undefined);
  const third = find(3, 4, 2, 11);
  const fifth = find(5);
  const seventh = find(7, 6);
  const root = find(1);
  const extensions = degrees.filter(
    (d) => d !== third && d !== fifth && d !== seventh && d !== root,
  );
  const named = extensions.reduce<ChordDegreeName | undefined>(
    (top, d) => (top === undefined || degreeNum(d) > degreeNum(top) ? d : top),
    undefined,
  );
  const isAltered = (d: ChordDegreeName) => d[0] === "b" || d[0] === "#";
  const altered = extensions.filter((d) => d !== named && isAltered(d));
  const implied = extensions.filter((d) => d !== named && !isAltered(d));
  return [
    third,
    seventh,
    fifth !== "5" ? fifth : undefined,
    named,
    ...altered,
    root,
    ...implied,
    fifth === "5" ? fifth : undefined,
  ].filter((d): d is ChordDegreeName => d !== undefined);
}
