'use strict'

/**
 * Get the accidentals from an alteration number
 *
 * @param {Integer} alteration - the alteration number
 * @return {String} the accidentals string
 *
 * @example
 * alterToAcc(1) // => '#'
 * alterToAcc(3) // => '###'
 * alterToAcc(0) // => ''
 * alterToAcc(-1) // => 'b'
 * alterToAcc(-2) // => 'bb'
 */
function alterToAcc (number) {
  return Array(Math.abs(number) + 1).join(number < 0 ? 'b' : '#')
}

module.exports = alterToAcc
