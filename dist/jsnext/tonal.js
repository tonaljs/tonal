const note = require('note-parser')
const ivl = require('interval-notation')
const isArr = Array.isArray
const isNum = (n) => typeof n === 'number'
// map from letter step to number of fifths and octaves
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// encode a pitch class using the step number and alteration
const encPC = (step, alt) => FIFTHS[step] + 7 * alt
// given a number of fifths, return the octaves they span
const fifthsSpan = (f) => Math.floor(f * 7 / 12)
// get the number of octaves it span each step
const FIFTH_OCTS = FIFTHS.map(fifthsSpan)
const encOct = (step, alt, oct) => oct - FIFTH_OCTS[step] - 4 * alt
export function pitch (step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null
  const pc = encPC(step, alt || 0)
  // if not octave, return the pitch class
  if (!isNum(oct)) return [ pc ]
  const o = encOct(step, alt, oct)
  if (!isNum(dir)) return [ pc, o ]
  const d = dir < 0 ? -1 : 1
  return [ d * pc, d * o, d ]
}
export const isPitch = (p) => isArr(p) && isNum(p[0])
export const isPitchClass = (p) => isArr(p) && p.length === 1
export const hasOct = (p) => isPitch(p) && isNum(p[1])
export const isPitchNote = (p) => hasOct(p) && p.length === 2
export const isInterval = (i) => hasOct(i) && isNum(i[2])
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
  const s = decodeStep(p[0])
  const a = decodeAlt(p[0])
  const o = isNum(p[1]) ? p[1] + 4 * a + FIFTH_OCTS[s] : null
  return { step: s, alt: a, oct: o, dir: p[2] || null }
}
const cache = {}
const cached = (parser) => (str) => {
  if (typeof str !== 'string') return null
  return cache[str] || (cache[str] = parser(str))
}
export const parseNote = cached((str) => {
  const n = note.parse(str)
  return n ? pitch(n.step, n.alt, n.oct) : null
})
export const parseIvl = cached((str) => {
  const i = ivl.parse(str)
  return i ? pitch(i.simple - 1, i.alt, i.oct, i.dir) : null
})
const parsePitch = (str) => parseNote(str) || parseIvl(str)
const stepLetter = (s) => 'CDEFGAB'[s]
const fillStr = (s, num) => Array(Math.abs(num) + 1).join(s)
const altAcc = (n) => fillStr(n < 0 ? 'b' : '#', n)
const strNum = (n) => n !== null ? n : ''
export function strNote (pitch) {
  const p = !isInterval(pitch) ? decode(pitch) : null
  return p ? stepLetter(p.step) + altAcc(p.alt) + strNum(p.oct) : null
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
const strPitch = (p) => p[2] ? strIvl(p) : strNote(p)
const notation = (parse, str) => (v) => !isPitch(v) ? parse(v) : str(v)
const id = (x) => x
const expectNote = notation(parseNote, id)
const expectIvl = notation(parseIvl, id)
const expectPitch = notation(parsePitch, id)
const toNoteStr = notation(id, strNote)
const toIvlStr = notation(id, strIvl)
const toPitchStr = notation(id, strPitch)
const buildFnDec = (expect, to) => (fn) => (v) => to(fn(expect(v)))
const noteFn = buildFnDec(expectNote, toNoteStr)
const ivlFn = buildFnDec(expectIvl, toIvlStr)
const pitchFn = buildFnDec(expectPitch, toPitchStr)
export const pc = noteFn((p) => [ p[0] ])
export const letter = noteFn((n) => stepLetter(decode(n).step))
export const accidentals = noteFn((n) => altAcc(decode(n).alt))
export const octave = pitchFn((p) => decode(p).oct)
export const simplify = ivlFn(function (i) {
  var d = i[2]
  var s = decodeStep(d * i[0])
  var a = decodeAlt(d * i[0])
  return [ i[0], -d * (FIFTH_OCTS[s] + 4 * a), d ]
})
export const simpleNum = ivlFn(function (i) {
  var p = decode(i)
  return p.step + 1
})
export const number = ivlFn((i) => calcNum(decode(i)))
export const quality = ivlFn((i) => {
  var p = decode(i)
  return ivl.altToQ(p.step + 1, p.alt)
})
// get pitch height
const height = (p) => p[0] * 7 + 12 * p[1]
export const semitones = ivlFn(height)
/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
export const isMidi = (m) => !isArr(m) && m > 0 && m < 129
/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
export const midi = function (val) {
  var p = expectNote(val)
  return hasOct(p) ? height(p) + 12
    : isMidi(val) ? +val
    : null
}
var CHROMATIC = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6]
const midiStep = (m) => CHROMATIC[m % 12]
export const chromatic = function (useSharps, midi) {
  if (arguments.length > 1) return chromatic(useSharps)(midi)
  return function (midi) {
    const c = midiStep(midi)
    const o = Math.floor(midi / 12) - 1
    const n = c !== null ? pitch(c, 0, o)
      : useSharps ? pitch(midiStep(midi - 1), 1, o)
      : pitch(midiStep(midi + 1), -1, o)
    return strNote(n)
  }
}
export const fromMidi = chromatic(false)
/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
export const wellTempered = (ref) => (pitch) => {
  var m = midi(pitch)
  return m ? Math.pow(2, (m - 69) / 12) * ref : null
}
/**
 * Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz
 * @function
 * @param {Array|String} pitch - the pitch to get the frequency from
 * @return {Float} the frequency in herzs
 * @example
 * toFreq('C4') // => 261.6255653005986
 */
export const toFreq = wellTempered(440)
function trBy (i, p) {
  const f = i[0] + p[0]
  if (p.length === 1) return [ f ]
  const o = i[1] + p[1]
  if (p.length === 2) return [ f, o ]
  const d = 7 * f + 12 * o < 0 ? -1 : 1
  return [ f, o, d ]
}
export function transpose (a, b) {
  if (arguments.length === 1) return (b) => transpose(a, b)
  const pa = expectPitch(a)
  const pb = expectPitch(b)
  const r = isInterval(pa) ? trBy(pa, pb)
    : isInterval(pb) ? trBy(pb, pa) : null
  return toPitchStr(r)
}
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
const listToStr = (v) => isArr(v) ? v.map(toPitchStr) : toPitchStr(v)
const listFn = (fn) => (src) => {
  var param = listArr(src).map(expectPitch)
  var result = fn(param)
  return listToStr(result)
}
export function map (fn, list) {
  if (arguments.length > 1) return map(fn)(list)
  return listFn((arr) => arr.map(fn))
}
const filter = (fn, list) => {
  if (arguments.length > 1) return filter(fn)(list)
  return listFn((arr) => arr.filter(fn))
}
const reduce = (fn, o, list) => {
  if (arguments.length === 1) return (o, list) => reduce(fn, o)(list)
  if (arguments.length > 2) return reduce(fn, o)(list)
  return listFn((arr) => arr.reduce(fn, o))(list)
}
const objHeight = function (p) {
  if (!p) return -Infinity
  var f = p[0] * 7
  var o = isNum(p[1]) ? p[1] : -Math.floor(f / 12) - 10
  return f + o * 12
}
const ascComp = (a, b) => objHeight(a) - objHeight(b)
const descComp = (a, b) => -ascComp(a, b)
export function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  const fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn((arr) => arr.sort(fn))
}
export const harmonize = (list, pitch) => {
  return listFn((list) => list.map(transpose(pitch)))(list)
}
