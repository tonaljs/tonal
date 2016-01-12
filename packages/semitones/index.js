'use strict'

var parse = require('music-notation/pitch/parse')

/**
 * Get the size in semitones of an interval or a note. If applied to a note, it
 * get the size in semitones from 'C0' to that note.
 *
 * @name semitones
 * @function
 * @param {String|Array} pitch - the pitch to get the semitones size from (in
 * string or array notetion)
 * @return {Integer} the size in semitones, null if not valid pitch
 *
 * @example
 * var semitones = require('semitones')
 * semitones('P4') // => 5
 */
module.exports = function (pitch) {
  var p = Array.isArray(pitch) ? pitch : parse(pitch)
  if (!p) return null
  var f = p[0] * 7
  var o = p.length > 1 ? p[1] : -Math.floor(f / 12)
  return f + o * 12
}
