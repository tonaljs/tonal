import { rotate } from "@tonaljs/collection";
import { simplify, transposeFifths } from "@tonaljs/interval";
import { EmptyPcset, Pcset } from "@tonaljs/pcset";
import { transpose } from "@tonaljs/pitch-distance";
import { NoteName } from "@tonaljs/pitch-note";
import { get as getType } from "@tonaljs/scale-type";

const MODES = [
  [0, 2773, 0, "ionian", "", "Maj7", "major"],
  [1, 2902, 2, "dorian", "m", "m7"],
  [2, 3418, 4, "phrygian", "m", "m7"],
  [3, 2741, -1, "lydian", "", "Maj7"],
  [4, 2774, 1, "mixolydian", "", "7"],
  [5, 2906, 3, "aeolian", "m", "m7", "minor"],
  [6, 3434, 5, "locrian", "dim", "m7b5"],
] as const;

type ModeDatum = (typeof MODES)[number];

export interface Mode extends Pcset {
  readonly name: string;
  readonly modeNum: number;
  readonly alt: number; // number of alterations === number of fifths
  readonly triad: string;
  readonly seventh: string;
  readonly aliases: string[];
}

const NoMode: Mode = {
  ...EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: [],
};

const modes: Mode[] = MODES.map(toMode);
const index: Record<string, Mode> = Object.create(null);
modes.forEach((mode) => {
  index[mode.name] = mode;
  mode.aliases.forEach((alias) => {
    index[alias] = mode;
  });
});

type ModeLiteral = string | { name: string };

/**
 * Get one of the seven diatonic modes by its name (case insensitive) or by an
 * object with a `name`. It returns an empty mode (`{ empty: true, ... }`) for
 * anything else. The mode has `name`, `intervals`, `modeNum` (0 for ionian),
 * `alt` (the flats it adds to the ionian mode on the same tonic, negative
 * for sharps), `triad`, `seventh` (chord types of its tonic) and `aliases`
 * ("major" and "minor" are aliases of ionian and aeolian).
 *
 * @example
 * Mode.get("dorian").intervals; // => ["1P", "2M", "3m", "4P", "5P", "6M", "7m"]
 * Mode.get("dorian").seventh; // => "m7"
 * Mode.get("major").name; // => "ionian"
 * Mode.get("DORIAN").modeNum; // => 1
 * Mode.get("nonsense").empty; // => true
 */
export function get(name: ModeLiteral): Mode {
  return typeof name === "string"
    ? index[name.toLowerCase()] || NoMode
    : name && name.name
      ? get(name.name)
      : NoMode;
}

/** @deprecated Use Mode.get instead. */
export const mode = get;

/**
 * Get a list of the seven modes, from ionian to locrian.
 *
 * @example
 * Mode.all().map((m) => m.name); // => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]
 */
export function all() {
  return modes.slice();
}

/** @deprecated Use Mode.all instead. */
export const entries = all;

/**
 * Get the names of the seven modes, from ionian to locrian.
 *
 * @example
 * Mode.names(); // => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]
 */
export function names() {
  return modes.map((mode) => mode.name);
}

function toMode(mode: ModeDatum): Mode {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = getType(name).intervals;
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases,
  };
}

/**
 * Get the notes of a mode on a tonic, as pitch classes if the tonic has no
 * octave. It returns `[]` for an invalid mode. (An invalid tonic gives a list
 * of `""`.)
 *
 * @example
 * Mode.notes("ionian", "C"); // => ["C", "D", "E", "F", "G", "A", "B"]
 * Mode.notes("dorian", "D"); // => ["D", "E", "F", "G", "A", "B", "C"]
 * Mode.notes("nonsense", "C"); // => []
 */
export function notes(modeName: ModeLiteral, tonic: NoteName) {
  return get(modeName).intervals.map((ivl) => transpose(tonic, ivl));
}

function chords(chords: string[]) {
  return (modeName: ModeLiteral, tonic: NoteName) => {
    const mode = get(modeName);
    if (mode.empty) return [];
    const triads = rotate(mode.modeNum, chords);
    const tonics = mode.intervals.map((i) => transpose(tonic, i));
    return triads.map((triad, i) => tonics[i] + triad);
  };
}

/**
 * Get the triad chord symbols built on each degree of a mode on a tonic. It
 * returns `[]` for an invalid mode.
 *
 * @example
 * Mode.triads("dorian", "D"); // => ["Dm", "Em", "F", "G", "Am", "Bdim", "C"]
 * Mode.triads("major", "C"); // => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
 */
export const triads = chords(MODES.map((x) => x[4]));

/**
 * Get the seventh chord symbols built on each degree of a mode on a tonic. It
 * returns `[]` for an invalid mode.
 *
 * @example
 * Mode.seventhChords("dorian", "D"); // => ["Dm7", "Em7", "FMaj7", "G7", "Am7", "Bm7b5", "CMaj7"]
 */
export const seventhChords = chords(MODES.map((x) => x[5]));

/**
 * Get the interval from the tonic of a source mode to the tonic of a
 * destination mode that has the same notes (the interval is negative when it
 * goes down). It returns `""` if a mode is invalid.
 *
 * @example
 * Mode.distance("dorian", "major"); // => "2M"
 * Mode.distance("lydian", "ionian"); // => "-5P"
 * Mode.distance("nonsense", "ionian"); // => ""
 */
export function distance(destination: ModeLiteral, source: ModeLiteral) {
  const from = get(source);
  const to = get(destination);
  if (from.empty || to.empty) return "";
  return simplify(transposeFifths("1P", to.alt - from.alt));
}

/**
 * Get the tonic of a destination mode that has the same notes as a source
 * mode on a tonic: D dorian and C ionian share notes, so the relative dorian
 * tonic of C ionian is D. It returns `""` if a mode is invalid.
 *
 * @example
 * Mode.relativeTonic("dorian", "major", "C"); // => "D"
 * Mode.relativeTonic("major", "dorian", "D"); // => "C"
 * Mode.relativeTonic("nonsense", "major", "C"); // => ""
 */
export function relativeTonic(
  destination: ModeLiteral,
  source: ModeLiteral,
  tonic: NoteName,
) {
  return transpose(tonic, distance(destination, source));
}

/** @deprecated */
export default {
  get,
  names,
  all,
  distance,
  relativeTonic,
  notes,
  triads,
  seventhChords,
  // deprecated
  entries,
  mode,
};
