// # Tonal

// __tonal__ is a functional music theory library. It deals with abstract music
// concepts like picthes and intervals, not actual music.

// `tonal` is also the result of my journey of learning how to implement a music
// theory library in javascript in a functional way.

// You are currently reading the source code of the library. It's written in
// [literate programming](https://en.wikipedia.org/wiki/Literate_programming) as
// a tribute to the The Haskell School of Music and it's impressive book/source
// code ["From Signals to
// Symphonies"](http://haskell.cs.yale.edu/wp-content/uploads/2015/03/HSoM.pdf)
// that has a big influence over tonal development.

// This page is generated using the documentation tool
// [docco](http://jashkenas.github.io/docco/)

// #### Prelude

// Parse note names with `note-parser`
const note = require('note-parser')
// Parse interval names with `interval-notation`
const ivl = require('interval-notation')

// Utilities

// Is an array?
export const isArr = Array.isArray
// Is a number?
export const isNum = (n) => typeof n === 'number'
// Is string?
export const isStr = (o) => typeof o === 'string'
// Is defined? (can be null)
export const isDef = (o) => typeof o !== 'undefined'
// Is a value?
export const isValue = (v) => v !== null && typeof v !== 'undefined'

// __Functional helpers__

// Identity function
export const id = (x) => x

// ## 1. Pitches

// #### Pitch encoding

// Map from letter step to number of fifths and octaves
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// Encode a pitch class using the step number and alteration
const encPC = (step, alt) => FIFTHS[step] + 7 * alt

// Given a number of fifths, return the octaves they span
const fifthsSpan = (f) => Math.floor(f * 7 / 12)
// Get the number of octaves it span each step
const FIFTH_OCTS = FIFTHS.map(fifthsSpan)

// Encode octaves
const encOct = (step, alt, oct) => oct - FIFTH_OCTS[step] - 4 * alt

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
export function pitch (step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null
  const pc = encPC(step, alt || 0)
  // if not octave, return the pitch class
  if (!isNum(oct)) return [ 'tnl', pc ]
  const o = encOct(step, alt, oct)
  if (!isNum(dir)) return [ 'tnl', pc, o ]
  const d = dir < 0 ? -1 : 1
  return [ 'tnl', d * pc, d * o, d ]
}

// Some definitions:

/**
 * Test if a given object is a pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch, false otherwise
 */
export const isPitch = (p) => p && p[0] === 'tnl'
/**
 * Test if a given object is a pitch class
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch class, false otherwise
 */
export const isPitchClass = (p) => isPitch(p) && p.length === 2
export const hasOct = (p) => isPitch(p) && isNum(p[2])
export const isPitchNote = (p) => hasOct(p) && p.length === 3
export const isInterval = (i) => hasOct(i) && isNum(i[3])

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
function decode (p) {
  const s = decodeStep(p[1])
  const a = decodeAlt(p[1])
  const o = isNum(p[2]) ? p[2] + 4 * a + FIFTH_OCTS[s] : null
  return { step: s, alt: a, oct: o, dir: p[3] || null }
}

// #### Pitch parsers

// Convert from string to pitches is a quite expensive operation that it's
// executed a lot of times. Some caching will help:

const cache = {}
const cached = (parser) => (str) => {
  if (typeof str !== 'string') return null
  return cache[str] || (cache[str] = parser(str))
}

export const parseNote = cached((str) => {
  const n = note.parse(str)
  return n ? pitch(n.step, n.alt, n.oct) : null
})

export const isNoteStr = (s) => parseNote(s) !== null

export const parseIvl = cached((str) => {
  const i = ivl.parse(str)
  return i ? pitch(i.simple - 1, i.alt, i.oct, i.dir) : null
})

const parsePitch = (str) => parseNote(str) || parseIvl(str)

// ### Pitch to string

export const toLetter = (s) => 'CDEFGAB'[s % 7]
const fillStr = (s, num) => Array(Math.abs(num) + 1).join(s)
export const toAcc = (n) => fillStr(n < 0 ? 'b' : '#', n)
const strNum = (n) => n !== null ? n : ''

export function strNote (n) {
  const p = isPitch(n) && !n[3] ? decode(n) : null
  return p ? toLetter(p.step) + toAcc(p.alt) + strNum(p.oct) : null
}

const isAsc = (p) => p.dir === 1
const isPerf = (p) => ivl.type(p.step + 1) === 'P'
const calcNum = (p) => isAsc(p) ? p.step + 1 + 7 * p.oct : (8 - p.step) - 7 * (p.oct + 1)
const calcAlt = (p) => isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1)

