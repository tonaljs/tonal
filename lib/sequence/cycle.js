'use strict'

var transpose = require('../pitch/transpose')

/**
 * Given an interval create a cycle
 */
function cycle (tonic, interval, length, offset) {
  length = length || 1
  offset = offset || 0
  var result = []
  var current = transpose(tonic, 'P1')
  for (var i = 0, len = length + offset; i < len; i++) {
    result.push(current)
    current = transpose(current, interval)
  }
  return result.slice(offset)
}

module.exports = cycle
