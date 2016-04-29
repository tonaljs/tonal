'use strict';

// #### Prelude

// Parse note names with `note-parser`
const noteParse = require('note-parser').parse
// Parse interval names with `interval-notation`
const ivlNttn = require('interval-notation')

// Utilities

// Is an array?
const isArr = Array.isArray
// Is a number?
const isNum = (n) => typeof n === 'number'
// Is string?
const isStr = (o) => typeof o === 'string'
// Is defined? (can be null)
const isDef = (o) => typeof o !== 'undefined'
// Is a value?
const isValue = (v) => v !== null && typeof v !== 'undefined'

// __Functional helpers__

// Identity function
const id = (x) => x

// ## 1. Pitches

// An array with the signature: `['tnl', fifths, octaves, direction]`:

/**
 * Create a pitch class in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @return {Pitch} the pitch in array notation
 */
const pcPitch = (f) => ['tnl', f]

/**
 * Create a note pitch in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @return {Pitch} the pitch in array notation
 */
const notePitch = (f, o) => ['tnl', f, o]

// calculate interval direction
const calcDir = (f, o) => encDir(7 * f + 12 * o)

/**
 * Create an interval in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @param {Integer} dir - (Optional) the direction
 * @return {Pitch} the pitch in array notation
 */
const ivlPitch = (f, o, d) => {
  const oct = isNum(o) ? o : -fOcts(f)
  return ['tnl', f, oct, d || calcDir(f, oct) ]
}

/**
 * Test if a given object is a pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const isPitch = (p) => p && p[0] === 'tnl'
/**
 * Test if a given object is a pitch class
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const isPitchClass = (p) => isPitch(p) && p.length === 2
/**
 * Test if a given object is a pitch with octave (note pitch or interval)
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const hasOct = (p) => isPitch(p) && isNum(p[2])
/**
 * Test if a given object is a note pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const isNotePitch = (p) => hasOct(p) && p.length === 3
/**
 * Test if a given object is a pitch interval
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const isIvlPitch = (i) => hasOct(i) && isNum(i[3])
/**
 * Test if a given object is a pitch, but not an interval
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
const isPitchNotIvl = (i) => isPitch(i) && !isDef(i[3])

const height = (p) => p[1] * 7 + 12 * p[2]

// #### Pitch encoding

// Map from letter step to number of fifths and octaves
// equivalent to: { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]

// Encode a pitch class using the step number and alteration
const encPC = (step, alt) => FIFTHS[step] + 7 * alt

// Given a number of fifths, return the octaves they span
const fOcts = (f) => Math.floor(f * 7 / 12)
// Get the number of octaves it span each step
const FIFTH_OCTS = FIFTHS.map(fOcts)

// Encode octaves
const encOct = (step, alt, oct) => oct - FIFTH_OCTS[step] - 4 * alt

// Encode direction
const encDir = (n) => n < 0 ? -1 : 1

/**
 * Create a pitch. A pitch in tonal may refer to a pitch class, the pitch
 * of a note or an interval.
 *
 * @param {Integer} step - an integer from 0 to 6 representing letters
 * from C to B or simple interval numbers from unison to seventh
 * @param {Integer} alt - the alteration
 * @param {Integer} oct - the pitch octave
 * @param {Integer} dir - (Optional, intervals only) The interval direction
 * @return {Pitch} the pitch encoded as array notation
 *
 */
function encode (step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null

  const pc = encPC(step, alt || 0)
  // if not octave, return the pitch class
  if (!isNum(oct)) return pcPitch(pc)

  const o = encOct(step, alt, oct)
  // if not direction, return a note pitch
  if (!isNum(dir)) return notePitch(pc, o)

  const d = encDir(dir)
  // return the interval
  return ivlPitch(d * pc, d * o, d)
}

// ### Pitch decoding

// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (f) {
  const i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}

const decodeStep = (f) => STEPS[unaltered(f)]
const decodeAlt = (f) => Math.floor((f + 1) / 7)
// 'FCGDAEB' steps numbers
const STEPS = [3, 0, 4, 1, 5, 2, 6]
/**
 * Decode a pitch to its numeric properties
 * @param {Pitch}
 * @return {Object}
 */
function decode (p) {
  const s = decodeStep(p[1])
  const a = decodeAlt(p[1])
  const o = isNum(p[2]) ? p[2] + 4 * a + FIFTH_OCTS[s] : null
  return { step: s, alt: a, oct: o, dir: p[3] || null }
}

// #### Pitch parsers

// Convert from string to pitches is a quite expensive operation that it's
// executed a lot of times. Some caching will help:

const cached = (parser) => {
  const cache = {}
  return (str) => {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = parser(str))
  }
}

/**
 * Parse a note name
 * @function
 * @param {String}
 * @return {Pitch}
 */
