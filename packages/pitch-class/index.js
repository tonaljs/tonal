'use strict'

var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var op = require('music-notation/operation')
var PC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

/**
 * Get pitch class of a note or a midi number
 *
 * @name note.pitchClass
 * @param {String|Array|Integer} note - the note or midi number
 * @return {String} the pitch class
 *
 * @example
 * var pc = require('pitch-class')
 * pc('fx3') // => 'F##'
 * pc(70) // => 'Bb'
 */
module.exports = op(parse, str, function (note) {
  if (Array.isArray(note)) return [note[0]]
  else if (/\d+/.test(note)) return PC[(+note % 12)]
  return null
})
