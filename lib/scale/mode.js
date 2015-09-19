var rotate = require('../_internal/rotate')
var scale = require('./scale')

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
module.exports = function mode (name, num) {
  return rotate(scale(name), num - 1)
}
