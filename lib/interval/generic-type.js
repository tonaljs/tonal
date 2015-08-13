/**
 * Return the type ('perfect' or 'major') of the [generic interval](https://en.wikipedia.org/wiki/Generic_interval)
 *
 * A generic interval its the number of a diatonic interval
 *
 * @param {Integer} number - the generic interval (positive integer)
 * @return {String} the type ('perfect' or 'major')
 *
 * @example
 * genericType(0) // 'perfect'  <- unison
 * genericType(3) // 'perfect'  <- fourth
 * genericType(4) // 'perfect'  <- fifth
 * genericType(7) // 'perfect'  <- octave
 * genericType(8) // 'major'    <- nineth
 */
function genericType (generic) {
  var n = Math.abs(generic) % 7
  if (n === 0 || n === 3 || n === 4) return 'perfect'
  else return 'major'
}

module.exports = genericType
