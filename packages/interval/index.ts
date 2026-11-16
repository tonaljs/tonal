import { IntervalCoordinates, NoteCoordinates, pitch } from "@tonaljs/pitch";
import { distance as dist } from "@tonaljs/pitch-distance";
import {
  IntervalName,
  coordToInterval,
  interval as props,
} from "@tonaljs/pitch-interval";

/**
 * Get the natural list of names
 */
export function names(): IntervalName[] {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}

/**
 * Get properties of an interval
 *
 * @function
 * @example
 * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
 */
export const get = props;

/**
 * Get name of an interval
 *
 * @function
 * @example
 * Interval.name('4P') // => "4P"
 * Interval.name('P4') // => "4P"
 * Interval.name('C4') // => ""
 */
export const name = (name: string) => props(name).name;

/**
 * Get semitones of an interval
 * @function
 * @example
 * Interval.semitones('P4') // => 5
 */
export const semitones = (name: string) => props(name).semitones;

/**
 * Get quality of an interval
 * @function
 * @example
 * Interval.quality('P4') // => "P"
 */
export const quality = (name: string) => props(name).q;

/**
 * Get number of an interval
 * @function
 * @example
 * Interval.num('P4') // => 4
 */
export const num = (name: string) => props(name).num;

/**
 * Get the simplified version of an interval: the same quality and direction,
 * with the number reduced to an octave or less. An octave stays an octave,
 * so only a unison simplifies to a unison.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "-2M"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 */
export function simplify(name: IntervalName): IntervalName {
  const i = props(name);
  return i.empty ? "" : i.simple + i.q;
}

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval: the interval that completes its simplified version to an
 * octave. A unison and an octave invert to each other, compound intervals
 * are simplified first, and the direction is kept.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 * Interval.invert("1P") // => "8P"
 * Interval.invert("9M") // => "7m"
 * Interval.invert("-3M") // => "-6m"
 */
export function invert(name: IntervalName): IntervalName {
  const i = props(name);
  if (i.empty) {
    return "";
  }
  // the simplified number goes from 1 to 8, so its inversion too
  const inverted = 9 - Math.abs(i.simple);
  const step = inverted === 8 ? 0 : inverted - 1;
  const oct = inverted === 8 ? 1 : 0;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return props({ step, alt, oct, dir: i.dir }).name;
}

/**
 * Get the pitch class of an interval: the interval within an octave, and
 * ascending by letter, that leads to the same pitch class. It ignores
 * octaves and direction, like the distance between two pitch classes.
 *
 * @function
 * @param {string} interval - the interval
 * @return {string} the pitch class of the interval
 *
 * @example
 * Interval.pitchClass("10M") // => "3M"
 * Interval.pitchClass("-3M") // => "6m"
 * Interval.pitchClass("8P") // => "1P"
 * Interval.pitchClass("-1A") // => "1d"
 */
export function pitchClass(name: IntervalName): IntervalName {
  const i = props(name);
  if (i.empty) {
    return "";
  }
  const fifths = i.coord[0];
  // the octaves that keep the letter steps from 0 to 6 (see distance)
  const octs = -Math.floor((fifths * 4) / 7);
  return props(pitch([fifths, octs, 1])).name;
}

/**
 * Get the same interval in the opposite direction.
 *
 * @function
 * @param {string} interval - the interval
 * @return {string} the negated interval
 *
 * @example
 * Interval.negate("3M") // => "-3M"
 * Interval.negate("-5P") // => "5P"
 * Interval.negate("1A") // => "-1A"
 */
export function negate(name: IntervalName): IntervalName {
  return multiply(name, -1);
}

/**
 * Get the ascending version of an interval: the interval itself if it
 * ascends, and its negation if it descends.
 *
 * @function
 * @param {string} interval - the interval
 * @return {string} the ascending interval
 *
 * @example
 * Interval.abs("-3M") // => "3M"
 * Interval.abs("3M") // => "3M"
 * Interval.abs("1d") // => "1A" (one semitone down, like "-1A")
 */
export function abs(name: IntervalName): IntervalName {
  const i = props(name);
  if (i.empty) {
    return "";
  }
  const named = coordToInterval(i.coord);
  return named.dir < 0 ? negate(named.name) : named.name;
}

/**
 * Multiply an interval by an integer: stack it that many times. A negative
 * number stacks it in the opposite direction, and zero gives a unison.
 *
 * @function
 * @param {string} interval - the interval
 * @param {number} times - an integer
 * @return {string} the multiplied interval, or "" if times is not an integer
 *
 * @example
 * Interval.multiply("5P", 3) // => "13M"
 * Interval.multiply("2M", 3) // => "4A"
 * Interval.multiply("3M", -2) // => "-5A"
 * Interval.multiply("3m", 0) // => "1P"
 */
export function multiply(name: IntervalName, times: number): IntervalName {
  const i = props(name);
  if (i.empty || !Number.isInteger(times)) {
    return "";
  }
  const [fifths, octs] = i.coord;
  return coordToInterval([fifths * times, octs * times]).name;
}

