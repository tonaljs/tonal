var chroma = require('./chroma')
var octave = require('./octave')
var pitchStr = require('./pitchStr')

var LETTERS = 'CDEFGAB'

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
  var c1 = chroma(src)
  var c2 = chroma(step)
  if (c1 === null || c2 === null) return null
  var oct = octave(src)

  var dist = c1 - c2
  if (dist > 6) {
    dist = dist - 12
    oct++
  } else if (dist < -6) {
    dist = dist + 12
    oct--
  }

  var num = LETTERS.indexOf(step[0]) + 1
  return pitchStr([num, dist, oct - 4])
}

module.exports = enharmonic
