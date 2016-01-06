'use strict'

/**
 * A regex for matching note strings in [helmholtz notation](https://en.wikipedia.org/wiki/Helmholtz_pitch_notation)
 *
 * @name helmholtz.regex
 * @example
 * var R = require('music-notation/helmholtz/regex')
 * R.exec('c') // =>
 */
module.exports = /^(,*)([a-hA-H])(x|#|bb|b?)([,\']*)(\/\d+|)$/
