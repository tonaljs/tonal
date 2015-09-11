var rotate = require('../list/rotate')
var scale = require('./scale')

/**
 * @name mode
 *
 * Get the mode of a scale
 *
 * @example
 * mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 *
 * @module scale
 */
module.exports = function mode (name, num) {
  return rotate(scale(name), num - 1)
}
