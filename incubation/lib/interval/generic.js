/**
 + Given an interval number, return its generic interval
 *
 * Probably you don't need this function. Use ´interval/parse´ to obtain the
 * generic number of an interval
 *
 * The generic interval is an object with two properties:
 * - num: {Integer} the generic number
 * - perfectable: {Boolean} if the generic interval is perfectable or note
 *
 * @param {Integer} number - the interval number
 * @return {Object} the generic interval object
 *
 * @api private
 */
function generic (number) {
  if (number === 0) return null
  var g = (Math.abs(number) - 1) % 7
  return { num: g, perfectable: g === 0 || g === 3 || g === 4 }
}

module.exports = generic
