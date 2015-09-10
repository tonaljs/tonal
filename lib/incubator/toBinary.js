var intervals = require('../harmonizer/intervals')
var props = require('../interval/props')

/**
 * Return a binary representation of a intervals
 *
 * The binary representation of a set is a binary number in which the first
 * digit is always 1 (the 'P1' interval). It's important to note that
 * `set === intervals(binary(set))` is not always true (you loose some
 * information when converting to a binary set)
 *
 * @param {Array|Integer|Binary} set - the set to get the binary from
 * @return {String} the binary string representation of that set
 */
function toBinary (set) {
  var nums = intervals(set).map(function (i) { return props(i).semitones }).sort()
  var max = Math.max.apply(null, nums) + 1
  var binary = new Uint8Array(max)
  nums.forEach(function (num) { binary[num] = 1 })
  return binary.join('')
}

module.exports = toBinary
