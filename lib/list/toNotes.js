'use strict'

var isNotes = require('./isNoteList')
var toIntervals = require('./toIntervals')
var transpose = require('../note/transpose')
var toNote = require('../note/note')

/**
 * Return a note list from a source
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
function toNotes (list, root) {
  if (root) root = toNote(root)
  else return list.map(toNote)

  if (isNotes(list) && list[0] === root) return list
  return toIntervals(list).map(function (interval) {
    return transpose(interval, root)
  })
}

module.exports = toNotes
