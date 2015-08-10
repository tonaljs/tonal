'use strict'

var parse = require('./parse-note')

var PITCHCLASSES = 'CDEFGABCDEFGAB'

function diatonicNumber (a, b, descendent) {
  a = parse(a)
  b = parse(b)
  var indexA = PITCHCLASSES.indexOf(a.pc)
  var indexB = PITCHCLASSES.indexOf(b.pc, indexA)
  var mod = descendent ? -8 : 1
  return indexB - indexA + mod
}

module.exports = diatonicNumber
