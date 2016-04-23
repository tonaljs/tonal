'use strict';

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
function pitch (step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null
  const pc = encPC(step, alt || 0)
  // if not octave, return the pitch class
  if (!isNum(oct)) return [ pc ]
  const o = encOct(step, alt, oct)
  if (!isNum(dir)) return [ pc, o ]
  const d = dir < 0 ? -1 : 1
  return [ d * pc , d * o, d ]
}
const isPitch = (p) => isArr(p) && isNum(p[0])
const isPitchClass = (p) => isArr(p) && p.length === 1
const hasOct = (p) => isPitch(p) && isNum(p[1])
const isPitchNote = (p) => hasOct(p) && p.length === 2
const isInterval = (i) => hasOct(i) && isNum(i[2])
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
const parseNote = cached((str) => {
  const n = note.parse(str)
  return n ? pitch(n.step, n.alt, n.oct) : null
})
const parseIvl = cached((str) => {
  const i = ivl.parse(str)
  return i ? pitch(i.simple - 1, i.alt, i.oct, i.dir) : null
})
const parsePitch = (str) => parseNote(str) || parseIvl(str)
const stepLetter = (s) => 'CDEFGAB'[s]
const fillStr = (s, num) => Array(Math.abs(num) + 1).join(s)
const altAcc = (n) => fillStr(n < 0 ? 'b' : '#', n)
const strNum = (n) => n !== null ? n : ''
function strNote (pitch) {
  const p = !isInterval(pitch) ? decode(pitch) : null
  return p ? stepLetter(p.step) + altAcc(p.alt) + strNum(p.oct) : null
}
const isAsc = (p) => p.dir === 1
const isPerf = (p) => ivl.type(p.step + 1) === 'P'
const calcNum = (p) => isAsc(p) ? p.step + 1 + 7 * p.oct : (8 - p.step) - 7 * (p.oct + 1)
const calcAlt = (p) => isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1)

function strIvl (pitch) {
  const p = isInterval(pitch) ? decode(pitch) : null
  if (!p) return null
  const num = calcNum(p)
  return p.dir * num + ivl.altToQ(num, calcAlt(p))
}
const strPitch = (p) => p.dir ? strIvl(p) : strNote(p)
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
const pc = noteFn((p) => [ p[0] ])
const letter = noteFn((n) => stepLetter(decode(n).step))
const accidentals = noteFn((n) => altAcc(decode(n).alt))
const octave = pitchFn((p) => decode(p).oct)
const simplify = ivlFn(function (i) {
  return i[2] === 1
    ? [ i[0], -FIFTH_OCTS[decodeStep(i[0])] - 4 * decodeAlt(i[0]), 1 ]
    : [ i[0], FIFTH_OCTS[decodeStep(-i[0])] + 4 * decodeAlt(-i[0]), -1 ]
})
const simpleNum = ivlFn(function (i) {
  var p = decode(i)
  return p.step + 1
})
const number = ivlFn((i) => calcNum(decode(i)))
const quality = ivlFn((i) => {
  var p = decode(i)
  return ivl.altToQ(p.step + 1, p.alt)
})
function trBy (ivl, p) {
  return isPitchClass(p) ? [ivl[0] + p[0]]
    : isPitchNote(p) ? [ivl[0] + p[0], ivl[1] + p[1]]
    : isInterval(p) ? [ivl[0] + p[0], ivl[1] + p[1], 1]
    : null
}
function transpose (a, b) {
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
function listArr (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}
const listToStr = (v) => isArr(v) ? v.map(toPitchStr) : toPitchStr(v)
const listFn = (fn) => (src) => {
  var param = listArr(src)
  var result = fn(param)
  return isPitch(param[0]) ? result : listToStr(result)
}
function map (fn, list) {
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
var harmonize = (list, pitch) => {
  return listFn((list) => list.map(transpose(pitch)))(list)
}

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isPitchNote = isPitchNote;
exports.isInterval = isInterval;
exports.parseNote = parseNote;
exports.parseIvl = parseIvl;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.pc = pc;
exports.letter = letter;
exports.accidentals = accidentals;
exports.octave = octave;
exports.simplify = simplify;
exports.simpleNum = simpleNum;
exports.number = number;
exports.quality = quality;
exports.transpose = transpose;
exports.listArr = listArr;
exports.map = map;