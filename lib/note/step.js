var parse = require('./parse')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Transpose note steps
 *
 * @param {String} note - the note to get the step from
 * @param {Integer} steps - (Optional) the number of steps to move (ascending if
 * positive or descending oterwise). 0 by default
 * @return {String} the step (in uppercase)
 *
 * @example
 * step('C', 1) // => 'D'
 * step('C#', 1) // => 'D'
 * step('C#2', -1) // => 'B'
 * step('C#') // => 'C'
 */
function step (note, steps) {
  note = parse(note)
  if (!note) return null
  else if (!steps) return note.step
  if (steps < 0) steps = 7 + (steps % 7)
  return STEPS[(STEPS.indexOf(note.step) + steps) % 7]
}

module.exports = step
