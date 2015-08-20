var distance = require('../interval/fromNotes')
var isBinary = require('./isBinaryList')
var isIntervals = require('./isIntervalList')
var isNotes = require('./isNoteList')
var chromatic = require('./chromaticList')

/**
 * Given a list identifier return the intervals
 *
 * @param {String|Decimal|Array} list - the list to get the intervals from
 * @return {Array} an array of intervals
 */
function intervalSet (list) {
  if (isBinary(list)) {
    return binaryIntervals(list.toString(2))
  }

  if (typeof (list) === 'string') list = list.split(' ')
  if (isIntervals(list)) {
    return list
  } else if (isNotes(list)) {
    var root = list[0]
    return list.map(function (note) {
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
