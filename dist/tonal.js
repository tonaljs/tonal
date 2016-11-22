(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {String|Pitch} note
 * @return {Integer} the chroma
 */
function chroma (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.chr(p) : null
}

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { noteName } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(noteName)
 * // => ['C', 'Db3', null, null, 'G##4']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.noteName('cb2') // => 'Cb2'
 * tonal.map(tonal.noteName, 'c db3 2 g+ gx4')
 */
function noteName (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote(p) : null
}

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
function pc (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote([ p[0], [ tonalPitch.fifths(p) ] ]) : null
}

var ASC = tonalPitch.parseIvl('2d')
var DESC = tonalPitch.parseIvl('-2d')

/**
 * Get the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
 * @param {String} note - the note to get the enharmonics from
 * @return {Array} an array of pitches ordered by distance to the given one
 *
 * @example
 * enharmonics = require('enharmonics')
 * enharmonics('C') // => ['B#', 'C', 'Dbb']
 * enharmonics('A') // => ['G##', 'A', 'Bbb']
 * enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
 * enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
 */
function enharmonics (pitch) {
  var notes = []
  notes.push(tonalTranspose.tr(DESC, pitch))
  if (notes[0] === null) return null
  notes.push(pitch)
  notes.push(tonalTranspose.tr(ASC, pitch))
  return notes
}

/**
 * An alias for `enharmonics`
 * @function
 */
var enh = enharmonics

/**
 * Get a simpler enharmonic note name from a note if exists
 *
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (if not found, return same note)
 *
 * @example
 * var enharmonics = require('enharmonics')
 * enharmonics.simpleEnh('B#3') // => 'C4'
 */
function simpleEnh (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}

exports.chroma = chroma;
exports.noteName = noteName;
exports.pc = pc;
exports.enharmonics = enharmonics;
exports.enh = enh;
exports.simpleEnh = simpleEnh;
},{"tonal-pitch":2,"tonal-transpose":7}],2:[function(require,module,exports){
'use strict';

var noteParser = require('note-parser');
var intervalNotation = require('interval-notation');
var tonalEncoding = require('tonal-encoding');
var tonalNotation = require('tonal-notation');

/**
 * Create a pitch
 * @param {Integer} fifths - the number of fifths from C or from P1
 * @param {Integer} focts - the number of encoded octaves
 * @param {Integer} dir - (Optional) Only required for intervals. Can be 1 or -1
 * @return {Pitch}
 */
function pitch (fifths, focts, dir) {
  return dir ? ['tnlp', [fifths, focts], dir] : ['tnlp', [fifths, focts]]
}
/**
 * Test if an object is a pitch
 * @param {Pitch}
 * @return {Boolean}
 */
function isPitch (p) { return tonalNotation.isArr(p) && p[0] === 'tnlp' }
/**
 * Encode a pitch
 * @param {Integer} step
 * @param {Integer} alt
 * @param {Integer} oct
 * @param {Integer} dir - (Optional)
 */
function encode$1 (s, a, o, dir) {
  return dir ? ['tnlp', tonalEncoding.encode(s, a, o), dir] : ['tnlp', tonalEncoding.encode(s, a, o)]
}

/**
 * Decode a pitch
 * @param {Pitch} the pitch
 * @return {Array} An array with [step, alt, oct]
 */
function decode$1 (p) {
  return tonalEncoding.decode.apply(null, p[1])
}

/**
 * Get pitch type
 * @param {Pitch}
 * @return {String} 'ivl' or 'note' or null if not a pitch
 */
function pType (p) {
  return !isPitch(p) ? null
    : p[2] ? 'ivl' : 'note'
}
/**
 * Test if is a pitch note (with or without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isNotePitch (p) { return pType(p) === 'note' }
/**
 * Test if is an interval
 * @param {Pitch}
 * @return {Boolean}
 */
function isIvlPitch (p) { return pType(p) === 'ivl' }
/**
 * Test if is a pitch class (a pitch note without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isPC (p) { return isPitch(p) && p[1].length === 1 }

/**
 * Get direction of a pitch (even for notes)
 * @param {Pitch}
 * @return {Integer} 1 or -1
 */
function dir (p) { return p[2] === -1 ? -1 : 1 }

/**
 * Get encoded fifths from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
/**
 * Get encoded octaves from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
/**
 * Get height of a pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function height (p) { return fifths(p) * 7 + focts(p) * 12 }

/**
 * Get chroma of a pitch. The chroma is a number between 0 and 11 to represent
 * the position of a pitch inside an octave. Is the numeric equivlent of a
 * pitch class.
 *
 * @param {Pitch}
 * @return {Integer}
 */
function chr (p) {
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

// memoize parsers
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (!tonalNotation.isStr(str)) return null
    return cache[str] || (cache[str] = fn(str))
  }
}

/**
 * Parse a note
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid note string
 */
var parseNote = memoize(function (s) {
  var p = noteParser.parse(s)
  return p ? encode$1(p.step, p.alt, p.oct) : null
})

/**
 * Parse an interval
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid interval string
 */
var parseIvl = memoize(function (s) {
  var p = intervalNotation.parse(s)
  if (!p) return null
  return p ? encode$1(p.simple - 1, p.alt, p.oct, p.dir) : null
})

/**
 * Parse a note or an interval
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid pitch string
 */
function parsePitch (s) { return parseNote(s) || parseIvl(s) }

/**
 * Ensure the given object is a note pitch. If is a string, it will be
 * parsed. If not a note pitch or valid note string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
/**
 * Ensure the given object is a interval pitch. If is a string, it will be
 * parsed. If not a interval pitch or valid interval string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
/**
 * Ensure the given object is a pitch. If is a string, it will be
 * parsed. If not a pitch or valid pitch string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

function octStr (n) { return tonalNotation.isNum(n) ? n : '' }

/**
 * Convert a note pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strNote (p) {
  if (!isNotePitch(p)) return null
  var d = decode$1(p)
  // d = [step, alt, oct]
  return tonalNotation.toLetter(d[0]) + tonalNotation.toAcc(d[1]) + octStr(d[2])
}

/**
 * Convert a interval pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strIvl (p) {
  if (!isIvlPitch(p)) return null
  // decode to [step, alt, oct]
  var d = decode$1(p)
  // d = [step, alt, oct]
  var num = d[0] + 1 + 7 * d[2]
  return p[2] * num + intervalNotation.altToQ(num, d[1])
}

/**
 * Convert a pitch to string representation (either notes or intervals)
 * @param {Pitch}
 * @return {String}
 */
function strPitch (p) { return strNote(p) || strIvl(p) }

function decorator (is, parse, str) {
  return function (fn) {
    return function (v) {
      var i = is(v)
      // if the value is in pitch notation no conversion
      if (i) return fn(v)
      // else parse the pitch
      var p = parse(v)
      // if parsed, apply function and back to string
      return p ? str(fn(p)) : null
    }
  }
}

/**
 * Decorate a function to work internally with note pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a note pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var noteFn = decorator(isNotePitch, parseNote, strNote)
/**
 * Decorate a function to work internally with interval pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a interval pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
/**
 * Decorate a function to work internally with pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var pitchFn = decorator(isPitch, parsePitch, strPitch)

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.encode = encode$1;
exports.decode = decode$1;
exports.pType = pType;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPC = isPC;
exports.dir = dir;
exports.fifths = fifths;
exports.focts = focts;
exports.height = height;
exports.chr = chr;
exports.parseNote = parseNote;
exports.parseIvl = parseIvl;
exports.parsePitch = parsePitch;
exports.asNotePitch = asNotePitch;
exports.asIvlPitch = asIvlPitch;
exports.asPitch = asPitch;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.strPitch = strPitch;
exports.noteFn = noteFn;
exports.ivlFn = ivlFn;
exports.pitchFn = pitchFn;
},{"interval-notation":3,"note-parser":4,"tonal-encoding":5,"tonal-notation":6}],3:[function(require,module,exports){
'use strict'

// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Parse a string with an interval in [shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * and returns an object with interval properties
 *
 * @param {String} str - the string with the interval
 * @return {Object} an object properties or null if not valid interval string
 * The returned object contains:
 * - `num`: the interval number
 * - `q`: the interval quality string (M is major, m is minor, P is perfect...)
 * - `simple`: the simplified number (from 1 to 7)
 * - `dir`: the interval direction (1 ascending, -1 descending)
 * - `type`: the interval type (P is perfectable, M is majorable)
 * - `alt`: the alteration, a numeric representation of the quality
 * - `oct`: the number of octaves the interval spans. 0 for simple intervals.
 * - `size`: the size of the interval in semitones
 * @example
 * var parse = require('interval-notation').parse
 * parse('M3')
 * // => { num: 3, q: 'M', dir: 1, simple: 3,
 * //      type: 'M', alt: 0, oct: 0, size: 4 }
 */
function parse (str) {
  if (typeof str !== 'string') return null
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var i = { num: +(m[3] || m[8]), q: m[4] || m[6] }
  i.dir = (m[2] || m[7]) === '-' ? -1 : 1
  var step = (i.num - 1) % 7
  i.simple = step + 1
  i.type = TYPES[step]
  i.alt = qToAlt(i.type, i.q)
  i.oct = Math.floor((i.num - 1) / 7)
  i.size = i.dir * (SIZES[step] + i.alt + 12 * i.oct)
  return i
}
var SIZES = [0, 2, 4, 5, 7, 9, 11]

var TYPES = 'PMMPPMM'
/**
 * Get the type of interval. Can be perfectavle ('P') or majorable ('M')
 * @param {Integer} num - the interval number
 * @return {String} `P` if it's perfectable, `M` if it's majorable.
 */
function type (num) {
  return TYPES[(num - 1) % 7]
}

function dirStr (dir) { return dir === -1 ? '-' : '' }
function num (simple, oct) { return simple + 7 * oct }

/**
 * Build a shorthand interval notation string from properties.
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.shorthand(3, 0, 0, 1) // => 'M3'
 * interval.shorthand(3, -1, 0, -1) // => 'm-3'
 * interval.shorthand(3, 1, 1, 1) // => 'A10'
 */
function shorthand (simple, alt, oct, dir) {
  return altToQ(simple, alt) + dirStr(dir) + num(simple, oct)
}
/**
 * Build a special shorthand interval notation string from properties.
 * The special shorthand interval notation changes the order or the standard
 * shorthand notation so instead of 'M-3' it returns '-3M'.
 *
 * The standard shorthand notation has a string 'A4' (augmented four) that can't
 * be differenciate from 'A4' (the A note in 4th octave), so the purpose of this
 * notation is avoid collisions
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.build(3, 0, 0, 1) // => '3M'
 * interval.build(3, -1, 0, -1) // => '-3m'
 * interval.build(3, 1, 1, 1) // => '10A'
 */
function build (simple, alt, oct, dir) {
  return dirStr(dir) + num(simple, oct) + altToQ(simple, alt)
}

/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {Integer|String} num - the interval number or a string representing
 * the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qToAlt('M', 'P') // => null (majorables can't be perfect)
 */
function qToAlt (num, q) {
  var t = typeof num === 'number' ? type(num) : num
  if (q === 'M' && t === 'M') return 0
  if (q === 'P' && t === 'P') return 0
  if (q === 'm' && t === 'M') return -1
  if (/^A+$/.test(q)) return q.length
  if (/^d+$/.test(q)) return t === 'P' ? -q.length : -q.length - 1
  return null
}

function fillStr(s, n) { return Array(Math.abs(n) + 1).join(s) }
/**
 * Get interval quality from interval type and alteration
 *
 * @function
 * @param {Integer|String} num - the interval number of the the interval
 * type ('M' for majorables, 'P' for perfectables)
 * @param {Integer} alt - the interval alteration
 * @return {String} the quality string
 * @example
 * altToQ('M', 0) // => 'M'
 */
function altToQ (num, alt) {
  var t = typeof num === 'number' ? type(Math.abs(num)) : num
  if (alt === 0) return t === 'M' ? 'M' : 'P'
  else if (alt === -1 && t === 'M') return 'm'
  else if (alt > 0) return fillStr('A', alt)
  else if (alt < 0) return fillStr('d', t === 'P' ? alt : alt + 1)
  else return null
}

module.exports = { parse: parse, type: type,
  altToQ: altToQ, qToAlt: qToAlt,
  build: build, shorthand: shorthand }

},{}],4:[function(require,module,exports){
'use strict'

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true if the note is the tonic of something.
 * If true, en extra tonicOf property is returned. It's false by default.
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... It can have negative values: -1 = Cb.
 * Can detect pitch class enhramonics.
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || !isTonic && m[4]) return null

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  p.chroma = SEMITONES[p.step] + p.alt
  if (m[3]) {
    p.oct = +m[3]
    p.midi = p.chroma + 12 * (p.oct + 1)
    p.freq = midiToFreq(p.midi, tuning)
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

/**
 * Given a midi number, return its frequency
 * @param {Integer} midi - midi note number
 * @param {Float} tuning - (Optional) the A4 tuning (440Hz by default)
 * @return {Float} frequency in hertzs
 */
function midiToFreq (midi, tuning) {
  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
}

var parser = { parse: parse, regex: regex, midiToFreq: midiToFreq }
var FNS = ['letter', 'acc', 'pc', 'step', 'alt', 'chroma', 'oct', 'midi', 'freq']
FNS.forEach(function (name) {
  parser[name] = function (src) {
    var p = parse(src)
    return p && (typeof p[name] !== 'undefined') ? p[name] : null
  }
})

module.exports = parser

// extra API docs
/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String} note - the note name
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 */
/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 */

},{}],5:[function(require,module,exports){
'use strict';

// Encoding pitches into fifhts/octave notation

function isNum (n) { return typeof n === 'number' }

// Map from letter step to number of fifths starting from 'C':
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// Given a number of fifths, return the octaves they span
function fOcts (f) { return Math.floor(f * 7 / 12) }
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts)

function encode (step, alt, oct) {
  var f = FIFTHS[step] + 7 * alt
  if (!isNum(oct)) return [f]
  var o = oct - FIFTH_OCTS[step] - 4 * alt
  return [f, o]
}

// Return the number of fifths as if it were unaltered
function unaltered (f) {
  var i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// { 0: F, 1: C, 2: G, 3: D, 4: A, 5: E, 6: B}
var STEPS = [3, 0, 4, 1, 5, 2, 6]

function decode (f, o) {
  var step = STEPS[unaltered(f)]
  var alt = Math.floor((f + 1) / 7)
  if (!isNum(o)) return [step, alt]
  var oct = o + 4 * alt + FIFTH_OCTS[step]
  return [step, alt, oct]
}

exports.encode = encode;
exports.decode = decode;
},{}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.notation = global.notation || {})));
}(this, function (exports) { 'use strict';

  var isArr = Array.isArray
  function isNum (x) { return typeof x === 'number' }
  function isStr (x) { return typeof x === 'string' }

  // NOTE LETTERS
  // ============

  // Given a letter, return step
  function toStep (l) {
    var s = 'CDEFGAB'.indexOf(l.toUpperCase())
    return s < 0 ? null : s
  }

  /**
   * Is a valid step number
   */
  function isStep (d) { return !(d < 0 || d > 6) }

  /**
   * Given a step, return a letter
   */
  function toLetter (s) {
    return isStep(s) ? 'CDEFGAB'.charAt(s) : null
  }

  // ACCIDENTALS
  // ===========

  function areFlats (s) { return /^b+$/.test(s) }
  function areSharps (s) { return /^#+$/.test(s) }

  function toAlt (s) {
    return s === '' ? 0
      : areFlats(s) ? -s.length
      : areSharps(s) ? s.length
      : null
  }

  function fillStr (s, num) { return Array(num + 1).join(s) }

  function toAcc (n) {
    return n === 0 ? ''
      : n < 0 ? fillStr('b', -n)
      : fillStr('#', n)
  }

  exports.isArr = isArr;
  exports.isNum = isNum;
  exports.isStr = isStr;
  exports.toStep = toStep;
  exports.isStep = isStep;
  exports.toLetter = toLetter;
  exports.areFlats = areFlats;
  exports.areSharps = areSharps;
  exports.toAlt = toAlt;
  exports.toAcc = toAcc;

}));
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');

