var strict = require('../utils/strict')
var parseNote = strict('Note not valid', require('../note/parse'))
var toNote = require('../note/note')
var parseInterval = strict('Interval not valid', require('./parse'))
var isInterval = require('./isInterval')

var LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

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
  // parse interval and notes in strict mode
  var i = parseInterval(interval)
  var n = parseNote(note)

  var oct = n.oct + i.dir * i.oct

  // if its a perfect octave, do a short path
  if (i.quality === 'P' && (i.simple === 8 || i.simple === 1)) {
    return n.pitchClass + oct
  }

  var letterIndex = LETTERS.indexOf(n.letter) + i.dir * (i.simple - 1)
  if (letterIndex > 6) {
    letterIndex = letterIndex % 7
    oct++
  } else if (letterIndex < 0) {
    letterIndex += 7
    oct--
  }
  var dest = toNote(LETTERS[letterIndex], 0, oct)
  return toNote(dest, i.semitones - (dest.midi - n.midi), oct).name
}

module.exports = function (interval, note) {
  // return a partial applied function if only one argument
  if (arguments.length === 1) {
    var param = arguments[0]
    return function (other) {
      if (isInterval(param)) return transpose(param, other)
      else return transpose(other, param)
    }
  } else {
    return transpose(interval, note)
  }
}
