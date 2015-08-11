'use strict'

var REGEX = /^1[01]{11}$/

/**
 * Determine if a given binary string represents a valid scale
 *
 * A valid binary number is a 12 digit binary number with a 1 in the first position
 *
 * @param {String} binary - the binary number
 * @return {boolean} true if its a valid scale binary number
 */
function isScaleBinaryNumber(binary) {
  return REGEX.test(binary)
}

module.exports = isScaleBinaryNumber
