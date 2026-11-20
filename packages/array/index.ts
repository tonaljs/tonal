/* eslint-disable @typescript-eslint/no-explicit-any */
import { note, Note } from "@tonaljs/pitch-note";

// ascending range
function ascR(b: number, n: number) {
  const a = [];
  // tslint:disable-next-line:curly
  for (; n--; a[n] = n + b);
  return a;
}
// descending range
function descR(b: number, n: number) {
  const a = [];
  // tslint:disable-next-line:curly
  for (; n--; a[n] = b - n);
  return a;
}

/**
 * Create a list of numbers from `from` to `to`, both included, in steps of
 * one (descending if `to` is lower). It returns [] if either is not finite.
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * Array.range(-2, 2) // => [-2, -1, 0, 1, 2]
 * Array.range(2, -2) // => [2, 1, 0, -1, -2]
 * Array.range(1.5, 4) // => [1.5, 2.5, 3.5]
 */
export function range(from: number, to: number): number[] {
  if (!isFinite(from) || !isFinite(to)) return [];
  // the loops count down to 0, so the length must be an integer
  const n = Math.floor(Math.abs(to - from)) + 1;
  return from < to ? ascR(from, n) : descR(from, n);
}

/**
 * Rotate a list: move the first `times` items to the end (a negative number
 * rotates the other way). It returns a new array.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 *
 * @example
 * Array.rotate(1, [1, 2, 3]) // => [2, 3, 1]
 * Array.rotate(-1, [1, 2, 3]) // => [3, 1, 2]
 */
export function rotate<T>(times: number, arr: T[]): T[] {
  const len = arr.length;
  const n = ((times % len) + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}

/**
 * Get a copy of the array without the falsy values, except 0 (so null,
 * undefined, "", false and NaN are removed).
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * Array.compact(["a", null, "b", 0, undefined]) // => ["a", "b", 0]
 */
export function compact(arr: any[]): any[] {
  return arr.filter((n) => n === 0 || n);
}

/**
 * Get the names of the valid notes sorted from lowest to highest. Pitch
 * classes are listed before notes, and anything that is not a note is
 * removed.
 *
 * @param {string[]} notes
 * @return {string[]} sorted array of notes
 *
 * @example
 * Array.sortedNoteNames(["c2", "c5", "c1", "c0", "c6", "c"])
 * // => ["C", "C0", "C1", "C2", "C5", "C6"]
 * Array.sortedNoteNames(["c", "F", "G", "a", "b", "h", "J"])
 * // => ["C", "F", "G", "A", "B"]
 */
export function sortedNoteNames(notes: string[]): string[] {
  const valid = notes.map((n) => note(n)).filter((n) => !n.empty) as Note[];
  return valid.sort((a, b) => a.height - b.height).map((n) => n.name);
}

/**
 * Same as sortedNoteNames, but with repeated names removed.
 *
 * @function
 * @param {string[]} array
 * @return {string[]} unique sorted notes
 *
 * @example
 * Array.sortedUniqNoteNames(["a", "b", "c2", "1p", "p2", "c2", "b", "c", "c3"])
 * // => ["C", "A", "B", "C2", "C3"]
 */
export function sortedUniqNoteNames(arr: string[]): string[] {
  return sortedNoteNames(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

/**
 * Shuffle the array in place (Fisher–Yates) and return it. Pass a `rnd`
 * function (returning numbers from 0 to 1) to make it deterministic;
 * `Math.random` by default.
 *
 * @function
 * @param {Array} array
 * @return {Array} the array shuffled
 *
 * @example
 * Array.shuffle(["C", "D", "E", "F"], () => 0.5) // => ["C", "F", "D", "E"]
 */
export function shuffle(arr: any[], rnd = Math.random): any[] {
  let i: number;
  let t: any;
  let m: number = arr.length;
  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * Get all the permutations of an array (n! arrays).
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 * @example
 * Array.permutations(["a", "b"]) // => [["a", "b"], ["b", "a"]]
 * Array.permutations(["a", "b", "c"]) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */
export function permutations(arr: any[]): any[] {
  if (arr.length === 0) {
    return [[]];
  }
  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(
      arr.map((e, pos) => {
        const newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      }),
    );
  }, []);
}
