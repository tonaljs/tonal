var isNotes = require('./isNoteList')
var intervals = require('./intervalList')
var transpose = require('../note/transpose')

/**
 * Return a note list
 *
 * You need a source and a root. As a source you can use a binary number (or
 * decimal equivalent), an interval list or a note list (both as arrays or strings)
 *
 * If a note list is provided, the notes are transposed to ensure the first note
 * is the given one
 *
 * @param {Array|String|Integer} source - an interval or note list in any of its
 * representations
 * @param {String} note - the tonic or root
 * @return {Array} a list of notes
 *
 * @module list
 */
function noteList (list, root) {
  if (isNotes(list) && list[0] === root) return list
  return intervals(list).map(function (interval) {
    return transpose(interval, root)
  })
}

module.exports = noteList
