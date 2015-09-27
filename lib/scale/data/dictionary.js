'use strict'

var dictionary = require('../../collection/dictionary')
var data = require('./scales.json')
var aliases = require('./aliases.json')

/**
 * Get the intervals of a scale name (without tonic)
 *
 * @param {String} name - the scale name (without tonic)
 * @return {Array} the intervals or null if not found
 *
 * @name generic
 *
 * @example
 * generic('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
 */
module.exports = dictionary(data, aliases)
