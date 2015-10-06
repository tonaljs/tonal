var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAA']
}
var INVERT = {'d': 'A', 'm': 'M', 'P': 'P', 'M': 'm', 'A': 'd'}

/**
 * Get the interval string from a pitch array
 *
 * @param {Array} ternary - the pitch ternary array representation
 * @return {String} the pitch represented as an interval
 */
function intervalStr (t) {
  var type = t[0] === 1 || t[0] === 4 || t[0] === 5 ? 'P' : 'M'
  var num = t[0]
  var q = ALTER[type][t[1] + 4]
  if (t[2] < 0) {
    var oct = t[2] + 1
    num = num - 9
    return (num + 7 * oct) + INVERT[q]
  } else {
    return (num + 7 * t[2]) + q
  }
}

module.exports = intervalStr
