import { get as getChord } from "@tonaljs/chord";
import { get as getChordType } from "@tonaljs/chord-type";
import { transpose } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { note } from "@tonaljs/pitch-note";
import { get as romanNumeral } from "@tonaljs/roman-numeral";

/** What a named progression does. */
export type PatternFamily =
  "cadence" | "turnaround" | "launcher" | "pop" | "blues";

/** A named progression: its numerals from the tonic, and what it does. */
export type Pattern = {
  /** Its common name, or its numerals when it has none: "ii–V–I" */
  name: string;
  /** Other names: Elliott's and Cork's ("regular cadence", "POT"…), others in use */
  aliases: string[];
  /** One numeral per chord; `|` separates alternatives ("IIm7|IIm7b5") */
  numerals: string[];
  /** cadence (lands on a tonic), turnaround (back to the dominant), launcher (an approach), pop, blues */
  family: PatternFamily;
};

/** Where a pattern appears in a list of chords. */
export type PatternMatch = {
  /** The pattern's name ("" for numerals that aren't in the catalogue) */
  name: string;
  /** The index of its first chord */
  start: number;
  /** How many chords it spans (with the repeats of a chord) */
  length: number;
  /** The tonic its numerals are read from, as a pitch class */
  tonic: string;
};

// Numerals that take a minor or half-diminished chord, a dominant or a sus
// dominant, a major or a minor tonic
const II = "IIm7|IIm7b5";
const V = "V7|V7sus4";
const I = "Imaj7|Im7";

