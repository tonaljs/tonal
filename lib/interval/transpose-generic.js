var step = require('../note/step')
var CLASSES = 'CDEFGABCDEFGAB'

/**
 * Transpose note a generic interval
 *
 * A generic interval is defined is the number part of a diationc interval
 * (2: ascendent second, 3: ascendent thirth, -4: descending fourth, ...)
 * The generic interval do not take account of diatonic spelling
 *
 * @param {Integer} generic - the generic interval
 * @param {String} note - the note (everything but the step is ignored)
 * @return {String} the tranposed step (in uppercase)
 *
 * @example
 * transpose(0, 'C') // => 'C'
 * transpose(1, 'C') // => 'D'
 * transpose(-1, 'C') // => 'B'
 */
function transposeGeneric (number, note) {
  var index = CLASSES.indexOf(step(note))
  var dest = index + (number % 7)
  if (dest < 0) dest += 7
  return CLASSES[dest]
}
module.exports = transposeGeneric
