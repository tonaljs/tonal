/**
 * Simplest and fast memoize function
 *
 * This is base in two restrictive asumptions:
 * - the function only receives __one paramater__
 * - the parameter __is a string__
 *
 * The idea is to be fast and small.
 *
 * For a more complete memoize solution see:
 * https://github.com/addyosmani/memoize.js
 *
 * @api private
 * @param {Function} the function to memoize
 * @return A memoized function
 */
function memoize (func) {
  var cache = {}
  return function (str) {
    return (str in cache) ? cache[str] : cache[str] = func(str)
  }
}
module.exports = memoize
