'use strict'

var operation = require('./operation')

function height (p) {
  if (!Array.isArray(p)) return -Infinity
  var f = p[0] * 7
  var o = p[1] || p[1] === 0 ? p[1] : -Math.floor(f / 12) - 10
  return f + o * 12
}

/**
 * Get a gamut in ascdening pitch order
 *
 * @name gamut.sort
 * @function
 * @param {String|Array} gamut - the gamut to sort
 * @return {Array} the gamut in sort pitch order
 *
 * @example
 * var sort = require('music.kit/gamut.sort')
 * sort('c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
 */
module.exports = operation(function (gamut) {
  return gamut.sort(function (a, b) {
    return height(a) - height(b)
  })
})
