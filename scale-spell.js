'use strict'

module.exports = spell

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7']

function spell (num) {
  var binary = /^[01]+$/.test(num) ? num : (+num).toString(2)
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  if (result.length === 7) normalizeHeptatonic(result)
  return result
}

var SUBSTITUTIONS = {'m3': 'A2', 'P5': 'd6', 'd5': 'A4', 'm6': 'A5', 'M3': 'd4', 'm7': 'A6'}
function normalizeHeptatonic (result) {
  var number, substitute
  for (var i = 0; i < 7; i++) {
    number = result[i][1]
    if (number !== '' + (i + 1)) {
      substitute = SUBSTITUTIONS[result[i]]
      if (substitute) result[i] = substitute
    }
  }
}
