'use strict'

var data = require('./chords.json')
var aliases = require('./aliases.json')

/**
 * Get the intervals of a chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the intervals or null if not found
 *
 */
function intervals (name) {
  return data[name] || data[aliases[name]]
}

module.exports = intervals
