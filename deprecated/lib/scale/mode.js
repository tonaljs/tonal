var toScale = require('./scale')
var rotate = require('../list/rotate')

/**
 * Given a scale, return a different mode
 *
 * @param {String|Array} scale - the scale
 * @param {Integer} num - the mode number (0 index based, 0 by default)
 * @return {Array} the scale mode
 *
 */
function mode (scale, num) {
  scale = toScale(scale)
  num = num || 0
  return rotate(scale, num, true)
}

module.exports = mode
