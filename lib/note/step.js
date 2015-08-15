
var parse = require('./parse')

/**
 * Get the step of a note (the letter in uppercase, ignoring the accidentals and octave)
 *
 * @param {String} note - the note to get the step of
 * @return {String} the step letter (__always in uppercase__)
 *
 * @example
 * step('C#4') // => 'C'
 * step('db7') // => 'D'
 */
function step (note) {
  return parse(note).step
}
module.exports = step
