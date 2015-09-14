var props = require('./props')

var QUALITIES = {
  P: {'-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA'},
  M: {'-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA'}
}

/**
 * Get an interval properties from a string or a number, and optionally a quality
 * and octave.
 *
 * The quality and octave parameters will have precedence over the string interval
 *
 * @param {String|Integer} interval - the interval or the interval number
 * (can be negative to express descengin intervals)
 * @param {String|Integer} quality - (Optional) the interval quality or
 * numberic alteration (0 is perfect or major). Can be null to avoid override the string
 * @param {Integer} oct - (Optional) the octaves
 *
 * @see interval/props
 *
 * @example
 * interval('2') // => '2M'
 * interval('2', 'm') // => '2m'
 * interval('2', 'a', 1) // => '9A'
 * interval('2', null, 1) // => '9M'
 * interval(-2, 'm', 1) // => '-9m'
 * interval(-2, -1, 1) // => '-9m'
 * interval('2AA') // => '2AA'
 * interval('2AAA') // => null
 */
function interval (i, alter, oct) {
  i = isNaN(i) ? props(i) : fromNumber(i)

  if (!i) return null
  else if (arguments.length === 1) return i.name

  alter = alter === 0 || alter ? alter : i.alter
  oct = oct === 0 || oct ? oct : i.oct
  var q = QUALITIES[i.type][alter]
  return q ? i.dir * (i.simple + 7 * oct) + q : null
}

function fromNumber (num) {
  var dir = num < 0 ? -1 : 1
  num = Math.abs(num)
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  return props((dir * num) + type)
}

module.exports = interval
