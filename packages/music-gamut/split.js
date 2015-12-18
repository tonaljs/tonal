'use strict'
var SEP = /\s*\|\s*|\s*,\s*|\s+/

/**
 * Convert a source to an array. If the source is an array, return it.
 *
 * Aside from an array itself, the source can be a
 * string with elements separated by spaces, commas or bars (`|`) or a single
 * element that will be wrapped inside an array
 *
 * This function __does not perform any transformation__ of the array elements.
 * and __it always return an array, even if its empty__.
 *
 * @name gamut.split
 * @function
 * @param {String|Array} source - the source
 * @return {Array} the source as array
 *
 * @example
 * split = require('music.kit/gamut.split')
 * split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
 * split() // => []
 */
module.exports = function (source) {
  if (Array.isArray(source)) return source
  else if (typeof source === 'string') return source.trim().split(SEP)
  else if (source === null || typeof source === 'undefined') return []
  else return [ source ]
}
