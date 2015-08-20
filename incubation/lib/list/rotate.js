'use strict'

var toList = require('./list')
var isNoteList = require('./isNoteList')

/**
 * Rotate a list
 *
 */
function rotate (list) {
  list = toList(list)
  if (isNoteList(list)) {
    return list
  }
}

module.exports = rotate
