'use strict'

function curry (fn, arity) {
  if (arity === 1) return fn
  return function (a, b) {
    if (arguments.length === 1) return function (c) { return fn(a, c) }
    return fn(a, b)
  }
}

/**
 * Decoration a function that works with intervals, notes or pitches. It allows
 * the decorated function to work with array notation with independence of its
 * string representation.
 *
 * This is the base of the pluggable notation system of tonal.
 *
 * @name operation
 * @function
 * @param {Function} parse - the parser
 * @param {Function} str - the string builder
 * @param {Function} op - the operation to decorate
 *
 * @example
 * var operation = require('tonal-notation/operation')
 * var parse = require('tonal-notation/interval.parse')
 * var str = require('tonal-notation/interval.str')
 * var add = operation(parse, str, function(a, b) {
 *   return [a[0] + b[0], a[1] + b[1]]
 * })
 * add('3m', '3M') // => '5P'
 */
module.exports = function (parse, str, fn) {
  return curry(function (a, b) {
    var ac = parse(a)
    var bc = parse(b)
    if (!ac && !bc) return fn(a, b)
    var v = fn(ac || a, bc || b)
    return str(v) || v
  }, fn.length)
}
