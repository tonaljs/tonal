'use strict'

var parse = require('./parse')
var harmonize = require('../pitch/harmonize')

var INTERVALS = {
  major: ['1P', '2M', '3M', '4P', '5P', '6M', '7M'],
  minor: ['1P', '2M', '3m', '4P', '5P', '6m', '7m']
}

/**
 * Get the pitch class set from a key.
 *
 * @param {String} key - the key name
 * @return {Array} a pitch class set
 *
 * @example
 * pitchSet('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
 * pitchSet('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
 */
function pitchSet (key) {
  key = parse(key)
  if (!key) return false

  return harmonize(key.tonic, INTERVALS[key.type], true)
}

module.exports = pitchSet
