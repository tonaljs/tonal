var parse = require('./parse')

var STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
/**
 * Transpose note steps
 *
 * @param {String} note - the note to get the step from
 * @param {Integer} amount - (Optional) the amount of steps to move. 0 by default
 *
 * @example
 * step('C#2') // => 'C'
 * step('C#2', 1) // => 'D'
 * step('C#2', -1) // => 'B'
 */
function step (note, amount) {
  note = parse(note)
  if (!note) return null
  else if (!amount) return note.step
  if (amount < 0) amount = 7 + (amount % 7)
  return STEPS[(STEPS.indexOf(note.step) + amount) % 7]
}

module.exports = step