function trBy (i, p) {
  var t = tonalPitch.pType(p)
  if (!t) return null
  var f = tonalPitch.fifths(i) + tonalPitch.fifths(p)
  if (tonalPitch.isPC(p)) return ['tnlp', [f]]
  var o = tonalPitch.focts(i) + tonalPitch.focts(p)
  if (t === 'note') return ['tnlp', [f, o]]
  var d = tonalPitch.height(i) + tonalPitch.height(p) < 0 ? -1 : 1
  return ['tnlp', [d * f, d * o], d]
}

/**
 * Transpose notes. Can be used to add intervals. At least one of the parameter
 * is expected to be an interval. If not, it returns null.
 *
 * @param {String|Pitch} a - a note or interval
 * @param {String|Pitch} b - a note or interavl
 * @return {String|Pitch} the transposed pitch or null if not valid parameters
 */
function transpose (a, b) {
  if (arguments.length === 1) return function (b) { return transpose(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var r = tonalPitch.isIvlPitch(pa) ? trBy(pa, pb)
    : tonalPitch.isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : tonalPitch.strPitch(r)
}

/**
 * An alias for `transpose`
 * @function
 */
var tr = transpose

/**
 * Transpose a tonic a number of perfect fifths. It can be partially applied.
 *
 * @function
 * @param {Pitch|String} tonic
 * @param {Integer} number - the number of times
 * @return {String|Pitch} the transposed note
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D5'
 */
function trFifths (t, n) {
  if (arguments.length > 1) return trFifths(t)(n)
  return function (n) {
    return tr(t, tonalPitch.pitch(n, 0, 1))
  }
}

exports.transpose = transpose;
exports.tr = tr;
exports.trFifths = trFifths;
},{"tonal-pitch":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var noteParser = require('note-parser');
var intervalNotation = require('interval-notation');
var tonalEncoding = require('tonal-encoding');

/**
 * Create a pitch
 * @param {Integer} fifths - the number of fifths from C or from P1
 * @param {Integer} focts - the number of encoded octaves
 * @param {Integer} dir - (Optional) Only required for intervals. Can be 1 or -1
 * @return {Pitch}
 */
function pitch (fifths, focts, dir) {
  return dir ? ['tnlp', [fifths, focts], dir] : ['tnlp', [fifths, focts]]
}
/**
 * Test if an object is a pitch
 * @param {Pitch}
 * @return {Boolean}
 */
function isPitch (p) { return Array.isArray(p) && p[0] === 'tnlp' }
/**
 * Encode a pitch
 * @param {Integer} step
 * @param {Integer} alt
 * @param {Integer} oct
 * @param {Integer} dir - (Optional)
 */
function encode$1 (s, a, o, dir) {
  return dir ? ['tnlp', tonalEncoding.encode(s, a, o), dir] : ['tnlp', tonalEncoding.encode(s, a, o)]
}

/**
 * Decode a pitch
 * @param {Pitch} the pitch
 * @return {Array} An array with [step, alt, oct]
 */
function decode$1 (p) {
  return tonalEncoding.decode.apply(null, p[1])
}

/**
 * Get pitch type
 * @param {Pitch}
 * @return {String} 'ivl' or 'note' or null if not a pitch
 */
function pType (p) {
  return !isPitch(p) ? null
    : p[2] ? 'ivl' : 'note'
}
/**
 * Test if is a pitch note (with or without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isNotePitch (p) { return pType(p) === 'note' }
/**
 * Test if is an interval
 * @param {Pitch}
 * @return {Boolean}
 */
function isIvlPitch (p) { return pType(p) === 'ivl' }
/**
 * Test if is a pitch class (a pitch note without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isPC (p) { return isPitch(p) && p[1].length === 1 }

/**
 * Get direction of a pitch (even for notes)
 * @param {Pitch}
 * @return {Integer} 1 or -1
 */
function dir (p) { return p[2] === -1 ? -1 : 1 }

/**
 * Get encoded fifths from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
/**
 * Get encoded octaves from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
/**
 * Get height of a pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function height (p) { return fifths(p) * 7 + focts(p) * 12 }

/**
 * Get chroma of a pitch. The chroma is a number between 0 and 11 to represent
 * the position of a pitch inside an octave. Is the numeric equivlent of a
 * pitch class.
 *
 * @param {Pitch}
 * @return {Integer}
 */
function chr (p) {
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

// memoize parsers
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = fn(str))
  }
}

/**
 * Parse a note
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid note string
 */
var parseNote = memoize(function (s) {
  var p = noteParser.parse(s)
  return p ? encode$1(p.step, p.alt, p.oct) : null
})

/**
 * Parse an interval
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid interval string
 */
var parseIvl = memoize(function (s) {
  var p = intervalNotation.parse(s)
  if (!p) return null
  return p ? encode$1(p.simple - 1, p.alt, p.oct, p.dir) : null
})

/**
 * Parse a note or an interval
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid pitch string
 */
function parsePitch (s) { return parseNote(s) || parseIvl(s) }

/**
 * Ensure the given object is a note pitch. If is a string, it will be
 * parsed. If not a note pitch or valid note string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
/**
 * Ensure the given object is a interval pitch. If is a string, it will be
 * parsed. If not a interval pitch or valid interval string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
/**
 * Ensure the given object is a pitch. If is a string, it will be
 * parsed. If not a pitch or valid pitch string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

/**
 * Convert a note pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strNote (p) {
  if (!isNotePitch(p)) return null
  return noteParser.build.apply(null, decode$1(p))
}

/**
 * Convert a interval pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strIvl (p) {
  if (!isIvlPitch(p)) return null
  // decode to [step, alt, oct]
  var d = decode$1(p)
  // d = [step, alt, oct]
  var num = d[0] + 1 + 7 * d[2]
  return p[2] * num + intervalNotation.altToQ(num, d[1])
}

/**
 * Convert a pitch to string representation (either notes or intervals)
 * @param {Pitch}
 * @return {String}
 */
function strPitch (p) { return strNote(p) || strIvl(p) }

// A function that creates a decorator
// The returned function can _decorate_ other functions to parse and build
// string representations
function decorator (is, parse, str) {
  return function (fn) {
    return function (v) {
      var i = is(v)
      // if the value is in pitch notation no conversion
      if (i) return fn(v)
      // else parse the pitch
      var p = parse(v)
      // if parsed, apply function and back to string
      return p ? str(fn(p)) : null
    }
  }
}

/**
 * Decorate a function to work internally with note pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a note pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var noteFn = decorator(isNotePitch, parseNote, strNote)
/**
 * Decorate a function to work internally with interval pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a interval pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
/**
 * Decorate a function to work internally with pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var pitchFn = decorator(isPitch, parsePitch, strPitch)

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.encode = encode$1;
exports.decode = decode$1;
exports.pType = pType;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPC = isPC;
exports.dir = dir;
exports.fifths = fifths;
exports.focts = focts;
exports.height = height;
exports.chr = chr;
exports.parseNote = parseNote;
exports.parseIvl = parseIvl;
exports.parsePitch = parsePitch;
exports.asNotePitch = asNotePitch;
exports.asIvlPitch = asIvlPitch;
exports.asPitch = asPitch;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.strPitch = strPitch;
exports.noteFn = noteFn;
exports.ivlFn = ivlFn;
exports.pitchFn = pitchFn;
},{"interval-notation":9,"note-parser":10,"tonal-encoding":11}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
'use strict'

// util
function fillStr (s, num) { return Array(num + 1).join(s) }
function isNum (x) { return typeof x === 'number' }
function isStr (x) { return typeof x === 'string' }
function isDef (x) { return typeof x !== 'undefined' }
function midiToFreq (midi, tuning) {
  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
}

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true the strings it's supposed to contain a note number
 * and some category (for example an scale: 'C# major'). It's false by default,
 * but when true, en extra tonicOf property is returned with the category ('major')
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... 11 = B. Can be used to find enharmonics
 * since, for example, chroma of 'Cb' and 'B' are both 11
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || !isTonic && m[4]) return null

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  var pos = SEMITONES[p.step] + p.alt
  p.chroma = pos < 0 ? 12 + pos : pos % 12
  if (m[3]) { // has octave
    p.oct = +m[3]
    p.midi = pos + 12 * (p.oct + 1)
    p.freq = midiToFreq(p.midi, tuning)
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

var LETTERS = 'CDEFGAB'
function acc (n) { return !isNum(n) ? '' : n < 0 ? fillStr('b', -n) : fillStr('#', n) }
function oct (n) { return !isNum(n) ? '' : '' + n }

/**
 * Create a string from a parsed object or `step, alteration, octave` parameters
 * @param {Object} obj - the parsed data object
 * @return {String} a note string or null if not valid parameters
 * @since 1.2
 * @example
 * parser.build(parser.parse('cb2')) // => 'Cb2'
 *
 * @example
 * // it accepts (step, alteration, octave) parameters:
 * parser.build(3) // => 'F'
 * parser.build(3, -1) // => 'Fb'
 * parser.build(3, -1, 4) // => 'Fb4'
 */
function build (s, a, o) {
  if (s === null || typeof s === 'undefined') return null
  if (s.step) return build(s.step, s.alt, s.oct)
  if (s < 0 || s > 6) return null
  return LETTERS.charAt(s) + acc(a) + oct(o)
}

/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String|Integer} note - the note name or midi number
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 * @example
 * // midi numbers are bypassed (even as strings)
 * parser.midi(60) // => 60
 * parser.midi('60') // => 60
 */
function midi (note) {
  if ((isNum(note) || isStr(note)) && note >= 0 && note < 128) return +note
  var p = parse(note)
  return p && isDef(p.midi) ? p.midi : null
}

/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name or note midi number
 * @param {String} tuning - (Optional) the A4 frequency (440 by default)
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 * @example
 * // can change tuning (440 by default)
 * parser.freq('A4', 444) // => 444
 * parser.freq('A3', 444) // => 222
 * @example
 * // it accepts midi numbers (as numbers and as strings)
 * parser.freq(69) // => 440
 * parser.freq('69', 442) // => 442
 */
function freq (note, tuning) {
  var m = midi(note)
  return m === null ? null : midiToFreq(m, tuning)
}

var parser = { parse: parse, build: build, regex: regex, midi: midi, freq: freq }
// add additional functions, one for each object property
var FNS = ['letter', 'acc', 'pc', 'step', 'alt', 'chroma', 'oct']
FNS.forEach(function (name) {
  parser[name] = function (src) {
    var p = parse(src)
    return p && isDef(p[name]) ? p[name] : null
  }
})

module.exports = parser

},{}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');
var tonalDistance = require('tonal-distance');
var toArr = require('as-arr');

// utility
var isArr = Array.isArray
function hasVal (e) { return e || e === 0 }

/**
 * Convert anything to array. Speifically, split string separated by spaces,
 * commas or bars. If you give it an actual array, it returns it without
 * modification.
 *
 * This function __always__ returns an array (null or undefined values are converted
 * to empty arrays)
 *
 * Thanks to this function, the rest of the functions of this module accepts
 * strings as an array parameter.
 *
 * @function
 * @param {*} source - the thing to get an array from
 * @return {Array} the object as an array
 *
 * @example
 * import { asArr } from 'tonal-arrays'
 * asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
 * asArr('A, B, c') // => ['A', 'B', 'c']
 * asArr('1 | 2 | x') // => ['1', '2', 'x']
 */
var asArr = toArr.use(/\s*\|\s*|\s*,\s*|\s+/)

/**
 * Return a new array with the elements mapped by a function.
 * Basically the same as the JavaScript standard `array.map` but with
 * two enhacements:
 *
 * - Arrays can be expressed as strings (see [asArr])
 * - This function can be partially applied. This is useful to create _mapped_
 * versions of single element functions. For an excellent introduction of
 * the adventages [read this](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)
 *
 * @param {Function} fn - the function
 * @param {Array|String} arr - the array to be mapped
 * @return {Array}
 * @example
 * var arr = require('tonal-arr')
 * var toUp = arr.map(function(e) { return e.toUpperCase() })
 * toUp('a b c') // => ['A', 'B', 'C']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.map(tonal.transpose('M3'), 'C D E') // => ['E', 'F#', 'G#']
 */
function map (fn, list) {
  return arguments.length > 1 ? map(fn)(list)
    : function (l) { return asArr(l).map(fn) }
}

/**
 * Return a copy of the array with the null values removed
 * @param {String|Array} list
 * @return {Array}
 * @example
 * tonal.compact(['a', 'b', null, 'c']) // => ['a', 'b', 'c']
 */
