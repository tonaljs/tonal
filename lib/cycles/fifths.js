'use strict'

var ASC = 'C G D A E B F# C# G# D# A# E#'.split(' ')
var DESC = 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb'.split(' ')
/**
 * Get the relation between a note and the number of steps in the
 * cycle of fifths (with root in C)
 *
 * @param {Integer|String} step - if it's an integer, returns the note step after
 * moving `step` steps in the cycle. If it's a step string, returns the number
 * of steps starting from 'C' to the given step
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
 * cycle('C2') // => undefined
 */
function fifths (step) {
  if (/^\d+$/.test(step)) {
    return ASC[+step % 12]
  } else if (/^-\d+$/.test(step)) {
    return DESC[Math.abs(+step) % 12]
  } else if (typeof step === 'string') {
    var index = ASC.indexOf(step)
    if (index > 0) {
      return index
    } else {
      index = DESC.indexOf(step)
      return index < 0 ? undefined : -1 * index
    }
  }
}

module.exports = fifths
