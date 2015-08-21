'use strict'

var BINARY = /^1[01]*$/

/**
 * Determine if a given number is a valid binary list number
 *
 * A valid binary list is any binary number that starts with 1 (P1 interval)
 * The binary number can be expressed in decimal
 *
 * @param {String} number - the number to test
 * @return {boolean} true if its a valid scale binary number
 *
 * @example
 * isBinary('100') // => true
 * isBinaryList(2773) // => true
 * isBinaryList('010') // => false
 */
function isBinaryList (number) {
  return BINARY.test(number.toString(2))
}

module.exports = isBinaryList
