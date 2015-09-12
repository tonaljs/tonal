var props = require('./props')

/**
 * Simplify an interval
 *
 * @param {String} interval - the interval to be simplified
 * @param {boolean} ascending - (optional) if true, the simplified interval will
 * be always ascending
 *
 * @example
 * simplify('M9') // => 'M2'
 * simplify('M-9') // => 'M-2'
 * simplify('M-9', true) // => 'M2'
 *
 * @module interval
 */
function simplify (interval, ascending) {
  var i = props(interval)
  var dir = (ascending || i.dir === 1) ? '' : '-'
  return dir + i.simple + i.quality
}

module.exports = simplify
