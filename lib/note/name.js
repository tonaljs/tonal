
var parse = require('./parse')

/**
 * Get the name (step and accidentals) of the note
 *
 * The step is __always__ in uppercase
 *
 * @param {String} note - the note
 * @return {String} the note name
 */
function name (note) {
  var n = parse(note)
  return n.step + n.acc
}
module.exports = name
