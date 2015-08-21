'use strict'

var BINARY = /^1[01]{11}$/

/**
 * Determine if a given number is a valid binary list number
 *
 * A valid binary list is a binary number with two conditions:
 * - its 12 digit long
 * - starts with 1 (P1 interval)
 *
 * The binary number can be expressed in decimal as well (i.e 2773)
 *
 * @param {String} number - the number to test
 * @return {boolean} true if its a valid scale binary number
 *
 * @example
 * isBinary('101010101010') // => true
 * isBinary(2773) // => true
 * isBinary('001010101010') // => false (missing first 1)
 * isBinary('1001') // => false
 */
function isBinaryList (number) {
  return BINARY.test(number.toString(2))
}

module.exports = isBinaryList