function compact (arr) {
  return asArr(arr).filter(hasVal)
}

/**
 * Filter an array with a function. Again, almost the same as JavaScript standard
 * filter function but:
 *
 * - It accepts strings as arrays
 * - Can be partially applied
 *
 * @param {Function} fn
 * @param {String|Array} arr
 * @return {Array}
 * @example
 * t.filter(t.noteName, 'a b c x bb') // => [ 'a', 'b', 'c', 'bb' ]
 */
function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list)
    : function (l) { return asArr(l).filter(fn) }
}

// a custom height function that
// - returns -Infinity for non-pitch objects
// - assumes pitch classes has octave -100 (so are sorted before that notes)
function objHeight (p) {
  if (!p) return -Infinity
  var f = tonalPitch.fifths(p) * 7
  var o = tonalPitch.focts(p) || -Math.floor(f / 12) - 100
  return f + o * 12
}

// ascending comparator
function ascComp (a, b) { return objHeight(a) - objHeight(b) }
// descending comparator
function descComp (a, b) { return -ascComp(a, b) }

/**
 * Sort a list of notes or intervals in ascending or descending pitch order.
 * It removes from the list any thing is not a pitch (a note or interval)
 *
 * Note this function returns a __copy__ of the array, it does NOT modify
 * the original.
 *
 * @param {Array|String} list - the list of notes or intervals
 * @param {Boolean|Function} comp - (Optional) comparator.
 * Ascending pitch by default. Pass a `false` to order descending
 * or a custom comparator function (that receives pitches in array notation).
 * Note that any other value is ignored.
 * @example
 * array.sort('D E C') // => ['C', 'D', 'E']
 * array.sort('D E C', false) // => ['E', 'D', 'C']
 * // if is not a note, it wil be removed
 * array.sort('g h f i c') // => ['C', 'F', 'G']
 */
function sort (list, comp) {
  var fn = arguments.length === 1 || comp === true ? ascComp
    : comp === false ? descComp
    : typeof comp === 'function' ? comp : ascComp
  // if the list is an array, make a copy
  list = Array.isArray(list) ? list.slice() : asArr(list)
  return listFn(function (arr) {
    return arr.sort(fn).filter(hasVal)
  }, list)
}

/**
 * Randomizes the order of the specified array using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * import { shuffle } from 'tonal-arrays'
 * @example
 * var tonal = require('tonal')
 * tonal.shuffle('C D E F')
 */
var shuffle = listFn(function (arr) {
  var i, t
  var m = arr.length
  while (m) {
    i = Math.random() * m-- | 0
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
})

function trOct (n) { return tonalTranspose.transpose(tonalPitch.pitch(0, n, 1)) }

/**
 * Rotates a list a number of times. It's completly agnostic about the
 * contents of the list.
 * @param {Integer} times - the number of rotations
 * @param {Array|String} list - the list to be rotated
 * @return {Array} the rotated array
 */
function rotate (times, list) {
  var arr = asArr(list)
  var len = arr.length
  var n = ((times % len) + len) % len
  return arr.slice(n, len).concat(arr.slice(0, n))
}

/**
 * Rotates an ascending list of pitches n times keeping the ascending property.
 * This functions assumes the list is an ascending list of pitches, and
 * transposes the them to ensure they are ascending after rotation.
 * It can be used, for example, to invert chords.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array|String} list - the list to be rotated
 * @return {Array} the rotated array
 */
function rotateAsc (times, list) {
  return listFn(function (arr) {
    var len = arr.length
    var n = ((times % len) + len) % len
    var head = arr.slice(n, len)
    var tail = arr.slice(0, n)
    // See if the first note of tail is lower than the last of head
    var s = tonalDistance.semitones(head[len - n - 1], tail[0])
    if (s < 0) {
      var octs = Math.floor(s / 12)
      if (times < 0) head = head.map(trOct(octs))
      else tail = tail.map(trOct(-octs))
    }
    return head.concat(tail)
  }, list)
}

/**
 * Select elements from a list.
 *
 * @param {String|Array} numbers - a __1-based__ index of the elements
 * @param {String|Array} list - the list of pitches
 * @return {Array} the selected elements (with nulls if not valid index)
 *
 * @example
 * import { select } from 'tonal-array'
 * select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
 * select('-1 0 1 2 3', 'C D') // => [ null, null, 'C', 'D', null ]
 */
function select (nums, list) {
  if (arguments.length === 1) return function (l) { return select(nums, l) }
  var arr = asArr(list)
  return asArr(nums).map(function (n) {
    return arr[n - 1] || null
  })
}

// #### Transform lists in array notation
function asPitchStr (p) { return tonalPitch.strPitch(p) || p }
function listToStr (v) {
  return tonalPitch.isPitch(v) ? tonalPitch.strPitch(v)
    : isArr(v) ? v.map(asPitchStr)
    : v
}

/**
 * Decorates a function to so it's first parameter is an array of pitches in
 * array notation. Also, if the return value is a pitch or an array of pitches
 * in array notation, it convert backs to strings.
 *
 * @private
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 * @example
 * import { listFn } from 'tonal-arrays'
 * var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
 * octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
 */
function listFn (fn, list) {
  if (arguments.length === 1) return function (l) { return listFn(fn, l) }
  var arr = asArr(list).map(tonalPitch.asPitch)
  var res = fn(arr)
  return listToStr(res)
}

exports.asArr = asArr;
exports.map = map;
exports.compact = compact;
exports.filter = filter;
exports.sort = sort;
exports.shuffle = shuffle;
exports.rotate = rotate;
exports.rotateAsc = rotateAsc;
exports.select = select;
},{"as-arr":13,"tonal-distance":18,"tonal-pitch":29,"tonal-transpose":39}],13:[function(require,module,exports){
'use strict'

// Create a function that converts objects to arrays using the given string separator
function use (sep) {
  return function (o, s) {
    var l = arguments.length
    return l === 0 ? []
      : Array.isArray(o) ? o
      : typeof o === 'string' ? o.trim().split(l === 1 ? sep : s)
      : [ o ]
  }
}
var asArr = use(/\s+/)
asArr.use = use

module.exports = asArr

},{}],14:[function(require,module,exports){
module.exports={
  "4": [ "1P 4P 7m 10m", [ "quartal" ] ],
  "64": ["5P 8P 10M"],
  "5": [ "1P 5P" ],
  "M": [ "1P 3M 5P", [ "Major", "" ] ],
  "M#5": [ "1P 3M 5A", [ "augmented", "maj#5", "Maj#5", "+", "aug" ] ],
  "M#5add9": [ "1P 3M 5A 9M", [ "+add9" ] ],
  "M13": [ "1P 3M 5P 7M 9M 13M", [ "maj13", "Maj13" ] ],
  "M13#11": [ "1P 3M 5P 7M 9M 11A 13M", [ "maj13#11", "Maj13#11", "M13+4", "M13#4" ] ],
  "M6": [ "1P 3M 5P 13M", [ "6" ] ],
  "M6#11": [ "1P 3M 5P 6M 11A", [ "M6b5", "6#11", "6b5" ] ],
  "M69": [ "1P 3M 5P 6M 9M", [ "69" ] ],
  "M69#11": [ "1P 3M 5P 6M 9M 11A" ],
  "M7#11": [ "1P 3M 5P 7M 11A", [ "maj7#11", "Maj7#11", "M7+4", "M7#4" ] ],
  "M7#5": [ "1P 3M 5A 7M", [ "maj7#5", "Maj7#5", "maj9#5", "M7+" ] ],
  "M7#5sus4": [ "1P 4P 5A 7M" ],
  "M7#9#11": [ "1P 3M 5P 7M 9A 11A" ],
  "M7add13": [ "1P 3M 5P 6M 7M 9M" ],
  "M7b5": [ "1P 3M 5d 7M" ],
  "M7b6": [ "1P 3M 6m 7M" ],
  "M7b9": [ "1P 3M 5P 7M 9m" ],
  "M7sus4": [ "1P 4P 5P 7M" ],
  "M9": [ "1P 3M 5P 7M 9M", [ "maj9", "Maj9" ] ],
  "M9#11": [ "1P 3M 5P 7M 9M 11A", [ "maj9#11", "Maj9#11", "M9+4", "M9#4" ] ],
  "M9#5": [ "1P 3M 5A 7M 9M", [ "Maj9#5" ] ],
  "M9#5sus4": [ "1P 4P 5A 7M 9M" ],
  "M9b5": [ "1P 3M 5d 7M 9M" ],
  "M9sus4": [ "1P 4P 5P 7M 9M" ],
  "Madd9": [ "1P 3M 5P 9M", [ "2", "add9", "add2" ] ],
  "Maj7": [ "1P 3M 5P 7M", [ "maj7", "M7" ] ],
  "Mb5": [ "1P 3M 5d" ],
  "Mb6": [ "1P 3M 13m" ],
  "Msus2": [ "1P 2M 5P", [ "add9no3", "sus2" ] ],
  "Msus4": [ "1P 4P 5P", [ "sus", "sus4" ] ],
  "addb9": [ "1P 3M 5P 9m" ],
  "7": [ "1P 3M 5P 7m", [ "Dominant", "Dom" ] ],
  "9": [ "1P 3M 5P 7m 9M", [ "79" ] ],
  "11": [ "1P 5P 7m 9M 11P" ],
  "13": [ "1P 3M 5P 7m 9M 13M", [ "13_" ] ],
  "11b9": [ "1P 5P 7m 9m 11P" ],
  "13#11": [ "1P 3M 5P 7m 9M 11A 13M", [ "13+4", "13#4" ] ],
  "13#9": [ "1P 3M 5P 7m 9A 13M", [ "13#9_" ] ],
  "13#9#11": [ "1P 3M 5P 7m 9A 11A 13M" ],
  "13b5": [ "1P 3M 5d 6M 7m 9M" ],
  "13b9": [ "1P 3M 5P 7m 9m 13M" ],
  "13b9#11": [ "1P 3M 5P 7m 9m 11A 13M" ],
  "13no5": [ "1P 3M 7m 9M 13M" ],
  "13sus4": [ "1P 4P 5P 7m 9M 13M", [ "13sus" ] ],
  "69#11": [ "1P 3M 5P 6M 9M 11A" ],
  "7#11": [ "1P 3M 5P 7m 11A", [ "7+4", "7#4", "7#11_", "7#4_" ] ],
  "7#11b13": [ "1P 3M 5P 7m 11A 13m", [ "7b5b13" ] ],
  "7#5": [ "1P 3M 5A 7m", [ "+7", "7aug", "aug7" ] ],
  "7#5#9": [ "1P 3M 5A 7m 9A", [ "7alt", "7#5#9_", "7#9b13_" ] ],
  "7#5b9": [ "1P 3M 5A 7m 9m" ],
  "7#5b9#11": [ "1P 3M 5A 7m 9m 11A" ],
  "7#5sus4": [ "1P 4P 5A 7m" ],
  "7#9": [ "1P 3M 5P 7m 9A", [ "7#9_" ] ],
  "7#9#11": [ "1P 3M 5P 7m 9A 11A", [ "7b5#9" ] ],
  "7#9#11b13": [ "1P 3M 5P 7m 9A 11A 13m" ],
  "7#9b13": [ "1P 3M 5P 7m 9A 13m" ],
  "7add6": [ "1P 3M 5P 7m 13M", [ "67", "7add13" ] ],
  "7b13": [ "1P 3M 7m 13m" ],
  "7b5": [ "1P 3M 5d 7m" ],
  "7b6": [ "1P 3M 5P 6m 7m" ],
  "7b9": [ "1P 3M 5P 7m 9m" ],
  "7b9#11": [ "1P 3M 5P 7m 9m 11A", [ "7b5b9" ] ],
  "7b9#9": [ "1P 3M 5P 7m 9m 9A" ],
  "7b9b13": [ "1P 3M 5P 7m 9m 13m" ],
  "7b9b13#11": [ "1P 3M 5P 7m 9m 11A 13m", [ "7b9#11b13", "7b5b9b13" ] ],
  "7no5": [ "1P 3M 7m" ],
  "7sus4": [ "1P 4P 5P 7m", [ "7sus" ] ],
  "7sus4b9": [ "1P 4P 5P 7m 9m", [ "susb9", "7susb9", "7b9sus", "7b9sus4", "phryg" ] ],
  "7sus4b9b13": [ "1P 4P 5P 7m 9m 13m", [ "7b9b13sus4" ] ],
  "9#11": [ "1P 3M 5P 7m 9M 11A", [ "9+4", "9#4", "9#11_", "9#4_" ] ],
  "9#11b13": [ "1P 3M 5P 7m 9M 11A 13m", [ "9b5b13" ] ],
  "9#5": [ "1P 3M 5A 7m 9M", [ "9+" ] ],
  "9#5#11": [ "1P 3M 5A 7m 9M 11A" ],
  "9b13": [ "1P 3M 7m 9M 13m" ],
  "9b5": [ "1P 3M 5d 7m 9M" ],
  "9no5": [ "1P 3M 7m 9M" ],
  "9sus4": [ "1P 4P 5P 7m 9M", [ "9sus" ] ],
  "m": [ "1P 3m 5P", [ "minor" ] ],
  "m#5": [ "1P 3m 5A", [ "m+", "mb6" ] ],
  "m11": [ "1P 3m 5P 7m 9M 11P", [ "_11" ] ],
  "m11A 5": [ "1P 3m 6m 7m 9M 11P" ],
  "m11b5": [ "1P 3m 7m 12d 2M 4P", [ "h11", "_11b5" ] ],
  "m13": [ "1P 3m 5P 7m 9M 11P 13M", [ "_13" ] ],
  "m6": [ "1P 3m 4P 5P 13M", [ "_6" ] ],
  "m69": [ "1P 3m 5P 6M 9M", [ "_69" ] ],
  "m7": [ "1P 3m 5P 7m", [ "minor7", "_", "_7" ] ],
  "m7#5": [ "1P 3m 6m 7m" ],
  "m7add11": [ "1P 3m 5P 7m 11P", [ "m7add4" ] ],
  "m7b5": [ "1P 3m 5d 7m", [ "half-diminished", "h7", "_7b5" ] ],
  "m9": [ "1P 3m 5P 7m 9M", [ "_9" ] ],
  "m9#5": [ "1P 3m 6m 7m 9M" ],
  "m9b5": [ "1P 3m 7m 12d 2M", [ "h9", "-9b5" ] ],
  "mMaj7": [ "1P 3m 5P 7M", [ "mM7", "_M7" ] ],
  "mMaj7b6": [ "1P 3m 5P 6m 7M", [ "mM7b6" ] ],
  "mM9": [ "1P 3m 5P 7M 9M", [ "mMaj9", "-M9" ] ],
  "mM9b6": [ "1P 3m 5P 6m 7M 9M", [ "mMaj9b6" ] ],
  "mb6M7": [ "1P 3m 6m 7M" ],
  "mb6b9": [ "1P 3m 6m 9m" ],
  "o": [ "1P 3m 5d", [ "mb5", "dim" ] ],
  "o7": [ "1P 3m 5d 13M", [ "diminished", "m6b5", "dim7" ] ],
  "o7M7": [ "1P 3m 5d 6M 7M" ],
  "oM7": [ "1P 3m 5d 7M" ],
  "sus24": [ "1P 2M 4P 5P", [ "sus4add9" ] ],
  "+add#9": [ "1P 3M 5A 9A" ],
  "madd4": [ "1P 3m 4P 5P" ],
  "madd9": [ "1P 3m 5P 9M" ]
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var noteParser = require('note-parser');
var tonalHarmonizer = require('tonal-harmonizer');

var DATA = require('./chords.json')

var dict = tonalDictionary.get(tonalPitch.parseIvl, DATA)

/**
 * Create chords by chord type or intervals and tonic. The returned chord is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the chord type, intervals or notes
 * @param {String} tonic - the chord tonic (or false to get intervals)
 * @return {Array} the chord notes
 *
 * @example
 * var chord = require('tonal-chord')
 * // get chord notes using type and tonic
 * chord.build('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get chord intervals (tonic false)
 * chord.build('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * var maj7 = chord.build('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // create chord from intervals
 * chord.build('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return tonalHarmonizer.harmonize(dict(src) || src, tonic)
}

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * var chord = require('tonal-chord')
 * chord.names() // => ['maj7', ...]
 */
var names = tonalDictionary.keys(DATA)

/**
 * Get chord notes from chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the chord notes
 *
 * @example
 * var chords = require('tonal-chords')
 * chords.get('C7') // => ['C', 'E', 'G', 'Bb']
 * chords.get('CMaj7') // => ['C', 'E', 'G', 'B']
 */
function get$1 (name) {
  var p = noteParser.regex().exec(name)
  if (!p) return []
  // it has note and chord name
  if (p[4]) return build(p[4], p[1] + p[2] + p[3])
  return build(p[3], p[1] + p[2])
}

/**
 * Try to parse a chord name. It returns an array with the chord type and
 * the tonic. If not tonic is found, all the name is considered the chord
 * name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @param {String} name - the chord name
 * @return {Array} an array with [type, tonic]
 * @example
 * chord.parse('Cmaj7') // => ['maj7', 'C']
 * chord.parse('C7') // => ['7', 'C']
 * chord.parse('mMaj7') // => ['mMaj7', null]
 * chord.parse('Cnonsense') // => ['nonsense', 'C']
 */
function parse (name) {
  var p = noteParser.regex().exec(name)
  if (!p) return [name, null]
  // it can have a chord name: Cmaj7 is ['maj7', 'C']
  // or if not, the octave is treated as chord name: C7 is ['7', 'C']
  // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
  return p[4] ? [p[4], p[1] + p[2] + p[3]] : [p[3], p[1] + p[2]]
}

/**
 * Detect a chord. Given a list of notes, return the chord name(s) if any.
 * It only detects chords with exactly same notes.
 *
 * @function
 * @param {Array|String} notes - the list of notes
 * @return {Array<String>} an array with the possible chords
 * @example
 * chord.detect('b g f# d') // => [ 'GMaj7' ]
 * chord.detect('e c a g') // => [ 'CM6', 'Am7' ]
 */
var detect = tonalDictionary.detector('', DATA)

exports.build = build;
exports.names = names;
exports.get = get$1;
exports.parse = parse;
exports.detect = detect;
},{"./chords.json":14,"note-parser":16,"tonal-dictionary":17,"tonal-harmonizer":21,"tonal-pitch":29}],16:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalArray = require('tonal-array');
var tonalPitchset = require('tonal-pitchset');

/**
 * This module contains functions to query tonal dictionaries.
 *
 * A tonal dictionary is basically a map from keys to list of intervals. It
 * also supports name aliases. See `tonal-chords` or `tonal-scales` to examples
 * of dictionaries.
 *
 * This functions are quite low level, and probably you wont need it, because
 * they are friendly served via `tonal-chords` and `tonal-scales`.
 *
 * __Those functions are NOT visible via `tonal` package__.
 *
 * @module dictionary
 */
function id (x) { return x }

/**
 * Query a tonal dictionary by key.
 *
 * If you pass two parameters you get a currified version: a dictionary getter.
 * (see example)
 *
 * @param {Function} parser - (Optional) the function to parse the intervals
 * @param {Hash<String, Array>} dictionary - the dictionary data
 * @param {String} key - the key to query
 * @return {Array} the list of intervals of that name or null if not present
 * in the dictionary
 * @example
 * var dict = require('tonal-dictionary')
 * var DATA = {
 * 'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7': ['1 b3 5 7']
 * }
 * var chord = dict.get(null, DATA)
 * chord('maj7') // => [ '1', '3', '5', '7' ]
 * chord('Maj7') // => [ '1', '3', '5', '7' ]
 * chord('m7') // => ['1', 'b3', '5', '7']
 * chord('m7b5') // => null
 */
function get (parse, raw, name) {
  if (arguments.length > 2) return get(parse, raw)(name)
  var data = Object.keys(raw).reduce(function (d, k) {
    // add intervals
    d[k] = raw[k][0].split(' ').map(parse || id)
    // add alias
    if (raw[k][1]) raw[k][1].forEach(function (a) { d[a] = d[k] })
    return d
  }, {})
  return function (n) {
    return data[n]
  }
}

/**
 * Query a tonal dictionary to get all the defined keys
 *
 * If you pass only one parameter you get a partially applied version: a
 * function that returns all keys of the given dictionary.
 *
 * @param {Hash<String, Array>} dictionary - the dictionary data
 * @param {Boolean} aliases - (Optional) true to include the name aliases
 * @return {Array<String>} a list of defined keys
 * @example
 * var dict = require('tonal-dictionary')
 * var DATA = {
 * 'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7': ['1 b3 5 7']
 * }
 * dict.keys(DATA, false) // => ['maj7', 'm7']
 * dict.keys(DATA, true) // => ['maj7', 'm7', 'Maj7']
 * // partially applied
 * var chordNames = dict.keys(DATA)
 * chordNames() // => ['maj7', 'm7']
 */
function keys (raw, alias) {
  if (arguments.length > 1) return keys(raw)(alias)
  var main = Object.keys(raw)
  var aliases = main.reduce(function (a, k) {
    if (raw[k][1]) raw[k][1].forEach(function (n) { a.push(n) })
    return a
  }, [])
  return function (alias) {
    return alias ? main.concat(aliases) : main.slice()
  }
}

/**
 * Create a pitch set detector. Given a dictionary data, it returns a
 * function that tries to detect a given pitch set inside the dictionary
 *
 * @param {Function} builder - a function that given a name and a tonic,
 * returns the object
 * @param {Object} data - the dictionary data
 * @return {Function} the detector function
 * @see chord.detect
 */
function detector (build, data) {
  var isSep = typeof build === 'string'
  var isFn = typeof build === 'function'
  var dict = Object.keys(data).reduce(function (dict, key) {
    dict[tonalPitchset.chroma(data[key][0])] = key
    return dict
  }, {})

  return function (notes) {
    notes = tonalArray.sort(notes)
    var sets = tonalPitchset.rotations(notes)
    return tonalArray.compact(sets.map(function (set, i) {
      var type = dict[set]
      if (!type) return null
      var tonic = notes[i]
      return isSep ? tonic + build + type
        : isFn ? build(type, tonic)
        : [type, tonic]
    }))
  }
}

exports.get = get;
exports.keys = keys;
exports.detector = detector;
},{"tonal-array":12,"tonal-pitchset":32}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');

