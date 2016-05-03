'use strict';

var tonalPitches = require('tonal-pitches');
var tonalDistances = require('tonal-distances');

// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function asList (src) {
  return tonalPitches.isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

/**
 * Map a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
function map (fn, list) {
  return arguments.length > 1 ? map(fn)(list) : (l) => asList(l).map(fn)
}

/**
 * Filter a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list) : (l) => asList(l).filter(fn)
}

// #### Transform lists in array notation

const listToStr = (v) => tonalPitches.isPitch(v) ? tonalPitches.toPitchStr(v) : tonalPitches.isArr(v) ? v.map(tonalPitches.toPitchStr) : v

/**
 * Decorates a function to work with lists in pitch array notation
 * @function
 */
const listFn = (fn) => (src) => {
  const param = asList(src).map(tonalPitches.asPitch)
  const result = fn(param)
  return listToStr(result)
}

// #### Transpose lists

/**
 * Create an harmonizer: a function that given a note returns a list of notes.
 *
 * @function
 * @param {String|Array} list
 * @return {Function}
 */
const harmonizer = (list) => (pitch) => {
  return listFn((list) => list.map(tonalDistances.tr(pitch || 'P1')).filter(tonalPitches.id))(list)
}

/**
 * Harmonizes a list with a pitch
 *
 * @function
 * @param {String|Array} list
 * @param {String|Pitch} pitch
 * @return {Array}
 */
const harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// #### Sort lists

const objHeight = function (p) {
  if (!p) return -Infinity
  const f = p[1] * 7
  const o = tonalPitches.isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

const ascComp = (a, b) => objHeight(a) - objHeight(b)
const descComp = (a, b) => -ascComp(a, b)

function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  const fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn((arr) => arr.sort(fn))
}

exports.asList = asList;
exports.map = map;
exports.filter = filter;
exports.listFn = listFn;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.sort = sort;