var parse = require('./parse')

/**
 * Get the interval direction (1 ascending, -1 descending)
 *
 * @param {String} interval - the interval
 * @return {Integer} the direction (1: ascending interval, -1: descending interval)
 *
 * @module interval
 * @example
 * direction('P5') // => 1
 * direction('P-4') // => -1
 */
function direction (interval) {
  return parse(interval).d
}
module.exports = direction
