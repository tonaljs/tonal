'use strict'

var chords = require('./chords.json')
var dictionary = require('music-dictionary')

/**
 * Get chord data from a chord name.
 *
 * @function props
 * @memberof chord
 * @function
 * @param {String} name - the chord name
 * @see music-dictionary
 *
 * @example
 * var chord = require('chord-dictionary')
 *
 * // get chord notes and intervals
 * chord('CMaj7') // => ['C', 'E', 'G', 'B']
 * chord('Maj7', 'C') // => ['C', 'E', 'G', 'B']
 * chord('Maj7') // => ['P1', 'M3', 'P5', 'M7']
 *
 * @example
 * // get chord properties
 * chord.props('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
 *                //      intervals:  [ ...],
 *                //      binary: '100010010001', decimal: 2193 }
 *
 * @example
 * // get it from aliases, binary or decimal numbers
 * chord('Maj7') === chord('M7') === chord('100010010001') === chord(2913)
 *
 * @example
 * // get chord names
 * chord.names // => ['Maj7', 'm7', ...]
 */
module.exports = dictionary(chords)
