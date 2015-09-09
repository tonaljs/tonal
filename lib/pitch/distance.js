var props = require('./props')
var interval = require('../interval/interval')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Get the interval between two pitches
 *
 * This is the function to calculate distances (expressed in intervals) for
 * two pitches. An alias of this function is in `pitch/distance`
 *
 * This is an 'strict' function: if the pitches are pitch valid, an
 * exception is thrown.
 *
 * You can get a partially applied version of this function by passing only one
 * parameter. See examples below:
 *
 * @param {String} from - first pitch
 * @param {String} to - second pitch
 * @return {String} the interval between pitches
 *
 * @example
 * distance('C', 'D') // => 'M2'
 * ['C', 'D', 'Eb'].map(distance.from('C')) // => ['P1', 'M2', 'm3']
 */
function distance (from, to) {
  from = props(from)
  to = props(to)
  var num = STEPS.indexOf(to.letter) - STEPS.indexOf(from.letter)
  num = num < 0 ? num + 8 : num + 1
  var alter = to.alter - from.alter
  var oct = to.oct - from.oct
  return interval(num, oct, alter).name
}

distance.from = function (from) {
  return function (to) { return distance(from, to) }
}
distance.to = function (to) {
  return function (from) { return distance(from, to) }
}

module.exports = distance
