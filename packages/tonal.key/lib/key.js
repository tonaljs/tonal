'use strict'

var parse = require('./parse')
var transpose = require('note-transpose')
var REGEX = /^#{1,7}|b{1,7}$/

/**
 * Create a key from a string. A key is a string with a tonic and a mode
 *
 * @name key
 * @function
 *
 * @example
 * key('C major') // => 'C major'
 * key('c Major') // => 'C major'
 * key('C') // => 'C major'
 * key('dbb miXolydian') // => 'Dbb mixolydian'
 */
module.exports = function (str) {
  if (/^-?\d$/.exec(str)) {
    return major(+str)
  } else if (REGEX.exec(str)) {
    var dir = str[0] === 'b' ? -1 : 1
    return major(str.length * dir)
  } else {
    var p = parse(str)
    return p ? p.tonic + ' ' + p.mode : null
  }
}

function major (n) { return transpose('C', [n, 0]) + ' major' }
