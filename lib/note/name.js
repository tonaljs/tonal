
var parse = require('./parse')

/**
 * Get the name (step and accidentals) of the note
 *
 * The step is __always__ in uppercase. The accidentals is always using '#' or 'b'
 * never 'x'
 *
 * @param {String} note - the note
 * @return {String} the note name
 *
 * @example
 * name('C#4') // => 'C#'
 * name('Gx4') // => 'G##'
 */
function name (note) {
  var n = parse(note)
  return n.letter + n.acc
}
module.exports = name
