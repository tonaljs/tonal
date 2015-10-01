'use strict'

var data = Object.keys(require('./data/intervals.json'))
var aliases = Object.keys(require('./data/aliases.json'))

/**
 * Get all known scale names
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
function names (noAlias) {
  return noAlias ? [].concat(data) : data.concat(aliases)
}

module.exports = names
