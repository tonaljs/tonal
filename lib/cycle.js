'use strict'
var parse = require('./parse-note')
var transpose = require('./transpose')

/**
 * Create cycles of notes by transposing them by an interval.
 *
 * You can use it, for example, to create a cycle of fifths
 *
 * @param {String|Note} root - the first note of the cycle (required)
 * @param {String|Interval} interval - the interval used to transpose the note (required)
 * @param {Integer} size - the size of the returned array (required, must be > 0)
 * @param {Integer} offset - if specified, the first note of the cycle will be
 * the root after _offset_ steps. Optional, 0 by default
 * @return {Array} an array of notes __without__ octave
 *
 * @example
 * var cycle = require('tonal/cycle')
 * cycle('C', 'P5', 4) // ['C', 'G', 'D', 'A']
 * cycle('C', 'P5', 4', 2) // ['D', 'A', 'E', 'B']
 */
function cycle (root, interval, size, offset) {
  if (size < 1) throw Error('Size must be at least 1 (was ' + size + ')')
  offset = offset || 0
  var note = parse(root).name
  for (var o = 0; o < offset; o++) {
    note = parse(transpose(interval, note)).name
  }
  var result = [ note ]
  for (var i = 1; i < size ; i++) {
    note = parse(transpose(interval, note)).name
    result.push(note)
  }
  return result
}

module.exports = cycle
