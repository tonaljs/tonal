var chromatic = require('./chromaticList')
var isBinary = require('./isBinary')
var toNote = require('../note/note')
var isInterval = require('../interval/isInterval')

/**
 * Parse a string to a note or interval list
 *
 * The string can be notes or intervals separated by white spaces or a binary
 * or decimal representation of a interval list
 *
 * @param {String|Integer} list - the string to be parsed
 * @return {Array} an array of notes or intervals, null if not valid list
 */
function parse (list) {
  if (isBinary(list)) return binaryIntervals(list.toString(2))
  else if (typeof list === 'string') list = list.split(' ')
  else return null

  var notes = toNotes(list)
  return notes ? notes : toIntervals(list)
}

module.exports = parse

function binaryIntervals (binary) {
  var chroma = chromatic(binary.length)
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(chroma[i])
  }
  return result
}

function toNotes (list) {
  var note
  for (var i = 0, len = list.length; i < len; i++) {
    note = toNote(list[i])
    if (note === null) return null
    else list[i] = note
  }
  return list
}

function toIntervals (list) {
  if (list[0] !== 'P1' && list[0] !== 'P-1') return null
  for (var i = 1, len = list.length; i < len; i++) {
    if (!isInterval(list[i])) return null
  }
  return list
}
