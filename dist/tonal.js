'use strict';

const isArr = Array.isArray
const isNum = (n) => typeof n === 'number'
const isDef = (o) => typeof o !== 'undefined'
// map from letter step to number of fifths and octaves
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// given a number of fiths, return the octaves they span
const fifthsOcts = (f) => Math.floor(f * 7 / 12)
const OCTS = FIFTHS.map(fifthsOcts)
function pitch (step, alt, o) {
  const ffs = FIFTHS[step] + 7 * alt
  if (!isNum(o)) return { ffs }
  exports.oct = o - OCTS[step] - 4 * alt
  return { ffs, oct: exports.oct }
}
const isPitch  = (p) => p && isNum(p.ffs)
const hasOct = (p) => isPitch(p) && isNum(p.oct)
const PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/
/**
 * Get the a regex to parse pitch in scientific notation
 *
 * @return {Regex} the regex
 *
 * After exec against a valid string we get:
 * - 0: the complete string
 * - 1: the letter (in upper or lower case)
 * - 2: the alterations (a list of #, b or x)
 * - 3: an optional octave number
 * @example
 * pitchRegex().exec('C#2') // => ['C#2', 'C', '#', '2']
 */
const pitchRegex = () => PITCH_REGEX
const LETTERS = 'CDEFGAB'
/**
 * Given a pitch letter string, return it's letter index.
 * @function
 * @param {String} letter - the pitch letter
 * @return {Integer} the letter index
 */
const letterStep = (l) => LETTERS.indexOf(l.toUpperCase())
/**
 * Convert accidental string to alteration number
 * @function
 * @param {String} acc - the accidental string
 * @return {Integer} the alteration number
 * @example
 * accToAlt('#') // => 1
 * accToAlt('bbb') // => -2
 * accToAlt('') // => 0
 * accToAlt('x') // => 2
 */
function accToAlt (acc) {
  const alt = acc.replace(/x/g, '##').length
  return acc[0] === 'b' ? -alt : alt
}
// parse a string with a pitch in scientific notation (SN)
function parseName (str) {
  const m = PITCH_REGEX.exec(str)
  if (!m) return null
  const s = letterStep(m[1])
  const a = accToAlt(m[2])
  const o = m[3] ? +m[3] : null
  return pitch(s, a, o)
}
// decorate a parser to cache results
function cache (parser) {
  const cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = parser(str))
  }
}
/**
 * Given a pitch string in scientific notation, get the pitch in Fifths/octave notation
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the pitch in Fifths/octave notation or null if not valid string
 * @example
 * pitchParse('C2') // => [2, 1]
 * pitchParse('bla') // => null
 */
const pitchParse = cache(parseName)
const notePitch = (p) => isPitch(p) ? p : pitchParse(p)
const prop = (fn) => (p) => fn(notePitch(p))
// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (p) {
  const i = (p.ffs + 1) % 7
  return i < 0 ? 7 + i : i
}
// 'FCGDAEB' steps numbers
var STEPS = [3, 0, 4, 1, 5, 2, 6]
const step = prop((p) => isPitch(p) ? STEPS[unaltered(p)] : null)
/**
 * Get the pitch letter. It accepts scientific or Fifths/octave notation.
 *
 * @name letter
 * @function
 * @param {Pitch|String} pitch - the pitch to get the letter from
 * @return {String} the letter
 * @example
 * letter('C#2') // => 'C'
 * letter([-7, 2]) // => 'C'
 */
const letter = prop((p) => LETTERS[step(p)])
/**
 * Get alteration of a pitch.
 *
 * The alteration is an integer indicating the number of sharps or flats
 *
 * @name alt
 * @function
 * @param {Array|String} pitch - the pitch (either in scientific notation or array notation)
 * @return {Integer} the alteration
 * @example
 * alt('C#2') // => 2
 */
const alt = prop((p) => Math.floor((p.ffs + 1) / 7))
const fillStr = (n, l) => Array(Math.abs(n) + 1).join(l)

/**
 * Convert alteration number to accidentals
 * @function
 * @param {Integer} alt - the alteration number
 * @return {String} the accidentals string
 * @example
 * altToAcc(2) // => '##'
 * altToAcc(-2) // => 'bb'
 */
const altToAcc = (alt) => fillStr(alt, alt < 0 ? 'b' : '#')
/**
 * Get accidentals string from a pitch. It accepts pitches in scientific and Fifths/octave notation.
 *
 * @function
 * @param {Pitch|String} pitch - the pitch to get the accidentals from
 * @return {String} the accidentals string
 * @example
 * accidentals('C##2') // => '##'
 * accidentals([-7]) // => 'b'
 */
