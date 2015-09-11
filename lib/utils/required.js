/**
 * Force a value to be required and throws an exception if not
 *
 * @example
 * require(interval('m2'), 'Interval not valid: ', 'm2')
 * @api private
 */
function required (value, error, cause) {
  if (value) return value
  else throw Error(error + cause)
}

module.exports = required
