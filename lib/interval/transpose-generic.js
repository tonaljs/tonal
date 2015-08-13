var step = require('../note/step')
var CLASSES = 'CDEFGABCDEFGAB'

/**
 * Transpose note a generic interval
 *
 * A generic interval is defined is the number part of a diationc interval
 * (2: ascendent second, 3: ascendent thirth, -4: descending fourth, ...)
 * The generic interval do not take account of diatonic spelling
 *
 * @param {Integer} number - the generic interal: number of steps to tranpose
 * (is a one-based index, zero is not allowed, and can be negative to move backwards)
 * @param {String} note - the note (everything but the step is ignored)
 * @return {String} the tranposed step (in uppercase)
 *
 * @example
 * transpose('C', 0) // => 'C'
 * transpose('C', 1) // => 'D'
 * transpose('C#', 1) // => 'D'
 * transpose('C2', -1) // => 'B'
 * transpose('C##3', -1) // => 'B'
 */
function transposeGeneric (number, note) {
  if (number === 0) throw Error('0 is not a valid generic interval')
  var index = CLASSES.indexOf(step(note))
  number = number > 0 ? number - 1 : number + 1
  var dest = index + (number % 7)
  if (dest < 0) dest += 7
  return CLASSES[dest]
}
module.exports = transposeGeneric
