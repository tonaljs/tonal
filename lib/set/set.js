var intervals = require('./intervals')
var notes = require('./notes')
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
function set (note, set) {
  if (note === null) {
    return intervals(set)
  } else {
    return notes(note, set)
  }
}

module.exports = set
