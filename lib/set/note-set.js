var isNotes = require('./is-note-set')
var intervals = require('./interval-set')
var transpose = require('../note/transpose')

/**
 * Given a set and a note, return a set with the same intervals but starting from note
 *
 * @param {Array|String|Integer} set - the original set. Can be a notes or
 * intervals array, a binary string set or a decimal set
 */
function noteSet (set, root) {
  if (isNotes(set) && set[0] === root) return set
  return intervals(set).map(function (interval) {
    return transpose(interval, root)
  })
}

module.exports = noteSet
