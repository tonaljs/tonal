var toFifths = require('./toFifths')
var fromFifths = require('./fromFifths')
var intervalStr = require('./intervalStr')

/**
 * Get the interval between two pitches
 *
 * You can get a partially applied version of this function by passing only one
 * parameter. See examples below:
 *
 * @name interval
 * @param {String} from - first pitch
 * @param {String} to - second pitch
 * @return {String} the interval between pitches
 *
 * @example
 * interval('C', 'D') // => 'M2'
 * ['C', 'D', 'Eb'].map(interval.from('C')) // => ['P1', 'M2', 'm3']
 */
module.exports = function interval (from, to) {
  from = toFifths(from)
  to = toFifths(to)
  if (from === null || to === null) return null
  var sub = [to[0] - from[0], to[1] - from[1]]
  return intervalStr(fromFifths(sub))
}
