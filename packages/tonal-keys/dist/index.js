'use strict';

var tonalPitches = require('tonal-pitches');
var tonalDistances = require('tonal-distances');
var tonalRanges = require('tonal-ranges');
var tonalNotes = require('tonal-notes');

const areFlats = (s) => /^b+$/.test(s)
const areSharps = (s) => /^#+$/.test(s)

// Modes
// =====

// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var MODES = { major: 0, minor: 3, ionian: 0, dorian: 2, phrygian: 4,
  lydian: -1, mixolydian: 1, aeolian: 3, locrian: 5 }
const isModeStr = (m) => MODES[m] != null
const modes = () => Object.keys(MODES)

/**
 * Build a key object from tonic a mode. A key object has the following properties:
 * - `name` (String): the key name (i.e. 'Ab dorian'). Can be null.
 * - `mode` (String): the key mode (i.e. 'dorian')
 * - `tonic` (String): the tonic of the key (can be false)
 *
 * @param {String} tonic - the key tonic
 * @param {String} mode - the keymode
 * @return {Key} a key data object
 * @example
 * key.build('g', 'minor') // => { name: 'G minor', mode: 'minor', tonic: 'G'}
 */
function build (tonic, mode) {
  if (!tonalPitches.isStr(mode)) return null
  var m = mode.trim().toLowerCase()
  if (!isModeStr(m)) return null
  var t = tonalNotes.pc(tonic) || false
  var n = t ? t + ' ' + m : null
  return { name: n, tonic: t, mode: m }
}

/**
 * Test if a given object is a key data object
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if it's a key object
 */
const isKey = (o) => o && tonalPitches.isDef(o.tonic) && tonalPitches.isStr(o.mode)
/**
 * Test if the given object is a key with tonic
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if it a key with tonic
 */
const hasTonic = (o) => isKey(o) && o.tonic

// create a interval of n * P5
const nP5 = (n) => ['tnl', n, 0, 1]
const major = (n) => build(tonalDistances.transpose('C', nP5(n)), 'major')

/**
 * Create a key from alterations
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 */
const fromAlter = (n) => tonalPitches.isNum(n) ? major(n) : null

/**
 * Create a key from accidentals
 * @function
 * @param {String} acc - the accidentals string
 * @return {Key} the key object
 */
const fromAcc = (s) => areSharps(s) ? major(s.length) : areFlats(s) ? major(-s.length) : null

/**
 * Create a key from key name
 * @function
 * @param {String} name - the key name
 * @return {Key} the key object or null if not valid key
 */
const fromName = (str) => {
  if (!tonalPitches.isStr(str)) return null
  var p = str.split(/\s+/)
  switch (p.length) {
    case 1: return tonalPitches.isNoteStr(p[0]) ? build(p[0], 'major')
      : isModeStr(p[0]) ? build(false, p[0]) : null
    case 2: return build(p[0], p[1])
    default: return null
  }
}

/**
 * Try to interpret the given object as a key
 * @function
 * @param {Object} obj
 * @return {Key} the key object or null
 */
const asKey = (obj) => {
  return isKey(obj) ? obj : fromName(obj) || fromAcc(obj) || fromAlter(obj)
}
const keyFn = (fn) => (key) => {
  const k = asKey(key)
  return k ? fn(k) : null
}

const modeNum = (k) => MODES[k.mode]

/**
 * Get relative of a key
 * @function
 */
const relative = (rel, key) => {
  const r = asKey(rel)
  if (hasTonic(r)) return null
  const k = asKey(key)
  if (!hasTonic(k)) return null
  const i = tonalPitches.ivlPitch(modeNum(r) - modeNum(k), 0)
  const tonic = tonalDistances.transpose(k.tonic, i)
  return build(tonic, rel)
}

/**
 * Get key alteration
 * @function
 */
const alteration = (key) => {
  const k = asKey(key)
  if (!hasTonic(k)) return null
  const toMajor = modeNum(k)
  const toC = tonalPitches.parseNote(k.tonic)[1]
  return toC + toMajor
}

/**
 * Get the signature of a key. The signature is a string with sharps or flats.
 * @function
 * @example
 * var key = require('tonal-keys')
 * key.signature('A major') // => '###'
 */
const signature = (key) => {
  return tonalPitches.toAcc(alteration(key))
}

/**
 * An alias for `signature()`
 * @function
 */
const accidentals = signature

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * @function
 */
const alteredNotes = (key) => {
  var alt = alteration(key)
  return alt === null ? null
    : alt < 0 ? tonalRanges.midi(-1, alt).map(tonalDistances.fifthsFrom('F'))
    : tonalRanges.midi(1, alt).map(tonalDistances.fifthsFrom('B'))
}

exports.areFlats = areFlats;
exports.areSharps = areSharps;
exports.isModeStr = isModeStr;
exports.modes = modes;
exports.build = build;
exports.isKey = isKey;
exports.hasTonic = hasTonic;
exports.fromAlter = fromAlter;
exports.fromAcc = fromAcc;
exports.fromName = fromName;
exports.asKey = asKey;
exports.keyFn = keyFn;
exports.relative = relative;
exports.alteration = alteration;
exports.signature = signature;
exports.accidentals = accidentals;
exports.alteredNotes = alteredNotes;