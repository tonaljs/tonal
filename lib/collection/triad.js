var pitchSet = require('../collection/pitchSet')
var letter = require('../pitch/letter')

/**
 * Get a triad from a collection of notes, a simplistic implementation.
 *
 * @param {String|Array} set - the pitch class set
 * @param {Integer} len - the number of notes of the triad (3 by default)
 *
 * @example
 * triad(scale('C major')) // => ['C', 'E', 'G']
 * triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']
 */
function triad (set, len) {
  if (!set) return null
  len = len || 3
  set = pitchSet(set)

  var triad = [ set[0] ]
  len--

  var nextLetter, thirths
  for (var i = 0; i < len; i++) {
    // calc next pitch letter (2 steps away)
    nextLetter = letter(triad[i], 2)
    // filter pitches with this letter
    thirths = set.filter(function (pitch) {
      return pitch[0] === nextLetter
    })
    // no thirth, triad not possible
    if (!thirths.length) return null
    // return first one (too simple, bah...)
    triad.push(thirths[0])
  }
  return triad
}

module.exports = triad
