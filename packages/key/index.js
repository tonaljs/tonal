/**
 * _Key_ refers to the tonal system based on the major and minor scales. This is
 * is the most common tonal system, but tonality can be present in music
 * based in other scales or concepts.
 *
 * This is a collection of functions related to keys.
 *
 * @example
 * var key = require('tonal-key')
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 * key.relative('minor', 'C major') // => ['minor', 'A']
 *
 * @module key
 */

import { areFlats, areSharps, toAcc } from 'tonal-notation'
import { trFifths } from 'tonal-transpose'
import { pc, pcFifths } from 'tonal-note'
import { numeric } from 'tonal-range'
import { rotate } from 'tonal-array'
import { harmonics, harmonize } from 'tonal-harmonizer'

var isArr = Array.isArray
// Order matters: use an array
var MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian',
  'aeolian', 'locrian', 'major', 'minor']
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5, 0, 3]
var SCALES = [0, 1, 2, 3, 4, 5, 6, 0, 5].map(function (n) {
  return harmonics(rotate(n, ['C', 'D', 'E', 'F', 'G', 'A', 'B']))
})

/**
 * Get scale of a key (with optionally a mode)
 *
 * @param {String|Object} key
 * @return {Array} the key scale
 * @example
 * var key = require('tonal-key')
 * key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
 * key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
 * key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 */
export function scale (key) {
  var k = asKey(key)
  if (!k || !hasTonic(k)) return null
  return harmonize(SCALES[MODES.indexOf(k[0])], k[1])
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
 * key.relative('dorian', 'C major') // => ['dorian', 'D']
 * // partially application
 * var minor = key.relative('minor')
 * minor('C major') // => ['minor', 'A']
 */
export function relative (rel, key) {
  if (arguments.length === 1) return function (k) { return relative(rel, k) }
  var r = asKey(rel)
  if (!r || hasTonic(r)) return null
  var k = asKey(key)
  if (!k || !hasTonic(k)) return null
  var tonic = trFifths(k[1], modeNum(r) - modeNum(k))
  return build(tonic, rel)
}

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * the same order than in the key signature.
 * @param {String|Nunber} key
 * @return {Array}
 * @example
 * var key = require('tonal-keys')
 * key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
 */
export function alteredNotes (key) {
  var alt = alteration(key)
  return alt === null ? null
    : alt < 0 ? numeric([-1, alt]).map(trFifths('F'))
    : numeric([1, alt]).map(trFifths('B'))
}

/**
 * Get a list of valid mode names. The list of modes will be always in
 * increasing order (ionian to locrian)
 *
 * @param {Boolean} alias - true to get aliases names
 * @return {Array} an array of strings
 */
export function names (alias) {
  return alias ? MODES.slice() : MODES.slice(0, -2)
}

/**
 * Check if the given string is a valid mode name
 * @param {String}
 * @return {Boolean}
 */
export function isKeyMode (m) { return MODES.indexOf(m) !== -1 }

/**
 * Build a key object from tonic a mode.
 *
 * A key object is an array with the mode name and the tonic (or false if
 * no tonic specified)
 *
 * @param {String} tonic - the key tonic (or null or false to no tonic)
 * @param {String} mode - the keymode
 * @return {Key} a key data object
 * @example
 * var key = require('tonal-key')
 * key.build('g3', 'minor') // => ['minor', 'G']
 * key.build(false, 'locrian') // => ['locrian', false]
 */
export function build (tonic, mode) {
  if (typeof mode !== 'string') return null
  var m = mode.trim().toLowerCase()
  if (!isKeyMode(m)) return null
  if (tonic === false || tonic === null) return [m, false]
  var t = pc(tonic)
  return t ? [m, t] : null
}

function isKey (o) { return isArr(o) && isKeyMode(o[0]) }
function hasTonic (o) { return isKey(o) && o[1] }

function majorKey (n) { return build(trFifths('C', n), 'major') }

/**
 * Create a major key from alterations
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 * @example
 * var key = require('tonal-key')
 * key.fromAlter(2) // => ['major', 'D']
 */
export function fromAlter (n) {
  return typeof n === 'number' ? majorKey(n) : null
}

/**
 * Create a major key from accidentals
 * @param {String} acc - the accidentals string
 * @return {Key} the key object
 * @example
 * var key = require('tonal-key')
 * key.fromAlter('bb') // => ['major', 'Bb']
 */
export function fromAcc (s) {
  return areSharps(s) ? majorKey(s.length)
    : areFlats(s) ? majorKey(-s.length)
    : null
}

/**
 * Create a key from key name
 * @param {String} name - the key name
 * @return {Key} the key object or null if not valid key
 * @example
 * var key = require('tonal-key')
 * key.fromName('C3 dorian') // => ['dorian', 'C']
 * key.fromName('blah') // => null
 */
export function fromName (str) {
  if (typeof str !== 'string') return null
  var p = str.split(/\s+/)
  switch (p.length) {
    case 1: return pc(p[0]) ? build(p[0], 'major') : build(false, p[0])
    case 2: return build(p[0], p[1])
    default: return null
  }
}

/**
 * Try to interpret the given object as a key. Given an object it will try to
 * parse as if it were a name, accidentals or alterations.
 * @function
 * @param {Object} obj
 * @return {Key} the key object or null
 */
export function asKey (obj) {
  return isKey(obj) ? obj : fromName(obj) || fromAcc(obj) || fromAlter(obj)
}

function modeNum (k) { return FIFTHS[MODES.indexOf(k[0])] }

/**
 * Get key alteration. The alteration is a number indicating the number of
 * sharpen notes (positive) or flaten notes (negative)
 * @param {String|Integer} key
 * @return {Integer}
 * @example
 * var key = require('tonal-keys')
 * key.alteration('A major') // => 3
 */
export function alteration (key) {
  var k = asKey(key)
  if (!k || !hasTonic(k)) return null
  var toMajor = modeNum(k)
  var toC = pcFifths(k[1])
  return toC - toMajor
}

/**
 * Get the signature of a key. The signature is a string with sharps or flats.
 * @example
 * var key = require('tonal-keys')
 * key.signature('A major') // => '###'
 */
export function signature (key) {
  return toAcc(alteration(key))
}

/**
 * An alias for `signature()`
 * @function
 */
export var accidentals = signature
