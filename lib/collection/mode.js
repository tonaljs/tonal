var rotate = require('../collection/rotate')
var toArray = require('../collection/toArray')

/**
 * Get the mode of a scale
 *
 * @name mode()
 * @param {String} name - the scale name
 * @param {Integer} num - the mode number (1-based index)
 * @return {Array} the set of the mode
 *
 * @example
 * mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 */
module.exports = function mode (num, coll) {
  coll = toArray(coll)
  if (num < 1 || num > coll.length) return null
  return rotate(num - 1, coll)
}
