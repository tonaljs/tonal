
var step = require('./step')
var alteration = require('./alteration')

var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/**
 * Get the [pitch class](https://en.wikipedia.org/wiki/Pitch_class#Integer_notation)
 * of the note
 *
 * The pitch class is an integer value of the pitch where C=0, C#=1, D=2...B=11
 *
 * @example
 * pitchClass('C2') // => 0
 * pitchClass('C3') // => 0
 * pitchClass('C#') // => 1
 * pitchClass('Db') // => 1
 */
function pitchClass (note) {
  return SEMITONES[step(note)] + alteration(note)
}
module.exports = pitchClass
