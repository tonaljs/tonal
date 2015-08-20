var build = require('./build')
var isInterval = require('./isInterval')
/**
 * Given an interval, return its opposite
 *
 * @example
 * opposite('M2') // => 'M-2'
 * opposite('P-8') // => 'P8'
 */
function opposite (interval) {
  return isInterval(interval) ? build(interval, 0, 0, true) : null
}

module.exports = opposite
