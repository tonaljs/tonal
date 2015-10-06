
var PITCH = /^([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(\d*)$/
var INTERVAL = /^([-+]?)(\d+)(dd|d|m|M|P|A|AA)$/
var ALTERS = {
  P: { dd: -2, d: -1, P: 0, A: 1, AA: 2 },
  M: { dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2 }
}
var INVERT = {'d': 'A', 'm': 'M', 'P': 'P', 'M': 'm', 'A': 'd'}

/**
 * Get ternary array pitch representation.
 *
 * @return {Array} an array in the form [step, alt, oct]
 */
function parse (str) {
  var m
  if ((m = PITCH.exec(str))) return pitch(m)
  if ((m = INTERVAL.exec(str))) return interval(m)
  return null
}

var cached = memoize(parse)

module.exports = function (str) {
  if (Array.isArray(str)) return str
  return cached(str)
}

function pitch (m) {
  var step = m[1].toUpperCase().charCodeAt(0) - 66
  if (step < 1) step += 7
  var alt = m[2].replace(/x/g, '##').length
  if (m[2][0] === 'b') alt *= -1
  var oct = m[3] ? +m[3] - 4 : 0
  return [step, alt, oct]
}

function interval (m) {
  var num = +m[2]
  var q = m[3]
  var simple = ((num - 1) % 7) + 1
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  if (q === 'M' && type === 'P' || q === 'P' && type !== 'P') return null

  var dir = m[1] === '-' ? -1 : 1
  var oct = Math.floor((num - 1) / 7)
  // if descending, invert direction and octave down
  if (dir === -1 && num !== 1) {
    if (simple !== 1) simple = 9 - simple
    q = INVERT[q]
    oct = -1 * oct
    if (simple !== 1) oct--
  }
  var alt = ALTERS[type][q]
  if (alt == null) return null

  return [simple, alt, oct]
}

function memoize (func) {
  var cache = {}
  return function (str) {
    return (str in cache) ? cache[str] : cache[str] = func(str)
  }
}
