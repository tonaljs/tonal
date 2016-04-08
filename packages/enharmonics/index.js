'use strict'

var transpose = require('note-transposer')

var ASC = [-12, 7] // dimished second
var DESC = [12, -7] // descending dimished second

/**
 * Get the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
 * @name note.enharmonics
 * @function
 * @param {String} note - the note to get the enharmonics from
 * @return {Array} an array of pitches ordered by distance to the given one
 *
 * @example
 * enharmonics = require('enharmonics')
 * enharmonics('C') // => ['B#', 'C', 'Dbb']
 * enharmonics('A') // => ['G##', 'A', 'Bbb']
 * enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
 * enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
 */
function enharmonics (pitch) {
  var enharmonics = []
  enharmonics.push(transpose(DESC, pitch))
  enharmonics.push(pitch)
  enharmonics.push(transpose(ASC, pitch))
  return enharmonics
}

/**
 * Try to get a simpler enharmonic note name
 *
 * @name note.enharmonics.simplify
 * @function
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (can be the same)
 *
 * @example
 * var enharmonics = require('enharmonics')
 * enharmonics.simplify('B#3') // => 'C4'
 */
enharmonics.simplify = function (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}

module.exports = enharmonics
