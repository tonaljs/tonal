(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * Compact map: map an array with a function and remove nulls.
 * Can be partially applied.
 * @param {Function} fn
 * @param {Array|String} list
 * @return {Array}
 * @see map
 * @example
 * var _ = require('tonal')
 * _.cMap(_.noteName, 'c d e x g') // => ['C', 'D', 'E', 'G']
 * // partially application
 * var notes = _.cMap(_.noteName)
 * notes('e f g h i j') // => ['E', 'F', 'G']
 */
function cMap (fn, list) {
  if (arguments.length === 1) return function (l) { return cMap(fn, list) }
  return map(fn, list).filter(hasVal)
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

/**
 * Given a list of notes, return the distance from the first note to the rest.
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals
 * @example
 * tonal.harmonics('C E g') // => ['1P', '3M', '5P']
 */
function harmonics (list) {
  var a = asArr(list)
  return a.length ? a.map(tonalDistance.interval(a[0])).filter(hasVal) : a
}

/**
 * Given an array of intervals, create a function that harmonizes a
 * note with this intervals. Given a list of notes, return a function that
 * transpose the notes by an interval.
 *
 * @param {Array|String} ivls - the list of pitches
 * @return {Function} The harmonizer
 * @example
 * import { harmonizer } from 'tonal-arrays'
 * var maj7 = harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * var C = harmonizer('C D E')
 * C('M3') // => ['E', 'G#', 'B']
 */
function harmonizer (list) {
  return function (tonic) {
    return cMap(tonalTranspose.transpose(tonic || 'P1'), list)
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
  var o = typeof p[2] === 'number' ? p[2] : -Math.floor(f / 12) - 10
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
  })(list)
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

exports.asArr = asArr;
exports.map = map;
exports.cMap = cMap;
exports.compact = compact;
exports.filter = filter;
exports.harmonics = harmonics;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.sort = sort;
exports.shuffle = shuffle;
exports.rotate = rotate;
exports.rotateAsc = rotateAsc;
exports.select = select;
exports.listFn = listFn;
},{"as-arr":2,"tonal-distance":7,"tonal-pitch":16,"tonal-transpose":25}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var noteParser = require('note-parser');
var tonalArray = require('tonal-array');

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
  return tonalArray.harmonize(dict(src) || src, tonic)
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
  // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
  return build(p[3], p[1] + p[2])
}

exports.build = build;
exports.names = names;
exports.get = get$1;
exports['default'] = get$1;
},{"./chords.json":3,"note-parser":5,"tonal-array":1,"tonal-dictionary":6,"tonal-pitch":16}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.get = get;
exports.keys = keys;
},{}],7:[function(require,module,exports){
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
},{"tonal-pitch":16}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalArray = require('tonal-array');
var tonalMidi = require('tonal-midi');

/**
 * This function filter notes using a scale. Given a scale and a note, it
 * returns the note name if it belongs to the scale or null if not. The
 * note can be given as string or as midi number.
 *
 * This function work with heights instead of names, so the note name returned
 * is not guaranteed to be the same provided (see 'B#3' example)
 *
 * It can be partially applied.
 *
 * @param {String|Array} scale - the scale used to filter
 * @param {String|Pitch|Number} note - the note to be filtered
 * @return {String} the note name or null if note in the pitch classes
 *
 * @example
 * var filter = require('tonal-filter')
 * var inC = filter.byScale('c d e f g a b')
 * inC('c4') // => true
 * filter.all(inC, 'c2 c#2 d3 eb3 e4 f5') // => ['']
 * isAMajor = scaleFilter('A C# E')
 * isAMajor('c#2') // => true
 * // work with midi numbers
 * isAMajor(69) // => true
 */
function scaleFilter (notes, m) {
  if (arguments.length > 1) return scaleFilter(notes)(m)
  var scale = tonalArray.map(tonalNote.pc, notes)
  var chromas = tonalArray.map(tonalNote.chroma, scale)
  return function (note) {
    var midi = tonalMidi.fromNote(note)
    var m = midi !== null ? midi - 12 : tonalNote.chroma(note)
    var pcIndex = chromas.indexOf(m % 12)
    return pcIndex > -1 ? scale[pcIndex] + Math.floor(m / 12) : null
  }
}

exports.scaleFilter = scaleFilter;
},{"tonal-array":1,"tonal-midi":12,"tonal-note":15}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    var m = tonalMidi.fromNote(p)
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
    var midiNum = 12 * (Math.log(freq) - Math.log(ref)) / Math.log(2) + 69
    return Math.round(midiNum)
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
  return tonalMidi.toNote(midiFromFreq(freq))
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
},{"tonal-midi":12}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
exports.semitones = semitones;
exports.fromSemitones = fromSemitones;
exports.ic = ic;
exports.type = type;
exports.invert = invert;
exports.simplify = simplify;
},{"tonal-pitch":16}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var parser = _interopDefault(require('note-parser'));

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the thing to be tested
 * @return {Boolean} true if it's a valid midi note number
 * @example
 * midi.isValidNote(30) // => true
 * midi.isValidNote(200) // => false
 */
