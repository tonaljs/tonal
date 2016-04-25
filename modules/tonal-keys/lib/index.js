
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
 * Create a key
 */
export function build (tonic, mode) {
  if (!_.isStr(mode)) return null
  var m = mode.trim().toLowerCase()
  if (!isModeStr(m)) return null
  var t = _.pc(tonic) || false
  var n = t ? t + ' ' + m : null
  return { name: n, tonic: t , mode: m }
}
export const isKey = (o) => o && _.isDef(o.tonic) && _.isStr(o.mode)
export const hasTonic = (o) => isKey(o) && o.tonic

// create a interval of n * P5
const nP5 = (n) => ['tnl', n, 0, 1]
const major = (n) => build(_.transpose('C', nP5(n)), 'major')

/**
 * Create a key from alterations
 */
export const fromAlter = (n) => major(+n)

/**
 * Create a key from accidentals
 */
export const fromAcc = (s) => areSharps(s) ? major(s.length) : areFlats(s) ? major(-s.length) : null

/**
 * Create a key from key name
 *
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
 */
export const asKey = (obj) => {
  return isKey(obj) ? obj : fromName(obj) || fromAcc(obj) || fromAlter(obj)
}
export const keyFn = (fn) => (key) => {
  const k = asKey(key)
  return k ? fn(k) : null
}

const modeNum = (k) => MODES[k.mode]
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

export const alteration = (key) => {
  const k = asKey(key)
  const toMajor = modeNum(k)
  const toC = _.parseNote(k.tonic)[1]
  return toMajor + toC
}

export const accidentals = (key) => {
  return _.toAcc(alteration(key))
}
export const signature = accidentals

export const alteredNotes = (key) => {
  var alt = alteration(key)
  return alt === null ? null
    : alt < 0 ? _.range(_.fifthsFrom('F'), -1, alt)
    : _.range(_.fifthsFrom('B'), 1, alt)
}
