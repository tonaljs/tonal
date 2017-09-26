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
import {
  scale,
  chord,
  dictionary,
  detector,
  index
} from "tonal-dictionary/index";
import { map, compact, rotate } from "tonal-array";
import { pc, name as note, isNote } from "tonal-note/index";
import { transpose, subtract } from "tonal-distance/index";
import { modes as setModes, chroma, isSubset } from "tonal-pcset";
import { harmonize } from "tonal-harmonizer";
import DATA from "./scales.json";

const dict = dictionary(DATA, function(str) {
  return str.split(" ");
});

/**
 * Get scale notes or intervals. It *always* return an array and the notes
 * are *always* pitch classes
 *
 * @param {String} name - the scale name 
 * @param [String] tonic - the tonic (optional)
 * @return {Array} the scale intervals or pitch classes (if tonic is provided)
 *
 * @example
 * scale.get('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 */
export function get(type, tonic) {}

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
export const names = scale.keys;

/**
 * Get the notes (pitch classes) of a scale. 
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @param {String} tonic 
 * @param {String} name - the scale name
 * @return {Array} a pitch classes array
 * 
 * @example
 * scale.notes('major', 'C') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes('major', 'C4') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes('nonsense') // => []
 * scale.notes('major', 'nonsense') // => []
 */
export function notes(name, tonic) {
  const ivls = scale(name);
  return isNote(tonic) && ivls ? ivls.map(transpose(tonic)) : [];
}

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @param {String} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<String>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 */
export function intervals(name) {
  return scale(name) || [];
}

/**
 * Check if the given name is a known scale from the scales dictionary
 * 
 * @param {String} name - the scale name
 * @return {Boolean}
 */
export function exists(name) {
  return scale(name) !== undefined;
}

/**
 * Given a string with a scale name and (optionally) a tonic, split 
 * that components.
 * 
 * It retuns an array with the form [ name, tonic ] where tonic can be a 
 * note name or null and name can be any arbitrary string 
 * (this function doesn't check if that scale name exists)
 *
 * @param {String} name - the scale name
 * @return {Object} an object { tonic, type }
 * @example
 * scale.parseName('C mixoblydean') // => { tonic: 'C', type: 'mixoblydean' }
 * scale.parseName('anything is valid') // => { tonic: false, type: 'anything is valid'}
 */
export function parseName(str) {
  if (typeof str !== "string") return null;
  const i = str.indexOf(" ");
  const tonic = note(str.substring(0, i)) || null;
  const name = tonic !== null ? str.substring(i + 1) : str;
  return [name, tonic];
}

/**
 * Detect a scale. Given a list of notes, return the scale name(s) if any.
 * It only detects chords with exactly same notes.
 *
 * @function
 * @param {Array|String} notes - the list of notes
 * @return {Array<String>} an array with the possible scales
 * @example
 * scale.detect('b g f# d') // => [ 'GMaj7' ]
 * scale.detect('e c a g') // => [ 'CM6', 'Am7' ]
 */
export const detect = detector(dict, " ");

let scaleIndex = null;
const find = notes => {
  if (!scaleIndex) scaleIndex = index(scale);
  return scaleIndex(notes);
};

/**
 * Find mode names of a scale
 * @param {String} name - scale name
 */
export const modes = name => {
  const ivls = intervals(name);
  if (!ivls) return [];

  return setModes(ivls).map(chroma => {
    return find(chroma)[0];
  });
};

/**
 * Get all chords that fits a given scale
 * 
 * @param {String} name
 */
export const chords = name => {
  const ivls = scale(name);
  return chord.keys().filter(name => isSubset(chord(name), ivls));
};
