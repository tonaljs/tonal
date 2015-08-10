'use strict'

var parse = require('./parse-note')
var diatonicNumber = require('./diatonic-number')
var midi = require('./midi')
var intervalNames = require('./interval-names')

/*
 * Get the interval between two notes
 *
 * @example
 *    var distance = require('tonal/distance')
 *    distance('C3', 'G3') // => 'P5'
 */
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
