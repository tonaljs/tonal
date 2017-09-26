import { midi, name } from "tonal-note";

export const rotate = (times, arr) => {
  var len = arr.length;
  var n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
};

export const compact = arr => arr.filter(n => n === 0 || n);

// a function that get note heights (with negative number for pitch classes)
const height = n => {
  const m = midi(n);
  return m !== null ? m : midi(n + "-100");
};

/**
 * Sort an array of notes in ascending order
 * 
 * @param {String|Array} notes
 * @return {Array} sorted array of notes
 */
export function sort(src) {
  return compact(src.map(name)).sort((a, b) => height(a) > height(b));
}

/**
 * Get sorted notes with duplicates removed
 * 
 * @function
 * @param {Array} notes
 */
export function unique(arr) {
  return sort(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * import * as array from 'tonal-array'
 * array.shuffle(["C", "D", "E", "F"])
 */
export var shuffle = arr => {
  var i, t;
  var m = arr.length;
  while (m) {
    i = (Math.random() * m--) | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

/**
 * Get all permutations of a list
 * http://stackoverflow.com/questions/9960908/permutations-in-javascript
 * 
 * @param {Array|Strng} list - the list
 * @return {Array<Array>} an array with all the permutations
 */
export const permutations = arr => {
  if (arr.length === 0) return [[]];
  return permutations(arr.slice(1)).reduce(function(acc, perm) {
    return acc.concat(
      arr.map(function(e, pos) {
        var newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
};
