import { tokenize } from "@tonaljs/chord";
import { distance, transpose } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { NoteLiteral } from "@tonaljs/pitch-note";
import { get as romanNumeral } from "@tonaljs/roman-numeral";

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 */
export function fromRomanNumerals(
  tonic: NoteLiteral,
  chords: string[],
): string[] {
  const romanNumerals = chords.map(romanNumeral);
  return romanNumerals.map(
    (rn) => transpose(tonic, interval(rn)) + rn.chordType,
  );
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
