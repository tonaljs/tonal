var parse = require('./parse')
/**
 * Get a list of notes or isInterval
 *
 * This is the principal function to create lists. Basically does the same as
 * `list/parse` but if an array is given, it returns it without modification
 * or validation (so, only pass an array when you are sure that is a valid list)
 *
 * @param {String|Array} list - the list to be parsed or passed
 * @return {Array} an array list of notes or intervals (or anything it you pass
 * an array to the function)
 *
 * @example
 * list('c d# e5') // => ['C4', 'D#4', 'E5']
 * list('P1 m2') // => ['P1', 'm2']
 * list('bb2') // => ['Bb2']
 * list('101') // => ['P1', 'M2']
 * // to validate an array
 * list(['C#3', 'P2'].join(' ')) // => null
 */
function list (l) {
  if (Array.isArray(l)) return l
  else return parse(l)
}

module.exports = list
