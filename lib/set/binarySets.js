
var numbers
var all = function (e) { return true }

/**
 * Return all possible set binary numbers
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
