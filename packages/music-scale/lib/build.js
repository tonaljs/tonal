'use strict'

/**
 * Create a scale from a gamut and a tonic. A scale is a set of notes or
 * intervals ordered by frequency with a tonic.
 *
 * A source can be a list of intervals or notes.

 * The tonic can be a note (with or without octave), false to get the scale
 * intervals or null to set the first note of the source as tonic
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
 *
 * @name scale.scale
 * @function
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var scale = require('music.kit/scale/scale')
 * // basic usage
 * scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
 * scale('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
 *
 * @example
 * // uses first note of the source as tonic
 * scale('c d e f g a b c d e', null) // => []
 *
 * @example
 * // partially applied
 * var dorian = scale('D E F G A B C')
 * dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
 */
module.exports = require('pitch-set')
