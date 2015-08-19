var REGEX = /^([mMP]|[dA]+)(-?)(\d+)$/

/**
 * Parse an interval and get its properties
 *
 * This method retuns an object with the following properties:
 * - interval: the parsed interval
 * - quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
 * augmented respectively)
 * - dir: direction, 1 for ascending intervals, -1 for descending ones
 * - num: diatonic number (a positive integer bigger that 0)
 * - generic: generic interval (https://en.wikipedia.org/wiki/Generic_interval), an
 * integer between (0 and 6)
 * - oct: the number of octaves (a positive integer)
 * - perfectable: true if the interval is perfectable
 * - alter: an integer with the alteration respect to the cannonical.
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
  if (interval.interval) return parse(interval.interval)
  var m = REGEX.exec(interval)
  if (!m) return null // not valid interval

  var i = { interval: m[0] }
  i.quality = m[1]
  i.dir = m[2] === '' ? 1 : -1
  i.num = +m[3]
  i.generic = (i.num - 1) % 7
  i.perfectable = i.generic === 0 || i.generic === 3 || i.generic === 4
  i.oct = Math.floor((i.num - 1) / 7)

  var q = i.quality[0]
  if (i.perfectable) { // perfectable
    if (q === 'M') return null // not valid major interval
    else if (q === 'P') i.alter = 0
    else if (q === 'd') i.alter = -i.quality.length
    else if (q === 'A') i.alter = i.quality.length
  } else { // not perfectable
    if (q === 'P') return null // not valid perfect interval
    else if (q === 'M') i.alter = 0
    else if (q === 'm') i.alter = -1
    else if (q === 'd') i.alter = -i.quality.length - 1
    else if (q === 'A') i.alter = i.quality.length
  }

  return i
}

module.exports = parse
