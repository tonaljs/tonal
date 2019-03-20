import { props, name } from "../note";
const isArray = Array.isArray;

/**
 * Tonal array utilities. Sort notes by pitch, remove duplicates,
 * create ranges with notes or numbers.
 *
 * ## Usage
 *
 * @example
 * import Array from 'tonal/array';
 * Array.sort(["f", "a", "c"])
 *
 * @example
 * const Tonal = require("tonal")
 * Tonal.Array.range(1, 4)
 *
 * ## API
 *
 * @module Array
 */
export default {
  range,
  rotate,
  compact,
  sort,
  sortedUniq,
  shuffle,
  permutations
};

// ascending range
function ascR(b, n) {
  const a = [];
  for (; n--; a[n] = n + b);
  return a;
}
// descending range
function descR(b, n) {
  const a = [];
  for (; n--; a[n] = b - n);
  return a;
}

/**
 * Assert the value is an array
 * @private
 */
export function assert(array, msg = "Must be an array.") {
  if (!isArray(array)) throw Error(msg + " Was: " + array);
}

/**
 * Create a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * Array.range(-2, 2) // => [-2, -1, 0, 1, 2]
 * Array.range(2, -2) // => [2, 1, 0, -1, -2]
 */
export function range(a, b) {
  return a === null || b === null
    ? []
    : a < b
    ? ascR(a, b - a + 1)
    : descR(a, a - b + 1);
}

/**
 *
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 *
 * @example
 * Array.rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */
export function rotate(times, arr) {
  const len = arr.length;
  const n = ((times % len) + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}

/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * Array.compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */
export function compact(arr) {
  return arr.filter(n => n === 0 || n);
}

// a function that get note heights (with negative number for pitch classes)
const height = name => {
  const m = props(name).midi;
  return m !== null ? m : props(name + "-100").midi;
};

/**
 * Sort an array of notes in ascending order. Pitch classes are listed
 * before notes. Any string that is not a note is removed.
 *
 * @param {Array<string>} notes
 * @return {Array<string>} sorted array of notes
 *
 * @example
 * Array.sort(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
 * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
 * Array.sort(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
 * // => ['C', 'F', 'G', 'A', 'B']
 */
export function sort(src) {
  return compact(src.map(name)).sort((a, b) => height(a) > height(b));
}

/**
 * Get sorted notes with duplicates removed. Pitch classes are listed
 * before notes.
 *
 * @function
 * @param {Array<string>} array
 * @return {Array<string>} unique sorted notes
 *
 * @example
 * Array.sortedUniq(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
 * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
 */
export function sortedUniq(arr) {
  return sort(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} array
 * @return {Array} the array shuffled
 *
 * @example
 * Array.shuffle(["C", "D", "E", "F"]) // => [...]
 */
export function shuffle(arr, rnd = Math.random) {
  let i, t;
  let m = arr.length;
  while (m) {
    i = (rnd() * m--) | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * Get all permutations of an array
 * http://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 * @example
 * Array.permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 *
 */
export function permutations(arr) {
  if (arr.length === 0) return [[]];
  return permutations(arr.slice(1)).reduce(function(acc, perm) {
    return acc.concat(
      arr.map(function(e, pos) {
        const newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
}
