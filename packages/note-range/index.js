'use strict'

var midi = require('note-midi')
var note = require('midi-note')

module.exports = function (first, last, step) {
  step = step ? Math.abs(step) : 1
  var rev = false
  var r = []
  var min = midi(first)
  var max = midi(last)
  if (min > max) {
    min = max + (max = min, 0)
    rev = true
  }
  for (var i = min; i < max; i += step) {
    r.push(note(i))
  }
  r.push(note(i))
  return !rev ? r : r.reverse()
}
