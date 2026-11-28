import { get as getChordType } from "@tonaljs/chord-type";
import { transpose as transposeNote } from "@tonaljs/pitch-distance";
import { NoteName, note } from "@tonaljs/pitch-note";
import { ChordDegreeName, degreeToInterval } from "./degrees";
import { tensionsOf } from "./tensions";
import { formula, get, getChord, transpose } from "./index";

type ChordNameOrTokens = Parameters<typeof get>[0];

/** The kind of a substitute, as returned by `Chord.substitutes`. */
export type SubstituteKind =
  | "tritone substitute"
  | "backdoor"
  | "contained"
  | "related ii"
  | "secondary dominant"
  | "substitute dominant"
  | "passing diminished";

/** A substitute: the chords that take a chord's place, and its kind. */
export interface Substitute {
  /** One chord, or two when the substitute adds a chord: ["Dm7", "G7"]. */
  chords: string[];
  kind: SubstituteKind;
}

/** Options of `Chord.substitutes`. */
export interface SubstitutesOptions {
  /** The chord after, like "Dm7": adds the approach chords to it. */
  next?: string;
  /** Only these kinds, like ["tritone substitute"]. */
  kinds?: SubstituteKind[];
  /** The related ii is an m7b5 (for a minor target); by default, on a b9 dominant. */
  minor?: boolean;
}

/** A chord of `Chord.containing`: the chord and the note's degree in it. */
export interface ContainingChord {
  chord: string;
  degree: ChordDegreeName;
}

// The types `contained` looks for, and their symbol after the root
const CONTAINED_TYPES = [
  "M",
  "m",
  "dim",
  "aug",
  "maj7",
  "7",
  "m7",
  "m7b5",
  "dim7",
  "mMaj7",
  "6",
  "m6",
].map((name) => ({
  name,
  symbol: name === "M" ? "" : name,
  intervals: getChordType(name).intervals,
}));

const accidentals = (pc: string) => pc.length - 1;

// A chord with a root (a tonic), or undefined
function rooted(chordName: ChordNameOrTokens) {
  const chord = get(chordName);
  return chord.empty || !chord.tonic ? undefined : chord;
}

const has = (chordName: ChordNameOrTokens, ...degrees: ChordDegreeName[]) => {
  const f = formula(chordName);
  return degrees.every((d) => f.includes(d));
};

// A major 3rd and a minor 7th
const isDominant = (chordName: ChordNameOrTokens) => has(chordName, "3", "b7");

// A perfect 5th: a chord that can be tonicised
const isTarget = (chordName: ChordNameOrTokens) => has(chordName, "5");

// A 7 chord on a root, keeping it as written (no octave)
const seventh = (root: string) => note(root).pc + "7";

/**
 * Get the tritone substitute of a dominant chord: the same type a tritone
 * away, which keeps its 3rd and 7th (swapped) and resolves down a half step.
 * The root is spelled as a diminished 5th or an augmented 4th above, whichever
 * has fewer accidentals (the diminished 5th on a tie). The substitute of the
 * substitute is the chord, spelled as given when its root is natural (F#7
 * gives C7, which gives Gb7). A slash bass moves with the root.
 *
 * It returns "" if the chord isn't a dominant (a major 3rd and a minor 7th)
 * or has no root.
 *
 * @example
 * Chord.tritoneSubstitute("G7"); // => "Db7"
 * Chord.tritoneSubstitute("Db7"); // => "G7"
 * Chord.tritoneSubstitute("F#7"); // => "C7"
 * Chord.tritoneSubstitute("G7b9"); // => "Db7b9"
 * Chord.tritoneSubstitute("Gm7"); // => ""
 */
export function tritoneSubstitute(chordName: string): string {
  const chord = rooted(chordName);
  if (!chord || !isDominant(chordName)) return "";
  const flat = transposeNote(chord.tonic!, "5d");
  const sharp = transposeNote(chord.tonic!, "4A");
  const ivl = accidentals(sharp) < accidentals(flat) ? "4A" : "5d";
  return transpose(chordName, ivl);
}

/**
 * The secondary dominant of a chord: the 7 chord a perfect 5th above its
 * root, which resolves to it ("V7 of" the chord).
 *
 * It returns "" if the chord has no root or no perfect 5th (diminished and
 * augmented chords aren't tonicised).
 *
 * @private
 */
export function secondaryDominant(chordName: string): string {
  const chord = rooted(chordName);
  if (!chord || !isTarget(chordName)) return "";
  return seventh(transposeNote(chord.tonic!, "5P"));
}

/**
 * The related ii of a dominant chord: the m7 a perfect 5th above its
 * root, which goes before it (Dm7 before G7). It's an m7b5 with
 * `minor: true`, for a dominant that resolves to a minor chord; without the
 * option, it's an m7b5 when the dominant has a b9.
 *
 * It returns "" if the chord isn't a dominant (a major 3rd and a minor 7th)
 * or has no root.
 *
 * @private
 */
