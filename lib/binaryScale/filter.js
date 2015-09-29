
var numbers
var all = function (e) { return true }

/**
 * Get all binary scale numbers filtered by a function
 *
 * @param {Function} filter - (Optional) a filter function
 * @return {Array} an array of binary numbers. 2048 if no filter
 *
 * @example
 * binarySets() // => ['1000000000', '1000000001', ...]
 */
function binarySets (filter) {
  filter = filter || all
  if (!numbers) {
    numbers = []
    for (var i = 2048; i < 4096; i++) {
      numbers.push(i.toString(2))
    }
  }
  return numbers.filter(filter)
}

module.exports = binarySets
