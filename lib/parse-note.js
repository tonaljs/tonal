'use strict'

module.exports = Note

var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{0,1})$/

function Note (name) {
  if (!(this instanceof Note)) {
    return name instanceof Note ? name : new Note(name)
  }

  var match = NOTE.exec(name)
  if (!match) throw Error('Invalid note name: ' + name)

  this.pc = match[1].toUpperCase()
  this.acc = match[2]
  this.oct = match[3] ? +match[3] : 4
  this.name = this.pc + this.acc + this.oct
}
