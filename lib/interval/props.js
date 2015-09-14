'use strict'

var REGEX = /^([-+]?)(\d+)(dd|d|m|M|P|A|AA)$/
// size in semitones to generic semitones in non altered state
// last 0 is beacuse 8P is oct = 1
var SEMITONES = [null, 0, 2, 4, 5, 7, 9, 11, 0]
// alteration values
var ALTERS = {
  P: { dd: -2, d: -1, P: 0, A: 1, AA: 2 },
  M: { dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2 }
}

/**
 * Get interval properties
 *
 * Probably you will want to use `interval/build` instead.
 *
 * This method retuns an object with the following properties:
 * - name: the interval name
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
 * @param {String} name - the name of the interval to be propsd
 * @return {Array} a interval object or null if not a valid interval
 *
 * @name props
 * @module interval
 * @see interval/build
 *
 * @example
 * var props = require('tonal/interval/props')
 * props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
 * props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
 */
function props (interval) {
  var m = REGEX.exec(interval)
  if (!m) return null // not valid interval

  var num = +m[2]
  if (num === 0) return null

  var q = m[3]
  var dir = m[1] === '-' ? -1 : 1
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
module.exports = coerce('name', memoize(props))
