'use strict'

var parseInterval = require('./parse-interval')
var parseNote = require('./parse-note')
var pitchClass = require('./pitch-class')
var midi = require('./midi')
var midiName = require('./midi-note-name')

function transpose (interval, note) {
  note = parseNote(note)
  interval = parseInterval(interval)
  var pc = pitchClass(note.pc, interval.num)
  var midiNum = midi(note) + interval.dist + 12 * interval.oct
  return midiName(midiNum, pc)
}

module.exports = transpose
