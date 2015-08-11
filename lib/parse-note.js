'use strict'

module.exports = parseNote

var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{0,1})$/

/**
 * Parse a note string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The octave in the note string is optional, and this parse method returns an
 * object with the following properties:
 * - `pc`: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class). __Always
 * in uppercase__. One of 'A', 'B', 'C', 'D', 'E', 'F', 'G'
 * - `acc`: the accidentals. A string of 'b' or '#'. Double sharp is notated
 * with '##'. If the note has no accidentals, the value is an empty string (never null).
 * - `oct`: the octave (as integer, can be negative). If no octave is present in
 * the string to be parsed, it is set to 4.
 *
 * If the string is not a valid note, an exception is thrown
 *
 * @param {String} note - the note string to be parsed
 * @return {Object} the note object
 *
 * @example
 * var parse = require('tonal/parse-note')
 * parse('db2') // => { pc: 'D', acc: 'b', oct: 2 }
 * parse('b#3') // => { pc: 'B', acc: '#', oct: 3 }
 * parse('c') // => { pc: 'C', acc: '', oct: 4 }
 */
function parseNote (name) {
  if (!(this instanceof parseNote)) {
    return name instanceof parseNote ? name : new parseNote(name)
  }

  var match = NOTE.exec(name)
  if (!match) throw Error('Invalid note name: ' + name)

  this.pc = match[1].toUpperCase()
  this.acc = match[2]
  this.oct = match[3] ? +match[3] : 4
}
