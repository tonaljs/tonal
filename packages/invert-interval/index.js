'use strict'

var parse = require('music-notation/interval/parse')
var str = require('music-notation/interval/str')
var op = require('music-notation/operation')

/**
 * Get the inversion of an interval
 *
 * @param {String|Array} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String|Array} the inverted interval
 *
 * @example
 */
module.exports = op(parse, str, function (i) {
})
