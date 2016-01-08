'use strict'

var G = require('music-gamut')
var transpose = require('note-transposer')

/*
 */
function bs () {

}

/**
 * Get a set binary number from a collection of notes or intervals
 *
 * A set binary number is a 12 digit binary, each digit representing a step
 * in the chromatic scale. For example, `101010000000` is `['1P', '2M', '3M']`
 *
 * The set binary number is very useful to check if two sets are equal or
 * contains same intervals (regarding of note names)
 *
 * @name binarySet.toBinary
 * @function
 * @param {String|Array|Array<Array>} source - a gamut
 * @return {String} the binary number
 *
 * @example
 * var binarySet = require('binary-set')
 * binarySet.toBinary('C2 E4 D3') // => '101010000000'
 */
bs.toBinary = G.operation(function (gamut) {
  var number = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var intervals = G.set(G.harmonizer(gamut, false))
  var semitones = intervals.map(height)
  semitones.forEach(function (s) {
    number[s] = 1
  })
  return number.join('')
})

function height (p) {
  var f = p[0] * 7
  var o = p[1] || p[1] === 0 ? p[1] : -Math.floor(f / 12) - 10
  return f + o * 12
}

var INTERVALS = ['1P', '2m', '2M', '3m', '3M', '4P', '4#', '5P', '6m', '6M', '7m', '7M']

/**
 * Get a set from a binary set number and (optionally) a tonic. If the tonic is
 * a note, you get a pitch set. If its false you get a interval set.
 *
 * @name set.fromBinary
 * @function
 * @param {String|Array|Array<Array>} source - the gamut
 * @param {String} tonic - the first note of the set or false to get the intervals
 * @return {Array<String>} the set pitch classes (note names without octaves)
 *
 * @example
 * var fromBinary = require('tonal.set/fromBinary')
 * // use a 12 digit binary number:
 * fromBinary('101011010101', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // or its decimal equivalent:
 * fromBinary(2773, 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // get the interval set by passing `false` as tonic:
 * fromBinary(2773, false) // => ['1P', '2M', '3M', '4', '5', '6M', '7M']
 */
bs.fromBinary = function (number, tonic) {
  if (arguments.length === 1) return function (t) { return bs.fromBinary(number, t) }

  if (/^1[01]{11}$/.test(number)) number = parseInt(number, 2)
  else if (typeof number !== 'number') return []
  var binary = ((number % 2048) + 2048).toString(2)

  var set = []
  for (var i = 0; i < 12; i++) {
    if (binary.charAt(i) === '1') {
      if (i === 6 && binary.charAt(5) === '1') set.push('5d')
      else set.push(INTERVALS[i])
    }
  }
  return tonic === false ? set : set.map(transpose(tonic))
}

module.exports = bs