// substract two pitches
function substr (a, b) {
  if (!a || !b || a[1].length !== b[1].length) return null
  var f = tonalPitch.fifths(b) - tonalPitch.fifths(a)
  if (tonalPitch.isPC(a)) return tonalPitch.pitch(f, -Math.floor(f * 7 / 12), 1)
  var o = tonalPitch.focts(b) - tonalPitch.focts(a)
  var d = tonalPitch.height(b) - tonalPitch.height(a) < 0 ? -1 : 1
  return tonalPitch.pitch(d * f, d * o, d)
}

/**
 * Find the interval between two pitches. Both pitches MUST be of the same type:
 *
 * - notes: it returns the interval between the first and the second
 * - pitch classes: it returns the __ascending__ interval between both
 * - intervals: substract one from the other
 *
 * @param {Pitch|String} from - distance from
 * @param {Pitch|String} to - distance to
 * @return {Interval} the distance between pitches
 *
 * @example
 * var distance = require('tonal-distance')
 * distance.interval('C2', 'C3') // => 'P8'
 * distance.interval('G', 'B') // => 'M3'
 * // or use tonal
 * var tonal = require('tonal')
 * tonal.distance.interval('M2', 'P5') // => 'P4'
 */
function interval (a, b) {
  if (arguments.length === 1) return function (b) { return interval(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : tonalPitch.strIvl(i)
}

/**
 * Get the distance between two notes in semitones
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from 'tonal-distance'
 * semitones('C3', 'A2') // => -3
 * // or use tonal
 * tonal.distance.semitones('C3', 'G3') // => 7
 */
function semitones (a, b) {
  var i = substr(tonalPitch.asPitch(a), tonalPitch.asPitch(b))
  return i ? tonalPitch.height(i) : null
}

exports.interval = interval;
exports.semitones = semitones;
},{"tonal-pitch":29}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Functions to encoding and decoding pitches into fifths/octaves notation.
 *
 * This functions are very low level and it's probably you wont need them. That's
 * why __this module is NOT exported in the tonal package__.
 *
 * @private
 * @module encoding
 */

function isNum (n) { return typeof n === 'number' }

// Map from letter step to number of fifths starting from 'C':
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// Given a number of fifths, return the octaves they span
function fOcts (f) { return Math.floor(f * 7 / 12) }
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts)

function encode (step, alt, oct) {
  var f = FIFTHS[step] + 7 * alt
  if (!isNum(oct)) return [f]
  var o = oct - FIFTH_OCTS[step] - 4 * alt
  return [f, o]
}

// Return the number of fifths as if it were unaltered
function unaltered (f) {
  var i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ['F', 'C', 'G', 'D', 'A', 'E', 'B'] we have:
var STEPS = [3, 0, 4, 1, 5, 2, 6]

/**
 * Decode a encoded pitch
 * @param {Number} fifths - the number of fifths
 * @param {Number} octs - the number of octaves to compensate the fifhts
 * @return {Array} in the form [step, alt, oct]
 */
function decode (f, o) {
  var step = STEPS[unaltered(f)]
  var alt = Math.floor((f + 1) / 7)
  if (!isNum(o)) return [step, alt]
  var oct = o + 4 * alt + FIFTH_OCTS[step]
  return [step, alt, oct]
}

exports.encode = encode;
exports.decode = decode;
},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalMidi = require('tonal-midi');

// decorate a function to round the numeric result to a max
function round (m, fn) {
  m = m || m === 0 ? Math.pow(10, m) : false
  return function (v) {
    v = fn(v)
    return v === null ? null : m ? Math.round(v * m) / m : v
  }
}

/**
 * Return the equal tempered frequency of a note.
 *
 * This function can be partially applied if note parameter is not present.
 * @function
 * @param {Float} ref - the tuning reference
 * @param {Integer} maxDecimals - (Optional) the maximum number of decimals (all by default)
 * @param {String|Pitch} note - the note to get the frequency from
 * @return {Number} the frequency
 * @example
 * eqTempFreq(444, 4, 'C3')
 * const toFreq = eqTempFreq(444, 2)
 * toFreq('A3') // => 222
 */
function eqTempFreq (ref, max, note) {
  if (arguments.length > 2) return eqTempFreq(ref, max)(note)
  return round(max, function (p) {
    var m = tonalMidi.toMidi(p)
    return m ? Math.pow(2, (m - 69) / 12) * ref : null
  })
}

/**
 * Get the frequency of note with 2 decimals precission using A4 440Hz tuning
 *
 * This is an alias for: `eqTempFreq(440, 2, <note>)`
 *
 * @function
 * @param {Number|String} note - the note name or midi number
 * @return {Float} the frequency in herzs
 * @example
 * freq.toFreq('A4') // => 440
 * freq.toFreq('C4') // => 261.63
 */
var toFreq = eqTempFreq(440, 2)

/**
 * Get the midi note from a frequency in equal temperament scale. You can
 * specify the number of decimals of the midi number.
 *
 * @param {Float} tuning - (Optional) the reference A4 tuning (440Hz by default)
 * @param {Number} freq - the frequency
 * @return {Number} the midi number
 */
function eqTempFreqToMidi (ref, max, freq) {
  if (arguments.length > 2) return eqTempFreqToMidi(ref, max)(freq)
  return round(max, function (freq) {
    return 12 * (Math.log(freq) - Math.log(ref)) / Math.log(2) + 69
  })
}

/**
 * Get midi number from frequency with two decimals of precission.
 *
 * This is an alisas for: `eqTempFreqToMidi(440, 2, <freq>)`
 *
 * @function
 * @param {Float} freq
 * @return {Number} midi number
 * @example
 * freq.toMidi(361) // => 59.96
 */
var toMidi$1 = eqTempFreqToMidi(440, 2)

/**
 * Get note name from frequency using an equal temperament scale with 440Hz
 * as reference
 *
 * @param {Float} freq
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} note name
 * @example
 * freq.note(440) // => 'A4'
 */
function note$1 (freq, useSharps) {
  return tonalMidi.note(toMidi$1(freq), useSharps)
}

