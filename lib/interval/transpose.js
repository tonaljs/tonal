var strict = require('../utils/strict')
var parseNote = strict('Note not valid', require('../note/parse'))
var toNote = require('../note/note')
var step = require('../note/step')
var parseInterval = strict('Interval not valid', require('./parse'))
var isInterval = require('./isInterval')
var invert = require('./invert')

var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/**
 * Transpose a note by an interval
 *
 * This is the principal function of interval module. You should be able to
 * transpose any note with any interval. (if not, is a bug ;-)
 *
 * You can also get a currified version by passing one parameter instead
 * of two. For example, with `transpose('M2')` you get a function that transposes
 * any note by a 'M2' interval. The same way, with `transpose('C4')` you get
 * a function that transposes C4 to the given interval. See examples below.
 *
 * This is an _strict_ function: if note or interval are not valid, an exception
 * is thrown
 *
 * @param {String} interval - the interval to tranpose
 * @param {String} note - the note to be transposed
 * @return {String} the resulting note
 *
 * @example
 * transpose('M2', 'E') // => 'F#4'
 * transpose('M-2', 'C') // => 'Bb3'
 * ['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
 * ['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
 */
function transpose (interval, note) {
  // return a currified function if arguments == 0
  if (arguments.length === 1) {
    var param = arguments[0]
    return function (other) {
      if (isInterval(param)) return transpose(param, other)
      else return transpose(other, param)
    }
  }

  // parse interval and notes in strict mode
  interval = parseInterval(interval)
  note = parseNote(note)

  // if its an octave, do a short path
  if (interval.generic === 0 && interval.quality === 'P') {
    return note.letter + note.acc + (note.oct + interval.dir * interval.oct)
  }

  // if its descending, apply the inverse lowering an octave
  var interSize
  if (interval.dir === -1) {
    interval = parseInterval(invert(interval, true))
    interSize = interval.semitones - 12 * (interval.oct + 1)
  } else {
    interSize = interval.semitones - 12 * interval.oct
  }

  // we got the correct step note (without accidentals)
  var destStep = step(note, interval.generic)
  // calc the distance to that step note
  var destSize = (SEMITONES[destStep] - note.chroma)
  // the difference is the alteration of the note
  var difference = interSize - destSize
  // if the difference is more than an octave, reduce alterations
  var oct = note.oct + interval.oct
  if (difference > 11) {
    difference -= 12
    oct++
  } else if (difference < -11) {
    difference += 12
    oct--
  }
  // return the note
  return toNote(destStep, difference, oct)
}

module.exports = transpose
