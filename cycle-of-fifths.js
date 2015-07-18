'use strict'

var CYCLE = 'Abb Ebb Bbb Fb Cb Gb Db Ab Eb Bb F C G D A E B F# C# G# D# A# F'.split(' ')
var CENTER = 11

module.exports = function (number) {
  var number = (+number % 12) + CENTER
  return CYCLE[number]
}
