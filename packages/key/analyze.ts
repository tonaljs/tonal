import {
  get as getChord,
  chordScale,
  chordScales,
  tokenize,
} from "@tonaljs/chord";
import { transpose } from "@tonaljs/note";
import { distance } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { note } from "@tonaljs/pitch-note";
import { fromRomanNumerals } from "@tonaljs/progression";
import { get as roman } from "@tonaljs/roman-numeral";
import { get as scaleType } from "@tonaljs/scale-type";
import type { KeyScale } from "./index";

/** Where a reading of a chord in a key comes from. */
export type ChordSource =
  | "diatonic"
  | "secondary dominant"
  | "tritone substitute"
  | "related ii"
  | "borrowed"
  | "backdoor"
  | "passing diminished"
  | "common-tone diminished"
  | "chromatic";

/** One reading of a chord in a key, as returned by `Key.analyzeChord`. */
export interface ChordReading {
  /** The chord as given, like "A7". */
  chord: string;
  /** The reading as the books write it: "ii7", "V7/ii", "subV7/I", "ii7/V", "bVIImaj7". */
  numeral: string;
  /** The chord's numeral on the key's tonic, like "VI7" for "A7" in C. */
  degree: string;
  /** Where the reading comes from: "diatonic", "secondary dominant", "borrowed"... */
  source: ChordSource;
  /** Harmonic function: "T" (tonic), "SD" (subdominant), "D" (dominant) or "". */
  function: "T" | "SD" | "D" | "";
  /** The scale the chord comes from, like "C harmonic minor" or "C mixolydian"; "" if none. */
  scale: string;
  /** The numeral the chord leads to, like "ii" for "V7/ii"; "" if none. */
  target: string;
  /** With a target and a next chord: "functioning" if the next chord is on the target, "non-functioning" if not; "" otherwise. */
  resolution: "functioning" | "non-functioning" | "";
  /** The chord scale for this reading, like "A mixolydian b6". */
  chordScale: string;
}

/** Options of `Key.analyzeChord`. */
export interface AnalyzeChordOptions {
  /** The chord before, like "Em7". */
  previous?: string;
  /** The chord after, like "Dm7". */
  next?: string;
}

type KeyForms = {
  tonic: string;
  minor: boolean;
  /** The key's own scales: major, or natural, harmonic and melodic minor. */
  own: Source[];
  /** Parallel scales a chord can be borrowed from, in order. */
  parallel: Source[];
  /** The key's chord on each degree, for the case of a target. */
  triads: string[];
  grades: readonly string[];
  scale: readonly string[];
};

type Source = {
  name: string;
  notes: readonly string[];
  functions: readonly string[];
  /** A mode, not a key: only a source when nothing else reads the chord. */
  mode?: boolean;
};

type Parsed = {
  name: string;
  root: string;
  type: string;
  quality: string;
  family: string;
  intervals: string[];
  notes: string[];
  chromas: number[];
  symbol: string;
};

const MODES = ["dorian", "phrygian", "lydian", "mixolydian", "locrian"];

const SOURCE_ORDER: ChordSource[] = [
  "diatonic",
  "secondary dominant",
  "related ii",
  "borrowed",
  "tritone substitute",
  "backdoor",
  "passing diminished",
  "common-tone diminished",
  "chromatic",
];

const NEEDS_NEIGHBOUR: ChordSource[] = [
  "related ii",
  "backdoor",
  "passing diminished",
  "common-tone diminished",
];

const chroma = (name: string) => note(name).chroma;
const mod12 = (n: number) => ((n % 12) + 12) % 12;

function parse(name: string | undefined): Parsed | undefined {
  if (typeof name !== "string") return undefined;
  const [root, type] = tokenize(name);
  if (!root) return undefined;
  const symbol = root + type;
  const chord = getChord(symbol);
  if (chord.empty || !chord.notes.length) return undefined;
  return {
    name,
    root: chord.tonic ?? root,
    type,
    quality: chord.quality,
    family: chord.family,
    intervals: chord.intervals,
    notes: chord.notes,
    chromas: chord.notes.map(chroma),
    symbol,
  };
}

function scaleNotes(tonic: string, type: string): string[] {
  return scaleType(type).intervals.map((ivl) => transpose(tonic, ivl));
}

