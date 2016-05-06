import { noteFn, id } from 'tonal-pitches'
import { transpose } from 'tonal-distances'

export { chroma } from 'tonal-pitches'

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { noteName } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(noteName)
 * // => ['C', 'Db3', null, null, 'G##4']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.noteName('cb2') // => 'Cb2'
 * tonal.map(tonal.noteName, 'c db3 2 g+ gx4')
 */
export const noteName = noteFn(id)

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
export const pc = noteFn((p) => [ 'tnl', p[1] ])

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
export function enharmonics (pitch) {
  var enharmonics = []
  enharmonics.push(transpose(DESC, pitch))
  if (enharmonics[0] === null) return null
  enharmonics.push(pitch)
  enharmonics.push(transpose(ASC, pitch))
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
export function simplify (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}
