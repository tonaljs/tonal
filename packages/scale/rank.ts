import { get as getChord } from "@tonaljs/chord";
import { transpose } from "@tonaljs/pitch-distance";
import { note } from "@tonaljs/pitch-note";
import { get as getScaleType } from "@tonaljs/scale-type";

/** A scale ranked by `Scale.rank`. */
export interface RankedScale {
  /** The scale name, like "F major". */
  name: string;
  tonic: string;
  type: string;
  /** How many of the input pitch classes (notes and chord notes) are in the scale. */
  matched: number;
  /** The scale notes not in the input (notes and chord notes), spelled as in the scale. */
  missing: string[];
  /** The input notes (and chord notes) not in the scale, as given. */
  outside: string[];
  /** The input chords with a note outside the scale, as given. */
  chordsOutside: string[];
}

/** Options of `Scale.rank`. */
export interface RankOptions {
  /** Chord symbols that the scale should hold, like ["Dm7", "G7", "Cmaj7"]. */
  chords?: string[];
  /** The scale types to try, instead of the common ones. */
  types?: string[];
  /** The number of results to return. */
  limit?: number;
}

/** The default types, in tiers of commonness. */
const TIERS: string[][] = [
  ["major", "minor"],
  ["harmonic minor", "melodic minor"],
  [
    "dorian",
    "phrygian",
    "lydian",
    "mixolydian",
    "locrian",
    "major pentatonic",
    "minor pentatonic",
  ],
  ["major blues", "minor blues"],
];
const DEFAULT_TYPES = TIERS.flat();
const tierOf = (type: string) => {
  const i = TIERS.findIndex((tier) => tier.includes(type));
  return i === -1 ? TIERS.length : i;
};

const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");

const accidentals = (names: string[]) =>
  names.reduce((sum, n) => sum + Math.abs(note(n).alt), 0);

type Parsed = { name: string; chroma: number };
type ParsedChord = { name: string; root: number; chromas: number[] };

/**
 * Rank the scales that fit a set of notes (and chords), best first: "which
 * scale is this?". Every tonic is tried with every type of `types` (by
 * default, the common ones: major and minor; harmonic and melodic minor; the
 * modes and the pentatonics; the blues scales). A scale is listed when it
 * holds at least one note or chord. The first difference decides:
 *
 * 1. more input notes in the scale (`matched`, by pitch class; the chords'
 *    notes count as input notes);
 * 2. more input chords in the scale (every note of the chord);
 * 3. an exact fit: no scale note missing from the input (C D E G A is C
 *    major pentatonic before C major);
 * 4. a more common type: major and minor, then harmonic and melodic minor,
 *    then the modes and pentatonics, then the blues scales, then any other;
 * 5. evidence of the tonic: the first and the last chord on it, then the
 *    chords on it, then the first and the last note on it, then the times
 *    it's played, then the chords and the notes on the 5th;
 * 6. the type's order, then the tonic's name.
 *
 * So the notes of F major give F major and D minor (equally common) first,
 * and D minor leads when the notes start or end on D. The tonic is spelled
 * as an input note or chord root when one has its pitch class, and
 * otherwise as the spelling whose scale has more input notes as written,
 * then fewer accidentals (Bb major, not A# major).
 *
 * It returns `[]` without valid notes or chords.
 *
 * @param notes - note names (pitch classes or with octave); can be `[]` with `chords`
 * @param options - `chords`, `types` (scale type names) and `limit`
 * @example
 * Scale.rank(["F", "G", "A", "Bb", "C", "D", "E"]).slice(0, 2).map((s) => s.name); // => ["F major", "D minor"]
 * Scale.rank(["D", "E", "F", "G", "A", "Bb", "C", "D"])[0].name; // => "D minor"
 * Scale.rank([], { chords: ["Am", "Dm", "E7"] })[0].name; // => "A harmonic minor"
 * Scale.rank(["C", "D", "E", "G", "A"], { limit: 1 });
 * // => [{ name: "C major pentatonic", tonic: "C", type: "major pentatonic", matched: 5, missing: [], outside: [], chordsOutside: [] }]
 */
