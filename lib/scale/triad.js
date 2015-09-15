var pitchSet = require('../set/pitchSet')
var letter = require('../pitch/letter')

function triad (set, len) {
  set = pitchSet(set)
  len = (len || 3) - 1
  var triad = [ set[0] ]
  for (var i = 0; i < len; i++) {
    var thirth = set.indexOf(letter(set[i], 2))
    if (thirth === -1) return null
    triad.push(set[thirth])
  }
}

module.exports = triad
