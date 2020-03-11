import {
  accToAlt,
  altToAcc,
  deprecate,
  interval,
  isNamed,
  isPitch,
  Named,
  Pitch
} from "@tonaljs/core";

export interface RomanNumeral extends Pitch, Named {
  readonly empty: boolean;
  readonly roman: string;
  readonly interval: string;
  readonly acc: string;
  readonly chordType: string;
  readonly major: boolean;
  readonly dir: 1;
}

export interface NoRomanNumeral extends Partial<RomanNumeral> {
  readonly empty: true;
  readonly name: "";
  readonly chordType: "";
}
const NoRomanNumeral: NoRomanNumeral = { empty: true, name: "", chordType: "" };

const cache: Record<string, RomanNumeral | NoRomanNumeral> = {};

/**
 * Get properties of a roman numeral string
 *
 * @function
 * @param {string} - the roman numeral string (can have type, like: Imaj7)
 * @return {Object} - the roman numeral properties
 * @param {string} name - the roman numeral (tonic)
 * @param {string} type - the chord type
 * @param {string} num - the number (1 = I, 2 = II...)
 * @param {boolean} major - major or not
 *
 * @example
 * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
 */
export function get(src: any): RomanNumeral | NoRomanNumeral {
  return typeof src === "string"
    ? cache[src] || (cache[src] = parse(src))
    : typeof src === "number"
    ? get(NAMES[src] || "")
    : isPitch(src)
    ? fromPitch(src)
    : isNamed(src)
    ? get(src.name)
    : NoRomanNumeral;
}

const romanNumeral = deprecate(
  "RomanNumeral.romanNumeral",
  "RomanNumeral.get",
  get
);

/**
 * Get roman numeral names
 *
 * @function
 * @param {boolean} [isMajor=true]
 * @return {Array<String>}
 *
 * @example
 * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 */
export function names(major = true) {
  return (major ? NAMES : NAMES_MINOR).slice();
}

function fromPitch(pitch: Pitch): RomanNumeral | NoRomanNumeral {
  return get(altToAcc(pitch.alt) + NAMES[pitch.step]);
}

const REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;

// [name, accidentals, romanNumeral, chordType]
type RomanNumeralTokens = [string, string, string, string];
export function tokenize(str: string): RomanNumeralTokens {
  return (REGEX.exec(str) || ["", "", "", ""]) as RomanNumeralTokens;
}

const ROMANS = "I II III IV V VI VII";
const NAMES = ROMANS.split(" ");
const NAMES_MINOR = ROMANS.toLowerCase().split(" ");

function parse(src: string): RomanNumeral | NoRomanNumeral {
  const [name, acc, roman, chordType] = tokenize(src);
  if (!roman) {
    return NoRomanNumeral;
  }

  const upperRoman = roman.toUpperCase();
  const step = NAMES.indexOf(upperRoman);
  const alt = accToAlt(acc);
  const dir = 1;
  return {
    empty: false,
    name,
    roman,
    interval: interval({ step, alt, dir }).name,
    acc,
    chordType,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir
  };
}

export default {
  names,
  get,
  // deprecated
  romanNumeral
};
