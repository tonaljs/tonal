var parse = require('./parse')

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
 * interval(1) // => 'P1'
 * interval(1, 1) // => 'A1'
 * interval(1, 1, 2) // => 'A8'
 * interval(1, 1, 2, -1) // => 'A-8'
 * interval(2, -1, 2, -1) // => 'm-9'
 */
function interval (num, alter, oct, dir) {
  if (isNaN(num)) {
    var i = parse(num)
    alter = isNaN(alter) ? i.alter : alter
    oct = isNaN(oct) ? i.oct : oct
    dir = isNaN(dir) ? i.dir : dir
    q = QUALITIES[i.type][alter] || i.quality
    return q ? parse(q + dir * (i.num + 7 * oct)) : null
  } else {
    if (num === 0) throw Error('0 is not a valid interval number.')
    var simple = num > 8 ? (num % 7 || 7) : num
    var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
    alter = alter || 0
    oct = oct || 0
    dir = dir ? -1 : 1
    var q = QUALITIES[type][alter]
    return q ? parse(q + dir * (num + 7 * oct)) : null
  }
}


module.exports = interval

function quality (perfectable, alter) {
  if (perfectable) {
    if (alter > 0) return Array(alter + 1).join('A')
    else if (alter < 0) return Array(-alter + 1).join('d')
    else return 'P'
  } else {
    if (alter > 0) return Array(alter + 1).join('A')
    else if (alter < -1) return Array(-alter).join('d')
    else if (alter === -1) return 'm'
    else return 'M'
  }
}
