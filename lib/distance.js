var parse = require('./parse-note')
var diatonicNumber = require('./diatonic-number')
var midi = require('./midi')
var intervalNames = require('./interval-names')

function distance (noteA, noteB) {
  noteA = parse(noteA)
  noteB = parse(noteB)
  var distance = midi(noteB) - midi(noteA)
  var num = '' + diatonicNumber(noteA, noteB, distance < 0)
  var name = intervalNames(distance).filter(function (name) {
    return name.indexOf(num) > 0
  })
  return name
}

module.exports = distance
