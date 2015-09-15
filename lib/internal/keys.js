'use strict'

/*
 * Get the keys of two hash concatenated
 *
 * Used by scales and chords
 * @see scale/names
 * @see chord/names
 */
module.exports = function (data, aliases) {
  var keys = null
  return function () {
    keys = keys || Object.keys(data).concat(Object.keys(aliases))
    return keys
  }
}
