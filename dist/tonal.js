(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var tonalNote = require('tonal-note');
var tonalMidi = require('tonal-midi');
var tonalFreq = require('tonal-freq');
var tonalTranspose = require('tonal-transpose');
var tonalDistance = require('tonal-distance');
var tonalArray = require('tonal-array');



exports.noteName = tonalNote.noteName;
exports.chroma = tonalNote.chroma;
exports.pc = tonalNote.pc;
exports.enharmonics = tonalNote.enharmonics;
exports.enh = tonalNote.enh;
exports.simpleEnh = tonalNote.simpleEnh;
exports.isMidiNum = tonalMidi.isMidiNum;
exports.toMidi = tonalMidi.toMidi;
exports.fromMidi = tonalMidi.fromMidi;
exports.fromMidiS = tonalMidi.fromMidiS;
exports.toEqualTemp = tonalFreq.toEqualTemp;
exports.toFreq = tonalFreq.toFreq;
exports.midiFromFreq = tonalFreq.midiFromFreq;
exports.fromFreq = tonalFreq.fromFreq;
exports.cents = tonalFreq.cents;
exports.fromEqualTemp = tonalFreq.fromEqualTemp;
exports.transpose = tonalTranspose.transpose;
exports.tr = tonalTranspose.tr;
exports.trFifths = tonalTranspose.trFifths;
exports.distance = tonalDistance.distance;
exports.interval = tonalDistance.interval;
exports.asArr = tonalArray.asArr;
exports.map = tonalArray.map;
exports.filter = tonalArray.filter;
exports.listFn = tonalArray.listFn;
exports.harmonizer = tonalArray.harmonizer;
exports.harmonize = tonalArray.harmonize;
exports.sort = tonalArray.sort;
exports.suffle = tonalArray.suffle;
},{"tonal-array":2,"tonal-distance":8,"tonal-freq":14,"tonal-midi":15,"tonal-note":21,"tonal-transpose":27}],2:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');
var tonalNotation = require('tonal-notation');
var tonalTranspose = require('tonal-transpose');

function id (x) { return x }

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/

/**
 * Convert anything to array. Speifically, split string separated by spaces,
 * commas or bars. The arrays are passed without modifications and the rest of
 * the objects are wrapped.
 *
 * This function always returns an array (null or undefined values are converted
 * to empty arrays)
 *
 * Thanks to this function, the rest of the functions of this module accepts
 * any object (or more useful: strings) as an array parameter.
 *
 * @param {*} source - the thing to get an array from
 * @return {Array} the object as an array
 *
 * @example
 * import { asArr } from 'tonal-arrays'
 * asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
 */
function asArr (src) {
  return tonalNotation.isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

/**
 * Map an array with a function. Basically the same as the JavaScript standard
 * `array.map` but with two enhacements:
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
 * Filter an array with a function. Again, almost the same as JavaScript standard
 * filter function but:
 * - It accepts strings as arrays
 * - Can be partially applied
 *
 * @param {Function} fn
 * @param {String|Array} arr
 * @return {Array}
 */
function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list)
    : function (l) { return asArr(l).filter(fn) }
}

// #### Transform lists in array notation
function asPitchStr (p) { return tonalPitch.strPitch(p) || p }
function listToStr (v) {
  return tonalPitch.isPitch(v) ? tonalPitch.strPitch(v)
    : tonalNotation.isArr(v) ? v.map(asPitchStr)
    : v
}

/**
 * Decorates a function to so it's first parameter is an array of pitches in
 * array notation. Also, if the return value is a pitch or an array of pitches
 * in array notation, it convert backs to strings.
 *
 * @function
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 * @example
 * import { listFn } from 'tonal-arrays'
 * var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
 * octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
 */
function listFn (fn) {
  return function (list) {
    var arr = asArr(list).map(tonalPitch.asPitch)
    var res = fn(arr)
    return listToStr(res)
  }
}

