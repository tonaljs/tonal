
var parse = require('./parse-note')

var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function midi (note) {
  note = parse(note)
  var alter = note.acc[0] === '#' ? note.acc.length : -1 * note.acc.length
  return SEMITONES[note.pc] + alter + 12 * (note.oct + 1)
}

module.exports = midi
