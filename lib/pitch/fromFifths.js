
var LETTERS = [1, 5, 2, 6, 3, 7, 4]
var OCT = [0, 0, 1, 1, 2, 2, -1]

/**
 * Get array pitch structure from a fifths coordinate structure
 *
 * @param {Array} coord - the fifths coordinate
 * @return {Array} the ternary pitch structure
 *
 * @see pitch/parse
 *
 * @example
 * fromFifths([3, -1]) // => [6, 0, 1]
 */
function fromFifths (coord) {
  var q = coord[0] % 7
  var index = q < 0 ? 7 - Math.abs(q) : q
  var alter = Math.floor((coord[0] + 1) / 7)

  var oct = OCT[index] + alter * 4
  return [LETTERS[index], alter, oct + coord[1]]
}

module.exports = fromFifths
