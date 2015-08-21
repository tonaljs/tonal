var strict = require('../utils/strict')
var parse = strict('Interval not valid', require('./parse'))

// size in semitones to generic semitones in non altered state
var SEMITONES = [0, 2, 4, 5, 7, 9, 11]

/**
 * Get the size in semitones of an interval
 *
 * This is an _strict_ function: if the interval is note valid, an exception
 * is thrown.
 *
 * @param {String} interval - the interval
 * @param {Boolean} simplified - if true, returns the semitones distance of the
 * simplified interval
 * @return {Integer} the number of semitones
 *
 * @example
 * semitones('P5') // => 7
 *
 * @module interval
 */
function semitones (interval, simplified) {
  var inter = parse(interval)
  var oct = simplified === true ? 0 : inter.oct
  return inter.dir * ((SEMITONES[inter.generic] + inter.alter) + 12 * oct)
}
module.exports = semitones