function isValidNote (m) {
  return parser.midi(m) !== null
}

// To match the general midi specification where `C4` is 60 we must add 12 to
// `height` function:

/**
 * Get midi note number. If you pass a midi number it will be
 * bypassed.
 *
 * @param {Array|String} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi.fromNote('C4') // => 60
 * midi.fromNote(60) // => 60
 * midi.fromNote('60') // => 60
 */
function fromNote (val) {
  if (Array.isArray(val) && val.length === 2) return val[0] * 7 + val[1] * 12 + 12
  return parser.midi(val)
}

var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * var midi = require('tonal-midi')
 * midi.toNote(61) // => 'Db4'
 * midi.toNote(61, true) // => 'C#4'
 */
function toNote (num, sharps) {
  if (num === true || num === false) return function (m) { return toNote(m, num) }
  var pcs = sharps === true ? SHARPS : FLATS
  var pc = pcs[num % 12]
  var o = Math.floor(num / 12) - 1
  return pc + o
}

exports.isValidNote = isValidNote;
exports.fromNote = fromNote;
exports.toNote = toNote;
},{"note-parser":13}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
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
  return n === 0 ? ''
    : n < 0 ? fillStr('b', -n)
    : fillStr('#', n)
}

exports.toStep = toStep;
exports.isStep = isStep;
exports.toLetter = toLetter;
exports.areFlats = areFlats;
exports.areSharps = areSharps;
exports.toAlt = toAlt;
exports.toAcc = toAcc;
},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');

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
 * note.toNote('cb2') // => 'Cb2'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
 */