export function keyForms(
  key: string,
  majorKey: (tonic: string) => KeyScale,
  minorKey: (tonic: string) => {
    natural: KeyScale;
    harmonic: KeyScale;
    melodic: KeyScale;
  },
): KeyForms | undefined {
  if (typeof key !== "string") return undefined;
  const [tonicName, type = "major", ...rest] = key.trim().split(/\s+/);
  if (rest.length || (type !== "major" && type !== "minor")) return undefined;
  const tonic = note(tonicName).pc;
  if (!tonic) return undefined;

  const major = majorKey(tonic);
  const minor = minorKey(tonic);
  const fromKey = (name: string, scale: KeyScale): Source => ({
    name: `${tonic} ${name}`,
    notes: scale.scale,
    functions: scale.chordsHarmonicFunction,
  });
  const majorSource = fromKey("major", major);
  const minorSources = [
    fromKey("minor", minor.natural),
    fromKey("harmonic minor", minor.harmonic),
    fromKey("melodic minor", minor.melodic),
  ];
  // the modes closest to the key first (fewest notes outside it), and among
  // them the flatter one: mixolydian before lydian in a major key
  const main = type === "major" ? major.scale : minor.natural.scale;
  const outside = (notes: string[]) =>
    notes.filter((n) => !main.includes(n)).length;
  const flats = (notes: string[]) =>
    notes.reduce((sum, n) => sum + note(n).alt, 0);
  const modes = MODES.map((mode) => ({
    name: `${tonic} ${mode}`,
    notes: scaleNotes(tonic, mode),
    functions: [] as string[],
    mode: true,
  })).sort(
    (a, b) =>
      outside(a.notes) - outside(b.notes) || flats(a.notes) - flats(b.notes),
  );

  if (type === "major") {
    return {
      tonic,
      minor: false,
      own: [majorSource],
      parallel: [...minorSources, ...modes],
      triads: ["", "m", "m", "", "", "m", "dim"],
      grades: major.grades,
      scale: major.scale,
    };
  }
  return {
    tonic,
    minor: true,
    own: minorSources,
    parallel: [majorSource, ...modes],
    // natural minor triads, with the major V of the harmonic form
    triads: ["m", "dim", "", "m", "", "", ""],
    grades: minor.natural.grades,
    scale: minor.natural.scale,
  };
}

// The roman numeral of a root on the tonic: "bVII", "#IV"
function degreeOf(tonic: string, root: string): string {
  return roman(interval(distance(tonic, root))).name ?? "";
}

const isLower = (chord: Parsed) =>
  chord.quality === "Minor" || chord.quality === "Diminished";

const isAscii = (s: string) => /^[\x20-\x7e]*$/.test(s);

// The chord type written after a numeral: as written after an uppercase
// numeral, and after a lowercase one the spelling that gives the chord back
// with Progression.fromRomanNumerals: the written type without its leading
// "m", or an alias without it, or the shortest alias
function typeAfter(chord: Parsed): string {
  if (!isLower(chord)) return chord.type;
  const target = getChord("C" + chord.type).chroma;
  const works = (suffix: string) => {
    const [back] = fromRomanNumerals("C", ["i" + suffix]);
    return !!back && getChord(back).chroma === target;
  };
  const strip = (s: string) => s.replace(/^(m(?!aj)|-)/, "");
  const aliases = getChord("C" + chord.type).aliases.filter(isAscii);
  const written = strip(chord.type);
  if (written !== chord.type && works(written)) return written;
  const stripped = aliases.filter((a) => strip(a) !== a).map(strip);
  const first = stripped.find(works);
  if (first !== undefined) return first;
  const shortest = [...aliases].sort((a, b) => a.length - b.length).find(works);
  return shortest ?? chord.type;
}

function numeralOf(tonic: string, chord: Parsed): string {
  const degree = degreeOf(tonic, chord.root);
  if (!degree) return "";
  return (isLower(chord) ? degree.toLowerCase() : degree) + typeAfter(chord);
}

const inScale = (chord: Parsed, notes: readonly string[]) =>
  chord.notes.every((n) => notes.includes(n));

const isDominant = (chord: Parsed) => chord.family === "dominant";
const isMajorTriad = (chord: Parsed) =>
  chord.intervals.length === 3 &&
  chord.intervals.includes("3M") &&
  chord.intervals.includes("5P");
const isDim7 = (chord: Parsed) =>
  chord.intervals.length === 4 &&
  ["3m", "5d", "7d"].every((i) => chord.intervals.includes(i));