export function relatedTwo(
  chordName: string,
  options: { minor?: boolean } = {},
): string {
  const chord = rooted(chordName);
  if (!chord || !isDominant(chordName)) return "";
  const minor = options.minor ?? has(chordName, "b9");
  const root = note(transposeNote(chord.tonic!, "5P")).pc;
  return root + (minor ? "m7b5" : "m7");
}

/**
 * The backdoor dominant of a chord: the 7 chord a whole step below its
 * root, which resolves up to it (Bb7 to C, often after Fm7).
 *
 * It returns "" if the chord has no root or no perfect 5th.
 *
 * @private
 */
export function backdoor(chordName: string): string {
  const chord = rooted(chordName);
  if (!chord || !isTarget(chordName)) return "";
  return seventh(transposeNote(chord.tonic!, "-2M"));
}

/**
 * The passing diminished chord between two chords whose roots are a whole
 * step apart, going up: the dim7 a half step below the second chord (its
 * rootless V7b9), as in I-#I°7-ii, ii-#II°7-iii, IV-#IV°7-V or V-#V°7-vi.
 *
 * It returns "" if the second root isn't a major 2nd above the first, as
 * spelled, or a chord has no root.
 *
 * @private
 */
export function passingDiminished(from: string, to: string): string {
  const a = rooted(from);
  const b = rooted(to);
  if (!a || !b) return "";
  const step = transposeNote(a.tonic!, "2M");
  if (note(step).pc !== note(b.tonic!).pc) return "";
  return note(transposeNote(b.tonic!, "-2m")).pc + "dim7";
}

/**
 * The chords built on another tone of a chord with only its notes: Em in
 * Cmaj7, Bm7b5 and Dm6 in G9. They can take the chord's place (a chord on its
 * 3rd is the chord without root). The types are the triads (M, m, dim, aug),
 * the 7th chords (maj7, 7, m7, m7b5, dim7, mMaj7) and 6 and m6:
 *
 * - the notes must be the chord's notes as spelled, not only the same pitch
 *   classes;
 * - on each root, only the largest types (Em7, not Em, when both fit);
 * - a result whose notes are all in another result is dropped (Gm in Cm9,
 *   inside Ebmaj7).
 *
 * In the order of the chord's notes, the largest first. It returns `[]` if
 * the chord has no root.
 *
 * @private
 */
export function contained(chordName: string): string[] {
  const chord = rooted(chordName);
  if (!chord) return [];
  const pcs = new Set(chord.notes.map((n) => note(n).pc));
  const root = note(chord.tonic!).pc;
  const found: { symbol: string; notes: string[] }[] = [];
  for (const tone of chord.notes) {
    const pc = note(tone).pc;
    if (pc === root || found.some((f) => f.symbol.startsWith(pc + "|")))
      continue;
    const fits = CONTAINED_TYPES.map((type) => ({
      symbol: pc + "|" + type.symbol,
      notes: type.intervals.map((ivl) => note(transposeNote(pc, ivl)).pc),
    })).filter((c) => c.notes.every((n) => pcs.has(n)));
    const largest = fits.filter(
      (c) =>
        !fits.some(
          (other) =>
            other.notes.length > c.notes.length &&
            c.notes.every((n) => other.notes.includes(n)),
        ),
    );
    found.push(...largest.sort((a, b) => b.notes.length - a.notes.length));
  }
  return found
    .filter(
      (c) =>
        !found.some(
          (other) =>
            other.notes.length > c.notes.length &&
            c.notes.every((n) => other.notes.includes(n)),
        ),
    )
    .map((c) => c.symbol.replace("|", ""));
}

const PLAIN = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// A root with a double accidental, spelled plainly (Abb is G)
const simpleRoot = (pc: string) =>
  accidentals(pc) < 2 ? pc : PLAIN[note(pc).chroma];

/**
 * Get the chords that have a note as a chord tone or a tension
 * (`Chord.tensions`), with the note's degree in each: the chords that can
 * harmonise a melody note. The types are maj7, 7 and m7 by default (as Pease
 * harmonises a melody note), or `types`.
 *
 * By type, then by degree: the chord tones in the formula's order, then the
 * tensions. A root is spelled by interval from the note, and one with a
 * double accidental is simplified. It returns `[]` for an invalid note or
 * type.
 *
 * @example
 * Chord.containing("C").slice(0, 4); // => [{ chord: "Cmaj7", degree: "1" }, { chord: "Abmaj7", degree: "3" }, { chord: "Fmaj7", degree: "5" }, { chord: "Dbmaj7", degree: "7" }]
 * Chord.containing("C", { types: ["m7b5"] }).map((c) => c.chord); // => ["Cm7b5", "Am7b5", "F#m7b5", "Dm7b5", "Bbm7b5", "Gm7b5", "Em7b5"]
 */
