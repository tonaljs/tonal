'use strict'

/**
 * Create a lookup function for two hash maps, the real data and aliases.
 *
 * Used by scales and chords
 */
function lookup (data, aliases) {
  return function (name) {
    var value = (data[name] || data[aliases[name]])
    return value ? value.split(' ') : null
  }
}

module.exports = lookup