function toNote (n) {
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

exports.chroma = chroma;
exports.toNote = toNote;
exports.pc = pc;
exports.enharmonics = enharmonics;
exports.simplify = simplify;
},{"tonal-pitch":16,"tonal-transpose":25}],16:[function(require,module,exports){
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
},{"interval-notation":17,"note-parser":18,"tonal-encoding":8}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPitch = require('tonal-pitch');
var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');

/**
 * Get chord progression from a tonic and a list of chord in roman numerals
 *
 * @param {String} tonic - the tonic
 * @param {Array|String} progression - the progression in roman numerals
 * @return {Array} the chord progression
 *
 * @example
 * var progression = require('chord-progression')
 * progression.build('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
 */
function build (chords, tonic) {
  return tonalArray.asArr(chords).map(function (e) {
    var r = parseRomanChord(e)
    return r ? tonalTranspose.transpose(r.root, tonic) + r.name : null
  })
}

var ROMAN = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/
/**
 * Returns a regex to match roman numbers literals with the from:
 * `[accidentals]roman[element]`.
 *
 * The executed regex contains:
 * accidentals: (Optional) one or two flats (b) or shaprs (#)
 * roman: (Required) a roman numeral from I to VII either in upper or lower case
 * element: (Optional) a name of an element
 *
 * @return {RegExp} the regexp
 *
 * @example
 * r.exec('bVII')
 * r.exec('IVMaj7')
 * r.exec('ii minor')
 */
function romanRegex () { return ROMAN }

var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Parse a chord expressed with roman numerals. It returns an interval representing
 * the root of the chord relative to the key tonic and the chord name.
 *
 * @param {String} str - the roman numeral string
 * @return {Object} the roman number in array notation or null if not valid numeral
 *
 * @example
 * var parse = require('music-notation/roman.parse')
 * parse('V7') // => { root: ['tnl', 1, 0, 0, 1], name: '7'}
 * parse('bIIalt') // => [ root: ['tnl', -5, 0, 2, 1], name: 'alt']
 */
function parseRomanChord (str) {
  var m = ROMAN.exec(str)
  if (!m) return null
  var num = NUM[m[2].toLowerCase()]
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return { root: tonalPitch.encode(num, alt, 0, 1), name: m[3] }
}

exports.build = build;
exports.romanRegex = romanRegex;
exports.parseRomanChord = parseRomanChord;
},{"tonal-array":1,"tonal-pitch":16,"tonal-transpose":25}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');
var tonalMidi = require('tonal-midi');
var tonalFilter = require('tonal-filter');

function isNum (n) { return typeof n === 'number' }
// convert notes to midi if needed
function asNum (n) { return isNum(n) ? n : tonalMidi.fromNote(n) }
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
  return tonalArray.cMap(tonalMidi.toNote(sharps === true), numeric(list))
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
function pitchSet (src, range) {
  if (arguments.length === 1) return function (l) { return pitchSet(src, l) }

  // TODO: chromatic(range).filter(isPitchSet(pitchSet))
  var fn = typeof src === 'function' ? src : tonalFilter.scaleFilter(src)
  return tonalArray.cMap(fn, numeric(range))
}

exports.numeric = numeric;
exports.chromatic = chromatic;
exports.fifths = fifths;
exports.pitchSet = pitchSet;
},{"tonal-array":1,"tonal-filter":9,"tonal-midi":12,"tonal-transpose":25}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var tonalArray = require('tonal-array');

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
  return tonalArray.harmonize(get$1(src) || src, tonic)
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
  return tonalPitch.parseNote(tonic) ? tonalArray.harmonize(dict(name.substring(i + 1)), tonic)
    : tonalArray.harmonize(dict(name), false)
}

exports.build = build;
exports.names = names;
exports.get = get$1;
},{"./scales.json":22,"tonal-array":1,"tonal-dictionary":6,"tonal-pitch":16}],22:[function(require,module,exports){
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
  "neopolitan minor": [ "1P 2m 3m 4P 5P 6m 7m" ],
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

},{}],23:[function(require,module,exports){
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
 * @function
 * @param {Array|String} notes - the notes to analyze
 * @return {Array} the _pmnsdt_ array
 */
var density = tonalArray.listFn(function (list) {
  var a, b, i
  var notes = list.filter(tonalPitch.isNotePitch).map(tonalPitch.parseNote)
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
})

exports.density = density;
},{"tonal-array":1,"tonal-interval":11,"tonal-pitch":16}],24:[function(require,module,exports){
'use strict';

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

module.exports = tonal
},{"tonal-array":1,"tonal-chord":4,"tonal-distance":7,"tonal-freq":10,"tonal-interval":11,"tonal-midi":12,"tonal-notation":14,"tonal-note":15,"tonal-pitch":16,"tonal-progression":19,"tonal-range":20,"tonal-scale":21,"tonal-sonority":23,"tonal-transpose":25}],25:[function(require,module,exports){
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
},{"tonal-pitch":16}]},{},[24]);
