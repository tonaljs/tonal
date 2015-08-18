var intervals = require('./interval-set')
var notes = require('./note-set')
var isNotes = require('./is-note-set')
var isBinary = require('./is-binary-set')

/**
 * Create a set (either a group of intervals or notes depending if you provide
 * a tonic parameter or not)
 *
 * It uses `set/intervals` or `set/notes` depending
 * on the action. Is a convenience function when creating scales or chords
 *
 * @see scale/scale
 * @see chord/chord
 *
 * @param {String} note - the tonic note (can be null)
 * @param {String|Integer|Array} identifier - the set identifier
 * @return {Array} an array of notes or intervals
 */
function set (set, note) {
  if (isBinary(set)) {
    set = intervals(set)
  } else if (typeof set === 'string') {
    set = set.split(' ')
  }

  if (!note || /^\s*$/.test(note)) {
    return isNotes(set) ? set : intervals(set)
  } else {
    return notes(set, note)
  }
}

module.exports = set
