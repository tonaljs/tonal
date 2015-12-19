'use strict'

var data = require('./scales.json')
var dictionary = require('music-dictionary')

/**
 * Get a scale by name using a dictionary.
 *
 * You can get scale notes by passing a tonic or the scale intervals by passing
 * `false` as tonic
 *
 * There is two ways to get a scale:
 *
 * - With tonic included in name: `scale('C major')`
 * - With name and tonic: `scale('major', 'C')`
 *
 * This function can be partially applied (see examples)
 *
 * @name scale
 * @function
 * @param {String} name - the scale name (optionally can include the tonic)
 * @return {Object} a data object with the scale properties
 *
 * @example
 * var scale = require('music.scale')
 * // with name and tonic
 * scale('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // with tonic inside the name
 * scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * // partially applied
 * var major = scale('major')
 * major('C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 */
module.exports = dictionary(data)
