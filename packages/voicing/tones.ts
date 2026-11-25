import {
  degreeOf,
  degreesByImportance,
  formula,
  get as getChord,
  noteOf,
} from "@tonaljs/chord";
import { get as getNote } from "@tonaljs/note";

/** Who plays the chord's bass note (the root, or the bass of a slash chord). */
export type VoicingBass = "none" | "root" | "external";

/** The tensions a voicing can add to a chord, by their role. @private */
type Tensions = {
  /** Tensions that replace the root (alternatives). */
  root: string[];
  /** Tensions that replace the 5th (alternatives). */
  fifth: string[];
  /** Tensions added only when there are voices left, in this order. */
  extras: string[];
};

/**
 * The tensions `extensions: "available"` adds, by chord family. A tension that
 * replaces the root or the 5th takes its place among the most important
 * tones; the extras are used only when there are voices left.
 *
 * Sources:
 *
 * - John Novello, *The Contemporary Keyboardist* (1986), "tension
 *   substitutions": on maj7 the 9 for the root; on m7 the 9 for the root; on
 *   dominants the 9, b9 or #9 for the root and the 13, b13 or #11 for the 5th.
 * - Mark Levine, *The Jazz Piano Book* (1989), ch. 7, and Rawlins & Bahha,
 *   *Jazzology* (2005), pp. 67-69: rootless voicings 3-5-7-9 on maj7 and m7
 *   and 3-13-7-9 on dominants ("the 5th is often replaced by the 13th").
 * - Phil DeGreg, *Jazz Keyboard Harmony* (1994), chs. 4-6: the root stays in
 *   m7b5 and dim7 rootless voicings (3-b5-7-R, 3-5-7-R); dim7 tensions are a
 *   whole step above each chord tone.
 * - Bill Dobbins, *The Contemporary Jazz Pianist*, vol. 1, pp. 8-17: the
 *   tensions of each quality, and the 11th as the common tension of m7b5.
 *
 * @private
 */
export const AVAILABLE: Record<string, Tensions> = {
  major: { root: ["9"], fifth: [], extras: ["13"] },
  minor: { root: ["9"], fifth: [], extras: ["11"] },
  dominant: { root: ["9"], fifth: ["13"], extras: [] },
  altered: { root: ["b9", "#9"], fifth: ["b13", "#5"], extras: ["#11"] },
  suspended: { root: ["9"], fifth: ["13"], extras: [] },
  "half-diminished": { root: [], fifth: [], extras: ["11", "9"] },
  diminished: { root: [], fifth: [], extras: ["7", "11", "b13", "9"] },
};

// The families whose root stays in a rootless voicing
const KEEP_ROOT = ["half-diminished", "diminished"];
const ALTERED = ["b9", "#9", "#5", "b13", "#11", "b5"];

const degreeNum = (degree: string) => +(degree.match(/\d+$/)?.[0] ?? NaN);

/** The tones of a chord for a voicing, as degree names. @private */
export type VoicingTones = {
  /** The chord degrees of each voice (with doublings), most important first. */
  degrees: string[];
  /** The note name (pitch class) of each degree. */
  notes: string[];
};

export type ToneOptions = {
  voices?: number;
  extensions?: string[] | "available";
  bass?: VoicingBass;
  degrees?: string[];
  /** A melody note on top: its pitch class is always in the voicing. */
  lead?: string;
};

/** The chord's bass degree, its tones and family. @private */
export function chordInfo(symbol: string) {
  const chord = getChord(symbol);
  if (chord.empty || !chord.tonic) return undefined;
  const degrees = formula(symbol);
  const bassDegree = chord.bass ? degreeOf(symbol, chord.bass) || "" : "1";
  const altered = degrees.some((d) => ALTERED.includes(d));
  const family =
    chord.family === "dominant" && altered ? "altered" : chord.family;
  return { chord, degrees, bassDegree, family };
}

/**
 * Choose the tones of each voice of a chord: one or more lists of degrees
 * (the ties of the rule give several), with their notes.
 *
 * The rule: the bass degree first when the voicing carries its own bass;
 * then the guide tones (3rd and 7th); the 5th when it's altered; the
 * extensions written in the symbol (`Chord.degreesByImportance`); the root
 * slot (the root, or the tension that replaces it); the 5th slot (the 5th, or
 * the tension that replaces it); the extra tensions; and the bass degree
 * again when a bass part plays it, as a doubling.
 *
 * The 3rd and 7th tie when only one fits, and so do the root slot and the
 * 5th slot: every tied option is returned, and the voice leading chooses.
 *
 * @private
 */
