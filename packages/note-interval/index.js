var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var notation = require('music-notation/operation')(parse, str)

/**
 * Get the interval between two pitches
 *
 * If one or both are pitch classes, a simple ascending interval is returned
 *
 * This function can be partially applied (see examples)
 *
 * @name note.interval
 * @function
 * @param {String} from - the first note
 * @param {String} to - the second note
 * @return {String} the interval between them
 *
 * @example
 * var interval = require('note-interval')
 * interval('C2', 'D3') // => '9M'
 * interval('D2', 'C2') // => '-2M'
 * interval('D', 'C') // => '7m'
 *
 * @example
 * // partially applied
 * var fromC = interval('C')
 * fromC('D') // => '2M'
 */
module.exports = notation(function (a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return null
  if (a.length === 1 || b.length === 1) {
    var base = b[0] - a[0]
    return [base, -Math.floor(base * 7 / 12)]
  }
  return [b[0] - a[0], b[1] - a[1]]
})
