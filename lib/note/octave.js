
var parse = require('./parse')

function octave (note) {
  return parse(note).oct
}
module.exports = octave