// The catalogue, ordered by use: how many songs of a corpus of lead sheets
// have each at least once, found with `find` (1,454 jazz standards; pop and
// blues last, by the whole corpus of 6,627). Names after John Elliott,
// *Insights in Jazz* (2009), and Conrad Cork, *The New Guide to Harmony with
// LEGO Bricks*, are aliases.
const PATTERNS: Pattern[] = [
  // jazz first, by the share of 1,454 jazz standards with each
  {
    name: "V–I",
    aliases: ["perfect cadence", "authentic cadence"],
    numerals: [V, I],
    family: "cadence",
  },
  {
    name: "ii–V",
    aliases: ["two-five", "launcher"],
    numerals: [II, V],
    family: "launcher",
  },
  {
    name: "ii–V–I",
    aliases: ["two-five-one", "regular cadence", "cadence"],
    numerals: [II, V, I],
    family: "cadence",
  },
  {
    name: "VI7–ii–V",
    aliases: ["dropback launch"],
    numerals: ["VI7", II, V],
    family: "launcher",
  },
  {
    name: "II7–V7",
    aliases: ["slow launcher"],
    numerals: ["II7", "V7"],
    family: "launcher",
  },
  {
    name: "iii–VI7–ii–V",
    aliases: ["SPOT"],
    numerals: ["IIIm7|IIIm7b5", "VI7", II, V],
    family: "turnaround",
  },
  {
    name: "VI7–ii–V–I",
    aliases: ["dropback"],
    numerals: ["VI7", II, V, I],
    family: "cadence",
  },
  {
    name: "II7–ii–V",
    aliases: ["dogleg launch"],
    numerals: ["II7", II, V],
    family: "launcher",
  },
  {
    name: "iii–VI7–ii–V–I",
    aliases: ["long cadence"],
    numerals: ["IIIm7|IIIm7b5", "VI7", II, V, I],
    family: "cadence",
  },
  {
    name: "II7–ii–V–I",
    aliases: ["dogleg"],
    numerals: ["II7", II, V, I],
    family: "cadence",
  },
  {
    name: "ii–V–I7",
    aliases: ["tension ending"],
    numerals: [II, V, "I7"],
    family: "cadence",
  },
  {
    name: "bII7–I",
    aliases: ["tritone substitution"],
    numerals: ["bII7", I],
    family: "cadence",
  },
  {
    name: "I–vi–ii–V",
    aliases: ["turnaround"],
    numerals: [I, "VIm7", II, V],
    family: "turnaround",
  },
  {
    name: "vi–ii–V–I",
    aliases: ["extended cadence"],
    numerals: ["VIm7", II, V, I],
    family: "cadence",
  },
  {
    name: "bVII7–I",
    aliases: ["backdoor dominant"],
    numerals: ["bVII7", I],
    family: "cadence",
  },
  {
    name: "vi–II7–ii–V–I",
    aliases: ["dogleg cadence"],
    numerals: ["VIm7", "II7", II, V, I],
    family: "cadence",
  },
  {
    name: "I–VI7–ii–V",
    aliases: ["POT", "plain old turnaround"],
    numerals: [I, "VI7", II, V],
    family: "turnaround",
  },
  {
    name: "ii–V–ii–V–I",
    aliases: ["two-goes cadence"],
    numerals: [II, V, II, V, I],
    family: "cadence",
  },
  {
    name: "iv–I",
    aliases: ["minor plagal cadence"],
    numerals: ["IVm7", "Imaj7"],
    family: "cadence",
  },
  {
    name: "I–I7–IV",
    aliases: ["to the IV"],
    numerals: ["Imaj7", "I7", "IVmaj7"],
    family: "turnaround",
  },
  {
    name: "IV–I",
    aliases: ["plagal cadence", "amen cadence"],
    numerals: ["IVmaj7", "Imaj7"],
    family: "cadence",
  },
  {
    name: "I–#io–ii",
    aliases: ["passing diminished"],
    numerals: ["Imaj7", "#Io7", II],
    family: "turnaround",
  },
  {
    name: "backdoor cadence",
    aliases: ["iv–bVII7–I", "Yardbird cadence"],
    numerals: ["IVm7", "bVII7", I],
    family: "cadence",
  },
  {
    name: "ii–V–I–IV",
    aliases: ["overrun"],
    numerals: [II, V, "Imaj7", "IVmaj7"],
    family: "cadence",
  },
  {
    name: "bVI–V–I",
    aliases: ["Night and Day cadence"],
    numerals: ["bVImaj7", V, I],
    family: "cadence",
  },
  {
    name: "ii–bII7–I",
    aliases: ["tritone substitute cadence"],
    numerals: [II, "bII7", I],
    family: "cadence",
  },
  {
    name: "iii–biiio–ii–V–I",
    aliases: ["rainy cadence"],
    numerals: ["IIIm7|IIIm7b5", "bIIIo7", II, V, I],
    family: "cadence",
  },
  {
    name: "#ivø–VII7–iii–VI7–ii–V–I",
    aliases: ["starlight cadence"],
    numerals: ["#IVm7b5", "VII7", "IIIm7|IIIm7b5", "VI7", II, V, I],
    family: "cadence",
  },
  {
    name: "I–I7–IV–iv",
    aliases: ["to IV and back"],
    numerals: [I, "I7", "IVmaj7", "IVm7"],
    family: "turnaround",
  },
  {
    name: "I–#io–ii–#iio",
    aliases: ["Rhythm turnaround"],
    numerals: ["Imaj7", "#Io7", II, "#IIo7"],
    family: "turnaround",
  },
  {
    name: "I–bIII7–ii–V",
    aliases: ["Foggy turnaround"],
    numerals: [I, "bIII7", II, V],
    family: "turnaround",
  },
  {
    name: "I–bIII7–bVI–bII7",
    aliases: ["Ladybird turnaround", "Tadd Dameron turnaround"],
    numerals: [I, "bIII7", "bVImaj7", "bII7"],
    family: "turnaround",
  },
  {
    name: "i–bVI–iiø–V",
    aliases: ["minor turnaround"],
    numerals: ["Im7", "bVImaj7", "IIm7b5", "V7"],
    family: "turnaround",
  },
  // pop and blues, by the share of the whole corpus (6,627 songs)
  {
    name: "I–IV–V",
    aliases: ["three-chord"],
    numerals: ["I", "IV", "V|V7"],
    family: "pop",
  },
  {
    name: "I7–IV7–I7",
    aliases: ["blues"],
    numerals: ["I7", "IV7", "I7"],
    family: "blues",
  },
  {
    name: "I–vi–IV–V",
    aliases: ["fifties", "doo-wop"],
    numerals: ["I", "VIm", "IV", "V|V7"],
    family: "pop",
  },
  {
    name: "I–V–vi–IV",
    aliases: ["axis", "pop axis"],
    numerals: ["I", "V", "VIm", "IV"],
    family: "pop",
  },
  {
    name: "i–bVII–bVI–V",
    aliases: ["andalusian cadence"],
    numerals: ["Im", "bVII", "bVI", "V|V7"],
    family: "pop",
  },
];

