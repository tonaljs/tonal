var toList = require('./list')
var transpose = require('./transpose')
var interval = require('../interval/interval')

// TODO: check the list is smaller than an octave
/**
 * Return a list spanning a number of octaves
 *
 * @param {String|Array} list - the list
 * @param {Integer} number - the number of octaves
 * @return {Array} a list spanning the specified number of octaves
 *
 * @example
 * octaves('C D', 0) // => ['C4', 'D4']
 * octaves('C D', 1) // => ['C4', 'D4', 'C5']
 * octaves('C D', 2) // => ['C4', 'D4', 'C5', 'D5', 'C6']
 * octaves('P1 M2', 2) // => ['P1', 'M2', 'P8', 'M9', 'P15']
 */
function octaves (list, number) {
  list = toList(list)
  if (!number) return list
  var o = list
  for (var i = 1; i < number; i++) {
    o = o.concat(transpose(interval('P1', 0, i), list))
  }
  return o.concat(transpose(interval(1, 0, number), list[0]))
}

module.exports = octaves