export function chooseTones(
  symbol: string,
  options: ToneOptions = {},
): VoicingTones[] {
  const info = chordInfo(symbol);
  if (!info) return [];
  const { degrees, bassDegree, family } = info;
  const bass = options.bass ?? "none";
  const noteFor = (degree: string) => noteOf(symbol, degree);

  // explicit degrees: a plain number is the chord's own degree with that
  // number ("3" is the b3 of a minor chord), as in Phil DeGreg's *Jazz Keyboard
  // Harmony*; otherwise the degree counted from the major scale of the root
  if (options.degrees) {
    const own = (d: string) =>
      /^\d+$/.test(d)
        ? (degrees.find((c) => degreeNum(c) === +d) ?? d)
        : d === "R"
          ? "1"
          : d;
    const list = options.degrees.map(own).filter((d) => noteFor(d) !== "");
    if (!list.length) return [];
    return withDoublings(list, options.voices ?? list.length, [], noteFor);
  }

  const find = (...nums: number[]) =>
    nums
      .map((n) => degrees.find((d) => degreeNum(d) === n))
      .find((d) => d !== undefined);
  const third = find(3, 4, 2, 11);
  const seventh = find(7, 6);
  const fifth = find(5);
  const required = degreesByImportance(symbol).filter(
    (d) => ![third, seventh, fifth, "1"].includes(d) && d !== bassDegree,
  );

  // the tensions allowed, by role
  const table = AVAILABLE[family] ?? { root: [], fifth: [], extras: [] };
  const asked = options.extensions ?? [];
  const allowed = (d: string) =>
    asked === "available" ? true : asked.includes(d);
  const conflicts = (d: string) =>
    family !== "diminished" &&
    degrees.some((c) => c !== d && degreeNum(c) === degreeNum(d));
  const pick = (list: string[]) =>
    list.filter((d) => allowed(d) && !conflicts(d) && noteFor(d) !== "");
  const explicitExtras =
    asked === "available"
      ? []
      : asked.filter(
          (d) =>
            ![...table.root, ...table.fifth, ...table.extras].includes(d) &&
            !conflicts(d) &&
            noteFor(d) !== "",
        );

  // Who plays the bass degree: the bass part (root, external) or this voicing
  const bassElsewhere = bass !== "none";
  const keepRoot = KEEP_ROOT.includes(family);

  const slots: string[][] = [];
  if (!bassElsewhere) slots.push([bassDegree]);
  if (bassDegree !== "1") slots.push(["1"]); // the root, if the bass doesn't play it
  const guides = [third, seventh].filter(
    (d): d is string => !!d && !(bassElsewhere && d === bassDegree),
  );
  guides.forEach((g) => slots.push([g]));
  if (fifth && fifth !== "5") slots.push([fifth]);
  required.forEach((d) => slots.push([d]));

  const rootSlotIndex = slots.length;
  const rootTensions = pick(table.root);
  if (bassElsewhere && bassDegree === "1") {
    if (rootTensions.length) slots.push(rootTensions);
    else if (keepRoot && bass === "external") slots.push(["1"]);
    else slots.push([]);
  } else {
    // the root is played by this voicing: a root tension is a colour that
    // competes with the 5th (R-3 | 7-9 against R-7 | 3-5)
    slots.push(bassElsewhere ? [] : rootTensions);
  }
  const fifthTensions = pick(table.fifth);
  const naturalFifth =
    fifth === "5" && !(bassElsewhere && bassDegree === "5") ? ["5"] : [];
  slots.push(fifthTensions.length ? fifthTensions : naturalFifth);
  pick(table.extras).forEach((d) => slots.push([d]));
  explicitExtras.forEach((d) => slots.push([d]));
  if (fifthTensions.length && naturalFifth.length) slots.push(naturalFifth);
  if (bass === "root") slots.push([bassDegree]);

  // the lead (a melody note) is always in the voicing
  const lead = options.lead ? degreeOf(symbol, options.lead) : "";

  // Walk the slots, branching on alternatives and ties
  const voices = options.voices ?? defaultVoices(degrees, bass, bassDegree);
  const results: string[][] = [];
  const walk = (i: number, chosen: string[]) => {
    if (chosen.length === voices || i >= slots.length) {
      results.push(chosen);
      return;
    }
    const slot = slots[i].filter((d) => !chosen.includes(d));
    if (!slot.length) return walk(i + 1, chosen);
    slot.forEach((d) => walk(i + 1, [...chosen, d]));
  };
  walk(0, []);

  // ties: one guide instead of the other; the 5th slot instead of the root slot
  const ties: string[][] = [];
  for (const r of results) {
    const g = guides.filter((x) => r.includes(x));
    if (guides.length === 2 && g.length === 1) {
      const other = guides.find((x) => x !== g[0])!;
      ties.push(r.map((x) => (x === g[0] ? other : x)));
    }
    const rootSlot = slots[rootSlotIndex];
    const fifthSlot = slots[rootSlotIndex + 1];
    const usedRoot = r.find((x) => rootSlot.includes(x));
    const usesFifth = r.some((x) => fifthSlot.includes(x));
    if (usedRoot && !usesFifth && r[r.length - 1] === usedRoot) {
      fifthSlot.forEach((f) =>
        ties.push(r.map((x) => (x === usedRoot ? f : x))),
      );
    }
  }

  const sets = unique([...results, ...ties]).map((set) =>
    lead && !set.includes(lead)
      ? [...set.slice(0, Math.max(0, voices - 1)), lead]
      : set,
  );
  const doubling = [
    ...(lead ? [lead] : []),
    ...(bass === "external" ? [] : ["1"]),
    ...(fifth ? [fifth] : []),
  ];
  return unique(sets).flatMap((set) =>
    withDoublings(set, voices, doubling, noteFor),
  );
}

// The number of voices when not given: the chord's tones not played by a
// bass part
function defaultVoices(
  degrees: string[],
  bass: VoicingBass,
  bassDegree: string,
) {
  const all = degrees.includes(bassDegree)
    ? degrees.length
    : degrees.length + 1;
  return bass === "none" ? all : all - 1;
}

function withDoublings(
  set: string[],
  voices: number,
  doubling: string[],
  noteFor: (d: string) => string,
): VoicingTones[] {
  const degrees = [...set];
  const cycle = doubling.filter((d) => noteFor(d) !== "");
  for (let i = 0; degrees.length < voices && cycle.length; i++) {
    degrees.push(cycle[i % cycle.length]);
  }
  if (degrees.length < voices) return [];
  return [
    {
      degrees,
      notes: degrees.map((d) => getNote(noteFor(d)).pc),
    },
  ];
}

function unique(sets: string[][]): string[][] {
  const seen = new Set<string>();
  return sets.filter((s) => {
    const key = [...s].sort().join(" ");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
