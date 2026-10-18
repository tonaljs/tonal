import { getChord, tokenize } from "@tonaljs/chord";
import { distance, transpose } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { NoteLiteral } from "@tonaljs/pitch-note";
import {
  NoRomanNumeral,
  RomanNumeral,
  get as romanNumeral,
} from "@tonaljs/roman-numeral";

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 *
 * A lowercase roman numeral is a minor chord: "ii" is "Dm" and "ii7" is "Dm7"
 * in C. A chord type that already has its own quality, like "viio" or "iim7",
 * is kept as written.
 *
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 * fromRomanNumerals("C", ["I", "vi", "ii7", "V7"]);
 * // => ["C", "Am", "Dm7", "G7"]
 */
export function fromRomanNumerals(
  tonic: NoteLiteral,
  chords: string[],
): string[] {
  const romanNumerals = chords.map(romanNumeral);
  return romanNumerals.map(
    (rn) => transpose(tonic, interval(rn)) + chordTypeOf(rn),
  );
}

// A lowercase numeral makes the chord type minor when the minor form exists
function chordTypeOf(rn: RomanNumeral | NoRomanNumeral): string {
  const chordType = rn.chordType;
  if (rn.empty || rn.major) return chordType;
  const minor = "m" + chordType;
  return getChord(minor).quality === "Minor" ? minor : chordType;
}

/**
 * Given a tonic and a chord list with leadsheet symbols notation,
 * return the chord list with roman numeral notation
 * @example
 * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
 * // => ["IMaj7", "IIm7", "V7"]
 */
export function toRomanNumerals(
  tonic: NoteLiteral,
  chords: string[],
): string[] {
  return chords.map((chord) => {
    const [note, chordType] = tokenize(chord);
    const intervalName = distance(tonic, note);
    const roman = romanNumeral(interval(intervalName));
    return roman.name + chordType;
  });
}

/** @deprecated */
export default { fromRomanNumerals, toRomanNumerals };
