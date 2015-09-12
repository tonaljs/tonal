'use strict'

var data = require('./scales.json')
var aliases = require('./aliases.json')
/**
 * Get the intervals of a scale name
 *
 * @param {String} name - the scale name
 * @return {Array} the intervals or null if not found
 *
 */
function intervals (name) {
  return data[name] || data[aliases[name]]
}

module.exports = intervals
