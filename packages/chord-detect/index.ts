import { all, ChordType } from "@tonaljs/chord-type";
import { modes } from "@tonaljs/pcset";
import { transpose } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { note } from "@tonaljs/pitch-note";

interface FoundChord {
  readonly weight: number;
  readonly name: string;
}

const namedSet = (notes: string[]) => {
  const pcToName = notes.reduce<Record<number, string>>((record, n) => {
    const chroma = note(n).chroma;
    if (chroma !== undefined) {
      record[chroma] = record[chroma] || note(n).name;
    }
    return record;
  }, {});

  return (chroma: number) => pcToName[chroma];
};

// The intervals of a chord type within an octave ("13m" is "6m")
const simpleIntervals = (chordType: ChordType): string[] =>
  chordType.intervals.map((name) => {
    const ivl = interval(name);
    return `${((ivl.simple - 1) % 7) + 1}${ivl.q}`;
  });

/**
 * A chord type that is rarely the name of its notes, adapted from sharp11's
 * "reasonable" test:
 *
 * - No perfect fifth, unless the name states an altered one (a diminished
 *   fifth with a minor third or a seventh, an augmented fifth without a minor
 *   third) or it's a dominant chord without its fifth (C7no5, C7b13).
 *   E G C is C/E, not Em#5; C F Bb Eb is F7sus4/C, not Cquartal.
 * - A fifth, a minor third and a minor sixth: E G B C is Cmaj7/E, not Emb6.
 * - A sixth with an added fourth and no seventh.
 * - A diminished seventh with a major seventh: C Eb Gb A B is B7b9/C, not
 *   Co7M7.
 */
const isUnusual = (chordType: ChordType): boolean => {
  const ivls = simpleIntervals(chordType);
  const has = (ivl: string) => ivls.includes(ivl);
  const third = has("3M") || has("3m");
  const seventh = has("7M") || has("7m");
  const alteredFifth =
    (has("5d") && (has("3m") || seventh)) || (has("5A") && !has("3m"));
  const dominant = has("3M") && has("7m");
  return (
    (!has("5P") && !alteredFifth && !dominant) ||
    ((has("5P") || has("5d")) && has("3m") && has("6m")) ||
    (third && !seventh && has("6M") && has("4P")) ||
    (has("5d") && has("6M") && has("7M"))
  );
};

type DetectOptions = {
  assumePerfectFifth: boolean;
  /** Chord types to leave out, by name or alias: `["quartal", "m#5"]` */
  exclude: string[];
};
/**
 * Find the chord symbols that have the notes of a list, best first. It
 * returns `[]` if no chord matches or no note is valid.
 *
 * The first note is the bass, or the lowest note if every note has an octave.
 * Names over the bass come first, then inversions (`"CM/E"`), then unusual
 * readings (Em#5 for E G C). Among names with the same notes and root, the one
 * whose intervals spell the given notes comes first.
 *
 * Options: `assumePerfectFifth` finds chords whose fifth is missing from the
 * notes, and `exclude` is a list of chord type names or symbols to leave out.
 *
 * @example
 * Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
 * Chord.detect(["E4", "G4", "C5"]); // => ["CM/E", "Em#5"]
 * Chord.detect(["C", "E", "B"], { assumePerfectFifth: true }); // => ["Cmaj7"]
 * Chord.detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] }); // => ["F7sus4/C", "Bbsus24/C"]
 */
export function detect(
  source: string[],
  options: Partial<DetectOptions> = {},
): string[] {
  const valid = source.map((n) => note(n)).filter((n) => !n.empty);
  if (valid.length === 0) {
    return [];
  }
  // With octaves, the lowest note is the bass, whatever the order
  const withOctaves = valid.every((n) => n.oct !== undefined);
  const lowest = withOctaves
    ? valid.reduce((low, n, i) => (n.height < valid[low].height ? i : low), 0)
    : 0;
  const notes = [valid[lowest], ...valid.filter((_, i) => i !== lowest)].map(
    (n) => n.pc,
  );

  const found: FoundChord[] = findMatches(notes, 1, options);

  return found
    .filter((chord) => chord.weight)
    .sort((a, b) => b.weight - a.weight)
    .map((chord) => chord.name);
}

/* tslint:disable:no-bitwise */
const BITMASK = {
  // 3m 000100000000
  // 3M 000010000000
  anyThirds: 384,
  // 5P 000000010000
  perfectFifth: 16,
  // 5d 000000100000
  // 5A 000000001000
  nonPerfectFifths: 40,
  anySeventh: 3,
};

const testChromaNumber = (bitmask: number) => (chromaNumber: number) =>
  Boolean(chromaNumber & bitmask);
const hasAnyThird = testChromaNumber(BITMASK.anyThirds);
const hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth);
const hasAnySeventh = testChromaNumber(BITMASK.anySeventh);
const hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);

function hasAnyThirdAndPerfectFifthAndAnySeventh(chordType: ChordType) {
  const chromaNumber = parseInt(chordType.chroma, 2);
  return (
    hasAnyThird(chromaNumber) &&
    hasPerfectFifth(chromaNumber) &&
    hasAnySeventh(chromaNumber)
  );
}

function withPerfectFifth(chroma: string): string {
  const chromaNumber = parseInt(chroma, 2);
  return hasNonPerfectFifth(chromaNumber)
    ? chroma
    : (chromaNumber | 16).toString(2);
}

/* tslint:enable:no-bitwise */

type FindMatchesOptions = DetectOptions;
function findMatches(
  notes: string[],
  weight: number,
  options: Partial<FindMatchesOptions>,
): FoundChord[] {
  const tonic = notes[0];
  const tonicChroma = note(tonic).chroma;
  const noteName = namedSet(notes);
  // we need to test all chromas to get the correct baseNote
  const allModes = modes(notes, false);

  const exclude = options.exclude ?? [];
  const isExcluded = (chordType: ChordType) =>
    exclude.some((t) => t === chordType.name || chordType.aliases.includes(t));

  const found: FoundChord[] = [];
  allModes.forEach((mode, index) => {
    const modeWithPerfectFifth =
      options.assumePerfectFifth && withPerfectFifth(mode);
    // some chords could have the same chroma but different interval spelling
    const chordTypes = all().filter((chordType) => {
      if (isExcluded(chordType)) return false;
      if (
        options.assumePerfectFifth &&
        hasAnyThirdAndPerfectFifthAndAnySeventh(chordType)
      ) {
        return chordType.chroma === modeWithPerfectFifth;
      }
      return chordType.chroma === mode;
    });

    // Types with the same notes but other spellings: the type that spells
    // more of the given notes goes first (Eb G B D is Ebmaj7#5, not EbM7b6)
    const baseNote = noteName(index);
    const spelled = (chordType: ChordType) =>
      chordType.intervals.filter((ivl) =>
        notes.includes(transpose(baseNote, ivl)),
      ).length;
    chordTypes.sort((a, b) => spelled(b) - spelled(a));

    // Unusual readings go after the others, inversions included, unless the
    // same notes over the same root have a usual name too
    const rarity = chordTypes.every(isUnusual) ? 0.1 : 1;

    chordTypes.forEach((chordType) => {
      const chordName = chordType.aliases[0];
      const isInversion = index !== tonicChroma;
      if (isInversion) {
        found.push({
          weight: 0.5 * rarity * weight,
          name: `${baseNote}${chordName}/${tonic}`,
        });
      } else {
        found.push({
          weight: rarity * weight,
          name: `${baseNote}${chordName}`,
        });
      }
    });
  });

  return found;
}

/** @deprecated */
export default { detect };
