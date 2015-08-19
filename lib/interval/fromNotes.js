var parse = require('../note/parseStrict')
var fromAlter = require('./fromAlter')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Get the interval between two notes
 *
 * @param {String} from - first note
 * @param {String} to - second note
 * @return {String} the interval between notes
 *
 * @example
 * fromNotes('C', 'D') // => 'M2'
 */
function fromNotes (from, to) {
  from = parse(from)
  to = parse(to)
  var steps = STEPS.indexOf(to.step) - STEPS.indexOf(from.step)
  steps = steps < 0 ? steps + 8 : steps + 1
  var difference = to.alter - from.alter
  return fromAlter(steps, difference)
}

module.exports = fromNotes
