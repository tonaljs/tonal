'use strict'

/**
 * Create a sequence. A sequence is an array of events (of any type, but in tonal
 * the most common one is an array of notes or intervals)
 *
 * In its simplest form it transforms a string of space separated events into an
 * array.
 *
 * This method optionally receives a parser to convert the string representation
 * into events.
 *
 * @param {Array|String} sequence - the sequence
 * @param {Function} parser - (Optional) a item parser
 * @return {Array} an array with the elements of the sequence (parsed if parser given)
 *
 * @example
 * var sequence = require('sequence/sequence')
 * // a sequence is an array of events
 * sequence('A B C') // => ['A', 'B', 'C']
 * sequence(['A', 'B', 'C']) // => ['A', 'B', 'C']
 * // create a sequence of pitches
 * var pitch = require('pitch/pitch')
 * sequence('A B', pitch) // => [{ name: 'A', midi: 69, ...}, { name: 'B', ... }]
 * sequence('A G J', pitch) // => null (not valid pitches)
 * // create a sequence of interval objects
 * var interval = require('interval/interval')
 * sequence('P1 M2', interval) // => [{ name: 'P1', ...}, { name: 'M2', ... }]
 * sequence('C2 E3', interval) // => null (not valid intervals)
 */
function sequence (sequence, parser) {
  if (typeof sequence === 'string') sequence = sequence.split(' ')
  if (!Array.isArray(sequence)) return null
  if (!parser) return sequence

  var item
  var result = []
  for (var i = 0, len = sequence.length; i < len; i++) {
    item = parser(sequence[i])
    if (!item) return null
    result.push(item)
  }
  return result
}

module.exports = sequence
