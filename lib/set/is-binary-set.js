'use strict'

var BINARY = /^1[01]*$/

/**
 * Determine if a given number is a valid binary set number
 *
 * A valid binary set is any binary number that starts with 1 (P1 interval)
 * The binary number can be expressed in decimal
 *
 * @param {String} number - the number to test
 * @return {boolean} true if its a valid scale binary number
 *
 * @example
 * isBinary('100') // => true
 * isBinarySet(2773) // => true
 * isBinarySet('010') // => false
 */
function isBinarySet (number) {
  return BINARY.test(number.toString(2))
}

module.exports = isBinarySet
