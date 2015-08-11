'use strict'

var parseInterval = require('./parse-interval')
var parseNote = require('./parse-note')
var pitchClass = require('./pitch-class')
var midi = require('./midi')
var midiName = require('./midi-note-name')

/**
 * Transpose a note a given interval
 *
 * @param {String|Interval} interval - the interval to tranpose
 * @param {String|Note} note - the note to be transposed
 * @return {String} the transposed note
 *
 * @example
 * var transpose = require('tonal/transpose')
 * transpose('M2', 'E') // => 'F#4'
 */
function transpose (interval, note) {
  note = parseNote(note)
  interval = parseInterval(interval)
  var pc = pitchClass(note.pc, interval.num)
  var midiNum = midi(note) + interval.dist + 12 * interval.oct
  return midiName(midiNum, pc)
}

module.exports = transpose
