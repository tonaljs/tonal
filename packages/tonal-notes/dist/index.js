'use strict';

var tonalPitches = require('tonal-pitches');
var tonalDistances = require('tonal-distances');

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { name } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(name)
 * // => ['C', 'Db3', null, null, 'G##4']
 */
const name = tonalPitches.noteFn(tonalPitches.id)

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
const pc = tonalPitches.noteFn((p) => [ 'tnl', p[1] ])

var ASC = ['tnl', -12, 7, 1] // dimished second
var DESC = ['tnl', 12, -7, -1] // descending dimished second

/**
 * Get the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
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
  enharmonics.push(tonalDistances.transpose(DESC, pitch))
  if (enharmonics[0] === null) return null
  enharmonics.push(pitch)
  enharmonics.push(tonalDistances.transpose(ASC, pitch))
  return enharmonics
}

/**
 * Try to get a simpler enharmonic note name
 *
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (can be the same)
 *
 * @example
 * var enharmonics = require('enharmonics')
 * enharmonics.simplify('B#3') // => 'C4'
 */
function simplify (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}

exports.name = name;
exports.pc = pc;
exports.enharmonics = enharmonics;
exports.simplify = simplify;