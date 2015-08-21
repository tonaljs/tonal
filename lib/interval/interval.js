var toGeneric = require('./generic')

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
  var generic = toGeneric(num)
  if (!generic) throw Error('0 is not a valid interval number.')
  alter = alter || 0
  oct = oct || 0
  dir = dir ? -1 : 1

  var q = quality(generic.perfectable, alter)
  return q + dir * (num + 7 * oct)
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