/**
 * Given an array of intervals, create a function that harmonizes a
 * note with this intervals.
 *
 * @param {Array|String} ivls - the array of intervals
 * @return {Function} The harmonizer
 * @example
 * import { harmonizer } from 'tonal-arrays'
 * var maj7 = harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 */
function harmonizer (list) {
  return function (tonic) {
    return listFn(function (arr) {
      return arr.map(tonalTranspose.tr(tonic || 'P1')).filter(id)
    })(list)
  }
}

/**
 * Harmonizes a note with an array of intervals. It's a layer of sintatic
 * sugar over `harmonizer`.
 *
 * @function
 * @param {String|Array} ivl - the array of intervals
 * @param {String|Pitch} note - the note to be harmonized
 * @return {Array} the resulting notes
 * @example
 * var tonal = require('tonal')
 * tonal.harmonise('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
 */
var harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// a custom height function that
// - returns -Infinity for non-pitch objects
// - assumes pitch classes has octave -10 (so are sorted before that notes)
var objHeight = function (p) {
  if (!p) return -Infinity
  var f = p[1] * 7
  var o = tonalNotation.isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

// ascending comparator
function ascComp (a, b) { return objHeight(a) - objHeight(b) }
// descending comparator
function descComp (a, b) { return -ascComp(a, b) }

/**
 * Sort an array or notes or intervals. It uses the JavaScript standard sort
 * function.
 *
 * @param {Boolean|Function} comp - the comparator. `true` means use an
 * ascending comparator, `false` a descending comparator, or you can pass a
 * custom comparator (that receives pitches in array notation)
 * @param {Array|String} arr - the array of notes or intervals
 * @example
 * import { sort } from 'tonal-arrays'
 * sort(true, 'D E C') // => ['C', 'D', 'E']
 * @example
 * var tonal = require('tonal')
 * tonal.sort(false, 'D E C') // => ['E', 'D', 'C']
 */
function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  var fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn(function (arr) {
    return arr.sort(fn)
  })
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

exports.asArr = asArr;
exports.map = map;
exports.filter = filter;
exports.listFn = listFn;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.sort = sort;
exports.shuffle = shuffle;
},{"tonal-notation":3,"tonal-pitch":4,"tonal-transpose":27}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('note-parser'), require('interval-notation'), require('tonal-encoding'), require('tonal-notation')) :
  typeof define === 'function' && define.amd ? define(['exports', 'note-parser', 'interval-notation', 'tonal-encoding', 'tonal-notation'], factory) :
  (factory((global.pitch = global.pitch || {}),global.noteParser,global.intervalNotation,global.tonalEncoding,global.tonalNotation));
}(this, function (exports,noteParser,intervalNotation,tonalEncoding,tonalNotation) { 'use strict';

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
   * Get height of the pitch.
   * @param {Pitch}
   * @return {Integer}
   */
  function height (p) { return fifths(p) * 7 + focts(p) * 12 }

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
    var d = tonalEncoding.decode.apply(null, p[1])
    return tonalNotation.toLetter(d[0]) + tonalNotation.toAcc(d[1]) + octStr(d[2])
  }

  /**
   * Convert a interval pitch to string representation
   * @param {Pitch}
   * @return {String}
   */
  function strIvl (p) {
    if (!isIvlPitch(p)) return null
    var d = tonalEncoding.decode.apply(null, p[1])
    var num = d[0] + 1 + 7 * d[2]
    var alt = d[1]
    return p[2] * num + intervalNotation.altToQ(num, alt)
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
  exports.pType = pType;
  exports.isNotePitch = isNotePitch;
  exports.isIvlPitch = isIvlPitch;
  exports.isPC = isPC;
  exports.fifths = fifths;
  exports.focts = focts;
  exports.height = height;
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

}));
},{"interval-notation":5,"note-parser":6,"tonal-encoding":7,"tonal-notation":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
  tuning = tuning || 440

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  p.chroma = SEMITONES[p.step] + p.alt
  if (m[3]) {
    p.oct = +m[3]
    p.midi = p.chroma + 12 * (p.oct + 1)
    p.freq = Math.pow(2, (p.midi - 69) / 12) * tuning
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

// add a property getter to a lib
function getter (lib, name) {
  lib[name] = function (src) {
    var p = parse(src)
    return p && (typeof p[name] !== 'undefined') ? p[name] : null
  }
  return lib
}

var PROPS = ['letter', 'acc', 'pc', 'step', 'alt', 'chroma', 'oct', 'midi', 'freq']
var parser = PROPS.reduce(getter, {})
parser.regex = regex
parser.parse = parse
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

},{}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.encoding = global.encoding || {})));
}(this, function (exports) { 'use strict';

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
    const i = (f + 1) % 7
    return i < 0 ? 7 + i : i
  }

  // We need to get the steps from fifths
  // Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
  // We add 1 to fifths to avoid negative numbers, so:
  // { 0: F, 1: C, 2: G, 3: D, 4: A, 5: E, 6: B}
  const STEPS = [3, 0, 4, 1, 5, 2, 6]

  function decode (f, o) {
    var step = STEPS[unaltered(f)]
    var alt = Math.floor((f + 1) / 7)
    if (!isNum(o)) return [step, alt]
    var oct = o + 4 * alt + FIFTH_OCTS[step]
    return [step, alt, oct]
  }

  exports.encode = encode;
  exports.decode = decode;

}));
},{}],8:[function(require,module,exports){
'use strict';

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
 * Find distance between two pitches. Both pitches MUST be of the same type.
 * Distances between pitch classes always returns ascending intervals.
 * Distances between intervals substract one from the other.
 *
 * @param {Pitch|String} from - distance from
 * @param {Pitch|String} to - distance to
 * @return {Interval} the distance between pitches
 * @example
 * var tonal = require('tonal')
 * tonal.distance('C2', 'C3') // => 'P8'
 * tonal.distance('G', 'B') // => 'M3'
 * tonal.distance('M2', 'P5') // => 'P4'
 */
function interval (a, b) {
  if (arguments.length === 1) return function (b) { return distance(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : tonalPitch.strIvl(i)
}

/**
 * An alias for `distance`
 * @function
 */
var distance = interval

exports.interval = interval;
exports.distance = distance;
},{"tonal-pitch":9}],9:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"interval-notation":10,"note-parser":11,"tonal-encoding":12,"tonal-notation":13}],10:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],13:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],14:[function(require,module,exports){
'use strict';

var tonalMidi = require('tonal-midi');

/**
 * Return a function that converts midi or notes names to frequency using
 * equal temperament.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts midi numbers,
 * note names, pitches and returns a float.
 * @example
 * import { toEqualTemp } from 'tonal-freq'
 * const toFreq = toEqualTemp(444)
 * toFreq('A3') // => 222
 */
function toEqualTemp (ref) {
  return function (p) {
    const m = tonalMidi.toMidi(p)
    return m ? Math.pow(2, (m - 69) / 12) * ref : null
  }
}

/**
 * Get the frequency of a pitch using equal temperament scale and A4 equal to 440Hz
 * @function
 * @param {Number|String} note - the note name or midi number
 * @return {Float} the frequency in herzs
 * @example
 * import { toFreq } from 'tonal-freq'
 * toFreq('A4') // => 440
 * // using tonal
 * tonal.toFreq('C4') // => 261.6255653005986
 */
var toFreq = toEqualTemp(440)

/**
 * Create a function that returns a midi number from a frequency using an
 * equal temperament and `ref` frequency as 'A4' frequency.
 *
 * @param {Float} ref - the frequency of A4
 * @return {Function} a function that converts from frequency to midi
 */
function fromEqualTemp (ref) {
  return function (freq) {
    var midi = 12 * (Math.log(freq) - Math.log(ref)) / Math.log(2) + 69
    return Math.round(midi)
  }
}

/**
 * Get note from frequency using a equal temeperament scale and 440Hz as
 * freq reference
 * @param {Float} freq
 * @return {Integer} midi number
 * @function
 */
var midiFromFreq = fromEqualTemp(440)

/**
 * Get note name from frequency using an equal temperament scale with 440Hz
 * as reference
 * @param {Float} freq
 * @return {String} note name
 */
function fromFreq (freq) {
  return tonalMidi.fromMidi(midiFromFreq(freq))
}

/**
 * Get difference in cents between two frequencies. The frequencies can be
 * expressed with hertzs or midi numbers or note names
 * @param {Float|Integer|String} base
 * @param {Float|Integer|String} freq
 * @return {Float} The difference in cents
 * @example
 * import { cents } from 'tonal-freq'
 * cents('C4', 261) // => -4.1444603457298985
 */
function cents (base, freq) {
  var b = toFreq(base) || base
  var f = toFreq(freq) || freq
  return 1200 * (Math.log(f / b) / Math.log(2))
}

exports.toEqualTemp = toEqualTemp;
exports.toFreq = toFreq;
exports.fromEqualTemp = fromEqualTemp;
exports.midiFromFreq = midiFromFreq;
exports.fromFreq = fromFreq;
exports.cents = cents;
},{"tonal-midi":15}],15:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tonal-pitch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tonal-pitch'], factory) :
  (factory((global.midi = global.midi || {}),global.tonalPitch));
}(this, function (exports,tonalPitch) { 'use strict';

  /**
   * Test if the given number is a valid midi note number
   * @function
   * @param {Object} num - the thing to be tested
   * @return {Boolean} true if it's a valid midi note number
   */
  function isMidiNum (m) {
    if (m === null || Array.isArray(m)) return false
    return m >= 0 && m < 128
  }

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
  function toMidi (val) {
    var p = tonalPitch.asNotePitch(val)
    return p && !tonalPitch.isPC(p) ? tonalPitch.height(p) + 12
      : isMidiNum(val) ? +val
      : null
  }

  var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
  var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

  function fromMidiFn (pcs) {
    return function (m) {
      var pc = pcs[m % 12]
      var o = Math.floor(m / 12) - 1
      return pc + o
    }
  }

  /**
   * Given a midi number, returns a note name. The altered notes will have
   * flats.
   * @function
   * @param {Integer} midi - the midi note number
   * @return {String} the note name
   * @example
   * tonal.fromMidi(61) // => 'Db4'
   */
  var fromMidi = fromMidiFn(FLATS)

  /**
   * Given a midi number, returns a note name. The altered notes will have
   * sharps.
   * @function
   * @param {Integer} midi - the midi note number
   * @return {String} the note name
   * @example
   * tonal.fromMidiS(61) // => 'C#4'
   */
  var fromMidiS = fromMidiFn(SHARPS)

  exports.isMidiNum = isMidiNum;
  exports.toMidi = toMidi;
  exports.fromMidi = fromMidi;
  exports.fromMidiS = fromMidiS;

}));
},{"tonal-pitch":16}],16:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"interval-notation":17,"note-parser":18,"tonal-encoding":19,"tonal-notation":20}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],20:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],21:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @function
 * @param {String|Pitch} note
 * @return {Integer} the chroma
 */
function chroma (n) {
  var p = tonalPitch.asNotePitch(n)
  if (!p) return null
  var f = tonalPitch.fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
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
},{"tonal-pitch":22,"tonal-transpose":27}],22:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"interval-notation":23,"note-parser":24,"tonal-encoding":25,"tonal-notation":26}],23:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],24:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],25:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],26:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],27:[function(require,module,exports){
'use strict';

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
},{"tonal-pitch":28}],28:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"interval-notation":29,"note-parser":30,"tonal-encoding":31,"tonal-notation":32}],29:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],32:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}]},{},[1]);