/**
 * Get the catalogue of named progressions: the common ones of jazz (and a
 * few of pop and blues), each with its numerals from the tonic. Ordered by
 * use: how many of a corpus of 1,454 jazz standards have each at least once,
 * from the V–I (in 90%), the ii–V (89%) and the ii–V–I (80%) on; pop and
 * blues last.
 *
 * A numeral is a degree and a chord type, and `|` separates alternatives: a
 * chord fits when it's on that degree and has the same family
 * (`Chord.get(symbol).family`), so `"IIm7|IIm7b5"` takes any minor or
 * half-diminished chord on the second degree (Dm7, Dm9, Dm7b5 in C).
 * Numerals are read from the major scale of the tonic, as in
 * `fromRomanNumerals`: `bVII7` is Bb7 in C.
 *
 * Names: the common jazz-theory name when there is one, otherwise the
 * numerals. The aliases include the names of John Elliott's *Insights in
 * Jazz* (2009) and Conrad Cork's *The New Guide to Harmony with LEGO Bricks*
 * ("regular cadence", "POT", "SPOT", "dogleg", "long cadence"…).
 *
 * @returns a copy of the catalogue
 * @example
 * Progression.patterns()[2]; // => { name: "ii–V–I", aliases: ["two-five-one", "regular cadence", "cadence"], numerals: ["IIm7|IIm7b5", "V7|V7sus4", "Imaj7|Im7"], family: "cadence" }
 * Progression.patterns().filter((p) => p.family === "turnaround").map((p) => p.name); // => ["iii–VI7–ii–V", "I–vi–ii–V", "I–VI7–ii–V", "I–I7–IV", "I–#io–ii", "I–I7–IV–iv", "I–#io–ii–#iio", "I–bIII7–ii–V", "I–bIII7–bVI–bII7", "i–bVI–iiø–V"]
 */
export function patterns(): Pattern[] {
  return PATTERNS.map((p) => ({
    ...p,
    aliases: [...p.aliases],
    numerals: [...p.numerals],
  }));
}

// names and aliases, first as written (the case of a numeral matters: "iv–I"
// isn't "IV–I"), then ignoring case; spaces and the kind of dash never matter
const dashes = (name: string) => name.replace(/[\s–—-]+/g, "-");
const EXACT = new Map<string, Pattern>();
const ANY_CASE = new Map<string, Pattern>();
for (const p of PATTERNS) {
  for (const name of [p.name, ...p.aliases]) {
    if (!EXACT.has(dashes(name))) EXACT.set(dashes(name), p);
    const lower = dashes(name).toLowerCase();
    if (!ANY_CASE.has(lower)) ANY_CASE.set(lower, p);
  }
}
const byName = (name: string) =>
  EXACT.get(dashes(name)) ?? ANY_CASE.get(dashes(name).toLowerCase());

/** A pattern by name or alias, or its numerals (a string with spaces, or an array). */
function patternOf(
  pattern: string | string[],
): { name: string; numerals: string[]; family?: PatternFamily } | undefined {
  if (Array.isArray(pattern)) return { name: "", numerals: pattern };
  if (typeof pattern !== "string") return undefined;
  const named = byName(pattern);
  if (named) return named;
  const numerals = pattern.trim().split(/\s+/).filter(Boolean);
  return numerals.length > 1 || romanNumeral(numerals[0] ?? "").empty === false
    ? { name: "", numerals }
    : undefined;
}

type Slot = { chroma: number; interval: string; family: string }[];

/** The alternatives of each numeral: its degree (semitones and interval) and family. */
function slotsOf(numerals: string[]): Slot[] | undefined {
  const slots: Slot[] = [];
  for (const numeral of numerals) {
    const alternatives: Slot = [];
    for (const text of String(numeral).split("|")) {
      const rn = romanNumeral(text.trim());
      if (rn.empty) return undefined;
      const type = getChordType(rn.chordType);
      if (type.empty && rn.chordType !== "") return undefined;
      const ivl = interval(rn);
      alternatives.push({
        chroma: ivl.chroma,
        interval: ivl.name,
        family: type.family,
      });
    }
    if (!alternatives.length) return undefined;
    slots.push(alternatives);
  }
  return slots.length ? slots : undefined;
}

