'use strict'

module.exports = require('./dictionary')
/**
 * Get a chord by name using a dictionary.
 *
 * There is two ways to get a chord:
 *
 * - With type and tonic: `chord.chord('Maj7', 'C')`
 * - With tonic included in name: `chord.chord('CMaj7')`
 *
 * To get chord intervals use  `false` as tonic
 *
 * This function can be partially applied (see examples)
 *
 * @name chord
 * @function
 * @param {String} name - the chord name (optionally can include the tonic)
 * @return {Object} a data object with the chord properties
 *
 * @example
 * var chord = require('music.chord')
 * // with name and tonic
 * chord('Maj7', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // with tonic inside the name
 * chord('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // partially applied
 * var major = chord('major')
 * major('C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 */
