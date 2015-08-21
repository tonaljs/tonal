var toGeneric = require('./generic')

/**
 * Create a interval from its components
 */
function interval (num, alter, oct, dir) {
  var generic = toGeneric(num)
  if (!generic) throw Error('0 is not a valid interval number.')
  alter = alter || 0
  oct = oct || 0
  dir = dir || 1

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