export function strIvl (pitch) {
  const p = isInterval(pitch) ? decode(pitch) : null
  if (!p) return null
  const num = calcNum(p)
  return p.dir * num + ivl.altToQ(num, calcAlt(p))
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

const buildFnDec = (expect, to) => (fn) => (v) => {
  const p = expect(v)
  return p ? to(fn(p)) : null
}
const noteFn = buildFnDec(asNote, toNoteStr)
const ivlFn = buildFnDec(asIvl, toIvlStr)
const pitchFn = buildFnDec(asPitch, toPitchStr)

export const sci = noteFn(id)

// #### Pitch properties

export const pc = noteFn((p) => [ 'tnl', p[1] ])

export const chroma = noteFn((n) => {
  return n[1] * 7 - Math.floor(n[1] * 7 / 12) * 12
})

export const letter = noteFn((n) => toLetter(decode(n).step))

export const accidentals = noteFn((n) => toAcc(decode(n).alt))

export const octave = pitchFn((p) => decode(p).oct)

export const simplify = ivlFn(function (i) {
  const d = i[3]
  const s = decodeStep(d * i[1])
  const a = decodeAlt(d * i[1])
  return [ 'tnl', i[1], -d * (FIFTH_OCTS[s] + 4 * a), d ]
})

export const simpleNum = ivlFn(function (i) {
  const p = decode(i)
  return p.step + 1
})

export const number = ivlFn((i) => calcNum(decode(i)))

export const quality = ivlFn((i) => {
  const p = decode(i)
  return ivl.altToQ(p.step + 1, p.alt)
})

// __semitones__

// get pitch height
const height = (p) => p[1] * 7 + 12 * p[2]
export const semitones = ivlFn(height)

// #### Midi pitch numbers

// The midi note number can have a value between 0-127
// http://www.midikits.net/midi_analyser/midi_note_numbers_for_octaves.htm

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
export const isMidi = (m) => isValue(m) && !isArr(m) && m >= 0 && m < 128

// To match the general midi specification where `C4` is 60 we must add 12 to
// `height` function:

/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
export const midi = function (val) {
  const p = asNote(val)
  return hasOct(p) ? height(p) + 12
    : isMidi(val) ? +val
    : null
}

// We are going to create a chromatic scale. Since altered notes can be
// represented either with flats or sharps, the CHROMATIC constant maps
// only the unaltered steps:
const CHROMATIC = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6]
const midiStep = (m) => CHROMATIC[m % 12]

// And the `chromatic()` function will fill the _holes_ with flat or
// sharp altered notes depending of the first parameter:

/**
 * Create a chromatic scale
 * @param {Boolean} useSharps - use sharps or flats when notes is altered
 * @return {Function} returns a function that converts from midi number to
 * note name
 * @example
 * var chromaticScale = chromatic(false)
 * [60, 61, 62].map(chromaticScale) // => ['C4', 'Db4', 'D4']
 */
export const chromatic = (useSharps) => (midi) => {
  const c = midiStep(midi)
  const o = Math.floor(midi / 12) - 1
  const n = c !== null ? pitch(c, 0, o)
  : useSharps ? pitch(midiStep(midi - 1), 1, o)
  : pitch(midiStep(midi + 1), -1, o)
  return strNote(n)
}

// Without a context, it's impossible to know the _right_ note name for a given
// midi number, so we arbitrarily select chromatic with flats:

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidi(61) // => 'Db4'
 */
export const fromMidi = chromatic(false)

// #### Frequency conversions

// The most popular way (in western music) to calculate the frequency of a pitch
// is using the [well
// temperament](https://en.wikipedia.org/wiki/Well_temperament) tempered tuning.
// It assumes the octave to be divided in 12 equally sized semitones and tune
// all the notes against a reference:

/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
export const wellTempered = (ref) => (pitch) => {
  const m = midi(pitch)
  return m ? Math.pow(2, (m - 69) / 12) * ref : null
}

// The common tuning reference is `A4 = 440Hz`:

/**
 * Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz
 * @function
 * @param {Array|String} pitch - the pitch to get the frequency from
 * @return {Float} the frequency in herzs
 * @example
 * toFreq('C4') // => 261.6255653005986
 */
export const toFreq = wellTempered(440)

// ## 2. Pitch distances

function trBy (i, p) {
  if (p === null) return null
  const f = i[1] + p[1]
  if (p.length === 2) return [ 'tnl', f ]
  const o = i[2] + p[2]
  if (p.length === 3) return [ 'tnl', f, o ]
  const d = 7 * f + 12 * o < 0 ? -1 : 1
  return ['tnl', f, o, d ]
}

export function transpose (a, b) {
  if (arguments.length === 1) return (b) => transpose(a, b)
  const pa = asPitch(a)
  const pb = asPitch(b)
  const r = isInterval(pa) ? trBy(pa, pb)
    : isInterval(pb) ? trBy(pb, pa) : null
  return toPitchStr(r)
}

// ## 3. Lists

// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
export function listArr (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

// #### Transform lists

const listToStr = (v) => isPitch(v) ? toPitchStr(v) : isArr(v) ? v.map(toPitchStr) : v

const transform = (fn) => (src) => {
  const param = listArr(src).map(asPitch)
  const result = fn(param)
  return listToStr(result)
}

export function map (fn, list) {
  if (arguments.length > 1) return map(fn)(list)
  return (l) => listArr(l).map(fn)
}

const filter = (fn, list) => {
  if (arguments.length > 1) return filter(fn)(list)
  return (l) => listArr(l).filter(fn)
}

const reduce = function (fn, o, list) {
  switch (arguments.length) {
    case 1: return (o, list) => reduce(fn, o, list)
    case 2: return (list) => reduce(fn, o, list)
    default: return listArr(list).reduce(fn, o)
  }
}

// #### Transpose lists

export const harmonizer = (list) => (pitch) => {
  return transform((list) => list.map(transpose(pitch)).filter(id))(list)
}

export const harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// #### Sort lists

const objHeight = function (p) {
  if (!p) return -Infinity
  const f = p[1] * 7
  const o = isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

const ascComp = (a, b) => objHeight(a) - objHeight(b)
const descComp = (a, b) => -ascComp(a, b)

const maxP = (a, b) => ascComp(a, b) < 0 ? b : a
export const max = transform((list) => {
  return list.reduce(maxP, null)
})

export function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  const fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return transform((arr) => arr.sort(fn))
}

// Fin.
