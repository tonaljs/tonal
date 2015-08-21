'use strict'

var toList = require('./toList')

/**
 * Rotate a list
 *
 */
function rotate (list, times) {
  times = times || 0
  list = toList(list)
  times = times % list.length
  if (times) list = list.slice(times).concat(list.slice(0, times))
  return list
}

module.exports = rotate
