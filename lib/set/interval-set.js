var isBinary = require('./is-binary-set')
var isIntervals = require('./is-interval-set')
var isNotes = require('./is-note-set')
var distance = require('../interval/fromNotes')
var chromatic = require('./chromatic-interval-set')

/**
 * Given a set identifier return the intervals
 *
 * @param {String|Decimal|Array} set - the set to get the intervals from
 * @return {Array} an array of intervals
 */
function intervalSet (set) {
  if (isBinary(set)) {
    return binaryIntervals(set.toString(2))
  }

  if (typeof (set) === 'string') set = set.split(' ')
  if (isIntervals(set)) {
    return set
  } else if (isNotes(set)) {
    var root = set[0]
    return set.map(function (note) {
      return distance(root, note)
    })
  }
}

module.exports = intervalSet

function binaryIntervals (binary) {
  var chroma = chromatic(binary.length)
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(chroma[i])
  }
  return result
}
