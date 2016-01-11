'use strict'

var gamut = require('music-gamut')
var regex = require('music-notation/roman/regex')
var parse = require('music-notation/roman/parse')
var transpose = require('note-transposer')

/**
 * Get chord progression from a tonic and roman numerals chords
 *
 * @name chord.progression
 * @function
 * @param {String} tonic - the tonic
 * @param {Array|String} progression - the progression in roman numerals
 * @return {Array} the chord progression
 *
 * @example
 * var progression = require('chord-progression')
 * progression('C', 'I IIm7 V7') // => ['C', 'Dm7', 'G7']
 */
module.exports = function (tonic, progression) {
  return gamut.split(progression)
    .map(function (e) { return regex.exec(e) })
    .map(function (roman) {
      if (!roman) return null
      var pc = parse(roman[2])
      return transpose(tonic, pc) + roman[3]
    })
}
