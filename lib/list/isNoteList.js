var isNote = require('../note/isNote')

/**
 * Test if the given list is a valid note list
 *
 * A valid note list is an array of note strings
 *
 * @param {Object} list - the list to be tested
 * @return {Boolean} true if is a note list
 */
function isNoteList (list) {
  if (typeof (list) === 'string') list = list.split(' ')
  else if (!Array.isArray(list)) return false

  for (var i = 0, total = list.length; i < total; i++) {
    if (!isNote(list[i])) return false
  }
  return true
}

module.exports = isNoteList
