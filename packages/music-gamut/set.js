'use strict'

var operation = require('./operation')
var sort = require('./sort')

function simplify (p) {
  return p.length === 2 ? [p[0], -Math.floor(p[0] * 7 / 12)] : [p[0]]
}

/**
 * Create a set: a set is a list of uniq pitch classes or simplified intervals
 * in ascending pitch order
 *
 * @name gamut.set
 * @function
 * @param {String|Array} notes - the note list
 * @return {String|Array} the set
 *
 * @example
 * var set = require('tonal.gamut/set')
 * set('E7 C2 e D5 c1') // => ['C', 'D', 'E']
 * set('11 10 9') // => [ '2M', '3M', '4P' ]
 */
module.exports = operation(function (notes) {
  var sorted = sort(notes.map(simplify))
  return sorted.reduce(function (uniq, value, index) {
    if (index === 0 || !equal(sorted[index - 1], value)) uniq.push(value)
    return uniq
  }, [])
})

function equal (a, b) {
  return a[0] === b[0] && a[1] === b[1]
}
