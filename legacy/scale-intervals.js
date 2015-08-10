
module.exports = intervals

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7']

function intervals (binary) {
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  return result
}

var DIGITS = [ /P1/, /A1|m2/, /M2|d3/, /A2|m3/, /M3|d4/, /A3|P4/, /A4|d5/, /P5|d6/, /A5|m6/, /M6|d7/, /A6|m7/, /M7|d8/ ]
intervals.toBinary = function (list) {
  if (Array.isArray(list)) list = list.join(',')
  var binary = []
  DIGITS.forEach(function (digit) {
    binary.push(digit.test(list) ? 1 : 0)
  })
  return binary.join('')
}
