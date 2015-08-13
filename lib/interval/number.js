var parse = require('./parse')

/**
 * Return the number (diatonic number or generic interval) of an interval
 */
function number (interval) {
  return parse(interval)[2]
}
module.exports = number
