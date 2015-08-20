'use strict'

var midi = require('../note/midi')
var octave = require('../note/octave')
var toList = require('./toList')

/**
 * Rotate a list
 *
 */
function rotate (list, times, ascending) {
  times = times || 0
  list = toList(list)
  times = times % list.length
  if (times) list = list.slice(times).concat(list.slice(0, times))
  return ascending ? forceAscending(list) : list
}

module.exports = rotate

function forceAscending (list) {
  for (var i = 1, len = list.length; i < len; i++) {
    if (midi(list[i - 1]) > midi(list[i])) {
      list[i] = octave(list[i], 1)
    }
  }
  return list
}
