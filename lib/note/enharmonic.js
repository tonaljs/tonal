var toNote = require('./note')

/**
 * Get the enharmonic of a note with a given step
 *
 * @example
 * enharmonic('C#4', 'D') // => 'Db4'
 * enharmonic('B#', 'C') // => 'C'
 */
function enharmonic (note, step) {
  note = toNote(note)
  step = toNote(step)
  if (!note || !step) return null
  var oct = note.oct
  var dist = note.chroma - step.chroma
  if (dist > 6) {
    dist = dist - 12
    oct++
  } else if (dist < -6) {
    dist = dist + 12
    oct--
  }
  return toNote(step, dist, oct).name
}

module.exports = enharmonic