/**
 * Get difference in cents between two frequencies. The frequencies can be
 * expressed with hertzs or midi numbers or note names
 * @param {Float|Integer|String} base
 * @param {Float|Integer|String} freq
 * @return {Integer} The difference in cents
 * @example
 * import { cents } from 'tonal-freq'
 * cents('C4', 261) // => -4
 */
function cents (base, freq) {
  var b = toFreq(base) || base
  var f = toFreq(freq) || freq
  return Math.round(1200 * (Math.log(f / b) / Math.log(2)))
}

exports.eqTempFreq = eqTempFreq;
exports.toFreq = toFreq;
exports.eqTempFreqToMidi = eqTempFreqToMidi;
exports.toMidi = toMidi$1;
exports.note = note$1;
exports.cents = cents;
},{"tonal-midi":24}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalTranspose = require('tonal-transpose');
var tonalDistance = require('tonal-distance');
var tonalArray = require('tonal-array');

/**
 * Given a list of notes, return the distance from the first note to the rest.
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals
 * @example
 * harmonizer.harmonics('C E G') // => ['1P', '3M', '5P']
 *
 * @example
 * // in tonal this functions are NOT namespaced
 * tonal.harmonics(tonal.scale('C major')) // => ['1P', ...]
 */
function harmonics (list) {
  var a = tonalArray.asArr(list)
  return a.length ? tonalArray.compact(a.map(tonalDistance.interval(a[0]))) : a
}

/**
 * Given a list of intervals and a tonic, return that tonic transposed
 * to that intervals.
 *
 * It's currified and, calling with only one parameter, returns an harmonizer,
 * a function that harmonizes any note (see example)
 *
 * @function
 * @param {String|Array} list - the list of intervals
 * @param {String|Pitch} note - the note to be harmonized
 * @return {Array} the resulting notes
 * @example
 * harmonizer.harmonize('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
 * @example
 * // harmonizer with partial application
 * var maj7 = harmonize.harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * @example
 * // in tonal this function is NOT namespaced
 * var C = tonal.harmonizer('C D E')
 * C('M3') // => ['E', 'G#', 'B']
 */
function harmonize (list, pitch) {
  if (arguments.length > 1) return harmonize(list)(pitch)
  return function (tonic) {
    return tonalArray.compact(tonalArray.map(tonalTranspose.transpose(tonic || 'P1'), list))
  }
}

exports.harmonics = harmonics;
exports.harmonize = harmonize;
},{"tonal-array":12,"tonal-distance":18,"tonal-transpose":39}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var intervalNotation = require('interval-notation');
var tonalPitch = require('tonal-pitch');

/**
 * Get interval name. Can be used to test if it's an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @param {String|Pitch} interval - the interval string or array
 * @return {String} the interval name or null if not valid interval
 * @example
 * interval.toInterval('m-3') // => '-3m'
 * interval.toInterval('3') // => null
 */
function toInterval (ivl) {
  var i = tonalPitch.asIvlPitch(ivl)
  return i ? tonalPitch.strIvl(i) : null
}

/**
 * Get the number of the interval (same as value, but always positive)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Integer} the positive interval number (P1 is 1, m2 is 2, ...)
 * @example
 * interval.num('m2') // => 2
 * interval.num('P9') // => 9
 * interval.num('P-4') // => 4
 */
function num (ivl) {
  var p = props(ivl)
  return p ? p.num : null
}

/**
 * Get the interval value (the interval number, but positive or negative
 * depending the interval direction)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Integer} the positive interval number (P1 is 1, m-2 is -2, ...)
 * @example
 * interval.num('m2') // => 2
 * interval.num('m9') // => 9
 * interval.num('P-4') // => -4
 * interval.num('m-9') // => -9
 */
function value (ivl) {
  var p = props(ivl)
  return p ? p.num * p.dir : null
}

/**
 * Get interval properties. It returns an object with:
 *
 * - num: the interval number (always positive)
 * - alt: the interval alteration (0 for perfect in perfectables, or 0 for major in _majorables_)
 * - dir: the interval direction (1 ascending, -1 descending)
 *
 * @param {String|Pitch} interval - the interval
 * @return {Array} the interval in the form [number, alt]
 * @example
 * interval.parse('m2') // => { num: 2, alt: -1, dir: 1 }
 * interval.parse('m9') // => { num: 9, alt: -1, dir: 1 }
 * interval.parse('P-4') // => { num: 4, alt: 0, dir: -1}
 * interval.parse('m-9') // => { num: 9, alt: -1, dir: -1 }
 */
function props (ivl) {
  var i = tonalPitch.asIvlPitch(ivl)
  if (!i) return null
  var d = tonalPitch.decode(i)
  return { num: d[0] + 1 + d[2] * 7, alt: d[1], dir: i[2] }
}

/**
 * Given a interval property object, get the interval name
 *
 * @param {Object} props - the interval property object
 *
 * - num: the interval number
 * - alt: the interval alteration
 * - dir: the direction
 * @return {String} the interval name
 */
function fromProps (props) {
  if (!props || props.num < 1) return null
  var octs = Math.floor((props.num) / 7)
  var simple = props.num - 7 * octs
  return intervalNotation.build(simple, props.alt, octs, props.dir)
}

/**
 * Get size in semitones of an interval
 * @param {String|Pitch} ivl
 * @return {Integer} the number of semitones or null if not an interval
 * @example
 * import { semitones } from 'tonal-interval'
 * semitones('P4') // => 5
 * // or using tonal
 * tonal.semitones('P5') // => 7
 */
function semitones (ivl) {
  var i = tonalPitch.asIvlPitch(ivl)
  return i ? tonalPitch.height(i) : null
}

// interval numbers
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7]
// interval qualities
var IQ = 'P m M m M P d P m M m M'.split(' ')

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitraty, but deterministic.
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {String} the interval name
 * @example
 * import { fromSemitones } from 'tonal-interval'
 * fromSemitones(7) // => '5P'
 * // or using tonal
 * tonal.fromSemitones(-7) // => '-5P'
 */
function fromSemitones (num) {
  var d = num < 0 ? -1 : 1
  var n = Math.abs(num)
  var c = n % 12
  var o = Math.floor(n / 12)
  return d * (IN[c] + 7 * o) + IQ[c]
}

var CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
/**
 * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
 * number of a given interval.
 *
 * In musical set theory, an interval class is the shortest distance in
 * pitch class space between two unordered pitch classes
 *
 * As paramter you can pass an interval in shorthand notation, an interval in
 * array notation or the number of semitones of the interval
 *
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * interval.ic('P8') // => 0
 * interval.ic('m6') // => 4
 * ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
function ic (ivl) {
  var i = tonalPitch.asIvlPitch(ivl)
  var s = i ? tonalPitch.chr(i) : Math.round(ivl)
  return isNaN(s) ? null : CLASSES[Math.abs(s) % 12]
}

var TYPES = 'PMMPPMM'
/**
 * Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)
 * It does NOT return the actual quality.
 *
 * @param {String|Pitch} interval
 * @return {String} 'P' for perfectables, 'M' for majorables or null if not
 * valid interval
 * @example
 * interval.type('5A') // => 'P'
 */
function type (ivl) {
  var i = tonalPitch.asIvlPitch(ivl)
  return i ? TYPES[tonalPitch.decode(i)[0]] : null
}

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {String|Pitch} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String|Pitch} the inverted interval
 *
 * @example
 * interval.invert('3m') // => '6M'
 * interval.invert('2M') // => '7m'
 */
var invert = tonalPitch.ivlFn(function (i) {
  var d = tonalPitch.decode(i)
  // d = [step, alt, oct]
  var step = (7 - d[0]) % 7
  var alt = TYPES[d[0]] === 'P' ? -d[1] : -(d[1] + 1)
  return tonalPitch.encode(step, alt, d[2], tonalPitch.dir(i))
})

/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {String|Array} interval - the interval to simplify
 * @return {String|Array} the simplified interval
 *
 * @example
 * interval.simplify('9M') // => '2M'
 * ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(interval.simplify)
 * // => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
 * interval.simplify('2M') // => '2M'
 * interval.simplify('-2M') // => '7m'
 */
var simplify = tonalPitch.ivlFn(function (i) {
  // decode to [step, alt, octave]
  var dec = tonalPitch.decode(i)
  // if it's not 8 reduce the octaves to 0
  if (dec[0] !== 0 || dec[2] !== 1) dec[2] = 0
  // encode back
  return tonalPitch.encode(dec[0], dec[1], dec[2], tonalPitch.dir(i))
})

