'use strict'

var SHARP = 'C G D A E B F# C# G# D# A# E# B#'.split(' ')
var FLAT = 'C F Bb Eb Ab Db Gb Cb Fb'.split(' ')

module.exports = KeySignature

function KeySignature (value) {
  if (!(this instanceof KeySignature)) return new KeySignature(value)

  if (typeof value === 'string') {
    this.major = value
    this.number = SHARP.indexOf(this.major)
    if (this.number < 0) this.number = -1 * FLAT.indexOf(this.major)
  } else {
    this.number = +value
    if (this.number >= 0) this.major = SHARP[this.number]
    else if (this.number < 0) this.major = FLAT[-this.number]
  }
  var type = this.number > 0 ? '#' : 'b'
  this.alterations = Array(Math.abs(this.number) + 1).join(type)
}
