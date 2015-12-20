'use strict'

var chords = require('./chords.json')
var dictionary = require('music-dictionary')

/**
 * A chord dictionary. Get chord data from a chord name.
 *
 * @name chord
 * @function
 * @param {String} name - the chord name
 * @see music-dictionary
 *
 * @example
 * // get chord data
 * var chord = require('chord-dictionary')
 * chord('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
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