exports.toInterval = toInterval;
exports.num = num;
exports.value = value;
exports.props = props;
exports.fromProps = fromProps;
exports.semitones = semitones;
exports.fromSemitones = fromSemitones;
exports.ic = ic;
exports.type = type;
exports.invert = invert;
exports.simplify = simplify;
},{"interval-notation":23,"tonal-pitch":29}],23:[function(require,module,exports){
'use strict'

// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Parse a string with an interval in shorthand notation (https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * and returns an object with interval properties.
 *
 * @param {String} str - the string with the interval
 * @param {Boolean} strict - (Optional) if its false, it doesn't check if the
 * interval is valid or not. For example, parse('P2') returns null
 * (because a perfect second is not a valid interval), but
 * parse('P2', false) it returns { num: 2, dir: 1, q: 'P'... }
 * @return {Object} an object properties or null if not valid interval string
 * The returned object contains:
 * - `num`: the interval number
 * - `q`: the interval quality string (M is major, m is minor, P is perfect...)
 * - `simple`: the simplified number (from 1 to 7)
 * - `dir`: the interval direction (1 ascending, -1 descending)
 * - `type`: the interval type (P is perfectable, M is majorable)
 * - `alt`: the alteration, a numeric representation of the quality
 * - `oct`: the number of octaves the interval spans. 0 for simple intervals.
 * - `size`: the size of the interval in semitones
 * @example
 * var parse = require('interval-notation').parse
 * parse('M3')
 * // => { num: 3, q: 'M', dir: 1, simple: 3,
 * //      type: 'M', alt: 0, oct: 0, size: 4 }
 */
function parse (str, strict) {
  if (typeof str !== 'string') return null
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var i = { num: +(m[3] || m[8]), q: m[4] || m[6] }
  i.dir = (m[2] || m[7]) === '-' ? -1 : 1
  var step = (i.num - 1) % 7
  i.simple = step + 1
  i.type = TYPES[step]
  i.alt = qToAlt(i.type, i.q)
  i.oct = Math.floor((i.num - 1) / 7)
  i.size = i.dir * (SIZES[step] + i.alt + 12 * i.oct)
  if (strict !== false) {
    if (i.type === 'M' && i.q === 'P') return null
  }
  return i
}
var SIZES = [0, 2, 4, 5, 7, 9, 11]

var TYPES = 'PMMPPMM'
/**
 * Get the type of interval. Can be perfectavle ('P') or majorable ('M')
 * @param {Integer} num - the interval number
 * @return {String} `P` if it's perfectable, `M` if it's majorable.
 */
function type (num) {
  return TYPES[(num - 1) % 7]
}

function dirStr (dir) { return dir === -1 ? '-' : '' }
function num (simple, oct) { return simple + 7 * oct }

/**
 * Build a shorthand interval notation string from properties.
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.shorthand(3, 0, 0, 1) // => 'M3'
 * interval.shorthand(3, -1, 0, -1) // => 'm-3'
 * interval.shorthand(3, 1, 1, 1) // => 'A10'
 */
function shorthand (simple, alt, oct, dir) {
  return altToQ(simple, alt) + dirStr(dir) + num(simple, oct)
}
/**
 * Build a special shorthand interval notation string from properties.
 * The special shorthand interval notation changes the order or the standard
 * shorthand notation so instead of 'M-3' it returns '-3M'.
 *
 * The standard shorthand notation has a string 'A4' (augmented four) that can't
 * be differenciate from 'A4' (the A note in 4th octave), so the purpose of this
 * notation is avoid collisions
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.build(3, 0, 0, 1) // => '3M'
 * interval.build(3, -1, 0, -1) // => '-3m'
 * interval.build(3, 1, 1, 1) // => '10A'
 */
function build (simple, alt, oct, dir) {
  return dirStr(dir) + num(simple, oct) + altToQ(simple, alt)
}

/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {Integer|String} num - the interval number or a string representing
 * the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qToAlt('M', 'P') // => null (majorables can't be perfect)
 */
function qToAlt (num, q) {
  var t = typeof num === 'number' ? type(num) : num
  if (q === 'M' && t === 'M') return 0
  if (q === 'P' && t === 'P') return 0
  if (q === 'm' && t === 'M') return -1
  if (/^A+$/.test(q)) return q.length
  if (/^d+$/.test(q)) return t === 'P' ? -q.length : -q.length - 1
  return null
}

function fillStr (s, n) { return Array(Math.abs(n) + 1).join(s) }
/**
 * Get interval quality from interval type and alteration
 *
 * @function
 * @param {Integer|String} num - the interval number of the the interval
 * type ('M' for majorables, 'P' for perfectables)
 * @param {Integer} alt - the interval alteration
 * @return {String} the quality string
 * @example
 * altToQ('M', 0) // => 'M'
 */
function altToQ (num, alt) {
  var t = typeof num === 'number' ? type(Math.abs(num)) : num
  if (alt === 0) return t === 'M' ? 'M' : 'P'
  else if (alt === -1 && t === 'M') return 'm'
  else if (alt > 0) return fillStr('A', alt)
  else if (alt < 0) return fillStr('d', t === 'P' ? alt : alt + 1)
  else return null
}

module.exports = { parse: parse, type: type,
  altToQ: altToQ, qToAlt: qToAlt,
  build: build, shorthand: shorthand }

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var parser = _interopDefault(require('note-parser'));

/**
 * Convert the given note to a midi note number. If you pass a midi number it
 * will returned as is.
 *
 * @param {Array|String|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi.toMidi('C4') // => 60
 * midi.toMidi(60) // => 60
 * midi.toMidi('60') // => 60
 */
function toMidi (val) {
  if (Array.isArray(val) && val.length === 2) return val[0] * 7 + val[1] * 12 + 12
  return parser.midi(val)
}

var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * var midi = require('tonal-midi')
 * midi.note(61) // => 'Db4'
 * midi.note(61, true) // => 'C#4'
 * // it rounds to nearest note
 * midi.note(61.7) // => 'D4'
 */
function note (num, sharps) {
  if (num === true || num === false) return function (m) { return note(m, num) }
  num = Math.round(num)
  var pcs = sharps === true ? SHARPS : FLATS
  var pc = pcs[num % 12]
  var o = Math.floor(num / 12) - 1
  return pc + o
}

exports.toMidi = toMidi;
exports.note = note;
},{"note-parser":25}],25:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Functions related to music notation in strings. Things like parse accidentals,
 * or convert from step to note letter.
 *
 * Glossary:
 *
 * - step: the number from 0 to 6 representing the letters from C to B
 * - letter: a valid note letter (from A to G)
 * - alteration: a number indicating the sharps (positive) or flats (negative)
 * - accidentals: a string with sharps (#) or flats (b)
 *
 * @example
 * var notation = require('tonal-notation')
 * notation.toAcc('3') // => '###'
 * notation.toAcc('-3') // => 'bbb'
 * notation.toAlt('###') // => 3
 * @module notation
 */

/**
 * Given a letter, return step
 * @param {String} letter - the letter
 * @return {Integer} the step number (from 0 to 6)
 */
function toStep (l) {
  var s = 'CDEFGAB'.indexOf(l.toUpperCase())
  return s < 0 ? null : s
}

/**
 * Test if a number is a valid step number (a number from 0 to 6)
 * @param {Integer} step - the step number
 * @return {Boolean} true if it's a valid step number, false otherwise
 */
function isStep (d) { return !(d < 0 || d > 6) }

/**
 * Given a step, return a letter
 * @param {Integer} step - the step number
 * @return {String} the note letter or null if not valid step number
 */
function toLetter (s) {
  return isStep(s) ? 'CDEFGAB'.charAt(s) : null
}

// ACCIDENTALS
// ===========

/**
 * Test if a string are all flats (`b`) chars
 * @param {String} str - the string to test
 * @return {Boolean} true if all charaters are `b`, false otherwise
 */
function areFlats (s) { return /^b+$/.test(s) }
/**
 * Test if a string are all sharps (`#`) chars
 * @param {String} str - the string to test
 * @return {Boolean} true if all charaters are `#`, false otherwise
 */
function areSharps (s) { return /^#+$/.test(s) }

/**
 * Given an accidentals string return its alteration, the number
 * of semitones (positive for sharps, negative for flats, 0 for none)
 * @param {String} accidentals - the string to parse
 * @return {Integer} the alteration number of null if not a valid accidental strings
 * @example
 * toAlt('###') // => 3
 * toAlt('bbb') // => -3
 */
function toAlt (s) {
  return s === '' ? 0
    : areFlats(s) ? -s.length
    : areSharps(s) ? s.length
    : null
}

function fillStr (s, num) { return Array(num + 1).join(s) }

/**
 * Given an alteration number, returns the accidentals string
 * @param {Integer} alteration - the number of semitones (positive and negative
 * values are accepted for sharps and flats)
 * @return {String} the accidental string
 * @example
 * toAcc(3) // => '###'
 * toAcc(-3) // => 'bbb'
 */
function toAcc (n) {
  return !n ? '' : n < 0 ? fillStr('b', -n) : fillStr('#', n)
}

exports.toStep = toStep;
exports.isStep = isStep;
exports.toLetter = toLetter;
exports.areFlats = areFlats;
exports.areSharps = areSharps;
exports.toAlt = toAlt;
exports.toAcc = toAcc;
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var noteParser = require('note-parser');
var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');
var tonalMidi = require('tonal-midi');
var tonalFreq = require('tonal-freq');

/**
 * Get the note midi number
 * (an alias of tonal-midi `toMidi` function)
 *
 * @function
 * @param {Array|String|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * note.midi('C4') // => 60
 * @see midi.toMidi
 */
var midi = tonalMidi.toMidi

/**
 * Get the note name of a given midi note number
 * (an alias of tonal-midi `note` function)
 *
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * note.fromMidi(60) // => 'C4'
 * @see midi.note
 */
var fromMidi = tonalMidi.note

/**
 * Get the frequency of a note
 * (an alias of the tonal-freq package `toFreq` function)
 *
 * @function
 * @param {Array|String|Number} note - the note to get the frequency
 * @return {Number} the frequency
 * @example
 * note.freq('A4') // => 440
 * @see freq.toFreq
 */
var freq = tonalFreq.toFreq

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {String|Pitch} note
 * @return {Integer} the chroma
 * @example
 * var note = require('tonal-note')
 * note.chroma('Cb') // => 11
 * ['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
 */
function chroma (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.chr(p) : null
}

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 *
 * @example
 * var note = require('tonal-note')
 * note.note('cb2') // => 'Cb2'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
 */
function note$1 (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote(p) : null
}

/**
 * Get note properties. It returns an object with the following properties:
 *
 * - step: 0 for C, 6 for B. Do not confuse with chroma
 * - alt: 0 for not accidentals, positive sharps, negative flats
 * - oct: the octave number or undefined if a pitch class
 *
 * @param {String|Pitch} note - the note
 * @return {Object} the object with note properties or null if not valid note
 * @example
 * note.props('Db3') // => { step: 1, alt: -1, oct: 3 }
 * note.props('C#') // => { step: 0, alt: 1, oct: undefined }
 */
function props (n) {
  var p = tonalPitch.asNotePitch(n)
  if (!p) return null
  var d = tonalPitch.decode(p)
  return { step: d[0], alt: d[1], oct: d[2] }
}

/**
 * Given a note properties object, return the string representation if
 * scientific notation
 *
 * @param {Object} noteProps - an object with the following attributes:
 * @return {String} the note name
 *
 * - step: a number from 0 to 6 meaning note step letter from 'C' to 'B'
 * - alt: the accidentals as number (0 no accidentals, 1 is '#', 2 is '##', -2 is 'bb')
 * - oct: (Optional) the octave. If not present (or undefined) it returns a pitch class
 *
 * @example
 * note.fromProps({ step: 1, alt: -1, oct: 5 }) // => 'Db5'
 * note.fromProps({ step: 0, alt: 1 }) // => 'C#'
 */
function fromProps (props) {
  return props ? noteParser.build(props.step, props.alt, props.oct) : null
}

function getProp (name) {
  return function (n) { var p = props(n); return p ? p[name] : null }
}

/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {String|Pitch} note - the note
 * @return {Integer} the octave, undefined if its a pitch class or null if
 * not a valid note
 * @example
 * note.oct('C#4') // => 4
 * note.oct('C') // => undefined
 * note.oct('blah') // => undefined
 */
var oct = getProp('oct')

/**
 * Get the note step: a number equivalent of the note letter. 0 means C and
 * 6 means B. This is different from `chroma` (see example)
 *
 * @function
 * @param {String|Pitch} note - the note
 * @return {Integer} a number between 0 and 6 or null if not a note
 * @example
 * note.step('C') // => 0
 * note.step('Cb') // => 0
 * // usually what you need is chroma
 * note.chroma('Cb') // => 6
 */
var step = getProp('step')

/**
 * Get the note step in fifths from 'C'. One property of the perfect fifht
 * interval is that you can obtain any pitch class by transposing 'C' a
 * number of times. This function return that number.
 * @param {String|Pitch} note - the note (can be a pitch class)
 * @return {Integer} the number of fifths to reach that pitch class from 'C'
 */
function pcFifths (note) {
  var p = tonalPitch.asNotePitch(note)
  return p ? tonalPitch.fifths(p) : null
}

/**
 * Get the note alteration: a number equivalent to the accidentals. 0 means
 * no accidentals, negative numbers are for flats, positive for sharps
 *
 * @function
 * @param {String|Pitch} note - the note
 * @return {Integer} the alteration
 * @example
 * note.alt('C') // => 0
 * note.alt('C#') // => 1
 * note.alt('Cb') // => -1
 */
var alt = getProp('alt')

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 * tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
 */
function pc (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote([ p[0], [ tonalPitch.fifths(p) ] ]) : null
}

var ASC = tonalPitch.parseIvl('2d')
var DESC = tonalPitch.parseIvl('-2d')

/**
 * Get the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
 * @param {String} note - the note to get the enharmonics from
 * @return {Array} an array of pitches ordered by distance to the given one
 *
 * @example
 * var note = require('tonal-note')
 * note.enharmonics('C') // => ['B#', 'C', 'Dbb']
 * note.enharmonics('A') // => ['G##', 'A', 'Bbb']
 * note.enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
 * note.enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
 */
function enharmonics (pitch) {
  var notes = []
  notes.push(tonalTranspose.transpose(DESC, pitch))
  if (notes[0] === null) return null
  notes.push(pitch)
  notes.push(tonalTranspose.transpose(ASC, pitch))
  return notes
}

/**
 * Get a simpler enharmonic note name from a note if exists
 *
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (if not found, return same note)
 *
 * @example
 * var note = require('tonal-note')
 * note.simplify('B#3') // => 'C4'
 */
function simplify (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}

exports.midi = midi;
exports.fromMidi = fromMidi;
exports.freq = freq;
exports.chroma = chroma;
exports.note = note$1;
exports.props = props;
exports.fromProps = fromProps;
exports.oct = oct;
exports.step = step;
exports.pcFifths = pcFifths;
exports.alt = alt;
exports.pc = pc;
exports.enharmonics = enharmonics;
exports.simplify = simplify;
},{"note-parser":28,"tonal-freq":20,"tonal-midi":24,"tonal-pitch":29,"tonal-transpose":39}],28:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var noteParser = require('note-parser');
var intervalNotation = require('interval-notation');
var tonalEncoding = require('tonal-encoding');

/**
 * Create a pitch
 * @param {Integer} fifths - the number of fifths from C or from P1
 * @param {Integer} focts - the number of encoded octaves
 * @param {Integer} dir - (Optional) Only required for intervals. Can be 1 or -1
 * @return {Pitch}
 */
function pitch (fifths, focts, dir) {
  return dir ? ['tnlp', [fifths, focts], dir] : ['tnlp', [fifths, focts]]
}
/**
 * Test if an object is a pitch
 * @param {Pitch}
 * @return {Boolean}
 */
function isPitch (p) { return Array.isArray(p) && p[0] === 'tnlp' }
/**
 * Encode a pitch
 * @param {Integer} step
 * @param {Integer} alt
 * @param {Integer} oct
 * @param {Integer} dir - (Optional)
 */
function encode$1 (s, a, o, dir) {
  return dir ? ['tnlp', tonalEncoding.encode(s, a, o), dir] : ['tnlp', tonalEncoding.encode(s, a, o)]
}

/**
 * Decode a pitch
 * @param {Pitch} the pitch
 * @return {Array} An array with [step, alt, oct]
 */
function decode$1 (p) {
  return tonalEncoding.decode.apply(null, p[1])
}

/**
 * Get pitch type
 * @param {Pitch}
 * @return {String} 'ivl' or 'note' or null if not a pitch
 */
function pType (p) {
  return !isPitch(p) ? null : p[2] ? 'ivl' : 'note'
}
/**
 * Test if is a pitch note (with or without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isNotePitch (p) { return pType(p) === 'note' }
/**
 * Test if is an interval
 * @param {Pitch}
 * @return {Boolean}
 */
function isIvlPitch (p) { return pType(p) === 'ivl' }
/**
 * Test if is a pitch class (a pitch note without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isPC (p) { return isPitch(p) && p[1].length === 1 }

/**
 * Get direction of a pitch (even for notes)
 * @param {Pitch}
 * @return {Integer} 1 or -1
 */
function dir (p) { return p[2] === -1 ? -1 : 1 }

/**
 * Get encoded fifths from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
/**
 * Get encoded octaves from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
/**
 * Get height of a pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function height (p) { return fifths(p) * 7 + focts(p) * 12 }

/**
 * Get chroma of a pitch. The chroma is a number between 0 and 11 to represent
 * the position of a pitch inside an octave. Is the numeric equivlent of a
 * pitch class.
 *
 * @param {Pitch}
 * @return {Integer}
 */
function chr (p) {
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

// memoize parsers
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = fn(str))
  }
}

/**
 * Parse a note
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid note string
 */
var parseNote = memoize(function (s) {
  var p = noteParser.parse(s)
  return p ? encode$1(p.step, p.alt, p.oct) : null
})

/**
 * Parse an interval
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid interval string
 */
var parseIvl = memoize(function (s) {
  var p = intervalNotation.parse(s)
  if (!p) return null
  return p ? encode$1(p.simple - 1, p.alt, p.oct, p.dir) : null
})

/**
 * Parse a note or an interval
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid pitch string
 */
function parsePitch (s) { return parseNote(s) || parseIvl(s) }

/**
 * Ensure the given object is a note pitch. If is a string, it will be
 * parsed. If not a note pitch or valid note string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
/**
 * Ensure the given object is a interval pitch. If is a string, it will be
 * parsed. If not a interval pitch or valid interval string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
/**
 * Ensure the given object is a pitch. If is a string, it will be
 * parsed. If not a pitch or valid pitch string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

/**
 * Convert a note pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strNote (p) {
  if (!isNotePitch(p)) return null
  return noteParser.build.apply(null, decode$1(p))
}

/**
 * Convert a interval pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strIvl (p) {
  if (!isIvlPitch(p)) return null
  // decode to [step, alt, oct]
  var d = decode$1(p)
  // d = [step, alt, oct]
  var num = d[0] + 1 + 7 * d[2]
  return p[2] * num + intervalNotation.altToQ(num, d[1])
}

/**
 * Convert a pitch to string representation (either notes or intervals)
 * @param {Pitch}
 * @return {String}
 */
function strPitch (p) { return strNote(p) || strIvl(p) }

// A function that creates a decorator
// The returned function can _decorate_ other functions to parse and build
// string representations
function decorator (is, parse, str) {
  return function (fn) {
    return function (v) {
      var i = is(v)
      // if the value is in pitch notation no conversion
      if (i) return fn(v)
      // else parse the pitch
      var p = parse(v)
      // if parsed, apply function and back to string
      return p ? str(fn(p)) : null
    }
  }
}

