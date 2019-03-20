import { fromSemitones } from "../interval";
import { transpose } from "../distance";
import { pc } from "../note";
import { compact } from "../array";
import { numeric } from "../range";
import { includes as isInSet } from "../pcset";
import data from "./tunings.js";

const isArray = Array.isArray;
const byName = data.reduce((index, [notes, name]) => {
  index[name] = notes.split(" ");
  return index;
}, {});

/**
 * This module has functions to create fretboards and query for instrument
 * tunnings.
 *
 * ## Usage
 *
 * ```js
 * // ES6 modules (import)
 * import Fretboard from 'tonal/fret-board'
 * Fretboard.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
 * ```
 *
 * ## API
 *
 * @module Fretboard
 */
export default {
  tuning,
  tuningNames,
  simpleTuning,
  notes,
  scale,
  chordShapes
};

/**
 * Given a tuning name, returns the notes of the strings in the open position
 * @function
 * @param {string} name - the tuning name
 * @return {Array<string>} the notes or empty array if no tuning found
 *
 * @example
 * Fretboard.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
 * Fretboard.tuning('charango') // => [ 'G4', 'G4', 'C5', 'C5', 'E5', 'E4', 'A4', 'A4', 'E5', 'E5' ]
 */
export function tuning(name) {
  return byName[name] || [];
}

/**
 * Get tuning names
 * @return {Array<string>} a list of available tunings
 * @example
 * Fretboard.tuningNames() // => ['guitar', 'guitar open D', ...]
 */
export function tuningNames() {
  return Object.keys(byName);
}

/**
 * Given a tuning name returns the notes of the strings in open position
 * as pitch classes removing doubled strings.
 * @param {string} name - the tuning name or notes of the strings in open position
 * @return {Array} the string notes as pitch classes
 * @example
 * fret.simpleTuning('guitar') => [ 'E', 'A', 'D', 'G', 'B', 'E' ]
 * fret.simpleTuning('charango') => [ 'G', 'C', 'E', 'A', 'E' ]
 */
export function simpleTuning(src) {
  const notes = isArray(src) ? src : tuning(src);
  const pcs = notes.map(pc);
  const simple = pcs.reduce(function(s, pc, i) {
    if (s === false) return s;
    else if (i % 2 === 0) s.push(pc);
    else if (s[s.length - 1] !== pc) return false;
    return s;
  }, []);
  return simple || pcs;
}

/**
 * Build a fretboard using a given tuning (or tuning name), first and last
 * fret numbers and optionally a chord or scale
 *
 * It returns an array of arrays, where each sub-array is the notes of
 * a string.
 *
 * @param {string|Array} tuning - the tuning name or notes
 * @param {Integer} first - the first fret number
 * @param {Integer} last - the last fret number
 * @param {Array|string} set - a scale or chord to filter the fretboard
 * @return {Array} An array of arrays, one for each string
 */
export function notes(notes, first, last) {
  notes = isArray(notes) ? notes : tuning(notes);
  first = first || 0;
  last = last || first;

  const ivls = numeric([first, last]).map(fromSemitones);
  return notes.map(function(base) {
    return ivls.map(transpose(base));
  });
}

/**
 * Build a fretboard only showing the notes for the given scale.
 * @param {string|Array} tuning - the tuning name or notes
 * @param {string|Array} scale - the scale notes
 * @param {Integer} first - the first fret number
 * @param {Integer} last - the last fret number
 * @return {Array} An array of arrays, one for each string
 */
export function scale(tuning, scale, first, last) {
  const inScale = isInSet(scale);
  return notes(tuning, first, last).map(string =>
    string.map(note => (inScale(note) ? note : null))
  );
}

/**
 * Build an array of reachable chord shapes based on given notes and tuning.
 *
 * @param {string|Array} tuning - the tuning name or notes
 * @param {Array} notes - an array of chord notes
 * @param {Integer} first - the first fret number.  Default 0.
 * @param {Integer} last - the last fret number.  Default 12.
 * @param {Integer} span - how many frets to include per position.  Default 4.
 * @return {Array} An array of arrays, one for each possible shape.  Element index is string number [ '0', '2', '2', '1', '0', '0' ]
 */
export function chordShapes(tuning, notes, first, last, span = 4) {
  const fretboard = scale(tuning, notes, first || 0, last || 12);
  const positions = [];

  // Break each string array into {fretSpan} frets overlapping sections
  const strings = fretboard.map(function(string) {
    return string.map(function(fret, fretIndex) {
      return compact(
        string
          .slice(fretIndex, fretIndex + span)
          .map(function(slicedFret, slicedFretIndex) {
            // Convert note names to fret numbers
            return slicedFret !== null ? fretIndex + slicedFretIndex : null;
          })
      );
    });
  });

  // Build positions
  strings.forEach(function(string) {
    string.forEach(function(fretGroup, fretGroupIndex) {
      if (!Array.isArray(positions[fretGroupIndex]))
        positions[fretGroupIndex] = [];

      if (fretGroup.length > 1) positions[fretGroupIndex].push(fretGroup);
      else
        positions[fretGroupIndex].push(
          fretGroup.toString() ? fretGroup.toString() : null
        );
    });
  });

  // Remove null, neighboring duplicate arrays, and arrays with a only one non-null value
  return positions.filter(function(position, i) {
    if (compact(position).length < 2) return false;
    return i === 0
      ? position
      : positions[i].toString() !== positions[i - 1].toString();
  });
}
