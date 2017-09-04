/**
 * Functions to create and manipulate pitch sets
 *
 * @example
 * var pitchset = require('tonal-pitchset')
 *
 * @module pitchset
 */
import { sort } from "tonal-array";

/**
 * Get the notes of a pitch set. The notes in the set are sorted in asceding
 * pitch order, and no repetitions are allowed.
 *
 * Note that it creates pitch sets and NOT picth class sets. This functionallity
 * resides inside `tonal-pcset` module.
 *
 * @param {String|Array} notes - the notes to create the pitch set from
 * @return {Array<String>} the ordered pitch set notes
 * @example
 * pitchset.notes('C4 c3 C5 c4') // => ['C3', 'C4', 'C5']
 */
export function notes(notes) {
  return sort(notes).filter(function(n, i, arr) {
    return i === 0 || n !== arr[i - 1];
  });
}
