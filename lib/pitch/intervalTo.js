
var interval = require('./interval')

/**
 * Get a function that returns a interval to a pitch
 *
 * @param {String} to - the destination pitch
 * @return {Function} a function that returns a interval from a pitch
 * to the destination one
 *
 * @example
 * ['C', 'D', 'E'].map(intervalTo('E')) // => ['3M', '2M', '1P']
 *
 */
function intervalTo (to) {
  return function (from) { return interval(from, to) }
}

module.exports = intervalTo