const isTwo = (chord: Parsed) =>
  chord.intervals.includes("3m") && chord.intervals.includes("7m");

type Target = { root: string; numeral: string; minor: boolean };

// The targets of secondary dominants: every degree but the tonic whose chord
// in the key is a major or minor triad
function targets(key: KeyForms): Target[] {
  return key.scale
    .map((root, i) => {
      const triad = key.triads[i];
      const grade = key.grades[i];
      const minor = triad === "m";
      return { root, minor, numeral: minor ? grade.toLowerCase() : grade, i };
    })
    .filter((t) => t.i > 0 && key.triads[t.i] !== "dim")
    .map(({ root, numeral, minor }) => ({ root, numeral, minor }));
}

function tonicTarget(key: KeyForms): Target {
  return {
    root: key.tonic,
    numeral: key.minor ? "i" : "I",
    minor: key.minor,
  };
}

// The numeral of a degree of the key, with the case of the next chord when
// given, or of the key's chord on it
function targetOn(key: KeyForms, root: string, chord?: Parsed): string {
  const index = key.scale.findIndex((n) => chroma(n) === chroma(root));
  if (index === -1) return "";
  const grade = key.grades[index];
  const lower = chord ? isLower(chord) : key.triads[index] === "m";
  return lower ? grade.toLowerCase() : grade;
}

function resolution(
  targetRoot: string,
  next: Parsed | undefined,
): ChordReading["resolution"] {
  if (!next) return "";
  return chroma(next.root) === chroma(targetRoot)
    ? "functioning"
    : "non-functioning";
}

const lydianDominant = (chord: Parsed, key: string) =>
  chordScales(chord.symbol).includes("lydian dominant")
    ? `${chord.root} lydian dominant`
    : chordScale(chord.symbol, { key });

function secondaryDominants(key: KeyForms, chord: Parsed): Target[] {
  if (!isDominant(chord) && !isMajorTriad(chord)) return [];
  return targets(key).filter((t) => transpose(t.root, "5P") === chord.root);
}

