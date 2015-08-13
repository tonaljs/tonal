'use strict'

var MIN = 2047
var MAX = 4096

/**
 * Determine if a given decimal number is a valid scale.
 *
 * A number is a valid decimal number if it's between 2048 and 4096
 *
 * @param {String} decimal - the decimal number
 * @return {boolean} true if its a valid scale decimal number
 * @see isScaleDecimalNumber
 */
function isDecimal (decimal) {
  return decimal > MIN && decimal < MAX
}

module.exports = isDecimal