export function containing(
  noteName: NoteName,
  options: { types?: string[] } = {},
): ContainingChord[] {
  const n = note(noteName);
  if (n.empty) return [];
  const types = options.types ?? ["maj7", "7", "m7"];
  const result: ContainingChord[] = [];
  for (const type of types) {
    const chordType = getChordType(type);
    if (chordType.empty) return [];
    const symbol = chordType.aliases.includes(type)
      ? type
      : chordType.aliases[0];
    const f = formula(symbol);
    for (const degree of [...f, ...tensionsOf(f)]) {
      const ivl = degreeToInterval(degree);
      const root = simpleRoot(note(transposeNote(n.pc, "-" + ivl)).pc);
      if (!root || getChord(symbol, root).empty) continue;
      result.push({ chord: root + (symbol === "M" ? "" : symbol), degree });
    }
  }
  return result;
}

/**
 * Get the substitutes of a chord: the chords that can take its place, each
 * with its kind. A substitute is one chord, or two when it adds a chord (the
 * related ii before a dominant, or an approach chord before `next`). Roots
 * are spelled by interval from the chord's root. A dominant has a major 3rd
 * and a minor 7th; a target has a perfect 5th (not diminished or augmented).
 * In this order, skipping what doesn't apply:
 *
 * 1. "tritone substitute": for a dominant, `Chord.tritoneSubstitute`: Db7
 *    for G7;
 * 2. "backdoor": for a dominant, the 7 chord a whole step below its target
 *    (a 4th up): Bb7 for G7;
 * 3. "contained": the triads (M, m, dim, aug), 7th chords (maj7, 7, m7,
 *    m7b5, dim7, mMaj7), 6 and m6 built on another chord tone with only the
 *    chord's notes, as spelled; the largest on each root, and none whose
 *    notes are all in another one: Em for Cmaj7, Bm7b5 and Dm6 for G9;
 * 4. "related ii": for a dominant, the m7 a 5th above its root, then the
 *    chord: Dm7 G7; an m7b5 on a b9 dominant, or with `minor: true`;
 * 5. "secondary dominant": with a target as `next`, the chord, then the 7
 *    chord a 5th above `next`: C A7 before Dm7;
 * 6. "substitute dominant": with `next`, the chord, then the tritone
 *    substitute of that dominant: C Eb7 before Dm7;
 * 7. "passing diminished": with `next` a whole step up (a major 2nd as
 *    spelled), the chord, then the dim7 a half step below `next` (its
 *    rootless V7b9): C C#dim7 before Dm7.
 *
 * An approach chord that is the chord itself is skipped (G7 is already the
 * secondary dominant of C). `kinds` keeps only those kinds, in the same
 * order. It returns `[]` if the chord has no root. `Key.substitutes` adds
 * the key's own: diatonic and borrowed chords.
 *
 * @example
 * Chord.substitutes("G7");
 * // => [{ chords: ["Db7"], kind: "tritone substitute" }, { chords: ["Bb7"], kind: "backdoor" }, { chords: ["Bdim"], kind: "contained" }, { chords: ["Dm7", "G7"], kind: "related ii" }]
 * Chord.substitutes("G9", { kinds: ["contained"] }).map((s) => s.chords[0]); // => ["Bm7b5", "Dm6"]
 * Chord.substitutes("G7", { kinds: ["related ii"], minor: true }); // => [{ chords: ["Dm7b5", "G7"], kind: "related ii" }]
 * Chord.substitutes("C", { next: "Dm7" }).map((s) => s.chords);
 * // => [["C", "A7"], ["C", "Eb7"], ["C", "C#dim7"]]
 */
export function substitutes(
  chordName: string,
  options: SubstitutesOptions = {},
): Substitute[] {
  const chord = rooted(chordName);
  if (!chord) return [];
  const result: Substitute[] = [];
  const kinds = options.kinds;
  const add = (kind: SubstituteKind, ...chords: string[]) => {
    if ((!kinds || kinds.includes(kind)) && chords.every((c) => c))
      result.push({ chords, kind });
  };
  const name = chordName;
  if (isDominant(name)) {
    add("tritone substitute", tritoneSubstitute(name));
    add("backdoor", backdoor(transposeNote(chord.tonic!, "4P")));
  }
  for (const c of contained(name)) add("contained", c);
  if (isDominant(name))
    add("related ii", relatedTwo(name, { minor: options.minor }), name);
  const next = options.next;
  if (next && rooted(next)) {
    const same = (approach: string) =>
      approach && rooted(approach)?.symbol === chord.symbol ? "" : approach;
    const dominant = secondaryDominant(next);
    add("secondary dominant", name, same(dominant));
    add("substitute dominant", name, same(tritoneSubstitute(dominant)));
    add("passing diminished", name, passingDiminished(name, next));
  }
  return result;
}
