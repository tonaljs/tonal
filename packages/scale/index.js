/**
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
 * scale.names() => ['major', 'minor', ...]
 * scale.detect('f5 d2 c5 b5 a2 e4 g') // => [ 'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'A aeolian', 'B locrian'])
 * @module scale
 */
import { name as noteName, pc } from "tonal-note/index";
import {
  modes as pcsetModes,
  chroma,
  isSubset,
  isSuperset
} from "tonal-pcset/index";
import { transpose } from "tonal-distance/index";
import { scale, chord } from "tonal-dictionary/index";
import { compact, unique, rotate } from "tonal-array/index";

const NO_SCALE = Object.freeze({
  name: null,
  intervals: [],
  names: [],
  chroma: null,
  setnum: null
});

const properties = name => {
  const intervals = scale(name);
  if (!intervals) return NO_SCALE;
  const s = { intervals, name };
  s.chroma = chroma(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = scale.names(s.chroma);
  return Object.freeze(s);
};

const memoize = (fn, cache) => str => cache[str] || (cache[str] = fn(str));

/**
 * Get scale properties. It returns an object with:
 * - name: the scale name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the scale intervals
 * - chroma:  scale croma (see pcset)
 * - setnum: scale chroma number
 *
 * @function
 * @param {String} name - the scale name (without tonic)
 * @return {Object} 
 */
export const props = memoize(properties, {});

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * const scale = require('tonal-scale')
 * scale.names() // => ['maj7', ...]
 */
export const names = scale.names;

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @function
 * @param {String} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<String>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 */
export const intervals = name => {
  const p = tokenize(name);
  return props(p[1]).intervals;
};

/**
 * Get the notes (pitch classes) of a scale. 
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @function
 * @param {String} tonic 
 * @param {String} name - the scale name
 * @return {Array} a pitch classes array
 * 
 * @example
 * scale.notes("C", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes("C4", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes("A4", "no-scale") // => []
 * scale.notes("blah", "major") // => []
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
 * @param {String} name - the scale name
 * @return {Boolean}
 */
export function exists(name) {
  const p = tokenize(name);
  return scale(p[1]) !== undefined;
}

/**
 * Given a string with a scale name and (optionally) a tonic, split 
 * that components.
 * 
 * It retuns an array with the form [ name, tonic ] where tonic can be a 
 * note name or null and name can be any arbitrary string 
 * (this function doesn't check if that scale name exists)
 *
 * @function
 * @param {String} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * scale.tokenize('C mixolydean') // => ["C", "mixolydean"]
 * scale.tokenize('anything is valid') // => [null, "anything is valid"]
 * scale.tokenize() // => [null, null]
 */
export function tokenize(str) {
  if (typeof str !== "string") return [null, null];
  const i = str.indexOf(" ");
  const tonic = noteName(str.substring(0, i)) || noteName(str);
  const name = tonic !== null ? str.substring(tonic.length + 1) : str;
  return [tonic, name.length ? name : null];
}

/**
 * Find mode names of a scale
 * 
 * @function
 * @param {String} name - scale name
 */
export const modeNames = name => {
  const ivls = intervals(name);

  return pcsetModes(ivls).map(chroma => {
    return scale.names(chroma)[0];
  });
};

/**
 * Get all chords that fits a given scale
 * 
 * @function
 * @param {String} name
 */
export const chords = name => {
  const ivls = intervals(name);
  return chord.names().filter(name => isSubset(chord(name), ivls));
};

/**
 * Given an array of notes, return the scale: a pitch class set starting from 
 * the first note of the array
 * 
 * @function
 * @param {Array} notes 
 * @return {Array}
 */
export const toScale = notes => {
  const pcset = compact(notes.map(pc));
  if (!pcset.length) return pcset;
  const tonic = pcset[0];
  const scale = unique(pcset);
  return rotate(scale.indexOf(tonic), scale);
};

/**
 * Find all scales than extends the given one
 * 
 * @function
 * @param {String} name 
 */
export const extensions = name => {
  const ivls = intervals(name);
  if (!ivls.length) return [];
  return scale.names().filter(name => isSuperset(scale(name), ivls));
};

export const detect = notes => {
  notes = toScale(notes);
  const modes = pcsetModes(notes);
  if (modes.length < 2) throw Error("It should have at least two notes");

  const results = [];

  names().forEach(name => {
    const p = props(name);
    modes.forEach((mode, i) => {
      if (isSubset(mode, p.chroma)) results.push([notes[i], name]);
    });
  });

  return results;
};
