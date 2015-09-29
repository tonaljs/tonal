'use strict'

var BINARY = /^1[01]{11}$/

/**
 * Check if a number is a valid binary scale
 */
function isValid (binaryScale) {
  return binaryScale && BINARY.test(binaryScale)
}

module.exports = isValid
