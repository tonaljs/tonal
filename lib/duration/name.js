'use strict'

/**
 * Given a [note value](https://en.wikipedia.org/wiki/Note_value) get its name
 *
 * @param {Float} value - the note value
 * @return The name (expressed with letters and dots) of that value
 *
 * @module duration
 * @see duration/value (does exactly the opposite)
 *
 * @example
 * var name = require('tonal/duration/name')
 * name(1/2 + 1/4)        // => 'h.'
 * name(1/4 + 1/2 + 1/8)  // => 'q..'
 */
function name (value) {
  return valuesToNames['' + value]
}

module.exports = name

var names = ['long', 'double', 'whole', 'half', 'quarter', 'eighth', 'sixteenth', 'thirty-second']
var values = [4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32]

var valuesToNames = {}
names.forEach(function (name, index) {
  var value = values[index]
  valuesToNames['' + value] = name[0]
  valuesToNames['' + (value + value / 2)] = name[0] + '.'
  valuesToNames['' + (value + value / 2 + value / 4)] = name[0] + '..'
})
