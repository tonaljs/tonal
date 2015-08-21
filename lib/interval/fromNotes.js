var strict = require('../utils/strict')
var parse = strict('Note not valid', require('../note/parse'))
var build = require('./build')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Get the interval between two notes
 *
 * This is the function to calculate distances (expressed in intervals) for
 * two notes. An alias of this function is in `note/distance`
 *
 * This is an 'strict' function: if the notes are note valid, an
 * exception is thrown.
 *
 * You can get a _curryfied_ version of this function by passing only one
 * parameter. See examples below:
 *
 * @param {String} from - first note
 * @param {String} to - second note
 * @return {String} the interval between notes
 *
 * @example
 * fromNotes('C', 'D') // => 'M2'
 * ['C', 'D', 'Eb'].map(fromNotes('C')) // => ['P1', 'M2', 'm3']
 */
function fromNotes (from, to) {
  if (arguments.length === 1) {
    return function (to) {
      return fromNotes(from, to)
    }
  }

  from = parse(from)
  to = parse(to)
  var num = STEPS.indexOf(to.step) - STEPS.indexOf(from.step)
  num = num < 0 ? num + 8 : num + 1
  var alter = to.alter - from.alter
  var oct = to.oct - from.oct
  return build(num, alter, oct)
}

module.exports = fromNotes
