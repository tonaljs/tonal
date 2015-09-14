'use strict'

var data = require('./scales.json')
var aliases = require('./aliases.json')
/**
 * Get a generic scale (the intervals) from a scale name without tonic
 *
 * @param {String} name - the scale name
 * @return {Array} the intervals or null if not found
 *
 * @example
 * generic('C major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
 */
function generic (name) {
  var value = (data[name] || data[aliases[name]])
  return value ? value.split(' ') : null
}

module.exports = generic
