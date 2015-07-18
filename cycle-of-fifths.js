'use strict'

module.exports = cycle

// var CYCLE = 'Abb Ebb Bbb Fb Cb Gb Db Ab Eb Bb F C G D A E B F# C# G# D# A# F'.split(' ')
var ASC = 'C G D A E B F# C# G# D# A# F'.split(' ')
var DESC = 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb'.split(' ')

function cycle (number, size, reverse) {
  if (!size) return number < 0 ? DESC[Math.abs(number) % 12] : ASC[number % 12]
  var result = []
  var source = reverse ? DESC : ASC
  if (number < 0) number = 12 + (number % 12)
  for (var i = number, len = number + size; i < len; i++) {
    result.push(source[i % 12])
  }
  return result
}
