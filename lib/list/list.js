var intervals = require('./intervalList')
var notes = require('./noteList')
var isNotes = require('./isNoteList')
var isBinary = require('./isBinaryList')

/**
 * Create a list (either a group of intervals or notes depending if you provide
 * a tonic parameter or not)
 *
 * It uses `list/intervals` or `list/notes` depending
 * on the action. Is a convenience function when creating scales or chords
 *
 * @param {String} note - the tonic note (can be null)
 * @param {String|Integer|Array} identifier - the list identifier
 * @return {Array} an array of notes or intervals
 *
 * @module list
 * @see scale/scale
 * @see chord/chord
 */
function list (list, note) {
  if (isBinary(list)) {
    list = intervals(list)
  } else if (typeof list === 'string') {
    list = list.split(' ')
  }

  if (!note || /^\s*$/.test(note)) {
    return isNotes(list) ? list : intervals(list)
  } else {
    return notes(list, note)
  }
}

module.exports = list
