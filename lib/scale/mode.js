var rotate = require('../_internal/rotate')
var scale = require('./scale')

/**
 * @name mode
 *
 * Get the mode of a scale
 *
 * @param {String} name - the scale name
 * @param {Integer} num - the mode number (1-based index)
 * @return {Array} the set of the mode
 *
 * @example
 * mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 *
 * @module scale
 * @see _internal/rotate
 */
module.exports = function mode (name, num) {
  return rotate(scale(name), num - 1)
}