const parseNote = cached((str) => {
  const n = noteParse(str)
  return n ? encode(n.step, n.alt, n.oct) : null
})

/**
 * Test if the given string is a note name
 * @function
 * @param {String}
 * @return {Boolean}
 */
const isNoteStr = (s) => parseNote(s) !== null

/**
 * Parses an interval name in shorthand notation
 * @function
 * @param {String}
 * @return {Pitch}
 */
const parseIvl = cached((str) => {
  const i = ivlNttn.parse(str)
  return i ? encode(i.simple - 1, i.alt, i.oct, i.dir) : null
})

/**
 * Test if the given string is an interval name
 * @function
 * @param {String}
 * @return {Boolean}
 */
const isIvlStr = (s) => parseIvl(s) !== null

/**
 * Parse a pitch (a pitch class, a note pitch or an interval)
 * @function
 * @param {String}
 * @return {Pitch}
 */
const parsePitch = (str) => parseNote(str) || parseIvl(str)

// ### Pitch to string

/**
 * Given a step number return the letter
 * @function
 * @param {Integer}
 * @return {String}
 */
const toLetter = (s) => 'CDEFGAB'[s % 7]

// Repeat a string num times
const fillStr = (s, num) => Array(Math.abs(num) + 1).join(s)

/**
 * Given an alteration number, return the accidentals
 *
 * @function
 * @param {Integer}
 * @return {String}
 */
const toAcc = (n) => fillStr(n < 0 ? 'b' : '#', n)
const strNum = (n) => n !== null ? n : ''

/**
 * Given a pitch class or a pitch note, get the string in scientific
 * notation
 *
 * @param {Pitch}
 * @return {String}
 */
function strNote (n) {
  const p = isPitch(n) && !n[3] ? decode(n) : null
  return p ? toLetter(p.step) + toAcc(p.alt) + strNum(p.oct) : null
}

// is an interval ascending?
const isAsc = (p) => p.dir === 1
// is an interval perfectable?
const isPerf = (p) => ivlNttn.type(p.step + 1) === 'P'
// calculate interval number
const calcNum = (p) => isAsc(p) ? p.step + 1 + 7 * p.oct : (8 - p.step) - 7 * (p.oct + 1)
// calculate interval alteration
const calcAlt = (p) => isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1)

/**
 * Given an interval, get the string in scientific
 * notation
 *
 * @param {Pitch}
 * @return {String}
 */
function strIvl (pitch) {
  const p = isIvlPitch(pitch) ? decode(pitch) : null
  if (!p) return null
  const num = calcNum(p)
  return p.dir * num + ivlNttn.altToQ(num, calcAlt(p))
}

const strPitch = (p) => p[3] ? strIvl(p) : strNote(p)

// #### Decorate pitch transform functions

const notation = (parse, str) => (v) => !isPitch(v) ? parse(v) : str(v)

const asNote = notation(parseNote, id)
const asIvl = notation(parseIvl, id)
const asPitch = notation(parsePitch, id)

const toNoteStr = notation(id, strNote)
const toIvlStr = notation(id, strIvl)
const toPitchStr = notation(id, strPitch)

// create a function decorator to work with pitches
const pitchOp = (parse, to) => (fn) => (v) => {
  // is value in array notation?...
  const isP = isPitch(v)
  // then no transformation is required
  if (isP) return fn(v)
  // else parse the pitch
  const p = parse(v)
  // if parsed, apply function and back to string
  return p ? to(fn(p)) : null
}
const noteFn = pitchOp(parseNote, toNoteStr)
const ivlFn = pitchOp(parseIvl, toIvlStr)
const pitchFn = pitchOp(parsePitch, toPitchStr)


// #### Pitch properties


/**
 * Return the chroma of a pitch.
 *
 * @function
 * @param {String|Pitch}
 * @return {Integer}
 */
const chroma = pitchFn((n) => {
  return 7 * n[1] - 12 * fOcts(n[1])
})

exports.isArr = isArr;
exports.isNum = isNum;
exports.isStr = isStr;
exports.isDef = isDef;
exports.isValue = isValue;
exports.id = id;
exports.pcPitch = pcPitch;
exports.notePitch = notePitch;
exports.ivlPitch = ivlPitch;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPitchNotIvl = isPitchNotIvl;
exports.height = height;
exports.encode = encode;
exports.decode = decode;
exports.parseNote = parseNote;
exports.isNoteStr = isNoteStr;
exports.parseIvl = parseIvl;
exports.isIvlStr = isIvlStr;
exports.parsePitch = parsePitch;
exports.toLetter = toLetter;
exports.toAcc = toAcc;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.asNote = asNote;
exports.asIvl = asIvl;
exports.asPitch = asPitch;
exports.toNoteStr = toNoteStr;
exports.toIvlStr = toIvlStr;
exports.toPitchStr = toPitchStr;
exports.noteFn = noteFn;
exports.chroma = chroma;