const accidentals = (p) => altToAcc(alt(p))
const calcOct = (p) => p.oct + 4 * alt(p) + OCTS[step(p)]
// returns the pitch octave or `v` if not octave present
const octOr = (v) => (p) => hasOct(p) ? calcOct(p) : v
// return the octave or ''
const octStr = octOr('')
// return the octave or 0
const octNum = octOr(0)
/**
 * Get the octave from pitch. The pitch can be in array or scientific notation
 * @name oct
 * @function
 * @param {Pitch|String} pitch - the pitch to get the octave from
 * @return {Integer} the octave or null if it's a pitch class or not a valid pitch
 * @example
 * oct('C#2') // => 2
 * oct('C') // => null
 */
exports.oct = prop(octOr(null))
/**
 * Convert a pitch in Fifths/octave notation to pitch in scientific notation (string)
 *
 * @param {Array} pitch - the pitch to convert
 * @return {String} the pitch in scientific notation
 * @example
 * pitchStr([2, 1]) // => 'D2'
 */
function pitchStr (p) {
  return letter(p) + accidentals(p) + octStr(p)
}
// get pitch height
const height = (p) => p.ffs * 7 + 12 * p.oct
/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
const isMidi = (m) => !isArr(m) && m > 0 && m < 129
/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
const midi = function (val) {
  var p = notePitch(val)
  return hasOct(p) ? height(p) + 12
    : isMidi(val) ? +val
    : null
}
var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]
function fromMidi (num) {
  var midi = +num
  return (isNaN(midi) || midi < 0 || midi > 127) ? null
    : CHROMATIC[midi % 12] + (Math.floor(midi / 12) - 1)
}
/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
const wellTempered = (ref) => (pitch) => {
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
const toFreq = wellTempered(440)
/**
 * Create an interval from interval step, interval alteration, interval octave and direction
 *
 * @param {Integer} step - the interval step (0 = unison, 1 = second ... 6 = seventh)
 * @param {Integer} alteration - the interval alteration
 * @param {Integer} oct - how many octaves the interval spans
 * @param {Integer} dir - the direction (1 ascending, -1 descending)
 * @return {Array} an interval in Fifths/octave notation
 */
function interval (step, alt, oct, dir) {
  const p = pitch(step, alt, oct)
  return { ffs: p.ffs, oct: p.oct, dir: dir}
}
/**
 * Return if the given object is an interval
 * @function
 * @param {Object} obj - the object to check
 * @return {Boolean} true if the object is an interval object
 * @example
 * isInterval([0,3,1]) // => true
 */
const isInterval = (i) => hasOct(i) && isDef(i.dir)
// get a simplified index from an interval number. Basically:
// unison is 0, second is 1, thirth is 2, ...
const simplifiedIndex = (n) => (n - 1) % 7
// To get the type: TYPES[simplifiedIndex]
const TYPES = 'PMMPPMM'
/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {String} type - the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qualityToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qualityToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qualityToAlt('M', 'P') // => null (majorables can't be perfect)
 */
function qualityToAlt (type, q) {
  if (type === 'P') {
    if (q === 'P') return 0
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -q.length
  } else if (type === 'M') {
    if (q === 'M') return 0
    else if (q === 'm') return -1
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -(q.length + 1)
  }
  return null
}
// shorthand tonal notation (with quality after number)
const IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
const IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
const COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
const IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Get regex to parse intervals in shorthand notation
 * @return {Regex} the regex
 *
 * After executing the regex, we will have an array-like object with:
 * - 0: the complete string
 */
function ivlRegex () { return IVL_REGEX }
/**
 * Parse a string with an interval in shorthand notation. It support two types: standard shorthand interval notation `quality+[direction]+number` or the tonal shorthand notation `[direction]+number+quality`
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the interval in Fifths/octave notation or null if not valid interval string
 * @example
 * ivlParse('3M') // => [ 4, -2, 1 ]
 * ivlParse('-3M') // => [ 4, -2, -1 ]
 * ivlParse('M3') // => [ 4, -2, 1 ]
 * ivlParse('M-3') // => [ 4, -2, -1 ]
 */
const ivlParse = cache(function (str) {
  const m = IVL_REGEX.exec(str)
  if (!m) return null
  const num = +(m[3] || m[8])
  const sim = simplifiedIndex(num)
  const alt = qualityToAlt(TYPES[sim], m[4] || m[6])
  const oct = Math.floor((num - 1) / 7)
  const dir = (m[2] || m[7]) === '-' ? -1 : 1
  return interval(sim, alt, oct, dir)
})
const ivlPitch = (i) => isInterval(i) ? i : ivlParse(i)
/**
 * Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.
 *
 * @param {Function} fn - the function to be decorated
 * @return {Function} the decorated function
 */
const ivlProp = (fn) => (obj) => fn(ivlPitch(obj))
// the simplified number against the number of fifths
const SIMPLES = [3, 0, 4, 1, 5, 2, 6]
/**
 * Get the simplified interval number (in 1-based index)
 *
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} the simplified interval number
 */
const simpleNum = ivlProp((i) => SIMPLES[unaltered(i)])
/**
 * Get the interval number
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} a integer greater than 0 or null if not valid interval
 * @example
 * number('P8') // => 8
 */
const number = ivlProp((i) => simpleNum(i) + 1 + 7 * octNum(i))
/**
 * Get the interval type
 * @function
 * @param {Array|String} ivl - the interval
 * @param {String} 'P' if it's perfectable, 'M' if it's majorable
 */
const ivlType = (i) => TYPES[simpleNum(i)]
const ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
/**
 * Get interval quality
 * @function
 * @param {Array|String} ivl - the interval
 * @return {String} the quality string
 * @example
 * quality('3M') // => 'M'
 */
const quality = ivlProp((i) => ALTER[ivlType(i)][4 + alt(i)])
/*
 * get interval direction
 * @function
 * @param {Array|String} ivl - the interval
 * @return {Integer}
 */
const direction = (i) => { return i[4] }
const dirStr = (p) => direction(p) === -1 ? '-' : ''
/**
 * Convert an interval in Fifths/octave notation to shorthand notation
 * @function
 * @param {Array} ivl - the interval in Fifths/octave notation
 * @return {String} the interval in shorthand notation
 */
function ivlStr (p) {
  return dirStr(p) + number(p) + quality(p)
}
// transpose a note by an interval
function trBy (ivl, p) {
  // is a pitch class
  return hasOct(p)
    // build a pitch
    ? { ffs: ivl.dir * ivl.ffs + p.ffs, oct: ivl.dir * ivl.oct + p.oct }
    // build a pitch class
    : { ffs: ivl.dir * ivl.ffs + p.ffs }
}
// parse a pitch or an interval or return the object itself
const pitchOrIvl = (o) => pitchParse(o) || ivlParse(o) || o
/**
 * Transpose a pitch by an interval
 * This function is currified, and aliased as `tr`
 * @function
 * @param {Array|String} a - the pitch or interval
 * @param {Array|String} b - the pitch or interval
 * @return {String} the pitch transposed by the interval
 * @example
 * transpose('C2', 'm3') // => 'Eb2'
 * transpose('C', '6m') // => 'Ab'
 */
function transpose (a, b) {
  // if only one argument, partial application
  if (arguments.length === 1) return (b) => transpose(a, b)
  const ac = pitchOrIvl(a)
  const bc = pitchOrIvl(b)
  // if its an interval and a pitch
  const n = (isInterval(ac) && isPitch(bc)) ? trBy(ac, bc)
    // it its a pitch and an interval
    : (isPitch(ac) && isInterval(bc)) ? trBy(bc, ac)
    // anything else is not valid
    : null
  // convert back to a pitch string
  return n ? pitchStr(n) : null
}
/**
 * An alias for `transpose`
 * @function
 */
const tr = transpose
// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function split (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}
function map (fn, list) {
  if (arguments.length === 1) return function (l) { return map(fn, l) }
  return split(list).map(fn)
}
function harmonize (list, tonic) {
  return split(list).map(tr(tonic))
}

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.hasOct = hasOct;
exports.pitchRegex = pitchRegex;
exports.letterStep = letterStep;
exports.accToAlt = accToAlt;
exports.pitchParse = pitchParse;
exports.step = step;
exports.letter = letter;
exports.alt = alt;
exports.altToAcc = altToAcc;
exports.accidentals = accidentals;
exports.pitchStr = pitchStr;
exports.isMidi = isMidi;
exports.midi = midi;
exports.fromMidi = fromMidi;
exports.wellTempered = wellTempered;
exports.toFreq = toFreq;
exports.interval = interval;
exports.isInterval = isInterval;
exports.simplifiedIndex = simplifiedIndex;
exports.qualityToAlt = qualityToAlt;
exports.ivlRegex = ivlRegex;
exports.ivlParse = ivlParse;
exports.ivlProp = ivlProp;
exports.simpleNum = simpleNum;
exports.number = number;
exports.ivlType = ivlType;
exports.quality = quality;
exports.direction = direction;
exports.ivlStr = ivlStr;
exports.transpose = transpose;
exports.tr = tr;
exports.split = split;
exports.map = map;
exports.harmonize = harmonize;