export function rank(
  notes: string[],
  options: RankOptions = {},
): RankedScale[] {
  const input: Parsed[] = (Array.isArray(notes) ? notes : [])
    .map((n) => note(n))
    .filter((n) => !n.empty)
    .map((n) => ({ name: n.pc, chroma: n.chroma }));
  const chords: ParsedChord[] = (options.chords ?? [])
    .map((name) => ({ name, chord: getChord(name) }))
    .filter(({ chord }) => !chord.empty && chord.tonic)
    .map(({ name, chord }) => ({
      name,
      root: note(chord.tonic!).chroma,
      chromas: chord.notes.map((n) => note(n).chroma),
    }));
  if (!input.length && !chords.length) return [];

  // the notes to fit: the input notes and the chords' notes
  const pool: Parsed[] = [
    ...input,
    ...(options.chords ?? []).flatMap((name) =>
      getChord(name).notes.map((n) => ({
        name: note(n).pc,
        chroma: note(n).chroma,
      })),
    ),
  ];
  const pcs = new Set(pool.map((n) => n.chroma));
  const written = new Map<number, string>();
  for (const n of input)
    if (!written.has(n.chroma)) written.set(n.chroma, n.name);
  for (const c of options.chords ?? []) {
    const tonic = getChord(c).tonic;
    if (tonic) {
      const pc = note(tonic);
      if (!written.has(pc.chroma)) written.set(pc.chroma, pc.pc);
    }
  }
  const inputNames = new Set(pool.map((n) => n.name));
  const types = (options.types ?? DEFAULT_TYPES)
    .map((name) => getScaleType(name))
    .filter((t) => !t.empty);

  type Candidate = RankedScale & { key: number[] };
  const candidates: Candidate[] = [];
  types.forEach((type, typeIndex) => {
    for (let chroma = 0; chroma < 12; chroma++) {
      const tonic = spell(chroma, type.intervals);
      const scale = type.intervals.map((ivl) => note(transpose(tonic, ivl)).pc);
      const scalePcs = new Set(scale.map((n) => note(n).chroma));
      const matched = [...pcs].filter((pc) => scalePcs.has(pc)).length;
      const fits = chords.filter((c) =>
        c.chromas.every((pc) => scalePcs.has(pc)),
      );
      if (!matched && !fits.length) continue;
      const fifth = (chroma + 7) % 12;
      const first = (list: { chroma?: number; root?: number }[], pc: number) =>
        list.length
          ? +(at(list[0]) === pc) + +(at(list[list.length - 1]) === pc)
          : 0;
      const missing = scale.filter((n) => !pcs.has(note(n).chroma));
      candidates.push({
        name: `${tonic} ${type.name}`,
        tonic,
        type: type.name,
        matched,
        missing,
        outside: unique(
          pool.filter((n) => !scalePcs.has(n.chroma)).map((n) => n.name),
        ),
        chordsOutside: chords
          .filter((c) => !fits.includes(c))
          .map((c) => c.name),
        key: [
          -matched,
          -fits.length,
          missing.length ? 1 : 0,
          tierOf(type.name),
          -first(chords, chroma),
          -chords.filter((c) => c.root === chroma).length,
          -first(input, chroma),
          -input.filter((n) => n.chroma === chroma).length,
          -chords.filter((c) => c.root === fifth).length,
          -input.filter((n) => n.chroma === fifth).length,
          typeIndex,
        ],
      });
    }
  });

  // the tonic as written in the input, or the spelling that fits it best
  function spell(chroma: number, intervals: string[]): string {
    const given = written.get(chroma);
    if (given) return given;
    const options = [SHARPS[chroma], FLATS[chroma]].map((tonic) => {
      const scale = intervals.map((ivl) => note(transpose(tonic, ivl)).pc);
      const same = scale.filter((n) => inputNames.has(n)).length;
      return { tonic, same, acc: accidentals(scale) };
    });
    options.sort((a, b) => b.same - a.same || a.acc - b.acc);
    return options[0].tonic;
  }

  candidates.sort((a, b) => {
    for (let i = 0; i < a.key.length; i++) {
      if (a.key[i] !== b.key[i]) return a.key[i] - b.key[i];
    }
    return a.tonic < b.tonic ? -1 : a.tonic > b.tonic ? 1 : 0;
  });
  const limit = options.limit ?? candidates.length;
  return candidates
    .slice(0, Math.max(0, limit))
    .map(({ key: _key, ...rest }) => rest);
}

const at = (item: { chroma?: number; root?: number }) =>
  item.root ?? item.chroma;

const unique = (list: string[]) => [...new Set(list)];
