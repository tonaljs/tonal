'use strict'

var names = Object.keys(require('./data/intervals.json'))
var aliases = Object.keys(require('./data/aliases.json'))

/**
 * Get all known chord names
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
function chordNames (noAlias) {
  return noAlias ? [].concat(names) : names.concat(aliases)
}

module.exports = chordNames
