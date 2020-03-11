import { distance as dist, note, transpose as tr } from "@tonaljs/core";

const fillStr = (character: string, times: number) =>
  Array(times + 1).join(character);

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

type AbcTokens = [string, string, string];

export function tokenize(str: string): AbcTokens {
  const m = REGEX.exec(str);
  if (!m) {
    return ["", "", ""];
  }
  return [m[1], m[2], m[3]];
}

/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @example
 * abcToScientificNotation("c") // => "C5"
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
 * Convert a (string) note in scientific notation into a (string) note in ABC notation
 *
 * @example
 * scientificToAbcNotation("C#4") // => "^C"
 */
export function scientificToAbcNotation(str: string): string {
  const n = note(str);
  if (n.empty || !n.oct) {
    return "";
  }
  const { letter, acc, oct } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o =
    oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}

export function transpose(note: string, interval: string): string {
  return scientificToAbcNotation(tr(abcToScientificNotation(note), interval));
}

export function distance(from: string, to: string): string {
  return dist(abcToScientificNotation(from), abcToScientificNotation(to));
}

export default {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose,
  distance
};
