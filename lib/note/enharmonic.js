var pc = require('./pitch-class')
var octave = require('./octave')
var accidentals = require('../misc/accidentals')

/**
 * Get the enharmonic of a note with a given step
 *
 * @example
 * enharmonic('C#4', 'D') // => 'Db4'
 * enharmonic('B#', 'C') // => 'C'
 */
function enharmonic (note, step) {
  var oct = octave(note)
  var dist = pc(note) - pc(step)
  if (dist > 6) {
    dist = dist - 12
    oct++
  } else if (dist < -6) {
    dist = dist + 12
    oct--
  }
  return step + accidentals(dist) + oct
}

module.exports = enharmonic