/**
 * Find a named progression in a list of chords, in any key: every place it
 * appears, with its first chord (`start`), how many chords it spans
 * (`length`) and the tonic its numerals are read from. Matches can overlap:
 * a ii–V–I contains a ii–V.
 *
 * `pattern` is a name or an alias of `Progression.patterns()` (case and
 * dashes don't matter: "ii-V-I"), or numerals (`"IIm7 V7 Imaj7"`, or an
 * array) with `|` between alternatives. A chord fits a numeral when it's on
 * its degree and has the same family (`Chord.get(symbol).family`): Dm9 is a
 * IIm7 in C, Cmaj7#11 or C6 a Imaj7.
 *
 * A chord repeated right after itself (same root, same family) is held, not a
 * new chord: the match spans its repeats. A symbol that isn't a chord (N.C.)
 * fits nothing. A cadence of the catalogue doesn't land on a minor chord
 * followed by its dominant: in Em7 A7 Dm7 G7 Cmaj7, Dm7 is a ii, so the
 * ii–V–I is only the one in C (numerals given as such are matched as
 * written). It returns `[]` for an unknown pattern.
 *
 * @param chords - chord symbols, as `Chart.chords(chart).map((c) => c.value)` gives them
 * @param pattern - a pattern name or alias, or numerals
 * @returns where the pattern appears, in order
 * @example
 * Progression.find(["Em7", "A7", "Dm7", "G7", "Cmaj7"], "ii–V–I"); // => [{ name: "ii–V–I", start: 2, length: 3, tonic: "C" }]
 * Progression.find(["Em7", "A7", "Dm7", "G7", "Cmaj7"], "long cadence")[0].tonic; // => "C"
 * Progression.find(["Fm7", "Bb7", "Ebmaj7", "Ebmaj7"], "IIm7 V7 Imaj7"); // => [{ name: "", start: 0, length: 4, tonic: "Eb" }]
 * Progression.find(["C", "G7"], "nothing"); // => []
 */
export function find(
  chords: string[],
  pattern: string | string[],
): PatternMatch[] {
  if (!Array.isArray(chords)) return [];
  const found = patternOf(pattern);
  const slots: Slot[] | undefined = found ? slotsOf(found.numerals) : undefined;
  if (!found || !slots) return [];

  // the chord changes: a chord repeated right after itself is one
  type Change = {
    index: number;
    end: number;
    chroma: number;
    family: string;
    tonic: string;
  };
  const changes: (Change | null)[] = [];
  chords.forEach((symbol, index) => {
    const chord = getChord(String(symbol));
    const root = note(chord.tonic ?? "");
    if (chord.empty || root.empty) {
      changes.push(null);
      return;
    }
    const last = changes[changes.length - 1];
    if (last && last.chroma === root.chroma && last.family === chord.family) {
      last.end = index;
      return;
    }
    changes.push({
      index,
      end: index,
      chroma: root.chroma,
      family: chord.family,
      tonic: root.pc,
    });
  });

  const matches: PatternMatch[] = [];
  for (let i = 0; i + slots.length <= changes.length; i++) {
    const first = changes[i];
    if (!first) continue;
    // the tonic of each alternative of the first numeral that fits
    for (const alt of slots[0] as Slot) {
      if (alt.family !== first.family) continue;
      const tonicChroma: number = (first.chroma - alt.chroma + 12) % 12;
      const fits: boolean = slots.every((slot: Slot, k: number): boolean => {
        const change = changes[i + k];
        return (
          !!change &&
          slot.some(
            (a) =>
              a.family === change.family &&
              (tonicChroma + a.chroma) % 12 === change.chroma,
          )
        );
      });
      if (!fits) continue;
      const last = changes[i + slots.length - 1]!;
      // a cadence doesn't land on a minor chord followed by its dominant: that
      // chord is a ii (A7 Dm7 G7 is V7/ii, ii, V, not a cadence in D minor)
      const next = changes[i + slots.length];
      if (
        found.family === "cadence" &&
        (last.family === "minor" || last.family === "half-diminished") &&
        next &&
        (next.family === "dominant" || next.family === "suspended") &&
        next.chroma === (last.chroma + 5) % 12
      ) {
        break;
      }
      const tonic = note(transpose(first.tonic, `-${alt.interval}`)).pc;
      matches.push({
        name: found.name,
        start: first.index,
        length: last.end - first.index + 1,
        tonic,
      });
      break;
    }
  }
  return matches;
}

/**
 * Get the chords of a named progression in a key: the first alternative of
 * each numeral, as `fromRomanNumerals` reads it. It returns `[]` for an
 * unknown pattern.
 *
 * @param pattern - a pattern name or alias of `Progression.patterns()`, or numerals
 * @param tonic - the tonic, like "C"
 * @returns the chord symbols
 * @example
 * Progression.fromPattern("ii–V–I", "F"); // => ["Gm7", "C7", "Fmaj7"]
 * Progression.fromPattern("long cadence", "Bb"); // => ["Dm7", "G7", "Cm7", "F7", "Bbmaj7"]
 * Progression.fromPattern("andalusian cadence", "A"); // => ["Am", "G", "F", "E"]
 */
export function fromPattern(
  pattern: string | string[],
  tonic: string,
): string[] {
  const found = patternOf(pattern);
  if (!found || !slotsOf(found.numerals) || note(tonic).empty) return [];
  return found.numerals.map((numeral) => {
    const rn = romanNumeral(String(numeral).split("|")[0].trim());
    const root = transpose(tonic, interval(rn));
    return root ? root + rn.chordType : "";
  });
}
