var pitchSet = require('music-scale')
var interval = require('music-notation/interval/parse')
var roman = require('music-notation/roman/parse')
var transpose = require('note-transpose')
var gamut = require('music-gamut')
var props = require('music-notation/array/to-props')

function inv (i) { return [-i[0], -i[1]] }

module.exports = function triads (notes, size, grade, tonic) {
  if (arguments.length === 2) return function (g, t) { return triads(notes, size, g, t) }
  var set = pitchSet(notes, false).map(interval)
  var g = roman(grade)
  var index = selectGrade(g, set)
  if (!index) return null
  var scale = gamut.rotate(1, set.map(transpose(inv(set[index]))))
  var grades = scale.reduce(function (g, ivl) {
    var grade = props(ivl)[0]
    g[grade] = ivl
    return g
  }, {})
  return [1, 3, 5, 7].map(function (i) { return grades[i - 1] }).map(transpose(tonic))
}

function selectGrade (g, set) {
  for (var i = 0; i < set.length; i++) {
    if (g[0] === set[i][0]) return i
  }
  return null
}
