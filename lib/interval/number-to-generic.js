
/**
 * Give a interval number, returns a [generic interval](https://en.wikipedia.org/wiki/Generic_interval)
 *
 * @param {Integer} number - the interval number
 * @return {Integer} the generic interval (an integer bewteen 0 and 6)
 */
function numberToGeneric (num) {
  if (num === 0) throw Error('0 is not a valid interval number')
  var dir = num > 0 ? 1 : -1
  return dir * (Math.abs(num) - 1) % 7
}
module.exports = numberToGeneric
