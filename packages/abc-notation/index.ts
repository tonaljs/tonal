import { distance as dist, transpose as tr } from "@tonaljs/pitch-distance";
import { note } from "@tonaljs/pitch-note";

const fillStr = (character: string, times: number) =>
  Array(times + 1).join(character);

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

type AbcTokens = [string, string, string];

/**
 * Split an ABC note into `[accidentals, letter, octave marks]`. Anything that
 * is not an ABC note gives `["", "", ""]`.
 *
 * @example
 * AbcNotation.tokenize("^c'") // => ["^", "c", "'"]
 * AbcNotation.tokenize("x") // => ["", "", ""]
 */
export function tokenize(str: string): AbcTokens {
  const m = REGEX.exec(str);
  if (!m) {
    return ["", "", ""];
  }
  return [m[1], m[2], m[3]];
}

/**
 * Convert a note in ABC notation into a note in scientific notation. It
 * returns "" if not valid.
 *
 * @example
 * AbcNotation.abcToScientificNotation("c") // => "C5"
 * AbcNotation.abcToScientificNotation("_B,") // => "Bb3"
 */
export function abcToScientificNotation(str: string): string {
  const [acc, letter, oct] = tokenize(str);
  if (letter === "") {
    return "";
  }
  let o = 4;
  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }
  const a =
    acc[0] === "_"
      ? acc.replace(/_/g, "b")
      : acc[0] === "^"
        ? acc.replace(/\^/g, "#")
        : "";
  return letter.charCodeAt(0) > 96
    ? letter.toUpperCase() + a + (o + 1)
    : letter + a + o;
}

/**
 * Convert a note in scientific notation into a note in ABC notation. It
 * returns "" if not valid or if the note has no octave.
 *
 * @example
 * AbcNotation.scientificToAbcNotation("C#4") // => "^C"
 * AbcNotation.scientificToAbcNotation("Bb3") // => "_B,"
 */
export function scientificToAbcNotation(str: string): string {
  const n = note(str);
  if (n.empty || (!n.oct && n.oct !== 0)) {
    return "";
  }
  const { letter, acc, oct } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o =
    oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}

/**
 * Transpose an ABC note by an interval. It returns an ABC note, or "" if not
 * valid.
 *
 * @example
 * AbcNotation.transpose("C", "5P") // => "G"
 * AbcNotation.transpose("c", "3M") // => "e"
 */
export function transpose(note: string, interval: string): string {
  return scientificToAbcNotation(tr(abcToScientificNotation(note), interval));
}

/**
 * Get the interval name between two ABC notes, or "" if either is not valid.
 *
 * @example
 * AbcNotation.distance("C", "G") // => "5P"
 * AbcNotation.distance("C", "c") // => "8P"
 */
export function distance(from: string, to: string): string {
  return dist(abcToScientificNotation(from), abcToScientificNotation(to));
}

/** @deprecated */
export default {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose,
  distance,
};
