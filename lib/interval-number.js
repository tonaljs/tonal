'use strict'

var PITCHCLASSES = 'CDEFGABCDEFGAB'

/*
 * Calculate the interval number (diatonic number)
 * between two pitch classes.
 *
 * The interval number is the number of notes with _different_ letter names that
 * can be contained within two notes.
 *
 * @param {String} pitchClassA - the pitch class of the first note. Must be uppercase
 * @param {String} pitchClassB - the pitch class of the second note. Must be uppercase
 * @param {boolean} descending - if the interval is descending. It is false by default
 * @return {Integer} - the diatonic number
 *
 * @example
 * var intervalNumber = require('tonal/diatonic-number')
 * intervalNumber('C', 'E'); // => 3
 */
function intervalNumber (a, b, descendent) {
  var indexA = PITCHCLASSES.indexOf(a)
  if (indexA === -1) throw Error('Invalid pitch class: ' + a)
  var indexB = PITCHCLASSES.indexOf(b, indexA)
  if (indexB === -1) throw Error('Invalid pitch class: ' + b)
  var mod = descendent ? -8 : 1
  return indexB - indexA + mod
}

module.exports = intervalNumber
