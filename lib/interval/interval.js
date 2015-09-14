'use strict'

var props = require('./props')

/**
 * Given a interval string, return it or null if not a valid interval
 *
 * @param {String} interval - the interval
 * @return {String} the interval if its valid, null otherwise
 *
 * @example
 * interval('5P') // => '5P'
 * interval('5M') // => null
 */
function interval (interval) {
  return props(interval) ? interval : null
}

module.exports = interval
