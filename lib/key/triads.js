var toScale = require('../scale/scale')
var mode = require('../scale/mode')
var triad = require('../chord/triad')

/**
 * Get all the triads of the given key
 *
 * @param {String|Array} scale - the key scale
 * @param {Integer} size - (Optional) the number of notes of the triads (3 by default)
 */
function triads (scale, size) {
  scale = toScale(scale)
  return scale.map(function (s, num) {
    return triad(mode(scale, num), size)
  })
}

module.exports = triads
