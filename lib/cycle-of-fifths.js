'use strict'

var ASC = 'C G D A E B F# C# G# D# A# E#'.split(' ')
var DESC = 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb'.split(' ')
/**
 * Get the relation between a note and the number of steps in the cycle of fifths
 *
 * @param {Integer|String} value - if a integer is given, return the note name
 * moving value steps in the cycle. If a note name is given, it returns the number
 * of steps
 * @return {String|Integer} - the note name or the number of steps (depending of the param)
 *
 * @example
 * var cycle = require('tonal/cycle-of-fifths')
 * cycle(0) // => 'C'
 * cycle(1) // => 'G'
 * cycle(-1) // => 'F'
 * cycle('C') // => 0
 * cycle('G') // => 1
 * cycle('F') // => -1
 */
function cycleOfFifths (value) {
  if (/^\d+$/.test(value)) {
    return ASC[+value % 12]
  } else if (/^-\d+$/.test(value)) {
    return DESC[Math.abs(+value) % 12]
  } else if (typeof value === 'string') {
    var index = ASC.indexOf(value)
    if (index < 0) {
      index = DESC.indexOf(value)
      return index < 0 ? undefined : -1 * index
    } else {
      return index
    }
  }
}

module.exports = cycleOfFifths
