var toFifths = require('./toFifths')
var fromFifths = require('./fromFifths')
var pitchStr = require('./pitchStr')

function transpose (pitch, interval) {
  if (arguments.length === 1) return apply(pitch)
  var p = toFifths(pitch)
  var i = toFifths(interval)
  var add = [ p[0] + i[0], p[1] + i[1] ]

  return pitchStr(fromFifths(add))
}

function apply (pitch) {
  return function (interval) {
    return transpose(pitch, interval)
  }
}

module.exports = transpose
