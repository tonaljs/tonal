/**
 * This module implements functions related to triads (tertians), chords constructed
 * from the intervals of (major and minor) thirds.
 *
 * @module triad
 */
import { permutations } from "tonal-array";
import { transpose } from "tonal-transpose";

/**
 * Given a scale, return a triadic structure starting from the root of the scale
 * For example, given "c d e f g a b" returns "Mm"
 * @param {Array} scale - the scale
 */
export function fromScale(scale, steps = 2) {}

/**
 * Given a triad structure, return the intervals
 * The structure is a string like 'mmM' where 'm' denotes a minor third
 * and 'M' a major one.
 * @param {String} structure - the triad structure
 * @return {Array<String>} an array of intervals
 * @example
 * triad.intervals('Mmm') // => [ '1P', '3M', '5P', '7m' ]
 */
export function intervals(st) {
  var inner = st.split("").map(t => (t === "m" ? "3m" : "3M"));
  return inner.reduce(
    function(ivls, v) {
      ivls.push(transpose(v, ivls[ivls.length - 1]));
      return ivls;
    },
    ["1P"]
  );
}

export function allFor(st) {
  return sortedSet(permutations(st.split("")).map(s => s.join("")));
}

function sortedSet(arr) {
  return arr.sort().filter(function(v, i) {
    return i === 0 || v !== arr[i - 1];
  });
}
