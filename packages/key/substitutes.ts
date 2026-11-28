import {
  get as getChord,
  substitutes as chordSubstitutes,
  type Substitute,
  type SubstituteKind,
} from "@tonaljs/chord";
import { transpose } from "@tonaljs/note";
import { note } from "@tonaljs/pitch-note";
import { get as roman } from "@tonaljs/roman-numeral";
import { keyForms, numeralOf, parse } from "./analyze";
import type { KeyScale } from "./index";

/** A chord borrowed from a parallel scale, as returned by `Key.borrowedChords`. */
export interface BorrowedChord {
  /** The chord, like "Abmaj7". */
  chord: string;
  /** Its numeral in the key, like "bVImaj7". */
  numeral: string;
  /** The scale it comes from, like "C minor" or "C phrygian". */
  from: string;
  /** The numerals of the key's chords it replaces, like ["iv"]. */
  replaces: string[];
}

/** The kind of a substitute in a key, as returned by `Key.substitutes`. */
export type KeySubstituteKind = SubstituteKind | "diatonic" | "borrowed";

/** A substitute in a key: the chords that take a chord's place, and its kind. */
export interface KeySubstitute {
  chords: string[];
  kind: KeySubstituteKind;
}

/** Options of `Key.substitutes`. */
export interface KeySubstitutesOptions {
  /** The chord after, like "Dm7": adds the approach chords to it. */
  next?: string;
  /** Only these kinds, like ["diatonic", "borrowed"]. */
  kinds?: KeySubstituteKind[];
  /**
   * The related ii is an m7b5. By default, when the dominant's target (a 4th
   * up) is a minor chord of the key, or the dominant has a b9.
   */
  minor?: boolean;
}

// The same pitch classes (a chord's `chroma` is its type's, from the root)
const pcs = (name: string) =>
  getChord(name)
    .notes.map((n) => note(n).chroma)
    .sort((a, b) => a - b)
    .join(",");

type Borrowing = [ivl: string, type: string, from: string, replaces: string[]];

// Pease, Jazz Composition (pp. 75-76): modal interchange into a major key
const INTO_MAJOR: Borrowing[] = [
  ["2M", "m7b5", "minor", ["ii7"]],
  ["3m", "maj7", "minor", ["IV", "V7"]],
  ["4P", "m7", "minor", ["IV"]],
  ["4P", "m6", "minor", ["IV"]],
  ["5P", "m7", "minor", ["V7"]],
  ["6m", "maj7", "minor", ["iv"]],
  ["7m", "7", "minor", ["iv"]],
  ["2m", "maj7", "phrygian", ["iv"]],
  ["7m", "maj7", "mixolydian", ["IV"]],
  ["1P", "maj7#11", "lydian", ["I"]],
];

// Into a minor key, from the parallel major: Jazzology (ch. 7, "Modal
// Interchange in Minor Keys"): the major tonic (Picardy 3rd), the most
// common, and the ii7 for the ii7b5; Pease (Jazz Composition, p. 76): the
// IVmaj7 for the IV7 (from major into Dorian)
const INTO_MINOR: Borrowing[] = [
  ["1P", "maj7", "major", ["i"]],
  ["2M", "m7", "major", ["ii7b5"]],
  ["4P", "maj7", "major", ["IV7"]],
];

type KeyFns = {
  majorKey: (tonic: string) => KeyScale;
  minorKey: (tonic: string) => { natural: KeyScale };
};

export function borrowedChordsOf(key: string, fns: KeyFns): BorrowedChord[] {
  const forms = keyForms(key, fns.majorKey, fns.minorKey as never);
  if (!forms) return [];
  const { tonic } = forms;
  const table = forms.minor ? INTO_MINOR : INTO_MAJOR;
  return table.map(([ivl, type, from, replaces]) => {
    const chord = note(transpose(tonic, ivl)).pc + type;
    return {
      chord,
      numeral: numeralOf(tonic, parse(chord)!),
      from: `${tonic} ${from}`,
      replaces: replaces.slice(),
    };
  });
}

// Does a chord play a numeral of the key: the same root (as a degree of the
// key, with its alteration), the same 3rd (case), and a dominant for an
// uppercase numeral with a 7?
function plays(tonic: string, chordName: string, numeral: string): boolean {
  const r = roman(numeral);
  const chord = getChord(chordName);
  if (r.empty || chord.empty || !chord.tonic) return false;
  const expected = transpose(tonic, r.interval);
  if (note(expected).chroma !== note(chord.tonic).chroma) return false;
  const ivls = chord.intervals;
  const third = r.major ? "3M" : "3m";
  if (!ivls.includes(third)) return false;
  if (r.major && r.chordType === "7") return ivls.includes("7m");
  return true;
}

export function keySubstitutes(
  key: string,
  chordName: string,
  options: KeySubstitutesOptions,
  fns: KeyFns,
): KeySubstitute[] {
  const forms = keyForms(key, fns.majorKey, fns.minorKey as never);
  const parsed = parse(chordName);
  if (!forms || !parsed) return [];
  const { kinds } = options;
  const wants = (kind: KeySubstituteKind) => !kinds || kinds.includes(kind);

  // the related ii is minor when the dominant's target is a minor chord
  let minor = options.minor;
  if (minor === undefined) {
    const target = note(transpose(parsed.root, "4P")).pc;
    const i = forms.scale.indexOf(target);
    if (i !== -1 && forms.triads[i] === "m") minor = true;
  }
  const chordKinds = kinds?.filter(
    (k): k is SubstituteKind => k !== "diatonic" && k !== "borrowed",
  );
  const result: KeySubstitute[] = chordSubstitutes(chordName, {
    next: options.next,
    kinds: chordKinds,
    minor,
  }).map((s: Substitute) => ({ chords: s.chords, kind: s.kind }));

  // diatonic: the key's chords with the same function, triads for a triad
  const scale = forms.minor
    ? fns.minorKey(forms.tonic).natural
    : fns.majorKey(forms.tonic);
  if (wants("diatonic")) {
    const triad = parsed.intervals.length === 3;
    const chords = triad ? scale.triads : scale.chords;
    // a chord of the key: its root a degree, its notes in the scale
    const degree = scale.scale.indexOf(note(parsed.root).pc);
    const inKey = parsed.notes.every((n) => scale.scale.includes(note(n).pc));
    if (degree !== -1 && inKey) {
      const fn = scale.chordsHarmonicFunction[degree];
      scale.chordsHarmonicFunction.forEach((f, i) => {
        if (i !== degree && f === fn) {
          result.push({ chords: [chords[i]], kind: "diatonic" });
        }
      });
    }
  }

  // borrowed: the chords that replace the chord's numeral
  if (wants("borrowed")) {
    for (const b of borrowedChordsOf(key, fns)) {
      const same = pcs(b.chord) === pcs(parsed.symbol);
      if (
        !same &&
        b.replaces.some((n) => plays(forms.tonic, parsed.symbol, n))
      ) {
        result.push({ chords: [b.chord], kind: "borrowed" });
      }
    }
  }
  return result;
}
