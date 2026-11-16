import { tokenize } from "@tonaljs/chord";
import { all as allChordTypes, get as getChordType } from "@tonaljs/chord-type";
import { distance, transpose } from "@tonaljs/pitch-distance";
import { interval } from "@tonaljs/pitch-interval";
import { note, NoteLiteral } from "@tonaljs/pitch-note";
import { RomanNumeral, get as romanNumeral } from "@tonaljs/roman-numeral";

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 *
 * A lowercase roman numeral is a minor chord: "ii" is "Dm" and "ii7" is "Dm7"
 * in C. A chord type that already has its own quality, like "viio", "iim7" or
 * "ii+", is kept as written.
 *
 * An applied chord, like "V7/V", is a chord on a degree of another degree's
 * major scale: "V7/V" is "D7" in C. Applied chords can nest ("V/V/V" is "A").
 *
 * A numeral whose chord type isn't a known chord type gives "".
 *
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 * fromRomanNumerals("C", ["I", "vi", "ii7", "V7"]);
 * // => ["C", "Am", "Dm7", "G7"]
 * fromRomanNumerals("C", ["I", "V7/ii", "ii", "V7"]);
 * // => ["C", "A7", "Dm", "G7"]
 */
export function fromRomanNumerals(
  tonic: NoteLiteral,
  chords: string[],
): string[] {
  return chords.map((chord) => {
    const rn = romanNumeral(chord);
    if (rn.empty) return "";
    const root = transpose(tonic, interval(rn));
    const type = leadsheetType(rn);
    return root && type !== undefined ? root + type : "";
  });
}

// The chord type of a roman numeral in leadsheet notation, with an optional
// bass note ("I/E" is "C/E"), or undefined when it isn't a known chord type.
function leadsheetType(rn: RomanNumeral): string | undefined {
  const written = rn.chordType;
  if (isChordType(written)) return chordTypeOf(rn.major, written);

  const slash = written.lastIndexOf("/");
  if (slash === -1) return undefined;
  const type = written.slice(0, slash);
  const bass = note(written.slice(slash + 1));
  if (!isChordType(type) || bass.empty || bass.name !== bass.pc) {
    return undefined;
  }
  return chordTypeOf(rn.major, type) + "/" + bass.pc;
}

const isChordType = (name: string) => name === "" || !getChordType(name).empty;

// A lowercase numeral makes the chord type minor when the minor form exists.
// The minor form is found by intervals, so every spelling of a chord type
// gives the same chord ("iimaj7" and "iiMaj7" are both minor-major sevenths).
// An augmented chord type keeps its spelling, like a diminished one.
function chordTypeOf(major: boolean, name: string): string {
  if (major) return name;
  const type = getChordType(name);
  if (type.quality === "Augmented") return name;

  if (type.quality === "Major") {
    const intervals = type.intervals
      .map((ivl) => (ivl === "3M" ? "3m" : ivl))
      .join(" ");
    const minor = allChordTypes().find(
      (t) => t.quality === "Minor" && t.intervals.join(" ") === intervals,
    );
    if (minor) {
      // keep the spelling of the chord type when it has a minor name
      return minor.aliases.includes("m" + name) ? "m" + name : minor.aliases[0];
    }
  }

  // a chord type without a third, like "11"
  const minor = "m" + name;
  return getChordType(minor).quality === "Minor" ? minor : name;
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
