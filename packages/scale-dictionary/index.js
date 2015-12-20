'use strict'

var scales = require('./scales.json')
var dictionary = require('music-dictionary')

/**
 * A scale dictionary. Get scale from a scale name and a tonic.
 *
 * The dictionary has a `names` property with all scale names.
 *
 * @name scale
 * @function
 * @param {String} name - the scale name
 * @see music-dictionary
 *
 * @example
 * // get scale data
 * var scale = require('scale-dictionary')
 * scale('Ab major') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
 * scale('major', 'Ab') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
 * // get scale intervals
 * scale('major', false) // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 *
 * @example
 * // get it from aliases, binary or decimal numbers
 * scale('major') === scale('ionian') === scale('101011010101') === scale(2773)
 *
 * @example
 * // get scale names
 * scale.names // => ['major', 'dorian', ...]
 */
module.exports = dictionary(scales)
