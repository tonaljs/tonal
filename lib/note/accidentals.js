/**
 * Given an alteration number, get the accidentals string
 *
 * @param {Integer} number - the number of accidentals (posivite for shaprs,
 * negative for flats, zero for an empty string)
 * @return {String} an accidentals string
 *
 * @example
 * var accidentals = require('tonal/note/accidentals')
 * accidenals(2) // => '##'
 * accidenals(-2) // => 'bb'
 * accidenals(0) // => ''
 */
function accidentals (value) {
  value = +value
  if (value > 0) return Array(value + 1).join('#')
  else if (value < 0) return Array(Math.abs(value) + 1).join('b')
  else return ''
}

module.exports = accidentals
