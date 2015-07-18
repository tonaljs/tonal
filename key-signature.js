'use strict'

var cycle = require('./cycle-of-fifths')

module.exports = KeySignature

function KeySignature (value) {
  if (!(this instanceof KeySignature)) return new KeySignature(value)

  if (typeof value === 'string') {
    this.major = value
    this.number = cycle.indexOf(this.major)
  } else {
    this.number = +value
    this.major = cycle(this.number)
  }
  var type = this.number > 0 ? '#' : 'b'
  this.signature = Array(Math.abs(this.number) + 1).join(type)
  this.minor = cycle(this.number + 3)
}

KeySignature.prototype.alterations = function () {
  return this.number < 0 ?
    cycle(2, Math.abs(this.number), true) :
    cycle(-1, Math.abs(this.number)).map(function (name) {
      return name + '#'
    })
}
