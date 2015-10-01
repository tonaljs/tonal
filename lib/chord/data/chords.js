'use strict'

var dictionary = require('../../collection/dictionary')
var data = require('./intervals.json')
var aliases = require('./aliases.json')

/**
 * Get the intervals of a chord name (without tonic). It uses a json dictionary
 *
 * @param {String} name - the chord name
 * @return {Array} the intervals or null if not found
 *
 * @name intervals
 *
 * @example
 * intervals('maj7') // => ['1P', '3M', '5P', '7M']
 */
module.exports = dictionary(data, aliases)
