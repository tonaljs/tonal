'use strict'

var harmonize = require('../sequence/harmonize')
var parse = require('./parse')
var set = require('../sequence/pitchSet')
var data = require('./scales-all.json')

/**
 * Given a scale name, returns its pitches or intervals
 *
 * @param {String} name - the scale name
 * @return {Array} an array of intervals or notes (if tonic is present)
 *
 * @example
 * scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
 * scale('bebop') // => '1P 2M 3M 4P 5P 6M 7m 7M'
 */
function scale (name) {
  name = parse(name)
  if (!name) return null
  else if (!name.tonic) return data[name.type]
  else return harmonize(name.tonic, data[name.type], true)
}

module.exports = scale
