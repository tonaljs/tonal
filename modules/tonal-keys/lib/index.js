
const _ = require('tonal')
export const areFlats = (s) => /^b+$/.test(s)
export const areSharps = (s) => /^#+$/.test(s)

// Modes
// =====

var MODES = { major: 0, minor: 5, ionian: 0, dorian: 1, phrygian: 2,
  lydian: 3, mixolydian: 4, aeolian: 5, locrian: 6 }
export const isModeStr = (m) => MODES[m] != null
export const modes = () => Object.keys(MODES)

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
export function build (tonic, mode) {
  if (!_.isStr(mode)) return null
  var m = mode.trim().toLowerCase()
  if (!isModeStr(m)) return null
  var t = _.pc(tonic) || false
  var n = t ? t + ' ' + m : null
  return { name: n, tonic: t , mode: m }
}

/**
 * Test if a given object is a key data object
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if it's a key object
 */
export const isKey = (o) => o && _.isDef(o.tonic) && _.isStr(o.mode)
/**
 * Test if the given object is a key with tonic
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if it a key with tonic
 */
export const hasTonic = (o) => isKey(o) && o.tonic

// create a interval of n * P5
const nP5 = (n) => ['tnl', n, 0, 1]
const major = (n) => build(_.transpose('C', nP5(n)), 'major')

/**
 * Create a key from alterations
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 */
export const fromAlter = (n) => major(+n)

/**
 * Create a key from accidentals
 * @function
 * @param {String} acc - the accidentals string
 * @return {Key} the key object
 */
export const fromAcc = (s) => areSharps(s) ? major(s.length) : areFlats(s) ? major(-s.length) : null

/**
 * Create a key from key name
 * @function
 * @param {String} name - the key name
 * @return {Key} the key object or null if not valid key
 */
export const fromName = (str) => {
  if (!_.isStr(str)) return null
  var p = str.split(/\s+/)
  switch (p.length) {
    case 1: return _.isNoteStr(p[0]) ? build(p[0], 'major')
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
export const asKey = (obj) => {
  return isKey(obj) ? obj : fromName(obj) || fromAcc(obj) || fromAlter(obj)
}
export const keyFn = (fn) => (key) => {
  const k = asKey(key)
  return k ? fn(k) : null
}

const modeNum = (k) => MODES[k.mode]

/**
 * Get relative of a key
 * @function
 */
export const relative = (rel, key) => {
  const r = asKey(rel)
  if (hasTonic(r)) return null
  const k = asKey(key)
  if (!hasTonic(k)) return null
  const toMajor = _.ivl(modeNum(k), 0, 0, -1)
  const toRel = _.ivl(modeNum(r), 0, 0, 1)
  const tonic = _.transpose(k.tonic, _.transpose(toMajor, toRel))
  return build(tonic, rel)
}

/**
 * Get key alteration
 * @function
 */
export const alteration = (key) => {
  const k = asKey(key)
  const toMajor = modeNum(k)
  const toC = _.parseNote(k.tonic)[1]
  return toMajor + toC
}

/**
 * Get the signature of a key. The signature is a string with sharps or flats.
 * @function
 * @example
 * var key = require('tonal-keys')
 * key.signature('A major') // => '###'
 */
export const signature = (key) => {
  return _.toAcc(alteration(key))
}

/**
 * An alias for `signature()`
 * @function
 */
export const accidentals = signature

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * @function
 */
export const alteredNotes = (key) => {
  var alt = alteration(key)
  return alt === null ? null
    : alt < 0 ? _.range(-1, alt).map(_.fifthsFrom('F'))
    : _.range(1, alt).map(_.fifthsFrom('B'))
}
