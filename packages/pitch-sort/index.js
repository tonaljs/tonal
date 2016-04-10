'use strict'

var transform = require('music-gamut').transform

module.exports =
/**
 * Sort a collection of notes or intervals. It can sort in ascending or descending
 * pitch order or using a custom comparator.
 *
 * This function is currified
 *
 * @name sort
 * @function
 * @param {Function|Boolean} comparator - the comparator function, or true to
 * sort in ascending pitch order and false to sort in descending pitch order
 * @param {String|Array} source - the notes or intervals list
 * @return {Array} the notes or intervals sorted
 *
 * @example
 * var sort = require('note-sorter')
 * sort(true, 'c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
 * sort(false, 'c5 d2 f4 D2') // => ['C5', 'F4', 'D2', 'D2']
 *
 * // partially applied
 * var descending = sort(false)
 * descending('C D E F G') // => [ 'G', 'F', 'E', 'D', 'C' ]
 */
function sort (comp, source) {
  if (arguments.length > 1) return sort(comp)(source)
  if (comp === null || comp === true) comp = asc
  else if (comp === false) comp = desc
  return transform(function (g) { return g.sort(comp) })
}

function asc (a, b) { return height(a) - height(b) }
function desc (a, b) { return -asc(a, b) }

// Uses a custom height function (instead of semitones) because 1) the Infinty,
// for null values and 2) the pitch class octave number
function height (p) {
  if (!p) return -Infinity
  var f = p[0] * 7
  var o = p[1] || p[1] === 0 ? p[1] : -Math.floor(f / 12) - 10
  return f + o * 12
}
