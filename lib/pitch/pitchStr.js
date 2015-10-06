var ALTERS = ['bbbb', 'bbb', 'bb', 'b', '', '#', '##', '###', '####']
var LETTERS = [null, 'C', 'D', 'E', 'F', 'G', 'A', 'B']

/**
 * Get a pitch (in scientific notation) from a ternary pitch array
 *
 * @name pitchStr
 * @param {Array} pitch - pitch array ([letter, accientals, octave])
 * @return {String} the pitch in scientific notation
 *
 * @example
 * toPitch([1, 0, 0]) // => 'C4'
 * toPitch([1, 1, 0]) // => 'C#4'
 * toPitch([1, 2, 1]) // => 'C##5'
 * toPitch([1, -1, -1]) // => 'Cb3'
 * toPitch([1, -1, -2]) // => 'Cb2'
 * toPitch([2, 0, -2]) // => 'D2'
 */
module.exports = function (pitch, pitchClass) {
  var letter = LETTERS[pitch[0]]
  if (!letter) return null
  var alter = ALTERS[pitch[1] + 4]
  if (typeof alter === 'undefined') return null
  return pitchClass ? letter + alter : letter + alter + (pitch[2] + 4)
}
