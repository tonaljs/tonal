'use strict'

var dictionary = require('../collection/dictionary')
var data = require('./data/scales.json')
var aliases = require('./data/aliases.json')

/**
 * Get the intervals of a scale name (without tonic). Is uses a json dictionary.
 *
 * @param {String} name - the scale name (without tonic)
 * @return {Array} the intervals or null if not found
 *
 * @name intervals
 *
 * @example
 * intervals('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
 */
module.exports = dictionary(data, aliases)
