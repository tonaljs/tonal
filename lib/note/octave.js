
var parse = require('./parse')

function octave (note) {
  return parse(note)[2]
}
module.exports = octave
