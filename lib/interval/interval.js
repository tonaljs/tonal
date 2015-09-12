var props = require('./props')

var QUALITIES = {
  P: {'-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA'},
  M: {'-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA'}
}

/**
 * Get an interval properties from a name and optional an octave, alteration
 * and direction
 *
 * This is the same as `interval/props` but with the possibility of build a
 * new intervals based on a given one
 *
 * @param {String|Integer} interval - the interval or the interval number
 * (can be negative to express descengin intervals)
 * @param {Integer} alter - (Optional) the interval alteration (0 is perfect or major)
 * @param {Integer} oct - (Optional) the octaves, 0 by default
 *
 * @see interval/props
 *
 * @example
 * interval('M2') // => { name: 'M2', ... }
 * interval('M2', 1) // => { name: 'A2', ... }
 * interval(1) // => { name: 'P1', ... }
 * interval(1, 1) // => { name: 'A1', ... }
 * interval(1, 1, 2) // => { name: 'A8', ... }
 * interval(-1, 1, 2) // => { name: 'A-8', ... }
 * interval(-2, -1, 2) // => { name: 'm-9', ... }
 */
function interval (i, oct, alter) {
  i = isNaN(i) ? props(i) : build(i)
  if (!i) return null
  if (arguments.length === 1 && i.name) return i
  alter = alter === 0 || alter ? alter : i.alter
  oct = oct === 0 || oct ? oct : i.oct
  var q = QUALITIES[i.type][alter]
  return q ? props(i.dir * (i.simple + 7 * oct) + q) : null
}

function build (num) {
  var dir = num < 0 ? -1 : 1
  num = Math.abs(num)
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  return props((dir * num) + type)
}

module.exports = interval
