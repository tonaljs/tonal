'use strict'

var add = require('../interval/add')
var parse = require('./parse')
var intervals = require('./intervals')

/**
 * Get a scale intervals in triadic form
 *
 * @param {String} scale - the scale name
 * @param {Integer} size - the number of intervals
 * @return {Array} an array of intervals
 *
 * @example
 * triadic('major') // => ['1P', '3M', '5P', '7M', '9M', '11P', '13M']
 * triadic('dorian', 4) // => ['1P', '3m', '5P', '7m']
 */
function triadic (scale, size) {
  scale = parse(scale)
  if (!scale) return null
  var inter = intervals(scale.type)
  if (!inter) return null

  size = size || inter.length
  return inter.filter(parity(0))
    .concat(inter.filter(parity(1)).map(add('8P')))
    .slice(0, size)
}

function parity (n) { return function (e, i) { return i % 2 === n } }

module.exports = triadic
