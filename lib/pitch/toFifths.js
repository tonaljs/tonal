var parse = require('./parse')

// The fifths vector representation of: C4, D4, E4, F4, G4, A4 and B4
var BASE = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

/**
 * Get the fifths vector representation of a pitch
 *
 * The fifths vector representation is an array of two values, the first
 * is the number of fifths (from C4) and the second is the number of octaves
 * up or down to reach the pitch
 *
 * This representation is useful for calculating interval distances, transpositions
 * or keys
 *
 * @param {String|Array} pitch - the pitch (can be a string or a pitch array)
 * @return {Array} a fifths vector representation of a pitch
 *
 * @example
 * toFifths('C4') // => [0, 0]
 * toFifths('C3') // => [0, -1]
 * toFifths('G4') // => [1, 0]
 */
function toFifths (pitch) {
  var p = parse(pitch)
  if (p === null) return null
  var base = BASE[p[0] - 1]
  return [base[0] + 7 * p[1], base[1] + p[2] - 4 * p[1]]
}

module.exports = toFifths
