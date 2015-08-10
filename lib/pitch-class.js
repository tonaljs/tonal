var parse = require('./parse-note')
var PITCHCLASSES = 'CDEFGABCDEFGAB'

function pitchClass (note, number) {
  note = parse(note)
  var index = PITCHCLASSES.indexOf(note.pc)
  var dest = index + ((number - 1) % 7)
  if (dest < 0) dest += 9
  return PITCHCLASSES[dest]
}

module.exports = pitchClass
