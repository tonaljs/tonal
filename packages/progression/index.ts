import { getChord, tokenize } from "@tonaljs/chord";
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
 * "ii+", is kept as written. With alterations, the third becomes minor and the
 * rest is kept: "ii7b9" is "Dm7b9" and "ii7b5" is "Dm7b5" (half-diminished).
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

// A listed chord type, or a listed type plus alterations, like "7(b9)".
// "N.C." (no chord) is a chord symbol, not a chord type.
function chordType(name: string) {
  const listed = getChordType(name);
  if (!listed.empty) return listed;
  const chord = getChord(name);
  return chord.type === "no chord" ? listed : chord;
}

const isChordType = (name: string) => name === "" || !chordType(name).empty;

// A lowercase numeral makes the third of the chord type minor and keeps the
// rest, when that chord exists, listed ("m7", "m7b5") or composed ("m7(b9)").
// The minor form is found by intervals, so every spelling of a chord type
// gives the same chord ("iimaj7" and "iiMaj7" are both minor-major sevenths).
// An augmented chord type keeps its spelling, like a diminished one.
function chordTypeOf(major: boolean, name: string): string {
  if (major) return name;
  const type = chordType(name);
  if (type.quality === "Augmented") return name;
  const intervals = minorIntervals(type.intervals);
  if (!intervals) return name;

  if (type.quality === "Major") {
    const minor = allChordTypes().find((t) =>
      sameIntervals(t.intervals, intervals),
    );
    if (minor) {
      // keep the spelling of the chord type when it has a minor name, or
      // when it's composed and "m" + name is that chord ("m(add9)")
      const spelled = "m" + name;
      const keep =
        minor.aliases.includes(spelled) ||
        (getChordType(name).empty &&
          sameIntervals(chordType(spelled).intervals, intervals));
      return keep ? spelled : minor.aliases[0];
    }
  }

  // A minor form that isn't listed ("m7b9", "m7b5b9"), or the minor form of
  // a chord type without a third ("m11"): "m" + a spelling of the chord type,
  // the one written if it works
  const spellings = [name, ...type.aliases].map((spelling) => "m" + spelling);
  const minor = spellings.find((spelling) =>
    sameIntervals(chordType(spelling).intervals, intervals),
  );
  return minor ?? name;
}

// The intervals of the minor form of a chord type: the major third made
// minor, or a minor third added to a chord type without a third. Undefined
// when there's no minor form: the chord type already has a minor third, or
// the minor third would double another note (the #9 of "7#9").
function minorIntervals(intervals: string[]): string[] | undefined {
  if (intervals.includes("3m")) return undefined;
  const minor = intervals.includes("3M")
    ? intervals.map((ivl) => (ivl === "3M" ? "3m" : ivl))
    : [...intervals, "3m"];
  const chromas = new Set(minor.map((ivl) => interval(ivl).chroma));
  return chromas.size === minor.length ? minor : undefined;
}

const sameIntervals = (a: string[], b: string[]) =>
  a.length === b.length && a.every((ivl) => b.includes(ivl));

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
