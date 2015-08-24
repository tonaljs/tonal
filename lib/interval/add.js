var strict = require('../utils/strict')
var parse = strict('Interval not valid', require('./parse'))
var interval = require('./interval')
var semitones = require('./semitones')

/**
 * Add two intervals
 *
 * @param {String} interval1 - the first interval
 * @param {String} interval2 - the second interval
 * @return {String} the resulting interval
 *
 * @example
 * add('M2', 'M2') // => 'M3'
 */
function add (i1, i2) {
  if (arguments.length === 1) {
    return function (i2) {
      return add(i1, i2)
    }
  }
  i1 = parse(i1)
  i2 = parse(i2)

  var num = i1.dir * (i1.num - 1) + i2.dir * (i2.num - 1)
  num = num < 0 ? -num + 1 : num + 1
  var size = semitones(i1) + semitones(i2)
  return fromNumAndSize(num, size)
}

module.exports = add

// create an interval from a number and a size
function fromNumAndSize (num, size) {
  if (num === -1) num = 1
  var dir = size < 0
  // create a reference interval
  var ref = interval(num)
  var refSize = semitones(ref)
  // get the difference in sizes
  var diff = Math.abs(size) - refSize
  var oct = Math.floor(Math.abs(diff) / 12)
  diff = diff % 12

  return interval(num, diff, oct, dir)
}
