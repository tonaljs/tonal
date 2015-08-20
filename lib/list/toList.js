'use strict'

var toIntervals = require('./toIntervals')
var toNotes = require('./toNotes')
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
function toList (src, note) {
  if (isBinary(src)) {
    src = toIntervals(src)
  } else if (typeof src === 'string') {
    src = src.split(' ')
  }

  if (!note || /^\s*$/.test(note)) {
    return isNotes(src) ? toNotes(src) : toIntervals(src)
  } else {
    return toNotes(src, note)
  }
}

module.exports = toList
