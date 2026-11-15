import { describe, expect, test } from "vitest";
import { distance, transpose } from "./index";

/**
 * A second, independent implementation of `distance`, used to find errors.
 *
 * It is not the truth: when it disagrees with `distance`, either one has a
 * bug or they follow different conventions. It works on the written note
 * (letter, accidentals and octave) and shares no code with the coordinate
 * based implementation:
 *
 * - The interval number comes from the letter steps between the two notes,
 *   and the direction from the sign of those steps.
 * - The quality comes from comparing the semitones with the perfect or major
 *   interval of the same number.
 *
 * Conventions it assumes, which are choices rather than facts:
 *
 * - A unison between notes with the same letter and octave goes in the
 *   direction of the sound: C4 to Cb4 is "-1A", not "1d".
 * - Between pitch classes (when either note has no octave) the interval is
 *   simple and ascending by letter: the letter steps are counted upwards,
 *   from 0 to 6, whatever the semitones. So C# to Dbb is "2dd" (not "9dd")
 *   and C to Cb is "1d" (not "8d"). This is how pitchtypes embeds a spelled
 *   interval class as an interval (`SpelledIntervalClass.embed`).
 * - An interval that needs more than four augmented or diminished has no
 *   name in tonal, so it is "".
 */
const LETTERS = "CDEFGAB";
// Semitones of each letter above C, which are also the semitones of the
// perfect or major interval with the same number (1P 2M 3M 4P 5P 6M 7M)
const SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const PERFECTABLE = [true, false, false, true, true, false, false];
const MAX_QUALITY_LENGTH = 4;

type SpelledNote = { letter: number; alt: number; oct?: number };

