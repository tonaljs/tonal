/**
 * [![npm version](https://img.shields.io/npm/v/tonal-abc-notation.svg?style=flat-square)](https://www.npmjs.com/package/tonal-abc-notation)
 *
 * Convert note strings between ABC and scientific notation
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * const Abc = require("tonal-abc-notation")
 * Abc.toNote("c") // => "C5"
 * Abc.toAbc("Db2") // =>  "_D,,"
 *
 * @example
 * import Tonal from "tonal"
 * import { toAbc } from "tonal-abc-notation"
 * Tonal.Scale.notes("C major").map(toAbc);
 *
 * @module Abc
 */
import { props } from "tonal-note";

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
const fillStr = (s, n) => Array(n + 1).join(s);

export function tokenize(str) {
  const m = REGEX.exec(str);
  if (!m) return ["", "", ""];
  return [m[1], m[2], m[3]];
}

/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @param {String} abcNote - the note in ABC notation
 * @return {String} the note in scientific notation of null if not valid
 * @example
 * Abc.toNote("c") // => "C5"
 */
export function toNote(str) {
  const [acc, letter, oct] = tokenize(str);
  if (letter === "") return null;
  let o = 4;
  for (let i = 0; i < oct.length; i++) o += oct[i] === "," ? -1 : 1;
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
 * @param {String} note - a note in scientific notation
 * @return {String} the note in ABC notation or null if not valid note
 * @example
 * abc.toAbc("C#4") // => "^C"
 */
export function toAbc(str) {
  const { letter, acc, oct } = props(str);
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o =
    oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}