/**
 * Decorate a function to work internally with note pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a note pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var noteFn = decorator(isNotePitch, parseNote, strNote)
/**
 * Decorate a function to work internally with interval pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a interval pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
/**
 * Decorate a function to work internally with pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var pitchFn = decorator(isPitch, parsePitch, strPitch)

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.encode = encode$1;
exports.decode = decode$1;
exports.pType = pType;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPC = isPC;
exports.dir = dir;
exports.fifths = fifths;
exports.focts = focts;
exports.height = height;
exports.chr = chr;
exports.parseNote = parseNote;
exports.parseIvl = parseIvl;
exports.parsePitch = parsePitch;
exports.asNotePitch = asNotePitch;
exports.asIvlPitch = asIvlPitch;
exports.asPitch = asPitch;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.strPitch = strPitch;
exports.noteFn = noteFn;
exports.ivlFn = ivlFn;
exports.pitchFn = pitchFn;
},{"interval-notation":30,"note-parser":31,"tonal-encoding":19}],30:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],31:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');
var tonalNote = require('tonal-note');
var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');

function toInt (set) { return parseInt(chroma(set), 2) }
function pitchChr (p) { p = tonalPitch.asPitch(p); return p ? tonalPitch.chr(p) : null }

/**
 * Given a list of notes, return the notes of the pitchset
 * starting with the first note of the list
 */
function notes (notes) {
  var pcs = tonalArray.map(tonalNote.pc, notes)
  if (!pcs.length) return pcs
  var tonic = pcs[0]
  // since the first note of the chroma is always C, we have to rotate it
  var rotated = tonalArray.rotate(pitchChr(tonic), chroma(pcs).split('')).join('')
  return fromChroma(rotated, tonic)
}

/**
 * Given a pitch set (a list of notes or a pitch set chroma), produce the 12 rotations
 * of the chroma (and discard the ones that starts with '0')
 *
 * This can be used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with '0'
 */
function rotations (set, normalize) {
  normalize = normalize !== false
  var binary = chroma(set).split('')
  return tonalArray.compact(binary.map(function (_, i) {
    var r = tonalArray.rotate(i, binary)
    return normalize && r[0] === '0' ? null : r.join('')
  }))
}

var REGEX = /^[01]{12}$/

/**
 * Test if the given string is a pitch set chroma.
 * @param {String} chroma - the pitch set chroma
 * @return {Boolean} true if its a valid pitchset chroma
 * @example
 * pitchset.isChroma('101010101010') // => true
 * pitchset.isChroma('101001') // => false
 */
function isChroma (set) {
  return REGEX.test(set)
}

/**
 * Get chroma of a pitch set. A chroma identifies each pitch set uniquely.
 * It's a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch set
 * @return {String} a binary representation of the pitch set
 * @example
 * pitchset.chroma('C D E') // => '1010100000000'
 */
function chroma (set) {
  if (isChroma(set)) return set
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  tonalArray.map(pitchChr, set).forEach(function (i) {
    b[i] = 1
  })
  return b.join('')
}

/**
 * Get a pitch set with different tonic
 * @param {String|Pitch} tonic - the desired tonic
 * @param {Array|String} set - the list of notes or the binary representation
 * @param {Array} a list of notes or intervals (depending the root)
 * @example
 * pitchset.withTonic('c d e f g a b', 'D')
 */
function withTonic (tonic, set) {
  if (arguments.length === 1) return function (s) { return withTonic(tonic, s) }
  return fromChroma(chroma(set), tonic)
}

var IVLS = '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' ')
/**
 * Given a pitch set in binary notation it returns the intervals or notes
 * (depending on the tonic)
 * @param {String} binary - the pitch set in binary representation
 * @param {String|Pitch} tonic - the pitch set tonic
 * @return {Array} a list of notes or intervals
 * @example
 * pitchset.fromChroma('101010101010', 'C') // => ['C', 'D', 'E', 'Gb', 'Ab', 'Bb']
 */
function fromChroma (binary, tonic) {
  if (arguments.length === 1) return function (t) { return fromChroma(binary, t) }
  if (!isChroma(binary)) return null

  tonic = tonic || 'P1'
  return tonalArray.compact(binary.split('').map(function (d, i) {
    return d === '1' ? tonalTranspose.transpose(IVLS[i], tonic) : null
  }))
}

/**
 * Test if two pitch sets are identical
 *
 * @param {Array|String} set1 - one of the pitch sets
 * @param {Array|String} set2 - the other pitch set
 * @return {Boolean} true if they are equal
 * @example
 * pitchset.equal('c2 d3', 'c5 d2') // => true
 */
function equal (s1, s2) {
  if (arguments.length === 1) return function (s) { return equal(s1, s) }
  return chroma(s1) === chroma(s2)
}

/**
 * Test if a pitch set is a subset of another
 *
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a subset of the set
 * @example
 * pitchset.subset('c d e', 'C2 D4 D5 C6') // => true
 */
function subset (set, test) {
  if (arguments.length === 1) return function (t) { return subset(set, t) }
  test = toInt(test)
  return (test & toInt(set)) === test
}

/**
 * Test if a pitch set is a superset
 * @param {Array|String} set - the base set to test against
 * @param {Array|String} test - the set to test
 * @return {Boolean} true if the test set is a superset of the set
 * @example
 * pitchset.subset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
 */
function superset (set, test) {
  if (arguments.length === 1) return function (t) { return superset(set, t) }
  test = toInt(test)
  return (test | toInt(set)) === test
}

/**
 * Test if a given pitch set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pitchset
 * @example
 * pitchset.includes('c d e', 'C4') // =A true
 * pitchset.includes('c d e', 'C#4') // =A false
 */
function includes (set, note) {
  if (arguments.length > 1) return includes(set)(note)
  set = chroma(set)
  return function (note) { return set[pitchChr(note)] === '1' }
}

/**
 * Filter a list with a pitch set
 *
 * @param {Array|String} set - the pitch set
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * pitchset.filter('c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
 */
function filter (set, notes) {
  if (arguments.length === 1) return function (n) { return filter(set, n) }
  return tonalArray.asArr(notes).filter(includes(set))
}

exports.notes = notes;
exports.rotations = rotations;
exports.isChroma = isChroma;
exports.chroma = chroma;
exports.withTonic = withTonic;
exports.fromChroma = fromChroma;
exports.equal = equal;
exports.subset = subset;
exports.superset = superset;
exports.includes = includes;
exports.filter = filter;
},{"tonal-array":12,"tonal-note":1,"tonal-pitch":29,"tonal-transpose":39}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalInterval = require('tonal-interval');
var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');
var tonalDistance = require('tonal-distance');
var tonalChord = require('tonal-chord');
var tonalNotation = require('tonal-notation');

/**
 * Given a chord progression and a tonic, return the chord progression
 * with roman numeral chords.
 *
 * @param {Array|String} chords - the chord progression
 * @param {String} tonic - the tonic
 * @return {Array} the chord progression in roman numerals
 * @example
 * progression.abstract('Cmaj7 Dm7 G7', 'C') // => [ 'Imaj7', 'IIm7', 'V7' ]
 */
function abstract (chords, tonic) {
  tonic = tonalNote.pc(tonic)
  chords = tonalArray.map(tonalChord.parse, chords)
  var tonics = tonalArray.compact(chords.map(function (x) { return x[1] }))
  // if some tonic missing, can't do the analysis
  if (tonics.length !== chords.length) return null

  return tonics.map(function (t, i) {
    var p = tonalInterval.props(tonalDistance.interval(tonic, t))
    return buildRoman(p.num - 1, p.alt, chords[i][0])
  })
}

var NUMS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
/**
 * Build an abstract chord name using roman numerals
 */
function buildRoman (num, alt, element) {
  return tonalNotation.toAcc(alt) + NUMS[num % 7] + (element || '')
}

/**
 * Get chord progression from a tonic and a list of chord in roman numerals
 *
 * @param {String} tonic - the tonic
 * @param {Array|String} progression - the progression in roman numerals
 * @return {Array} the chord progression
 *
 * @example
 * var progression = require('chord-progression')
 * progression.concrete('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
 */
function concrete (chords, tonic) {
  return tonalArray.map(function (e) {
    var r = parseRomanChord(e)
    return r ? tonalTranspose.transpose(r.root, tonic) + r.type : null
  }, chords)
}

var ROMAN = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/
/**
 * Returns a regex to match roman numbers literals with the from:
 * `[accidentals]roman[element]`.
 *
 * The executed regex contains:
 *
 * - input: the input string
 * - accidentals: (Optional) one or two flats (b) or shaprs (#)
 * - roman: (Required) a roman numeral from I to VII either in upper or lower case
 * - element: (Optional) a name of an element
 *
 * @return {RegExp} the regexp
 *
 * @example
 * var r = progression.romanRegex()
 * r.exec('bVImaj7') // => ['bVImaj7', 'b', 'VI', 'maj7'])
 * r.exec('III dom') // => ['III dom', '', 'III', 'dom'])
 */
function romanRegex () { return ROMAN }

var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Parse a chord expressed with roman numerals. It returns an interval representing
 * the root of the chord relative to the key tonic and the chord name.
 *
 * @param {String} str - the roman numeral string
 * @return {Object} the roman chord property object with:
 *
 * - type: the chord type
 * - root: the interval from the key to the root of this chord
 *
 * @example
 * var parse = require('music-notation/roman.parse')
 * parse('V7') // => { root: '5P', type: '7' }
 * parse('bIIalt') // => { root: '2m', type: 'alt' }
 */
function parseRomanChord (str) {
  var m = ROMAN.exec(str)
  if (!m) return null
  var num = NUM[m[2].toLowerCase()] + 1
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return { root: tonalInterval.fromProps({ num: num, alt: alt, dir: 1 }), type: m[3] }
}

exports.abstract = abstract;
exports.buildRoman = buildRoman;
exports.concrete = concrete;
exports.romanRegex = romanRegex;
exports.parseRomanChord = parseRomanChord;
},{"tonal-array":12,"tonal-chord":15,"tonal-distance":18,"tonal-interval":22,"tonal-notation":26,"tonal-note":27,"tonal-transpose":39}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');
var tonalMidi = require('tonal-midi');
var tonalPitchset = require('tonal-pitchset');

function isNum (n) { return typeof n === 'number' }
// convert notes to midi if needed
function asNum (n) { return isNum(n) ? n : tonalMidi.toMidi(n) }
// ascending range
function ascR (b, n) { for (var a = []; n--; a[n] = n + b); return a }
// descending range
function descR (b, n) { for (var a = []; n--; a[n] = b - n); return a }
// create a range between a and b
function ran (a, b) {
  return a === null || b === null ? []
    : a < b ? ascR(a, b - a + 1) : descR(a, a - b + 1)
}

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be conected to create complex ranges.
 *
 * @param {String|Array} list - the list of notes or numbers used
 * @return {Array} an array of numbers or empty array if not vald parameters
 *
 * @example
 * range.numeric('C5 C4') // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works with numbers
 * range.numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * range.numeric('C4 E4 Bb3') // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 * // can be expressed with a string or array
 * range.numeric('C2 C4 C2') === range.numeric(['C2', 'C4', 'C2'])
 */
function numeric (list) {
  return tonalArray.asArr(list).map(asNum).reduce(function (r, n, i) {
    if (i === 1) return ran(r, n)
    var last = r[r.length - 1]
    return r.concat(ran(last, n).slice(1))
  })
}

/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {String|Array} list - the list of notes or midi note numbers
 * @return {Array} an array of note names
 * @example
 * tonal.chromatic('C2 E2 D2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2', 'Eb2', 'D2']
 * // with sharps
 * tonal.chromatic('C2 C3', true) // => [ 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3' ]
 */
function chromatic (list, sharps) {
  return tonalArray.map(tonalMidi.note(sharps === true), numeric(list))
}

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {String|Pitch} tonic - the tonic note or pitch class
 * @param {Array|String} range - the range array
 * @return {Array} a range of cycle of fifths starting with the tonic
 * @example
 * range.fifths('C', [0, 6]) // => [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
 */
function fifths (tonic, range) {
  return numeric(range).map(tonalTranspose.trFifths(tonic))
}

/**
 * Create a pitch set (scale or chord) range. Given a pitch set (a collection
 * of pitch classes), and a range array, it returns a range in notes.
 *
 * @param {String|Array|Function} scale - the scale to use or a function to
 * convert from midi numbers to note names
 * @param {String|Array} range - a list of notes or midi numbers
 * @return {Array} the scale range, an empty array if not valid source or
 * null if not valid start or end
 * @example
 * range.pitchSet('C D E F G A B', ['C3', 'C2'])
 * // => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
 */
function pitchSet (set, range) {
  if (arguments.length === 1) return function (l) { return pitchSet(set, l) }

  return tonalPitchset.filter(set, chromatic(range))
}

exports.numeric = numeric;
exports.chromatic = chromatic;
exports.fifths = fifths;
exports.pitchSet = pitchSet;
},{"tonal-array":12,"tonal-midi":24,"tonal-pitchset":32,"tonal-transpose":39}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var tonalHarmonizer = require('tonal-harmonizer');

var DATA = require('./scales.json')

var dict = tonalDictionary.get(tonalPitch.parseIvl, DATA)

/**
 * Create scales by scale type or intervals and tonic. The returned scale is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the scale type, intervals or notes
 * @param {String} tonic - the scale tonic (or false to get intervals)
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal-scale')
 * // get scale notes using type and tonic
 * scale.build('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get scale intervals (tonic false)
 * scale.build('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * var maj7 = scale.build('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // build scale from intervals
 * scale.build('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return tonalHarmonizer.harmonize(get$1(src) || src, tonic)
}

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * var scale = require('tonal-scale')
 * scale.names() // => ['maj7', ...]
 */
var names = tonalDictionary.keys(DATA)

/**
 * Get scale notes from scale name
 *
 * @param {String} name - the scale name
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal-scale')
 * scale.get('C7') // => ['C', 'E', 'G', 'Bb']
 * scale.get('CMaj7') // => ['C', 'E', 'G', 'B']
 */
function get$1 (name) {
  var i = name.indexOf(' ')
  var tonic = name.substring(0, i)
  return tonalPitch.parseNote(tonic) ? tonalHarmonizer.harmonize(dict(name.substring(i + 1)), tonic)
    : tonalHarmonizer.harmonize(dict(name), false)
}

/**
 * Detect a scale. Given a list of notes, return the scale name(s) if any.
 * It only detects chords with exactly same notes.
 *
 * @function
 * @param {Array|String} notes - the list of notes
 * @return {Array<String>} an array with the possible scales
 * @example
 * scale.detect('b g f# d') // => [ 'GMaj7' ]
 * scale.detect('e c a g') // => [ 'CM6', 'Am7' ]
 */
