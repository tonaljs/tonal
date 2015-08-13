var isBinary = require('./is-binary')
var isDecimal = require('./is-decimal')
var isScale = require('./is-scale')

function intervals (dictionary, identifier) {
  if (dictionary && dictionary(identifier)) identifier = dictionary(identifier)

  if (isBinary(identifier)) {
    return binaryIntervals(identifier)
  } else if (isDecimal(identifier)) {
    return binaryIntervals(identifier.toString(2))
  } else if (isScale(identifier)) {
    return identifier
  } else {
    throw Error('Not valid scale identifier: ' + identifier)
  }
}

module.exports = intervals

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7']

function binaryIntervals (binary) {
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  return result
}
