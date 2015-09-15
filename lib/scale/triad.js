var pitchSet = require('../set/pitchSet')
var letter = require('../pitch/letter')

/**
 * Get a triad from a set, a simplistic implementation.
 *
 * @param {String|Array} set - the pitch class set
 * @param {Integer} len - the number of notes of the triad (3 by default)
 *
 * @example
 * triad(scale('C major')) // => ['C', 'E', 'G']
 * triad(scale('C major'), 4) // => ['C', 'E', 'G', 'B', 'D']
 */
function triad (set, len) {
  var next, thirths
  set = pitchSet(set)
  len = (len || 3) - 1
  var triad = [ set[0] ]
  for (var i = 0; i < len; i++) {
    next = letter(triad[i], 2)
    thirths = set.filter(function (pc) {
      return pc[0] === next
    })
    if (!thirths.length) return null
    triad.push(thirths[0])
  }
  return triad
}

module.exports = triad
