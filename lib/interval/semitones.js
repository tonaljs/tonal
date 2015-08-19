var simple = require('./simple')
var parse = require('./parse')

// size in semitones to cannonical (perfect or major) generic intervals
var NAME_TO_DISTANCE = { 'd1': -1, 'P1': 0, 'A1': 1, 'd2': 0, 'm2': 1, 'M2': 2,
  'A2': 3, 'd3': 2, 'm3': 3, 'M3': 4, 'A3': 5, 'd4': 4, 'P4': 5, 'A4': 6,
  'd5': 6, 'P5': 7, 'A5': 8, 'd6': 7, 'm6': 8, 'M6': 9, 'A6': 10, 'd7': 9,
  'm7': 10, 'M7': 11, 'A7': 12, 'd8': 11, 'P8': 12, 'A8': 13 }

/**
 * Get the semitones distance of an intervals
 *
 * @param {String} interval - the interval
 * @return {Integer} the number of semitones
 *
 * @module interval
 * @example
 * semitones('P5') // => 7
 */
function semitones (interval) {
  return parse(interval).dir * NAME_TO_DISTANCE[simple(interval, true)]
}
module.exports = semitones
