'use strict'

var split = require('./split')

/**
 * Select some elements from a gamut
 *
 * @name gamut.select
 * @function
 * @param {String|Array} numbers - a __1-based__ index of the elements
 * @param {String|Array} gamut - the notes or intervals
 * @return {Array} the selected elements
 *
 * @example
 * var select = require('tonal.gamut/select')
 * select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
 */
module.exports = function s (nums, gamut) {
  if (arguments.length === 1) return function (g) { return s(nums, g) }
  var g = split(gamut)
  return split(nums).map(function (n) {
    return g[n - 1]
  })
}
