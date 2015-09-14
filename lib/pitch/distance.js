var props = require('./props')
var interval = require('../interval/interval')
var semitones = require('../interval/semitones')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Get the interval between two pitches
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
  var oct = to.oct - from.oct
  var dist = to.chroma - from.chroma
  var num = STEPS.indexOf(to.letter) - STEPS.indexOf(from.letter)
  num = num < 0 ? num - 1 : num + 1

  // If cross octaves, move up
  if (num < 0 && oct > 0) {
    num += 9
    oct--
    dist += 12
  }
  var ref = interval(num, oct)
  var alter = dist - semitones(ref) % 12 // to.alter - from.alter
  return interval(num, oct, alter)
}

distance.from = function (from) {
  return function (to) { return distance(from, to) }
}
distance.to = function (to) {
  return function (from) { return distance(from, to) }
}

module.exports = distance
