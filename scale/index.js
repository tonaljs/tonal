import { name as noteName, pc } from "../note";
import { modes as pcsetModes, isSubsetOf, isSupersetOf } from "../pcset";
import { transpose } from "../distance";
import { all as chordList } from "../chord-dictionary";
import { all as scales, find as findScale } from "../scale-dictionary";
import { compact, sortedUniq, rotate } from "../array";

/**
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * import Scale from "tonal/scale"
 * Scale.notes("Ab bebop") // => [ "Ab", "Bb", "C", "Db", "Eb", "F", "Gb", "G" ]
 *
 * @example
 * const Tonal = require("tonal");
 * Tonal.Scale.names() => ["major", "minor", ...]
 *
 * @module Scale
 */
export default {
  tokenize,
  props,
  names,
  intervals,
  notes,
  exists,
  modeNames,
  chords,
  toScale,
  supersets,
  subsets
};

const scaleName = scale => scale.name;

/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * Scale.tokenize("C mixolydean") // => ["C", "mixolydean"]
 * Scale.tokenize("anything is valid") // => ["", "anything is valid"]
 * Scale.tokenize() // => ["", ""]
 */
export function tokenize(str) {
  if (typeof str !== "string") return [null, ""];
  const i = str.indexOf(" ");
  const tonic = noteName(str.substring(0, i)) || noteName(str);
  const name = tonic ? str.substring(tonic.length + 1) : str;
  return [tonic, name.length ? name : ""];
}

/**
 * Get scale properties. It returns an object with:
 * - name: the scale name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the scale intervals
 * - chroma:  scale croma (see pcset)
 * - setnum: scale chroma number
 *
 * @function
 * @param {string} name - the scale name (without tonic)
 * @return {Object}
 */
export function props(name) {
  const [tonic, type] = tokenize(name);
  const scale = findScale(type);
  const props = {
    tonic,
    notes: tonic ? scale.intervals.map(transpose(tonic)) : []
  };
  return Object.assign(props, scale);
}

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} [aliases=false] - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * Scale.names() // => ["maj7", ...]
 */
export function names(aliases) {
  return aliases
    ? scales()
        .map(s => s.names)
        .reduce((a, b) => [...a, ...b])
    : scales().map(scaleName);
}

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @function
 * @param {string} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<string>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * Scale.intervals("major") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M" ]
 */
export function intervals(name) {
  const p = tokenize(name);
  return props(p[1]).intervals;
}

/**
 * Get the notes (pitch classes) of a scale.
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @function
 * @param {string} tonic
 * @param {string} nameOrTonic - the scale name or tonic (if 2nd param)
 * @param {string} [name] - the scale name without tonic
 * @return {Array} a pitch classes array
 *
 * @example
 * Scale.notes("C", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C4", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("A4", "no-scale") // => []
 * Scale.notes("blah", "major") // => []
 */
export function notes(nameOrTonic, name) {
  const p = tokenize(nameOrTonic);
  name = name || p[1];
  return intervals(name).map(transpose(p[0]));
}

/**
 * Check if the given name is a known scale from the scales dictionary
 *
 * @function
 * @param {string} name - the scale name
 * @return {Boolean}
 */
export function exists(name) {
  const p = tokenize(name);
  return findScale(p[1]).name !== undefined;
}

/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * Scale.modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */
export function modeNames(name) {
  const ivls = intervals(name);
  const tonics = notes(name);
  debugger;

  return pcsetModes(ivls)
    .map((chroma, i) => {
      const modeName = findScale(chroma).name;
      if (modeName) return [tonics[i] || ivls[i], modeName];
    })
    .filter(x => x);
}

/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * Scale.chords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */
export function chords(name) {
  const inScale = isSubsetOf(intervals(name));
  return chordList()
    .filter(chord => inScale(chord.intervals))
    .map(c => c.abbreviatures[0]);
}

/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {Array} notes
 * @return {Array}
 * @example
 * Scale.toScale(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * Scale.toScale(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */
export function toScale(notes) {
  const pcset = compact(notes.map(pc));
  if (!pcset.length) return pcset;
  const tonic = pcset[0];
  const scale = sortedUniq(pcset);
  return rotate(scale.indexOf(tonic), scale);
}

/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * Scale.supersets("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */
export function supersets(name) {
  if (!intervals(name).length) return [];
  const isSuperset = isSupersetOf(intervals(name));
  return scales()
    .filter(scale => isSuperset(scale.intervals))
    .map(scaleName);
}

/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * Scale.subsets("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */
export function subsets(name) {
  const isSubset = isSubsetOf(intervals(name));
  return scales()
    .filter(scale => isSubset(scale.intervals))
    .map(scaleName);
}
