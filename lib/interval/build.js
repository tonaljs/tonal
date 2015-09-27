'use strict'

var props = require('./props')

var QUALITIES = {
  P: {'-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA'},
  M: {'-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA'}
}

/**
 * Build an interval (string) given a number, and optionally a quality
 * and octave.
 *
 * It can be used to check if a interval is a valid interval:
 * `build('5M') // => null`
 *
 * The first parameter can be another interval, but in this case the quality
 * and octave parameters will have precedence over the interval.
 *
 * @param {String|Integer} number - the interval number (can be negative to
 * express descengin intervals) or another interval
 * @param {String|Integer} quality|alteration - (Optional) the interval quality or
 * numberic alteration (0 is perfect or major). Can be null to avoid override the string
 * @param {Integer} oct - (Optional) the octaves. If negative, the direction of
 * the interval is descendent. 0 by default.
 *
 * @see interval/props
 *
 * @example
 * build(2) // => '2M'
 * build(2, 'm') // => '2m'
 * build(2, 'a', 1) // => '9A'
 * build(2, 'a', -1) // => '-9A'
 * build(2, null, 1) // => '9M'
 * build(-2, 'm', 1) // => '-9m'
 * build(-2, -1, 1) // => '-9m'
 * build(2, 'AA') // => '2AA'
 * build(2, 'AAA') // => null
 * build('2P') // => null
 */
function build (num, quality, oct) {
  var interval = isNaN(num) ? props(num) : fromNumber(num)

  if (!interval) return null
  else if (arguments.length === 1) return interval.name

  var dir, q
  oct = oct === 0 || oct ? oct : interval.oct
  dir = oct < 0 ? -1 : interval.dir
  oct = Math.abs(oct)

  if (typeof quality === 'undefined' || quality === null) {
    q = interval.quality
  } else if (/^dd|d|m|P|M|A|AA$/.test(quality)) {
    q = quality
    if (q === 'P' && interval.type === 'M') return null
    else if ((q === 'M' || q === 'm') && interval.type === 'P') return null
  } else {
    // try an alteration number
    q = QUALITIES[interval.type][quality]
  }

  return q ? dir * (interval.simple + 7 * oct) + q : null
}

function fromNumber (num) {
  var dir = num < 0 ? -1 : 1
  num = Math.abs(num)
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  return props((dir * num) + type)
}

module.exports = build