var detect = tonalDictionary.detector(' ', DATA)

exports.build = build;
exports.names = names;
exports.get = get$1;
exports.detect = detect;
},{"./scales.json":36,"tonal-dictionary":17,"tonal-harmonizer":21,"tonal-pitch":29}],36:[function(require,module,exports){
module.exports={
  "lydian": [ "1P 2M 3M 4A 5P 6M 7M" ],
  "major": [ "1P 2M 3M 4P 5P 6M 7M" , [ "ionian" ] ],
  "mixolydian": [ "1P 2M 3M 4P 5P 6M 7m" , [ "dominant" ] ],
  "dorian": [ "1P 2M 3m 4P 5P 6M 7m" ],
  "aeolian": [ "1P 2M 3m 4P 5P 6m 7m" , [ "minor" ] ],
  "phrygian": [ "1P 2m 3m 4P 5P 6m 7m" ],
  "locrian": [ "1P 2m 3m 4P 5d 6m 7m" ],
  "melodic minor": [ "1P 2M 3m 4P 5P 6M 7M" ],
  "melodic minor second mode": [ "1P 2m 3m 4P 5P 6M 7m" ],
  "lydian augmented": [ "1P 2M 3M 4A 5A 6M 7M" ],
  "lydian dominant": [ "1P 2M 3M 4A 5P 6M 7m" , [ "lydian b7" ] ],
  "melodic minor fifth mode": [ "1P 2M 3M 4P 5P 6m 7m" , [ "hindu", "mixolydian b6M" ] ],
  "locrian #2": [ "1P 2M 3m 4P 5d 6m 7m" ],
  "locrian major": [ "1P 2M 3M 4P 5d 6m 7m" , [ "arabian" ] ],
  "altered": [ "1P 2m 3m 3M 5d 6m 7m" , [ "super locrian", "diminished whole tone", "pomeroy" ] ],
  "major pentatonic": [ "1P 2M 3M 5P 6M" , [ "pentatonic" ] ],
  "lydian pentatonic": [ "1P 3M 4A 5P 7M" , [ "chinese" ] ],
  "mixolydian pentatonic": [ "1P 3M 4P 5P 7m" , [ "indian" ] ],
  "locrian pentatonic": [ "1P 3m 4P 5d 7m" , [ "minor seven flat five pentatonic" ] ],
  "minor pentatonic": [ "1P 3m 4P 5P 7m" ],
  "minor six pentatonic": [ "1P 3m 4P 5P 6M" ],
  "minor hexatonic": [ "1P 2M 3m 4P 5P 7M" ],
  "flat three pentatonic": [ "1P 2M 3m 5P 6M" , [ "kumoi" ] ],
  "flat six pentatonic": [ "1P 2M 3M 5P 6m" ],
  "major flat two pentatonic": [ "1P 2m 3M 5P 6M" ],
  "whole tone pentatonic": [ "1P 3M 5d 6m 7m" ],
  "ionian pentatonic": [ "1P 3M 4P 5P 7M" ],
  "lydian #5P pentatonic": [ "1P 3M 4A 5A 7M" ],
  "lydian dominant pentatonic": [ "1P 3M 4A 5P 7m" ],
  "minor #7M pentatonic": [ "1P 3m 4P 5P 7M" ],
  "super locrian pentatonic": [ "1P 3m 4d 5d 7m" ],
  "in-sen": [ "1P 2m 4P 5P 7m" ],
  "iwato": [ "1P 2m 4P 5d 7m" ],
  "hirajoshi": [ "1P 2M 3m 5P 6m" ],
  "kumoijoshi": [ "1P 2m 4P 5P 6m" ],
  "pelog": [ "1P 2m 3m 5P 6m" ],
  "vietnamese 1": [ "1P 3m 4P 5P 6m" ],
  "vietnamese 2": [ "1P 3m 4P 5P 7m" ],
  "prometheus": [ "1P 2M 3M 4A 6M 7m" ],
  "prometheus neopolitan": [ "1P 2m 3M 4A 6M 7m" ],
  "ritusen": [ "1P 2M 4P 5P 6M" ],
  "scriabin": [ "1P 2m 3M 5P 6M" ],
  "piongio": [ "1P 2M 4P 5P 6M 7m" ],
  "major blues": [ "1P 2M 3m 3M 5P 6M" ],
  "minor blues": [ "1P 3m 4P 5d 5P 7m" , [ "blues" ] ],
  "composite blues": [ "1P 2M 3m 3M 4P 5d 5P 6M 7m" ],
  "augmented": [ "1P 2A 3M 5P 5A 7M" ],
  "augmented heptatonic": [ "1P 2A 3M 4P 5P 5A 7M" ],
  "dorian #4": [ "1P 2M 3m 4A 5P 6M 7m" ],
  "lydian diminished": [ "1P 2M 3m 4A 5P 6M 7M" ],
  "whole tone": [ "1P 2M 3M 4A 5A 7m" ],
  "leading whole tone": [ "1P 2M 3M 4A 5A 7m 7M" ],
  "harmonic minor": [ "1P 2M 3m 4P 5P 6m 7M" ],
  "lydian minor": [ "1P 2M 3M 4A 5P 6m 7m" ],
  "neopolitan": [ "1P 2m 3m 4P 5P 6m 7M" ],
  "neopolitan minor": [ "1P 2m 3m 4P 5P 6m 7M" ],
  "neopolitan major": [ "1P 2m 3m 4P 5P 6M 7M" , [ "dorian b2" ] ],
  "neopolitan major pentatonic": [ "1P 3M 4P 5d 7m" ],
  "romanian minor": [ "1P 2M 3m 5d 5P 6M 7m" ],
  "double harmonic lydian": [ "1P 2m 3M 4A 5P 6m 7M" ],
  "diminished": [ "1P 2M 3m 4P 5d 6m 6M 7M" ],
  "harmonic major": [ "1P 2M 3M 4P 5P 6m 7M" ],
  "double harmonic major": [ "1P 2m 3M 4P 5P 6m 7M" , [ "gypsy" ] ],
  "egyptian": [ "1P 2M 4P 5P 7m" ],
  "hungarian minor": [ "1P 2M 3m 4A 5P 6m 7M" ],
  "hungarian major": [ "1P 2A 3M 4A 5P 6M 7m" ],
  "oriental": [ "1P 2m 3M 4P 5d 6M 7m" ],
  "spanish": [ "1P 2m 3M 4P 5P 6m 7m" , [ "phrygian major" ] ],
  "spanish heptatonic": [ "1P 2m 3m 3M 4P 5P 6m 7m" ],
  "flamenco": [ "1P 2m 3m 3M 4A 5P 7m" ],
  "balinese": [ "1P 2m 3m 4P 5P 6m 7M" ],
  "todi raga": [ "1P 2m 3m 4A 5P 6m 7M" ],
  "malkos raga": [ "1P 3m 4P 6m 7m" ],
  "kafi raga": [ "1P 3m 3M 4P 5P 6M 7m 7M" ],
  "purvi raga": [ "1P 2m 3M 4P 4A 5P 6m 7M" ],
  "persian": [ "1P 2m 3M 4P 5d 6m 7M" ],
  "bebop": [ "1P 2M 3M 4P 5P 6M 7m 7M" ],
  "bebop dominant": [ "1P 2M 3M 4P 5P 6M 7m 7M" ],
  "bebop minor": [ "1P 2M 3m 3M 4P 5P 6M 7m" ],
  "bebop major": [ "1P 2M 3M 4P 5P 5A 6M 7M" ],
  "bebop locrian": [ "1P 2m 3m 4P 5d 5P 6m 7m" ],
  "minor bebop": [ "1P 2M 3m 4P 5P 6m 7m 7M" ],
  "mystery #1": [ "1P 2m 3M 5d 6m 7m" ],
  "enigmatic": [ "1P 2m 3M 5d 6m 7m 7M" ],
  "minor six diminished": [ "1P 2M 3m 4P 5P 6m 6M 7M" ],
  "ionian augmented": [ "1P 2M 3M 4P 5A 6M 7M" ],
  "lydian #9": [ "1P 2m 3M 4A 5P 6M 7M" ],
  "ichikosucho": [ "1P 2M 3M 4P 5d 5P 6M 7M" ],
  "six tone symmetric": [ "1P 2m 3M 4P 5A 6M" ]
}

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalInterval = require('tonal-interval');
var tonalPitch = require('tonal-pitch');
var tonalArray = require('tonal-array');

/**
 * Get the intervals analysis of a collection of notes
 *
 * Returns an array with the format `[p, m, n, s, d, t]` where:
 *
 * - p: the number of perfect fourths or fifths
 * - m: the number of major thirds or minor sixths
 * - n: the number of major sixths or minor thirds
 * - s: the number of major seconds or minor sevenths
 * - d: the number of major sevents or minor seconds
 * - t: the number of tritones
 *
 * This is, mostly, an academic puzzle to show the expresiveness of tonal.
 * Implements the ideas found in "The Analysis of Intervals" chapter from
 * [Harmonic Materials of Modern Music]():
 *
 * > The letters _pmn_, therefore, represent intervals commonly considered
 * consonant, whereas the letters _sdt_ represent the intervals commonly
 * considered dissonant. (...) A sonority represented, for example, by the
 * symbol `sd^2`, indicating a triad composed of one major second and two minor
 * seconds, would be recognized as a highly dissonant sound, while the symbol
 * `pmn` would indicate a consonant sound.
 *
 * @param {Array|String} notes - the notes to analyze
 * @return {Array} the _pmnsdt_ array
 */
function density (list) {
  var a, b, i
  var notes = tonalArray.compact(tonalArray.map(tonalPitch.asNotePitch, list))
  var len = notes.length
  var result = [0, 0, 0, 0, 0, 0]
  for (a = 0; a < len; a++) {
    for (b = a; b < len; b++) {
      i = tonalInterval.ic(tonalPitch.chr(notes[b]) - tonalPitch.chr(notes[a]))
      if (i === 6) result[5] = result[5] + 1
      else if (i > 0) result[5 - i] = result[5 - i] + 1
    }
  }
  return result
}

exports.density = density;
},{"tonal-array":12,"tonal-interval":22,"tonal-pitch":29}],38:[function(require,module,exports){
'use strict'
/**
 * The `tonal` module is a facade to all the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `tonal.note.pc`
 *
 * Some modules are NOT namespaced for developer comfort:
 *
 * - `tonal-array`: for example `tonal.map(tonal.note.pc, 'C#2')`
 * - `tonal-transpose`: for example `tonal.transpose('C', '3M')`
 * - `tonal-distance`: for example `tonal.interval('C3', 'G4')`
 *
 * It also adds a couple of function aliases:
 *
 * - `tonal.scale` is an alias for `tonal.scale.get`
 * - `tonal.chord` is an alias for `tonal.chord.get`
 *
 * @example
 * var tonal = require('tonal')
 * tonal.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */

var assign = Object.assign
var tonal = {}

assign(tonal, require('tonal-array'))
assign(tonal, require('tonal-transpose'))
assign(tonal, require('tonal-distance'))

tonal.note = require('tonal-note')
tonal.ivl = require('tonal-interval')
tonal.midi = require('tonal-midi')
tonal.freq = require('tonal-freq')
tonal.range = require('tonal-range')

tonal.scale = function (name) { return tonal.scale.get(name) }
assign(tonal.scale, require('tonal-scale'))
tonal.chord = function (name) { return tonal.chord.get(name) }
assign(tonal.chord, require('tonal-chord'))

tonal.pitch = require('tonal-pitch')
tonal.notation = require('tonal-notation')
tonal.progression = require('tonal-progression')
tonal.sonority = require('tonal-sonority')

if (typeof module === 'object' && module.exports) module.exports = tonal
if (typeof window !== 'undefined') window.Tonal = tonal

},{"tonal-array":12,"tonal-chord":15,"tonal-distance":18,"tonal-freq":20,"tonal-interval":22,"tonal-midi":24,"tonal-notation":26,"tonal-note":27,"tonal-pitch":29,"tonal-progression":33,"tonal-range":34,"tonal-scale":35,"tonal-sonority":37,"tonal-transpose":39}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');

function trBy (i, p) {
  var t = tonalPitch.pType(p)
  if (!t) return null
  var f = tonalPitch.fifths(i) + tonalPitch.fifths(p)
  if (tonalPitch.isPC(p)) return ['tnlp', [f]]
  var o = tonalPitch.focts(i) + tonalPitch.focts(p)
  if (t === 'note') return ['tnlp', [f, o]]
  var d = tonalPitch.height(i) + tonalPitch.height(p) < 0 ? -1 : 1
  return ['tnlp', [d * f, d * o], d]
}

/**
 * Transpose notes. Can be used to add intervals. At least one of the parameter
 * is expected to be an interval. If not, it returns null.
 *
 * @param {String|Pitch} a - a note or interval
 * @param {String|Pitch} b - a note or interavl
 * @return {String|Pitch} the transposed pitch or null if not valid parameters
 * @example
 * var _ = require('tonal')
 * // transpose a note by an interval
 * _.transpose('d3', '3M') // => 'F#3'
 * // transpose intervals
 * _.transpose('3m', '5P') // => '7m'
 * // it works with pitch classes
 * _.transpose('d', '3M') // => 'F#'
 * // order or parameters is irrelevant
 * _.transpose('3M', 'd3') // => 'F#3'
 * // can be partially applied
 * _.map(_.transpose('3M'), 'c d e f g') // => ['E', 'F#', 'G#', 'A', 'B']
 */
function transpose (a, b) {
  if (arguments.length === 1) return function (b) { return transpose(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var r = tonalPitch.isIvlPitch(pa) ? trBy(pa, pb)
    : tonalPitch.isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : tonalPitch.strPitch(r)
}

/**
 * Transpose a tonic a number of perfect fifths. It can be partially applied.
 *
 * @function
 * @param {Pitch|String} tonic
 * @param {Integer} number - the number of times
 * @return {String|Pitch} the transposed note
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D5'
 */
function trFifths (t, n) {
  if (arguments.length > 1) return trFifths(t)(n)
  return function (n) {
    return transpose(t, tonalPitch.pitch(n, 0, 1))
  }
}

exports.transpose = transpose;
exports.trFifths = trFifths;
},{"tonal-pitch":29}]},{},[38]);
