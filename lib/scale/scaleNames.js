'use strict'

var scales = require('./scales.json')
var aliases = require('./scale-aliases.json')

/**
 * Get all known scale names
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
function scaleNames () {
  return Object.keys(scales).concat(Object.keys(aliases))
}

module.exports = scaleNames
