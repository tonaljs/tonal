var isNote = require('../note/is-note')

/**
 * Test if the given set is a valid note set
 *
 * A valid note set is an array of note strings
 *
 * @param {Object} set - the set to be tested
 * @return {Boolean} true if is a note set
 */
function isNoteSet (set) {
  if (typeof (set) === 'string') set = set.split(' ')
  else if (!Array.isArray(set)) return false

  for (var i = 0, total = set.length; i < total; i++) {
    if (!isNote(set[i])) return false
  }
  return true
}

module.exports = isNoteSet
