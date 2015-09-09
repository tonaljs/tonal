var props = require('./props')

var QUALITIES = {
  P: {'-2': 'dd', '-1': 'd', 0: 'P', 1: 'A', 2: 'AA'},
  M: {'-3': 'dd', '-2': 'd', '-1': 'm', 0: 'M', 1: 'A', 2: 'AA'}
}

/**
 * Create a interval from its components
 *
 * @param {Integer} num - the interval number
 * @param {Integer} alter - the interval alteration (0 is perfect or major)
 * @param {Integer} oct - (Optional) the octaves, 0 by default
 * @param {boolean} descending - (Optional) create a descending interval (false
 * by default)
 *
 * @example
 * interval('M2') // => 'M2'
 * interval('M2', 1) // => 'A2'
 * interval(1) // => 'P1'
 * interval(1, 1) // => 'A1'
 * interval(1, 1, 2) // => 'A8'
 * interval(1, 1, 2, -1) // => 'A-8'
 * interval(2, -1, 2, -1) // => 'm-9'
 */
function interval (i, oct, alter, dir) {
  i = isNaN(i) ? props(i) : build(i)
  if (arguments.length === 1 && i.name) return i
  alter = alter === 0 || alter ? alter : i.alter
  oct = oct === 0 || oct ? oct : i.oct
  dir = dir ? -1 : i.dir
  var q = QUALITIES[i.type][alter]
  return q ? props(q + dir * (i.simple + 7 * oct)) : null
}

function build (num) {
  if (num === 0) throw Error('0 is not a valid interval number.')
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  return props(type + num)
}

module.exports = interval
