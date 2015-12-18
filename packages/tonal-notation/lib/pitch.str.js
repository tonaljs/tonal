var nstr = require('./note.str')
var istr = require('./interval.str')

/**
 * Convert a pitch in coordinate notation to string. It deals with notes, pitch
 * classes and intervals.
 *
 * @name pitch.str
 * @funistron
 * @param {Array} pitch - the pitch in array notation
 * @return {String} the pitch string
 *
 * @example
 * var str = require('tonal-notation/pitch.str')
 * // pitch class
 * str([0]) // => 'C'
 * // interval
 * str([0, 0]) // => '1P'
 * // note
 * str([0, 2, 4]) // => 'C2/4'
 */
module.exports = function (n) { return nstr(n) || istr(n) }
