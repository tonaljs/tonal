'use strict'

var parse = require('./parse-note')
var PITCHCLASSES = 'CDEFGABCDEFGAB'

/*
 * Calculate the diatonic number between two pitch classes.
 *
 * The diatonic number is the number of notes with _different_ letter names that
 * can be contained within two notes. Is the number used to designate an interval.
 *
 * @example
 *    var diatonicNumber = require('tonal/diatonic-number')
 *    diatonicNumber('C', 'E'); // => 3
 */
function diatonicNumber (a, b, descendent) {
  a = parse(a)
  b = parse(b)
  var indexA = PITCHCLASSES.indexOf(a.pc)
  var indexB = PITCHCLASSES.indexOf(b.pc, indexA)
  var mod = descendent ? -8 : 1
  return indexB - indexA + mod
}

module.exports = diatonicNumber
