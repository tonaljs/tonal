'use strict'

var lookup = require('../internal/lookup')
var data = require('./scales.json')
var aliases = require('./scale-aliases.json')
/**
 * Get a generic scale (the intervals) from a scale name without tonic
 *
 * @param {String} name - the scale name
 * @return {Array} the intervals or null if not found
 *
 * @name generic
 * @module scale
 *
 * @example
 * generic('C major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
 */
module.exports = lookup(data, aliases)
