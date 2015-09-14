/**
 * Simplest and fastest memoize function I can imagine
 *
 * This is in base of two restrictive asumptions:
 * - the function only receives __one paramater__
 * - the parameter __is a string__
 *
 * For a more complete memoize solution see:
 * https://github.com/addyosmani/memoize.js
 *
 * @api private
 * @param {Function} func - the function to memoize
 * @return {Function} A memoized function
 */
function memoize (func) {
  var cache = {}
  return function (str) {
    return (str in cache) ? cache[str] : cache[str] = func(str)
  }
}
module.exports = memoize
