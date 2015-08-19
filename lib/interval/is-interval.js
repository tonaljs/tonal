var parse = require('./parse')
/**
 * Test if a string is a valid interval
 *
 * @param {String} interval - the interval to be tested
 * @return {Boolean} true if its a valid interval
 *
 * @example
 * isInterval('blah') // false
 * isInterval('P5') // true
 * isInterval('P6') // false
 */
function isInterval (interval) {
  return parse(interval) !== null
}

module.exports = isInterval
