var toScale = require('../scale/scale')

/**
 * Given a scale, get its triad chord
 *
 * @param {String|Array} scale - the scale
 * @param {Integer} size - (Optional) the number of notes of the triad
 * (3 by default)
 * @return {Array} an array of notes or intervals
 */
function triad (scale, size) {
  size = size || 3
  scale = toScale(scale)
  var len = scale.length
  var triad = []
  for (var i = 0; i < size; i++) {
    var e = scale[(i * 2) % len]
    triad.push(e)
  }
  return triad

}

module.exports = triad
