/**
 * Return the type ('perfect' or 'major') of the generic interval
 *
 * A generic interval its the number of a diatonic interval
 *
 * @param {Integer} number - the generic interval (positive or negative, can't be zero)
 * @return {String} the type ('perfect' or 'major')
 *
 * @example
 * genericType(1) // 'perfect'
 * genericType(4) // 'perfect'
 * genericType(5) // 'perfect'
 * genericType(8) // 'perfect'
 * genericType(9) // 'major'
 */
function genericType (number) {
  if (number === 0) throw Error('Invalid generic interval: ' + number)
  var n = (Math.abs(number) - 1) % 7
  if (n === 0 || n === 3 || n === 4) return 'perfect'
  else return 'major'
}

module.exports = genericType
