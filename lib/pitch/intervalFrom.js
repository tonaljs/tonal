
var interval = require('./interval')

/**
 * Partial apply `picth/interval` to return a interval from a pitch
 *
 * @param {String} from - the base pitch
 * @return {Function} a function that returns a interval from the base pitch
 * to a given one
 *
 * @example
 * ['C', 'D', 'E'].map(intervalFrom('C')) // => ['1P', '2M', '3M']
 *
 */
function intervalFrom (from) {
  return function (to) { return interval(from, to) }
}

module.exports = intervalFrom