// interval numbers
const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// interval qualities
const IQ = "P m M m M P d P m M m M".split(" ");

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitrary, but deterministic.
 *
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * Interval.fromSemitones(7) // => "5P"
 * Interval.fromSemitones(-7) // => "-5P"
 */
export function fromSemitones(semitones: number): IntervalName {
  const d = semitones < 0 ? -1 : 1;
  const n = Math.abs(semitones);
  const c = n % 12;
  const o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}

/**
 * Find interval between two notes
 *
 * @example
 * Interval.distance("C4", "G4"); // => "5P"
 */
export const distance = dist;

/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * Interval.add("3m", "5P") // => "7m"
 */
export const add = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);

/**
 * Returns a function that adds an interval
 *
 * @function
 * @example
 * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
 */
export const addTo = (interval: string) => (other: string) =>
  add(interval, other);

/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the subtracted interval name
 * @example
 * Interval.subtract('5P', '3M') // => '3m'
 * Interval.subtract('3M', '5P') // => '-3m'
 */
export const subtract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);

export function transposeFifths(
  interval: IntervalName,
  fifths: number,
): IntervalName {
  const ivl = get(interval);
  if (ivl.empty) return "";

  const [nFifths, nOcts, dir] = ivl.coord;
  return coordToInterval([nFifths + fifths, nOcts, dir]).name;
}

/**
 * The consonance of an interval: a perfect consonance, an imperfect
 * consonance, or a dissonance
 */
export type Consonance = "perfect" | "imperfect" | "dissonant";

export interface ConsonanceOptions {
  /**
   * Count the perfect fourth as a perfect consonance, as between upper voices
   * or in early counterpoint. By default it's a dissonance, as against the
   * bass in common practice harmony.
   */
  consonantFourth?: boolean;
}

/**
 * Classify an interval as a perfect consonance (unison, fifth and octave), an
 * imperfect consonance (thirds and sixths) or a dissonance (seconds, sevenths,
 * the fourth, and every augmented or diminished interval).
 *
 * The spelling decides, not the sound: a diminished fourth sounds like a
 * major third, but it's a dissonance. Direction and octaves don't change the
 * consonance. Invalid intervals give an empty string.
 *
 * @function
 * @param {string} interval - the interval
 * @param {ConsonanceOptions} options - `consonantFourth: true` makes the
 * perfect fourth a perfect consonance
 * @return {string} "perfect", "imperfect", "dissonant" or ""
 *
 * @example
 * Interval.consonance("5P") // => "perfect"
 * Interval.consonance("10m") // => "imperfect"
 * Interval.consonance("-6M") // => "imperfect"
 * Interval.consonance("7m") // => "dissonant"
 * Interval.consonance("4d") // => "dissonant"
 * Interval.consonance("4P") // => "dissonant"
 * Interval.consonance("4P", { consonantFourth: true }) // => "perfect"
 */
export function consonance(
  name: IntervalName,
  options: ConsonanceOptions = {},
): Consonance | "" {
  const i = props(name);
  if (i.empty) {
    return "";
  }
  // the interval number within an octave, from 1 to 7, in either direction
  const simple = ((Math.abs(i.num) - 1) % 7) + 1;
  if (i.q === "P") {
    if (simple === 1 || simple === 5) return "perfect";
    if (simple === 4 && options.consonantFourth) return "perfect";
    return "dissonant";
  }
  if ((i.q === "M" || i.q === "m") && (simple === 3 || simple === 6)) {
    return "imperfect";
  }
  return "dissonant";
}

/**
 * Is the interval a perfect or an imperfect consonance? See `consonance`.
 *
 * @function
 * @param {string} interval - the interval
 * @param {ConsonanceOptions} options - `consonantFourth: true` makes the
 * perfect fourth a consonance
 * @return {boolean} true if the interval is consonant, false if it's
 * dissonant or invalid
 *
 * @example
 * Interval.isConsonant("6M") // => true
 * Interval.isConsonant("-12P") // => true
 * Interval.isConsonant("2M") // => false
 * Interval.isConsonant("4P") // => false
 * Interval.isConsonant("4P", { consonantFourth: true }) // => true
 */
export function isConsonant(
  name: IntervalName,
  options: ConsonanceOptions = {},
): boolean {
  const c = consonance(name, options);
  return c === "perfect" || c === "imperfect";
}

/** @deprecated */
export default {
  names,
  get,
  name,
  num,
  semitones,
  quality,
  fromSemitones,
  distance,
  invert,
  simplify,
  pitchClass,
  negate,
  abs,
  multiply,
  add,
  addTo,
  subtract,
  transposeFifths,
  consonance,
  isConsonant,
};

//// PRIVATE ////

type Operation = (
  a: IntervalCoordinates,
  b: IntervalCoordinates,
) => NoteCoordinates;

function combinator(fn: Operation) {
  return (a: IntervalName, b: IntervalName): IntervalName | undefined => {
    const coordA = props(a).coord;
    const coordB = props(b).coord;
    if (coordA && coordB) {
      const coord = fn(coordA, coordB);
      return coordToInterval(coord).name;
    }
  };
}
