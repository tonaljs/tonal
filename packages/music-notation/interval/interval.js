'use strict'

var parse = require('./parse')
var str = require('./str')

/**
 * Get a interval from a string (or null if not valid interval)
 *
 * @name interval
 * @function
 * @param {String} src - the source
 * @return {String} the interval in short notation
 *
 * @example
 * interval = require('music-notation/interval/interval')
 * interval('2M') // => '2M'
 * interval('2') // => '2M'
 * interval('2m') // => '2m'
 * interval('2b') // => '2m'
 * interval('C') // => null
 */
module.exports = function (n) { return str(parse(n)) }
