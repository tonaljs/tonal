'use strict'

var names = Object.keys(require('./data/scales.json'))
var aliases = Object.keys(require('./data/aliases.json'))

/**
 * Get all known scale names
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
function scaleNames (noAlias) {
  return noAlias ? [].concat(names) : names.concat(aliases)
}

module.exports = scaleNames
