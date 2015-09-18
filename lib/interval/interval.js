'use strict'

var props = require('./props')

var QUALITIES = {
  P: {'-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA'},
  M: {'-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA'}
}

/**
 * Get an interval properties from a string or a number, and optionally a quality
 * and octave.
 *
 * The quality and octave parameters will override the given string interval
 *
 * @param {String|Integer} interval - the interval or the interval number
 * (can be negative to express descengin intervals)
 * @param {String|Integer} quality|alteration - (Optional) the interval quality or
 * numberic alteration (0 is perfect or major). Can be null to avoid override the string
 * @param {Integer} oct - (Optional) the octaves. If negative, the direction of
 * the interval is descendent. 0 by default.
 *
 * @see interval/props
 *
 * @example
 * interval('2') // => '2M'
 * interval('2', 'm') // => '2m'
 * interval('2', 'a', 1) // => '9A'
 * interval('2', 'a', -1) // => '-9A'
 * interval('2', null, 1) // => '9M'
 * interval(-2, 'm', 1) // => '-9m'
 * interval(-2, -1, 1) // => '-9m'
 * interval(2, 'AA') // => '2AA'
 * interval(2, 'AAA') // => null
 */
function interval (i, quality, oct) {
  i = isNaN(i) ? props(i) : fromNumber(i)

  if (!i) return null
  else if (arguments.length === 1) return i.name

  var dir, q
  oct = oct === 0 || oct ? oct : i.oct
  dir = oct < 0 ? -1 : i.dir
  oct = Math.abs(oct)

  if (typeof quality === 'undefined' || quality === null) {
    q = i.quality
  } else if (/^dd|d|m|P|M|A|AA$/.test(quality)) {
    q = quality
    if (q === 'P' && i.type === 'M') return null
    else if ((q === 'M' || q === 'm') && i.type === 'P') return null
  } else {
    // try an alteration number
    q = QUALITIES[i.type][quality]
  }

  return q ? dir * (i.simple + 7 * oct) + q : null
}

function fromNumber (num) {
  var dir = num < 0 ? -1 : 1
  num = Math.abs(num)
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  return props((dir * num) + type)
}

module.exports = interval
