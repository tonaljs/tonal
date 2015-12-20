'use strict'

var G = require('music-gamut')
var build = require('./build')
var transpose = require('note-transpose')

// STEPS: each number of fifths (base F) has a step number (base 0)
var STEPS = [3, 0, 4, 1, 5, 2, 6]

/**
 * Select notes from a scale using degree numbers.
 *
 * The resulting array will contain the notes in the same order as degrees.
 * If a given degree is not present in the scale, the result will contain a
 * null in that position.
 *
 * This function is currified so it can be partially applied.
 *
 * @name scale.select
 * @function
 * @param {Array|String} degrees - the degrees numbers list
 * @param {Array|String} scale - the scale notes
 * @return {Array} the melodic pattern (or null if not present)
 *
 * @example
 * var select = require('music.kit/scale.select')
 * // basic usage:
 * select('1 3 5', 'C D E F G A B') // => [ 'C', 'E', 'G' ]
 * // order matters:
 * select('1 5 2 6', 'C D E F G A B') // => [ 'C', 'G', 'D', 'A' ]
 * // not found degrees are null:
 * select('1 2 6', 'C D E F G') // => [ 'C', 'D', null ]
 * // numbers bigger than 7 are transposed one octave or more:
 * select('1 8 15', 'C2 D2 E2') // => ['C2', 'C3', 'C4']
 * // partially applied:
 * var triad = select('1 3 5')
 * triad('C D E F G A B') // => ['C', 'E', 'G']
 */
module.exports = function select (pttn, notes) {
  if (arguments.length === 2) return select(pttn)(notes)

  return G.operation(function (g) {
    var nums = G.split(pttn).map(function (n) { return +n - 1 })
    var index = []
    build(g, false).forEach(function (item) {
      var fifths = (item[0] + 1) % 7
      index[STEPS[fifths]] = item
    })
    var selected = nums.map(function (n) {
      var i = index[n % 7]
      // up an octave if number > 7
      if (i && n > 6) {
        i = i.slice()
        i[1] = i[1] + Math.floor(n / 7)
      }
      return i
    })
    return selected.map(transpose(g[0]))
  })
}
