'use strict'

var transpose = require('../pitch/transpose')
var data = require('./data/scales.json')
var aliases = require('./data/aliases.json')
var IMPLICIT = /^([a-gA-G](?:#{1,4}|b{1,4}|x{1,2}|))(.*)$/

/**
 * Given a chord type return its scale names
 *
 * @param {String} tonic - (Optional) the chord tonic
 * @param {String} chord - the chord name
 * @return {Array} an array of scale names or an empty array if no scale names found
 *
 * @example
 * scaleNames('D', 'M7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic' ]
 * scaleNames('DM7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic']
 * scaleNames('M7b5') // => ['P1 lydian', '5d locrian pentatonic']
 * scaleNames('Bbmaj7') // => ['Bb4 major', 'Bb4 lydian', 'F5 major pentatonic', 'D5 bebop minor', ...]
 */
function scaleNames (tonic, chord) {
  if (arguments.length === 1) return scaleNames(null, tonic)

  chord = aliases[chord] || chord
  var scales = data[chord]
  if (!scales) {
    var m = IMPLICIT.exec(chord)
    if (m && data[m[2]]) return scaleNames(tonic || m[1], m[2])
    else return []
  }
  if (!tonic) return scales
  return scales.map(function (name) {
    var intrvl = name.slice(0, 2)
    return transpose(tonic, intrvl) + name.substring(2)
  })
}

module.exports = scaleNames
