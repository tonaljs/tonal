'use strict'

var REGEX = /^(dd|d|m|M|P|A|AA)(-?)(\d+)$/
// size in semitones to generic semitones in non altered state
// last 0 is beacuse P8 is oct = 1
var SEMITONES = [null, 0, 2, 4, 5, 7, 9, 11, 0]
// alteration values
var ALTERS = {
  P: { dd: -2, d: -1, P: 0, A: 1, AA: 2 },
  M: { dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2 }
}

/**
 * Parse an interval and get its properties
 *
 * Probably you will want to use `interval/interval` instead.
 *
 * This method retuns an object with the following properties:
 * - name: the parsed interval
 * - quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
 * augmented respectively)
 * - num: diatonic number (a positive integer bigger that 0)
 * - alter: an integer with the alteration respect to 'P' or 'M' (depending on the type)
 * - dir: direction, 1 for ascending intervals, -1 for descending ones
 * - oct: the number of octaves (a positive integer)
 * - type: the interval type. 'P' for 'perfect', 'M' for major. This is not the
 * quality of the interval, just if it is perfectable or not.
 * - semitones: the size of the interval in semitones
 *
 * @param {String} name - the name of the interval to be parsed
 * @return {Array} a interval object or null if not a valid interval
 *
 * @name parse
 * @module interval
 * @see interval/interval
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
  if (num === 0) return null

  var q = m[1]
  var dir = m[2] === '' ? 1 : -1
  var simple = num > 8 ? (num % 7 || 7) : num
  var type = (simple === 1 || simple === 4 || simple === 5 || simple === 8) ? 'P' : 'M'
  if (q === 'M' && type === 'P' || q === 'P' && type !== 'P') return null
  var alt = ALTERS[type][q]
  if (alt == null) return null
  var oct = Math.floor((num - 1) / 7)
  var semitones = dir * ((SEMITONES[simple] + alt) + 12 * oct)

  return { name: m[0], quality: q, dir: dir, num: num, simple: simple,
    perfectable: type === 'P', oct: oct, alter: alt,
    semitones: semitones, type: type }
}

var memoize = require('../utils/fastMemoize')
var coerce = require('../utils/coerceParam')
module.exports = coerce('name', memoize(parse))