function parse(name: string): SpelledNote {
  const m = /^([A-G])(#*|b*)(-?\d+)?$/.exec(name);
  if (!m) throw new Error(`The oracle can't parse the note "${name}"`);
  const [, letter, acc, oct] = m;
  return {
    letter: LETTERS.indexOf(letter),
    alt: acc.startsWith("b") ? -acc.length : acc.length,
    oct: oct === undefined ? undefined : Number(oct),
  };
}

const semitonesOf = (note: SpelledNote, oct: number) =>
  oct * 12 + SEMITONES[note.letter] + note.alt;

function quality(simple: number, alt: number): string {
  if (PERFECTABLE[simple]) {
    return alt === 0 ? "P" : alt > 0 ? "A".repeat(alt) : "d".repeat(-alt);
  }
  return alt === 0
    ? "M"
    : alt === -1
      ? "m"
      : alt > 0
        ? "A".repeat(alt)
        : "d".repeat(-alt - 1);
}

function oracleDistance(fromName: string, toName: string): string {
  const from = parse(fromName);
  const to = parse(toName);

  let steps: number;
  let semitones: number;
  let dir: number;
  if (from.oct !== undefined && to.oct !== undefined) {
    steps = to.oct * 7 + to.letter - (from.oct * 7 + from.letter);
    semitones = semitonesOf(to, to.oct) - semitonesOf(from, from.oct);
    dir = steps < 0 || (steps === 0 && semitones < 0) ? -1 : 1;
  } else {
    const above = to.letter < from.letter ? 1 : 0;
    steps = to.letter + 7 * above - from.letter;
    semitones = semitonesOf(to, above) - semitonesOf(from, 0);
    dir = 1;
  }

  const size = steps * dir;
  const simple = size % 7;
  const octaves = Math.floor(size / 7);
  const alt = semitones * dir - (SEMITONES[simple] + 12 * octaves);
  const q = quality(simple, alt);
  if (q.length > MAX_QUALITY_LENGTH) return "";
  return (dir < 0 ? "-" : "") + (size + 1) + q;
}

const hasOctave = (name: string) => parse(name).oct !== undefined;
const pitchClassOf = (name: string) => name.replace(/-?\d+$/, "");

const ACCIDENTALS = ["bb", "b", "", "#", "##"];
// Include octaves outside the MIDI range (C-1 to G9) on purpose
const OCTAVES = [-2, -1, 0, 4, 9, 10];
const PITCH_CLASSES = LETTERS.split("").flatMap((letter) =>
  ACCIDENTALS.map((acc) => letter + acc),
);
const NOTES = OCTAVES.flatMap((oct) => PITCH_CLASSES.map((pc) => pc + oct));
const ALL = [...PITCH_CLASSES, ...NOTES];
const PAIRS = ALL.flatMap((from) => ALL.map((to) => [from, to] as const));

// Reports how many pairs failed and the first few of them
function failures(failed: string[]) {
  return { count: failed.length, first: failed.slice(0, 20) };
}

describe("distance over every pair of notes", () => {
  // This needs no oracle and no conventions: an interval that doesn't lead
  // to the target note is wrong, whatever it is called
  test("transposing by the distance gives back the note", () => {
    const failed: string[] = [];
    for (const [from, to] of PAIRS) {
      // with a pitch class, the distance is between pitch classes
      const pcs = !hasOctave(from) || !hasOctave(to);
      const source = pcs ? pitchClassOf(from) : from;
      const target = pcs ? pitchClassOf(to) : to;
      // the oracle tells which intervals tonal can't name
      if (oracleDistance(from, to) === "") continue;
      const ivl = distance(from, to);
      const result = ivl === "" ? "" : transpose(source, ivl);
      if (result !== target) {
        failed.push(`${from} to ${to} is ${ivl}, but leads to ${result}`);
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });

  // An error finder: a mismatch is either a bug in one of them or a
  // convention to settle (see the oracle's conventions above)
  test("distance agrees with the oracle", () => {
    const failed: string[] = [];
    for (const [from, to] of PAIRS) {
      const expected = oracleDistance(from, to);
      const actual = distance(from, to);
      if (actual !== expected) {
        failed.push(`${from} to ${to}: oracle ${expected}, distance ${actual}`);
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });
});

describe("distance oracle", () => {
  test.each([
    // simple and compound, ascending and descending
    ["C4", "E4", "3M"],
    ["C4", "Eb4", "3m"],
    ["C4", "G4", "5P"],
    ["C4", "F#4", "4A"],
    ["C4", "Gb4", "5d"],
    ["C4", "Dbb4", "2d"],
    ["C4", "C5", "8P"],
    ["C4", "D5", "9M"],
    ["C4", "C3", "-8P"],
    ["C4", "A3", "-3m"],
    ["E4", "C4", "-3M"],
    ["C4", "C4", "1P"],
    ["C4", "C#4", "1A"],
    // the letter decides the direction, even against the sound (#243, #428, #514)
    ["Db4", "C#4", "-2d"],
    ["B#4", "C5", "2d"],
    ["C4", "B#3", "-2d"],
    ["C4", "B##3", "-2dd"],
    ["Cb4", "B#3", "-2dd"],
    ["B#3", "Cb4", "2dd"],
    ["C4", "B#4", "7A"],
    // outside the MIDI range
    ["C10", "B#9", "-2d"],
    ["Cb-1", "B-2", "-2d"],
    // pitch classes are ascending
    ["C", "D", "2M"],
    ["G", "C", "4P"],
    ["C", "B#", "7A"],
    ["Db", "C#", "7A"],
    ["C", "C", "1P"],
    // with a pitch class, the octave is ignored
    ["C", "C2", "1P"],
    ["C2", "C", "1P"],
  ])("fact: %s to %s is %j", (from, to, expected) => {
    expect(oracleDistance(from, to)).toBe(expected);
  });

  test.each([
    // a unison goes in the direction of the sound
    ["C4", "Cb4", "-1A"],
    ["C#4", "C4", "-1A"],
    // pitch classes give simple intervals, ascending by letter
    ["C#", "Db", "2d"],
    ["C#", "Dbb", "2dd"],
    ["C", "Cb", "1d"],
    ["C#", "C", "1d"],
    // beyond four augmented, tonal has no name
    ["Fbb4", "B##4", ""],
  ])("convention: %s to %s is %j", (from, to, expected) => {
    expect(oracleDistance(from, to)).toBe(expected);
  });

  test("transposing by the oracle's interval gives back the note", () => {
    const failed: string[] = [];
    for (const [from, to] of PAIRS) {
      // with a pitch class, transpose can't give back the octave
      if (hasOctave(from) !== hasOctave(to)) continue;
      const ivl = oracleDistance(from, to);
      if (ivl === "") continue;
      const result = transpose(from, ivl);
      if (result !== to) failed.push(`${from} + ${ivl} = ${result}, not ${to}`);
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });
});
