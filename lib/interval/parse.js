var generic = require('./generic')
var REGEX = /^([mMP]|[dA]+)(-?)(\d+)$/
// size in semitones to generic semitones in non altered state
var SEMITONES = [0, 2, 4, 5, 7, 9, 11]

/**
 * Parse an interval and get its properties
 *
 * This method retuns an object with the following properties:
 * - name: the parsed interval
 * - quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
 * augmented respectively)
 * - dir: direction, 1 for ascending intervals, -1 for descending ones
 * - num: diatonic number (a positive integer bigger that 0)
 * - generic: generic interval (https://en.wikipedia.org/wiki/Generic_interval), an
 * integer between (0 and 6)
 * - oct: the number of octaves (a positive integer)
 * - perfectable: true if the interval is perfectable
 * - alter: an integer with the alteration respect to the cannonical.
 * - semitones: the size of the interval in semitones
 * For perfectable intervals is 'P': 0, 'd': -1, 'A': +1 and for
 * non perfectable intervals is 'M': 0, 'm', -1, 'd': -2, 'A': +1
 *
 * @param {String} name - the name of the interval to be parsed
 * @return {Array} a interval object or null if not a valid interval
 *
 * @example
 * var parse = require('tonal/interval/parse')
 * parse('P-5') // => {quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
 * parse('m9') // => {quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
 */
function parse (interval) {
  var m = REGEX.exec(interval)
  if (!m) return null // not valid interval

  var num = +m[3]
  var q = m[1]
  var dir = m[2] === '' ? 1 : -1
  var simple = num > 8 ? (num % 7 || 7) : num
  var g = generic(num)
  if (!g) return null // 0 can't be the num
  if (q === 'M' && g.perfectable) return null
  if (q === 'P' && !g.perfectable) return null
  var alt = alter(q, g.perfectable)
  var oct = Math.floor((num - 1) / 7)
  var s = dir * ((SEMITONES[g.num] + alt) + 12 * oct)

  return { name: m[0], quality: q, dir: dir, num: num, simple: simple,
    generic: g.num, perfectable: g.perfectable, oct: oct, alter: alt,
    semitones: s, type: g.perfectable ? 'P' : 'M' }
}

function alter (quality, perfectable) {
  var q = quality[0]
  if (perfectable) { // perfectable
    if (q === 'P') return 0
    else if (q === 'd') return -quality.length
    else if (q === 'A') return quality.length
  } else { // not perfectable
    if (q === 'M') return 0
    else if (q === 'm') return -1
    else if (q === 'd') return -quality.length - 1
    else if (q === 'A') return quality.length
  }
}

var memoize = require('../utils/fastMemoize')
var coerce = require('../utils/coerceParam')
module.exports = coerce('name', memoize(parse))
