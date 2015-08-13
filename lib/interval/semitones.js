var number = require('./number')
var direction = require('./direction')

// size in semitones to cannonical (perfect or major) generic intervals
var SIZES = { 1: 0, 2: 2, 3: 4, 5: 7, 6: 9, 7: 11, 8: 12 }
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
  return direction(interval) * SIZES[number(interval)]
}
module.exports = semitones
