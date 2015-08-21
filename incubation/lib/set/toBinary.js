var isBinary = require('../list/isBinary')
var semitones = require('../interval/semitones')
var intervals = require('../list/intervals')

// TODO: performance?

/**
 * Return a binary representation of the set
 *
 * The binary representation of a set is a binary number in which the first
 * digit is always 1 (the 'P1' interval). It's important to note that
 * `set === intervals(binary(set))` is not always true (you loose some
 * information when converting to a binary set)
 *
 * @param {Array|Integer|Binary} set - the set to get the binary from
 * @return {String} the binary string representation of that set
 */
function binary (set) {
  if (isBinary(set)) return set
  var nums = intervals(set).map(semitones)
  var max = Math.max.apply(null, nums) + 1
  var binary = []
  for (var i = 0; i < max; i++) {
    binary.push('0')
  }
  nums.forEach(function (num) { binary[num] = '1' })
  return binary.join('')
}

module.exports = binary
