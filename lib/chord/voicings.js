'use strict'

var data = require('./data/chord-voicings.json')
var aliases = require('./data/chord-aliases.json')

/**
 * Get a voice (array of intervals) or a list of voicings for a given chord type
 *
 * @param {String} chordType - the type of the chord
 * @param {String} voiceName - (Optional) the voice name
 * @return {Array} an array of intervals (if voiceName is provided and it's a
 * valid voice) or an array of strings with voice names (if voiceName is not given)
 *
 * @example
 * voicings('Maj7') // => ['left-hand-A', 'left-hand-B',..]
 * voicings('Maj7', 'left-hand-A') // => ['3M', '5P', '7M']
 */
function voicings (chord, voice) {
  chord = aliases[chord] || chord
  var voicings = data[chord] || {}
  if (!voice) return Object.keys(voicings)
  else return voicings[voice] ? voicings[voice].split(' ') : null
}

module.exports = voicings
