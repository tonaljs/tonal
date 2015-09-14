var props = require('./props')
var pitch = require('./pitch')

/**
 * Get the enharmonic of a pitch with a given step
 *
 * @params {String} pitch - the pitch to get the enharmonic from
 * @params {String} letter - the desired letter of the enharmonic
 * @return {String} the enharmonic pitch name
 *
 * @example
 * enharmonic('C#4', 'D') // => 'Db4'
 * enharmonic('B#', 'C') // => 'C'
 */
function enharmonic (src, step) {
  src = props(src)
  step = props(step)
  if (!src || !step) return null

  var oct = src.oct
  var dist = src.chroma - step.chroma
  if (dist > 6) {
    dist = dist - 12
    oct++
  } else if (dist < -6) {
    dist = dist + 12
    oct--
  }
  return pitch(step, oct, dist)
}

module.exports = enharmonic
