'use strict'

var gamut = require('music-gamut')
var parse = require('array-notation/pitch/parse')
var enharmonics = require('enharmonics')

/**
 * Filter notes
 *
 * @param {Function|String|Array} filter - the note filter
 * @param {Array} notes - the notes to be filtered
 * @return {Array} the notes filtered
 *
 * @example
 */
module.exports = function (filter, notes) {
  filter = gamut.split(filter).map(parse)
  return gamut.operation(function (notes) {
    // hand made filter (to allow enharmonic change)
    var r = []
    for (var i = 0; i < notes.length; i++) {
      var inc = included(filter, notes[i])
      if (inc) r.push(inc)
    }
    return r
  })(notes)
}

/**
 * Check if the given note (or any of its enharmonics) is included in the
 * filter array
 * @private
 */
function included (filter, note) {
  var notes = enharmonics(note)
  for (var i = 0; i < filter.length; i++) {
    for (var e = 0; e < notes.length; e++) {
      if (filter[i][0] === notes[e][0]) return notes[e]
    }
  }
  return null
}
