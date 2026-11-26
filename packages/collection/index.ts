/* eslint-disable @typescript-eslint/no-explicit-any */
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
 * Collection.range(-2, 2) // => [-2, -1, 0, 1, 2]
 * Collection.range(2, -2) // => [2, 1, 0, -1, -2]
 * Collection.range(1.5, 4) // => [1.5, 2.5, 3.5]
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
 * @param {Array} collection
 * @return {Array} the rotated collection
 *
 * @example
 * Collection.rotate(1, [1, 2, 3]) // => [2, 3, 1]
 * Collection.rotate(-1, [1, 2, 3]) // => [3, 1, 2]
 */
export function rotate<T>(times: number, arr: T[]): T[] {
  if (!Array.isArray(arr)) return [];
  const len = arr.length;
  const n = ((times % len) + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}

/**
 * Get a copy of the collection without the falsy values, except 0 (so null,
 * undefined, "", false and NaN are removed).
 * @function
 * @param {Array} collection
 * @return {Array}
 *
 * @example
 * Collection.compact(["a", null, "b", 0, undefined]) // => ["a", "b", 0]
 */
export function compact(arr: any[]): any[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((n) => n === 0 || n);
}

/**
 * Shuffle the collection in place (Fisher–Yates) and return it. Pass a `rnd`
 * function (returning numbers from 0 to 1) to make it deterministic;
 * `Math.random` by default.
 *
 * @function
 * @param {Array} collection
 * @return {Array} the collection shuffled
 *
 * @example
 * Collection.shuffle(["C", "D", "E", "F"], () => 0.5) // => ["C", "F", "D", "E"]
 */
export function shuffle(arr: any[], rnd = Math.random): any[] {
  if (!Array.isArray(arr)) return [];
  if (typeof rnd !== "function") rnd = Math.random;
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
 * Get all the permutations of a collection (n! arrays).
 *
 * @param {Array} collection - the collection
 * @return {Array<Array>} an collection with all the permutations
 * @example
 * Collection.permutations(["a", "b"]) // => [["a", "b"], ["b", "a"]]
 * Collection.permutations(["a", "b", "c"]) // =>
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
  if (!Array.isArray(arr)) return [];
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

/** @deprecated */
export default {
  compact,
  permutations,
  range,
  rotate,
  shuffle,
};
