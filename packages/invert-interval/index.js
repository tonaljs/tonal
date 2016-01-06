'use strict'

var parse = require('array-notation/interval/parse')
var str = require('array-notation/interval/str')
var op = require('array-notation/operation')

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
