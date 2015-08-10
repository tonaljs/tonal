'use strict'

var parse = require('./parse-note')
var intervalNumber = require('./interval-number')
var midi = require('./midi')
var intervalNames = require('./interval-names')

/**
 * Get the interval name of the distsance between two notes
 *
 * @param {Note|String} noteA - source note
 * @param {Note|String} noteB - destination note
 * @return {String} - the interval name
 *
 * @example
 *    var distance = require('tonal/distance')
 *    distance('C3', 'G3') // => 'P5'
 */
function distance (noteA, noteB) {
  noteA = parse(noteA)
  noteB = parse(noteB)
  var distance = midi(noteB) - midi(noteA)
  var num = '' + intervalNumber(noteA.pc, noteB.pc, distance < 0)
  var name = intervalNames(distance).filter(function (name) {
    return name.indexOf(num) > 0
  })
  return name
}

module.exports = distance
