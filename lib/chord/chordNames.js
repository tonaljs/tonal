'use strict'

var scales = require('./chords.json')
var aliases = require('./aliases.json')

/**
 * Get all known scale names
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
function chordNames () {
  return Object.keys(scales).concat(Object.keys(aliases))
}

module.exports = chordNames
