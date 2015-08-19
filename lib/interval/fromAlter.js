var parse = require('./parse')
/**
 * Modify an interval by an alteration amount
 *
 * @param {String} interval - the interval to be modified
 * @param {Integer} amount - (Options) the amount of alteration you want (positive or
 * negative integers are allowed). It's 0 by default.
 * @return {String} the modified interval
 *
 * @example
 * quality('P5', 1) // => 'A5'
 * quality(5, 1) // => 'A5'
 * quality(5, -1) // => 'd5'
 * quality(5, 0) // => 'P5'
 * quality('A5', 0) // => 'A5'
 * quality('M3', 1) // => 'A3'
 * quality(3, -1) // => 'A3'
 */
function fromAlter (interval, amount) {
  amount = amount || 0
  var quality, num, generic, perfectable, alter, dir
  if (isNaN(interval)) {
    interval = parse(interval)
    num = interval.num
    dir = interval.dir
    generic = interval.generic
    perfectable = interval.perfectable
    alter = interval.alter + amount
  } else {
    num = interval
    dir = 1
    if (num === 0) throw Error('0 is not a valid interval number')
    generic = (Math.abs(num) - 1) % 7
    perfectable = generic === 0 || generic === 3 || generic === 4
    alter = amount
  }

  if (perfectable) {
    if (alter > 0) quality = Array(alter + 1).join('A')
    else if (alter < 0) quality = Array(-alter + 1).join('d')
    else quality = 'P'
  } else {
    if (alter > 0) quality = Array(alter + 1).join('A')
    else if (alter < -1) quality = Array(-alter).join('d')
    else if (alter === -1) quality = 'm'
    else quality = 'M'
  }
  return quality + (dir * num)
}

module.exports = fromAlter
