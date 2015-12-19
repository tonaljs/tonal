'use strict'

var alterations = require('./alterations')
var transpose = require('note-transpose')

/**
 * Get a list of altered notes in the appropriate order
 *
 * @name key.altNotes
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the altered notes ordered or an empty array
 * if its not a valid key name
 *
 * @example
 * key.altNotes('F major') // => ['Bb']
 * key.altNotes('Eb major') // => ['Bb', 'Eb', 'Ab']
 * key.altNotes('A major') // => ['F#', 'C#', 'G#']
 */
module.exports = function (k) {
  var a = alterations(k)
  if (a === null) return null
  var notes = []
  var tonic = a > 0 ? 'B' : 'F'
  var interval = a > 0 ? [1, 0] : [-1, 0]
  var l = Math.abs(a)
  for (var i = 0; i < l; i++) {
    tonic = transpose(tonic, interval)
    notes.push(tonic)
  }
  return notes
}