export function analyze(
  key: KeyForms,
  chordName: string,
  options: AnalyzeChordOptions = {},
): ChordReading[] {
  const chord = parse(chordName);
  if (!chord) return [];
  const next = parse(options.next);
  const previous = parse(options.previous);
  const keyName = `${key.tonic} ${key.minor ? "minor" : "major"}`;
  const degree = numeralOf(key.tonic, chord);
  const readings: ChordReading[] = [];
  const add = ({
    source,
    ...reading
  }: Partial<ChordReading> & Pick<ChordReading, "source">) =>
    readings.push({
      chord: chordName,
      numeral: degree,
      degree,
      source,
      function: "",
      scale: "",
      target: "",
      resolution: "",
      chordScale: chordScale(chord.symbol, { key: keyName }),
      ...reading,
    });

  // 1. diatonic
  const own = key.own.find(
    (s) => inScale(chord, s.notes) && s.notes.includes(chord.root),
  );
  if (own) {
    const index = own.notes.indexOf(chord.root);
    let fn = (own.functions[index] ?? "") as ChordReading["function"];
    // vi before V (vi V I) leans to the subdominant
    if (
      !key.minor &&
      index === 5 &&
      next &&
      chroma(next.root) === chroma(key.scale[4])
    ) {
      fn = "SD";
    }
    add({
      source: "diatonic",
      function: fn,
      scale: own.name,
      chordScale: chordScale(chord.symbol, { key: own.name }),
    });
  }

  if (!own) {
    // 2. secondary dominants
    for (const t of secondaryDominants(key, chord)) {
      add({
        source: "secondary dominant",
        numeral: `V${chord.type}/${t.numeral}`,
        function: "D",
        target: t.numeral,
        resolution: resolution(t.root, next),
      });
    }

    // 3. tritone substitutes
    if (isDominant(chord)) {
      for (const t of [tonicTarget(key), ...targets(key)]) {
        if (mod12(chroma(t.root) + 1) !== chroma(chord.root)) continue;
        add({
          source: "tritone substitute",
          numeral: `subV${chord.type}/${t.numeral}`,
          function: "D",
          target: t.numeral,
          resolution: resolution(t.root, next),
          chordScale: lydianDominant(chord, keyName),
        });
      }
    }
  }

  // 4. related ii: before a secondary dominant
  if (next && isTwo(chord) && transpose(next.root, "5P") === chord.root) {
    const nextTargets = key.own.some(
      (s) => inScale(next, s.notes) && s.notes.includes(next.root),
    )
      ? []
      : secondaryDominants(key, next);
    for (const t of nextTargets) {
      add({
        source: "related ii",
        numeral: `ii${typeAfter(chord)}/${t.numeral}`,
        function: "SD",
        target: t.numeral,
        resolution: "functioning",
        chordScale: chordScale(chord.symbol, {
          key: `${t.root} ${t.minor ? "minor" : "major"}`,
        }),
      });
    }
  }

  // 6. backdoor: a dominant a whole step below the tonic, before the tonic
  if (
    next &&
    isDominant(chord) &&
    mod12(chroma(key.tonic) - 2) === chroma(chord.root) &&
    chroma(next.root) === chroma(key.tonic)
  ) {
    add({
      source: "backdoor",
      function: "D",
      target: key.minor ? "i" : "I",
      resolution: "functioning",
      chordScale: lydianDominant(chord, keyName),
    });
  }

  if (isDim7(chord)) {
    const onDegree = (c: Parsed) =>
      key.own.some((s) => s.notes.some((n) => chroma(n) === chroma(c.root)));

    // 7. passing diminished: up a half step to a degree of the key, a
    // rootless dominant 7b9 of it (C#o7 Dm7)
    if (
      next &&
      onDegree(next) &&
      chord.chromas.includes(mod12(chroma(next.root) - 1))
    ) {
      const target = targetOn(key, next.root, next);
      const tonic = chroma(next.root) === chroma(key.tonic);
      add({
        source: "passing diminished",
        numeral: tonic
          ? `vii${typeAfter(chord)}`
          : `vii${typeAfter(chord)}/${target}`,
        function: "D",
        target,
        resolution: "functioning",
        chordScale: chordScale(chord.symbol),
      });
    }

    // 7b. passing diminished between two chords a whole step apart, going
    // down (Em7 Ebo7 Dm7)
    if (
      previous &&
      next &&
      onDegree(next) &&
      chroma(previous.root) === mod12(chroma(chord.root) + 1) &&
      chroma(next.root) === mod12(chroma(chord.root) - 1)
    ) {
      add({
        source: "passing diminished",
        target: targetOn(key, next.root, next),
        resolution: "functioning",
        chordScale: chordScale(chord.symbol),
      });
    }

    // common-tone diminished: on the root of the chord next to it (C Co7 C)
    const embellished = [next, previous].find(
      (c) => c && onDegree(c) && chroma(c.root) === chroma(chord.root),
    );
    if (embellished) {
      add({
        source: "common-tone diminished",
        target: targetOn(key, embellished.root, embellished),
        resolution: next
          ? chroma(next.root) === chroma(chord.root)
            ? "functioning"
            : "non-functioning"
          : "",
        chordScale: chordScale(chord.symbol),
      });
    }
  }

  if (!own) {
    // 5. borrowed: from the parallel key, or from a parallel mode when
    // nothing else reads the chord
    const source = key.parallel.find(
      (s) =>
        (!s.mode || !readings.length) &&
        inScale(chord, s.notes) &&
        s.notes.includes(chord.root),
    );
    if (source) {
      const index = source.notes.indexOf(chord.root);
      add({
        source: "borrowed",
        function: (source.functions[index] ?? "") as ChordReading["function"],
        scale: source.name,
        chordScale: chordScale(chord.symbol, { key: source.name }),
      });
    }
  }

  // 8. chromatic
  if (!readings.length) add({ source: "chromatic" });

  // a secondary dominant after its related ii is confirmed (Em7b5 A7)
  const afterTwo =
    previous &&
    isTwo(previous) &&
    transpose(chord.root, "5P") === previous.root;

  const confirmed = (r: ChordReading) =>
    r.resolution === "functioning" ||
    NEEDS_NEIGHBOUR.includes(r.source) ||
    (!!afterTwo && r.source === "secondary dominant");

  return readings
    .map((r, i) => ({ r, i }))
    .sort(
      (a, b) =>
        Number(confirmed(b.r)) - Number(confirmed(a.r)) ||
        SOURCE_ORDER.indexOf(a.r.source) - SOURCE_ORDER.indexOf(b.r.source) ||
        a.i - b.i,
    )
    .map(({ r }) => r);
}
