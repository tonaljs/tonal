'use strict'

var SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Return an array of the given source. If the source is an array, return it
 * unaltered. If its an string, split it and anything else is wrapped to an array.
 *
 * @param {Array|String|Object} source - the source
 * @return {Array} an array
 *
 * @example
 * // a toArray is an array of events
 * toArray(['A', 'B', 'C']) // => ['A', 'B', 'C']
 * toArray('A B C') // => ['A', 'B', 'C']
 * toArray('A | b | C') // => ['A', 'B', 'C']
 * toArray('A , b , C') // => ['A', 'B', 'C']
 * toArray(2) // => [ 2 ]
 */
function toArray (source) {
  if (Array.isArray(source)) return source
  else if (typeof source === 'string') return source.split(SEP).filter(empty)
  else return [ source ]
}
function empty (e) { return e !== '' }

module.exports = toArray
