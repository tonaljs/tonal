'use strict'

var transpose = require('note-transposer')
var semitones = require('semitones')
var pitchSet = require('pitch-set')
var parse = require('music-notation/pitch/parse')
var distanceTo = require('note-interval')

var SCALE = '1 2b 2 3b 3 4 4# 5 6b 6 7b 7'.split(' ')

module.exports = function (scale, tonic, length) {
  scale = scale || SCALE
  scale = pitchSet(scale, null).map(parse)
  if (scale[0].length !== 2) {
    scale = scale.map(distanceTo(scale[0]))
  }
  var g = generator(scale, tonic)
  if (typeof length === 'number') return take(length, g)
  else if (typeof length === 'string') return until(length, g)
}

function generator (scale, tonic) {
  var size = scale.length
  return function (i) {
    var step = scale[i % size]
    var ivl = [step[0], step[1] + Math.floor(i / size)]
    return transpose(tonic, ivl)
  }
}

function take (len, gen) {
  var result = []
  for (var i = 0; i < len; i++) result.push(gen(i))
  return result
}

function until (limit, gen) {
  limit = semitones(limit)
  var result = []
  var i = 0
  var note = gen(i)
  while (semitones(note) <= limit) {
    result.push(note)
    i++
    note = gen(i)
  }
  return result
}
