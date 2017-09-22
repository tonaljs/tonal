/**
 * _Key_ refers to the tonal system based on the major and minor scales. This is
 * is the most common tonal system, but tonality can be present in music
 * based in other scales or concepts.
 *
 * This is a collection of functions related to keys.
 *
 * @example
 * const key = require('tonal-key')
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 * key.relative('minor', 'C major') // => 'A minor'
 *
 * @module key
 */

import { areFlats, areSharps, toAcc } from "tonal-notation";
import { trFifths } from "tonal-transpose";
import { pc, pcFifths } from "tonal-note";
import { numeric } from "tonal-range";
import { rotate } from "tonal-array";
import { harmonics, harmonize } from "tonal-harmonizer";

const MODES = "ionian dorian phrygian lydian mixolydian aeolian locrian major minor".split(
  " "
);

const CHORDS = "Maj7 m7 m7 Maj7 7 m7 m7b5".split(" ");

// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
const FIFTHS = [0, 2, 4, -1, 1, 3, 5, 0, 3];
const OFFSETS = [0, 1, 2, 3, 4, 5, 6, 0, 5];
const SCALES = OFFSETS.map(function(n) {
  return harmonics(rotate(n, ["C", "D", "E", "F", "G", "A", "B"]));
});

// PRIVATE
// Given a tonic, mode pair, return the key string
function toKey(t, m) {
  return !t ? m : t + " " + m;
}
// Given the alterations, return the major key
function majorKey(n) {
  return toKey(trFifths("C", n), "major");
}
// given the mode name, return the alterations
function modeNum(mode) {
  return FIFTHS[MODES.indexOf(mode)];
}
const offset = mode => OFFSETS[MODES.indexOf(mode)];

// given a string, return the valid mode it represents or null
function validMode(m) {
  m = m.trim().toLowerCase();
  return MODES.indexOf(m) === -1 ? null : m;
}

/**
 * Return the key properties, an object with { tonic, mode }
 *
 * @param {String} name - the key name
 * @return {Key} the key properties object or null if not a valid key
 * @example
 * const key = require('tonal-key')
 * key.props('C3 dorian') // => { tonic: 'C', mode: 'dorian' }
 * key.props('dorian') // => { tonic: false, mode: 'dorian' }
 * key.props('Ab bebop') // => null
 * key.props('blah') // => null
 */
export function props(str) {
  if (typeof str !== "string") return null;
  const ndx = str.indexOf(" ");
  let key;
  if (ndx === -1) {
    const p = pc(str);
    key = p
      ? { tonic: p, mode: "major" }
      : { tonic: false, mode: validMode(str) };
  } else {
    key = { tonic: pc(str.slice(0, ndx)), mode: validMode(str.slice(ndx + 1)) };
  }
  return key.mode ? key : null;
}

export const chords = (tonic, mode) => {
  const notes = scale(tonic + " " + mode);
  const chords = rotate(offset(mode), CHORDS);

  return notes.map((note, i) => note + chords[i]);
};

/**
 * Test if a given name is a valid key name
 *
 * @param {String} name
 * @param {Boolean}
 * @example
 * key.isKeyName('C major') // => true
 * key.isKeyName('major') // => true
 * key.isKeyName('Bb bebop') // => false
 */
export function isKeyName(name) {
  return props(name) !== null;
}

/**
 * Get the tonic of a key
 *
 * @param {String} key - the key
 * @return {String} the tonic or false is no tonic, or null if its not a valid key
 * @example
 * key.tonic('c3 major') // => 'C'
 * key.tonic('minor') // => false
 * key.tonic('bebop') // null
 */
export function tonic(key) {
  return (props(key) || key || {}).tonic || null;
}

/**
 * Get the mode of a key. It can be used to test if its a valid key mode.
 *
 * @param {String}
 * @return {Boolean}
 * @example
 * key.mode('A dorian') // => 'dorian'
 * key.mode('DORIAN') // => 'dorian'
 * key.mode('mixophrygian') // => null
 */
export function mode(key) {
  return (props(key) || key || {}).mode || null;
}

/**
 * Get relative of a key. Two keys are relative when the have the same
 * key signature (for example C major and A minor)
 *
 * It can be partially applied.
 *
 * @param {String} mode - the relative destination
 * @param {String} key - the key source
 * @example
 * key.relative('dorian', 'B major') // => 'C# dorian'
 * // partial application
 * const minor = key.relative('minor')
 * minor('C major') // => 'A minor'
 * minor('E major') // => 'C# minor'
 */
export function relative(rel, key) {
  if (arguments.length === 1)
    return function(k) {
      return relative(rel, k);
    };
  rel = props(rel);
  if (!rel || rel.tonic) return null;
  key = props(key);
  if (!key || !key.tonic) return null;
  const tonic = trFifths(key.tonic, modeNum(rel.mode) - modeNum(key.mode));
  return toKey(tonic, rel.mode);
}

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * the same order than in the key signature.
 * @param {String|Nunber} key
 * @return {Array}
 * @example
 * const key = require('tonal-keys')
 * key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
 */
export function alteredNotes(key) {
  const alt = alteration(key);
  return alt === null
    ? null
    : alt < 0
      ? numeric([-1, alt]).map(trFifths("F"))
      : numeric([1, alt]).map(trFifths("B"));
}

/**
 * Get a list of valid mode names. The list of modes will be always in
 * increasing order (ionian to locrian)
 *
 * @param {Boolean} alias - true to get aliases names
 * @return {Array} an array of strings
 * @example
 * key.modes() // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian' ]
 * key.modes(true) // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian', 'major', 'minor' ]
 */
export function modes(alias) {
  return alias ? MODES.slice() : MODES.slice(0, -2);
}

/**
 * Create a major key from alterations
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 * @example
 * const key = require('tonal-key')
 * key.fromAlter(2) // => 'D major'
 */
export function fromAlter(n) {
  return typeof n === "number" ? majorKey(n) : null;
}

/**
 * Get key name from accidentals
 *
 * @param {String} acc - the accidentals string
 * @return {Key} the key object
 * @example
 * const key = require('tonal-key')
 * key.fromAcc('b') // => 'F major'
 * key.fromAcc('##') // => 'D major'
 */
export function fromAcc(s) {
  return areSharps(s)
    ? majorKey(s.length)
    : areFlats(s) ? majorKey(-s.length) : null;
}

/**
 * Get scale of a key
 *
 * @param {String|Object} key
 * @return {Array} the key scale
 * @example
 * key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
 * key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
 * key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 */
export function scale(key) {
  const p = props(key);
  if (!p || !p.tonic) return null;
  return harmonize(SCALES[MODES.indexOf(p.mode)], p.tonic);
}

/**
 * Get key alteration. The alteration is a number indicating the number of
 * sharpen notes (positive) or flaten notes (negative)
 * @param {String|Integer} key
 * @return {Integer}
 * @example
 * const key = require('tonal-keys')
 * key.alteration('A major') // => 3
 */
export function alteration(key) {
  const k = props(key);
  if (!k || !k.tonic) return null;
  const toMajor = modeNum(k.mode);
  const toC = pcFifths(k.tonic);
  return toC - toMajor;
}

/**
 * Get the signature of a key. The signature is a string with sharps or flats.
 * @example
 * const key = require('tonal-keys')
 * key.signature('A major') // => '###'
 */
export function signature(key) {
  return toAcc(alteration(key));
}

/**
 * An alias for `signature()`
 * @function
 */
export const accidentals = signature;
