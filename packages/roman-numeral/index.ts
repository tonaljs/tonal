import { isNamedPitch, isPitch, Pitch } from "@tonaljs/pitch";
import { interval } from "@tonaljs/pitch-interval";
import { accToAlt, altToAcc } from "@tonaljs/pitch-note";

export interface RomanNumeral extends Pitch {
  /** The roman numeral as written, like "bVIIMaj7". */
  readonly name: string;
  readonly empty: boolean;
  /** The numeral alone, without accidentals or chord type, like "VII". Lowercase for minor. */
  readonly roman: string;
  /** Interval from the tonic to the chord root, like "7m". */
  readonly interval: string;
  /** The accidentals before the numeral, like "b". */
  readonly acc: string;
  /** What follows the numeral, like "Maj7" ("" if none). */
  readonly chordType: string;
  /** the degree an applied chord is built on, like "V" in "V7/V" ("" if none) */
  readonly of: string;
  /** True for an uppercase numeral ("V"), false for a lowercase one ("v"). */
  readonly major: boolean;
  readonly dir: 1;
}

export interface NoRomanNumeral extends Partial<RomanNumeral> {
  readonly empty: true;
  readonly name: "";
  readonly chordType: "";
}
const NO_ROMAN_NUMERAL: NoRomanNumeral = {
  empty: true,
  name: "",
  chordType: "",
};

const cache = new Map<string, RomanNumeral | NoRomanNumeral>();

/**
 * Get the properties of a roman numeral: its parts (accidentals, numeral,
 * chord type), the interval from the tonic and whether it is uppercase. It
 * also accepts a degree index (0 is "I"), a pitch or an object with a name.
 * Returns `{ empty: true, name: "", chordType: "" }` if it's not a valid
 * roman numeral.
 *
 * @param src - a roman numeral string like "bVIIMaj7" (the chord type is optional)
 * An applied chord, like "V7/V", is a chord on a degree of another degree's
 * major scale. Its `interval`, `step` and `alt` locate the chord's root from
 * the tonic, and `of` is the degree it's applied to.
 *
 * @example
 * RomanNumeral.get("bVIIMaj7"); // => { name: "bVIIMaj7", roman: "VII", acc: "b", chordType: "Maj7", interval: "7m", major: true, ... }
 * RomanNumeral.get("vi").interval; // => "6M"
 * RomanNumeral.get("V7/V"); // => { name: "V7/V", roman: "V", chordType: "7", of: "V", interval: "2M", step: 1, ... }
 * RomanNumeral.get("x").empty; // => true
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get(src: any): RomanNumeral | NoRomanNumeral {
  return typeof src === "string"
    ? cached(src)
    : typeof src === "number"
      ? get(NAMES[src] || "")
      : isPitch(src)
        ? fromPitch(src)
        : isNamedPitch(src)
          ? get(src.name)
          : NO_ROMAN_NUMERAL;
}

// Only valid roman numerals are cached, so arbitrary input can't grow the cache
function cached(src: string): RomanNumeral | NoRomanNumeral {
  let value = cache.get(src);
  if (!value) {
    value = parse(src);
    if (!value.empty) cache.set(src, value);
  }
  return value;
}

/**
 * @deprecated Use RomanNumeral.get instead.
 */
export const romanNumeral = get;

/**
 * Get the names of the seven roman numerals, uppercase by default or
 * lowercase if `major` is false.
 *
 * @param major - true for uppercase (default), false for lowercase
 * @example
 * RomanNumeral.names(); // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 * RomanNumeral.names(false); // => ["i", "ii", "iii", "iv", "v", "vi", "vii"]
 */
export function names(major = true) {
  return (major ? NAMES : NAMES_MINOR).slice();
}

function fromPitch(pitch: Pitch): RomanNumeral | NoRomanNumeral {
  return get(altToAcc(pitch.alt) + NAMES[pitch.step]);
}

const ACC = "#{1,}|b{1,}|x{1,}|";
const ROMAN = "IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2}";
// accidentals, roman numeral, chord type and the degrees it's applied to
// ("/V", "/V/ii"). The chord type is lazy, so a trailing "/<degree>" is read
// as an applied chord, and anything else after a slash (like the bass in
// "I/E") stays in the chord type.
// The chord type can't start with a roman numeral letter, but an "i" or a "v"
// can follow another letter of it, as in "dim7" or "min7" ("viidim7").
const CHORD_TYPE = "(?:[^IViv/][iv]?|/)*?";
const REGEX = new RegExp(
  `^(${ACC})(${ROMAN})(${CHORD_TYPE})((?:/(?:${ACC})(?:${ROMAN}))*)$`,
);

// [name, accidentals, romanNumeral, chordType, of]
type RomanNumeralTokens = [string, string, string, string, string];

/**
 * Split a roman numeral into `[name, accidentals, numeral, chordType, of]`.
 * Returns five empty strings if it's not a valid roman numeral.
 *
 * @example
 * RomanNumeral.tokenize("#ivm7"); // => ["#ivm7", "#", "iv", "m7", ""]
 * RomanNumeral.tokenize("V7/V"); // => ["V7/V", "", "V", "7", "V"]
 * RomanNumeral.tokenize("x"); // => ["", "", "", "", ""]
 */
export function tokenize(str: string): RomanNumeralTokens {
  const m = REGEX.exec(str);
  return m ? [m[0], m[1], m[2], m[3], m[4].slice(1)] : ["", "", "", "", ""];
}

const ROMANS = "I II III IV V VI VII";
const NAMES = ROMANS.split(" ");
const NAMES_MINOR = ROMANS.toLowerCase().split(" ");
// semitones of each degree of the major scale
const SIZES = [0, 2, 4, 5, 7, 9, 11];

function parse(src: string): RomanNumeral | NoRomanNumeral {
  const [name, acc, roman, chordType, of] = tokenize(src);
  // a bass note makes no sense in an applied chord ("I/E/V")
  if (!roman || (of && chordType.includes("/"))) {
    return NO_ROMAN_NUMERAL;
  }

  const upperRoman = roman.toUpperCase();
  const dir = 1;
  const degree = { step: NAMES.indexOf(upperRoman), alt: accToAlt(acc) };
  const { step, alt } = of ? applied(degree, get(of) as RomanNumeral) : degree;
  return {
    empty: false,
    name,
    roman,
    interval: interval({ step, alt, dir }).name,
    acc,
    chordType,
    of,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir,
  };
}

// The degree of the tonic's major scale that is `degree` of the major scale
// built on `target`: V of V is II, and IV of IV is bVII.
function applied(
  degree: { step: number; alt: number },
  target: { step: number; alt: number },
) {
  const step = (degree.step + target.step) % 7;
  const semitones =
    SIZES[degree.step] + degree.alt + SIZES[target.step] + target.alt;
  const alt = ((((semitones - SIZES[step]) % 12) + 18) % 12) - 6;
  return { step, alt };
}

/** @deprecated Use the named exports instead. */
export default {
  names,
  get,
  // deprecated
  romanNumeral,
};
