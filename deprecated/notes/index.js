/**
 * [![npm version](https://img.shields.io/npm/v/tonal-notes.svg)](https://www.npmjs.com/package/tonal-notes)
 * [![tonal](https://img.shields.io/badge/tonal-notes-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * > Manipulate arrays of music notes
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * ```js
 * import { sort } as collection from 'tonal-notes'
 * sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
 * sort(["g", "a", "f", "d", "c", "b", "e"]) // => ["C", "D", "E", "F", "G", "A", "B"]
 * 
 * // part of tonal
 * const tonal = require('tonal')
 * tonal.notes.sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-notes](https://nodei.co/npm/tonal-notes.png?mini=true)](https://npmjs.org/package/tonal-notes/)
 *
 * ## API Documentation
 *
 * @module notes
 */
import { name, midi, pc } from "tonal-note/index";

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
  const ns = filter(src).sort((a, b) => height(a) > height(b));
  return ns;
}

/**
 * Get notes sorted with duplicates removed
 * 
 * @param {Array} notes
 */
export function unique(arr) {
  return sort(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

const compact = arr => arr.filter(n => n === 0 || n);

/**
 * Filter all except notes from an array
 * 
 * @param {Array} source
 * @return {Array}
 * @example
 * notes.filter("c d5 p5 5p other") // => ["C", "D5"]
 */
export function filter(arr, fn = name) {
  return compact(arr.map(fn));
}

const rotate = (arr, times) => {
  const len = arr.length;
  const n = times % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
};

/**
 * Get a pitch class set, ordered, starting from the first note
 * 
 * @param {Array} notes
 * @return {Array} a pitch class set ordered starting from the first note
 */
export function pcset(notes) {
  const pcset = compact(notes.map(pc));
  if (!pcset.length) return pcset;
  const tonic = pcset[0];
  const scale = unique(pcset);
  return rotate(scale, scale.indexOf(tonic));
}
