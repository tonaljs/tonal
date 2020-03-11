import {
  coordToInterval,
  distance as dist,
  interval as props,
  IntervalCoordinates,
  IntervalName,
  NoteCoordinates,
  tokenizeInterval as tokenize
} from "@tonaljs/core";

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
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "7m"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 */
export function simplify(name: IntervalName): IntervalName {
  const i = props(name);
  return i.empty ? "" : i.simple + i.q;
}

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 */
export function invert(name: IntervalName): IntervalName {
  const i = props(name);
  if (i.empty) {
    return "";
  }
  const step = (7 - i.step) % 7;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return props({ step, alt, oct: i.oct, dir: i.dir }).name;
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
 * @return {string} the substracted interval name
 * @example
 * Interval.substract('5P', '3M') // => '3m'
 * Interval.substract('3M', '5P') // => '-3m'
 */
export const substract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);

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
  add,
  addTo,
  substract
};

//// PRIVATE ////

type Operation = (
  a: IntervalCoordinates,
  b: IntervalCoordinates
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
